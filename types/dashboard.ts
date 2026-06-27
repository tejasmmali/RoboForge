import type { Difficulty } from "@/lib/projects";

export type DashboardStat = {
  id: string;
  label: string;
  value: number;
  trend: number;
  trendLabel: string;
  icon: string;
};

export type ProjectProgress = {
  id: string;
  user_id: string;
  project_slug: string;
  progress: number;
  last_opened_at: string;
  estimated_remaining: string;
  created_at: string;
  updated_at: string;
};

export type SavedProject = {
  id: string;
  user_id: string;
  project_slug: string;
  title: string;
  difficulty: Difficulty;
  image: string;
  saved_at: string;
};

export type SavedComponent = {
  id: string;
  user_id: string;
  component_slug: string;
  name: string;
  category: string;
  image: string;
  specifications: string;
  buy_url: string;
  saved_at: string;
};

export type ChatHistoryEntry = {
  id: string;
  user_id: string;
  title: string;
  preview: string;
  updated_at: string;
};

export type DashboardNotification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "project" | "guide" | "feature" | "reminder";
  read: boolean;
  created_at: string;
};

export type Achievement = {
  id: string;
  slug: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  icon: string;
};

export type ActivityItem = {
  id: string;
  user_id: string;
  action: string;
  detail: string;
  created_at: string;
};

export type DownloadItem = {
  id: string;
  title: string;
  type: "pdf" | "circuit" | "code" | "datasheet" | "library";
  project_slug?: string;
  downloaded_at: string;
};

export type RoadmapStage = {
  label: string;
  progress: number;
  complete: boolean;
  current?: boolean;
};

export type WeeklyProgressPoint = {
  day: string;
  projects: number;
  hours: number;
  aiUsage: number;
};

export type ContinueProject = {
  slug: string;
  title: string;
  image: string;
  progress: number;
  lastOpened: string;
  estimatedRemaining: string;
};

export type DashboardData = {
  stats: DashboardStat[];
  continueProjects: ContinueProject[];
  roadmap: RoadmapStage[];
  savedProjects: SavedProject[];
  savedComponents: SavedComponent[];
  chatHistory: ChatHistoryEntry[];
  activity: ActivityItem[];
  achievements: Achievement[];
  downloads: DownloadItem[];
  notifications: DashboardNotification[];
  weeklyProgress: WeeklyProgressPoint[];
  learningStreak: number;
  hoursLearned: number;
};
