"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bookmark,
  Bot,
  Calendar,
  FolderCheck,
  KeyRound,
  LogOut,
  Pencil,
  User,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useAuth } from "@/hooks/useAuth";

const stats = [
  { label: "Saved Projects", value: "4", icon: FolderCheck },
  { label: "Completed Projects", value: "1", icon: FolderCheck },
  { label: "Bookmarked Components", value: "12", icon: Bookmark },
  { label: "AI Conversations", value: "7", icon: Bot },
];

const activity = [
  "Completed Obstacle Avoiding Robot guide",
  "Bookmarked HC-SR04 sensor",
  "Started AI chat about L298N wiring",
  "Saved Line Follower project",
];

function ProfileContent() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const displayName =
    profile?.full_name ??
    (user?.user_metadata?.full_name as string | undefined) ??
    "RoboForge User";
  const email = profile?.email ?? user?.email ?? "";
  const avatarUrl = profile?.avatar_url ?? user?.user_metadata?.avatar_url;
  const createdAt = profile?.created_at ?? user?.created_at;
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Container className="py-12 md:py-16">
      <ScrollReveal>
        <div className="rounded-default border border-border bg-surface/80 p-8 backdrop-blur-sm md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                className="h-24 w-24 rounded-full border border-border object-cover shadow-soft"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-foreground font-heading text-3xl font-medium text-background shadow-soft">
                {initials}
              </div>
            )}
            <div className="flex-1">
              <h1 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
                {displayName}
              </h1>
              <p className="mt-1 text-[14px] text-muted">{email}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-[12px] text-muted-foreground">
                {createdAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Joined{" "}
                    {new Date(createdAt).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
                <span className="rounded-full border border-border bg-background px-2.5 py-0.5 font-heading text-[10px] uppercase tracking-wider">
                  {profile?.role ?? "Student"}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-1.5 rounded-default border border-border bg-background px-4 py-2 text-[13px] font-medium"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                Edit Profile
              </motion.button>
              <Link
                href="/reset-password"
                className="inline-flex items-center gap-1.5 rounded-default border border-border bg-background px-4 py-2 text-[13px] font-medium transition-colors hover:border-border-strong"
              >
                <KeyRound className="h-3.5 w-3.5" strokeWidth={1.75} />
                Change Password
              </Link>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-default border border-border px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <ScrollReveal key={stat.label} delay={index * 0.05}>
            <div className="rounded-default border border-border bg-surface/80 p-5 backdrop-blur-sm">
              <stat.icon className="h-4 w-4 text-muted" strokeWidth={1.5} />
              <p className="mt-3 font-heading text-2xl font-medium">{stat.value}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">{stat.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.1}>
        <div className="mt-8 rounded-default border border-border bg-surface/80 p-6 backdrop-blur-sm md:p-8">
          <h2 className="font-heading text-lg font-medium tracking-tight">
            Recent Activity
          </h2>
          <ul className="mt-4 space-y-3" role="list">
            {activity.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-[13px] text-muted"
              >
                <User className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>
    </Container>
  );
}

export function ProfilePageContent() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
