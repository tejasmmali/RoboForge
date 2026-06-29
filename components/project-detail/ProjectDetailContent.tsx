"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clock, Code, Cpu, IndianRupee, Package, Zap } from "lucide-react";
import { ProjectChatContextBridge } from "@/components/chat/ProjectChatContextBridge";
import { buildProjectContextFromDetail } from "@/lib/ai/context";
import { CircuitViewer } from "@/components/project-detail/CircuitViewer";
import { DownloadsGrid } from "@/components/project-detail/DownloadsGrid";
import { PartsTable } from "@/components/project-detail/PartsTable";
import { ProjectHero } from "@/components/project-detail/ProjectHero";
import { ProjectSidebar } from "@/components/project-detail/ProjectSidebar";
import { RelatedProjects } from "@/components/project-detail/RelatedProjects";
import { StepCard } from "@/components/project-detail/StepCard";
import { TroubleshootingAccordion } from "@/components/project-detail/TroubleshootingAccordion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useAuth } from "@/hooks/useAuth";
import { useProjectProgress, useUpdateProgress } from "@/hooks/useProgress";
import type { ProjectDetail } from "@/lib/project-details";
import { sidebarNavItems } from "@/lib/project-details";
type ProjectDetailContentProps = {
  project: ProjectDetail;
};

