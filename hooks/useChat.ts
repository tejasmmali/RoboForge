"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { demoConversations, suggestedPrompts } from "@/lib/chat-data";
import {
  createConversation,
  deleteConversation,
  listConversations,
  loadConversationMessages,
  saveMessage,
  toggleMessageBookmark,
  updateMessageFeedback,
} from "@/lib/db/chat";
import {
  downloadTextFile,
  exportConversationAsMarkdown,
  streamChatMessage,
} from "@/services/chatService";
import type {
  ChatError,
  ChatSettings,
  GeminiMessage,
  QuickCategory,
  SendMessageOptions,
} from "@/types/chat";
import type { ChatMessage, Conversation } from "@/types/message";
import type { ProjectChatContext } from "@/types/project";

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function titleFromMessage(content: string) {
  const trimmed = content.trim();
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed;
}

function toGeminiMessages(messages: ChatMessage[]): GeminiMessage[] {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .filter((m) => !m.isError && m.content.trim())
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));
}

const DEFAULT_SETTINGS: ChatSettings = {
  temperature: 0.7,
  responseLength: "balanced",
};

export type UseChatOptions = {
  projectContext?: ProjectChatContext;
  initialConversationId?: string | null;
  isolated?: boolean;
};

export function useChat(options: UseChatOptions = {}) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(
    options.isolated ? [] : demoConversations,
  );
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(
    options.isolated
      ? null
      : (options.initialConversationId ?? "conv-1"),
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const abortRef = useRef<AbortController | null>(null);
  const projectContext = options.projectContext;

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ?? null;

  const loadHistory = useCallback(async () => {
    if (!user || options.isolated) return;
    setIsLoadingHistory(true);
    try {
      const rows = await listConversations(user.id);
      setConversations(rows);
      setActiveConversationId(rows[0]?.id ?? null);
    } catch {
      // Fallback to demo data when Supabase is unavailable
    } finally {
      setIsLoadingHistory(false);
    }
  }, [options.isolated, user]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const selectConversation = useCallback(
    async (id: string) => {
      setActiveConversationId(id);
      setError(null);

      if (!user) return;

      const conv = conversations.find((c) => c.id === id);
      if (conv && conv.messages.length > 0) return;

      try {
        const messages = await loadConversationMessages(id, user.id);
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, messages } : c)),
        );
      } catch {
        // ignore if not persisted
      }
    },
    [conversations, user],
  );

  const newChat = useCallback(() => {
    const id = generateId("conv");
    const conversation: Conversation = {
      id,
      title: "New Chat",
      preview: "Start a new conversation…",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      projectSlug: projectContext?.projectSlug,
      messages: [],
    };
    setConversations((prev) => [conversation, ...prev]);
    setActiveConversationId(id);
    setError(null);
  }, [projectContext?.projectSlug]);

  const deleteChat = useCallback(
    async (id: string) => {
      if (user) {
        try {
          await deleteConversation(id, user.id);
        } catch {
          // local delete still works
        }
      }
      setConversations((prev) => prev.filter((c) => c.id !== id));
      setActiveConversationId((current) => (current === id ? null : current));
    },
    [user],
  );

  const clearChats = useCallback(() => {
    setConversations([]);
    setActiveConversationId(null);
    setError(null);
  }, []);

  const stopGenerating = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const finalizeAssistantMessage = useCallback(
    (
      conversationId: string,
      messageId: string,
      content: string,
      isError = false,
    ) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                preview: content.slice(0, 120),
                updatedAt: new Date().toISOString(),
                messages: conv.messages.map((m) =>
                  m.id === messageId
                    ? { ...m, content, isStreaming: false, isError }
                    : m,
                ),
              }
            : conv,
        ),
      );
    },
    [],
  );

  const sendMessage = useCallback(
    async (content: string, opts: SendMessageOptions = {}) => {
      const trimmed = sanitizeInput(content);
      if (!trimmed && !(opts.images?.length)) return;

      let conversationId = opts.conversationId ?? activeConversationId;

      if (!conversationId) {
        conversationId = generateId("conv");
        const newConversation: Conversation = {
          id: conversationId,
          title: titleFromMessage(trimmed || "Image upload"),
          preview: trimmed,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          category: opts.category,
          projectSlug: projectContext?.projectSlug,
          messages: [],
        };
        setConversations((prev) => [newConversation, ...prev]);
        setActiveConversationId(conversationId);

        if (user) {
          try {
            const saved = await createConversation(user.id, {
              title: newConversation.title,
              preview: newConversation.preview,
              projectSlug: projectContext?.projectSlug,
              category: opts.category,
            });
            conversationId = saved.id;
            setActiveConversationId(saved.id);
            setConversations((prev) =>
              prev.map((c) =>
                c.id === newConversation.id ? { ...c, id: saved.id } : c,
              ),
            );
          } catch {
            // continue with local id
          }
        }
      }

      let messagesForApi: ChatMessage[] = [];
      const existingConv = conversations.find((c) => c.id === conversationId);

      if (opts.regenerate && existingConv) {
        messagesForApi = [...existingConv.messages];
        while (
          messagesForApi.length > 0 &&
          messagesForApi[messagesForApi.length - 1]?.role === "assistant"
        ) {
          messagesForApi.pop();
        }
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? { ...conv, messages: messagesForApi }
              : conv,
          ),
        );
      } else {
        const userMessage: ChatMessage = {
          id: generateId("msg"),
          role: "user",
          content: trimmed,
          createdAt: new Date().toISOString(),
          images: opts.images,
        };

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id !== conversationId) return conv;
            const isFirst = conv.messages.length === 0;
            messagesForApi = [...conv.messages, userMessage];
            return {
              ...conv,
              title: isFirst ? titleFromMessage(trimmed) : conv.title,
              preview: trimmed,
              updatedAt: userMessage.createdAt,
              category: opts.category ?? conv.category,
              messages: messagesForApi,
            };
          }),
        );

        if (user && conversationId) {
          void saveMessage(user.id, {
            conversationId,
            role: "user",
            content: trimmed,
            images: opts.images,
          }).catch(() => undefined);
        }
      }

      const assistantId = generateId("msg");
      const assistantPlaceholder: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        isStreaming: true,
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, assistantPlaceholder] }
            : conv,
        ),
      );

      setIsStreaming(true);
      setError(null);
      abortRef.current = new AbortController();

      const apiMessages = toGeminiMessages(
        opts.regenerate ? messagesForApi : [...messagesForApi],
      );

      const { text, error: streamError } = await streamChatMessage(
        {
          messages: apiMessages,
          projectContext,
          settings,
          stream: true,
        },
        {
          signal: abortRef.current.signal,
          onChunk: (chunk) => {
            setConversations((prev) =>
              prev.map((conv) => {
                if (conv.id !== conversationId) return conv;
                return {
                  ...conv,
                  messages: conv.messages.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + chunk, isStreaming: true }
                      : m,
                  ),
                };
              }),
            );
          },
        },
      );

      abortRef.current = null;
      setIsStreaming(false);

      if (streamError) {
        setError(streamError);
        finalizeAssistantMessage(
          conversationId,
          assistantId,
          formatErrorContent(streamError),
          true,
        );
        return;
      }

      finalizeAssistantMessage(conversationId, assistantId, text);

      if (user && conversationId) {
        void saveMessage(user.id, {
          conversationId,
          role: "assistant",
          content: text,
        }).catch(() => undefined);
      }
    },
    [
      activeConversationId,
      conversations,
      finalizeAssistantMessage,
      projectContext,
      settings,
      user,
    ],
  );

  const regenerateLastResponse = useCallback(() => {
    if (!activeConversationId || isStreaming) return;
    void sendMessage("", { regenerate: true, conversationId: activeConversationId });
  }, [activeConversationId, isStreaming, sendMessage]);

  const setMessageFeedback = useCallback(
    (messageId: string, feedback: "like" | "dislike" | null) => {
      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          messages: conv.messages.map((m) =>
            m.id === messageId ? { ...m, feedback } : m,
          ),
        })),
      );
      if (user) {
        void updateMessageFeedback(messageId, user.id, feedback).catch(
          () => undefined,
        );
      }
    },
    [user],
  );

  const toggleBookmark = useCallback(
    (messageId: string) => {
      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          messages: conv.messages.map((m) =>
            m.id === messageId ? { ...m, bookmarked: !m.bookmarked } : m,
          ),
        })),
      );
      if (user) {
        const msg = conversations
          .flatMap((c) => c.messages)
          .find((m) => m.id === messageId);
        void toggleMessageBookmark(
          messageId,
          user.id,
          !msg?.bookmarked,
        ).catch(() => undefined);
      }
    },
    [conversations, user],
  );

  const exportChat = useCallback(() => {
    if (!activeConversation) return;
    const md = exportConversationAsMarkdown(
      activeConversation.title,
      activeConversation.messages,
    );
    downloadTextFile(
      `${activeConversation.title.replace(/\s+/g, "-").toLowerCase()}.md`,
      md,
    );
  }, [activeConversation]);

  const resetConversation = useCallback(() => {
    if (!activeConversationId) return;
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversationId ? { ...conv, messages: [] } : conv,
      ),
    );
    setError(null);
  }, [activeConversationId]);

  const suggestions = useMemo(
    () =>
      projectContext
        ? [
            projectContext.currentStep
              ? `Explain step ${projectContext.currentStep.number}: ${projectContext.currentStep.title}`
              : "Explain this code",
            "Debug this wiring",
            "Recommend another sensor",
            "Find common mistakes",
            "Optimize this project",
          ]
        : suggestedPrompts.map((p) => p.prompt),
    [projectContext],
  );

  return {
    conversations,
    activeConversation,
    activeConversationId,
    isStreaming,
    isTyping: isStreaming,
    isLoadingHistory,
    error,
    settings,
    setSettings,
    suggestions,
    newChat,
    selectConversation,
    deleteChat,
    sendMessage,
    stopGenerating,
    regenerateLastResponse,
    setMessageFeedback,
    toggleBookmark,
    exportChat,
    resetConversation,
    clearChats,
  };
}

function sanitizeInput(input: string) {
  return input.trim().slice(0, 4000);
}

function formatErrorContent(error: ChatError) {
  const titles: Record<ChatError["code"], string> = {
    network: "Connection lost",
    rate_limit: "Rate limit reached",
    invalid_key: "Configuration error",
    server: "Server error",
    empty: "Empty response",
    unknown: "Something went wrong",
  };

  return `**${titles[error.code]}**\n\n${error.message}\n\nTry again or check your connection.`;
}
