import { z } from "zod";
import {
  basicDetailsSchema,
  documentsSchema,
  contractSchema,
  applyEmailSchema,
  verifyOtpSchema,
} from "@/features/validation/restaurantOnboarding.schema"; // Adjust import path as needed

// ==========================================
// Base Domain Models & Interfaces
// ==========================================

export interface Location {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: [number, number];
}

export interface WorkingDay {
  day: string;
  isOpen?: boolean;
}

export interface OpeningClosingTime {
  sameForAllDays?: boolean;
  slots?: Array<{ open: string; close: string }>;
  open?: string;
  close?: string;
}

export interface ContractSignatory {
  fullName: string;
  designation: string;
  place: string;
  date?: string | Date;
}

export interface PartnerContract {
  accepted: boolean;
  acceptedAt?: string | Date;
  contractVersion?: string;
  reviewedSections?: string[];
  signatory?: ContractSignatory;
  declarationAccepted?: boolean;
  ipAddress?: string;
  deviceInfo?: string;
}

export type OutletType = "Restaurant" | "Cloud Kitchen" | "Cafe" | "Bakery" | "Sweet Shop";

export interface MenuItem {
  _id?: string;
  itemName: string;
  description?: string;
  foodType?: string;
  category?: string;
  image?: string;
  imageUrl?: string;
  basePrice?: number;
  discountPrice?: number;
  gst?: number;
  variants?: Array<Record<string, unknown>>;
  addons?: Array<Record<string, unknown>>;
  tags?: string[];
  isAvailable?: boolean;
  enablePreOrder?: boolean;
  allowSpecialInstructions?: boolean;
  eligibleForOffers?: boolean;
  preparationTime?: Record<string, unknown>;
}

export interface Restaurant {
  _id: string;
  owner: string;
  ownerName?: string;
  restaurantName?: string;
  location?: Location | string;
  email: string;
  phone?: string;
  whatsappNumber?: string;
  workingDays?: string[] | WorkingDay[];
  openingClosing?: OpeningClosingTime;
  outletType?: OutletType;
  pan?: string;
  panNumber?: string;
  gstin?: string;
  ifscCode?: string;
  bankAccountNumber?: string;
  fssaiNumber?: string;
  onboardingStep?: number;
  status?: "draft" | "documents_pending" | "review_pending" | "approved" | "rejected";
  isOpen?: boolean;
  menus?: MenuItem[];
  contract?: PartnerContract;
  isEmailVerified?: boolean;
  rejectedReason?: string;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Food {
  _id: string;
  restaurant: string | Restaurant;
  itemName: string;
  slug?: string;
  description?: string;
  image?: string;
  foodType?: string;
  isVeg?: boolean;
  category?: string;
  cuisine?: string;
  basePrice: number;
  discountPrice?: number;
  discountPercentage?: number;
  gst?: number;
  preparationTime?: number | Record<string, unknown>;
  rating?: number;
  totalRatings?: number;
  totalOrders?: number;
  isAvailable: boolean;
  isRecommended?: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  isDeleted?: boolean;
  restaurantName?: string;
  restaurantEmail?: string;
  restaurantPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface FoodsResponseData {
  pagination: Pagination;
  data: Food[];
}

export interface OrderItem {
  food: Food | string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | "placed"
  | "accepted"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "placed",
  "accepted",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  placed: ["accepted", "cancelled"],
  accepted: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Placed",
  accepted: "Accepted",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  restaurant: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    status: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Inferred Zod Form & Payload Types
// ==========================================

export type ApplyRestaurantPayload = z.infer<typeof applyEmailSchema>;
export type VerifyOtpPayload = z.infer<typeof verifyOtpSchema>;

export interface ResendOtpPayload {
  email: string;
}

export type RestaurantDetailsPayload = z.infer<typeof basicDetailsSchema>;

/** Shape the backend restaurant-details endpoint expects (see restaurantValidate.js). */
export interface RestaurantDetailsApiPayload {
  ownerName: string;
  restaurantName: string;
  location: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  workingDays: string[];
  openingClosing: {
    sameForAllDays: boolean;
    slots: Array<{ open: string; close: string }>;
  };
}
export type RestaurantDocumentsPayload = z.infer<typeof documentsSchema>;
export type PartnerContractPayload = z.infer<typeof contractSchema>;

export interface FoodListQueryParams {
  page?: number;
  limit?: number;
}