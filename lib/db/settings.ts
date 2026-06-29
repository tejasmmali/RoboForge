import { getBrowserDb } from "@/lib/db/client";
import { executeQuery } from "@/lib/db/errors";
import { logger } from "@/lib/db/logger";
import { offlineCache } from "@/lib/db/offline";
import { settingsUpdateSchema } from "@/lib/validations/db";
import type { DbUserSettings } from "@/types/database";
import {
  DEFAULT_AI_PREFERENCES,
  DEFAULT_APPEARANCE,
  DEFAULT_NOTIFICATION_PREFERENCES,
  DEFAULT_PRIVACY,
  DEFAULT_USER_SETTINGS,
  type AIPreferenceSettings,
  type AppearanceSettings,
  type NotificationPreferences,
  type PrivacySettings,
  type UserSettings,
  type UserSettingsUpdate,
} from "@/types/settings";

const CACHE_PREFIX = "settings:";

type ExtendedJson = {
  appearance?: AppearanceSettings;
  aiPreferences?: AIPreferenceSettings;
  privacy?: PrivacySettings;
  notificationExtras?: Partial<NotificationPreferences>;
};

function parseExtended(accessibility: unknown, notifications: unknown): ExtendedJson {
  const acc = (accessibility ?? {}) as Record<string, unknown>;
  const notif = (notifications ?? {}) as Record<string, unknown>;
  return {
    appearance: (acc.appearance as AppearanceSettings) ?? DEFAULT_APPEARANCE,
    aiPreferences: (acc.aiPreferences as AIPreferenceSettings) ?? DEFAULT_AI_PREFERENCES,
    privacy: (acc.privacy as PrivacySettings) ?? DEFAULT_PRIVACY,
    notificationExtras: notif as Partial<NotificationPreferences>,
  };
}

function mapSettings(row: DbUserSettings): UserSettings {
  const extended = parseExtended(row.accessibility, row.notification_preferences);
  const baseNotif = {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    ...(row.notification_preferences as Partial<NotificationPreferences>),
  };

  return {
    userId: row.user_id,
    theme: row.theme,
    language: row.language,
    notificationPreferences: baseNotif,
    aiResponseLength: row.ai_response_length,
    preferredProgrammingLanguage: row.preferred_programming_language,
    accessibility: {
      reducedMotion: Boolean((row.accessibility as Record<string, unknown>)?.reducedMotion),
      highContrast: Boolean((row.accessibility as Record<string, unknown>)?.highContrast),
      largeText: Boolean((row.accessibility as Record<string, unknown>)?.largeText),
    },
    appearance: extended.appearance ?? DEFAULT_APPEARANCE,
    aiPreferences: {
      ...DEFAULT_AI_PREFERENCES,
      ...extended.aiPreferences,
      responseLength: row.ai_response_length,
      codingStyle:
        (row.preferred_programming_language as AIPreferenceSettings["codingStyle"]) ??
        DEFAULT_AI_PREFERENCES.codingStyle,
      preferredLanguage:
        (row.language as AIPreferenceSettings["preferredLanguage"]) ?? "en",
    },
    privacy: extended.privacy ?? DEFAULT_PRIVACY,
    updatedAt: row.updated_at,
  };
}

function buildAccessibilityPayload(
  existing: UserSettings,
  updates: UserSettingsUpdate,
): Record<string, unknown> {
  return {
    reducedMotion: updates.accessibility?.reducedMotion ?? existing.accessibility.reducedMotion,
    highContrast: updates.accessibility?.highContrast ?? existing.accessibility.highContrast,
    largeText: updates.accessibility?.largeText ?? existing.accessibility.largeText,
    appearance: updates.appearance ?? existing.appearance,
    aiPreferences: updates.aiPreferences ?? existing.aiPreferences,
    privacy: updates.privacy ?? existing.privacy,
  };
}

function toDbRow(userId: string, merged: UserSettings) {
  return {
    user_id: userId,
    theme: merged.theme,
    language: merged.aiPreferences.preferredLanguage,
    notification_preferences: merged.notificationPreferences,
    ai_response_length: merged.aiPreferences.responseLength,
    preferred_programming_language: merged.aiPreferences.codingStyle,
    accessibility: buildAccessibilityPayload(merged, merged),
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
  settingsUpdateSchema.parse({
    theme: updates.theme,
    language: updates.language ?? updates.aiPreferences?.preferredLanguage,
    aiResponseLength: updates.aiResponseLength ?? updates.aiPreferences?.responseLength,
    preferredProgrammingLanguage:
      updates.preferredProgrammingLanguage ?? updates.aiPreferences?.codingStyle,
    notificationPreferences: updates.notificationPreferences,
    accessibility: updates.accessibility,
  });

  const supabase = getBrowserDb();
  const existing = await getUserSettings(userId);

  const merged: UserSettings = {
    ...existing,
    ...updates,
    notificationPreferences: {
      ...existing.notificationPreferences,
      ...(updates.notificationPreferences ?? {}),
    },
    accessibility: {
      ...existing.accessibility,
      ...(updates.accessibility ?? {}),
    },
    appearance: { ...existing.appearance, ...(updates.appearance ?? {}) },
    aiPreferences: { ...existing.aiPreferences, ...(updates.aiPreferences ?? {}) },
    privacy: { ...existing.privacy, ...(updates.privacy ?? {}) },
    updatedAt: new Date().toISOString(),
  };

  if (updates.theme) merged.theme = updates.theme;
  if (updates.aiPreferences?.responseLength) {
    merged.aiResponseLength = updates.aiPreferences.responseLength;
  }

  try {
    const row = await executeQuery<DbUserSettings>(() =>
      supabase
        .from("user_settings")
        .upsert(toDbRow(userId, merged), { onConflict: "user_id" })
        .select("*")
        .single(),
    );
    const result = mapSettings(row);
    offlineCache.set(`${CACHE_PREFIX}${userId}`, result);
    return result;
  } catch (error) {
    logger.db("updateUserSettings failed — caching locally", { error });
    offlineCache.set(`${CACHE_PREFIX}${userId}`, merged);
    return merged;
  }
}

export async function resetUserSettings(userId: string): Promise<UserSettings> {
  return updateUserSettings(userId, DEFAULT_USER_SETTINGS);
}

export async function clearUserSearchHistory(userId: string): Promise<void> {
  offlineCache.remove(`search:recent:${userId}`);
}

export async function deleteUserAiHistory(userId: string): Promise<void> {
  const supabase = getBrowserDb();
  await supabase.from("chat_messages").delete().eq("user_id", userId);
  await supabase.from("chat_conversations").delete().eq("user_id", userId);
}
