// features/typescript/notification.type.ts

export type NotificationType =
  | "order_placed"
  | "order_status"
  | "new_order"
  | "application_status";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  orderId?: string;
  read: boolean;
  createdAt: string;
  /** Account this notification belongs to (`user:<id>`). */
  scope?: string | null;
}
