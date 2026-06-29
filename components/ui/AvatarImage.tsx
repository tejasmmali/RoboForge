"use client";

import { useState } from "react";
import { resolveAvatarUrl } from "@/lib/utils/avatar";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

type AvatarImageProps = {
  user?: User | null;
  profile?: UserProfile | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClass = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-16 w-16 text-xl",
  lg: "h-20 w-20 text-2xl",
  xl: "h-24 w-24 text-3xl",
};

export function AvatarImage({
  user,
  profile,
  name,
  size = "md",
  className,
}: AvatarImageProps) {
  const [failed, setFailed] = useState(false);
  const displayName =
    name ??
    profile?.full_name ??
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "U";
  const avatarUrl = resolveAvatarUrl(user, profile);
  const initials = displayName.charAt(0).toUpperCase();

  if (avatarUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        referrerPolicy="no-referrer"
        className={cn(
          "rounded-full border border-border object-cover shadow-soft",
          sizeClass[size],
          className,
        )}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border border-border bg-foreground font-heading font-medium text-background shadow-soft",
        sizeClass[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}
