"use client";

import { motion } from "framer-motion";
import {
  Battery,
  Cpu,
  Gauge,
  Monitor,
  Radio,
  ToolCase,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  label: string;
  count: number;
  description: string;
  icon: "cpu" | "radio" | "gauge" | "zap" | "battery" | "monitor" | "wifi" | "wrench" | "tool";
  className?: string;
};

const iconMap: Record<CategoryCardProps["icon"], LucideIcon> = {
  cpu: Cpu,
  radio: Radio,
  gauge: Gauge,
  zap: Zap,
  battery: Battery,
  monitor: Monitor,
  wifi: Wifi,
  wrench: Wrench,
  tool: ToolCase,
};

export function CategoryCard({
  label,
  count,
  description,
  icon,
  className,
}: CategoryCardProps) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "hover-glow group cursor-default rounded-default border border-border bg-surface/80 p-5 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-border bg-background/80 transition-colors group-hover:border-accent/20">
          <Icon className="h-4 w-4 text-muted" strokeWidth={1.5} />
        </div>
        <span className="font-heading text-[11px] text-muted-foreground">
          {count} items
        </span>
      </div>
      <p className="mt-4 font-heading text-[14px] font-medium tracking-tight">
        {label}
      </p>
      <p className="mt-2 text-[12px] leading-relaxed text-muted">
        {description}
      </p>
    </motion.div>
  );
}
