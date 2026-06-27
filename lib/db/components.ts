import { components, filterChips, type ComponentItem } from "@/lib/components-catalog";
import type { PaginatedResult } from "@/lib/db/rls";
import type { ComponentListParams } from "@/types/component";

function paginate<T>(items: T[], page = 1, pageSize = 24): PaginatedResult<T> {
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

function filterComponents(params: ComponentListParams = {}): ComponentItem[] {
  let result = [...components];
  const { query, category, sort = "popular" } = params;

  if (query?.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.categoryLabel.toLowerCase().includes(q),
    );
  }

  if (category && category !== "all") {
    result = result.filter((c) => c.category === category);
  }

  switch (sort) {
    case "alphabetical":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "price":
      result.sort((a, b) => a.priceValue - b.priceValue);
      break;
    case "newest":
      result.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
      break;
    default:
      result.sort((a, b) => Number(b.popular) - Number(a.popular));
  }

  return result;
}

export async function getComponents(
  params: ComponentListParams = {},
): Promise<PaginatedResult<ComponentItem>> {
  return paginate(filterComponents(params), params.page, params.pageSize);
}

export async function getComponentBySlug(
  slug: string,
): Promise<ComponentItem | null> {
  return components.find((c) => c.slug === slug) ?? null;
}

export async function getCategories() {
  return filterChips.filter((c) => c.id !== "all");
}

export async function searchComponents(
  query: string,
  limit = 10,
): Promise<ComponentItem[]> {
  return filterComponents({ query, pageSize: limit, page: 1 }).slice(0, limit);
}
