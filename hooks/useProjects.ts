"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects, getProjectBySlug, getProjectDetailBySlug, getProjectSteps } from "@/lib/db/projects";
import { queryKeys } from "@/lib/db/query-keys";
import type { ProjectListParams } from "@/types/project";

export function useProjects(params: ProjectListParams = {}) {
  return useQuery({
    queryKey: queryKeys.projects.list(params),
    queryFn: () => getProjects(params),
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(slug),
    queryFn: () => getProjectBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useProjectDetail(slug: string) {
  return useQuery({
    queryKey: [...queryKeys.projects.detail(slug), "detail"],
    queryFn: () => getProjectDetailBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useProjectSteps(slug: string) {
  return useQuery({
    queryKey: queryKeys.projects.steps(slug),
    queryFn: () => getProjectSteps(slug),
    enabled: Boolean(slug),
  });
}
