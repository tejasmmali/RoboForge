import type { ChatApiRequest } from "@/types/chat";
import type { ChatMemoryContext, ProjectChatContext } from "@/types/project";

/** Remove null fields so JSON matches API zod schema (optional ≠ null). */
export function sanitizeMemoryContext(
  memory?: ChatMemoryContext | null,
): ChatMemoryContext | undefined {
  if (!memory) return undefined;

  const sanitized: ChatMemoryContext = {};

  if (memory.favoriteComponents?.length) {
    sanitized.favoriteComponents = memory.favoriteComponents;
  }
  if (memory.recentProjects?.length) {
    sanitized.recentProjects = memory.recentProjects;
  }
  if (memory.learningProgress) {
    sanitized.learningProgress = memory.learningProgress;
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

function sanitizeProjectContext(
  projectContext: ProjectChatContext,
): ProjectChatContext {
  const sanitized: ProjectChatContext = {
    projectSlug: projectContext.projectSlug,
    projectName: projectContext.projectName,
  };

  if (projectContext.description) {
    sanitized.description = projectContext.description;
  }
  if (projectContext.difficulty) {
    sanitized.difficulty = projectContext.difficulty;
  }
  if (projectContext.technologies?.length) {
    sanitized.technologies = projectContext.technologies;
  }
  if (projectContext.components?.length) {
    sanitized.components = projectContext.components;
  }
  if (projectContext.currentStep) {
    sanitized.currentStep = {
      number: projectContext.currentStep.number,
      title: projectContext.currentStep.title,
      ...(projectContext.currentStep.content
        ? { content: projectContext.currentStep.content }
        : {}),
    };
  }
  if (typeof projectContext.progressPercent === "number") {
    sanitized.progressPercent = projectContext.progressPercent;
  }
  if (projectContext.programming) {
    sanitized.programming = projectContext.programming;
  }
  if (projectContext.powerSource) {
    sanitized.powerSource = projectContext.powerSource;
  }

  return sanitized;
}

export function sanitizeChatApiRequest(request: ChatApiRequest): ChatApiRequest {
  const { projectContext, memoryContext, routeContext, settings, ...rest } =
    request;

  const sanitized: ChatApiRequest = {
    ...rest,
    messages: rest.messages.map((message) => ({
      role: message.role,
      parts: message.parts.map((part) => ({
        text: part.text.slice(0, 4000),
      })),
    })),
  };

  if (projectContext) {
    sanitized.projectContext = sanitizeProjectContext(projectContext);
  }

  sanitized.memoryContext = sanitizeMemoryContext(memoryContext);

  if (routeContext) {
    sanitized.routeContext = {
      pathname: routeContext.pathname,
      pageLabel: routeContext.pageLabel,
      assistantMode: routeContext.assistantMode,
      isAuthenticated: routeContext.isAuthenticated,
      theme: routeContext.theme,
      language: routeContext.language,
      ...(routeContext.learningLevel
        ? { learningLevel: routeContext.learningLevel }
        : {}),
      ...(routeContext.codingStyle
        ? { codingStyle: routeContext.codingStyle }
        : {}),
      ...(routeContext.selectedComponent != null
        ? { selectedComponent: routeContext.selectedComponent }
        : {}),
    };
  }

  if (settings) {
    const next: NonNullable<ChatApiRequest["settings"]> = {};
    if (
      typeof settings.temperature === "number" &&
      Number.isFinite(settings.temperature)
    ) {
      next.temperature = Math.min(1, Math.max(0, settings.temperature));
    }
    if (
      settings.responseLength === "concise" ||
      settings.responseLength === "balanced" ||
      settings.responseLength === "detailed"
    ) {
      next.responseLength = settings.responseLength;
    }
    if (Object.keys(next).length > 0) {
      sanitized.settings = next;
    }
  }

  return sanitized;
}
