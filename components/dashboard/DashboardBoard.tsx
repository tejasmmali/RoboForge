"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type DashboardBoardProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  flush?: boolean;
};

export function DashboardBoard({
  children,
  title,
  description,
  className,
  flush = false,
}: DashboardBoardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-hidden rounded-default border border-border bg-surface/95 shadow-soft backdrop-blur-md",
        className,
      )}
    >
      {(title || description) && (
        <div className="shrink-0 border-b border-border px-8 py-6 lg:px-10">
          {title && (
            <h2 className="font-heading text-xl font-medium tracking-tight lg:text-[22px]">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-[13px] text-muted">{description}</p>
          )}
        </div>
      )}
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain",
          flush ? "p-0" : "px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7",
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
