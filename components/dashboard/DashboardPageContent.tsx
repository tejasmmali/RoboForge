"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AchievementsGrid } from "@/components/dashboard/AchievementsGrid";
import { AIChatHistory } from "@/components/dashboard/AIChatHistory";
import { ContinueLearning } from "@/components/dashboard/ContinueLearning";
import { DashboardBoard } from "@/components/dashboard/DashboardBoard";
import { DashboardDownloads } from "@/components/dashboard/DashboardDownloads";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getDashboardNavItem,
  dashboardNavItems,
  type DashboardSection,
} from "@/components/dashboard/dashboard-nav";
import { FavoriteComponents } from "@/components/dashboard/FavoriteComponents";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";
import { ProfileSummary } from "@/components/dashboard/ProfileSummary";
import { ProgressRoadmap } from "@/components/dashboard/ProgressRoadmap";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SavedProjects } from "@/components/dashboard/SavedProjects";
import { BlueprintGrid } from "@/components/visuals/LabDecor";
import { useDashboard } from "@/hooks/useDashboard";

function DashboardSkeleton() {
  return (
    <div className="grid h-full animate-pulse gap-6 p-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:p-8 xl:grid-cols-[240px_minmax(0,1fr)_272px]">
      <div className="hidden rounded-default bg-border/40 lg:block" />
      <div className="rounded-default bg-border/30" />
      <div className="hidden rounded-default bg-border/40 xl:block" />
    </div>
  );
}

function parseDashboardSection(value: string | null): DashboardSection {
  const valid = dashboardNavItems.map((item) => item.id);
  if (value && valid.includes(value as DashboardSection)) {
    return value as DashboardSection;
  }
  return "overview";
}

function DashboardContent() {
  const { user, profile, authLoading, displayName, data, isNewUser } = useDashboard();
  const searchParams = useSearchParams();
  const [section, setSection] = useState<DashboardSection>(() =>
    parseDashboardSection(searchParams.get("section")),
  );

  useEffect(() => {
    setSection(parseDashboardSection(searchParams.get("section")));
  }, [searchParams]);

  if (authLoading || !user) {
    return <DashboardSkeleton />;
  }

  const projectsCompleted =
    data.stats.find((s) => s.id === "completed")?.value ?? 0;
  const nav = getDashboardNavItem(section);

  const renderBoard = () => {
    switch (section) {
      case "overview":
        return (
          <DashboardBoard key={section}>
            <OverviewPanel name={displayName} data={data} isNewUser={isNewUser} />
          </DashboardBoard>
        );
      case "continue":
        return (
          <DashboardBoard
            key={section}
            title={nav.label}
            description={nav.description}
          >
            <ContinueLearning projects={data.continueProjects} embedded />
          </DashboardBoard>
        );
      case "progress":
        return (
          <DashboardBoard key={section} title={nav.label} description={nav.description}>
            <ProgressRoadmap stages={data.roadmap} embedded />
          </DashboardBoard>
        );
      case "saved-projects":
        return (
          <DashboardBoard key={section} title={nav.label} description={nav.description}>
            <SavedProjects projects={data.savedProjects} embedded />
          </DashboardBoard>
        );
      case "components":
        return (
          <DashboardBoard key={section} title={nav.label} description={nav.description}>
            <FavoriteComponents components={data.savedComponents} embedded />
          </DashboardBoard>
        );
      case "ai-history":
        return (
          <DashboardBoard key={section} title={nav.label} description={nav.description}>
            <AIChatHistory conversations={data.chatHistory} embedded />
          </DashboardBoard>
        );
      case "achievements":
        return (
          <DashboardBoard key={section} title={nav.label} description={nav.description}>
            <AchievementsGrid achievements={data.achievements} embedded />
          </DashboardBoard>
        );
      case "downloads":
        return (
          <DashboardBoard key={section} title={nav.label} description={nav.description}>
            <DashboardDownloads downloads={data.downloads} embedded />
          </DashboardBoard>
        );
      case "actions":
        return (
          <DashboardBoard key={section} title={nav.label} description={nav.description}>
            <QuickActions />
          </DashboardBoard>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative h-full min-h-0 overflow-hidden">
      <BlueprintGrid className="pointer-events-none absolute inset-0 opacity-[0.22]" />

      <div className="relative grid h-full min-h-0 grid-cols-1 gap-5 p-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6 lg:p-6 xl:grid-cols-[240px_minmax(0,1fr)_272px] xl:gap-8 xl:p-8">
        <div className="h-0 overflow-visible lg:h-full lg:min-h-0">
          <DashboardSidebar active={section} onChange={setSection} className="h-full" />
        </div>

        <div className="min-h-0 min-w-0 overflow-hidden">
          <div className="h-full min-h-0">
            <AnimatePresence mode="wait">{renderBoard()}</AnimatePresence>
          </div>
        </div>

        <aside className="hidden min-h-0 flex-col gap-4 xl:flex">
          <div className="shrink-0 overflow-hidden rounded-default border border-border bg-surface/95 shadow-soft backdrop-blur-md">
            <ProfileSummary
              user={user}
              profile={profile}
              displayName={displayName}
              projectsCompleted={projectsCompleted}
              learningStreak={data.learningStreak}
              embedded
            />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden rounded-default border border-border bg-surface/95 shadow-soft backdrop-blur-md">
            <div className="h-full overflow-y-auto overscroll-contain">
              <RecentActivity activity={data.activity} embedded />
            </div>
          </div>
          <div className="max-h-[240px] shrink-0 overflow-hidden rounded-default border border-border bg-surface/95 shadow-soft backdrop-blur-md">
            <div className="h-full overflow-y-auto overscroll-contain">
              <NotificationsPanel notifications={data.notifications} embedded />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function DashboardPageContent() {
  return (
    <ProtectedRoute fallback={<DashboardSkeleton />} redirectTo="/dashboard">
      <DashboardContent />
    </ProtectedRoute>
  );
}
