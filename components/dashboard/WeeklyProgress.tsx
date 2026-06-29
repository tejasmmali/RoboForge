"use client";

import { motion } from "framer-motion";
import type { WeeklyProgressPoint } from "@/types/dashboard";

type WeeklyProgressProps = {
  data: WeeklyProgressPoint[];
  embedded?: boolean;
  hasActivity?: boolean;
};

export function WeeklyProgress({ data, embedded, hasActivity = false }: WeeklyProgressProps) {
  const maxHours = Math.max(...data.map((d) => d.hours), 1);
  const maxProjects = Math.max(...data.map((d) => d.projects), 1);
  const maxAi = Math.max(...data.map((d) => d.aiUsage), 1);

  const emptyState = (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <p className="font-heading text-[13px] font-medium">No activity this week</p>
      <p className="mt-1 max-w-xs text-[12px] text-muted">
        Build a project or chat with AI to see your weekly progress here.
      </p>
    </div>
  );

  const chart = hasActivity ? (
    <>
      <div className="mb-6 flex flex-wrap gap-4 text-[11px]">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-foreground" />
          Learning Hours
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-foreground/40" />
          Projects Completed
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          AI Usage
        </span>
      </div>

      <div className="flex items-end justify-between gap-2 sm:gap-4">
        {data.map((point, i) => (
          <div key={point.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-28 w-full items-end justify-center gap-0.5 sm:h-32 sm:gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(point.hours / maxHours) * 100}%` }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                className="w-2 rounded-t-[4px] bg-foreground sm:w-3"
                title={`${point.hours}h`}
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(point.projects / maxProjects) * 100}%` }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                className="w-2 rounded-t-[4px] bg-foreground/40 sm:w-3"
                title={`${point.projects} projects`}
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(point.aiUsage / maxAi) * 100}%` }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                className="w-2 rounded-t-[4px] bg-foreground/20 sm:w-3"
                title={`${point.aiUsage} AI chats`}
              />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">
              {point.day}
            </span>
          </div>
        ))}
      </div>
    </>
  ) : (
    emptyState
  );

  if (embedded) {
    return (
      <div className="flex h-full min-h-[220px] flex-col rounded-default border border-border bg-surface/80 p-5 backdrop-blur-sm">
        <p className="mb-4 shrink-0 font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Weekly Progress
        </p>
        <div className="min-h-0 flex-1">{chart}</div>
      </div>
    );
  }

  return (
    <section id="weekly" className="scroll-mt-24">
      <div className="mb-4">
        <h2 className="font-heading text-lg font-medium tracking-tight">
          Weekly Progress
        </h2>
        <p className="mt-0.5 text-[13px] text-muted">Your learning activity this week</p>
      </div>

      <div className="rounded-default border border-border bg-surface/80 p-6 backdrop-blur-sm">
        {chart}
      </div>
    </section>
  );
}
