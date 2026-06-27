"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X } from "lucide-react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { PromptSuggestions } from "@/components/chat/PromptSuggestions";
import { buildProjectContextFromDetail } from "@/lib/ai/context";
import type { ProjectDetail } from "@/lib/project-details";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

type AIAssistantPanelProps = {
  project: ProjectDetail;
  currentStepNumber?: number;
  progressPercent?: number;
};

export function AIAssistantPanel({
  project,
  currentStepNumber = 1,
  progressPercent,
}: AIAssistantPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const projectContext = useMemo(
    () =>
      buildProjectContextFromDetail(project, {
        currentStepNumber,
        progressPercent,
      }),
    [project, currentStepNumber, progressPercent],
  );

  const {
    activeConversation,
    isStreaming,
    error,
    suggestions,
    sendMessage,
    stopGenerating,
    regenerateLastResponse,
    setMessageFeedback,
    toggleBookmark,
    newChat,
  } = useChat({ projectContext, isolated: true });

  const messages = activeConversation?.messages ?? [];

  const handleOpen = () => {
    if (!activeConversation) {
      newChat();
    }
    setIsOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 flex h-[min(560px,75vh)] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-default border border-border bg-surface shadow-elevated sm:bottom-6 sm:w-[420px]"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                  AI
                </span>
                <div>
                  <p className="text-[13px] font-medium">Project Assistant</p>
                  <p className="text-[10px] text-muted-foreground">
                    {project.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-border transition-colors hover:bg-background"
                aria-label="Close assistant"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col justify-end gap-3 p-4">
                  <p className="text-[13px] leading-relaxed text-muted">
                    Ask about wiring, code, or components for{" "}
                    <span className="text-foreground">{project.title}</span>.
                  </p>
                  <PromptSuggestions
                    suggestions={suggestions.slice(0, 5)}
                    onSelect={(prompt) => void sendMessage(prompt)}
                    className="justify-start"
                  />
                </div>
              ) : (
                <ChatMessages
                  messages={messages}
                  isTyping={isStreaming}
                  error={error}
                  onRegenerate={regenerateLastResponse}
                  onContinue={(text) => void sendMessage(text)}
                  onFeedback={setMessageFeedback}
                  onBookmark={toggleBookmark}
                  onRetry={regenerateLastResponse}
                />
              )}
            </div>

            <ChatInput
              onSend={(text, images) => void sendMessage(text, { images })}
              onStop={stopGenerating}
              isStreaming={isStreaming}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "hover-glow fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-border bg-surface/90 px-4 py-3 shadow-elevated backdrop-blur-md",
        )}
        aria-label="Open AI assistant"
      >
        {isOpen ? (
          <X className="h-4 w-4" strokeWidth={1.75} />
        ) : (
          <>
            <Bot className="h-4 w-4" strokeWidth={1.75} />
            <span className="hidden text-[13px] font-medium sm:inline">
              Ask AI
            </span>
          </>
        )}
      </motion.button>
    </>
  );
}
