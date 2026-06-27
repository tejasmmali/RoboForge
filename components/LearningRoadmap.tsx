"use client";

import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const roadmapSteps = [
  { label: "Beginner", progress: 100, complete: true },
  { label: "Intermediate", progress: 65, complete: false },
  { label: "Advanced", progress: 30, complete: false },
  { label: "AI Robotics", progress: 10, complete: false },
  { label: "Industrial Robotics", progress: 0, complete: false },
] as const;

export function LearningRoadmap() {
  return (
    <div className="relative rounded-default border border-border bg-surface/80 p-6 backdrop-blur-sm md:p-8">
      <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
        Learning Progress
      </h3>

      <div className="relative mt-8 flex flex-col items-center">
        <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-border" />

        {roadmapSteps.map((step, i) => (
          <div key={step.label} className="relative z-10 flex w-full max-w-xs flex-col items-center py-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "w-full rounded-default border px-5 py-3 backdrop-blur-sm",
                step.complete
                  ? "border-foreground/20 bg-background shadow-soft"
                  : "border-border bg-surface/60",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-[12px] font-medium uppercase tracking-wider">
                  {step.label}
                </span>
                {step.complete ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                ) : (
                  <span className="font-heading text-[10px] text-muted-foreground">
                    {step.progress}%
                  </span>
                )}
              </div>
              {!step.complete && step.progress > 0 && (
                <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-foreground/50"
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              )}
            </motion.div>

            {i < roadmapSteps.length - 1 && (
              <ChevronDown
                className="my-1 h-4 w-4 text-muted-foreground/50"
                strokeWidth={1.5}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
