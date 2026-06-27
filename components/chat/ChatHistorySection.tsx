"use client";

import { motion } from "framer-motion";
import { Pin } from "lucide-react";
import type { Conversation } from "@/types/chat";

type ChatHistorySectionProps = {
  conversations: Conversation[];
  onSelect: (id: string) => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ChatHistorySection({
  conversations,
  onSelect,
}: ChatHistorySectionProps) {
  if (conversations.length === 0) return null;

  return (
    <div>
      <h3 className="font-heading text-lg font-medium tracking-tight">
        Chat History
      </h3>
      <p className="mt-1 text-[13px] text-muted">
        Resume previous conversations.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {conversations.slice(0, 6).map((conv, index) => (
          <motion.button
            key={conv.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -3 }}
            onClick={() => onSelect(conv.id)}
            className="hover-glow rounded-default border border-border bg-surface/80 p-4 text-left backdrop-blur-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-heading text-[13px] font-medium tracking-tight">
                {conv.title}
              </p>
              {conv.pinned && (
                <Pin className="h-3 w-3 shrink-0 text-muted-foreground" strokeWidth={1.75} />
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-[12px] text-muted">
              {conv.preview}
            </p>
            <p className="mt-3 text-[10px] text-muted-foreground">
              {formatDate(conv.updatedAt)}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
