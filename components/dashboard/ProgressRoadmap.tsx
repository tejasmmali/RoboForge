"use client";

import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoadmapStage } from "@/types/dashboard";

type ProgressRoadmapProps = {
  stages: RoadmapStage[];
  embedded?: boolean;
};

export function ProgressRoadmap({ stages, embedded }: ProgressRoadmapProps) {
  const roadmap = (
    <div className={embedded ? "" : "rounded-default border border-border bg-surface/80 p-6 backdrop-blur-sm md:p-8"}>
        <div className="relative flex flex-col items-center">
          <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-border" />
          <motion.div
            className="absolute left-1/2 top-4 w-px -translate-x-1/2 bg-foreground/30"
            initial={{ height: 0 }}
            animate={{ height: "40%" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />

          {stages.map((stage, i) => (
            <div
              key={stage.label}
              className="relative z-10 flex w-full max-w-sm flex-col items-center py-1.5"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "w-full rounded-default border px-5 py-3 backdrop-blur-sm transition-shadow",
                  stage.current
                    ? "border-foreground/30 bg-background shadow-soft"
                    : stage.complete
                      ? "border-foreground/20 bg-background shadow-soft"
                      : "border-border bg-surface/60",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-[12px] font-medium uppercase tracking-wider">
                    {stage.label}
                  </span>
                  {stage.complete ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                  ) : stage.current ? (
                    <span className="rounded-full border border-foreground/30 bg-foreground px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-background">
                      Current
                    </span>
                  ) : (
                    <span className="font-heading text-[10px] text-muted-foreground">
                      {stage.progress}%
                    </span>
                  )}
                </div>
                {!stage.complete && stage.progress > 0 && (
                  <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.progress}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.7 }}
                      className="h-full rounded-full bg-foreground/50"
                    />
                  </div>
                )}
              </motion.div>
              {i < stages.length - 1 && (
                <ChevronDown
                  className="my-0.5 h-4 w-4 text-muted-foreground/40"
                  strokeWidth={1.5}
                />
              )}
            </div>
          ))}
        </div>
      </div>
  );

  if (embedded) return roadmap;

  return (
    <section id="progress" className="scroll-mt-24">
      <div className="mb-5">
        <h2 className="font-heading text-lg font-medium tracking-tight">
          Learning Progress
        </h2>
        <p className="mt-0.5 text-[13px] text-muted">Your robotics roadmap</p>
      </div>
      {roadmap}
    </section>
  );
}
