"use client";

import { useMemo } from "react";
import { getEmptyDashboardData } from "@/lib/dashboard-data";
import { useAuth } from "@/hooks/useAuth";
import { useSavedProjects, useSavedComponents } from "@/hooks/useBookmarks";
import { useProgressList } from "@/hooks/useProgress";
import { useNotifications } from "@/hooks/useNotifications";
import { useAchievements } from "@/hooks/useAchievements";
import { useDownloads } from "@/hooks/useDownloads";
import { listConversations } from "@/lib/db/chat";
import { getProjectImage } from "@/lib/images";
import { projects } from "@/lib/projects";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/db/query-keys";
import type { DashboardData } from "@/types/dashboard";

export function useDashboard() {
  const { user, profile, loading: authLoading } = useAuth();

  const savedProjects = useSavedProjects();
  const savedComponents = useSavedComponents();
  const progress = useProgressList();
  const notifications = useNotifications({ pageSize: 10 });
  const achievements = useAchievements();
  const downloads = useDownloads();

  const chatHistory = useQuery({
    queryKey: queryKeys.chat.conversations(user?.id ?? ""),
    queryFn: () => listConversations(user!.id, { pageSize: 10 }),
    enabled: Boolean(user?.id),
  });

  const isLoading =
    authLoading ||
    savedProjects.isLoading ||
    savedComponents.isLoading ||
    progress.isLoading ||
    notifications.isLoading ||
    achievements.isLoading ||
    downloads.isLoading ||
    chatHistory.isLoading;

  const data: DashboardData = useMemo(() => {
    const base = getEmptyDashboardData();
    if (!user) return base;

    const progressItems = progress.data ?? [];
    const savedProjectItems = savedProjects.data ?? [];
    const savedComponentItems = savedComponents.data ?? [];
    const chatItems = chatHistory.data ?? [];
    const notificationItems = notifications.data ?? [];
    const achievementItems = achievements.data ?? [];
    const downloadItems = downloads.data ?? [];

    const startedCount = progressItems.length;
    const completedCount = progressItems.filter((p) => p.progress >= 100).length;

    const stats = base.stats.map((stat) => {
      switch (stat.id) {
        case "started":
          return { ...stat, value: startedCount };
        case "completed":
          return { ...stat, value: completedCount };
        case "components":
          return { ...stat, value: savedComponentItems.length };
        case "ai":
          return { ...stat, value: chatItems.length };
        default:
          return stat;
      }
    });

    const continueProjects = progressItems
      .filter((p) => p.progress > 0 && p.progress < 100)
      .slice(0, 4)
      .map((p) => {
        const catalog = projects.find((proj) => proj.slug === p.projectSlug);
        return {
          slug: p.projectSlug,
          title: catalog?.title ?? p.projectSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          image: catalog?.image ?? getProjectImage(p.projectSlug),
          progress: p.progress,
          lastOpened: p.lastOpenedAt,
          estimatedRemaining: p.estimatedRemaining ?? "—",
        };
      });

    const roadmap = base.roadmap.map((stage, index) => {
      if (index === 0) {
        const beginnerDone = completedCount >= 1;
        return {
          ...stage,
          progress: beginnerDone ? 100 : Math.min(startedCount * 25, 75),
          complete: beginnerDone,
          current: !beginnerDone,
        };
      }
      if (index === 1) {
        const pct = Math.min(completedCount * 20, 100);
        return { ...stage, progress: pct, complete: pct >= 100, current: completedCount >= 1 && pct < 100 };
      }
      return { ...stage, progress: 0, complete: false, current: false };
    });

    return {
      ...base,
      stats,
      continueProjects,
      roadmap,
      savedProjects: savedProjectItems.map((p) => ({
        id: p.id,
        user_id: p.userId,
        project_slug: p.projectSlug,
        title: p.title,
        difficulty: p.difficulty as DashboardData["savedProjects"][0]["difficulty"],
        image: p.image,
        saved_at: p.savedAt,
      })),
      savedComponents: savedComponentItems.map((c) => ({
        id: c.id,
        user_id: c.userId,
        component_slug: c.componentSlug,
        name: c.name,
        category: c.category,
        image: c.image,
        specifications: c.specifications,
        buy_url: c.buyUrl,
        saved_at: c.savedAt,
      })),
      chatHistory: chatItems.map((c) => ({
        id: c.id,
        user_id: c.userId ?? user.id,
        title: c.title,
        preview: c.preview,
        updated_at: c.updatedAt,
      })),
      notifications: notificationItems.map((n) => ({
        id: n.id,
        user_id: n.userId,
        title: n.title,
        message: n.message,
        type: n.type === "ai" || n.type === "achievement" ? "feature" : n.type,
        read: n.read,
        created_at: n.createdAt,
      })),
      achievements: achievementItems.map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        description: a.description ?? "",
        unlocked: a.unlocked,
        progress: a.percent,
        icon: a.icon ?? "star",
      })),
      downloads: downloadItems.map((d) => ({
        id: d.id,
        title: d.title,
        type:
          d.fileType === "pdf"
            ? "pdf"
            : d.fileType === "circuit"
              ? "circuit"
              : d.fileType === "code"
                ? "code"
                : d.fileType === "datasheet"
                  ? "datasheet"
                  : "library",
        project_slug: d.projectSlug ?? undefined,
        downloaded_at: d.downloadedAt,
      })),
    };
  }, [
    achievements.data,
    chatHistory.data,
    downloads.data,
    notifications.data,
    progress.data,
    savedComponents.data,
    savedProjects.data,
    user,
  ]);

  const displayName =
    profile?.full_name ??
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Learner";

  const isNewUser =
    Boolean(user) &&
    data.stats.every((s) => s.value === 0) &&
    data.continueProjects.length === 0 &&
    data.savedProjects.length === 0 &&
    data.chatHistory.length === 0;

  return {
    user,
    profile,
    authLoading,
    displayName,
    data,
    isLoading,
    isNewUser,
  };
}
