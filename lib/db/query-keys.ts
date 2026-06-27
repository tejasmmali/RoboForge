export const queryKeys = {
  profile: (userId: string) => ["profile", userId] as const,
  settings: (userId: string) => ["settings", userId] as const,
  projects: {
    all: ["projects"] as const,
    list: (params?: Record<string, unknown>) =>
      ["projects", "list", params] as const,
    detail: (slug: string) => ["projects", "detail", slug] as const,
    steps: (slug: string) => ["projects", "steps", slug] as const,
  },
  components: {
    all: ["components"] as const,
    list: (params?: Record<string, unknown>) =>
      ["components", "list", params] as const,
    detail: (slug: string) => ["components", "detail", slug] as const,
  },
  bookmarks: {
    projects: (userId: string) => ["bookmarks", "projects", userId] as const,
    components: (userId: string) =>
      ["bookmarks", "components", userId] as const,
  },
  progress: {
    all: (userId: string) => ["progress", userId] as const,
    project: (userId: string, slug: string) =>
      ["progress", userId, slug] as const,
  },
  chat: {
    conversations: (userId: string) => ["chat", "conversations", userId] as const,
    messages: (conversationId: string) =>
      ["chat", "messages", conversationId] as const,
  },
  downloads: (userId: string) => ["downloads", userId] as const,
  notifications: (userId: string) => ["notifications", userId] as const,
  achievements: (userId: string) => ["achievements", userId] as const,
  resources: {
    all: ["resources"] as const,
    list: (params?: Record<string, unknown>) =>
      ["resources", "list", params] as const,
  },
  search: {
    recent: (userId: string) => ["search", "recent", userId] as const,
    results: (query: string) => ["search", "results", query] as const,
  },
} as const;
