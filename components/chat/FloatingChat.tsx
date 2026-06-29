"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Expand, SquarePen, X } from "lucide-react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { PromptSuggestions } from "@/components/chat/PromptSuggestions";
import { useGlobalChat } from "@/components/chat/GlobalChatProvider";

export function FloatingChat() {
  const {
    isFullPage,
    isPanelOpen,
    closePanel,
    openQuickChat,
    activeConversation,
    isStreaming,
    error,
    suggestions,
    assistantMode,
    sendMessage,
    stopGenerating,
    regenerateLastResponse,
    setMessageFeedback,
    toggleBookmark,
    quotaHint,
  } = useGlobalChat();

  if (isFullPage) return null;

  const messages = activeConversation?.messages ?? [];
  const hasMessages = messages.length > 0;
  const showQuickReplies = hasMessages && !isStreaming;

  const handleNewChat = () => {
    openQuickChat();
  };

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 right-6 z-[69] flex h-[min(80vh,720px)] w-[min(440px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-border/70 bg-surface/85 shadow-elevated backdrop-blur-xl"
          role="dialog"
          aria-label="RoboForge AI assistant"
        >
          <header className="flex shrink-0 items-center justify-between border-b border-border/60 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border border-border bg-background">
                <Bot className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium">RoboForge AI</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {hasMessages ? assistantMode : "New chat — ask anything"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handleNewChat}
                disabled={isStreaming}
                className="flex h-7 items-center gap-1 rounded-[8px] border border-border/70 bg-background/80 px-2 text-muted transition-colors hover:bg-background hover:text-foreground disabled:opacity-50"
                aria-label="New chat"
                title="New chat"
              >
                <SquarePen className="h-3 w-3" strokeWidth={1.75} />
                <span className="text-[10px] font-medium">New</span>
              </button>
              <Link
                href="/ai-assistant"
                className="flex h-7 w-7 items-center justify-center rounded-[8px] text-muted transition-colors hover:bg-background hover:text-foreground"
                aria-label="Open full workspace"
                title="Open full workspace"
              >
                <Expand className="h-3.5 w-3.5" strokeWidth={1.75} />
              </Link>
              <button
                type="button"
                onClick={closePanel}
                className="flex h-7 w-7 items-center justify-center rounded-[8px] text-muted transition-colors hover:bg-background hover:text-foreground"
                aria-label="Close assistant"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {!hasMessages ? (
              <div className="flex flex-1 flex-col justify-end gap-3 p-3">
                <p className="text-[12px] leading-relaxed text-muted">
                  Ask anything — quick answers for wiring, code, and components.
                </p>
                <PromptSuggestions
                  suggestions={suggestions.slice(0, 4)}
                  onSelect={(prompt) => void sendMessage(prompt)}
                  size="sm"
                />
              </div>
            ) : (
              <div className="min-h-0 flex-1 overflow-hidden">
                <ChatMessages
                  variant="compact"
                  messages={messages}
                  isTyping={isStreaming}
                  error={error}
                  onRegenerate={regenerateLastResponse}
                  onContinue={(text) => void sendMessage(text)}
                  onFeedback={setMessageFeedback}
                  onBookmark={toggleBookmark}
                  onRetry={regenerateLastResponse}
                />
              </div>
            )}

            {showQuickReplies && (
              <div className="shrink-0 border-t border-border/40 bg-background/40 px-3 py-2">
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Quick ask
                </p>
                <PromptSuggestions
                  suggestions={suggestions.slice(0, 3)}
                  onSelect={(prompt) => void sendMessage(prompt)}
                  size="sm"
                />
              </div>
            )}
          </div>

          <ChatInput
            compact
            quotaHint={quotaHint}
            onSend={(text, images) => {
              void sendMessage(text, { images });
            }}
            onStop={stopGenerating}
            isStreaming={isStreaming}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
