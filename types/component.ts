import type { ComponentItem, ComponentCategory } from "@/lib/components-catalog";

export type { ComponentItem, ComponentCategory };

export type ComponentListParams = {
  query?: string;
  category?: ComponentCategory | "all";
  page?: number;
  pageSize?: number;
  sort?: "newest" | "popular" | "price" | "alphabetical";
};

export type ComponentSummary = Pick<
  ComponentItem,
  | "slug"
  | "name"
  | "category"
  | "categoryLabel"
  | "shortDescription"
  | "image"
  | "priceRange"
  | "beginnerFriendly"
  | "popular"
>;

export type SavedComponentRecord = {
  id: string;
  userId: string;
  componentSlug: string;
  name: string;
  category: string;
  image: string;
  specifications: string;
  buyUrl: string;
  savedAt: string;
};
