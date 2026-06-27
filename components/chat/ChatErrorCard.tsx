"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  KeyRound,
  ServerCrash,
  WifiOff,
  Clock,
} from "lucide-react";
import type { ChatError } from "@/types/chat";
import { cn } from "@/lib/utils";

const ERROR_ICONS = {
  network: WifiOff,
  rate_limit: Clock,
  invalid_key: KeyRound,
  server: ServerCrash,
  empty: AlertCircle,
  unknown: AlertCircle,
} as const;

type ChatErrorCardProps = {
  error: ChatError;
  onRetry?: () => void;
  className?: string;
};

export function ChatErrorCard({ error, onRetry, className }: ChatErrorCardProps) {
  const Icon = ERROR_ICONS[error.code] ?? AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-[16px] border border-border bg-surface/90 p-4 shadow-soft backdrop-blur-md",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background">
          <Icon className="h-4 w-4 text-muted" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-[13px] font-medium text-foreground">
            {error.code === "rate_limit"
              ? "Rate limit reached"
              : error.code === "network"
                ? "No connection"
                : error.code === "invalid_key"
                  ? "API configuration error"
                  : "Unable to respond"}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            {error.message}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-[10px] border border-border px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-background"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
