"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Cpu,
  FileCode,
  FileText,
  Package,
  type LucideIcon,
} from "lucide-react";
import type { DownloadItem } from "@/types/dashboard";

const typeConfig: Record<
  DownloadItem["type"],
  { label: string; icon: LucideIcon }
> = {
  pdf: { label: "PDF", icon: FileText },
  circuit: { label: "Circuit", icon: Cpu },
  code: { label: "Source Code", icon: FileCode },
  datasheet: { label: "Datasheet", icon: BookOpen },
  library: { label: "Library", icon: Package },
};

type DashboardDownloadsProps = {
  downloads: DownloadItem[];
  embedded?: boolean;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function DashboardDownloads({ downloads, embedded }: DashboardDownloadsProps) {
  const content =
    downloads.length === 0 ? (
      <p className="rounded-default border border-dashed border-border bg-surface/50 py-10 text-center text-[13px] text-muted">
        No downloads yet.
      </p>
    ) : (
      <div className="grid gap-3 sm:grid-cols-2">
        {downloads.map((item, i) => {
          const config = typeConfig[item.type];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ x: 2 }}
              className="hover-glow flex items-center gap-3 rounded-default border border-border bg-surface/80 p-4 backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-border bg-background">
                <config.icon className="h-4 w-4 text-muted" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{item.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {config.label} · {formatDate(item.downloaded_at)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    );

  if (embedded) return content;

  return (
    <section id="downloads" className="scroll-mt-24">
      <div className="mb-5">
        <h2 className="font-heading text-lg font-medium tracking-tight">
          Downloads
        </h2>
        <p className="mt-0.5 text-[13px] text-muted">Your saved resources</p>
      </div>
      {content}
    </section>
  );
}
