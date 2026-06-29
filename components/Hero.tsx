"use client";

import { CATALOG_STATS } from "@/lib/content/catalog-stats";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { HeroComposition } from "@/components/visuals/HeroComposition";
import {
  BlueprintGrid,
  FloatingParticles,
  MeasurementLine,
  TechLabel,
} from "@/components/visuals/LabDecor";

const stats = [
  { value: String(CATALOG_STATS.projectCount), label: "Projects" },
  { value: String(CATALOG_STATS.componentCount), label: "Components" },
  { value: "AI", label: "Powered" },
  { value: "Beginner", label: "Friendly" },
] as const;

export function Hero() {
  return (
    <section className="relative min-h-[calc(100dvh-var(--nav-height))] overflow-hidden">
      <BlueprintGrid size={48} opacity={0.35} />
      <FloatingParticles className="pointer-events-none absolute inset-0" />
      <MeasurementLine
        orientation="horizontal"
        label="SECTION A"
        className="left-[5%] right-[5%] top-8 hidden md:flex"
      />

      <Container className="relative flex min-h-[calc(100dvh-var(--nav-height))] items-center py-16 md:py-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 font-heading text-[11px] font-medium uppercase tracking-wider text-muted backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(37,99,235,0.5)]" />
                Robotics Learning Platform
              </span>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="mt-6 font-heading text-[2.75rem] font-medium leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]"
            >
              BUILD.
              <br />
              LEARN.
              <br />
              CREATE.
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mt-6 max-w-md text-[15px] leading-relaxed text-muted md:text-base"
            >
              Master robotics through guided projects, interactive tutorials,
              and an AI-powered assistant that helps you at every step.
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button href="/projects">Explore Projects</Button>
              <Button href="/components" variant="secondary">
                Browse Components
              </Button>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-lg font-medium tracking-tight md:text-xl">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-4 lg:mt-0"
          >
            <TechLabel coord="VIEWPORT 01" className="absolute -top-2 left-0 z-20 hidden lg:block">
              Lab Composition
            </TechLabel>
            <HeroComposition />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
