import type { Difficulty } from "@/lib/projects";
import { projects } from "@/lib/projects";
import { buildProjectDetail } from "@/lib/content/build-detail";
import { PROJECT_SEEDS } from "@/lib/content/seeds";
import type { FaqItem } from "@/lib/content/types";

export type { FaqItem };

export type PartItem = {
  name: string;
  quantity: string;
  purpose: string;
  buyUrl: string;
};

export type GuideStep = {
  number: number;
  title: string;
  image?: string;
  content: string;
  checklist?: string[];
  tips?: string[];
  warnings?: string[];
  pinTable?: { pin: string; connection: string }[];
  code?: string;
};

export type TroubleshootingItem = {
  title: string;
  solution: string;
};

export type DownloadItem = {
  id: string;
  title: string;
  description: string;
  fileType: string;
};

export type CircuitSection = {
  title: string;
  content: string;
};

export type ProjectDetail = {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  time: string;
  cost: string;
  componentCount: number;
  technologies: string[];
  image: string;
  programming: string;
  powerSource: string;
  overview: {
    description: string;
    outcomes: string[];
    skills: string[];
    applications: string[];
    expectedResult: string;
  };
  prerequisites: string[];
  safety: string[];
  parts: PartItem[];
  circuit: {
    image: string;
    sections: CircuitSection[];
    pinMapping: { component: string; arduinoPin: string; notes: string }[];
  };
  steps: GuideStep[];
  code: string;
  testing: {
    checklist: string[];
    expectedOutput: string;
    commonIssues: string[];
  };
  troubleshooting: TroubleshootingItem[];
  downloads: DownloadItem[];
  relatedSlugs: string[];
  faq: FaqItem[];
  aiPromptSuggestions: string[];
  gallery: string[];
  totalSteps: number;
  codeStepNumber: number;
};

export function getProjectDetail(slug: string): ProjectDetail | null {
  const seed = PROJECT_SEEDS[slug];
  if (!seed) return null;

  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;

  return buildProjectDetail(seed, project);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export const sidebarNavItems = [
  { id: "overview", label: "Overview" },
  { id: "parts", label: "Parts" },
  { id: "circuit", label: "Circuit" },
  { id: "steps", label: "Steps" },
  { id: "code", label: "Code" },
  { id: "testing", label: "Testing" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "downloads", label: "Downloads" },
  { id: "faq", label: "FAQ" },
  { id: "related", label: "Related Projects" },
] as const;
