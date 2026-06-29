"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookMarked } from "lucide-react";
import { promptLibrary } from "@/lib/chat-data";
import { cn } from "@/lib/utils";

type PromptLibraryProps = {
  onInsert: (prompt: string) => void;
  className?: string;
};

export function PromptLibrary({ onInsert, className }: PromptLibraryProps) {
  const [activeCategory, setActiveCategory] = useState(promptLibrary[0]?.id ?? "");

  const category = promptLibrary.find((c) => c.id === activeCategory);

  return (
    <aside
      className={cn(
        "hidden w-[240px] shrink-0 overflow-y-auto border-l border-border bg-surface/40 p-4 backdrop-blur-sm xl:block",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <BookMarked className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} />
        <p className="font-heading text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Prompt Library
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {promptLibrary.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors",
              activeCategory === cat.id
                ? "border-accent/40 bg-accent/10 text-foreground"
                : "border-border bg-background/80 text-muted hover:text-foreground",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {category?.prompts.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            whileHover={{ x: 2 }}
            onClick={() => onInsert(item.prompt)}
            className="hover-glow w-full rounded-[12px] border border-border bg-surface/80 p-3 text-left backdrop-blur-sm transition-colors hover:border-border-strong"
          >
            <p className="font-heading text-[11px] font-medium tracking-tight">
              {item.label}
            </p>
            <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">
              {item.prompt}
            </p>
          </motion.button>
        ))}
      </div>
    </aside>
  );
}
