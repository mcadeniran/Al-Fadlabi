"use client";

import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
import {getClientNotifications, getClientUnreadNotificationCount, } from "@/lib/notifications/client-queries";
import {markAllNotificationsAsRead, markNotificationAsRead, } from "@/lib/notifications/mutations";
import {useNotificationsRealtime} from "@/hooks/use-notifications-realtime";
import type {Notification} from "@/types/notification";

type NotificationContextValue = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const NotificationContext =
  createContext<NotificationContextValue | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const notificationsRef = useRef<Notification[]>([]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const refresh = useCallback(async () => {
    try {
      const [nextNotifications, nextUnreadCount] =
        await Promise.all([
          getClientNotifications({limit: 50}),
          getClientUnreadNotificationCount(),
        ]);

      notificationsRef.current = nextNotifications;

      setNotifications(nextNotifications);
      setUnreadCount(nextUnreadCount);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const handleInsert = useCallback((notification: Notification) => {
    if (
      notificationsRef.current.some(
        (item) => item.id === notification.id,
      )
    ) {
      return;
    }

    const nextNotifications = [
      notification,
      ...notificationsRef.current,
    ].slice(0, 50);

    notificationsRef.current = nextNotifications;
    setNotifications(nextNotifications);

    if (!notification.is_read) {
      setUnreadCount((current) => current + 1);
    }
  }, []);

  const handleUpdate = useCallback(
    (notification: Notification) => {
      const existing = notificationsRef.current.find(
        (item) => item.id === notification.id,
      );

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? notification
            : item,
        ),
      );

      if (!existing) {
        return;
      }

      if (existing.is_read && !notification.is_read) {
        setUnreadCount((current) => current + 1);
      }

      if (!existing.is_read && notification.is_read) {
        setUnreadCount((current) =>
          Math.max(current - 1, 0),
        );
      }
    },
    [],
  );

  useNotificationsRealtime({
    onInsert: handleInsert,
    onUpdate: handleUpdate,
  });

  const markAsRead = useCallback(async (notificationId: string) => {
    const notification = notificationsRef.current.find(
      (item) => item.id === notificationId,
    );

    if (!notification || notification.is_read) return;

    const readAt =
      notification.read_at ?? new Date().toISOString();

    const nextNotifications = notificationsRef.current.map(
      (item) =>
        item.id === notificationId
          ? {
            ...item,
            is_read: true,
            read_at: readAt,
          }
          : item,
    );

    notificationsRef.current = nextNotifications;
    setNotifications(nextNotifications);
    setUnreadCount((current) => Math.max(current - 1, 0));

    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      notificationsRef.current = notificationsRef.current.map(
        (item) =>
          item.id === notificationId
            ? notification
            : item,
      );

      setNotifications(notificationsRef.current);
      setUnreadCount((current) => current + 1);

      throw error;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const previousNotifications =
      notificationsRef.current;

    const unreadNotifications =
      previousNotifications.filter(
        (notification) => !notification.is_read,
      );

    if (unreadNotifications.length === 0) {
      return;
    }

    const readAt = new Date().toISOString();

    const nextNotifications =
      previousNotifications.map((notification) =>
        notification.is_read
          ? notification
          : {
            ...notification,
            is_read: true,
            read_at: notification.read_at ?? readAt,
          },
      );

    notificationsRef.current = nextNotifications;

    setNotifications(nextNotifications);
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      notificationsRef.current =
        previousNotifications;

      setNotifications(previousNotifications);
      setUnreadCount(unreadNotifications.length);

      throw error;
    }
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      isLoading,
      refresh,
      markAsRead,
      markAllAsRead,
    }),
    [
      notifications,
      unreadCount,
      isLoading,
      refresh,
      markAsRead,
      markAllAsRead,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }

  return context;
}