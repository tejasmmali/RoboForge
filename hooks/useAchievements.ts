"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAchievements,
  seedAchievements,
  unlockAchievement,
  updateAchievementProgress,
} from "@/lib/db/achievements";
import { queryKeys } from "@/lib/db/query-keys";
import { useAuth } from "@/hooks/useAuth";
import type { AchievementSlug } from "@/types/achievement";

export function useAchievements() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.achievements(user?.id ?? ""),
    queryFn: () => getAchievements(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useSeedAchievements() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Sign in required");
      return seedAchievements(user.id);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.achievements(user.id),
        });
      }
    },
  });
}

export function useUnlockAchievement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: AchievementSlug) => {
      if (!user) throw new Error("Sign in required");
      return unlockAchievement(user.id, slug);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.achievements(user.id),
        });
      }
    },
  });
}

export function useUpdateAchievementProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      progress,
    }: {
      slug: AchievementSlug | string;
      progress: number;
    }) => {
      if (!user) throw new Error("Sign in required");
      return updateAchievementProgress(user.id, slug, progress);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.achievements(user.id),
        });
      }
    },
  });
}
