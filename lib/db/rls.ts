import type { DbErrorCode } from "@/lib/db/errors";

export type ServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: DbErrorCode };

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type SortParams = {
  column: string;
  ascending?: boolean;
};

export type SearchParams = PaginationParams & {
  query?: string;
  sort?: SortParams;
};

export type OwnerScoped = {
  userId: string;
};

export type OfflineQueueItem = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
  retries: number;
};

export const STORAGE_BUCKETS = {
  avatars: "avatars",
  projectImages: "project-images",
  componentImages: "component-images",
  resources: "resources",
  downloads: "downloads",
  circuitDiagrams: "circuit-diagrams",
  gallery: "gallery",
} as const;

export type StorageBucket =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

/** RLS architecture reference — policies applied in Supabase, not in app code. */
export const RLS_POLICIES = {
  ownerRead: "Users can SELECT their own rows (auth.uid() = user_id)",
  ownerWrite: "Users can INSERT/UPDATE/DELETE their own rows",
  publicReadCatalog: "Published catalog rows readable by authenticated users",
  profileSelf: "Users can read/update their own profile (auth.uid() = id)",
} as const;
