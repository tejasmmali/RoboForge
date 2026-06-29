import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/profile";

/** Google OAuth uses `picture`; some providers use `avatar_url` or `avatar`. */
export function avatarFromUserMetadata(
  metadata: Record<string, unknown> | undefined,
): string | null {
  if (!metadata) return null;
  const candidates = [metadata.avatar_url, metadata.picture, metadata.avatar];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

export function resolveAvatarUrl(
  user?: User | null,
  profile?: UserProfile | null,
): string | null {
  if (profile?.avatar_url?.trim()) return profile.avatar_url.trim();
  return avatarFromUserMetadata(user?.user_metadata as Record<string, unknown>);
}
