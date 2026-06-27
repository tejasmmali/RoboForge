import { getBrowserDb } from "@/lib/db/client";
import { logger } from "@/lib/db/logger";
import type { PaginatedResult } from "@/lib/db/rls";
import type { DbResource } from "@/types/database";
import type { ResourceListParams, ResourceRecord } from "@/types/resource";

const STATIC_RESOURCES: ResourceRecord[] = [
  {
    id: "res-1",
    slug: "arduino-getting-started",
    title: "Arduino Getting Started Guide",
    description: "Official-style introduction to Arduino programming and wiring.",
    type: "guide",
    category: "arduino",
    url: "/projects",
    storagePath: null,
    published: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "res-2",
    slug: "hc-sr04-datasheet",
    title: "HC-SR04 Datasheet",
    description: "Ultrasonic sensor specifications and timing diagrams.",
    type: "datasheet",
    category: "sensors",
    url: null,
    storagePath: "resources/hc-sr04-datasheet.pdf",
    published: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

function mapResource(row: DbResource): ResourceRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    type: row.type,
    category: row.category,
    url: row.url,
    storagePath: row.storage_path,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getResources(
  params: ResourceListParams = {},
): Promise<PaginatedResult<ResourceRecord>> {
  const supabase = getBrowserDb();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;

  const { data, error } = await supabase
    .from("resources")
    .select("*", { count: "exact" })
    .eq("published", true)
    .range((page - 1) * pageSize, page * pageSize - 1);

  let items: ResourceRecord[];

  if (error || !data?.length) {
    logger.db("getResources fallback to static catalog", { error });
    items = STATIC_RESOURCES;
  } else {
    items = (data as DbResource[]).map(mapResource);
  }

  if (params.query?.trim()) {
    const q = params.query.toLowerCase();
    items = items.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q),
    );
  }

  if (params.type && params.type !== "all") {
    items = items.filter((r) => r.type === params.type);
  }

  return {
    items: items.slice(0, pageSize),
    total: items.length,
    page,
    pageSize,
    hasMore: items.length > pageSize,
  };
}

export async function getResourceBySlug(
  slug: string,
): Promise<ResourceRecord | null> {
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return STATIC_RESOURCES.find((r) => r.slug === slug) ?? null;
  }

  return mapResource(data as DbResource);
}
