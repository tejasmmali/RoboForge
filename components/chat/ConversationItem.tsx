"use client";

import { motion } from "framer-motion";
import { MessageSquare, Pin } from "lucide-react";
import type { Conversation } from "@/types/message";
import { cn } from "@/lib/utils";

type ConversationItemProps = {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
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
}: ConversationItemProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
      onClick={onClick}
      className={cn(
        "group flex w-full items-start gap-2 rounded-[10px] px-2.5 py-2 text-left transition-colors duration-150",
        isActive && "bg-background shadow-soft",
      )}
    >
      <MessageSquare
        className={cn(
          "mt-0.5 h-3.5 w-3.5 shrink-0",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
        strokeWidth={1.75}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "truncate text-[12px] font-medium",
              isActive ? "text-foreground" : "text-muted",
            )}
          >
            {conversation.title}
          </span>
          {conversation.pinned && (
            <Pin className="h-3 w-3 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          )}
        </div>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {conversation.preview}
        </p>
        <span className="mt-0.5 block text-[10px] text-muted-foreground/70">
          {formatTimestamp(conversation.updatedAt)}
        </span>
      </div>
    </motion.button>
  );
}
