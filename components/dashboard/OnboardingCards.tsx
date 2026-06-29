"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, Bot, FolderOpen, User } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  {
    href: "/settings",
    icon: User,
    title: "Complete your profile",
    description: "Add your name, institution, and learning goals.",
  },
  {
    href: "/projects",
    icon: FolderOpen,
    title: "Start your first project",
    description: "Pick a beginner build and follow the step-by-step guide.",
  },
  {
    href: "/components",
    icon: Bookmark,
    title: "Bookmark components",
    description: "Save parts you use often for quick reference.",
  },
  {
    href: "/ai-assistant",
    icon: Bot,
    title: "Chat with RoboForge AI",
    description: "Ask wiring, coding, and troubleshooting questions.",
  },
];

export function OnboardingCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
          >
            <Link
              href={card.href}
              className="group flex h-full flex-col rounded-default border border-border bg-surface/80 p-5 backdrop-blur-sm transition-colors hover:border-border-strong hover:bg-surface"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-background">
                <Icon className="h-4 w-4 text-muted" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-heading text-[14px] font-medium">{card.title}</h3>
              <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-muted">
                {card.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-muted group-hover:text-foreground">
                Get started
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
