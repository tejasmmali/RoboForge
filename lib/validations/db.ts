import { z } from "zod";

export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(120).nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  institution: z.string().max(120).nullable().optional(),
  course: z.string().max(120).nullable().optional(),
  github: z.string().url().nullable().optional(),
  linkedin: z.string().url().nullable().optional(),
  website: z.string().url().nullable().optional(),
  social_links: z
    .object({
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      website: z.string().url().optional(),
      twitter: z.string().url().optional(),
    })
    .nullable()
    .optional(),
  role: z.enum(["student", "instructor", "admin"]).optional(),
});

export const bookmarkProjectSchema = z.object({
  projectSlug: z.string().min(1).max(120),
  title: z.string().max(200).optional(),
  difficulty: z.string().max(40).optional(),
  /** Relative paths (/projects/…) or absolute URLs */
  image: z.string().max(500).optional(),
});

export const bookmarkComponentSchema = z.object({
  componentSlug: z.string().min(1).max(120),
  name: z.string().max(200).optional(),
  category: z.string().max(80).optional(),
  image: z.string().optional(),
  specifications: z.string().max(500).optional(),
  buyUrl: z.string().url().optional(),
});

export const progressUpdateSchema = z.object({
  projectSlug: z.string().min(1).max(120),
  progress: z.number().min(0).max(100).optional(),
  currentStep: z.number().int().min(1).optional(),
  timeSpentMinutes: z.number().int().min(0).optional(),
  estimatedRemaining: z.string().max(80).optional(),
  markCompleted: z.boolean().optional(),
});

export const conversationCreateSchema = z.object({
  title: z.string().min(1).max(200),
  preview: z.string().max(300).optional(),
  projectSlug: z.string().max(120).optional(),
  category: z.string().max(80).optional(),
});

export const conversationUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  pinned: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const messageCreateSchema = z.object({
  conversationId: z.string().uuid(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().max(50000),
  images: z.array(z.object({
    id: z.string(),
    url: z.string(),
    name: z.string(),
    mimeType: z.string(),
    previewDataUrl: z.string().optional(),
  })).optional(),
});

export const settingsUpdateSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().min(2).max(10).optional(),
  aiResponseLength: z.enum(["concise", "balanced", "detailed"]).optional(),
  preferredProgrammingLanguage: z.string().max(40).optional(),
  notificationPreferences: z.object({
    email: z.boolean(),
    push: z.boolean(),
    projectUpdates: z.boolean(),
    aiResponses: z.boolean(),
    achievements: z.boolean(),
    weeklyReminder: z.boolean(),
  }).partial().optional(),
  accessibility: z.object({
    reducedMotion: z.boolean(),
    highContrast: z.boolean(),
    largeText: z.boolean(),
  }).partial().optional(),
});

export const downloadTrackSchema = z.object({
  title: z.string().min(1).max(200),
  fileType: z.enum(["pdf", "circuit", "code", "library", "datasheet"]),
  projectSlug: z.string().max(120).optional(),
  resourceUrl: z.string().url().optional(),
  storagePath: z.string().max(300).optional(),
});

export const searchSchema = z.object({
  query: z.string().min(1).max(200),
  scope: z.enum(["projects", "components", "resources", "chat", "all"]).optional(),
  limit: z.number().int().min(1).max(50).optional(),
});
