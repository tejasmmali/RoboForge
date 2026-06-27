"use client";

import { memo, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ChatErrorCard } from "@/components/chat/ChatErrorCard";
import { LoadingSkeleton } from "@/components/chat/LoadingSkeleton";
import type { ChatError } from "@/types/chat";
import type { ChatMessage } from "@/types/message";

type ChatMessagesProps = {
  messages: ChatMessage[];
  isTyping: boolean;
  isLoading?: boolean;
  error?: ChatError | null;
  onRegenerate?: () => void;
  onContinue?: (text: string) => void;
  onFeedback?: (messageId: string, feedback: "like" | "dislike" | null) => void;
  onBookmark?: (messageId: string) => void;
  onRetry?: () => void;
};

const VirtualRow = memo(function VirtualRow({
  message,
  isLatest,
  onRegenerate,
  onContinue,
  onFeedback,
  onBookmark,
}: {
  message: ChatMessage;
  isLatest: boolean;
  onRegenerate?: () => void;
  onContinue?: (text: string) => void;
  onFeedback?: (feedback: "like" | "dislike" | null) => void;
  onBookmark?: () => void;
}) {
  return (
    <MessageBubble
      message={message}
      isLatest={isLatest}
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
  onRegenerate,
  onContinue,
  onFeedback,
  onBookmark,
  onRetry,
}: ChatMessagesProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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
    <div ref={parentRef} className="flex-1 overflow-y-auto scroll-smooth">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
        {error ? (
          <div className="mb-4">
            <ChatErrorCard error={error} onRetry={onRetry} />
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
            <div className="flex w-full py-5">
              <TypingIndicator />
            </div>
          )}

        <div ref={bottomRef} className="h-4" aria-hidden="true" />
      </div>
    </div>
  );
}
