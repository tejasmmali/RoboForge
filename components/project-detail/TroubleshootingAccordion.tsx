"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { TroubleshootingItem } from "@/lib/project-details";

type TroubleshootingAccordionProps = {
  items: TroubleshootingItem[];
};

export function TroubleshootingAccordion({ items }: TroubleshootingAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.title}
            className="overflow-hidden rounded-default border border-border bg-surface/80 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-background/50"
              aria-expanded={isOpen}
            >
              <span className="font-heading text-[14px] font-medium tracking-tight">
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <ChevronDown className="h-4 w-4 text-muted" strokeWidth={1.75} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="border-t border-border px-5 py-4">
                    <p className="text-[14px] leading-relaxed text-muted">
                      {item.solution}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
