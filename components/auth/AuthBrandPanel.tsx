"use client";

import { motion } from "framer-motion";
import { Bot, Check } from "lucide-react";
import { BlueprintGrid, TechLabel } from "@/components/visuals/LabDecor";

const features = [
  "Save Projects",
  "Continue Progress",
  "AI Chat History",
  "Bookmark Components",
];

type AuthBrandPanelProps = {
  heading?: string;
  subtitle?: string;
};

export function AuthBrandPanel({
  heading = "Welcome Back",
  subtitle = "Continue building robotics projects with your RoboForge account.",
}: AuthBrandPanelProps) {
  return (
    <div className="relative hidden overflow-hidden border-r border-border bg-surface/40 lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      <BlueprintGrid size={40} opacity={0.14} />
      <TechLabel coord="AUTH-01" className="relative">
        RoboForge Identity
      </TechLabel>

      <div className="relative mt-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-[14px] border border-border bg-background shadow-soft">
            <Bot className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-3xl font-medium tracking-tight xl:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            {subtitle}
          </p>
          <ul className="mt-8 space-y-3" role="list">
            {features.map((feature, index) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.06 }}
                className="flex items-center gap-2.5 text-[14px] text-muted"
              >
                <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <TechLabel className="relative mt-12">Secure · Supabase Auth</TechLabel>
    </div>
  );
}
