"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PromptSuggestionsProps = {
  suggestions: string[];
  onSelect: (prompt: string) => void;
  className?: string;
  size?: "default" | "sm";
};

export function PromptSuggestions({
  suggestions,
  onSelect,
  className,
  size = "default",
}: PromptSuggestionsProps) {
  const isSmall = size === "sm";

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {suggestions.map((suggestion) => (
        <motion.button
          key={suggestion}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(suggestion)}
          className={cn(
            "rounded-full border border-border bg-surface/80 text-muted transition-colors hover:border-border-strong hover:bg-surface hover:text-foreground",
            isSmall
              ? "px-2.5 py-1 text-[11px] leading-tight"
              : "px-3.5 py-2 text-[12px]",
          )}
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  );
}
