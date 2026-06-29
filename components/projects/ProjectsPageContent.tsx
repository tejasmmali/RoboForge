"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { FeaturedProject } from "@/components/FeaturedProject";
import { LearningRoadmap } from "@/components/LearningRoadmap";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilters } from "@/components/ProjectFilters";
import { ProjectStats } from "@/components/ProjectStats";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BlueprintGrid, TechLabel } from "@/components/visuals/LabDecor";
import { CATALOG_STATS } from "@/lib/content/catalog-stats";
import type { FilterChip, SortOption } from "@/lib/projects";
import {
  featuredProjectSlug,
  filterProjects,
  getCategoryCounts,
  getRecentlyAdded,
  projects,
} from "@/lib/projects";

const heroStats = [
  { value: String(CATALOG_STATS.projectCount), label: "Projects" },
  { value: "4", label: "Difficulty Levels" },
  { value: "AI", label: "Guided" },
  { value: "Open", label: "Source" },
];

export function ProjectsPageContent() {
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState<FilterChip>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(
    () => filterProjects(projects, query, activeChip, sort),
    [query, activeChip, sort],
  );

  const featured = projects.find((p) => p.slug === featuredProjectSlug)!;
  const recentlyAdded = getRecentlyAdded(projects);
  const categories = getCategoryCounts();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border py-16 md:py-24">
        <BlueprintGrid size={48} opacity={0.18} />
        <TechLabel coord="X:0 Y:0" className="absolute left-6 top-6 hidden md:inline-flex">
          Projects Index
        </TechLabel>
        <TechLabel className="absolute bottom-6 right-6 hidden md:inline-flex">
          Grid Ref A1
        </TechLabel>

        <Container className="relative">
          <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <h1 className="font-heading text-4xl font-medium tracking-tight md:text-5xl lg:text-[3.25rem]">
                Robotics Projects
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted">
                Explore step-by-step robotics projects designed for beginners to
                advanced makers. Every project includes wiring diagrams, source
                code, required components, troubleshooting, and AI assistance.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <ProjectStats stats={heroStats} />
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Sticky filters */}
      <ProjectFilters
        query={query}
        onQueryChange={setQuery}
        activeChip={activeChip}
        onChipChange={setActiveChip}
        sort={sort}
        onSortChange={setSort}
        resultCount={filtered.length}
      />

      {/* Project grid */}
      <section className="py-12 md:py-16">
        <Container>
          {filtered.length > 0 ? (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, index) => (
                <ScrollReveal
                  key={project.slug}
                  delay={index * 0.04}
                  className="h-full"
                >
                  <ProjectCard project={project} variant="full" />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="rounded-default border border-border bg-surface/60 py-16 text-center backdrop-blur-sm">
              <p className="font-heading text-lg font-medium">No projects found</p>
              <p className="mt-2 text-[14px] text-muted">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Featured banner */}
      <section className="border-t border-border py-16 md:py-20">
        <Container>
          <FeaturedProject project={featured} />
        </Container>
      </section>

      {/* Categories */}
      <section className="border-t border-border py-16 md:py-20">
        <Container>
          <ScrollReveal>
            <SectionTitle subtitle="Browse projects by technology and application area.">
              Categories
            </SectionTitle>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, index) => (
              <ScrollReveal key={cat.id} delay={index * 0.05}>
                <CategoryCard
                  label={cat.label}
                  count={cat.count}
                  icon={cat.icon}
                />
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Learning roadmap */}
      <section className="border-t border-border py-16 md:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <ScrollReveal>
              <SectionTitle
                subtitle="Track your journey from first circuit to industrial-grade robotics."
                className="mb-0"
              >
                Your Learning Path
              </SectionTitle>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-muted">
                Complete projects at each level to unlock advanced builds. Your
                progress syncs across all devices when you sign in.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <LearningRoadmap />
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Recently added */}
      <section className="border-t border-border py-16 md:py-20">
        <Container>
          <ScrollReveal>
            <div className="mb-8 flex items-end justify-between gap-4">
              <SectionTitle className="mb-0">Recently Added</SectionTitle>
              <Link
                href="#"
                className="hidden items-center gap-1 text-[13px] font-medium text-muted transition-colors hover:text-foreground sm:inline-flex"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </Link>
            </div>
          </ScrollReveal>

          <div className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {recentlyAdded.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                className="w-[300px] shrink-0 sm:w-[320px]"
              >
                <ProjectCard project={project} variant="full" />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <div className="mx-auto max-w-2xl rounded-default border border-border bg-surface/80 px-8 py-14 text-center backdrop-blur-sm md:px-12">
              <h2 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
                Can&apos;t find the project you&apos;re looking for?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] text-muted">
                Ask our AI assistant for guidance or request a new project to
                be added to the library.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button href="/chatbot">Ask AI Assistant</Button>
                <Button href="/about" variant="secondary">
                  Request a Project
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
