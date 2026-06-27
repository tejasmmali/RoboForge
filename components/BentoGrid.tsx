"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Download } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  AIChatPreview,
  CommunityNetwork,
  ComponentLibraryPreview,
  ProjectsPreview,
  RoadmapPreview,
} from "@/components/visuals/BentoPreviews";
import { BlueprintGrid } from "@/components/visuals/LabDecor";
import { cn } from "@/lib/utils";

type BentoCardProps = {
  children: ReactNode;
  className?: string;
};

function BentoCard({ children, className }: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "surface-elevated hover-glow group relative flex flex-col overflow-hidden p-5 md:p-6",
        className,
      )}
    >
      <BlueprintGrid size={20} opacity={0.15} className="rounded-default" />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </motion.div>
  );
}

function CardHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </h3>
  );
}

function CardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-medium text-foreground transition-colors group-hover:text-accent"
    >
      {children}
      <ArrowRight
        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
        strokeWidth={1.75}
      />
    </Link>
  );
}

const projectCategories = [
  "Line Follower",
  "Obstacle Robot",
  "Robotic Arm",
  "Drone",
  "IoT",
  "Home Automation",
  "Agriculture",
  "Computer Vision",
] as const;

const downloads = [
  "Circuit Diagrams",
  "Arduino Libraries",
  "Source Code",
  "Datasheets",
  "CAD Files",
  "PDF Guides",
] as const;

const features = [
  "Step-by-Step Guides",
  "AI Assistance",
  "Component Catalog",
  "Project Documentation",
  "Responsive Design",
  "Beginner Friendly",
] as const;

export function BentoGrid() {
  return (
    <section className="relative py-20 md:py-28">
      <Container>
        <ScrollReveal>
          <SectionTitle>
            Everything You Need To Build Robots
          </SectionTitle>
        </ScrollReveal>

        <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <ScrollReveal className="lg:col-span-2 lg:row-span-2">
            <BentoCard className="min-h-[400px] lg:min-h-[440px]">
              <CardHeading>Step-by-Step Projects</CardHeading>
              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-muted">
                Learn robotics through carefully designed project guides with
                wiring diagrams, source code, assembly instructions, testing,
                and troubleshooting.
              </p>
              <ProjectsPreview />
              <CardLink href="/projects">Explore Projects</CardLink>
            </BentoCard>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <BentoCard className="min-h-[280px]">
              <CardHeading>Component Library</CardHeading>
              <ComponentLibraryPreview />
              <CardLink href="/components">Browse Components</CardLink>
            </BentoCard>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="lg:row-span-2">
            <BentoCard className="min-h-[380px] lg:min-h-full">
              <CardHeading>AI Robotics Assistant</CardHeading>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
                Ask questions while building your robot.
              </p>
              <AIChatPreview />
              <CardLink href="/chatbot">Ask AI Assistant</CardLink>
            </BentoCard>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <BentoCard className="min-h-[280px]">
              <CardHeading>Project Categories</CardHeading>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {projectCategories.map((cat) => (
                  <div
                    key={cat}
                    className="rounded-[10px] border border-border/80 bg-background/60 px-2.5 py-2.5 backdrop-blur-sm transition-colors group-hover:border-border-strong"
                  >
                    <p className="font-heading text-[10px] font-medium uppercase tracking-wider">
                      {cat}
                    </p>
                  </div>
                ))}
              </div>
            </BentoCard>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <BentoCard className="min-h-[340px] lg:row-span-2">
              <CardHeading>Learning Roadmap</CardHeading>
              <RoadmapPreview />
            </BentoCard>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <BentoCard className="min-h-[220px]">
              <CardHeading>Free Downloads</CardHeading>
              <ul className="relative mt-4 flex flex-col gap-2" role="list">
                {downloads.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-[12px] text-muted"
                  >
                    <Download className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoCard>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <BentoCard className="min-h-[220px]">
              <CardHeading>Features</CardHeading>
              <ul className="relative mt-4 flex flex-col gap-2.5" role="list">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-[12px] text-muted"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border bg-background/80">
                      <Check className="h-2.5 w-2.5" strokeWidth={2} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </BentoCard>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="lg:col-span-2">
            <BentoCard className="min-h-[220px] lg:min-h-[240px]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                <div className="flex flex-1 flex-col">
                  <CardHeading>Community</CardHeading>
                  <p className="mt-3 font-heading text-xl font-medium tracking-tight">
                    Learn, Build, Share.
                  </p>
                  <p className="mt-2 flex-1 text-[13px] text-muted">
                    Connect with students building robots across campuses.
                    Share builds, debug together, and grow as engineers.
                  </p>
                </div>
                <div className="flex-1 sm:max-w-[280px]">
                  <CommunityNetwork />
                </div>
              </div>
            </BentoCard>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
