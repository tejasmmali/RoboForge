"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Square } from "lucide-react";
import { ImageUploader } from "@/components/chat/ImageUploader";
import type { MessageImage } from "@/types/message";
import { cn } from "@/lib/utils";

const MAX_CHARS = 4000;

type ChatInputProps = {
  onSend: (message: string, images?: MessageImage[]) => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
  compact?: boolean;
  className?: string;
  quotaHint?: string | null;
};

export function ChatInput({
  onSend,
  onStop,
  disabled,
  isStreaming,
  compact = false,
  className,
  quotaHint,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [images, setImages] = useState<MessageImage[]>([]);
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!compact) {
      textareaRef.current?.focus();
    }
  }, [compact]);

  const resetHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, compact ? 120 : 160)}px`;
  };

  const handleSubmit = () => {
    if ((!value.trim() && images.length === 0) || disabled) return;
    onSend(value, images.length ? images : undefined);
    setValue("");
    setImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    resetHeight();
  };

  const canSend =
    (value.trim().length > 0 || images.length > 0) && !disabled && !isStreaming;

  return (
    <div
      className={cn(
        "shrink-0 bg-gradient-to-t from-background via-background to-transparent",
        compact ? "px-3 pb-3 pt-2" : "px-4 pb-4 pt-2 md:px-6 md:pb-6",
        className,
      )}
    >
      <div className={cn(!compact && "mx-auto max-w-3xl")}>
        {images.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-[10px] border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.previewDataUrl ?? image.url}
                  alt={image.name}
                  className="h-14 w-14 object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <motion.div
          animate={{
            boxShadow: focused
              ? "0 0 0 1px rgba(37,99,235,0.18), 0 4px 20px rgba(0,0,0,0.06)"
              : "0 0 0 1px rgba(232,232,230,1), 0 2px 8px rgba(0,0,0,0.04)",
          }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex items-center gap-1 rounded-[22px] border border-border bg-surface",
            compact ? "px-2 py-1.5" : "px-2.5 py-2",
          )}
        >
          <ImageUploader
            images={images}
            onChange={setImages}
            disabled={disabled || isStreaming}
            showPreviews={false}
            className="shrink-0"
          />

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            placeholder="Message RoboForge AI..."
            rows={1}
            className={cn(
              "min-h-[24px] max-h-[160px] flex-1 resize-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50",
              compact
                ? "py-1 text-[13px] leading-5"
                : "py-1.5 text-[14px] leading-6 md:text-[15px]",
            )}
          />

          <div className="flex shrink-0 items-center pl-0.5">
            {isStreaming ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStop}
                aria-label="Stop generating"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground"
              >
                <Square className="h-3 w-3 fill-current" strokeWidth={0} />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={canSend ? { scale: 1.05 } : undefined}
                whileTap={canSend ? { scale: 0.95 } : undefined}
                onClick={handleSubmit}
                disabled={!canSend}
                aria-label="Send message"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200",
                  canSend
                    ? "bg-foreground text-background"
                    : "bg-muted/40 text-muted-foreground",
                )}
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2} />
              </motion.button>
            )}
          </div>
        </motion.div>

        <p
          className={cn(
            "mt-1.5 text-center leading-snug text-muted-foreground",
            compact ? "px-1 text-[10px]" : "text-[11px]",
          )}
        >
          {quotaHint ? (
            <span className="text-foreground/80">{quotaHint}</span>
          ) : compact ? (
            "Quick robotics help — verify wiring before building."
          ) : (
            "RoboForge AI specializes in robotics and engineering. Verify wiring and code before building."
          )}
        </p>
      </div>
    </div>
  );
}
