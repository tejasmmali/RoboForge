"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Search, Trash2 } from "lucide-react";
import type { ChatHistoryEntry } from "@/types/dashboard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";

type AIChatHistoryProps = {
  conversations: ChatHistoryEntry[];
  embedded?: boolean;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function AIChatHistory({ conversations, embedded }: AIChatHistoryProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  return (
    <section id={embedded ? undefined : "ai-history"} className={embedded ? "" : "scroll-mt-24"}>
      <div className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${embedded ? "mb-5" : "mb-4"}`}>
        {!embedded && (
          <div>
            <h2 className="font-heading text-lg font-medium tracking-tight">
              AI Chat History
            </h2>
            <p className="mt-0.5 text-[13px] text-muted">Your past conversations</p>
          </div>
        )}
        {conversations.length > 0 && (
          <div className={`relative ${embedded ? "w-full sm:ml-auto sm:w-56" : ""}`}>
            <Search
              className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              strokeWidth={1.75}
            />
            <input
              type="search"
              placeholder="Search conversations…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-default border border-border bg-background py-2 pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-border-strong sm:w-56"
            />
          </div>
        )}
      </div>

      {conversations.length === 0 ? (
        <DashboardEmptyState
          title="No AI conversations"
          description="Ask RoboForge AI about wiring, code, components, and more."
          actionLabel="Ask RoboForge AI"
          actionHref="/ai-assistant"
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((conv, i) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ x: 2 }}
              className="hover-glow group flex items-center gap-4 rounded-default border border-border bg-surface/80 p-4 backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-border bg-background">
                <Bot className="h-4 w-4 text-muted" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-heading text-[14px] font-medium">
                  {conv.title}
                </h3>
                <p className="mt-0.5 truncate text-[12px] text-muted">
                  {conv.preview}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {formatDate(conv.updated_at)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href="/ai-assistant"
                  className="inline-flex items-center gap-1 text-[12px] font-medium opacity-0 transition-all group-hover:opacity-100 hover:text-accent"
                >
                  Continue
                  <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
                </Link>
                <button
                  type="button"
                  className="rounded-[8px] p-1.5 text-muted opacity-0 transition-all hover:bg-background hover:text-foreground group-hover:opacity-100"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
