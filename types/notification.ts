export type NotificationType =
  | "project"
  | "guide"
  | "feature"
  | "reminder"
  | "achievement"
  | "ai";

export type NotificationRecord = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  archived: boolean;
  createdAt: string;
};

export type CreateNotificationInput = {
  title: string;
  message: string;
  type: NotificationType;
};

export type NotificationFilters = {
  unreadOnly?: boolean;
  includeArchived?: boolean;
  page?: number;
  pageSize?: number;
};
