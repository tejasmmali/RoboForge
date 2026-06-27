"use client";

import { useMemo } from "react";
import { getDashboardData } from "@/lib/dashboard-data";
import { useAuth } from "@/hooks/useAuth";
import { useSavedProjects } from "@/hooks/useBookmarks";
import { useProgressList } from "@/hooks/useProgress";
import { useNotifications } from "@/hooks/useNotifications";
import { useAchievements } from "@/hooks/useAchievements";
import { useDownloads } from "@/hooks/useDownloads";
import { useSavedComponents } from "@/hooks/useBookmarks";
import { listConversations } from "@/lib/db/chat";
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

  const demoData = useMemo(() => getDashboardData(), []);

  const isLoading =
    savedProjects.isLoading ||
    progress.isLoading ||
    notifications.isLoading;

  const data: DashboardData = useMemo(() => {
    if (!user) return demoData;

    const hasRemoteData =
      (savedProjects.data?.length ?? 0) > 0 ||
      (progress.data?.length ?? 0) > 0 ||
      (chatHistory.data?.length ?? 0) > 0;

    if (!hasRemoteData && !isLoading) return demoData;

    return {
      ...demoData,
      savedProjects:
        savedProjects.data?.map((p) => ({
          id: p.id,
          user_id: p.userId,
          project_slug: p.projectSlug,
          title: p.title,
          difficulty: p.difficulty as DashboardData["savedProjects"][0]["difficulty"],
          image: p.image,
          saved_at: p.savedAt,
        })) ?? demoData.savedProjects,
      continueProjects:
        progress.data?.slice(0, 4).map((p) => ({
          slug: p.projectSlug,
          title: p.projectSlug.replace(/-/g, " "),
          image: "",
          progress: p.progress,
          lastOpened: p.lastOpenedAt,
          estimatedRemaining: p.estimatedRemaining ?? "—",
        })) ?? demoData.continueProjects,
      chatHistory:
        chatHistory.data?.map((c) => ({
          id: c.id,
          user_id: c.userId ?? user.id,
          title: c.title,
          preview: c.preview,
          updated_at: c.updatedAt,
        })) ?? demoData.chatHistory,
      savedComponents:
        savedComponents.data?.map((c) => ({
          id: c.id,
          user_id: c.userId,
          component_slug: c.componentSlug,
          name: c.name,
          category: c.category,
          image: c.image,
          specifications: c.specifications,
          buy_url: c.buyUrl,
          saved_at: c.savedAt,
        })) ?? demoData.savedComponents,
      notifications:
        notifications.data?.map((n) => ({
          id: n.id,
          user_id: n.userId,
          title: n.title,
          message: n.message,
          type: n.type === "ai" || n.type === "achievement" ? "feature" : n.type,
          read: n.read,
          created_at: n.createdAt,
        })) ?? demoData.notifications,
      achievements:
        achievements.data?.map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          description: a.description ?? "",
          unlocked: a.unlocked,
          progress: a.percent,
          icon: a.icon ?? "star",
        })) ?? demoData.achievements,
      downloads:
        downloads.data?.map((d) => ({
          id: d.id,
          title: d.title,
          type: d.fileType === "pdf" ? "pdf" : d.fileType === "circuit" ? "circuit" : d.fileType === "code" ? "code" : d.fileType === "datasheet" ? "datasheet" : "library",
          project_slug: d.projectSlug ?? undefined,
          downloaded_at: d.downloadedAt,
        })) ?? demoData.downloads,
    };
  }, [
    achievements.data,
    chatHistory.data,
    demoData,
    downloads.data,
    isLoading,
    notifications.data,
    progress.data,
    savedComponents.data,
    savedProjects.data,
    user,
  ]);

  const displayName =
    profile?.full_name ??
    (user?.user_metadata?.full_name as string | undefined) ??
    "RoboForge User";

  return {
    user,
    profile,
    authLoading,
    displayName,
    data,
    isLoading,
  };
}
