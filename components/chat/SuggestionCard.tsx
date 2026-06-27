"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SuggestionCardProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

export function SuggestionCard({ label, onClick, className }: SuggestionCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.95)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={cn(
        "w-full rounded-[14px] border border-border bg-surface/90 px-4 py-3.5 text-left text-[13px] font-medium text-foreground shadow-soft transition-shadow hover:shadow-elevated",
        className,
      )}
    >
      {label}
    </motion.button>
  );
}
