"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Cpu,
  Lock,
  Radar,
  Rocket,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/types/dashboard";

const iconMap: Record<string, LucideIcon> = {
  rocket: Rocket,
  cpu: Cpu,
  radar: Radar,
  bot: Bot,
  trophy: Trophy,
};

type AchievementsGridProps = {
  achievements: Achievement[];
  embedded?: boolean;
};

export function AchievementsGrid({ achievements, embedded }: AchievementsGridProps) {
  const grid = (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {achievements.map((badge, i) => {
          const Icon = iconMap[badge.icon] ?? Rocket;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={cn(
                "hover-glow group relative flex flex-col items-center rounded-default border p-4 text-center backdrop-blur-sm",
                badge.unlocked
                  ? "border-border bg-surface/80"
                  : "border-border/60 bg-surface/40 opacity-70",
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border",
                  badge.unlocked
                    ? "border-foreground/20 bg-foreground text-background"
                    : "border-border bg-background text-muted",
                )}
              >
                {badge.unlocked ? (
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                ) : (
                  <Lock className="h-4 w-4" strokeWidth={1.75} />
                )}
              </div>
              <h3 className="mt-3 font-heading text-[12px] font-medium leading-tight">
                {badge.title}
              </h3>
              <p className="mt-1 text-[10px] leading-snug text-muted-foreground">
                {badge.description}
              </p>
              {!badge.unlocked && badge.progress > 0 && (
                <div className="mt-3 w-full">
                  <div className="h-0.5 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-foreground/40"
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[9px] text-muted-foreground">
                    {badge.progress}%
                  </p>
                </div>
              )}
              {badge.unlocked && (
                <span className="mt-2 text-[9px] font-medium uppercase tracking-wider text-emerald-600">
                  Unlocked
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
  );

  if (embedded) return grid;

  return (
    <section id="achievements" className="scroll-mt-24">
      <div className="mb-5">
        <h2 className="font-heading text-lg font-medium tracking-tight">
          Achievements
        </h2>
        <p className="mt-0.5 text-[13px] text-muted">Badges earned on your journey</p>
      </div>
      {grid}
    </section>
  );
}
