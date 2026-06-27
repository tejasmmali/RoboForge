"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDownload, getDownloads, trackDownload } from "@/lib/db/downloads";
import { queryKeys } from "@/lib/db/query-keys";
import { useAuth } from "@/hooks/useAuth";
import type { TrackDownloadInput } from "@/types/resource";

export function useDownloads() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.downloads(user?.id ?? ""),
    queryFn: () => getDownloads(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useTrackDownload() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TrackDownloadInput) => {
      if (!user) throw new Error("Sign in required");
      return trackDownload(user.id, input);
    },
    onMutate: async (input) => {
      if (!user) return;
      const key = queryKeys.downloads(user.id);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof getDownloads>>>(key);
      queryClient.setQueryData(key, (old: typeof previous) => [
        {
          id: `optimistic-${Date.now()}`,
          userId: user.id,
          title: input.title,
          fileType: input.fileType,
          projectSlug: input.projectSlug ?? null,
          resourceUrl: input.resourceUrl ?? null,
          storagePath: input.storagePath ?? null,
          downloadedAt: new Date().toISOString(),
        },
        ...(old ?? []),
      ]);
      return { previous, key };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.downloads(user.id),
        });
      }
    },
  });
}

export function useDeleteDownload() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (downloadId: string) => {
      if (!user) throw new Error("Sign in required");
      return deleteDownload(user.id, downloadId);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.downloads(user.id),
        });
      }
    },
  });
}
