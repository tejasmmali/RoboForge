"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import {
  formatErrorContent,
  generateId,
  isUuid,
  sanitizeInput,
  titleFromMessage,
  toGeminiMessages,
} from "@/lib/chat/helpers";
import { buildGlobalRouteContext, getRouteMeta } from "@/lib/chat/route-context";
import {
  createConversation,
  deleteConversation,
  getUserMemoryContext,
  listConversations,
  loadConversationMessages,
  saveMessage,
  toggleMessageBookmark,
  updateMessageFeedback,
} from "@/lib/db/chat";
import {
  downloadTextFile,
  exportConversationAsMarkdown,
  fetchChatQuota,
  streamChatMessage,
} from "@/services/chatService";
import type {
  ChatError,
  ChatQuotaStatus,
  ChatSettings,
  GlobalRouteContext,
  SendMessageOptions,
} from "@/types/chat";
import type { ChatMessage, Conversation } from "@/types/message";
import type { ChatMemoryContext, ProjectChatContext } from "@/types/project";

const DEFAULT_SETTINGS: ChatSettings = {
  temperature: 0.7,
  responseLength: "balanced",
};

type GlobalChatContextValue = {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activeConversationId: string | null;
  isStreaming: boolean;
  isTyping: boolean;
  isLoadingHistory: boolean;
  isLoadingConversation: boolean;
  error: ChatError | null;
  chatQuota: ChatQuotaStatus | null;
  refreshChatQuota: () => Promise<void>;
  quotaHint: string | null;
  settings: ChatSettings;
  setSettings: (settings: ChatSettings) => void;
  suggestions: string[];
  routeContext: GlobalRouteContext;
  assistantMode: string;
  projectContext: ProjectChatContext | null;
  setProjectContext: (context: ProjectChatContext | null) => void;
  setSelectedComponent: (name: string | null) => void;
  isPanelOpen: boolean;
  isFullPage: boolean;
  openPanel: () => void;
  openQuickChat: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  newChat: () => void;
  selectConversation: (id: string) => void;
  deleteChat: (id: string) => void;
  sendMessage: (content: string, opts?: SendMessageOptions) => Promise<void>;
  insertPrompt: (prompt: string) => void;
  stopGenerating: () => void;
  regenerateLastResponse: () => void;
  setMessageFeedback: (
    messageId: string,
    feedback: "like" | "dislike" | null,
  ) => void;
  toggleBookmark: (messageId: string) => void;
  exportChat: () => void;
  resetConversation: () => void;
  clearChats: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredConversations: Conversation[];
};

const GlobalChatContext = createContext<GlobalChatContextValue | null>(null);

