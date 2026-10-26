"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { socket } from "@/lib/socket/socket";
import { useAuthStore } from "@/features/store/auth.store";
import { useUserStore } from "@/features/store/user.store";
import { useRestaurantStore, wasSelfUpdated } from "@/features/store/restaurantOwner.store";
import { useNotificationStore, notificationScopeFor } from "@/features/store/notification.store";
import type {
  FoodStatusEvent,
  OrderStatusEvent,
  RestaurantStatusEvent,
  RestaurantStatusUpdatedEvent,
} from "@/features/typescript/socket.type";

const sameId = (a?: unknown, b?: unknown) =>
  Boolean(a) && Boolean(b) && String(a) === String(b);

const orderRef = (orderId: unknown) => `#${String(orderId).slice(-8).toUpperCase()}`;
const statusLabel = (status: unknown) => String(status).replace(/_/g, " ");

export default function SocketProvider() {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.user?.id);

  // Bind the notification bell to the signed-in account. Runs before the
  // socket effect below so no event lands in another account's list.
  useEffect(() => {
    useNotificationStore
      .getState()
      .switchScope(notificationScopeFor(userId ? { id: userId } : null));
  }, [userId]);

  useEffect(() => {
    if (!token) return;

    socket.auth = { token };

    // Join the personal room `user_<id>` so the backend can target this
    // user (adminController emits "restaurant:status-updated" to it).
    const joinUserRoom = () => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) return;
      socket.emit("user:join", String(userId));
      console.log("[socket] joined room:", `user_${userId}`);
    };

    const handleConnect = () => {
      console.log("[socket] connected:", socket.id);
      joinUserRoom();
    };

    const handleDisconnect = (reason: string) => {
      console.log("[socket] disconnected:", reason);
    };

    const handleConnectError = (error: Error) => {
      console.error(
        "[socket] connect_error:",
        error?.message,
        "- is the backend running on port 4000?"
      );
    };

    // Broadcast to every client - filter locally.
    const handleOrderStatus = (payload: OrderStatusEvent) => {
      if (!payload?.orderId) return;

      const user = useAuthStore.getState().user;
      if (sameId(payload.userId, user?.id)) {
        useUserStore.getState().applyOrderStatusUpdate(payload.orderId, payload.currentStatus);

        // Visible toast + live bell notification - no page refresh needed.
        toast.info("Order update", {
          id: `order-status-${payload.orderId}`,
          description: `Order ${orderRef(payload.orderId)} is now ${statusLabel(
            payload.currentStatus
          )}`,
        });
        useNotificationStore.getState().addNotification({
          type: "order_status",
          title: "Order update",
          message: `Order ${orderRef(payload.orderId)} is now ${statusLabel(
            payload.currentStatus
          )}`,
          orderId: payload.orderId,
        });
      }

      const restaurantId = useRestaurantStore.getState().restaurant?._id;
      if (sameId(payload.restaurantId, restaurantId)) {
        useRestaurantStore
          .getState()
          .applyOrderStatusUpdate(payload.orderId, payload.currentStatus);

        // Skip toast + bell if this status change was made by the owner
        // themselves (their own action already shows a success toast).
        if (!wasSelfUpdated(payload.orderId)) {
          toast.info("Order update", {
            id: `order-status-${payload.orderId}`,
            description: `Order ${orderRef(payload.orderId)} is now ${statusLabel(
              payload.currentStatus
            )}`,
          });
          useNotificationStore.getState().addNotification({
            type: "order_status",
            title: "Order update",
            message: `Order ${orderRef(payload.orderId)} is now ${statusLabel(
              payload.currentStatus
            )}`,
            orderId: payload.orderId,
          });
        }
      }
    };

    const handleFoodStatus = (payload: FoodStatusEvent) => {
      if (!payload?.foodId) return;
      useUserStore.getState().applyFoodAvailability(payload.foodId, payload.isAvailable);
      useRestaurantStore.getState().applyFoodAvailability(payload.foodId, payload.isAvailable);
    };

    const handleRestaurantStatus = (payload: RestaurantStatusEvent) => {
      if (!payload?.restaurantId) return;
      useUserStore.getState().applyRestaurantStatus(payload.restaurantId, payload.isOpen);
      useRestaurantStore.getState().applyRestaurantStatus(payload.restaurantId, payload.isOpen);
    };

    // Admin approved / rejected this user's "become a restaurant owner"
    // application (PUT /admin/update-restaurant/:id). Room-targeted event,
    // so it always belongs to the logged-in user.
    const handleApplicationStatus = (payload: RestaurantStatusUpdatedEvent) => {
      if (!payload?.restaurantId || !payload?.status) return;

      // Ignore events for a restaurant this account does not own (stale room
      // / mis-targeted event) - the bell must stay account-scoped.
      const ownedRestaurantId = useRestaurantStore.getState().restaurant?._id;
      if (ownedRestaurantId && !sameId(ownedRestaurantId, payload.restaurantId)) return;

      const accepted = payload.status === "approved";
      const reason = payload.rejectionReason?.trim();

      const title = accepted
        ? "Restaurant owner application accepted"
        : "Restaurant owner application rejected";

      const message = accepted
        ? "Your application is accepted and your account is updated to Restaurant Owner. Please log out and log in again to visit your Restaurant Owner dashboard."
        : reason
          ? `Your application to become a restaurant owner was rejected. Reason: ${reason}`
          : "Your application to become a restaurant owner was rejected.";

      if (accepted) {
        toast.success(title, {
          id: `application-status-${payload.restaurantId}`,
          description: message,
        });
      } else {
        toast.error(title, {
          id: `application-status-${payload.restaurantId}`,
          description: message,
        });
      }

      useNotificationStore.getState().addNotification({
        type: "application_status",
        title,
        message,
      });

      // Refresh local restaurant state (status banner etc.) - no reload needed.
      void useRestaurantStore.getState().fetchMyRestaurant();
    };

    socket.connect();

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("order:status", handleOrderStatus);
    socket.on("food:status", handleFoodStatus);
    socket.on("restaurant:status", handleRestaurantStatus);
    socket.on("restaurant:status-updated", handleApplicationStatus);

    // Reconnect-safe: if the socket is already open when this effect runs,
    // "connect" will not fire again, so join the room right away.
    if (socket.connected) {
      joinUserRoom();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("order:status", handleOrderStatus);
      socket.off("food:status", handleFoodStatus);
      socket.off("restaurant:status", handleRestaurantStatus);
      socket.off("restaurant:status-updated", handleApplicationStatus);
      socket.disconnect();
    };
  }, [token]);

  return null;
}
