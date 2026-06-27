"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  Code,
  GitCompare,
  Lightbulb,
  Search,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { aiFeatures } from "@/lib/chat-data";
import type { AIFeature } from "@/types/chat";
import { cn } from "@/lib/utils";

const featureIcons: Record<string, LucideIcon> = {
  code: Code,
  circuit: Lightbulb,
  sensors: Search,
  compare: GitCompare,
  power: Calculator,
  motor: Zap,
  planner: ArrowRight,
  debug: Wrench,
};

type FeaturesPanelProps = {
  onFeatureClick: (feature: AIFeature) => void;
  className?: string;
};

export function FeaturesPanel({ onFeatureClick, className }: FeaturesPanelProps) {
  return (
    <aside
      className={cn(
        "hidden w-[220px] shrink-0 overflow-y-auto border-l border-border bg-surface/40 p-4 backdrop-blur-sm xl:block",
        className,
      )}
    >
      <p className="font-heading text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        AI Tools
      </p>
      <div className="mt-3 space-y-2">
        {aiFeatures.map((feature) => {
          const Icon = featureIcons[feature.id] ?? Code;
          return (
            <motion.button
              key={feature.id}
              type="button"
              whileHover={{ x: 2 }}
              onClick={() => onFeatureClick(feature)}
              className="hover-glow w-full rounded-[12px] border border-border bg-surface/80 p-3 text-left backdrop-blur-sm transition-colors hover:border-border-strong"
            >
              <Icon className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} />
              <p className="mt-2 font-heading text-[11px] font-medium tracking-tight">
                {feature.title}
              </p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}
