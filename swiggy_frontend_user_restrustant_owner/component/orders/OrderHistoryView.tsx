"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  User,
  Phone,
  IndianRupee,
  ClipboardList,
} from "lucide-react";
import {
  Order,
  ORDER_STATUS_LABELS,
} from "@/features/typescript/restaurantOwner.type";
import Pagination from "@/component/common/Pagination";
import SkeletonList from "@/component/common/Skeleton";
import VegNonVegMark from "@/component/common/VegNonVegMark";

/** Orders shown per page on the Order History screen. */
export const HISTORY_PAGE_SIZE = 10;

export type HistoryStatus = "all" | "delivered" | "cancelled";

const STATUS_PILLS: Record<Exclude<HistoryStatus, "all">, string> = {
  delivered: "bg-emerald-600",
  cancelled: "bg-red-600",
};

const TABS: { key: HistoryStatus; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "delivered", label: "DELIVERED" },
  { key: "cancelled", label: "CANCELLED" },
];

interface OrderHistoryViewProps {
  /** Orders for the current (server-rendered) page only. */
  orders: Order[];
  /** 0-based page index, as expected by react-paginate. */
  currentPage: number;
  pageCount: number;
  status: HistoryStatus;
  counts: { all: number; delivered: number; cancelled: number };
  totalItems: number;
}

export default function OrderHistoryView({
  orders,
  currentPage,
  pageCount,
  status,
  counts,
  totalItems,
}: OrderHistoryViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (nextStatus: HistoryStatus, page: number) => {
    const query = new URLSearchParams();
    if (nextStatus !== "all") query.set("status", nextStatus);
    if (page > 1) query.set("page", String(page));
    const qs = query.toString();

    // Wrapped in a transition so the skeleton shows while the SSR page streams.
    startTransition(() => {
      router.push(
        `/resturant_owner_dashboard/order-history${qs ? `?${qs}` : ""}`
      );
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      {/* ORDER HISTORY SUMMARY */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-md shadow-xs border border-gray-200">
        <div>
          <span className="font-bold text-gray-800 uppercase tracking-wider text-xs block">
            Order History
          </span>
          <span className="text-[11px] text-gray-400">
            Delivered and cancelled orders of your restaurant
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="bg-[#2b323b] text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-2">
            <span>TOTAL</span>
            <span className="bg-[#1e232a] text-white px-2 py-0.5 rounded-full text-[11px]">
              {counts.all}
            </span>
          </span>
          <span className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-2">
            <span>DELIVERED</span>
            <span className="bg-emerald-800 text-white px-2 py-0.5 rounded-full text-[11px]">
              {counts.delivered}
            </span>
          </span>
          <span className="bg-red-600 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-2">
            <span>CANCELLED</span>
            <span className="bg-red-800 text-white px-2 py-0.5 rounded-full text-[11px]">
              {counts.cancelled}
            </span>
          </span>
        </div>
      </div>

      {/* ORDERS LIST CONTAINER */}
      <div className="bg-white rounded-md border border-gray-200 shadow-xs overflow-hidden">
        {/* DARK SUB-HEADER TABS */}
        <div className="bg-[#2b323b] px-4 pt-2 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => navigate(tab.key, 1)}
                className={`px-3 sm:px-4 py-2 text-xs font-bold tracking-wider transition border-b-2 uppercase whitespace-nowrap cursor-pointer ${
                  status === tab.key
                    ? "text-white border-[#fc8019]"
                    : "text-gray-400 border-transparent hover:text-gray-200"
                }`}
              >
                {tab.label} ({counts[tab.key]})
              </button>
            ))}
          </div>
          <span className="hidden sm:flex items-center gap-4 pl-4">
            <Link
              href="/resturant_owner_dashboard/customer-orders"
              className="text-[11px] font-bold text-sky-400 hover:text-sky-300 uppercase tracking-wider"
            >
              ‹ Active Orders
            </Link>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {totalItems} Orders
            </span>
          </span>
        </div>

        {/* LIST BODY */}
        {isPending ? (
          <div className="p-4">
            <SkeletonList count={4} variant="card" className="space-y-4" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[45vh] gap-2 px-6 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mb-1" />
            <h3 className="text-sm font-bold text-gray-900">
              No History Yet
            </h3>
            <p className="text-xs text-gray-500">
              {status === "all"
                ? "Delivered and cancelled orders will appear here."
                : `No ${status} orders found.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => {
              const statusKey =
                order.status === "delivered" || order.status === "cancelled"
                  ? order.status
                  : "delivered";

              return (
                <div key={order._id} className="p-5 space-y-3.5">
                  {/* ROW: ORDER ID + DATE + STATUS */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-500" />
                      </span>
                      <div>
                        <span className="text-sm font-bold text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <p className="text-[11px] text-gray-400">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`${
                        STATUS_PILLS[statusKey] || "bg-gray-500"
                      } text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded`}
                    >
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>

                  {/* CUSTOMER */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-600" />
                      {order.user?.name || "Customer"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-sky-600" />
                      {order.user?.phone || "No phone"}
                    </span>
                  </div>

                  {/* ITEMS */}
                  <div className="bg-gray-50 border border-gray-100 rounded px-3.5 py-2.5 space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-gray-700 flex items-center gap-1.5">
                          {typeof item.food === "object" && (
                            <VegNonVegMark isVeg={item.food.isVeg} size={13} />
                          )}
                          {typeof item.food === "object"
                            ? item.food.itemName
                            : "Food Item"}{" "}
                          <span className="text-gray-400">
                            &times; {item.quantity}
                          </span>
                        </span>
                        <span className="font-bold text-gray-900">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER: TOTAL + OUTCOME */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                      Total
                      <span className="text-sm font-extrabold text-gray-900 normal-case tracking-normal pl-1">
                        ₹{order.totalAmount}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold uppercase tracking-wide ${
                        statusKey === "cancelled"
                          ? "text-red-500"
                          : "text-emerald-600"
                      }`}
                    >
                      {statusKey === "cancelled"
                        ? "Order cancelled"
                        : "Order delivered"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50">
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            onPageChange={(nextPage) => navigate(status, nextPage + 1)}
          />
        </div>
      </div>
    </div>
  );
}
