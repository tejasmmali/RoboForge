export type AchievementSlug =
  | "first-login"
  | "first-project"
  | "completed-beginner"
  | "completed-advanced"
  | "ai-explorer"
  | "messages-100"
  | "projects-10";

export type AchievementDefinition = {
  slug: AchievementSlug;
  title: string;
  description: string;
  icon: string;
  target: number;
};

export type AchievementRecord = {
  id: string;
  userId: string;
  slug: AchievementSlug | string;
  title: string;
  description: string | null;
  unlocked: boolean;
  progress: number;
  icon: string | null;
  unlockedAt: string | null;
};

export type AchievementProgress = AchievementRecord & {
  target: number;
  percent: number;
};
