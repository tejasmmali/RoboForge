"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Bug,
  Code,
  Cpu,
  GitCompare,
  GraduationCap,
  Layers,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { capabilities } from "@/lib/chat-data";

const iconMap: Record<string, LucideIcon> = {
  code: Code,
  circuit: Cpu,
  debug: Bug,
  components: Layers,
  compare: GitCompare,
  learning: GraduationCap,
  planning: BookOpen,
  troubleshoot: Wrench,
};

export function CapabilitiesGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {capabilities.map((cap, index) => {
        const Icon = iconMap[cap.icon] ?? Code;
        return (
          <motion.div
            key={cap.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -3 }}
            className="hover-glow rounded-default border border-border bg-surface/80 p-4 backdrop-blur-sm"
          >
            <Icon className="h-4 w-4 text-muted" strokeWidth={1.5} />
            <p className="mt-3 font-heading text-[13px] font-medium tracking-tight">
              {cap.title}
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
              {cap.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
