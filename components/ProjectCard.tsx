"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Clock,
  Cpu,
  Gauge,
  IndianRupee,
  Package,
  Radio,
  Settings2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { useToggleProjectBookmark } from "@/hooks/useBookmarks";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { ProgressBadge } from "@/components/ProgressBadge";
import type { Project, ProjectTechnology } from "@/lib/projects";
import type { ProjectCardData } from "@/lib/projects";
import { getProjectImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type ProjectCardProps =
  | { project: Project; variant?: "full" }
  | { project: ProjectCardData; variant: "compact" };

const techIcons: Record<
  ProjectTechnology,
  { icon: typeof Cpu; label: string }
> = {
  arduino: { icon: Cpu, label: "Arduino" },
  esp32: { icon: Radio, label: "ESP32" },
  "raspberry-pi": { icon: Cpu, label: "RPi" },
  sensor: { icon: Gauge, label: "Sensor" },
  motor: { icon: Zap, label: "Motor" },
  servo: { icon: Settings2, label: "Servo" },
};

function isFullProject(
  project: Project | ProjectCardData,
): project is Project {
  return "technologies" in project;
}

export function ProjectCard(props: ProjectCardProps) {
  const { project, variant = isFullProject(props.project) ? "full" : "compact" } =
    props;

  const imageUrl = isFullProject(project)
    ? project.image
    : getProjectImage(project.slug);

  const bookmarkMeta = {
    projectSlug: project.slug,
    title: project.title,
    difficulty: project.difficulty,
    image: imageUrl,
  };
  const { isSaved: saved, toggle: toggleBookmark } = useToggleProjectBookmark(bookmarkMeta);

  if (variant === "compact") {
    const compact = project as ProjectCardData;
    return (
      <motion.article
        whileHover={{ y: -5 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="group hover-glow flex h-full min-h-[480px] flex-col overflow-hidden rounded-default border border-border bg-surface shadow-soft"
      >
        <div className="relative aspect-[5/4] shrink-0 overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/10 to-muted/30">
          <SafeImage
            src={imageUrl}
            alt={compact.title}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <DifficultyBadge
            difficulty={compact.difficulty as Project["difficulty"]}
            className="absolute left-4 top-4"
          />
        </div>
        <div className="flex flex-[3] flex-col p-5 md:p-6">
          <h3 className="font-heading text-[16px] font-medium tracking-tight">
            {compact.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
            {compact.description}
          </p>
          <div className="mt-auto flex items-center justify-between pt-4">
            <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
                {compact.time}
              </span>
              <span className="flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5" strokeWidth={1.75} />
                {compact.cost}
              </span>
            </div>
            <Link
              href={`/projects/${compact.slug}`}
              className="inline-flex items-center gap-1 text-[13px] font-medium transition-colors group-hover:text-accent"
            >
              Open
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </motion.article>
    );
  }

  const full = project as Project;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group hover-glow flex h-full min-h-[520px] flex-col overflow-hidden rounded-default border border-border bg-surface shadow-soft"
    >
      <div className="relative aspect-[5/4] shrink-0 overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/10 to-muted/30">
        <SafeImage
          src={full.image}
          alt={full.title}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <DifficultyBadge difficulty={full.difficulty} />
          <span className="rounded-[8px] border border-border/80 bg-surface/90 px-2.5 py-1 font-heading text-[10px] font-medium uppercase tracking-wider text-foreground backdrop-blur-md">
            {full.category}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-5 md:p-6">
        <h3 className="line-clamp-2 min-h-[2.5rem] font-heading text-[16px] font-medium leading-snug tracking-tight">
          {full.title}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-[13px] leading-relaxed text-muted">
          {full.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
            {full.time}
          </span>
          <span className="flex items-center gap-1.5">
            <IndianRupee className="h-3.5 w-3.5" strokeWidth={1.75} />
            {full.cost.replace("₹", "")}
          </span>
          <span className="flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" strokeWidth={1.75} />
            {full.componentCount} components
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {full.technologies.slice(0, 5).map((tech) => {
            const { icon: Icon, label } = techIcons[tech];
            return (
              <span
                key={tech}
                title={label}
                className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-border bg-background/80 text-muted"
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
              </span>
            );
          })}
        </div>

        <ProgressBadge value={full.complexity} className="mt-4" />

        <div className="mt-auto flex items-center gap-2 pt-5">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Link
              href={`/projects/${full.slug}`}
              className="hover-glow flex w-full items-center justify-center gap-1.5 rounded-default border border-foreground bg-foreground py-2.5 text-[13px] font-medium text-background transition-colors"
            >
              Open Project
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </motion.div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleBookmark}
            aria-label={saved ? "Remove from saved" : "Save project"}
            aria-pressed={saved}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-default border transition-colors",
              saved
                ? "border-accent/30 bg-accent/5 text-accent"
                : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
            )}
          >
            <Bookmark
              className={cn("h-4 w-4", saved && "fill-current")}
              strokeWidth={1.75}
            />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export type { ProjectCardData };
