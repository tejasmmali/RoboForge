"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Settings2, SquarePen } from "lucide-react";
import { ChatErrorCard } from "@/components/chat/ChatErrorCard";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { EmptyState } from "@/components/chat/EmptyState";
import { PromptSuggestions } from "@/components/chat/PromptSuggestions";
import type { ChatSettings } from "@/types/chat";
import type { ChatMessage, Conversation } from "@/types/message";
import type { ChatError } from "@/types/chat";

type ChatWindowProps = {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  isLoadingHistory?: boolean;
  error: ChatError | null;
  settings: ChatSettings;
  suggestions: string[];
  onSend: (text: string, images?: import("@/types/message").MessageImage[]) => void;
  onStop: () => void;
  onRegenerate: () => void;
  onFeedback: (messageId: string, feedback: "like" | "dislike" | null) => void;
  onBookmark: (messageId: string) => void;
  onNewChat: () => void;
  onOpenSidebar: () => void;
  onOpenSettings?: () => void;
  showWelcome: boolean;
  isEmpty: boolean;
};

export function ChatWindow({
  activeConversation,
  messages,
  isStreaming,
  isLoadingHistory,
  error,
  suggestions,
  onSend,
  onStop,
  onRegenerate,
  onFeedback,
  onBookmark,
  onNewChat,
  onOpenSidebar,
  onOpenSettings,
  showWelcome,
  isEmpty,
}: ChatWindowProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between border-b border-border/60 px-3 py-2.5 md:px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-surface lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <div>
            <p className="font-heading text-[13px] font-medium">
              {activeConversation?.title ?? "RoboForge AI"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Robotics engineering mentor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {onOpenSettings ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenSettings}
              className="hidden h-9 w-9 items-center justify-center rounded-[10px] border border-border text-muted transition-colors hover:bg-surface sm:flex"
              aria-label="Chat settings"
            >
              <Settings2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            </motion.button>
          ) : null}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNewChat}
            className="flex h-9 items-center gap-1.5 rounded-[10px] border border-border px-3 text-[12px] font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <SquarePen className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">New chat</span>
          </motion.button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <EmptyState onStartChat={onNewChat} />
            </motion.div>
          ) : showWelcome ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="h-full overflow-y-auto"
            >
              <ChatWelcome onSend={(text) => onSend(text)} />
              <div className="mx-auto max-w-3xl px-4 pb-8 md:px-6">
                <PromptSuggestions
                  suggestions={suggestions}
                  onSelect={(prompt) => onSend(prompt)}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex h-full flex-col"
            >
              <ChatMessages
                messages={messages}
                isTyping={isStreaming}
                isLoading={isLoadingHistory}
                error={error}
                onRegenerate={onRegenerate}
                onContinue={(text) => onSend(text)}
                onFeedback={onFeedback}
                onBookmark={onBookmark}
                onRetry={onRegenerate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isEmpty && (
        <>
          {messages.length > 0 && messages.length < 4 && !isStreaming && (
            <div className="shrink-0 px-4 pb-2 md:px-6">
              <PromptSuggestions
                suggestions={suggestions.slice(0, 4)}
                onSelect={(prompt) => onSend(prompt)}
                className="justify-start"
              />
            </div>
          )}
          <ChatInput
            onSend={onSend}
            onStop={onStop}
            disabled={isLoadingHistory}
            isStreaming={isStreaming}
          />
        </>
      )}
    </div>
  );
}

export { ChatErrorCard };
