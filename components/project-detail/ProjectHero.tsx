"use client";

import { motion } from "framer-motion";
import {
  Bookmark,
  Bot,
  Clock,
  Download,
  IndianRupee,
  Package,
  Play,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Button } from "@/components/ui/Button";
import { useToggleProjectBookmark } from "@/hooks/useBookmarks";
import type { ProjectDetail } from "@/lib/project-details";
import { BlueprintGrid, TechLabel } from "@/components/visuals/LabDecor";
import { cn } from "@/lib/utils";

type ProjectHeroProps = {
  project: ProjectDetail;
  onStartBuilding?: () => void;
};

export function ProjectHero({ project, onStartBuilding }: ProjectHeroProps) {
  const { isSaved: saved, toggle: toggleBookmark } = useToggleProjectBookmark({
    projectSlug: project.slug,
    title: project.title,
    difficulty: project.difficulty,
    image: project.image,
  });

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="relative aspect-[21/9] min-h-[280px] w-full bg-gradient-to-b from-muted/15 to-muted/35 md:min-h-[360px]">
        <SafeImage
          src={project.image}
          alt={project.title}
          fill
          priority
          className="object-contain p-6 md:p-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <BlueprintGrid size={32} opacity={0.12} />
        <TechLabel
          coord="DOC-01"
          className="absolute left-6 top-6 hidden rounded-[6px] bg-white/10 px-2 py-1 text-white/70 backdrop-blur-sm md:inline-flex"
        >
          Project Documentation
        </TechLabel>
      </div>

      <div className="relative -mt-24 px-[var(--container-padding)] pb-10 md:-mt-32 md:pb-14">
        <div className="mx-auto max-w-[var(--container-max)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl rounded-default border border-white/20 bg-white/10 p-6 backdrop-blur-xl md:p-8"
          >
            <div className="flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={project.difficulty} />
              <span className="rounded-[8px] border border-white/30 bg-white/10 px-2.5 py-1 font-heading text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                {project.category}
              </span>
            </div>

            <h1 className="mt-4 font-heading text-3xl font-medium tracking-tight text-white md:text-4xl lg:text-5xl">
              {project.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-[13px] text-white/80">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
                {project.time}
              </span>
              <span className="flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5" strokeWidth={1.75} />
                {project.cost.replace("₹", "")}
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" strokeWidth={1.75} />
                {project.componentCount} components
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStartBuilding}
                className="hover-glow inline-flex items-center gap-2 rounded-default border border-white bg-white px-5 py-2.5 text-[13px] font-medium text-foreground"
              >
                <Play className="h-3.5 w-3.5" strokeWidth={1.75} />
                Start Building
              </motion.button>
              <Button href="#downloads" variant="secondary" className="!border-white/30 !bg-white/10 !text-white hover:!bg-white/20">
                <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                Download PDF
              </Button>
              <Button href="/chatbot" variant="secondary" className="!border-white/30 !bg-white/10 !text-white hover:!bg-white/20">
                <Bot className="h-3.5 w-3.5" strokeWidth={1.75} />
                Ask AI
              </Button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleBookmark}
                aria-label={saved ? "Remove bookmark" : "Bookmark project"}
                aria-pressed={saved}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-default border backdrop-blur-sm transition-colors",
                  saved
                    ? "border-white bg-white text-foreground"
                    : "border-white/30 bg-white/10 text-white hover:bg-white/20",
                )}
              >
                <Bookmark
                  className={cn("h-4 w-4", saved && "fill-current")}
                  strokeWidth={1.75}
                />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
