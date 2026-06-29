"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, MoreHorizontal, Pin, Trash2 } from "lucide-react";
import type { Conversation } from "@/types/message";
import { cn } from "@/lib/utils";

type ConversationItemProps = {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete?: (id: string) => void;
};

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  onDelete,
}: ConversationItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete?.(conversation.id);
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        "group relative rounded-[12px] border transition-colors duration-150",
        isActive
          ? "border-border bg-background shadow-soft"
          : "border-transparent hover:border-border/70 hover:bg-background/70",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-start gap-2.5 px-2.5 py-2.5 pr-9 text-left"
      >
        <span
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border",
            isActive
              ? "border-border bg-surface text-foreground"
              : "border-border/60 bg-background/80 text-muted-foreground group-hover:text-foreground",
          )}
        >
          <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "truncate text-[12px] font-medium leading-tight",
                isActive ? "text-foreground" : "text-muted",
              )}
            >
              {conversation.title}
            </span>
            {conversation.pinned && (
              <Pin
                className="h-3 w-3 shrink-0 text-muted-foreground"
                strokeWidth={1.75}
              />
            )}
          </div>
          <p className="mt-1 line-clamp-1 text-[11px] leading-snug text-muted-foreground">
            {conversation.preview || "No messages yet"}
          </p>
          <span className="mt-1 block text-[10px] text-muted-foreground/80">
            {formatTimestamp(conversation.updatedAt)}
          </span>
        </div>
      </button>

      {onDelete && (
        <div className="absolute right-1.5 top-1.5">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((open) => !open);
            }}
            aria-label={`Options for ${conversation.title}`}
            aria-expanded={menuOpen}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-[8px] text-muted-foreground transition-all hover:bg-background hover:text-foreground",
              menuOpen
                ? "bg-background text-foreground opacity-100"
                : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
            )}
          >
            <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-20 mt-1 min-w-[132px] overflow-hidden rounded-[10px] border border-border bg-surface py-1 shadow-elevated"
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-red-600 transition-colors hover:bg-background"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Delete chat
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
