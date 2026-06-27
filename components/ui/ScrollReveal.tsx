"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeInUp, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={{
        hidden: fadeInUp.hidden,
        visible: {
          ...fadeInUp.visible,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
            delay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
