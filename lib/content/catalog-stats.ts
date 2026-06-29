import { projects } from "@/lib/projects";
import { components } from "@/lib/components-catalog";

export const CATALOG_STATS = {
  projectCount: projects.length,
  componentCount: components.length,
  categoryCount: new Set(projects.map((p) => p.category)).size,
} as const;

export function formatCatalogCount(count: number): string {
  return String(count);
}
