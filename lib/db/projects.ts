import { projects, type Project } from "@/lib/projects";
import { getProjectDetail, type ProjectDetail } from "@/lib/project-details";
import type { PaginatedResult } from "@/lib/db/rls";
import type { ProjectListParams, ProjectStep } from "@/types/project";

function paginate<T>(items: T[], page = 1, pageSize = 12): PaginatedResult<T> {
  const start = (page - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return {
    items: slice,
    total: items.length,
    page,
    pageSize,
    hasMore: start + pageSize < items.length,
  };
}

function filterProjects(params: ProjectListParams = {}): Project[] {
  let result = [...projects];
  const { query, difficulty, category, sort = "newest" } = params;

  if (query?.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  if (difficulty && difficulty !== "all") {
    result = result.filter(
      (p) => p.difficulty.toLowerCase() === difficulty.toLowerCase(),
    );
  }

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  switch (sort) {
    case "popular":
      result.sort((a, b) => b.popularity - a.popularity);
      break;
    case "difficulty":
      result.sort((a, b) => a.complexity - b.complexity);
      break;
    case "cost":
      result.sort((a, b) => a.costValue - b.costValue);
      break;
    case "time":
      result.sort((a, b) => a.timeHours - b.timeHours);
      break;
    default:
      result.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  }

  return result;
}

/** Catalog repository — static today, DB-ready interface. */
export async function getProjects(
  params: ProjectListParams = {},
): Promise<PaginatedResult<Project>> {
  const filtered = filterProjects(params);
  return paginate(filtered, params.page, params.pageSize);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getProjectDetailBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  return getProjectDetail(slug);
}

export async function getProjectSteps(slug: string): Promise<ProjectStep[]> {
  const detail = getProjectDetail(slug);
  if (!detail) return [];
  return detail.steps.map((step) => ({
    number: step.number,
    title: step.title,
    content: step.content,
    image: step.image,
    checklist: step.checklist,
  }));
}

export async function getAllProjectSlugs(): Promise<string[]> {
  return projects.map((p) => p.slug);
}

export async function searchProjects(
  query: string,
  limit = 10,
): Promise<Project[]> {
  return filterProjects({ query, pageSize: limit, page: 1 }).slice(0, limit);
}
