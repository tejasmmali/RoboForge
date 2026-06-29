"use client";

import { motion } from "framer-motion";
import { ExternalLink, Eye, Star } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
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
  const topSpecs = component.specifications.slice(0, 2);
  const tags = component.compatibility.slice(0, 3);

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="hover-glow group flex h-full min-h-[480px] flex-col overflow-hidden rounded-default border border-border bg-surface shadow-soft"
    >
      <div className="relative aspect-[5/4] shrink-0 overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/10 to-muted/30">
        <SafeImage
          src={component.image}
          alt={component.name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 300px"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <ComponentBadge variant="category">{component.categoryLabel}</ComponentBadge>
          {component.beginnerFriendly && (
            <ComponentBadge variant="beginner">Beginner</ComponentBadge>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-h-[2.5rem] font-heading text-[15px] font-medium leading-snug tracking-tight">
            {component.name}
          </h3>
          <AvailabilityDot status={component.availability} />
        </div>

        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-[13px] leading-relaxed text-muted">
          {component.shortDescription}
        </p>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {component.rating.toFixed(1)}
          </span>
          <span aria-hidden>·</span>
          <span>{component.priceRange}</span>
        </div>

        <div className="mt-4 min-h-[2.75rem] space-y-1.5">
          {topSpecs.map((spec) => (
            <div
              key={spec.label}
              className="flex justify-between gap-3 text-[11px] text-muted-foreground"
            >
              <span className="truncate">{spec.label}</span>
              <span className="shrink-0 font-medium text-foreground">{spec.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex min-h-[1.75rem] flex-wrap gap-1.5">
          {tags.map((item) => (
            <ComponentBadge key={item} variant="compatibility">
              {item}
            </ComponentBadge>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-5">
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
