"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ChefHat,
  ShoppingBag,
} from "lucide-react";
import { useUserStore, Order } from "@/features/store/user.store";
import Pagination from "@/component/common/Pagination";
import SkeletonList from "@/component/common/Skeleton";

/** Orders shown per page on this screen - change it here. */
export const ORDERS_PER_PAGE = 5;
/** Placeholder cards drawn while orders are loading - change it here. */
export const ORDERS_SKELETON_COUNT = 4;

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType; step: number }
> = {
  placed: {
    label: "Order Placed",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: ShoppingBag,
    step: 1,
  },
  accepted: {
    label: "Accepted",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: CheckCircle2,
    step: 2,
  },
  preparing: {
    label: "Preparing",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
    icon: ChefHat,
    step: 3,
  },
  out_for_delivery: {
    label: "On the Way",
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-200",
    icon: Truck,
    step: 4,
  },
  delivered: {
    label: "Delivered",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    icon: CheckCircle2,
    step: 5,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
    step: 0,
  },
};

const ORDER_TIMELINE = ["placed", "accepted", "preparing", "out_for_delivery", "delivered"];

const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=100&q=80",
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=100&q=80",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=100&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=80",
];

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

interface OrdersViewProps {
  initialOrders: Order[];
}

export default function OrdersView({ initialOrders }: OrdersViewProps) {
  const { isLoading } = useUserStore();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "delivered" | "cancelled">("all");
  const [page, setPage] = useState(0);

  // Seed the shared store with the server-rendered orders, then follow it so
  // realtime (socket) status updates keep this list in sync.
  useEffect(() => {
    useUserStore.setState({ orders: initialOrders });
    const unsubscribe = useUserStore.subscribe((state) => setOrders(state.orders));
    return unsubscribe;
  }, [initialOrders]);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (activeTab === "active") return !["delivered", "cancelled"].includes(order.status);
        if (activeTab === "delivered") return order.status === "delivered";
        if (activeTab === "cancelled") return order.status === "cancelled";
        return true;
      }),
    [orders, activeTab]
  );

  const pageCount = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const currentPage = Math.min(page, Math.max(pageCount - 1, 0));
  const pagedOrders = filteredOrders.slice(
    currentPage * ORDERS_PER_PAGE,
    (currentPage + 1) * ORDERS_PER_PAGE
  );

  const selectTab = (tab: "all" | "active" | "delivered" | "cancelled") => {
    setActiveTab(tab);
    setPage(0);
  };

  const showSkeleton = isLoading && orders.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#fc8019]/20 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-[#fc8019]" />
            </div>
            <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
              Order History
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">My Orders</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Track your current and past orders
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 -mt-6 relative z-10 pb-16">
        {/* Tabs */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {[
            { key: "all", label: "All Orders" },
            { key: "active", label: "Active" },
            { key: "delivered", label: "Delivered" },
            { key: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => selectTab(tab.key as "all" | "active" | "delivered" | "cancelled")}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border shrink-0 shadow-sm ${
                activeTab === tab.key
                  ? "bg-[#fc8019] text-white border-[#fc8019]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#fc8019] hover:text-[#fc8019]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {showSkeleton ? (
          <SkeletonList count={ORDERS_SKELETON_COUNT} variant="card" className="space-y-4" />
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {activeTab === "all"
                ? "No Orders Yet"
                : activeTab === "active"
                  ? "No Active Orders"
                  : activeTab === "delivered"
                    ? "No Delivered Orders"
                    : "No Cancelled Orders"}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5">
              {activeTab === "all"
                ? "Your orders will appear here once you place one."
                : `No ${activeTab} orders found.`}
            </p>
            <Link
              href="/restaurants"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#fc8019] text-white text-sm font-bold rounded-xl hover:bg-[#e06f12] transition shadow-md shadow-orange-200"
            >
              <ShoppingBag className="w-4 h-4" />
              Order Now
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {pagedOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>

            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              onPageChange={(nextPage) => setPage(nextPage)}
              className="mt-6"
            />
          </>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed;
  const StatusIcon = config.icon;
  const currentStep = config.step;
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";

  const itemNames = order.items
    .slice(0, 3)
    .map((item) => (typeof item.food === "object" ? item.food.itemName : "Item"))
    .join(", ");
  const extraCount = order.items.length - 3;

  return (
    <Link
      href={`/orders/${order._id}`}
      className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                #{order._id.slice(-8).toUpperCase()}
              </p>
              <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {getTimeAgo(order.createdAt)}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${config.bg} ${config.color}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        </div>

        {/* Restaurant & Items */}
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-900">
            {order.restaurant?.name || "Restaurant"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {itemNames}
            {extraCount > 0 && ` +${extraCount} more`}
          </p>
        </div>
      </div>

      {/* Timeline (for active orders) */}
      {!isCancelled && !isDelivered && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-1">
            {ORDER_TIMELINE.map((step, idx) => {
              const stepConfig = STATUS_CONFIG[step];
              const isActive = stepConfig.step <= currentStep;
              const isCurrent = stepConfig.step === currentStep;
              return (
                <React.Fragment key={step}>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isActive ? "bg-[#fc8019] text-white" : "bg-gray-100 text-gray-400"
                    } ${isCurrent ? "ring-2 ring-[#fc8019]/30" : ""}`}
                  >
                    {isActive ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>
                  {idx < ORDER_TIMELINE.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        stepConfig.step < currentStep ? "bg-[#fc8019]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancelled indicator */}
      {isCancelled && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 text-red-500">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-medium">This order was cancelled</span>
          </div>
        </div>
      )}

      {/* Delivered indicator */}
      {isDelivered && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-medium">Delivered successfully</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {order.items.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-200"
              >
                <img
                  src={FOOD_IMAGES[idx % FOOD_IMAGES.length]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {order.items.length} item{order.items.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-extrabold text-gray-900">₹{order.totalAmount}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}
