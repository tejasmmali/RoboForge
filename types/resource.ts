export type ResourceType = "guide" | "datasheet" | "tutorial" | "video" | "tool";

export type ResourceRecord = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: ResourceType;
  category: string | null;
  url: string | null;
  storagePath: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ResourceListParams = {
  query?: string;
  type?: ResourceType | "all";
  category?: string;
  page?: number;
  pageSize?: number;
};

export type DownloadRecord = {
  id: string;
  userId: string;
  title: string;
  fileType: "pdf" | "circuit" | "code" | "library" | "datasheet";
  projectSlug: string | null;
  resourceUrl: string | null;
  storagePath: string | null;
  downloadedAt: string;
};

export type TrackDownloadInput = {
  title: string;
  fileType: DownloadRecord["fileType"];
  projectSlug?: string;
  resourceUrl?: string;
  storagePath?: string;
};
