"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ComponentBadgeProps = {
  children: ReactNode;
  variant?: "default" | "category" | "compatibility" | "beginner" | "availability";
  className?: string;
};

const variants = {
  default: "border-border bg-background/80 text-muted",
  category:
    "border-border bg-surface/80 font-heading text-[10px] uppercase tracking-wider text-muted-foreground",
  compatibility: "border-border/80 bg-background/60 text-[11px] text-muted",
  beginner: "border-accent/20 bg-accent/5 text-accent",
  availability: "border-border bg-surface/80 text-[11px] text-muted-foreground",
};

export function ComponentBadge({
  children,
  variant = "default",
  className,
}: ComponentBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function AvailabilityDot({
  status,
}: {
  status: "in-stock" | "limited" | "popular";
}) {
  const labels = {
    "in-stock": { label: "In Stock", color: "bg-emerald-500/80" },
    limited: { label: "Limited", color: "bg-amber-500/80" },
    popular: { label: "Popular", color: "bg-accent/80" },
  };
  const { label, color } = labels[status];

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className={cn("h-1.5 w-1.5 rounded-full", color)} />
      {label}
    </span>
  );
}
