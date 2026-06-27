"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BlueprintGrid, TechLabel } from "@/components/visuals/LabDecor";

export function CTASection() {
  return (
    <section className="relative border-t border-border py-24 md:py-32">
      <BlueprintGrid size={48} opacity={0.12} />
      <Container className="relative">
        <ScrollReveal>
          <div className="surface-elevated relative mx-auto max-w-3xl overflow-hidden px-8 py-16 text-center md:px-16 md:py-20">
            <TechLabel coord="CTA-01" className="absolute left-6 top-6">
              Start Building
            </TechLabel>
            <h2 className="font-heading text-balance text-3xl font-medium tracking-tight md:text-4xl">
              Ready To Build Your First Robot?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">
              Pick a project, gather your components, and start building with
              guided lessons and AI support at every step.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/projects">Explore Projects</Button>
              <Button href="/chatbot" variant="secondary">
                Ask AI Assistant
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
