"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, FolderOpen, GraduationCap } from "lucide-react";

type DashboardHeaderProps = {
  name: string;
  compact?: boolean;
};

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardHeader({ name, compact }: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={compact ? undefined : "rounded-default border border-border bg-surface/80 p-6 backdrop-blur-sm md:p-8"}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between xl:gap-6">
        <div className="min-w-0 flex-1">
          <p className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {formatDate()}
          </p>
          <h1 className="mt-1.5 font-heading text-xl font-medium tracking-tight sm:text-2xl">
            Welcome back,{" "}
            <span className="text-foreground">{name}</span>
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            Continue building your robotics journey.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href="/projects"
            className="hover-glow inline-flex items-center gap-2 rounded-default border border-foreground bg-foreground px-3.5 py-2 text-[12px] font-medium text-background sm:px-4 sm:py-2.5 sm:text-[13px]"
          >
            <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
            Continue Learning
          </Link>
          <Link
            href="/projects"
            className="hover-glow inline-flex items-center gap-2 rounded-default border border-border bg-surface px-3.5 py-2 text-[12px] font-medium sm:px-4 sm:py-2.5 sm:text-[13px]"
          >
            <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
            Browse Projects
          </Link>
          <Link
            href="/ai-assistant"
            className="hover-glow inline-flex items-center gap-2 rounded-default border border-border bg-surface px-3.5 py-2 text-[12px] font-medium sm:px-4 sm:py-2.5 sm:text-[13px]"
          >
            <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
            Ask AI
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
