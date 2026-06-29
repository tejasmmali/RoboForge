"use client";

import { motion } from "framer-motion";
import {
  Bot,
  BookOpen,
  Cpu,
  Github,
  GraduationCap,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CATALOG_STATS } from "@/lib/content/catalog-stats";
import { siteContact } from "@/lib/site-contact";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { BlueprintGrid } from "@/components/visuals/LabDecor";

const pillars = [
  {
    icon: BookOpen,
    title: "Guided Projects",
    description:
      "Step-by-step robotics builds with wiring diagrams, source code, parts lists, and troubleshooting guides for every skill level.",
    href: "/projects",
  },
  {
    icon: Cpu,
    title: "Components Library",
    description:
      "Explore sensors, boards, motors, and modules with specs, use cases, and compatibility notes to plan your next build.",
    href: "/components",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description:
      "Get context-aware help anywhere on the platform — debug wiring, explain code, compare parts, and plan your project in real time.",
    href: "/ai-assistant",
  },
  {
    icon: GraduationCap,
    title: "Learning Dashboard",
    description:
      "Track your progress, resume projects, and see what to build next as you grow from beginner builds to advanced robotics.",
    href: "/dashboard",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Pick a project",
    description:
      "Choose from line followers, IoT stations, autonomous robots, and more — filtered by difficulty and technology.",
  },
  {
    number: "02",
    title: "Build step by step",
    description:
      "Follow structured lessons with wiring, code, and safety notes. Reference the components catalog when you need parts.",
  },
  {
    number: "03",
    title: "Get help when stuck",
    description:
      "Ask the AI assistant from any page. It knows your project, step, and components so you never start from scratch.",
  },
] as const;

const values = [
  {
    icon: Wrench,
    title: "Learn by building",
    description:
      "Theory matters, but robotics clicks when you solder, wire, and upload code. Every lesson ends in something physical.",
  },
  {
    icon: Layers,
    title: "Structured, not scattered",
    description:
      "No random tutorials. Projects are organized with prerequisites, milestones, and clear outcomes from day one.",
  },
  {
    icon: Sparkles,
    title: "AI as a mentor",
    description:
      "Our assistant augments your learning — it explains, debugs, and recommends without replacing the hands-on work.",
  },
  {
    icon: Users,
    title: "Built for students",
    description:
      "Designed for hobbyists, STEM students, and educators who want a serious robotics curriculum without enterprise complexity.",
  },
] as const;

const contactLinks = [
  {
    icon: Mail,
    label: siteContact.email,
    href: siteContact.mailto,
    description: "Questions, feedback, or partnership inquiries",
  },
  {
    icon: Github,
    label: "GitHub",
    href: siteContact.github,
    description: "Open-source contributions and issue reports",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: siteContact.linkedin,
    description: "Updates and community news",
  },
] as const;

