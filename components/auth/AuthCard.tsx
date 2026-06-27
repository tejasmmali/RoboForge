"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthCardProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
};

export function AuthCard({ children, title, subtitle, className }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-default border border-border bg-surface/80 p-8 shadow-elevated backdrop-blur-xl md:p-10",
        className,
      )}
    >
      {title && (
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
}
