"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bot, ExternalLink, Info } from "lucide-react";
import { CategoryCard } from "@/components/components-library/CategoryCard";
import { ComponentCard } from "@/components/components-library/ComponentCard";
import { ComponentModal } from "@/components/components-library/ComponentModal";
import { FeaturedComponent } from "@/components/components-library/FeaturedComponent";
import { LearningCard } from "@/components/components-library/LearningCard";
import { RecommendedCarousel } from "@/components/components-library/RecommendedCarousel";
import { SearchToolbar } from "@/components/components-library/SearchToolbar";
import { ProjectStats } from "@/components/ProjectStats";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BlueprintGrid, TechLabel } from "@/components/visuals/LabDecor";
import type { ComponentFilterChip, ComponentItem, ComponentSort } from "@/lib/components-catalog";
import {
  catalogCategories,
  components,
  filterComponents,
  getFeaturedComponent,
  getRecommendedComponents,
  learningResources,
} from "@/lib/components-catalog";

const heroStats = [
  { value: "250+", label: "Components" },
  { value: "20", label: "Categories" },
  { value: "Beginner", label: "Friendly" },
  { value: "External", label: "Purchase Links" },
];

export function ComponentsPageContent() {
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState<ComponentFilterChip>("all");
  const [sort, setSort] = useState<ComponentSort>("popular");
  const [selected, setSelected] = useState<ComponentItem | null>(null);

  const featured = getFeaturedComponent();
  const recommended = getRecommendedComponents();

  const filtered = useMemo(
    () => filterComponents(components, query, activeChip, sort),
    [query, activeChip, sort],
  );

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border py-16 md:py-24">
        <BlueprintGrid size={48} opacity={0.18} />
        <TechLabel coord="X:0 Y:0" className="absolute left-6 top-6 hidden md:inline-flex">
          Components Index
        </TechLabel>
        <TechLabel className="absolute bottom-6 right-6 hidden md:inline-flex">
          Grid Ref C1
        </TechLabel>

        <Container className="relative">
          <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <h1 className="font-heading text-4xl font-medium tracking-tight md:text-5xl lg:text-[3.25rem]">
                Robotics Components
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted">
                Browse the most commonly used robotics and electronics components.
                Learn their purpose, specifications, compatibility, and purchase
                them from trusted retailers.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <ProjectStats stats={heroStats} />
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Sticky search & filters */}
      <SearchToolbar
        query={query}
        onQueryChange={setQuery}
        activeChip={activeChip}
        onChipChange={setActiveChip}
        sort={sort}
        onSortChange={setSort}
        resultCount={filtered.length}
      />

      {/* Featured component */}
      <section className="border-b border-border py-12 md:py-16">
        <Container>
          <ScrollReveal>
            <FeaturedComponent
              component={featured}
              onViewDetails={setSelected}
            />
          </ScrollReveal>
        </Container>
      </section>

      {/* Components grid */}
      <section className="py-12 md:py-16">
        <Container>
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
            >
              {filtered.map((component, index) => (
                <ScrollReveal key={component.slug} delay={index * 0.03}>
                  <ComponentCard
                    component={component}
                    onViewDetails={setSelected}
                  />
                </ScrollReveal>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-default border border-border bg-surface/60 py-16 text-center backdrop-blur-sm">
              <p className="font-heading text-lg font-medium">No components found</p>
              <p className="mt-2 text-[14px] text-muted">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Categories */}
      <section className="border-t border-border py-16 md:py-20">
        <Container>
          <ScrollReveal>
            <SectionTitle subtitle="Explore components organized by type and application.">
              Browse by Category
            </SectionTitle>
          </ScrollReveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalogCategories.map((cat, index) => (
              <ScrollReveal key={cat.id} delay={index * 0.04}>
                <CategoryCard
                  label={cat.label}
                  count={cat.count}
                  description={cat.description}
                  icon={cat.icon}
                />
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Recommended */}
      <section className="border-t border-border py-16 md:py-20">
        <Container>
          <ScrollReveal>
            <SectionTitle subtitle="Popular parts used across RoboForge projects.">
              Recommended Components
            </SectionTitle>
          </ScrollReveal>
          <div className="mt-10">
            <RecommendedCarousel
              components={recommended}
              onQuickView={setSelected}
            />
          </div>
        </Container>
      </section>

      {/* Learning resources */}
      <section className="border-t border-border py-16 md:py-20">
        <Container>
          <ScrollReveal>
            <SectionTitle subtitle="Guides to help you choose and use components effectively.">
              Learning Resources
            </SectionTitle>
          </ScrollReveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {learningResources.map((resource, index) => (
              <ScrollReveal key={resource.id} delay={index * 0.05}>
                <LearningCard
                  title={resource.title}
                  description={resource.description}
                  href={resource.href}
                />
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* External purchase notice */}
      <section className="border-t border-border py-12 md:py-16">
        <Container>
          <ScrollReveal>
            <div className="flex gap-4 rounded-default border border-border bg-surface/80 p-6 backdrop-blur-sm md:p-8">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-border bg-background/80">
                <Info className="h-4 w-4 text-muted" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-heading text-lg font-medium tracking-tight">
                  External Purchase
                </h2>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted">
                  RoboForge does not sell components directly. Clicking
                  &ldquo;Buy Now&rdquo; redirects to trusted retailers such as
                  Amazon, Robu.in, or Robocraze for purchasing.
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                  No cart, checkout, or payment on RoboForge
                </p>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border py-16 md:py-20">
        <Container>
          <ScrollReveal>
            <div className="rounded-default border border-border bg-surface/80 px-8 py-12 text-center backdrop-blur-sm md:px-12">
              <h2 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
                Need help choosing components?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] text-muted">
                Ask the AI assistant or browse projects to see what parts you
                need.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button href="/chatbot">
                  <Bot className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Ask AI Assistant
                </Button>
                <Button href="/projects" variant="secondary">
                  Browse Projects
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <ComponentModal component={selected} onClose={() => setSelected(null)} />
    </>
  );
}
