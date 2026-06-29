import type { Difficulty, Project, ProjectTechnology } from "@/lib/projects";
import type { ProjectDetail, GuideStep } from "@/lib/project-details";

export type { Difficulty, Project, ProjectTechnology, ProjectDetail, GuideStep };

export type ProjectListParams = {
  query?: string;
  difficulty?: Difficulty | "all";
  category?: string;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "popular" | "difficulty" | "cost" | "time";
};

export type ProjectSummary = Pick<
  Project,
  | "slug"
  | "title"
  | "description"
  | "difficulty"
  | "category"
  | "time"
  | "cost"
  | "componentCount"
  | "technologies"
  | "image"
>;

export type ProjectStep = {
  number: number;
  title: string;
  content: string;
  image?: string;
  checklist?: string[];
};

export type ProjectChatContext = {
  projectSlug: string;
  projectName: string;
  description?: string;
  difficulty?: Difficulty;
  technologies?: string[];
  components?: string[];
  currentStep?: {
    number: number;
    title: string;
    content?: string;
  };
  progressPercent?: number;
  programming?: string;
  powerSource?: string;
  aiPromptSuggestions?: string[];
};

export type ChatMemoryContext = {
  favoriteComponents?: string[];
  recentProjects?: string[];
  learningProgress?: string;
};
