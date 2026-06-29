"use client";

import { Search } from "lucide-react";
import { useGlobalChat } from "@/components/chat/GlobalChatProvider";

type ConversationSearchProps = {
  className?: string;
};

export function ConversationSearch({ className }: ConversationSearchProps) {
  const { searchQuery, setSearchQuery } = useGlobalChat();

  return (
    <div className={className}>
      <label className="relative block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations…"
          className="w-full rounded-[10px] border border-border bg-background/80 py-2 pl-8 pr-3 text-[12px] outline-none transition-colors placeholder:text-muted-foreground focus:border-border-strong"
        />
      </label>
    </div>
  );
}
