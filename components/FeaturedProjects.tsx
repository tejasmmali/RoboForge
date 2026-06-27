"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { SectionTitle } from "@/components/SectionTitle";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { projects, toCardData } from "@/lib/projects";

const featuredSlugs = [
  "line-follower-robot",
  "obstacle-avoiding-robot",
  "bluetooth-car",
  "robotic-arm",
  "smart-dustbin",
  "iot-weather-station",
];

const featuredProjects = featuredSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter(Boolean)
  .map((p) => toCardData(p!));

export function FeaturedProjects() {
  return (
    <section className="border-t border-border py-24 md:py-32">
      <Container>
        <ScrollReveal>
          <SectionTitle subtitle="Hand-picked projects to get you started. Each includes wiring diagrams, code, and step-by-step instructions.">
            Featured Projects
          </SectionTitle>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ScrollReveal key={project.slug} delay={index * 0.06}>
              <ProjectCard project={project} variant="compact" />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
