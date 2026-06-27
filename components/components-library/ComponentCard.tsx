"use client";

import { motion } from "framer-motion";
import { ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import {
  AvailabilityDot,
  ComponentBadge,
} from "@/components/components-library/ComponentBadge";
import type { ComponentItem } from "@/lib/components-catalog";
import { cn } from "@/lib/utils";

type ComponentCardProps = {
  component: ComponentItem;
  onViewDetails: (component: ComponentItem) => void;
};

export function ComponentCard({ component, onViewDetails }: ComponentCardProps) {
  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="hover-glow group flex flex-col overflow-hidden rounded-default border border-border bg-surface shadow-soft"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={component.image}
          alt={component.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 100vw, 300px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <ComponentBadge variant="category">{component.categoryLabel}</ComponentBadge>
          {component.beginnerFriendly && (
            <ComponentBadge variant="beginner">Beginner</ComponentBadge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-[15px] font-medium tracking-tight">
            {component.name}
          </h3>
          <AvailabilityDot status={component.availability} />
        </div>

        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {component.shortDescription}
        </p>

        <div className="mt-4 space-y-1.5">
          {component.specifications.slice(0, 2).map((spec) => (
            <div
              key={spec.label}
              className="flex justify-between text-[11px] text-muted-foreground"
            >
              <span>{spec.label}</span>
              <span className="font-medium text-foreground">{spec.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {component.compatibility.slice(0, 3).map((item) => (
            <ComponentBadge key={item} variant="compatibility">
              {item}
            </ComponentBadge>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewDetails(component)}
            className={cn(
              "hover-glow flex flex-1 items-center justify-center gap-1.5 rounded-default border border-foreground bg-foreground py-2.5 text-[13px] font-medium text-background transition-colors",
            )}
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
            View Details
          </motion.button>
          <motion.a
            href={component.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hover-glow flex flex-1 items-center justify-center gap-1.5 rounded-default border border-border bg-surface py-2.5 text-[13px] font-medium transition-colors hover:border-border-strong"
          >
            Buy Now
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}
