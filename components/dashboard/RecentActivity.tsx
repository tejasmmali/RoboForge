"use client";

import { motion } from "framer-motion";
import type { ActivityItem } from "@/types/dashboard";

type RecentActivityProps = {
  activity: ActivityItem[];
  embedded?: boolean;
};

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours || 1}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RecentActivity({ activity, embedded }: RecentActivityProps) {
  return (
    <section className={embedded ? "p-5 sm:p-6" : "rounded-default border border-border bg-surface/80 p-5 backdrop-blur-sm"}>
      <h2 className="font-heading text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
        Recent Activity
      </h2>

      {activity.length === 0 ? (
        <p className="mt-4 text-[13px] text-muted">No recent activity yet.</p>
      ) : (
        <ol className="relative mt-5 space-y-0">
          <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
          {activity.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative flex gap-4 pb-5 last:pb-0"
            >
              <span className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-foreground bg-background" />
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[13px] font-medium leading-snug">
                  {item.action}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-muted">
                  {item.detail}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {formatTime(item.created_at)}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      )}
    </section>
  );
}
