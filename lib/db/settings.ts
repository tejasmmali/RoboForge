import { getBrowserDb } from "@/lib/db/client";
import { executeQuery } from "@/lib/db/errors";
import { logger } from "@/lib/db/logger";
import { offlineCache } from "@/lib/db/offline";
import { settingsUpdateSchema } from "@/lib/validations/db";
import type { DbUserSettings } from "@/types/database";
import {
  DEFAULT_USER_SETTINGS,
  type UserSettings,
  type UserSettingsUpdate,
} from "@/types/settings";

const CACHE_PREFIX = "settings:";

function mapSettings(row: DbUserSettings): UserSettings {
  return {
    userId: row.user_id,
    theme: row.theme,
    language: row.language,
    notificationPreferences: (row.notification_preferences ??
      DEFAULT_USER_SETTINGS.notificationPreferences) as UserSettings["notificationPreferences"],
    aiResponseLength: row.ai_response_length,
    preferredProgrammingLanguage: row.preferred_programming_language,
    accessibility: (row.accessibility ??
      DEFAULT_USER_SETTINGS.accessibility) as UserSettings["accessibility"],
    updatedAt: row.updated_at,
  };
}

function toDbRow(userId: string, updates: UserSettingsUpdate) {
  return {
    user_id: userId,
    theme: updates.theme,
    language: updates.language,
    notification_preferences: updates.notificationPreferences,
    ai_response_length: updates.aiResponseLength,
    preferred_programming_language: updates.preferredProgrammingLanguage,
    accessibility: updates.accessibility,
    updated_at: new Date().toISOString(),
  };
}

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    logger.db("getUserSettings fallback", { error });
    const cached = offlineCache.get<UserSettings>(`${CACHE_PREFIX}${userId}`);
    if (cached) return cached;
    return { userId, ...DEFAULT_USER_SETTINGS, updatedAt: new Date().toISOString() };
  }

  const mapped = mapSettings(data as DbUserSettings);
  offlineCache.set(`${CACHE_PREFIX}${userId}`, mapped);
  return mapped;
}

export async function updateUserSettings(
  userId: string,
  updates: UserSettingsUpdate,
): Promise<UserSettings> {
  const parsed = settingsUpdateSchema.parse({
    theme: updates.theme,
    language: updates.language,
    aiResponseLength: updates.aiResponseLength,
    preferredProgrammingLanguage: updates.preferredProgrammingLanguage,
    notificationPreferences: updates.notificationPreferences,
    accessibility: updates.accessibility,
  });

  const supabase = getBrowserDb();
  const existing = await getUserSettings(userId);

  try {
    const row = await executeQuery<DbUserSettings>(() =>
      supabase
        .from("user_settings")
        .upsert(
          {
            ...toDbRow(userId, {
              theme: parsed.theme ?? existing.theme,
              language: parsed.language ?? existing.language,
              aiResponseLength: parsed.aiResponseLength ?? existing.aiResponseLength,
              preferredProgrammingLanguage:
                parsed.preferredProgrammingLanguage ??
                existing.preferredProgrammingLanguage,
              notificationPreferences: {
                ...existing.notificationPreferences,
                ...(parsed.notificationPreferences ?? {}),
              },
              accessibility: {
                ...existing.accessibility,
                ...(parsed.accessibility ?? {}),
              },
            }),
          },
          { onConflict: "user_id" },
        )
        .select("*")
        .single(),
    );
    return mapSettings(row);
  } catch (error) {
    logger.db("updateUserSettings failed — caching locally", { error });
    const merged: UserSettings = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    offlineCache.set(`${CACHE_PREFIX}${userId}`, merged);
    return merged;
  }
}

export async function resetUserSettings(userId: string): Promise<UserSettings> {
  return updateUserSettings(userId, DEFAULT_USER_SETTINGS);
}
