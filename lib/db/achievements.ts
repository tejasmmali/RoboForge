import { getBrowserDb } from "@/lib/db/client";
import { executeQuery, executeVoidQuery } from "@/lib/db/errors";
import { logger } from "@/lib/db/logger";
import type { DbAchievement } from "@/types/database";
import type {
  AchievementDefinition,
  AchievementProgress,
  AchievementRecord,
  AchievementSlug,
} from "@/types/achievement";

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  { slug: "first-login", title: "First Login", description: "Welcome to RoboForge!", icon: "login", target: 1 },
  { slug: "first-project", title: "First Project", description: "Started your first robotics project.", icon: "rocket", target: 1 },
  { slug: "completed-beginner", title: "Completed Beginner", description: "Finished a beginner-level project.", icon: "star", target: 1 },
  { slug: "completed-advanced", title: "Completed Advanced", description: "Finished an advanced project.", icon: "trophy", target: 1 },
  { slug: "ai-explorer", title: "AI Explorer", description: "Used the RoboForge AI assistant.", icon: "bot", target: 1 },
  { slug: "messages-100", title: "100 Messages", description: "Sent 100 messages to the AI mentor.", icon: "message", target: 100 },
  { slug: "projects-10", title: "10 Projects Completed", description: "Completed 10 robotics projects.", icon: "medal", target: 10 },
];

function mapAchievement(row: DbAchievement): AchievementRecord {
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    unlocked: row.unlocked,
    progress: Number(row.progress),
    icon: row.icon,
    unlockedAt: row.unlocked_at,
  };
}

function withProgress(
  record: AchievementRecord,
  definition: AchievementDefinition,
): AchievementProgress {
  const percent = Math.min(
    100,
    Math.round((record.progress / definition.target) * 100),
  );
  return { ...record, target: definition.target, percent };
}

export async function getAchievements(
  userId: string,
): Promise<AchievementProgress[]> {
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    logger.db("getAchievements failed", { error });
    return ACHIEVEMENT_DEFINITIONS.map((def) => ({
      id: def.slug,
      userId,
      slug: def.slug,
      title: def.title,
      description: def.description,
      unlocked: false,
      progress: 0,
      icon: def.icon,
      unlockedAt: null,
      target: def.target,
      percent: 0,
    }));
  }

  const rows = (data ?? []) as DbAchievement[];
  const bySlug = new Map(rows.map((r) => [r.slug, mapAchievement(r)]));

  return ACHIEVEMENT_DEFINITIONS.map((def) => {
    const existing = bySlug.get(def.slug);
    if (existing) return withProgress(existing, def);
    return withProgress(
      {
        id: def.slug,
        userId,
        slug: def.slug,
        title: def.title,
        description: def.description,
        unlocked: false,
        progress: 0,
        icon: def.icon,
        unlockedAt: null,
      },
      def,
    );
  });
}

export async function updateAchievementProgress(
  userId: string,
  slug: AchievementSlug | string,
  progress: number,
): Promise<AchievementProgress> {
  const definition =
    ACHIEVEMENT_DEFINITIONS.find((d) => d.slug === slug) ??
    ACHIEVEMENT_DEFINITIONS[0];

  const unlocked = progress >= definition.target;
  const supabase = getBrowserDb();

  const row = await executeQuery<DbAchievement>(() =>
    supabase
      .from("achievements")
      .upsert(
        {
          user_id: userId,
          slug: definition.slug,
          title: definition.title,
          description: definition.description,
          progress,
          unlocked,
          icon: definition.icon,
          unlocked_at: unlocked ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,slug" },
      )
      .select("*")
      .single(),
  );

  return withProgress(mapAchievement(row), definition);
}

export async function unlockAchievement(
  userId: string,
  slug: AchievementSlug,
): Promise<void> {
  const definition = ACHIEVEMENT_DEFINITIONS.find((d) => d.slug === slug);
  if (!definition) return;
  await updateAchievementProgress(userId, slug, definition.target);
}

export async function seedAchievements(userId: string): Promise<void> {
  for (const def of ACHIEVEMENT_DEFINITIONS) {
    try {
      await executeVoidQuery(() =>
        getBrowserDb()
          .from("achievements")
          .upsert(
            {
              user_id: userId,
              slug: def.slug,
              title: def.title,
              description: def.description,
              progress: 0,
              unlocked: false,
              icon: def.icon,
            },
            { onConflict: "user_id,slug" },
          ),
      );
    } catch {
      // ignore individual seed failures
    }
  }
}
