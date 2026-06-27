"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionTitle } from "@/components/SectionTitle";
import {
  BuildPreview,
  LearnPreview,
  PracticePreview,
} from "@/components/visuals/BentoPreviews";
import { BlueprintGrid } from "@/components/visuals/LabDecor";
import { cn } from "@/lib/utils";

const pillars = [
  {
    title: "Learn",
    description:
      "Start with fundamentals — electronics, sensors, and programming. Every concept is explained with diagrams and real-world context before you touch a breadboard.",
    preview: <LearnPreview />,
  },
  {
    title: "Practice",
    description:
      "Apply what you learn through hands-on labs. Wire circuits, upload firmware, calibrate sensors, and debug real problems — the same skills used in industry.",
    preview: <PracticePreview />,
  },
  {
    title: "Build",
    description:
      "Complete full robotics projects from chassis assembly to autonomous behavior. Graduate from line followers to IoT systems and computer vision applications.",
    preview: <BuildPreview />,
  },
] as const;

export function WhyRoboForge() {
  return (
    <section className="relative border-t border-border py-20 md:py-28">
      <BlueprintGrid size={48} opacity={0.2} />
      <Container className="relative">
        <ScrollReveal>
          <SectionTitle subtitle="A structured path from zero experience to building autonomous robots.">
            Why RoboForge
          </SectionTitle>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <ScrollReveal key={pillar.title} delay={index * 0.08}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "surface-elevated hover-glow relative flex h-full flex-col overflow-hidden p-6 md:p-8",
                )}
              >
                <div className="relative mb-6">{pillar.preview}</div>
                <h3 className="font-heading text-xl font-medium tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">
                  {pillar.description}
                </p>
              </motion.article>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
