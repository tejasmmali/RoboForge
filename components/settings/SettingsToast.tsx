"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type SettingsToastProps = {
  message: string | null;
  onDismiss: () => void;
};

export function SettingsToast({ message, onDismiss }: SettingsToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-surface/95 px-4 py-2.5 shadow-elevated backdrop-blur-md"
        >
          <CheckCircle2 className="h-4 w-4 text-foreground" strokeWidth={1.75} />
          <span className="text-[13px] font-medium">{message}</span>
          <button
            type="button"
            onClick={onDismiss}
            className="ml-2 text-[11px] text-muted hover:text-foreground"
          >
            Dismiss
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-32 rounded-default bg-border/60" />
      <div className="h-48 rounded-default bg-border/50" />
      <div className="h-40 rounded-default bg-border/40" />
    </div>
  );
}
