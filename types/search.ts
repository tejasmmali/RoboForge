export type SearchScope =
  | "projects"
  | "components"
  | "resources"
  | "chat"
  | "all";

export type SearchResultItem = {
  id: string;
  scope: SearchScope;
  title: string;
  subtitle?: string;
  href: string;
  score: number;
};

export type SearchResults = {
  query: string;
  items: SearchResultItem[];
  total: number;
};

export type RecentSearch = {
  query: string;
  scope: SearchScope;
  searchedAt: string;
};

export type SearchSuggestion = {
  label: string;
  query: string;
  scope: SearchScope;
};

export type SearchParams = {
  query: string;
  scope?: SearchScope;
  limit?: number;
  debounceMs?: number;
};
