"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { projects } from "@/lib/projects";

type RelatedProjectsProps = {
  slugs: string[];
  currentSlug: string;
};

export function RelatedProjects({ slugs, currentSlug }: RelatedProjectsProps) {
  const related = slugs
    .filter((s) => s !== currentSlug)
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <div className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {related.map((project, index) => {
        if (!project) return null;
        return (
          <motion.article
            key={project.slug}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -4 }}
            className="hover-glow w-[280px] shrink-0 overflow-hidden rounded-default border border-border bg-surface shadow-soft sm:w-[300px]"
          >
            <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-b from-muted/10 to-muted/25">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-contain p-3 transition-transform duration-500 hover:scale-[1.03]"
                sizes="300px"
              />
              <DifficultyBadge
                difficulty={project.difficulty}
                className="absolute left-3 top-3"
              />
            </div>
            <div className="p-4">
              <h4 className="font-heading text-[14px] font-medium tracking-tight">
                {project.title}
              </h4>
              <Link
                href={`/projects/${project.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium transition-colors hover:text-accent"
              >
                Open Project
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </Link>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
