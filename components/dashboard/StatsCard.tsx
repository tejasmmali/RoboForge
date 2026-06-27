"use client";

import { motion } from "framer-motion";
import {
  Award,
  Bookmark,
  Bot,
  CheckCircle2,
  Clock,
  FolderOpen,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/types/dashboard";

const iconMap: Record<string, LucideIcon> = {
  folder: FolderOpen,
  check: CheckCircle2,
  bookmark: Bookmark,
  bot: Bot,
  clock: Clock,
  award: Award,
};

type StatsCardProps = {
  stat: DashboardStat;
  index: number;
  compact?: boolean;
};

export function StatsCard({ stat, index, compact }: StatsCardProps) {
  const Icon = iconMap[stat.icon] ?? FolderOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "hover-glow group min-w-0 rounded-default border border-border bg-surface/80 backdrop-blur-sm",
        compact ? "p-4" : "p-5 lg:p-6",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-border bg-background">
          <Icon className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} />
        </div>
        {stat.trend > 0 && (
          <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-medium text-emerald-600">
            <TrendingUp className="h-3 w-3" strokeWidth={2} />+{stat.trend}
          </span>
        )}
      </div>
      <p
        className={cn(
          "mt-3 font-heading font-medium tracking-tight",
          compact ? "text-2xl" : "mt-4 text-3xl",
        )}
      >
        {stat.value}
      </p>
      <p className="mt-0.5 truncate text-[11px] text-muted">{stat.label}</p>
      {!compact && (
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
          {stat.trendLabel}
        </p>
      )}
    </motion.div>
  );
}

type StatsGridProps = {
  stats: DashboardStat[];
  compact?: boolean;
};

export function StatsGrid({ stats, compact }: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:gap-4",
        compact
          ? "grid-cols-2 sm:grid-cols-3"
          : "grid-cols-2 md:grid-cols-3 2xl:grid-cols-6",
      )}
    >
      {stats.map((stat, i) => (
        <StatsCard key={stat.id} stat={stat} index={i} compact={compact} />
      ))}
    </div>
  );
}
