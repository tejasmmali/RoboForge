import type { GlobalRouteContext } from "@/types/chat";

export type RouteMeta = {
  pageLabel: string;
  assistantMode: string;
  suggestions: string[];
};

const ROUTE_PATTERNS: { test: (path: string) => boolean; meta: RouteMeta }[] = [
  {
    test: (path) => path === "/",
    meta: {
      pageLabel: "Home",
      assistantMode: "General Robotics Assistant",
      suggestions: [
        "Where should I start?",
        "Best beginner project",
        "Learn Arduino",
        "What is robotics?",
        "Recommend my first build",
      ],
    },
  },
  {
    test: (path) => path === "/projects",
    meta: {
      pageLabel: "Projects",
      assistantMode: "Project Discovery Assistant",
      suggestions: [
        "Recommend a beginner robot",
        "Find ESP32 projects",
        "Show IoT projects",
        "What project fits my skill level?",
        "Compare line follower vs obstacle avoider",
      ],
    },
  },
  {
    test: (path) => /^\/projects\/[^/]+$/.test(path),
    meta: {
      pageLabel: "Project Detail",
      assistantMode: "Project Mentor",
      suggestions: [
        "Explain this wiring",
        "Debug this code",
        "What's the next step?",
        "Testing help for this stage",
        "Common mistakes for this build",
      ],
    },
  },
  {
    test: (path) => path.startsWith("/components"),
    meta: {
      pageLabel: "Components",
      assistantMode: "Component Recommendation Assistant",
      suggestions: [
        "Compare ESP32 vs Arduino",
        "Servo recommendations",
        "Compatible sensors for my board",
        "Best motor driver for 2WD robot",
        "Budget sensor options",
      ],
    },
  },
  {
    test: (path) => path.startsWith("/dashboard"),
    meta: {
      pageLabel: "Dashboard",
      assistantMode: "Learning Progress Assistant",
      suggestions: [
        "Continue learning",
        "Resume my project",
        "Weekly progress summary",
        "What should I build next?",
        "Skills I should focus on",
      ],
    },
  },
  {
    test: (path) => path.startsWith("/settings"),
    meta: {
      pageLabel: "Settings",
      assistantMode: "Account Assistant",
      suggestions: [
        "Export my chats",
        "Privacy help",
        "How is my data used?",
        "Change AI response style",
        "Notification settings help",
      ],
    },
  },
  {
    test: (path) => path.startsWith("/ai-assistant"),
    meta: {
      pageLabel: "AI Assistant",
      assistantMode: "RoboForge AI Workspace",
      suggestions: [
        "Where should I start?",
        "Recommend a beginner robot",
        "Compare ESP32 vs Arduino",
        "Debug my wiring",
        "Generate Arduino code",
      ],
    },
  },
];

const DEFAULT_META: RouteMeta = {
  pageLabel: "RoboForge",
  assistantMode: "General Robotics Assistant",
  suggestions: [
    "Where should I start?",
    "Recommend a beginner project",
    "Explain PWM for motors",
    "Help me choose components",
    "Debug my Arduino code",
  ],
};

export function getRouteMeta(pathname: string): RouteMeta {
  const match = ROUTE_PATTERNS.find(({ test }) => test(pathname));
  return match?.meta ?? DEFAULT_META;
}

export function buildGlobalRouteContext(
  pathname: string,
  options: {
    isAuthenticated: boolean;
    theme?: string;
    language?: string;
    learningLevel?: string;
    codingStyle?: string;
    selectedComponent?: string | null;
  },
): GlobalRouteContext {
  const meta = getRouteMeta(pathname);

  return {
    pathname,
    pageLabel: meta.pageLabel,
    assistantMode: meta.assistantMode,
    isAuthenticated: options.isAuthenticated,
    theme: options.theme ?? "light",
    language: options.language ?? "en",
    learningLevel: options.learningLevel,
    codingStyle: options.codingStyle,
    selectedComponent: options.selectedComponent ?? null,
  };
}

export function getRouteSuggestions(pathname: string): string[] {
  return getRouteMeta(pathname).suggestions;
}
