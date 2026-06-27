"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search projects...",
  ariaLabel = "Search projects",
  className,
}: SearchBarProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      whileFocus={{ scale: 1.005 }}
    >
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.75}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          "w-full rounded-default border border-border bg-surface/80 py-3 pl-11 pr-4 text-[14px] text-foreground backdrop-blur-md",
          "placeholder:text-muted-foreground",
          "transition-all duration-300",
          "focus:border-accent/30 focus:bg-surface focus:shadow-glow focus:outline-none",
        )}
      />
    </motion.div>
  );
}
