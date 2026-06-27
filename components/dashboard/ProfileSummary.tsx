"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Flame, FolderCheck, Pencil } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/profile";

type ProfileSummaryProps = {
  user: User;
  profile: UserProfile | null;
  displayName: string;
  projectsCompleted: number;
  learningStreak: number;
  embedded?: boolean;
};

export function ProfileSummary({
  user,
  profile,
  displayName,
  projectsCompleted,
  learningStreak,
  embedded,
}: ProfileSummaryProps) {
  const email = profile?.email ?? user.email ?? "";
  const avatarUrl = profile?.avatar_url ?? user.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();
  const memberSince = profile?.created_at ?? user.created_at;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={
        embedded
          ? "p-5 sm:p-6"
          : "rounded-default border border-border bg-surface/80 p-5 backdrop-blur-sm"
      }
    >
      <div className="flex flex-col items-center text-center">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-16 w-16 rounded-full border border-border object-cover shadow-soft"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-foreground font-heading text-xl font-medium text-background shadow-soft">
            {initials}
          </div>
        )}
        <h2 className="mt-3 font-heading text-[15px] font-medium">{displayName}</h2>
        <p className="mt-0.5 truncate text-[12px] text-muted">{email}</p>
      </div>

      <dl className="mt-5 space-y-3 border-t border-border pt-5">
        {memberSince && (
          <div className="flex items-center justify-between text-[12px]">
            <dt className="flex items-center gap-1.5 text-muted">
              <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
              Member since
            </dt>
            <dd className="font-medium">
              {new Date(memberSince).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </dd>
          </div>
        )}
        <div className="flex items-center justify-between text-[12px]">
          <dt className="flex items-center gap-1.5 text-muted">
            <FolderCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
            Completed
          </dt>
          <dd className="font-medium">{projectsCompleted}</dd>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <dt className="flex items-center gap-1.5 text-muted">
            <Flame className="h-3.5 w-3.5" strokeWidth={1.75} />
            Learning streak
          </dt>
          <dd className="font-medium">{learningStreak} days</dd>
        </div>
      </dl>

      <Link
        href="/profile"
        className="hover-glow mt-5 flex w-full items-center justify-center gap-2 rounded-default border border-border bg-background py-2.5 text-[13px] font-medium transition-colors hover:border-border-strong"
      >
        <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
        Edit Profile
      </Link>
    </motion.section>
  );
}
