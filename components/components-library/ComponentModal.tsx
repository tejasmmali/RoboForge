"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Download,
  ExternalLink,
  FileText,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  AvailabilityDot,
  ComponentBadge,
} from "@/components/components-library/ComponentBadge";
import { useToggleComponentBookmark } from "@/hooks/useBookmarks";
import type { ComponentItem } from "@/lib/components-catalog";
import { cn } from "@/lib/utils";

type ComponentModalProps = {
  component: ComponentItem | null;
  onClose: () => void;
};

export function ComponentModal({ component, onClose }: ComponentModalProps) {
  const [mounted, setMounted] = useState(false);
  const { isSaved, toggle: toggleBookmark } = useToggleComponentBookmark({
    componentSlug: component?.slug ?? "",
    name: component?.name,
    category: component?.categoryLabel,
    image: component?.image,
    specifications: component?.specifications.map((s) => `${s.label}: ${s.value}`).join(" · "),
    buyUrl: component?.buyUrl,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!component) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [component, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {component && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="absolute inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 pt-[calc(var(--nav-height)+1rem)]">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="component-modal-title"
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-3xl overflow-hidden rounded-default border border-border bg-surface shadow-elevated"
              >
            <div className="relative aspect-video w-full overflow-hidden border-b border-border">
              <Image
                src={component.image}
                alt={component.name}
                fill
                className="object-cover"
                sizes="768px"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/80 backdrop-blur-md transition-colors hover:bg-white"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <ComponentBadge variant="category">
                  {component.categoryLabel}
                </ComponentBadge>
                {component.beginnerFriendly && (
                  <ComponentBadge variant="beginner">Beginner</ComponentBadge>
                )}
                <AvailabilityDot status={component.availability} />
                <span className="ml-auto flex items-center gap-1 text-[12px] text-muted">
                  <Star className="h-3.5 w-3.5 fill-current" strokeWidth={1.5} />
                  {component.rating} · {component.projectCount} projects
                </span>
              </div>

              <h2
                id="component-modal-title"
                className="mt-4 font-heading text-2xl font-medium tracking-tight"
              >
                {component.name}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {component.fullDescription}
              </p>

              <div className="mt-8">
                <h3 className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Specifications
                </h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {component.specifications.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex justify-between rounded-[12px] border border-border bg-background/40 px-3 py-2 text-[13px]"
                    >
                      <span className="text-muted">{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Operating Voltage", value: component.operatingVoltage },
                  { label: "Current Consumption", value: component.currentConsumption },
                  { label: "Communication", value: component.communicationProtocol },
                  { label: "Pins", value: component.pins },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-default border border-border bg-surface/60 p-4 backdrop-blur-sm"
                  >
                    <p className="font-heading text-[10px] uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[13px] text-muted">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Compatible Boards
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {component.compatibleBoards.map((board) => (
                    <ComponentBadge key={board} variant="compatibility">
                      {board}
                    </ComponentBadge>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Applications
                  </h3>
                  <ul className="mt-2 space-y-1.5" role="list">
                    {component.applications.map((app) => (
                      <li key={app} className="text-[13px] text-muted">
                        · {app}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Example Projects
                  </h3>
                  <ul className="mt-2 space-y-1.5" role="list">
                    {component.exampleProjects.length > 0 ? (
                      component.exampleProjects.map((project) => (
                        <li key={project.slug}>
                          <Link
                            href={`/projects/${project.slug}`}
                            className="text-[13px] text-accent hover:underline"
                          >
                            {project.title}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="text-[13px] text-muted">Browse related projects</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleBookmark}
                  aria-label={isSaved ? "Remove bookmark" : "Save component"}
                  aria-pressed={isSaved}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-default border px-4 py-2.5 text-[13px] font-medium transition-colors",
                    isSaved
                      ? "border-accent/30 bg-accent/5 text-accent"
                      : "border-border text-muted hover:border-border-strong hover:text-foreground",
                  )}
                >
                  <Bookmark className={cn("h-3.5 w-3.5", isSaved && "fill-current")} strokeWidth={1.75} />
                  {isSaved ? "Saved" : "Save"}
                </motion.button>
                {component.datasheetUrl && (
                  <a
                    href={component.datasheetUrl}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-foreground"
                  >
                    <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Datasheet
                  </a>
                )}
                {component.tutorialUrl && (
                  <Link
                    href={component.tutorialUrl}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-foreground"
                  >
                    <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Tutorial
                  </Link>
                )}
                <motion.a
                  href={component.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hover-glow ml-auto inline-flex items-center gap-2 rounded-default border border-foreground bg-foreground px-5 py-2.5 text-[13px] font-medium text-background"
                >
                  Buy Now
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                </motion.a>
              </div>
            </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
