/**
 * RoboForge database schema types.
 * Mirrors Supabase tables — extend when migrations are applied.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Timestamps = {
  created_at: string;
  updated_at: string;
};

// ─── Catalog (future DB-backed; currently static + interface-ready) ───

export type DbProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  time_estimate: string | null;
  cost_estimate: string | null;
  component_count: number;
  technologies: string[];
  image_url: string | null;
  programming: string | null;
  power_source: string | null;
  published: boolean;
  sort_order: number;
} & Timestamps;

export type DbProjectStep = {
  id: string;
  project_id: string;
  step_number: number;
  title: string;
  content: string;
  image_url: string | null;
  checklist: Json | null;
  tips: Json | null;
  warnings: Json | null;
  code_snippet: string | null;
} & Timestamps;

export type DbCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
} & Timestamps;

export type DbComponent = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  specifications: Json | null;
  buy_url: string | null;
  published: boolean;
} & Timestamps;

// ─── User data ───

export type DbProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  institution: string | null;
  course: string | null;
  github: string | null;
  linkedin: string | null;
  website: string | null;
  social_links: Json | null;
  role: "student" | "instructor" | "admin";
} & Timestamps;

export type DbSavedProject = {
  id: string;
  user_id: string;
  project_slug: string;
  title: string | null;
  difficulty: string | null;
  image: string | null;
  saved_at: string;
};

export type DbSavedComponent = {
  id: string;
  user_id: string;
  component_slug: string;
  name: string | null;
  category: string | null;
  image: string | null;
  specifications: string | null;
  buy_url: string | null;
  saved_at: string;
};

export type DbProjectProgress = {
  id: string;
  user_id: string;
  project_slug: string;
  progress: number;
  current_step: number;
  last_opened_at: string;
  started_at: string | null;
  completed_at: string | null;
  time_spent_minutes: number;
  estimated_remaining: string | null;
} & Pick<Timestamps, "created_at" | "updated_at">;

export type DbChatConversation = {
  id: string;
  user_id: string;
  title: string;
  preview: string | null;
  project_slug: string | null;
  category: string | null;
  pinned: boolean;
  archived: boolean;
} & Timestamps;

export type DbChatMessage = {
  id: string;
  conversation_id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  images: Json | null;
  bookmarked: boolean;
  feedback: "like" | "dislike" | null;
  created_at: string;
};

export type DbDownload = {
  id: string;
  user_id: string;
  title: string;
  file_type: "pdf" | "circuit" | "code" | "library" | "datasheet";
  project_slug: string | null;
  resource_url: string | null;
  storage_path: string | null;
  downloaded_at: string;
};

export type DbNotification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "project" | "guide" | "feature" | "reminder" | "achievement" | "ai";
  read: boolean;
  archived: boolean;
  created_at: string;
};

export type DbAchievement = {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  description: string | null;
  unlocked: boolean;
  progress: number;
  icon: string | null;
  unlocked_at: string | null;
};

export type DbResource = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: "guide" | "datasheet" | "tutorial" | "video" | "tool";
  category: string | null;
  url: string | null;
  storage_path: string | null;
  published: boolean;
} & Timestamps;

export type DbUserSettings = {
  user_id: string;
  theme: "light" | "dark" | "system";
  language: string;
  notification_preferences: Json;
  ai_response_length: "concise" | "balanced" | "detailed";
  preferred_programming_language: string;
  accessibility: Json;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: { Row: DbProfile; Insert: Partial<DbProfile>; Update: Partial<DbProfile> };
      projects: { Row: DbProject; Insert: Partial<DbProject>; Update: Partial<DbProject> };
      project_steps: { Row: DbProjectStep; Insert: Partial<DbProjectStep>; Update: Partial<DbProjectStep> };
      components: { Row: DbComponent; Insert: Partial<DbComponent>; Update: Partial<DbComponent> };
      categories: { Row: DbCategory; Insert: Partial<DbCategory>; Update: Partial<DbCategory> };
      saved_projects: { Row: DbSavedProject; Insert: Partial<DbSavedProject>; Update: Partial<DbSavedProject> };
      saved_components: { Row: DbSavedComponent; Insert: Partial<DbSavedComponent>; Update: Partial<DbSavedComponent> };
      project_progress: { Row: DbProjectProgress; Insert: Partial<DbProjectProgress>; Update: Partial<DbProjectProgress> };
      chat_conversations: { Row: DbChatConversation; Insert: Partial<DbChatConversation>; Update: Partial<DbChatConversation> };
      chat_messages: { Row: DbChatMessage; Insert: Partial<DbChatMessage>; Update: Partial<DbChatMessage> };
      downloads: { Row: DbDownload; Insert: Partial<DbDownload>; Update: Partial<DbDownload> };
      notifications: { Row: DbNotification; Insert: Partial<DbNotification>; Update: Partial<DbNotification> };
      achievements: { Row: DbAchievement; Insert: Partial<DbAchievement>; Update: Partial<DbAchievement> };
      resources: { Row: DbResource; Insert: Partial<DbResource>; Update: Partial<DbResource> };
      user_settings: { Row: DbUserSettings; Insert: Partial<DbUserSettings>; Update: Partial<DbUserSettings> };
    };
  };
};

export type TableName = keyof Database["public"]["Tables"];
