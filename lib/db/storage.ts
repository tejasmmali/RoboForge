import { getBrowserDb } from "@/lib/db/client";
import { parseSupabaseError } from "@/lib/db/errors";
import { logger } from "@/lib/db/logger";
import { STORAGE_BUCKETS } from "@/lib/db/rls";

export async function uploadToStorage(
  bucket: string,
  path: string,
  file: File,
): Promise<string> {
  const supabase = getBrowserDb();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    cacheControl: "3600",
  });

  if (error) throw parseSupabaseError(error);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function removeFromStorage(
  bucket: string,
  path: string,
): Promise<void> {
  const supabase = getBrowserDb();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw parseSupabaseError(error);
}

export async function ensureStorageBuckets(): Promise<void> {
  const supabase = getBrowserDb();
  for (const bucket of Object.values(STORAGE_BUCKETS)) {
    const { error } = await supabase.storage.getBucket(bucket);
    if (error) {
      logger.warn(`Storage bucket "${bucket}" not found — create in Supabase dashboard.`);
    }
  }
}

export { STORAGE_BUCKETS };
