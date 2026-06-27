"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const variants = {
  primary:
    "border border-foreground bg-foreground text-background hover:bg-foreground/90",
  secondary:
    "border border-border bg-surface text-foreground hover:border-border-strong",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        className={cn(
          "hover-glow inline-flex items-center justify-center gap-2 rounded-default px-5 py-2.5 text-[13px] font-medium transition-colors",
          variants[variant],
          className,
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
}
