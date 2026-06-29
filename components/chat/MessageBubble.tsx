"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  Check,
  Copy,
  MessageSquarePlus,
  RefreshCw,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import type { ChatMessage } from "@/types/message";
import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  message: ChatMessage;
  isLatest?: boolean;
  variant?: "default" | "compact";
  onRegenerate?: () => void;
  onContinue?: (text: string) => void;
  onFeedback?: (feedback: "like" | "dislike" | null) => void;
  onBookmark?: () => void;
};

export function MessageBubble({
  message,
  isLatest,
  variant = "default",
  onRegenerate,
  onContinue,
  onFeedback,
  onBookmark,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const isStreaming = message.isStreaming && !message.content;
  const isCompact = variant === "compact";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "RoboForge AI",
        text: message.content.slice(0, 500),
      });
    } else {
      await handleCopy();
    }
  };

  if (isUser) {
    return (
      <motion.div
        initial={isLatest ? { opacity: 0, y: 6 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex w-full flex-col items-end",
          isCompact ? "gap-1.5 py-0.5" : "gap-2 py-2",
        )}
      >
        {message.images?.length ? (
          <div className="flex flex-wrap justify-end gap-2">
            {message.images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-[10px] border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.previewDataUrl ?? image.url}
                  alt={image.name}
                  className={cn(
                    "object-cover",
                    isCompact ? "max-h-28 max-w-[160px]" : "max-h-40 max-w-[200px]",
                  )}
                />
              </div>
            ))}
          </div>
        ) : null}
        <div
          className={cn(
            "w-fit max-w-[88%] bg-foreground text-background",
            isCompact
              ? "rounded-2xl rounded-br-sm px-3 py-2 text-[13px] leading-snug"
              : "rounded-[20px] px-4 py-2.5 text-[15px] leading-relaxed md:max-w-[75%]",
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </motion.div>
    );
  }

  if (isCompact) {
    return (
      <motion.div
        initial={isLatest ? { opacity: 0, y: 6 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="group flex w-full flex-col items-start py-0.5"
      >
        <div className="w-full max-w-[95%] rounded-2xl rounded-bl-sm border border-border/60 bg-background/95 px-3 py-2 shadow-soft">
          {isStreaming ? (
            <TypingIndicator />
          ) : (
            <MarkdownRenderer content={message.content} compact />
          )}
          {message.isStreaming && message.content ? (
            <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-accent align-middle" />
          ) : null}
        </div>

        {!isStreaming && message.content && isLatest ? (
          <div className="mt-1 flex items-center gap-0.5 px-1">
            <CompactAction
              label={copied ? "Copied" : "Copy"}
              icon={copied ? Check : Copy}
              onClick={() => void handleCopy()}
            />
            {onRegenerate ? (
              <CompactAction
                label="Retry"
                icon={RefreshCw}
                onClick={onRegenerate}
              />
            ) : null}
          </div>
        ) : null}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={isLatest ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group w-full border-b border-border/40 py-5 last:border-b-0"
    >
      <div className="text-[15px] leading-relaxed text-foreground">
        {isStreaming ? (
          <TypingIndicator />
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
        {message.isStreaming && message.content ? (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-accent align-middle" />
        ) : null}
      </div>

      {!isStreaming && message.content && (
        <div className="mt-3 flex flex-wrap items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <ActionButton
            label={copied ? "Copied" : "Copy"}
            icon={copied ? Check : Copy}
            onClick={() => void handleCopy()}
          />
          {isLatest && onRegenerate ? (
            <ActionButton
              label="Regenerate"
              icon={RefreshCw}
              onClick={onRegenerate}
            />
          ) : null}
          <ActionButton
            label={message.bookmarked ? "Saved" : "Bookmark"}
            icon={Bookmark}
            active={message.bookmarked}
            onClick={onBookmark}
          />
          <ActionButton label="Share" icon={Share2} onClick={() => void handleShare()} />
          {onContinue ? (
            <ActionButton
              label="Continue"
              icon={MessageSquarePlus}
              onClick={() => onContinue("Continue from your last answer.")}
            />
          ) : null}
          <ActionButton
            label="Like"
            icon={ThumbsUp}
            active={message.feedback === "like"}
            onClick={() =>
              onFeedback?.(message.feedback === "like" ? null : "like")
            }
          />
          <ActionButton
            label="Dislike"
            icon={ThumbsDown}
            active={message.feedback === "dislike"}
            onClick={() =>
              onFeedback?.(message.feedback === "dislike" ? null : "dislike")
            }
          />
        </div>
      )}
    </motion.div>
  );
}

function CompactAction({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
    >
      <Icon className="h-3 w-3" strokeWidth={1.75} />
    </button>
  );
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
  active,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      title={label}
      className={cn(
        "flex items-center gap-1 rounded-[8px] border border-transparent px-2 py-1 text-[11px] text-muted transition-colors hover:border-border hover:bg-surface hover:text-foreground",
        active && "border-border bg-surface text-foreground",
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={1.75} />
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );
}

export const MemoizedMessageBubble = MessageBubble;
