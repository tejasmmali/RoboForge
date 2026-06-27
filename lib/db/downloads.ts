import { getBrowserDb } from "@/lib/db/client";
import { executeQuery } from "@/lib/db/errors";
import { logger } from "@/lib/db/logger";
import { downloadTrackSchema } from "@/lib/validations/db";
import type { DbDownload } from "@/types/database";
import type { DownloadRecord, TrackDownloadInput } from "@/types/resource";

function mapDownload(row: DbDownload): DownloadRecord {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    fileType: row.file_type,
    projectSlug: row.project_slug,
    resourceUrl: row.resource_url,
    storagePath: row.storage_path,
    downloadedAt: row.downloaded_at,
  };
}

export async function getDownloads(userId: string): Promise<DownloadRecord[]> {
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from("downloads")
    .select("*")
    .eq("user_id", userId)
    .order("downloaded_at", { ascending: false });

  if (error) {
    logger.db("getDownloads failed — table may not exist yet", { error });
    return [];
  }

  return ((data ?? []) as DbDownload[]).map(mapDownload);
}

export async function trackDownload(
  userId: string,
  input: TrackDownloadInput,
): Promise<DownloadRecord> {
  const parsed = downloadTrackSchema.parse(input);
  const supabase = getBrowserDb();

  const row = await executeQuery<DbDownload>(() =>
    supabase
      .from("downloads")
      .insert({
        user_id: userId,
        title: parsed.title,
        file_type: parsed.fileType,
        project_slug: parsed.projectSlug ?? null,
        resource_url: parsed.resourceUrl ?? null,
        storage_path: parsed.storagePath ?? null,
        downloaded_at: new Date().toISOString(),
      })
      .select("*")
      .single(),
  );

  return mapDownload(row);
}

export async function deleteDownload(
  userId: string,
  downloadId: string,
): Promise<void> {
  const supabase = getBrowserDb();
  const { error } = await supabase
    .from("downloads")
    .delete()
    .eq("id", downloadId)
    .eq("user_id", userId);

  if (error) throw error;
}
