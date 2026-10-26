import type { OrderStatus } from "@/features/typescript/restaurantOwner.type";

// Server -> Client events (E:\Swiggy\Swiggy_Node_Js)

export interface RestaurantNewOrderEvent {
  orderId: string;
  restaurantId: string;
  message: string;
  order: Record<string, unknown>;
}

export interface OrderStatusEvent {
  orderId: string;
  userId: string;
  restaurantId: string;
  previousStatus: OrderStatus;
  currentStatus: OrderStatus;
}

export interface FoodStatusEvent {
  foodId: string;
  itemName: string;
  isAvailable: boolean;
}

export interface RestaurantStatusEvent {
  restaurantId: string;
  restaurantName: string;
  isOpen: boolean;
}

export interface RestaurantStatusUpdatedEvent {
  restaurantId: string;
  restaurantName: string;
  status: string;
  rejectionReason: string | null;
  message: string;
}

// Client -> Server events

export type RestaurantJoinEvent = string;