export function GlobalChatProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { data: userSettings } = useSettings();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [chatQuota, setChatQuota] = useState<ChatQuotaStatus | null>(null);
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [projectContext, setProjectContext] = useState<ProjectChatContext | null>(
    null,
  );
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [memoryContext, setMemoryContext] = useState<ChatMemoryContext | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const initialConversationHandled = useRef(false);

  const isFullPage = pathname.startsWith("/ai-assistant");

  const routeContext = useMemo(
    () =>
      buildGlobalRouteContext(pathname, {
        isAuthenticated: Boolean(user),
        theme: userSettings?.theme ?? "light",
        language:
          userSettings?.aiPreferences?.preferredLanguage ??
          userSettings?.language ??
          "en",
        learningLevel: userSettings?.preferredProgrammingLanguage,
        codingStyle: userSettings?.aiPreferences?.codingStyle,
        selectedComponent,
      }),
    [pathname, user, userSettings, selectedComponent],
  );

  const assistantMode = useMemo(() => {
    if (projectContext?.projectName) {
      return `Project Mentor — ${projectContext.projectName}`;
    }
    return getRouteMeta(pathname).assistantMode;
  }, [pathname, projectContext?.projectName]);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ?? null;

  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q),
    );
  }, [conversations, searchQuery]);

  const suggestions = useMemo(() => {
    if (projectContext?.aiPromptSuggestions?.length) {
      return projectContext.aiPromptSuggestions;
    }
    if (projectContext) {
      return projectContext.currentStep
        ? [
            `Explain step ${projectContext.currentStep.number}: ${projectContext.currentStep.title}`,
            "Debug this wiring",
            "What's the next step?",
            "Testing help for this stage",
            "Common mistakes for this build",
          ]
        : [
            "Explain this project's wiring",
            "Debug my current step",
            "What components do I still need?",
            "Common mistakes for this build",
            "How do I test this stage?",
          ];
    }
    return getRouteMeta(pathname).suggestions;
  }, [pathname, projectContext]);

  useEffect(() => {
    if (userSettings?.aiResponseLength) {
      setSettings((prev) => ({
        ...prev,
        responseLength: userSettings.aiResponseLength,
      }));
    }
  }, [userSettings?.aiResponseLength]);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    setIsLoadingHistory(true);
    try {
      const rows = await listConversations(user.id);
      const urlConversationId = searchParams.get("conversation");
      let targetId: string | null = null;

      setActiveConversationId((current) => {
        const fromUrl =
          urlConversationId && rows.some((row) => row.id === urlConversationId)
            ? urlConversationId
            : null;
        const keepCurrent =
          current && rows.some((row) => row.id === current) ? current : null;
        targetId = fromUrl ?? keepCurrent ?? rows[0]?.id ?? null;
        return targetId;
      });

      setConversations(rows);

      if (targetId) {
        try {
          const messages = await loadConversationMessages(targetId, user.id);
          setConversations((prev) =>
            prev.map((c) => (c.id === targetId ? { ...c, messages } : c)),
          );
        } catch (err) {
          console.error("[chat] failed to load messages", err);
        }
      }
    } catch (err) {
      console.error("[chat] failed to load history", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [searchParams, user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setConversations([]);
      setActiveConversationId(null);
      return;
    }
    void loadHistory();
  }, [authLoading, user, loadHistory]);

  const refreshChatQuota = useCallback(async () => {
    const quota = await fetchChatQuota();
    setChatQuota(quota);
  }, []);

  useEffect(() => {
    void refreshChatQuota();
  }, [user?.id, refreshChatQuota]);

  useEffect(() => {
    if (!user) {
      setMemoryContext(null);
      return;
    }
    void getUserMemoryContext(user.id)
      .then(setMemoryContext)
      .catch(() => setMemoryContext(null));
  }, [user]);

  const selectConversation = useCallback(
    async (id: string) => {
      setActiveConversationId(id);
      setError(null);

      if (!user) return;

      const conv = conversations.find((c) => c.id === id);
      if (conv?.messages && conv.messages.length > 0) return;

      setIsLoadingConversation(true);
      try {
        const messages = await loadConversationMessages(id, user.id);
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, messages } : c)),
        );
      } catch (err) {
        console.error("[chat] failed to load conversation", err);
      } finally {
        setIsLoadingConversation(false);
      }
    },
    [conversations, user],
  );

  useEffect(() => {
    const conversationParam = searchParams.get("conversation");
    if (!conversationParam || initialConversationHandled.current) return;
    if (authLoading || isLoadingHistory) return;

    initialConversationHandled.current = true;
    void selectConversation(conversationParam);
    if (!isFullPage) setIsPanelOpen(true);
  }, [
    authLoading,
    isFullPage,
    isLoadingHistory,
    searchParams,
    selectConversation,
  ]);

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
      if (user && isUuid(id)) {
        try {
          await deleteConversation(id, user.id);
        } catch (err) {
          console.error("[chat] failed to delete conversation", err);
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

  const persistConversation = useCallback(
    async (
      localId: string,
      conv: Conversation,
    ): Promise<string> => {
      if (!user) return localId;
      if (isUuid(localId)) return localId;

      const saved = await createConversation(user.id, {
        title: conv.title,
        preview: conv.preview,
        projectSlug: conv.projectSlug,
        category: conv.category,
      });

      setActiveConversationId(saved.id);
      setConversations((prev) =>
        prev.map((c) => (c.id === localId ? { ...c, id: saved.id } : c)),
      );

      return saved.id;
    },
    [user],
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
      }

      const existingConv =
        conversations.find((c) => c.id === conversationId) ??
        ({
          id: conversationId,
          title: titleFromMessage(trimmed || "Image upload"),
          preview: trimmed,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          projectSlug: projectContext?.projectSlug,
          category: opts.category,
          messages: [],
        } satisfies Conversation);

      if (user) {
        try {
          conversationId = await persistConversation(conversationId, existingConv);
        } catch (err) {
          console.error("[chat] failed to persist conversation", err);
        }
      }

      let messagesForApi: ChatMessage[] = [];
      const convSnapshot = { ...existingConv, id: conversationId };

      if (opts.regenerate && convSnapshot.messages.length > 0) {
        messagesForApi = [...convSnapshot.messages];
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

        if (user && conversationId && isUuid(conversationId)) {
          void saveMessage(user.id, {
            conversationId,
            role: "user",
            content: trimmed,
            images: opts.images,
          }).catch((err) => console.error("[chat] failed to save user message", err));
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

      const apiMessages = toGeminiMessages(messagesForApi);

      const { text, error: streamError } = await streamChatMessage(
        {
          messages: apiMessages,
          projectContext: projectContext ?? undefined,
          memoryContext: memoryContext ?? undefined,
          routeContext: {
            ...routeContext,
            assistantMode,
          },
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
        void refreshChatQuota();
        return;
      }

      finalizeAssistantMessage(conversationId, assistantId, text);

      if (user && conversationId && isUuid(conversationId)) {
        void saveMessage(user.id, {
          conversationId,
          role: "assistant",
          content: text,
        }).catch((err) => console.error("[chat] failed to save assistant message", err));
      }

      void refreshChatQuota();
    },
    [
      activeConversationId,
      assistantMode,
      conversations,
      finalizeAssistantMessage,
      memoryContext,
      projectContext,
      routeContext,
      settings,
      user,
      persistConversation,
      refreshChatQuota,
    ],
  );

  const insertPrompt = useCallback(
    (prompt: string) => {
      void sendMessage(prompt);
    },
    [sendMessage],
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

  const openQuickChat = useCallback(() => {
    stopGenerating();
    newChat();
    setIsPanelOpen(true);
  }, [newChat, stopGenerating]);

  const openPanel = openQuickChat;
  const closePanel = useCallback(() => setIsPanelOpen(false), []);
  const togglePanel = useCallback(() => {
    if (isPanelOpen) {
      setIsPanelOpen(false);
      return;
    }
    stopGenerating();
    if (conversations.length === 0) {
      newChat();
    } else if (!activeConversationId) {
      setActiveConversationId(conversations[0]?.id ?? null);
    }
    setIsPanelOpen(true);
  }, [activeConversationId, conversations, isPanelOpen, newChat, stopGenerating]);

  const quotaHint = useMemo(() => {
    if (!chatQuota || chatQuota.unlimited) return null;
    const daily = `${chatQuota.dailyRemaining} of ${chatQuota.dailyLimit} messages left today`;
    if (!user) {
      return `${daily} · Sign in for a higher limit`;
    }
    if (chatQuota.monthlyRemaining <= 10) {
      return `${daily} · ${chatQuota.monthlyRemaining} left this month`;
    }
    return daily;
  }, [user, chatQuota]);

  const value = useMemo<GlobalChatContextValue>(
    () => ({
      conversations,
      activeConversation,
      activeConversationId,
      isStreaming,
      isTyping: isStreaming,
      isLoadingHistory,
      isLoadingConversation,
      error,
      chatQuota,
      refreshChatQuota,
      quotaHint,
      settings,
      setSettings,
      suggestions,
      routeContext,
      assistantMode,
      projectContext,
      setProjectContext,
      setSelectedComponent,
      isPanelOpen,
      isFullPage,
      openPanel,
      openQuickChat,
      closePanel,
      togglePanel,
      newChat,
      selectConversation,
      deleteChat,
      sendMessage,
      insertPrompt,
      stopGenerating,
      regenerateLastResponse,
      setMessageFeedback,
      toggleBookmark,
      exportChat,
      resetConversation,
      clearChats,
      searchQuery,
      setSearchQuery,
      filteredConversations,
    }),
    [
      conversations,
      activeConversation,
      activeConversationId,
      isStreaming,
      isLoadingHistory,
      isLoadingConversation,
      error,
      chatQuota,
      refreshChatQuota,
      quotaHint,
      settings,
      suggestions,
      routeContext,
      assistantMode,
      projectContext,
      isPanelOpen,
      isFullPage,
      openPanel,
      openQuickChat,
      closePanel,
      togglePanel,
      newChat,
      selectConversation,
      deleteChat,
      sendMessage,
      insertPrompt,
      stopGenerating,
      regenerateLastResponse,
      setMessageFeedback,
      toggleBookmark,
      exportChat,
      resetConversation,
      clearChats,
      searchQuery,
      filteredConversations,
    ],
  );

  return (
    <GlobalChatContext.Provider value={value}>
      {children}
    </GlobalChatContext.Provider>
  );
}

export function useGlobalChat() {
  const context = useContext(GlobalChatContext);
  if (!context) {
    throw new Error("useGlobalChat must be used within GlobalChatProvider");
  }
  return context;
}
