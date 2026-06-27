import { listConversations } from "@/lib/db/chat";
import { searchComponents } from "@/lib/db/components";
import { searchProjects } from "@/lib/db/projects";
import { offlineCache } from "@/lib/db/offline";
import { searchSchema } from "@/lib/validations/db";
import type {
  RecentSearch,
  SearchParams,
  SearchResultItem,
  SearchResults,
  SearchScope,
  SearchSuggestion,
} from "@/types/search";

const RECENT_KEY = "search:recent:";
const SUGGESTIONS: SearchSuggestion[] = [
  { label: "Line follower robot", query: "line follower", scope: "projects" },
  { label: "HC-SR04 sensor", query: "HC-SR04", scope: "components" },
  { label: "Arduino PWM", query: "PWM motor control", scope: "all" },
  { label: "ESP32 WiFi", query: "ESP32 WiFi", scope: "projects" },
];

function scoreMatch(text: string, query: string) {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  if (lower === q) return 100;
  if (lower.startsWith(q)) return 80;
  if (lower.includes(q)) return 50;
  return 0;
}

export async function searchAll(params: SearchParams): Promise<SearchResults> {
  const parsed = searchSchema.parse(params);
  const scope = parsed.scope ?? "all";
  const limit = parsed.limit ?? 20;
  const items: SearchResultItem[] = [];

  if (scope === "all" || scope === "projects") {
    const projects = await searchProjects(parsed.query, limit);
    for (const p of projects) {
      items.push({
        id: p.slug,
        scope: "projects",
        title: p.title,
        subtitle: p.difficulty,
        href: `/projects/${p.slug}`,
        score: scoreMatch(p.title, parsed.query),
      });
    }
  }

  if (scope === "all" || scope === "components") {
    const components = await searchComponents(parsed.query, limit);
    for (const c of components) {
      items.push({
        id: c.slug,
        scope: "components",
        title: c.name,
        subtitle: c.categoryLabel,
        href: `/components?highlight=${c.slug}`,
        score: scoreMatch(c.name, parsed.query),
      });
    }
  }

  if (scope === "all" || scope === "resources") {
    items.push({
      id: "resource-search",
      scope: "resources",
      title: `Resources matching "${parsed.query}"`,
      href: `/projects?q=${encodeURIComponent(parsed.query)}`,
      score: 30,
    });
  }

  items.sort((a, b) => b.score - a.score);

  return {
    query: parsed.query,
    items: items.slice(0, limit),
    total: items.length,
  };
}

export async function searchChatHistory(
  userId: string,
  query: string,
): Promise<SearchResultItem[]> {
  const conversations = await listConversations(userId, { query, pageSize: 20 });
  return conversations.map((c) => ({
    id: c.id,
    scope: "chat" as SearchScope,
    title: c.title,
    subtitle: c.preview,
    href: `/ai-assistant?conversation=${c.id}`,
    score: scoreMatch(c.title, query),
  }));
}

export function getSearchSuggestions(): SearchSuggestion[] {
  return SUGGESTIONS;
}

export function getRecentSearches(userId: string): RecentSearch[] {
  return offlineCache.get<RecentSearch[]>(`${RECENT_KEY}${userId}`) ?? [];
}

export function saveRecentSearch(
  userId: string,
  query: string,
  scope: SearchScope = "all",
) {
  const existing = getRecentSearches(userId).filter((s) => s.query !== query);
  const next: RecentSearch[] = [
    { query, scope, searchedAt: new Date().toISOString() },
    ...existing,
  ].slice(0, 10);
  offlineCache.set(`${RECENT_KEY}${userId}`, next);
}

export function clearRecentSearches(userId: string) {
  offlineCache.remove(`${RECENT_KEY}${userId}`);
}

/** Debounce helper for search inputs */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
