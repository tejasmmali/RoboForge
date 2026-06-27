"use client";

import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Cpu,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardNotification } from "@/types/dashboard";

const typeIcons = {
  project: Cpu,
  guide: BookOpen,
  feature: Sparkles,
  reminder: Bell,
};

type NotificationsPanelProps = {
  notifications: DashboardNotification[];
  embedded?: boolean;
};

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours || 1}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationsPanel({ notifications, embedded }: NotificationsPanelProps) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <section className={embedded ? "p-5 sm:p-6" : "rounded-default border border-border bg-surface/80 p-5 backdrop-blur-sm"}>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
          Notifications
        </h2>
        {unread > 0 && (
          <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background">
            {unread}
          </span>
        )}
      </div>

      <ul className="mt-4 space-y-2">
        {notifications.map((n, i) => {
          const Icon = typeIcons[n.type];
          return (
            <motion.li
              key={n.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex gap-3 rounded-[12px] border p-3 transition-colors",
                n.read
                  ? "border-transparent bg-transparent"
                  : "border-border bg-background/60",
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-border bg-surface">
                <Icon className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium leading-snug">{n.title}</p>
                <p className="mt-0.5 text-[11px] text-muted">{n.message}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {formatTime(n.created_at)}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
