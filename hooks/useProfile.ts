"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ensureProfile,
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
} from "@/lib/db/profiles";
import { queryKeys } from "@/lib/db/query-keys";
import { useAuth } from "@/hooks/useAuth";
import type { ProfileUpdateInput } from "@/types/profile";

export function useProfile(userId?: string) {
  const { user } = useAuth();
  const id = userId ?? user?.id;

  return useQuery({
    queryKey: queryKeys.profile(id ?? ""),
    queryFn: () => getProfile(id!),
    enabled: Boolean(id),
  });
}

export function useEnsureProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Sign in required");
      return ensureProfile(user);
    },
    onSuccess: (data) => {
      if (data && user) {
        queryClient.setQueryData(queryKeys.profile(user.id), data);
      }
    },
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: ProfileUpdateInput) => {
      if (!user) throw new Error("Sign in required");
      return updateProfile(user.id, updates);
    },
    onMutate: async (updates) => {
      if (!user) return;
      const key = queryKeys.profile(user.id);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof getProfile>>>(key);
      queryClient.setQueryData(key, (old: typeof previous) =>
        old ? { ...old, ...updates, updated_at: new Date().toISOString() } : old,
      );
      return { previous, key };
    },
    onError: (_err, _updates, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.profile(user.id) });
      }
    },
  });
}

export function useUploadAvatar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      if (!user) throw new Error("Sign in required");
      return uploadAvatar(user.id, file);
    },
    onSuccess: (url) => {
      if (user) {
        queryClient.setQueryData(
          queryKeys.profile(user.id),
          (old: Awaited<ReturnType<typeof getProfile>>) =>
            old ? { ...old, avatar_url: url } : old,
        );
      }
    },
  });
}

export function useDeleteAvatar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Sign in required");
      return deleteAvatar(user.id);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.profile(user.id) });
      }
    },
  });
}
