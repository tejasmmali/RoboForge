"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { SuggestionCard } from "@/components/chat/SuggestionCard";
import { suggestedPrompts } from "@/lib/chat-data";
import type { QuickCategory } from "@/types/chat";

type ChatWelcomeProps = {
  onSend: (text: string, category?: QuickCategory) => void;
  category?: QuickCategory;
};

export function ChatWelcome({ onSend }: ChatWelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-full flex-col items-center justify-center px-4 py-10"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface shadow-soft"
      >
        <Bot className="h-7 w-7 text-foreground" strokeWidth={1.5} />
      </motion.div>

      <h1 className="text-center font-heading text-2xl font-medium tracking-tight md:text-3xl">
        How can I help you build today?
      </h1>
      <p className="mt-3 max-w-md text-center text-[15px] leading-relaxed text-muted">
        Ask about Arduino, ESP32, sensors, motors, wiring, or project
        troubleshooting.
      </p>

      <div className="mt-10 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
        {suggestedPrompts.map((prompt, index) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.08 + index * 0.04,
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <SuggestionCard
              label={prompt.label}
              onClick={() => onSend(prompt.prompt, prompt.category)}
            />
          </motion.div>
        ))}
      </div>

      <p className="mt-8 flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
        Powered by Gemini · Robotics-focused responses
      </p>
    </motion.div>
  );
}
