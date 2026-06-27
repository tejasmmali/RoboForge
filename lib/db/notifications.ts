import { getBrowserDb } from "@/lib/db/client";
import { executeQuery, executeVoidQuery } from "@/lib/db/errors";
import { logger } from "@/lib/db/logger";
import type { DbNotification } from "@/types/database";
import type {
  CreateNotificationInput,
  NotificationFilters,
  NotificationRecord,
} from "@/types/notification";

function mapNotification(row: DbNotification): NotificationRecord {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    type: row.type,
    read: row.read,
    archived: row.archived ?? false,
    createdAt: row.created_at,
  };
}

export async function getNotifications(
  userId: string,
  filters: NotificationFilters = {},
): Promise<NotificationRecord[]> {
  const supabase = getBrowserDb();
  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (filters.unreadOnly) query = query.eq("read", false);
  if (!filters.includeArchived) query = query.eq("archived", false);

  const pageSize = filters.pageSize ?? 50;
  const page = filters.page ?? 1;
  query = query.range((page - 1) * pageSize, page * pageSize - 1);

  const { data, error } = await query;
  if (error) {
    logger.db("getNotifications failed", { error });
    return [];
  }

  return ((data ?? []) as DbNotification[]).map(mapNotification);
}

export async function createNotification(
  userId: string,
  input: CreateNotificationInput,
): Promise<NotificationRecord> {
  const supabase = getBrowserDb();
  const row = await executeQuery<DbNotification>(() =>
    supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title: input.title,
        message: input.message,
        type: input.type,
        read: false,
        archived: false,
      })
      .select("*")
      .single(),
  );
  return mapNotification(row);
}

export async function markNotificationRead(
  userId: string,
  notificationId: string,
): Promise<void> {
  const supabase = getBrowserDb();
  await executeVoidQuery(() =>
    supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)
      .eq("user_id", userId),
  );
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const supabase = getBrowserDb();
  await executeVoidQuery(() =>
    supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false),
  );
}

export async function archiveNotification(
  userId: string,
  notificationId: string,
): Promise<void> {
  const supabase = getBrowserDb();
  await executeVoidQuery(() =>
    supabase
      .from("notifications")
      .update({ archived: true })
      .eq("id", notificationId)
      .eq("user_id", userId),
  );
}

export async function deleteNotification(
  userId: string,
  notificationId: string,
): Promise<void> {
  const supabase = getBrowserDb();
  await executeVoidQuery(() =>
    supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", userId),
  );
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = getBrowserDb();
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false)
    .eq("archived", false);

  if (error) return 0;
  return count ?? 0;
}
