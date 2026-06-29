import type { ChatApiRequest } from "@/types/chat";
import type { ChatMemoryContext } from "@/types/project";

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

export function sanitizeChatApiRequest(request: ChatApiRequest): ChatApiRequest {
  const { projectContext, memoryContext, routeContext, ...rest } = request;

  const sanitized: ChatApiRequest = { ...rest };

  if (projectContext) {
    sanitized.projectContext = {
      projectSlug: projectContext.projectSlug,
      projectName: projectContext.projectName,
      description: projectContext.description,
      difficulty: projectContext.difficulty,
      technologies: projectContext.technologies,
      components: projectContext.components,
      currentStep: projectContext.currentStep,
      progressPercent: projectContext.progressPercent,
      programming: projectContext.programming,
      powerSource: projectContext.powerSource,
    };
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

  return sanitized;
}
