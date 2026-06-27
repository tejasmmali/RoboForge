"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjectProgressList,
  getProgressForProject,
  updateProgress,
  resumeProgress,
  markStepVisited,
} from "@/lib/db/progress";
import { queryKeys } from "@/lib/db/query-keys";
import { useAuth } from "@/hooks/useAuth";
import type { ProjectProgressRecord, UpdateProgressInput } from "@/types/progress";

export function useProgressList() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.progress.all(user?.id ?? ""),
    queryFn: () => getProjectProgressList(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useProjectProgress(projectSlug: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.progress.project(user?.id ?? "", projectSlug),
    queryFn: () => getProgressForProject(user!.id, projectSlug),
    enabled: Boolean(user?.id && projectSlug),
  });
}

export function useResumeProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...queryKeys.progress.all(user?.id ?? ""), "resume"],
    queryFn: () => resumeProgress(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useUpdateProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProgressInput) => {
      if (!user) throw new Error("Sign in required");
      return updateProgress(user.id, input);
    },
    onMutate: async (input) => {
      if (!user) return;
      const key = queryKeys.progress.project(user.id, input.projectSlug);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ProjectProgressRecord | null>(key);
      queryClient.setQueryData<ProjectProgressRecord | null>(key, (old) =>
        old
          ? {
              ...old,
              progress: input.progress ?? old.progress,
              currentStep: input.currentStep ?? old.currentStep,
              lastOpenedAt: new Date().toISOString(),
            }
          : old,
      );
      return { previous, key };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
    },
    onSettled: (_data, _err, input) => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.progress.all(user.id),
        });
        void queryClient.invalidateQueries({
          queryKey: queryKeys.progress.project(user.id, input.projectSlug),
        });
      }
    },
  });
}

export function useMarkStepVisited() {
  const { user } = useAuth();
  const update = useUpdateProgress();

  return useMutation({
    mutationFn: ({
      projectSlug,
      stepNumber,
      totalSteps,
    }: {
      projectSlug: string;
      stepNumber: number;
      totalSteps: number;
    }) => {
      if (!user) throw new Error("Sign in required");
      return markStepVisited(user.id, projectSlug, stepNumber, totalSteps);
    },
    onSuccess: (data) => {
      update.reset();
      return data;
    },
  });
}
