"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Clock, IndianRupee } from "lucide-react";
import Image from "next/image";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/lib/projects";
import { BlueprintGrid, TechLabel } from "@/components/visuals/LabDecor";

type FeaturedProjectProps = {
  project: Project;
};

const learnPoints = [
  "4-DOF servo kinematics",
  "ESP32 PWM control",
  "Serial command interface",
  "Potentiometer feedback loops",
];

export function FeaturedProject({ project }: FeaturedProjectProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="hover-glow relative overflow-hidden rounded-default border border-border bg-surface shadow-soft"
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[280px] bg-gradient-to-b from-muted/10 to-muted/30 lg:min-h-[360px]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-contain p-6"
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
          />
          <BlueprintGrid size={24} opacity={0.2} />
          <TechLabel
            coord="FEAT-01"
            className="absolute left-4 top-4 rounded-[6px] bg-white/70 px-2 py-1 backdrop-blur-sm"
          >
            Featured
          </TechLabel>
        </div>

        <div className="flex flex-col justify-center p-6 md:p-10">
          <p className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Featured Project
          </p>
          <h2 className="mt-2 font-heading text-2xl font-medium tracking-tight md:text-3xl">
            {project.title}
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            {project.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <DifficultyBadge difficulty={project.difficulty} />
            <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
              {project.time}
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <IndianRupee className="h-3.5 w-3.5" strokeWidth={1.75} />
              {project.cost.replace("₹", "")}
            </span>
          </div>

          <div className="mt-6">
            <p className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              What you&apos;ll learn
            </p>
            <ul className="mt-2 space-y-1.5" role="list">
              {learnPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2 text-[13px] text-muted"
                >
                  <span className="h-1 w-1 rounded-full bg-foreground/40" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={`/projects/${project.slug}`}>
              Open Project
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Button>
            <Button href="/chatbot" variant="secondary">
              <Bot className="h-3.5 w-3.5" strokeWidth={1.75} />
              Ask AI
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
