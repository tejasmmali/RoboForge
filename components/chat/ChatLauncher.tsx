"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useGlobalChat } from "@/components/chat/GlobalChatProvider";
import { cn } from "@/lib/utils";

export function ChatLauncher() {
  const { isFullPage, isPanelOpen, togglePanel, openQuickChat } = useGlobalChat();

  if (isFullPage) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[70] flex flex-col items-end gap-2">
      {!isPanelOpen && (
        <span
          role="tooltip"
          className="pointer-events-none rounded-full border border-border bg-surface/95 px-3 py-1.5 text-[11px] font-medium text-muted shadow-soft backdrop-blur-md"
        >
          Ask RoboForge AI
        </span>
      )}

      <motion.button
        type="button"
        onClick={() => (isPanelOpen ? togglePanel() : openQuickChat())}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "chat-launcher-glow pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-border/80 bg-surface/90 shadow-elevated backdrop-blur-xl transition-colors hover:border-accent/30",
          isPanelOpen && "border-accent/40",
        )}
        aria-label={isPanelOpen ? "Close AI assistant" : "Ask RoboForge AI"}
        aria-expanded={isPanelOpen}
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
          <Bot className="h-5 w-5" strokeWidth={1.75} />
          <span className="absolute inset-0 rounded-full bg-accent/20 blur-md" aria-hidden />
        </span>
      </motion.button>
    </div>
  );
}
