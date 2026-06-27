"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import {
  AvailabilityDot,
  ComponentBadge,
} from "@/components/components-library/ComponentBadge";
import type { ComponentItem } from "@/lib/components-catalog";
import { BlueprintGrid, TechLabel } from "@/components/visuals/LabDecor";

type FeaturedComponentProps = {
  component: ComponentItem;
  onViewDetails: (component: ComponentItem) => void;
};

export function FeaturedComponent({
  component,
  onViewDetails,
}: FeaturedComponentProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="hover-glow relative overflow-hidden rounded-default border border-border bg-surface shadow-soft"
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[280px] lg:min-h-[380px]">
          <Image
            src={component.image}
            alt={component.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
          />
          <div className="absolute inset-0 bg-foreground/10" />
          <BlueprintGrid size={24} opacity={0.2} />
          <TechLabel
            coord="FEAT-C01"
            className="absolute left-4 top-4 rounded-[6px] bg-white/70 px-2 py-1 backdrop-blur-sm"
          >
            Featured Component
          </TechLabel>
        </div>

        <div className="flex flex-col justify-center p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <ComponentBadge variant="category">{component.categoryLabel}</ComponentBadge>
            {component.beginnerFriendly && (
              <ComponentBadge variant="beginner">Beginner Friendly</ComponentBadge>
            )}
            <AvailabilityDot status={component.availability} />
          </div>

          <h2 className="mt-4 font-heading text-2xl font-medium tracking-tight md:text-3xl">
            {component.name}
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            {component.description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {component.specifications.map((spec) => (
              <div
                key={spec.label}
                className="rounded-[12px] border border-border bg-background/40 px-3 py-2"
              >
                <p className="font-heading text-[10px] uppercase tracking-wider text-muted-foreground">
                  {spec.label}
                </p>
                <p className="mt-0.5 text-[13px] font-medium">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Compatible Projects
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {component.exampleProjects.map((project) => (
                <ComponentBadge key={project.slug} variant="compatibility">
                  {project.title}
                </ComponentBadge>
              ))}
              {component.compatibility.slice(0, 2).map((item) => (
                <ComponentBadge key={item} variant="compatibility">
                  {item}
                </ComponentBadge>
              ))}
            </div>
          </div>

          <p className="mt-5 font-heading text-[13px] font-medium">
            {component.priceRange}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewDetails(component)}
              className="hover-glow inline-flex items-center gap-2 rounded-default border border-foreground bg-foreground px-5 py-2.5 text-[13px] font-medium text-background"
            >
              <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
              View Details
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </motion.button>
            <motion.a
              href={component.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="hover-glow inline-flex items-center gap-2 rounded-default border border-border bg-surface px-5 py-2.5 text-[13px] font-medium transition-colors hover:border-border-strong"
            >
              Buy Now
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
