"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PromptSuggestionsProps = {
  suggestions: string[];
  onSelect: (prompt: string) => void;
  className?: string;
};

export function PromptSuggestions({
  suggestions,
  onSelect,
  className,
}: PromptSuggestionsProps) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {suggestions.map((suggestion) => (
        <motion.button
          key={suggestion}
          type="button"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(suggestion)}
          className="rounded-full border border-border bg-surface/80 px-3.5 py-2 text-[12px] text-muted transition-colors hover:border-border-strong hover:bg-surface hover:text-foreground"
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  );
}
