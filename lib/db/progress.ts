import { getBrowserDb } from "@/lib/db/client";
import { executeQuery } from "@/lib/db/errors";
import { logger } from "@/lib/db/logger";
import { offlineCache, offlineQueue } from "@/lib/db/offline";
import { progressUpdateSchema } from "@/lib/validations/db";
import type { DbProjectProgress } from "@/types/database";
import type {
  ProjectProgressRecord,
  ResumeProgress,
  UpdateProgressInput,
} from "@/types/progress";

function mapProgress(row: DbProjectProgress): ProjectProgressRecord {
  return {
    id: row.id,
    userId: row.user_id,
    projectSlug: row.project_slug,
    progress: Number(row.progress),
    currentStep: row.current_step ?? 1,
    lastOpenedAt: row.last_opened_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    timeSpentMinutes: row.time_spent_minutes ?? 0,
    estimatedRemaining: row.estimated_remaining,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDbPayload(userId: string, input: UpdateProgressInput) {
  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    user_id: userId,
    project_slug: input.projectSlug,
    last_opened_at: now,
    updated_at: now,
  };

  if (input.progress != null) payload.progress = input.progress;
  if (input.currentStep != null) payload.current_step = input.currentStep;
  if (input.timeSpentMinutes != null)
    payload.time_spent_minutes = input.timeSpentMinutes;
  if (input.estimatedRemaining != null)
    payload.estimated_remaining = input.estimatedRemaining;

  if (input.markCompleted) {
    payload.progress = 100;
    payload.completed_at = now;
  }

  return payload;
}

export async function getProjectProgressList(
  userId: string,
): Promise<ProjectProgressRecord[]> {
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from("project_progress")
    .select("*")
    .eq("user_id", userId)
    .order("last_opened_at", { ascending: false });

  if (error) {
    logger.db("getProjectProgressList failed", { error });
    return offlineCache.get<ProjectProgressRecord[]>(`progress:${userId}`) ?? [];
  }

  const mapped = ((data ?? []) as DbProjectProgress[]).map(mapProgress);
  offlineCache.set(`progress:${userId}`, mapped);
  return mapped;
}

export async function getProgressForProject(
  userId: string,
  projectSlug: string,
): Promise<ProjectProgressRecord | null> {
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from("project_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("project_slug", projectSlug)
    .maybeSingle();

  if (error || !data) return null;
  return mapProgress(data as DbProjectProgress);
}

export async function updateProgress(
  userId: string,
  input: UpdateProgressInput,
): Promise<ProjectProgressRecord> {
  const parsed = progressUpdateSchema.parse(input);
  const supabase = getBrowserDb();
  const now = new Date().toISOString();

  const existing = await getProgressForProject(userId, parsed.projectSlug);

  const row = await executeQuery<DbProjectProgress>(() =>
    supabase
      .from("project_progress")
      .upsert(
        {
          ...toDbPayload(userId, parsed),
          started_at: existing?.startedAt ?? now,
          progress: parsed.progress ?? existing?.progress ?? 0,
          current_step: parsed.currentStep ?? existing?.currentStep ?? 1,
          time_spent_minutes:
            parsed.timeSpentMinutes ?? existing?.timeSpentMinutes ?? 0,
        },
        { onConflict: "user_id,project_slug" },
      )
      .select("*")
      .single(),
  );

  return mapProgress(row);
}

export async function resumeProgress(
  userId: string,
): Promise<ResumeProgress | null> {
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from("project_progress")
    .select("*")
    .eq("user_id", userId)
    .is("completed_at", null)
    .order("last_opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  const row = mapProgress(data as DbProjectProgress);
  return {
    projectSlug: row.projectSlug,
    currentStep: row.currentStep,
    progress: row.progress,
    lastOpenedAt: row.lastOpenedAt,
  };
}

export async function markStepVisited(
  userId: string,
  projectSlug: string,
  stepNumber: number,
  totalSteps: number,
): Promise<ProjectProgressRecord> {
  const progress = Math.min(
    100,
    Math.round((stepNumber / Math.max(totalSteps, 1)) * 100),
  );

  return updateProgress(userId, {
    projectSlug,
    currentStep: stepNumber,
    progress,
  });
}

export function queueProgressSync(payload: UpdateProgressInput & { userId: string }) {
  offlineQueue.enqueue("update-progress", payload);
}
