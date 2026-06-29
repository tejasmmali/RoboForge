import type { User } from "@supabase/supabase-js";
import { getBrowserDb } from "@/lib/db/client";
import { executeQuery } from "@/lib/db/errors";
import { logger } from "@/lib/db/logger";
import { STORAGE_BUCKETS } from "@/lib/db/rls";
import { uploadToStorage } from "@/lib/db/storage";
import { avatarFromUserMetadata } from "@/lib/utils/avatar";
import { profileUpdateSchema } from "@/lib/validations/db";
import type { DbProfile } from "@/types/database";
import type { ProfileInsert, ProfileUpdateInput, UserProfile } from "@/types/profile";

const PROFILES_TABLE = "profiles";

function mapProfile(row: DbProfile): UserProfile {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    avatar_url: row.avatar_url,
    bio: row.bio ?? null,
    institution: row.institution ?? null,
    course: row.course ?? null,
    github: row.github ?? null,
    linkedin: row.linkedin ?? null,
    website: row.website ?? null,
    social_links: (row.social_links as UserProfile["social_links"]) ?? null,
    role: row.role,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function pickKnownColumns(updates: ProfileUpdateInput) {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of [
    "full_name",
    "avatar_url",
    "bio",
    "institution",
    "course",
    "github",
    "linkedin",
    "website",
    "social_links",
    "role",
  ] as const) {
    if (updates[key] !== undefined) payload[key] = updates[key];
  }
  return payload;
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    logger.db("getProfile failed", { error });
    return null;
  }

  return data ? mapProfile(data as DbProfile) : null;
}

export async function upsertProfile(profile: ProfileInsert): Promise<UserProfile> {
  const supabase = getBrowserDb();
  const row = await executeQuery<DbProfile>(() =>
    supabase
      .from(PROFILES_TABLE)
      .upsert(
        { ...profile, updated_at: new Date().toISOString() },
        { onConflict: "id" },
      )
      .select("*")
      .single(),
  );
  return mapProfile(row);
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdateInput,
): Promise<UserProfile> {
  const parsed = profileUpdateSchema.parse(updates);
  const supabase = getBrowserDb();
  const row = await executeQuery<DbProfile>(() =>
    supabase
      .from(PROFILES_TABLE)
      .update(pickKnownColumns(parsed))
      .eq("id", userId)
      .select("*")
      .single(),
  );
  return mapProfile(row);
}

export function profileFromUser(user: User): ProfileInsert {
  return {
    id: user.id,
    email: user.email ?? "",
    full_name:
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      null,
    avatar_url: avatarFromUserMetadata(user.user_metadata as Record<string, unknown>),
    role: "student",
  };
}

export async function ensureProfile(user: User): Promise<UserProfile | null> {
  try {
    const existing = await getProfile(user.id);
    const oauthAvatar = avatarFromUserMetadata(user.user_metadata as Record<string, unknown>);

    if (existing) {
      if (!existing.avatar_url && oauthAvatar) {
        return await updateProfile(user.id, { avatar_url: oauthAvatar });
      }
      return existing;
    }

    return await upsertProfile(profileFromUser(user));
  } catch (error) {
    logger.auth("ensureProfile failed", { error });
    return null;
  }
}

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<string> {
  const path = `${userId}/${Date.now()}-${file.name}`;
  const publicUrl = await uploadToStorage(STORAGE_BUCKETS.avatars, path, file);
  await updateProfile(userId, { avatar_url: publicUrl });
  return publicUrl;
}

export async function deleteAvatar(userId: string): Promise<void> {
  await updateProfile(userId, { avatar_url: null });
}
