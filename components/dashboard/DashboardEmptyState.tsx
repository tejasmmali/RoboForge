"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FolderOpen } from "lucide-react";

type DashboardEmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

export function DashboardEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: DashboardEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center rounded-default border border-dashed border-border bg-surface/50 px-6 py-12 text-center backdrop-blur-sm"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-default border border-border bg-background">
        <FolderOpen className="h-6 w-6 text-muted" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 font-heading text-[15px] font-medium">{title}</h3>
      <p className="mt-1.5 max-w-xs text-[13px] text-muted">{description}</p>
      <Link
        href={actionHref}
        className="hover-glow mt-5 inline-flex items-center gap-1.5 rounded-default border border-border bg-surface px-4 py-2 text-[13px] font-medium transition-colors hover:border-border-strong"
      >
        {actionLabel}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
      </Link>
    </motion.div>
  );
}
