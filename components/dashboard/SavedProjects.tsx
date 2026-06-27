"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BookmarkMinus } from "lucide-react";
import type { SavedProject } from "@/types/dashboard";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";

type SavedProjectsProps = {
  projects: SavedProject[];
  embedded?: boolean;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function SavedProjects({ projects, embedded }: SavedProjectsProps) {
  const content =
    projects.length === 0 ? (
      <DashboardEmptyState
        title="No saved projects yet"
        description="Start your first robotics project and save it for later."
        actionLabel="Browse Projects"
        actionHref="/projects"
      />
    ) : (
      <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              className="hover-glow group overflow-hidden rounded-default border border-border bg-surface/80 backdrop-blur-sm"
            >
              <div className="relative h-36">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-[14px] font-medium leading-snug">
                    {project.title}
                  </h3>
                  <DifficultyBadge difficulty={project.difficulty} />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Saved {formatDate(project.saved_at)}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/projects/${project.project_slug}`}
                    className="inline-flex items-center gap-1 text-[12px] font-medium transition-colors hover:text-accent"
                  >
                    Open Project
                    <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
                  </Link>
                  <button
                    type="button"
                    className="ml-auto flex items-center gap-1 text-[11px] text-muted transition-colors hover:text-foreground"
                    aria-label="Remove bookmark"
                  >
                    <BookmarkMinus className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );

  if (embedded) return content;

  return (
    <section id="saved-projects" className="scroll-mt-24">
      <div className="mb-5">
        <h2 className="font-heading text-lg font-medium tracking-tight">
          Saved Projects
        </h2>
        <p className="mt-0.5 text-[13px] text-muted">Your bookmarked builds</p>
      </div>
      {content}
    </section>
  );
}
