import { getBrowserDb } from "@/lib/db/client";
import { logger } from "@/lib/db/logger";
import { projects as staticProjects, type Project } from "@/lib/projects";
import { getProjectDetail, type ProjectDetail } from "@/lib/project-details";
import type { PaginatedResult } from "@/lib/db/rls";
import type { ProjectListParams, ProjectStep } from "@/types/project";
import type { DbProject } from "@/types/database";

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

function mapDbProject(row: DbProject): Project {
  const staticMatch = staticProjects.find((p) => p.slug === row.slug);
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty as Project["difficulty"],
    category: row.category,
    time: row.time_estimate ?? staticMatch?.time ?? "",
    cost: row.cost_estimate ?? staticMatch?.cost ?? "",
    costValue: staticMatch?.costValue ?? 0,
    timeHours: staticMatch?.timeHours ?? 0,
    componentCount: row.component_count ?? staticMatch?.componentCount ?? 0,
    technologies: (row.technologies ?? staticMatch?.technologies ?? []) as Project["technologies"],
    complexity: staticMatch?.complexity ?? 0,
    tags: staticMatch?.tags ?? (["all"] as Project["tags"]),
    isNew: staticMatch?.isNew,
    isPopular: staticMatch?.isPopular,
    addedAt: row.created_at?.slice(0, 10) ?? staticMatch?.addedAt ?? "",
    popularity: staticMatch?.popularity ?? 0,
    image: row.image_url ?? staticMatch?.image ?? "",
  };
}

function filterProjectsList(items: Project[], params: ProjectListParams = {}): Project[] {
  let result = [...items];
  const { query, difficulty, category, sort = "newest" } = params;

  if (query?.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.difficulty.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.includes(q)) ||
        p.tags.some((t) => t.includes(q)),
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

async function fetchProjectsFromDb(): Promise<Project[] | null> {
  try {
    const supabase = getBrowserDb();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data?.length) return null;
    return (data as DbProject[]).map(mapDbProject);
  } catch (error) {
    logger.db("fetchProjectsFromDb fallback to static catalog", { error });
    return null;
  }
}

async function getCatalogProjects(): Promise<Project[]> {
  const remote = await fetchProjectsFromDb();
  return remote ?? staticProjects;
}

/** Catalog repository — Supabase when available, static fallback. */
export async function getProjects(
  params: ProjectListParams = {},
): Promise<PaginatedResult<Project>> {
  const catalog = await getCatalogProjects();
  const filtered = filterProjectsList(catalog, params);
  return paginate(filtered, params.page, params.pageSize);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const catalog = await getCatalogProjects();
  return catalog.find((p) => p.slug === slug) ?? null;
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
  const catalog = await getCatalogProjects();
  return catalog.map((p) => p.slug);
}

export async function searchProjects(
  query: string,
  limit = 10,
): Promise<Project[]> {
  const catalog = await getCatalogProjects();
  return filterProjectsList(catalog, { query, pageSize: limit, page: 1 }).slice(0, limit);
}
