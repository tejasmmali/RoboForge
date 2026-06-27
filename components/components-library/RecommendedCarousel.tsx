"use client";

import { motion } from "framer-motion";
import { Eye, Star } from "lucide-react";
import Image from "next/image";
import { ComponentBadge } from "@/components/components-library/ComponentBadge";
import type { ComponentItem } from "@/lib/components-catalog";

type RecommendedCarouselProps = {
  components: ComponentItem[];
  onQuickView: (component: ComponentItem) => void;
};

export function RecommendedCarousel({
  components,
  onQuickView,
}: RecommendedCarouselProps) {
  return (
    <div className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {components.map((component, index) => (
        <motion.article
          key={component.slug}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.06 }}
          whileHover={{ y: -4 }}
          className="hover-glow w-[260px] shrink-0 overflow-hidden rounded-default border border-border bg-surface shadow-soft sm:w-[280px]"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={component.image}
              alt={component.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-[1.04]"
              sizes="280px"
            />
            <ComponentBadge
              variant="category"
              className="absolute left-3 top-3 bg-surface/90 backdrop-blur-sm"
            >
              {component.categoryLabel}
            </ComponentBadge>
          </div>
          <div className="p-4">
            <h4 className="font-heading text-[14px] font-medium tracking-tight">
              {component.name}
            </h4>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" strokeWidth={1.5} />
                {component.rating}
              </span>
              <span>{component.projectCount} projects</span>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onQuickView(component)}
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-accent"
            >
              <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
              Quick View
            </motion.button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
