"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Cpu,
  Eye,
  Gauge,
  Plane,
  Radio,
  Wifi,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  label: string;
  count: number;
  icon: "cpu" | "radio" | "wifi" | "brain" | "eye" | "zap" | "plane" | "gauge";
  className?: string;
};

const iconMap: Record<CategoryCardProps["icon"], LucideIcon> = {
  cpu: Cpu,
  radio: Radio,
  wifi: Wifi,
  brain: Brain,
  eye: Eye,
  zap: Zap,
  plane: Plane,
  gauge: Gauge,
};

export function CategoryCard({
  label,
  count,
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
        <div className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-border bg-background/80 transition-colors group-hover:border-accent/20">
          <Icon className="h-4 w-4 text-muted" strokeWidth={1.5} />
        </div>
        <span className="font-heading text-[11px] text-muted-foreground">
          {count} projects
        </span>
      </div>
      <p className="mt-4 font-heading text-[13px] font-medium tracking-tight">
        {label}
      </p>
    </motion.div>
  );
}
