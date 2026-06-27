"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ProjectProgressProps = {
  currentStep: number;
  totalSteps: number;
  className?: string;
};

export function ProjectProgress({
  currentStep,
  totalSteps,
  className,
}: ProjectProgressProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-[12px]">
        <span className="font-heading text-muted-foreground">Progress</span>
        <span className="font-heading font-medium">{percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-foreground"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
}

type StepIndicatorProps = {
  steps: number;
  activeStep: number;
};

export function StepIndicator({ steps, activeStep }: StepIndicatorProps) {
  return (
    <ol className="flex flex-col gap-1" role="list">
      {Array.from({ length: steps }, (_, i) => i + 1).map((step) => (
        <li
          key={step}
          className={cn(
            "flex items-center gap-2 rounded-[8px] px-2 py-1 text-[11px]",
            step <= activeStep ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full border text-[9px]",
              step < activeStep
                ? "border-foreground bg-foreground text-background"
                : step === activeStep
                  ? "border-foreground"
                  : "border-border",
            )}
          >
            {step < activeStep ? (
              <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
            ) : (
              step
            )}
          </span>
          Step {step}
        </li>
      ))}
    </ol>
  );
}
