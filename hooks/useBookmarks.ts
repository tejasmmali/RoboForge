"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSavedProjects,
  getSavedComponents,
  saveProject,
  removeBookmark,
  saveComponent,
  removeComponentBookmark,
  isProjectBookmarked,
} from "@/lib/db/bookmarks";
import { queryKeys } from "@/lib/db/query-keys";
import { useAuth } from "@/hooks/useAuth";
import { isDbError } from "@/lib/db/errors";

export function useSavedProjects() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.bookmarks.projects(user?.id ?? ""),
    queryFn: () => getSavedProjects(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useSavedComponents() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.bookmarks.components(user?.id ?? ""),
    queryFn: () => getSavedComponents(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useIsProjectBookmarked(projectSlug: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...queryKeys.bookmarks.projects(user?.id ?? ""), projectSlug],
    queryFn: () => isProjectBookmarked(user!.id, projectSlug),
    enabled: Boolean(user?.id && projectSlug),
  });
}

export function useBookmarkProject() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      projectSlug: string;
      title?: string;
      difficulty?: string;
      image?: string;
    }) => {
      if (!user) throw new Error("Sign in required");
      return saveProject(user.id, input);
    },
    onMutate: async (input) => {
      if (!user) return;
      const key = queryKeys.bookmarks.projects(user.id);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof getSavedProjects>>>(key);
      queryClient.setQueryData(key, (old: typeof previous) => [
        ...(old ?? []),
        {
          id: `optimistic-${input.projectSlug}`,
          userId: user.id,
          projectSlug: input.projectSlug,
          title: input.title ?? "",
          difficulty: input.difficulty ?? "",
          image: input.image ?? "",
          savedAt: new Date().toISOString(),
        },
      ]);
      return { previous, key };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.bookmarks.projects(user.id),
        });
      }
    },
  });
}

export function useRemoveProjectBookmark() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectSlug: string) => {
      if (!user) throw new Error("Sign in required");
      return removeBookmark(user.id, projectSlug);
    },
    onMutate: async (projectSlug) => {
      if (!user) return;
      const key = queryKeys.bookmarks.projects(user.id);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof getSavedProjects>>>(key);
      queryClient.setQueryData(
        key,
        (old: typeof previous) =>
          old?.filter((p) => p.projectSlug !== projectSlug) ?? [],
      );
      return { previous, key };
    },
    onError: (_err, _slug, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.bookmarks.projects(user.id),
        });
      }
    },
  });
}

export function useBookmarkComponent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof saveComponent>[1]) => {
      if (!user) throw new Error("Sign in required");
      return saveComponent(user.id, input);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.bookmarks.components(user.id),
        });
      }
    },
  });
}

export function useRemoveComponentBookmark() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (componentSlug: string) => {
      if (!user) throw new Error("Sign in required");
      return removeComponentBookmark(user.id, componentSlug);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.bookmarks.components(user.id),
        });
      }
    },
  });
}

export function getBookmarkError(error: unknown) {
  return isDbError(error) ? error.message : "Bookmark action failed.";
}
