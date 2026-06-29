"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

type ConfirmationModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  loading,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-foreground/30 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-[90] w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-default border border-border bg-surface p-6 shadow-elevated"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                {destructive ? (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" strokeWidth={1.75} />
                  </span>
                ) : null}
                <div>
                  <h3 className="font-heading text-[15px] font-medium">{title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border text-muted hover:bg-background"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                disabled={loading}
                className="rounded-[10px] border border-border px-4 py-2 text-[13px] font-medium text-muted hover:bg-background hover:text-foreground"
              >
                {cancelLabel}
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={loading}
                className={
                  destructive
                    ? "rounded-[10px] border border-red-600 bg-red-600 px-4 py-2 text-[13px] font-medium text-white disabled:opacity-60"
                    : "rounded-[10px] border border-foreground bg-foreground px-4 py-2 text-[13px] font-medium text-background disabled:opacity-60"
                }
              >
                {loading ? "Working…" : confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
