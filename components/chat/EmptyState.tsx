"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { RobotIllustration } from "@/components/chat/RobotIllustration";
import { BlueprintGrid } from "@/components/visuals/LabDecor";

type EmptyStateProps = {
  onStartChat: () => void;
};

export function EmptyState({ onStartChat }: EmptyStateProps) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <BlueprintGrid size={32} opacity={0.1} />
      <RobotIllustration className="relative" />
      <h2 className="relative mt-8 font-heading text-xl font-medium tracking-tight md:text-2xl">
        Start your first robotics conversation
      </h2>
      <p className="relative mt-3 max-w-sm text-[14px] text-muted">
        Ask about Arduino, sensors, motors, wiring, or get help debugging your
        project.
      </p>
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStartChat}
        className="hover-glow relative mt-8 inline-flex items-center gap-2 rounded-default border border-foreground bg-foreground px-6 py-3 text-[13px] font-medium text-background"
      >
        <Plus className="h-4 w-4" strokeWidth={1.75} />
        Start Chatting
      </motion.button>
    </div>
  );
}
