"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { AIFeature } from "@/types/chat";

type FeatureModalProps = {
  feature: AIFeature | null;
  onClose: () => void;
};

export function FeatureModal({ feature, onClose }: FeatureModalProps) {
  return (
    <AnimatePresence>
      {feature && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-[70] w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-default border border-border bg-surface p-6 shadow-elevated"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg font-medium tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-border"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
            <div className="mt-6 rounded-[12px] border border-dashed border-border bg-background/40 p-6 text-center">
              <p className="font-heading text-[13px] font-medium">
                Available in chat
              </p>
              <p className="mt-2 text-[12px] text-muted">
                Ask RoboForge AI in the assistant — specialized tools like this
                will expand in future updates.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
