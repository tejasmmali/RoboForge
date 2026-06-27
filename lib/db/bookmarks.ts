import { getBrowserDb } from "@/lib/db/client";
import { DbError, executeOptionalQuery, executeQuery, executeVoidQuery } from "@/lib/db/errors";
import { logger } from "@/lib/db/logger";
import { offlineCache, offlineQueue } from "@/lib/db/offline";
import {
  bookmarkComponentSchema,
  bookmarkProjectSchema,
} from "@/lib/validations/db";
import type { DbSavedComponent, DbSavedProject } from "@/types/database";
import type { SavedComponentRecord } from "@/types/component";

export type SavedProjectRecord = {
  id: string;
  userId: string;
  projectSlug: string;
  title: string;
  difficulty: string;
  image: string;
  savedAt: string;
};

function mapSavedProject(row: DbSavedProject): SavedProjectRecord {
  return {
    id: row.id,
    userId: row.user_id,
    projectSlug: row.project_slug,
    title: row.title ?? "",
    difficulty: row.difficulty ?? "",
    image: row.image ?? "",
    savedAt: row.saved_at,
  };
}

function mapSavedComponent(row: DbSavedComponent): SavedComponentRecord {
  return {
    id: row.id,
    userId: row.user_id,
    componentSlug: row.component_slug,
    name: row.name ?? "",
    category: row.category ?? "",
    image: row.image ?? "",
    specifications: row.specifications ?? "",
    buyUrl: row.buy_url ?? "",
    savedAt: row.saved_at,
  };
}

function assertOwner(userId: string, resourceUserId: string) {
  if (userId !== resourceUserId) {
    throw new DbError({ code: "unauthorized", message: "Not allowed." });
  }
}

export async function getSavedProjects(
  userId: string,
): Promise<SavedProjectRecord[]> {
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from("saved_projects")
    .select("*")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });

  if (error) {
    logger.db("getSavedProjects failed", { error });
    return offlineCache.get<SavedProjectRecord[]>(`bookmarks:projects:${userId}`) ?? [];
  }

  const rows = (data ?? []) as DbSavedProject[];
  const mapped = rows.map(mapSavedProject);
  offlineCache.set(`bookmarks:projects:${userId}`, mapped);
  return mapped;
}

export async function saveProject(
  userId: string,
  input: {
    projectSlug: string;
    title?: string;
    difficulty?: string;
    image?: string;
  },
): Promise<SavedProjectRecord> {
  const parsed = bookmarkProjectSchema.parse(input);
  const supabase = getBrowserDb();

  const row = await executeQuery<DbSavedProject>(() =>
    supabase
      .from("saved_projects")
      .upsert(
        {
          user_id: userId,
          project_slug: parsed.projectSlug,
          title: parsed.title ?? null,
          difficulty: parsed.difficulty ?? null,
          image: parsed.image ?? null,
          saved_at: new Date().toISOString(),
        },
        { onConflict: "user_id,project_slug" },
      )
      .select("*")
      .single(),
  );

  return mapSavedProject(row);
}

export async function removeBookmark(
  userId: string,
  projectSlug: string,
): Promise<void> {
  bookmarkProjectSchema.parse({ projectSlug });
  const supabase = getBrowserDb();
  await executeVoidQuery(() =>
    supabase
      .from("saved_projects")
      .delete()
      .eq("user_id", userId)
      .eq("project_slug", projectSlug),
  );
}

export async function isProjectBookmarked(
  userId: string,
  projectSlug: string,
): Promise<boolean> {
  const supabase = getBrowserDb();
  const row = await executeOptionalQuery<Pick<DbSavedProject, "id">>(() =>
    supabase
      .from("saved_projects")
      .select("id")
      .eq("user_id", userId)
      .eq("project_slug", projectSlug)
      .maybeSingle(),
  );
  return Boolean(row);
}

export async function getSavedComponents(
  userId: string,
): Promise<SavedComponentRecord[]> {
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from("saved_components")
    .select("*")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });

  if (error) {
    logger.db("getSavedComponents failed", { error });
    return offlineCache.get<SavedComponentRecord[]>(`bookmarks:components:${userId}`) ?? [];
  }

  const mapped = ((data ?? []) as DbSavedComponent[]).map(mapSavedComponent);
  offlineCache.set(`bookmarks:components:${userId}`, mapped);
  return mapped;
}

export async function saveComponent(
  userId: string,
  input: {
    componentSlug: string;
    name?: string;
    category?: string;
    image?: string;
    specifications?: string;
    buyUrl?: string;
  },
): Promise<SavedComponentRecord> {
  const parsed = bookmarkComponentSchema.parse({
    ...input,
    buyUrl: input.buyUrl,
  });

  const supabase = getBrowserDb();
  const row = await executeQuery<DbSavedComponent>(() =>
    supabase
      .from("saved_components")
      .upsert(
        {
          user_id: userId,
          component_slug: parsed.componentSlug,
          name: parsed.name ?? null,
          category: parsed.category ?? null,
          image: parsed.image ?? null,
          specifications: parsed.specifications ?? null,
          buy_url: parsed.buyUrl ?? null,
          saved_at: new Date().toISOString(),
        },
        { onConflict: "user_id,component_slug" },
      )
      .select("*")
      .single(),
  );

  return mapSavedComponent(row);
}

export async function removeComponentBookmark(
  userId: string,
  componentSlug: string,
): Promise<void> {
  bookmarkComponentSchema.parse({ componentSlug });
  const supabase = getBrowserDb();
  await executeVoidQuery(() =>
    supabase
      .from("saved_components")
      .delete()
      .eq("user_id", userId)
      .eq("component_slug", componentSlug),
  );
}

export function queueBookmarkSync(
  type: "save-project" | "remove-project" | "save-component" | "remove-component",
  payload: Record<string, unknown>,
) {
  offlineQueue.enqueue(type, payload);
}

export { assertOwner };
