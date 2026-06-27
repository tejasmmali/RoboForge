"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  Clock,
  Download,
  IndianRupee,
  Package,
  Share2,
} from "lucide-react";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { ProjectProgress } from "@/components/project-detail/ProjectProgress";
import type { ProjectDetail } from "@/lib/project-details";
import { sidebarNavItems } from "@/lib/project-details";
import { cn } from "@/lib/utils";

type ProjectSidebarProps = {
  project: ProjectDetail;
  activeSection: string;
  currentStep?: number;
};

export function ProjectSidebar({
  project,
  activeSection,
  currentStep = 1,
}: ProjectSidebarProps) {
  const [saved, setSaved] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <aside className="space-y-5 lg:sticky lg:top-[calc(var(--nav-height)+1rem)] lg:max-h-[calc(100dvh-var(--nav-height)-2rem)] lg:overflow-y-auto">
      <div className="rounded-default border border-border bg-surface/80 p-5 backdrop-blur-md">
        <ProjectProgress
          currentStep={currentStep}
          totalSteps={project.totalSteps}
        />

        <div className="mt-5 space-y-3 border-t border-border pt-5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1.5 text-muted">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
              Time
            </span>
            <span className="font-medium">{project.time}</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1.5 text-muted">
              <Package className="h-3.5 w-3.5" strokeWidth={1.75} />
              Components
            </span>
            <span className="font-medium">{project.componentCount}</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1.5 text-muted">
              <IndianRupee className="h-3.5 w-3.5" strokeWidth={1.75} />
              Cost
            </span>
            <span className="font-medium">{project.cost.replace("₹", "")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-muted">Difficulty</span>
            <DifficultyBadge difficulty={project.difficulty} />
          </div>
        </div>

        <div className="mt-5 flex gap-2 border-t border-border pt-5">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSaved((s) => !s)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-default border py-2 text-[12px] font-medium transition-colors",
              saved
                ? "border-accent/30 bg-accent/5 text-accent"
                : "border-border hover:border-border-strong",
            )}
          >
            <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} strokeWidth={1.75} />
            Save
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-default border border-border py-2 text-[12px] font-medium transition-colors hover:border-border-strong"
          >
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            Share
          </motion.button>
        </div>
      </div>

      <div className="rounded-default border border-border bg-surface/80 p-5 backdrop-blur-md">
        <p className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Quick Navigation
        </p>
        <nav className="mt-3 flex flex-col gap-0.5" aria-label="Page sections">
          {sidebarNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className={cn(
                "rounded-[8px] px-3 py-2 text-left text-[13px] transition-colors",
                activeSection === item.id
                  ? "bg-foreground text-background"
                  : "text-muted hover:bg-background hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-default border border-border bg-surface/80 p-5 backdrop-blur-md">
        <p className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Downloads
        </p>
        <ul className="mt-3 space-y-2" role="list">
          {project.downloads.slice(0, 3).map((dl) => (
            <li key={dl.id}>
              <a
                href="#downloads"
                className="flex items-center gap-2 text-[12px] text-muted transition-colors hover:text-foreground"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                {dl.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
