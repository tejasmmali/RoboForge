import type { ProjectDetail } from "@/lib/project-details";
import type { ChatMemoryContext, ProjectChatContext } from "@/types/project";

export function buildProjectContextFromDetail(
  project: ProjectDetail,
  options?: {
    currentStepNumber?: number;
    progressPercent?: number;
  },
): ProjectChatContext {
  const stepNumber = options?.currentStepNumber ?? 1;
  const step = project.steps.find((s) => s.number === stepNumber);

  return {
    projectSlug: project.slug,
    projectName: project.title,
    description: project.description,
    difficulty: project.difficulty,
    technologies: project.technologies,
    components: project.parts.map((p) => p.name),
    currentStep: step
      ? { number: step.number, title: step.title, content: step.content }
      : undefined,
    progressPercent: options?.progressPercent,
    programming: project.programming,
    powerSource: project.powerSource,
  };
}

export function formatProjectContextBlock(context: ProjectChatContext): string {
  const lines: string[] = ["## Current Project Context", ""];

  lines.push(`Project: ${context.projectName}`);

  if (context.currentStep) {
    lines.push(`Step: ${context.currentStep.title}`);
  }

  if (context.difficulty) {
    lines.push(`Difficulty: ${context.difficulty}`);
  }

  if (context.technologies?.length) {
    lines.push(`Technology: ${context.technologies.join(", ")}`);
  }

  if (context.components?.length) {
    lines.push("Components:");
    for (const component of context.components) {
      lines.push(`- ${component}`);
    }
  }

  if (context.progressPercent != null) {
    lines.push(`Progress: ${context.progressPercent}%`);
  }

  if (context.programming) {
    lines.push(`Programming: ${context.programming}`);
  }

  if (context.powerSource) {
    lines.push(`Power: ${context.powerSource}`);
  }

  if (context.currentStep?.content) {
    lines.push("", "Step details:", context.currentStep.content.slice(0, 800));
  }

  return lines.join("\n");
}

export function formatMemoryContextBlock(memory: ChatMemoryContext): string {
  const lines: string[] = ["## Student Memory (reference only)", ""];

  if (memory.favoriteComponents?.length) {
    lines.push(`Favorite components: ${memory.favoriteComponents.join(", ")}`);
  }

  if (memory.recentProjects?.length) {
    lines.push(`Recent projects: ${memory.recentProjects.join(", ")}`);
  }

  if (memory.learningProgress) {
    lines.push(`Learning progress: ${memory.learningProgress}`);
  }

  if (lines.length <= 2) return "";
  return lines.join("\n");
}