export function AboutPageContent() {
  return (
    <div className="relative overflow-hidden">
      <BlueprintGrid size={48} opacity={0.25} className="pointer-events-none" />

      {/* Hero */}
      <section className="border-b border-border/60">
        <Container className="py-16 md:py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.span
              variants={staggerItem}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 font-heading text-[11px] font-medium uppercase tracking-wider text-muted backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              About RoboForge
            </motion.span>

            <motion.h1
              variants={staggerItem}
              className="mt-6 font-heading text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl"
            >
              Robotics education,
              <br />
              built for makers.
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-muted md:text-base"
            >
              RoboForge is a learning platform for students and hobbyists who want
              to build real robots — not just watch videos. We combine guided
              projects, a components library, and an AI mentor into one place so
              you can go from zero to a working build with confidence.
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <Button href="/projects">Start building</Button>
              <Button href="/ai-assistant" variant="secondary">
                Meet the AI assistant
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-b border-border/60 bg-surface/40">
        <Container className="py-12">
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: String(CATALOG_STATS.projectCount), label: "Projects" },
                { value: String(CATALOG_STATS.componentCount), label: "Components" },
                { value: String(CATALOG_STATS.categoryCount), label: "Categories" },
                { value: "24/7", label: "AI support" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Mission */}
      <section className="border-b border-border/60">
        <Container className="py-16 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
                Why we built RoboForge
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Learning robotics is hard when resources are scattered — one video
                for wiring, another for code, a forum thread for debugging. We
                wanted a single workspace where every project includes the full
                picture: hardware, firmware, context, and help when you need it.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Whether you are wiring your first Arduino or deploying an ESP32
                IoT node, RoboForge meets you where you are and grows with your
                skills.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-default border border-border bg-surface/80 p-6 backdrop-blur-sm md:p-8">
                <p className="font-heading text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
                  Our mission
                </p>
                <p className="mt-4 text-[17px] leading-relaxed text-foreground md:text-lg">
                  Make robotics education accessible, practical, and enjoyable —
                  so more students can turn ideas into machines that actually
                  work.
                </p>
                <div className="mt-6 flex items-start gap-3 rounded-[12px] border border-border bg-background/60 p-4">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} />
                  <p className="text-[13px] leading-relaxed text-muted">
                    Built for learners worldwide. Content covers Arduino, ESP32,
                    sensors, motors, IoT, and computer vision — with projects
                    you can complete at home or in the lab.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Platform pillars */}
      <section className="border-b border-border/60">
        <Container className="py-16 md:py-20">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
              Everything in one platform
            </h2>
            <p className="mt-4 text-[15px] text-muted">
              Four tools that work together — so you spend less time searching
              and more time building.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, index) => (
              <ScrollReveal key={pillar.title} delay={index * 0.05}>
                <Link
                  href={pillar.href}
                  className="hover-glow group flex h-full flex-col rounded-default border border-border bg-surface/80 p-5 backdrop-blur-sm transition-colors"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-border bg-background">
                    <pillar.icon className="h-4 w-4 text-muted" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 font-heading text-[15px] font-medium">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">
                    {pillar.description}
                  </p>
                  <span className="mt-4 text-[12px] font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Explore →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-b border-border/60 bg-surface/30">
        <Container className="py-16 md:py-20">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-[15px] text-muted">
              A simple path from curiosity to a finished robot.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <ScrollReveal key={step.number} delay={index * 0.08}>
                <div className="rounded-default border border-border bg-background/80 p-6">
                  <span className="font-mono text-[11px] font-medium text-accent">
                    {step.number}
                  </span>
                  <h3 className="mt-3 font-heading text-[17px] font-medium">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="border-b border-border/60">
        <Container className="py-16 md:py-20">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
              What we believe
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.05}>
                <div className="flex gap-4 rounded-default border border-border bg-surface/60 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-border bg-background">
                    <value.icon className="h-4 w-4 text-muted" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="font-heading text-[15px] font-medium">
                      {value.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                      {value.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section id="team" className="scroll-mt-24 border-b border-border/60 bg-surface/30">
        <Container className="py-16 md:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <ScrollReveal>
              <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
                Who we build for
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                RoboForge is built by people who care about hands-on engineering
                education. We are engineers, educators, and makers who have seen
                students struggle with fragmented tutorials — and wanted something
                better.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Our team focuses on curriculum quality, accurate wiring guides,
                and an AI experience that actually understands robotics — not
                generic chatbot answers.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-4">
                {[
                  {
                    role: "Students & hobbyists",
                    detail:
                      "First-time builders learning Arduino, sensors, and basic autonomy.",
                  },
                  {
                    role: "STEM educators",
                    detail:
                      "Teachers who need structured projects with parts lists and lesson flow.",
                  },
                  {
                    role: "Intermediate makers",
                    detail:
                      "Builders ready for ESP32, IoT, computer vision, and advanced mechanics.",
                  },
                ].map((item) => (
                  <div
                    key={item.role}
                    className="rounded-default border border-border bg-background/80 px-5 py-4"
                  >
                    <p className="font-heading text-[14px] font-medium">
                      {item.role}
                    </p>
                    <p className="mt-1 text-[13px] text-muted">{item.detail}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24">
        <Container className="py-16 md:py-20">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
              Get in touch
            </h2>
            <p className="mt-4 text-[15px] text-muted">
              Have feedback, found an issue, or want to collaborate? We would love
              to hear from you.
            </p>
          </ScrollReveal>

          <ScrollReveal className="mt-10 text-center">
            <Button href="/contact">Send us a message</Button>
          </ScrollReveal>

          <div className="mx-auto mt-10 grid max-w-2xl gap-3">
            {contactLinks.map((link, index) => (
              <ScrollReveal key={link.label} delay={index * 0.05}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="hover-glow flex items-center gap-4 rounded-default border border-border bg-surface/80 p-4 transition-colors"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-border bg-background">
                    <link.icon className="h-4 w-4 text-muted" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="font-heading text-[14px] font-medium">
                      {link.label}
                    </p>
                    <p className="text-[12px] text-muted">{link.description}</p>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-16 text-center">
            <p className="text-[15px] text-muted">
              Ready to build your first robot?
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Button href="/signup">Create free account</Button>
              <Button href="/projects" variant="secondary">
                Browse projects
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </div>
  );
}
