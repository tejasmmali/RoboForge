"use client";

import { motion } from "framer-motion";
import { Download, FileCode, FileSpreadsheet, FileText, Package } from "lucide-react";
import type { DownloadItem } from "@/lib/project-details";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  code: FileCode,
  diagram: FileText,
  guide: FileText,
  bom: FileSpreadsheet,
  libraries: Package,
};

type DownloadsGridProps = {
  downloads: DownloadItem[];
};

export function DownloadsGrid({ downloads }: DownloadsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {downloads.map((item, index) => {
        const Icon = iconMap[item.id] ?? Download;
        return (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -3 }}
            className="hover-glow group flex flex-col rounded-default border border-border bg-surface/80 p-5 text-left backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-border bg-background transition-colors group-hover:border-accent/20">
                <Icon className="h-4 w-4 text-muted" strokeWidth={1.5} />
              </div>
              <span className="rounded-[6px] bg-background px-2 py-0.5 font-heading text-[10px] uppercase tracking-wider text-muted-foreground">
                {item.fileType}
              </span>
            </div>
            <h4 className="mt-4 font-heading text-[14px] font-medium tracking-tight">
              {item.title}
            </h4>
            <p className="mt-1.5 text-[13px] text-muted">{item.description}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground transition-colors group-hover:text-accent">
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
              Download
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
