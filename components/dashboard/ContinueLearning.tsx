"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import type { ContinueProject } from "@/types/dashboard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";

type ContinueLearningProps = {
  projects: ContinueProject[];
  embedded?: boolean;
};

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export function ContinueLearning({ projects, embedded }: ContinueLearningProps) {
  const content = projects.length === 0 ? (
        <DashboardEmptyState
          title="No projects in progress"
          description="Start your first robotics project and track your progress here."
          actionLabel="Browse Projects"
          actionHref="/projects"
        />
      ) : (
        <div className="space-y-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              whileHover={{ scale: 1.005 }}
              className="hover-glow group overflow-hidden rounded-default border border-border bg-surface/80 backdrop-blur-sm"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-48">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/20 sm:bg-gradient-to-t sm:from-surface/40" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
                  <div>
                    <h3 className="font-heading text-[15px] font-medium">
                      {project.title}
                    </h3>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-muted">
                        <span>{project.progress}% Complete</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" strokeWidth={1.75} />
                          {project.estimatedRemaining} left
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-border">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full bg-foreground"
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Last opened {formatRelative(project.lastOpened)}
                    </p>
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="mt-4 inline-flex w-fit items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-accent"
                  >
                    Resume
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );

  if (embedded) return content;

  return (
    <section id="continue" className="scroll-mt-24">
      <div className="mb-5">
        <h2 className="font-heading text-lg font-medium tracking-tight">
          Continue Building
        </h2>
        <p className="mt-0.5 text-[13px] text-muted">
          Pick up where you left off
        </p>
      </div>
      {content}
    </section>
  );
}
