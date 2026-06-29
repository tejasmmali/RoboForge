"use client";

import { memo, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ChatErrorCard } from "@/components/chat/ChatErrorCard";
import { LoadingSkeleton } from "@/components/chat/LoadingSkeleton";
import type { ChatError } from "@/types/chat";
import type { ChatMessage } from "@/types/message";
import { cn } from "@/lib/utils";

type ChatMessagesProps = {
  messages: ChatMessage[];
  isTyping: boolean;
  isLoading?: boolean;
  error?: ChatError | null;
  variant?: "default" | "compact";
  onRegenerate?: () => void;
  onContinue?: (text: string) => void;
  onFeedback?: (messageId: string, feedback: "like" | "dislike" | null) => void;
  onBookmark?: (messageId: string) => void;
  onRetry?: () => void;
};

const VirtualRow = memo(function VirtualRow({
  message,
  isLatest,
  variant,
  onRegenerate,
  onContinue,
  onFeedback,
  onBookmark,
}: {
  message: ChatMessage;
  isLatest: boolean;
  variant?: "default" | "compact";
  onRegenerate?: () => void;
  onContinue?: (text: string) => void;
  onFeedback?: (feedback: "like" | "dislike" | null) => void;
  onBookmark?: () => void;
}) {
  return (
    <MessageBubble
      message={message}
      isLatest={isLatest}
      variant={variant}
      onRegenerate={onRegenerate}
      onContinue={onContinue}
      onFeedback={onFeedback}
      onBookmark={onBookmark}
    />
  );
});

export function ChatMessages({
  messages,
  isTyping,
  isLoading,
  error,
  variant = "default",
  onRegenerate,
  onContinue,
  onFeedback,
  onBookmark,
  onRetry,
}: ChatMessagesProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isCompact = variant === "compact";

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140,
    overscan: 8,
  });

  const lastMessageContent = messages.at(-1)?.content;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isTyping, lastMessageContent]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const useVirtual = messages.length > 20;

  return (
    <div ref={parentRef} className="h-full flex-1 overflow-y-auto scroll-smooth">
      <div
        className={cn(
          "mx-auto w-full",
          isCompact
            ? "flex flex-col gap-2.5 px-3 py-3"
            : "max-w-3xl px-4 py-6 md:px-6",
        )}
      >
        {error ? (
          <div className={isCompact ? "mb-2" : "mb-4"}>
            <ChatErrorCard
              error={error}
              onRetry={onRetry}
              className={isCompact ? "p-3" : undefined}
            />
          </div>
        ) : null}

        {useVirtual ? (
          <div
            style={{ height: `${virtualizer.getTotalSize()}px` }}
            className="relative w-full"
          >
            {virtualizer.getVirtualItems().map((item) => {
              const message = messages[item.index];
              return (
                <div
                  key={message.id}
                  ref={virtualizer.measureElement}
                  data-index={item.index}
                  className="absolute left-0 top-0 w-full"
                  style={{ transform: `translateY(${item.start}px)` }}
                >
                  <VirtualRow
                    message={message}
                    variant={variant}
                    isLatest={
                      item.index === messages.length - 1 &&
                      !isTyping &&
                      message.role === "assistant"
                    }
                    onRegenerate={
                      item.index === messages.length - 1 ? onRegenerate : undefined
                    }
                    onContinue={onContinue}
                    onFeedback={(feedback) => onFeedback?.(message.id, feedback)}
                    onBookmark={() => onBookmark?.(message.id)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          messages.map((message, index) => (
            <VirtualRow
              key={message.id}
              message={message}
              variant={variant}
              isLatest={
                index === messages.length - 1 &&
                !isTyping &&
                message.role === "assistant"
              }
              onRegenerate={
                index === messages.length - 1 ? onRegenerate : undefined
              }
              onContinue={onContinue}
              onFeedback={(feedback) => onFeedback?.(message.id, feedback)}
              onBookmark={() => onBookmark?.(message.id)}
            />
          ))
        )}

        {isTyping &&
          messages.at(-1)?.role !== "assistant" &&
          !messages.at(-1)?.isStreaming && (
            <div className={cn("flex w-full", isCompact ? "py-1" : "py-5")}>
              <TypingIndicator />
            </div>
          )}

        <div ref={bottomRef} className={isCompact ? "h-1" : "h-4"} aria-hidden="true" />
      </div>
    </div>
  );
}
