"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

type LearningCardProps = {
  title: string;
  description: string;
  href: string;
};

export function LearningCard({ title, description, href }: LearningCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="hover-glow group rounded-default border border-border bg-surface/80 p-5 backdrop-blur-sm"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-border bg-background/80">
        <BookOpen className="h-4 w-4 text-muted" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 font-heading text-[14px] font-medium tracking-tight">
        {title}
      </h3>
      <p className="mt-2 text-[12px] leading-relaxed text-muted">
        {description}
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium transition-colors group-hover:text-accent"
      >
        Read guide
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
      </Link>
    </motion.div>
  );
}
