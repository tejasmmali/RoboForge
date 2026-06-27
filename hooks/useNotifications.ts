"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveNotification,
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/db/notifications";
import { queryKeys } from "@/lib/db/query-keys";
import { useAuth } from "@/hooks/useAuth";
import type { NotificationFilters } from "@/types/notification";

export function useNotifications(filters: NotificationFilters = {}) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...queryKeys.notifications(user?.id ?? ""), filters],
    queryFn: () => getNotifications(user!.id, filters),
    enabled: Boolean(user?.id),
  });
}

export function useUnreadNotificationCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...queryKeys.notifications(user?.id ?? ""), "unread-count"],
    queryFn: () => getUnreadCount(user!.id),
    enabled: Boolean(user?.id),
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationRead() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => {
      if (!user) throw new Error("Sign in required");
      return markNotificationRead(user.id, notificationId);
    },
    onMutate: async (notificationId) => {
      if (!user) return;
      const key = queryKeys.notifications(user.id);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueriesData({ queryKey: key });
      queryClient.setQueriesData({ queryKey: key }, (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((n: { id: string; read: boolean }) =>
          n.id === notificationId ? { ...n, read: true } : n,
        );
      });
      return { previous };
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.notifications(user.id),
        });
      }
    },
  });
}

export function useMarkAllNotificationsRead() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Sign in required");
      return markAllNotificationsRead(user.id);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.notifications(user.id),
        });
      }
    },
  });
}

export function useArchiveNotification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => {
      if (!user) throw new Error("Sign in required");
      return archiveNotification(user.id, notificationId);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.notifications(user.id),
        });
      }
    },
  });
}

export function useDeleteNotification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => {
      if (!user) throw new Error("Sign in required");
      return deleteNotification(user.id, notificationId);
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.notifications(user.id),
        });
      }
    },
  });
}
