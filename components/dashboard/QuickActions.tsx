"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Box,
  Download,
  FolderOpen,
  Play,
} from "lucide-react";

const actions = [
  { href: "/projects", label: "Browse Projects", icon: FolderOpen, primary: false },
  { href: "/components", label: "Browse Components", icon: Box, primary: false },
  { href: "/ai-assistant", label: "Open AI Assistant", icon: Bot, primary: true },
  { href: "/projects/obstacle-avoiding-robot", label: "Continue Last Project", icon: Play, primary: false },
  { href: "/projects", label: "Download Resources", icon: Download, primary: false },
] as const;

export function QuickActions({ embedded }: { embedded?: boolean }) {
  const grid = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -2 }}
        >
          <Link
            href={action.href}
            className={
              action.primary
                ? "hover-glow flex items-center gap-3 rounded-default border border-foreground bg-foreground p-4 text-background transition-colors"
                : "hover-glow flex items-center gap-3 rounded-default border border-border bg-surface/80 p-4 backdrop-blur-sm transition-colors hover:border-border-strong"
            }
          >
            <action.icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
            <span className="font-heading text-[13px] font-medium">
              {action.label}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );

  if (embedded) {
    return (
      <div>
        <p className="mb-4 font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
          Quick Actions
        </p>
        {grid}
      </div>
    );
  }

  return (
    <section id="actions" className="scroll-mt-24">
      <div className="mb-4">
        <h2 className="font-heading text-lg font-medium tracking-tight">
          Quick Actions
        </h2>
        <p className="mt-0.5 text-[13px] text-muted">Jump to what you need</p>
      </div>
      {grid}
    </section>
  );
}
