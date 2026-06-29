"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSavedProjects,
  getSavedComponents,
  saveProject,
  removeBookmark,
  saveComponent,
  removeComponentBookmark,
  isProjectBookmarked,
  isComponentBookmarked,
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

export function useIsComponentBookmarked(componentSlug: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...queryKeys.bookmarks.components(user?.id ?? ""), componentSlug],
    queryFn: () => isComponentBookmarked(user!.id, componentSlug),
    enabled: Boolean(user?.id && componentSlug),
  });
}

function invalidateProjectBookmarkQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string,
  projectSlug?: string,
) {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.bookmarks.projects(userId),
  });
  if (projectSlug) {
    void queryClient.invalidateQueries({
      queryKey: [...queryKeys.bookmarks.projects(userId), projectSlug],
    });
  }
}

function invalidateComponentBookmarkQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string,
  componentSlug?: string,
) {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.bookmarks.components(userId),
  });
  if (componentSlug) {
    void queryClient.invalidateQueries({
      queryKey: [...queryKeys.bookmarks.components(userId), componentSlug],
    });
  }
}

export function useToggleProjectBookmark(meta: {
  projectSlug: string;
  title?: string;
  difficulty?: string;
  image?: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { data: isSaved } = useIsProjectBookmarked(meta.projectSlug);
  const bookmark = useBookmarkProject();
  const remove = useRemoveProjectBookmark();

  const toggle = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (isSaved) {
      remove.mutate(meta.projectSlug);
    } else {
      bookmark.mutate({
        projectSlug: meta.projectSlug,
        title: meta.title,
        difficulty: meta.difficulty,
        image: meta.image,
      });
    }
  };

  return {
    isSaved: Boolean(isSaved),
    toggle,
    isPending: bookmark.isPending || remove.isPending,
  };
}

export function useToggleComponentBookmark(meta: {
  componentSlug: string;
  name?: string;
  category?: string;
  image?: string;
  specifications?: string;
  buyUrl?: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { data: isSaved } = useIsComponentBookmarked(meta.componentSlug);
  const bookmark = useBookmarkComponent();
  const remove = useRemoveComponentBookmark();

  const toggle = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (isSaved) {
      remove.mutate(meta.componentSlug);
    } else {
      bookmark.mutate({
        componentSlug: meta.componentSlug,
        name: meta.name,
        category: meta.category,
        image: meta.image,
        specifications: meta.specifications,
        buyUrl: meta.buyUrl,
      });
    }
  };

  return {
    isSaved: Boolean(isSaved),
    toggle,
    isPending: bookmark.isPending || remove.isPending,
  };
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
      const slugKey = [...key, input.projectSlug] as const;
      await queryClient.cancelQueries({ queryKey: key });
      await queryClient.cancelQueries({ queryKey: slugKey });
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof getSavedProjects>>>(key);
      const previousSlug = queryClient.getQueryData<boolean>(slugKey);
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
      queryClient.setQueryData(slugKey, true);
      return { previous, key, previousSlug, slugKey };
    },
    onError: (err, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
      if (context?.slugKey) {
        queryClient.setQueryData(context.slugKey, context.previousSlug ?? false);
      }
      console.error("[bookmark]", getBookmarkError(err));
    },
    onSettled: (_data, _err, input) => {
      if (user) {
        invalidateProjectBookmarkQueries(queryClient, user.id, input.projectSlug);
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
      const slugKey = [...key, projectSlug] as const;
      await queryClient.cancelQueries({ queryKey: key });
      await queryClient.cancelQueries({ queryKey: slugKey });
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof getSavedProjects>>>(key);
      const previousSlug = queryClient.getQueryData<boolean>(slugKey);
      queryClient.setQueryData(
        key,
        (old: typeof previous) =>
          old?.filter((p) => p.projectSlug !== projectSlug) ?? [],
      );
      queryClient.setQueryData(slugKey, false);
      return { previous, key, previousSlug, slugKey };
    },
    onError: (err, _slug, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
      if (context?.slugKey) {
        queryClient.setQueryData(context.slugKey, context.previousSlug ?? false);
      }
      console.error("[bookmark]", getBookmarkError(err));
    },
    onSettled: (_data, _err, projectSlug) => {
      if (user) {
        invalidateProjectBookmarkQueries(queryClient, user.id, projectSlug);
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
    onMutate: async (input) => {
      if (!user) return;
      const key = queryKeys.bookmarks.components(user.id);
      const slugKey = [...key, input.componentSlug] as const;
      await queryClient.cancelQueries({ queryKey: key });
      await queryClient.cancelQueries({ queryKey: slugKey });
      const previousSlug = queryClient.getQueryData<boolean>(slugKey);
      queryClient.setQueryData(slugKey, true);
      return { previousSlug, slugKey };
    },
    onError: (err, input, context) => {
      if (context?.slugKey) {
        queryClient.setQueryData(context.slugKey, context.previousSlug ?? false);
      }
      console.error("[bookmark]", getBookmarkError(err));
    },
    onSettled: (_data, _err, input) => {
      if (user) {
        invalidateComponentBookmarkQueries(queryClient, user.id, input.componentSlug);
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
    onMutate: async (componentSlug) => {
      if (!user) return;
      const key = queryKeys.bookmarks.components(user.id);
      const slugKey = [...key, componentSlug] as const;
      await queryClient.cancelQueries({ queryKey: slugKey });
      const previousSlug = queryClient.getQueryData<boolean>(slugKey);
      queryClient.setQueryData(slugKey, false);
      return { previousSlug, slugKey };
    },
    onError: (err, _slug, context) => {
      if (context?.slugKey) {
        queryClient.setQueryData(context.slugKey, context.previousSlug ?? false);
      }
      console.error("[bookmark]", getBookmarkError(err));
    },
    onSettled: (_data, _err, componentSlug) => {
      if (user) {
        invalidateComponentBookmarkQueries(queryClient, user.id, componentSlug);
      }
    },
  });
}

export function getBookmarkError(error: unknown) {
  if (isDbError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return "Bookmark action failed.";
}