function SectionHeading({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <h2 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}

const infoIcons = {
  difficulty: Cpu,
  time: Clock,
  cost: IndianRupee,
  components: Package,
  programming: Code,
  power: Zap,
};

export function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const { user } = useAuth();
  const { data: progressData } = useProjectProgress(project.slug);
  const updateProgress = useUpdateProgress();

  const currentStep = progressData?.currentStep ?? 1;
  const progressPercent = progressData?.progress ?? Math.round((currentStep / project.totalSteps) * 100);

  useEffect(() => {
    if (!user?.id) return;
    updateProgress.mutate({ projectSlug: project.slug });
  }, [project.slug, user?.id]);

  const projectChatContext = useMemo(
    () =>
      buildProjectContextFromDetail(project, {
        currentStepNumber: currentStep,
        progressPercent,
      }),
    [project, currentStep, progressPercent],
  );

  useEffect(() => {
    const ids = sidebarNavItems.map((item) => item.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const infoCards = [
    { key: "difficulty", label: "Difficulty", value: project.difficulty },
    { key: "time", label: "Time", value: project.time },
    { key: "cost", label: "Estimated Cost", value: project.cost },
    { key: "components", label: "Components", value: String(project.componentCount) },
    { key: "programming", label: "Programming", value: project.programming },
    { key: "power", label: "Power Source", value: project.powerSource },
  ] as const;

  const scrollToSteps = () => {
    document.getElementById("steps")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <ProjectHero project={project} onStartBuilding={scrollToSteps} />

      <Container className="py-12 md:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-10">
          {/* Main content — 70% */}
          <main className="min-w-0 lg:w-[calc(70%-1.25rem)] lg:flex-none">
            {/* Overview */}
            <section id="overview" className="scroll-mt-28 space-y-10">
              <ScrollReveal>
                <SectionHeading
                  id="overview-heading"
                  title="Project Overview"
                  subtitle="Everything you need to know before you start building."
                />
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <p className="text-[16px] leading-relaxed text-muted">
                  {project.overview.description}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-default border border-border bg-surface/60 p-5 backdrop-blur-sm">
                    <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                      Learning Outcomes
                    </h3>
                    <ul className="mt-3 space-y-2" role="list">
                      {project.overview.outcomes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[13px] text-muted">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-default border border-border bg-surface/60 p-5 backdrop-blur-sm">
                    <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                      Skills Required
                    </h3>
                    <ul className="mt-3 space-y-2" role="list">
                      {project.overview.skills.map((item) => (
                        <li key={item} className="text-[13px] text-muted">
                          · {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-default border border-border bg-surface/60 p-5 backdrop-blur-sm">
                    <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                      Applications
                    </h3>
                    <ul className="mt-3 space-y-2" role="list">
                      {project.overview.applications.map((item) => (
                        <li key={item} className="text-[13px] text-muted">
                          · {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-default border border-border bg-surface/60 p-5 backdrop-blur-sm">
                    <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                      Expected Result
                    </h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-muted">
                      {project.overview.expectedResult}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Prerequisites & Safety */}
              {(project.prerequisites.length > 0 || project.safety.length > 0) && (
                <ScrollReveal delay={0.12}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.prerequisites.length > 0 && (
                      <div className="rounded-default border border-border bg-surface/60 p-5 backdrop-blur-sm">
                        <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                          Prerequisites
                        </h3>
                        <ul className="mt-3 space-y-2" role="list">
                          {project.prerequisites.map((item) => (
                            <li key={item} className="text-[13px] text-muted">
                              · {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {project.safety.length > 0 && (
                      <div className="rounded-default border border-amber-200/80 bg-amber-50/40 p-5 backdrop-blur-sm">
                        <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-amber-900/80">
                          Safety Precautions
                        </h3>
                        <ul className="mt-3 space-y-2" role="list">
                          {project.safety.map((item) => (
                            <li key={item} className="text-[13px] text-amber-950/80">
                              · {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              )}

              {/* Gallery */}
              {project.gallery.length > 0 && (
                <ScrollReveal delay={0.14}>
                  <div className="grid grid-cols-3 gap-3">
                    {project.gallery.map((src, i) => (
                      <div
                        key={src}
                        className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-border bg-gradient-to-b from-muted/10 to-muted/25"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`${project.title} gallery ${i + 1}`}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}

              <ScrollReveal delay={0.15}>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {infoCards.map((card) => {
                    const Icon = infoIcons[card.key as keyof typeof infoIcons];
                    return (
                      <div
                        key={card.key}
                        className="hover-glow rounded-default border border-border bg-surface/80 p-4 backdrop-blur-sm"
                      >
                        <Icon className="h-4 w-4 text-muted" strokeWidth={1.5} />
                        <p className="mt-3 font-heading text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {card.label}
                        </p>
                        <p className="mt-1 font-heading text-[15px] font-medium tracking-tight">
                          {card.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ScrollReveal>
            </section>

            {/* Parts */}
            <section id="parts" className="scroll-mt-28 mt-20 space-y-6">
              <ScrollReveal>
                <SectionHeading
                  id="parts-heading"
                  title="Parts Required"
                  subtitle="All components needed for this build. Buy links redirect to external retailers."
                />
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <PartsTable parts={project.parts} />
              </ScrollReveal>
            </section>

            {/* Circuit */}
            <section id="circuit" className="scroll-mt-28 mt-20 space-y-6">
              <ScrollReveal>
                <SectionHeading
                  id="circuit-heading"
                  title="Circuit Diagram"
                  subtitle="Wiring overview, power flow, and complete pin mapping."
                />
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <CircuitViewer circuit={project.circuit} />
              </ScrollReveal>
            </section>

            {/* Steps */}
            <section id="steps" className="scroll-mt-28 mt-20 space-y-8">
              <ScrollReveal>
                <SectionHeading
                  id="steps-heading"
                  title="Step-by-Step Guide"
                  subtitle="Follow each step in order. Check off items as you complete them."
                />
              </ScrollReveal>
              <div className="space-y-0">
                {project.steps.map((step, index) => (
                  <StepCard
                    key={step.number}
                    step={step}
                    code={step.number === project.codeStepNumber ? project.code : undefined}
                    isLast={index === project.steps.length - 1}
                  />
                ))}
              </div>
            </section>

            {/* Testing */}
            <section id="testing" className="scroll-mt-28 mt-20 space-y-6">
              <ScrollReveal>
                <SectionHeading
                  id="testing-heading"
                  title="Testing"
                  subtitle="Verify your build works correctly before troubleshooting."
                />
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-default border border-border bg-surface/60 p-5 backdrop-blur-sm">
                    <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                      Checklist
                    </h3>
                    <ul className="mt-3 space-y-2" role="list">
                      {project.testing.checklist.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[13px] text-muted">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-default border border-border bg-surface/60 p-5 backdrop-blur-sm">
                      <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                        Expected Output
                      </h3>
                      <p className="mt-3 text-[13px] leading-relaxed text-muted">
                        {project.testing.expectedOutput}
                      </p>
                    </div>
                    <div className="rounded-default border border-border bg-surface/60 p-5 backdrop-blur-sm">
                      <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                        Common Issues
                      </h3>
                      <ul className="mt-3 space-y-1.5" role="list">
                        {project.testing.commonIssues.map((item) => (
                          <li key={item} className="text-[13px] text-muted">
                            · {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="scroll-mt-28 mt-20 space-y-6">
              <ScrollReveal>
                <SectionHeading
                  id="troubleshooting-heading"
                  title="Troubleshooting"
                  subtitle="Solutions to the most common problems students encounter."
                />
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <TroubleshootingAccordion items={project.troubleshooting} />
              </ScrollReveal>
            </section>

            {/* Downloads */}
            <section id="downloads" className="scroll-mt-28 mt-20 space-y-6">
              <ScrollReveal>
                <SectionHeading
                  id="downloads-heading"
                  title="Downloads"
                  subtitle="Source code, diagrams, and reference materials."
                />
              </ScrollReveal>
              <DownloadsGrid downloads={project.downloads} />
            </section>

            {/* FAQ */}
            {project.faq.length > 0 && (
              <section id="faq" className="scroll-mt-28 mt-20 space-y-6">
                <ScrollReveal>
                  <SectionHeading
                    id="faq-heading"
                    title="Frequently Asked Questions"
                    subtitle="Common questions about this build."
                  />
                </ScrollReveal>
                <ScrollReveal delay={0.05}>
                  <div className="space-y-3">
                    {project.faq.map((item) => (
                      <details
                        key={item.question}
                        className="group rounded-default border border-border bg-surface/60 backdrop-blur-sm"
                      >
                        <summary className="cursor-pointer px-5 py-4 text-[14px] font-medium marker:content-none">
                          {item.question}
                        </summary>
                        <p className="border-t border-border px-5 py-4 text-[13px] leading-relaxed text-muted">
                          {item.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </ScrollReveal>
              </section>
            )}

            {/* Related */}
            <section id="related" className="scroll-mt-28 mt-20 space-y-6">
              <ScrollReveal>
                <SectionHeading
                  id="related-heading"
                  title="Related Projects"
                  subtitle="Continue learning with these recommended builds."
                />
              </ScrollReveal>
              <RelatedProjects
                slugs={project.relatedSlugs}
                currentSlug={project.slug}
              />
            </section>

            {/* Bottom CTA */}
            <section className="mt-20">
              <ScrollReveal>
                <div className="rounded-default border border-border bg-surface/80 px-8 py-12 text-center backdrop-blur-sm md:px-12">
                  <h2 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
                    Finished this project?
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-[15px] text-muted">
                    Try another build or get help from the AI assistant.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button href="/projects">Try Another Project</Button>
                    <Button href="/chatbot" variant="secondary">
                      Ask AI Assistant
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </section>
          </main>

          {/* Sidebar — 30%, below content on mobile */}
          <div className="lg:w-[calc(30%-1.25rem)] lg:flex-none">
            <ProjectSidebar
              project={project}
              activeSection={activeSection}
              currentStep={currentStep}
            />
          </div>
        </div>
      </Container>

      <ProjectChatContextBridge context={projectChatContext} />
    </>
  );
}
