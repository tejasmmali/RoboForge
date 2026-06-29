"use client";

import type { DashboardData } from "@/types/dashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsCard";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";
import { OnboardingCards } from "@/components/dashboard/OnboardingCards";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { ArrowRight, Clock } from "lucide-react";

type OverviewPanelProps = {
  name: string;
  data: DashboardData;
  isNewUser?: boolean;
};

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export function OverviewPanel({ name, data, isNewUser }: OverviewPanelProps) {
  const featured = data.continueProjects[0];
  const hasWeeklyActivity = data.weeklyProgress.some(
    (p) => p.hours > 0 || p.projects > 0 || p.aiUsage > 0,
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <DashboardHeader name={name} compact />

      {isNewUser ? (
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-[15px] font-medium">Welcome to RoboForge</h2>
            <p className="mt-1 text-[13px] text-muted">
              Your workspace is ready. Complete these steps to get started.
            </p>
          </div>
          <OnboardingCards />
        </div>
      ) : (
        <StatsGrid stats={data.stats} compact />
      )}

      {!isNewUser && (
        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {featured ? (
          <div className="flex min-h-0 flex-col overflow-hidden rounded-default border border-border bg-surface/80 backdrop-blur-sm">
            <p className="shrink-0 border-b border-border px-5 py-3.5 font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Continue Building
            </p>
            <div className="flex min-h-0 flex-1 flex-col p-5">
              <div className="relative mb-4 h-32 shrink-0 overflow-hidden rounded-[14px] border border-border sm:h-36">
                <SafeImage
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <h3 className="font-heading text-[15px] font-medium leading-snug">
                {featured.title}
              </h3>
              <div className="mt-3">
                <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
                  <span>{featured.progress}% Complete</span>
                  <span className="flex shrink-0 items-center gap-1">
                    <Clock className="h-3 w-3" strokeWidth={1.75} />
                    {featured.estimatedRemaining} left
                  </span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-foreground transition-all"
                    style={{ width: `${featured.progress}%` }}
                  />
                </div>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Last opened {formatRelative(featured.lastOpened)}
              </p>
              <Link
                href={`/projects/${featured.slug}`}
                className="mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-[13px] font-medium transition-colors hover:text-accent"
              >
                Resume
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-default border border-dashed border-border bg-surface/50 p-8 text-center">
              <p className="font-heading text-[14px] font-medium">No projects in progress</p>
              <p className="mt-1 max-w-xs text-[12px] text-muted">
                Open a project guide and track your build progress.
              </p>
              <Link
                href="/projects"
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium hover:text-accent"
              >
                Browse projects
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </Link>
            </div>
          )}

          <WeeklyProgress data={data.weeklyProgress} embedded hasActivity={hasWeeklyActivity} />
        </div>
      )}
    </div>
  );
}
