"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Mic, Square } from "lucide-react";
import { ImageUploader } from "@/components/chat/ImageUploader";
import type { MessageImage } from "@/types/message";
import { cn } from "@/lib/utils";

const MAX_CHARS = 4000;

type ChatInputProps = {
  onSend: (message: string, images?: MessageImage[]) => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
  className?: string;
};

export function ChatInput({
  onSend,
  onStop,
  disabled,
  isStreaming,
  className,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [images, setImages] = useState<MessageImage[]>([]);
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if ((!value.trim() && images.length === 0) || disabled) return;
    onSend(value, images.length ? images : undefined);
    setValue("");
    setImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "52px";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "52px";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const canSend =
    (value.trim().length > 0 || images.length > 0) && !disabled && !isStreaming;

  return (
    <div
      className={cn(
        "shrink-0 bg-gradient-to-t from-background via-background to-transparent px-4 pb-4 pt-2 md:px-6 md:pb-6",
        className,
      )}
    >
      <div className="mx-auto max-w-3xl">
        {images.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2 px-1">
            {images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-[12px] border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.previewDataUrl ?? image.url}
                  alt={image.name}
                  className="h-16 w-16 object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <motion.div
          animate={{
            boxShadow: focused
              ? "0 0 0 1px rgba(37,99,235,0.12), 0 8px 30px rgba(0,0,0,0.06)"
              : "0 0 0 1px rgba(232,232,230,1), 0 4px 16px rgba(0,0,0,0.04)",
          }}
          transition={{ duration: 0.2 }}
          className="flex items-end gap-2 rounded-[26px] border border-border bg-surface p-2 pl-2"
        >
          <ImageUploader
            images={images}
            onChange={setImages}
            disabled={disabled || isStreaming}
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
            style={{ height: "52px" }}
            className="max-h-[200px] min-h-[52px] flex-1 resize-none bg-transparent py-3.5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          />

          <div className="flex shrink-0 items-center gap-1 pb-1.5 pr-1">
            <button
              type="button"
              disabled
              title="Voice (coming soon)"
              className="hidden h-9 w-9 cursor-not-allowed items-center justify-center rounded-full text-muted-foreground/35 sm:flex"
            >
              <Mic className="h-4 w-4" strokeWidth={1.75} />
            </button>

            {isStreaming ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStop}
                aria-label="Stop generating"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground"
              >
                <Square className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
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
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                  canSend
                    ? "bg-foreground text-background"
                    : "bg-border/80 text-muted-foreground",
                )}
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2} />
              </motion.button>
            )}
          </div>
        </motion.div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          RoboForge AI specializes in robotics and engineering. Verify wiring and code before building.
        </p>
      </div>
    </div>
  );
}
