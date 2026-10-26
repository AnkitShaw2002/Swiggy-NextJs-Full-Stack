import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppNotification, NotificationType } from "@/features/typescript/notification.type";

const MAX_NOTIFICATIONS = 50;

/**
 * Which account owns the bell: `user:<id>` for a signed-in account, `null`
 * for signed-out visitors. Notifications never cross this boundary.
 */
export type NotificationScope = string | null;

export const notificationScopeFor = (
  user: { id?: string } | null | undefined
): NotificationScope => (user?.id ? `user:${String(user.id)}` : null);

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  scope: NotificationScope;
  addNotification: (input: {
    type: NotificationType;
    title: string;
    message: string;
    orderId?: string;
  }) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  /** Move the bell to another account - drops the previous account's list. */
  switchScope: (scope: NotificationScope) => void;
}

const countUnread = (notifications: AppNotification[]): number =>
  notifications.filter((n) => !n.read).length;

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      scope: null,

      addNotification: (input) =>
        set((state) => {
          // Dedupe: same order + same type already present (e.g. socket retry)
          const duplicate = state.notifications.some(
            (n) => n.orderId === input.orderId && n.type === input.type && n.message === input.message
          );
          if (duplicate) return state;

          const notification: AppNotification = {
            id:
              typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            type: input.type,
            title: input.title,
            message: input.message,
            orderId: input.orderId,
            read: false,
            createdAt: new Date().toISOString(),
            scope: state.scope,
          };

          const notifications = [notification, ...state.notifications].slice(0, MAX_NOTIFICATIONS);
          return { notifications, unreadCount: countUnread(notifications) };
        }),

      markRead: (id) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return { notifications, unreadCount: countUnread(notifications) };
        }),

      markAllRead: () =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.read ? n : { ...n, read: true }
          );
          return { notifications, unreadCount: 0 };
        }),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),

      switchScope: (scope) =>
        set((state) => {
          // Same account - keep its notifications.
          if (state.scope === scope) return state;
          // Account changed (login / logout / role switch): start empty so one
          // user never sees another account's bell.
          return { scope, notifications: [], unreadCount: 0 };
        }),
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        scope: state.scope,
      }),
      merge: (persisted, current) => {
        const previous = (persisted ?? {}) as {
          notifications?: AppNotification[];
          scope?: NotificationScope;
        };
        const scope: NotificationScope = previous.scope ?? null;

        // Only restore notifications that belong to the persisted account.
        // Anything unstamped (legacy global bucket) is dropped.
        const notifications = (previous.notifications ?? []).filter(
          (n) => n.scope && n.scope === scope
        );

        return {
          ...current,
          scope,
          notifications,
          unreadCount: countUnread(notifications),
        };
      },
    }
  )
);
