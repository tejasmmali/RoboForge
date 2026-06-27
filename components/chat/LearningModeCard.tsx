"use client";

import { motion } from "framer-motion";
import { ArrowDown, BookOpen, HelpCircle, Lightbulb, ListChecks } from "lucide-react";

const steps = [
  { icon: BookOpen, label: "Concept", desc: "Introduce the topic clearly" },
  { icon: Lightbulb, label: "Explanation", desc: "Break down how it works" },
  { icon: ListChecks, label: "Example", desc: "Show a practical build" },
  { icon: HelpCircle, label: "Quiz", desc: "Test your understanding" },
  { icon: ArrowDown, label: "Next Topic", desc: "Continue the learning path" },
];

export function LearningModeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="hover-glow overflow-hidden rounded-default border border-border bg-surface/80 backdrop-blur-sm"
    >
      <div className="border-b border-border p-6 md:p-8">
        <p className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Learning Mode
        </p>
        <h3 className="mt-2 font-heading text-xl font-medium tracking-tight md:text-2xl">
          Learn step-by-step, not just answers
        </h3>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
          The AI can teach robotics concepts progressively — from fundamentals
          to hands-on examples — instead of only answering one-off questions.
        </p>
      </div>
      <div className="flex flex-col items-center gap-0 p-6 md:flex-row md:justify-center md:gap-2 md:p-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex flex-col items-center md:flex-row">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex w-[140px] flex-col items-center rounded-[12px] border border-border bg-background/60 px-4 py-4 text-center"
              >
                <Icon className="h-4 w-4 text-muted" strokeWidth={1.75} />
                <p className="mt-2 font-heading text-[12px] font-medium">
                  {step.label}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {step.desc}
                </p>
              </motion.div>
              {index < steps.length - 1 && (
                <ArrowDown className="my-2 h-4 w-4 rotate-90 text-muted-foreground/40 md:my-0 md:mx-1 md:rotate-0" strokeWidth={1.5} />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
