"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import type { ComponentFilterChip, ComponentSort } from "@/lib/components-catalog";
import { filterChips, sortOptions } from "@/lib/components-catalog";
import { cn } from "@/lib/utils";

type SearchToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  activeChip: ComponentFilterChip;
  onChipChange: (chip: ComponentFilterChip) => void;
  sort: ComponentSort;
  onSortChange: (sort: ComponentSort) => void;
  resultCount: number;
};

export function SearchToolbar({
  query,
  onQueryChange,
  activeChip,
  onChipChange,
  sort,
  onSortChange,
  resultCount,
}: SearchToolbarProps) {
  return (
    <div className="sticky top-[var(--nav-height)] z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding)] py-4 md:py-5">
        <SearchBar
          value={query}
          onChange={onQueryChange}
          placeholder="Search components..."
          ariaLabel="Search components"
        />

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filter components"
          >
            {filterChips.map((chip) => {
              const isActive = activeChip === chip.id;
              return (
                <motion.button
                  key={chip.id}
                  type="button"
                  layout
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onChipChange(chip.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 font-heading text-[11px] font-medium uppercase tracking-wider transition-all duration-200",
                    isActive
                      ? "border-foreground bg-foreground text-background shadow-soft"
                      : "border-border bg-surface/80 text-muted hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {chip.label}
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-[12px] text-muted-foreground sm:inline">
              {resultCount} component{resultCount !== 1 ? "s" : ""}
            </span>
            <div className="relative">
              <label htmlFor="component-sort" className="sr-only">
                Sort components
              </label>
              <select
                id="component-sort"
                value={sort}
                onChange={(e) =>
                  onSortChange(e.target.value as ComponentSort)
                }
                className={cn(
                  "appearance-none rounded-default border border-border bg-surface/80 py-2 pl-3.5 pr-9 text-[13px] text-foreground backdrop-blur-md",
                  "transition-all duration-200 focus:border-accent/30 focus:shadow-glow focus:outline-none",
                )}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.75}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
