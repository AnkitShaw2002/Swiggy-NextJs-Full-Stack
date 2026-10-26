"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { socket } from "@/lib/socket/socket";
import { useRestaurantStore } from "@/features/store/restaurantOwner.store";
import { useNotificationStore } from "@/features/store/notification.store";
import type { RestaurantNewOrderEvent } from "@/features/typescript/socket.type";

const sameId = (a?: unknown, b?: unknown) =>
  Boolean(a) && Boolean(b) && String(a) === String(b);

export default function RestaurantSocket() {
  const restaurantId = useRestaurantStore((state) => state.restaurant?._id);

  // Joins the `restaurant_<id>` room so the server can push new orders.
  useEffect(() => {
    if (!restaurantId) return;

    const joinedRoom = restaurantId;
    const joinRoom = () => {
      socket.emit("restaurant:join", joinedRoom);
      console.log("[socket] restaurant:join ->", joinedRoom);
    };

    if (socket.connected) joinRoom();
    else socket.connect();

    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
      // Leave the previous account's room when the restaurant changes or the
      // owner signs out - prevents new-order events crossing accounts.
      if (socket.connected) socket.emit("restaurant:leave", joinedRoom);
    };
  }, [restaurantId]);

  useEffect(() => {
    const handleNewOrder = (payload: RestaurantNewOrderEvent) => {
      if (!payload?.orderId) return;

      // Only the restaurant named in the payload may react.
      const currentRestaurantId = useRestaurantStore.getState().restaurant?._id;
      if (!sameId(payload.restaurantId, currentRestaurantId)) return;

      toast.info("New order received!", {
        description: `Order #${String(payload.orderId).slice(-8).toUpperCase()}`,
      });

      // Live bell notification on the dashboard header.
      useNotificationStore.getState().addNotification({
        type: "new_order",
        title: "New order received",
        message: `Order #${String(payload.orderId).slice(-8).toUpperCase()} · ${
          (payload.order as { totalAmount?: number })?.totalAmount
            ? `₹${(payload.order as { totalAmount?: number }).totalAmount}`
            : "view details"
        }`,
        orderId: payload.orderId,
      });

      void useRestaurantStore.getState().fetchOrders();
    };

    socket.on("restaurant:new-order", handleNewOrder);

    return () => {
      socket.off("restaurant:new-order", handleNewOrder);
    };
  }, []);

  return null;
}
