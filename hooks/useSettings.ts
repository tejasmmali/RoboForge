"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserSettings,
  resetUserSettings,
  updateUserSettings,
} from "@/lib/db/settings";
import { queryKeys } from "@/lib/db/query-keys";
import { useAuth } from "@/hooks/useAuth";
import type { UserSettingsUpdate } from "@/types/settings";

export function useSettings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.settings(user?.id ?? ""),
    queryFn: () => getUserSettings(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useUpdateSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: UserSettingsUpdate) => {
      if (!user) throw new Error("Sign in required");
      return updateUserSettings(user.id, updates);
    },
    onMutate: async (updates) => {
      if (!user) return;
      const key = queryKeys.settings(user.id);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof getUserSettings>>>(key);
      queryClient.setQueryData(key, (old: typeof previous) =>
        old
          ? { ...old, ...updates, updatedAt: new Date().toISOString() }
          : old,
      );
      return { previous, key };
    },
    onError: (_err, _updates, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.settings(user.id) });
      }
    },
  });
}

export function useResetSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Sign in required");
      return resetUserSettings(user.id);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.settings(user.id) });
      }
    },
  });
}
