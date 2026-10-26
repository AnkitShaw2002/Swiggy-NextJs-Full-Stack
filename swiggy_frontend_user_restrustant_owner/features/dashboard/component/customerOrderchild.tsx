// features/dashboard/component/CustomerOrderChild.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Loader2,
  ClipboardList,
  Package,
  ChevronDown,
  User,
  Phone,
  IndianRupee,
} from "lucide-react";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TRANSITIONS,
  type Order,
} from "@/features/typescript/restaurantOwner.type";
import VegNonVegMark from "@/component/common/VegNonVegMark";
import {
  ORDER_STATUS_PILLS,
  FILTER_TABS,
  type FilterKey,
} from "@/features/hooks/dashboard/dashboard.hook";

interface CustomerOrderChildProps {
  orders: Order[];
  isLoading: boolean;
  updatingOrderIds: string[];
  activeFilter: FilterKey;
  setActiveFilter: (key: FilterKey) => void;
  selectedStatus: Record<string, string>;
  filteredOrders: Order[];
  handleStatusChange: (orderId: string, value: string) => void;
}

export default function CustomerOrderChild({
  orders,
  isLoading,
  updatingOrderIds,
  activeFilter,
  setActiveFilter,
  selectedStatus,
  filteredOrders,
  handleStatusChange,
}: CustomerOrderChildProps) {
  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-xs overflow-hidden">
      {/* DARK SUB-HEADER TABS */}
      <div className="bg-[#2b323b] px-4 pt-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center overflow-x-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 sm:px-4 py-2 text-xs font-bold tracking-wider transition border-b-2 uppercase whitespace-nowrap cursor-pointer ${
                activeFilter === tab.key
                  ? "text-white border-[#fc8019]"
                  : "text-gray-400 border-transparent hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="hidden sm:flex items-center gap-4 pl-4">
          <Link
            href="/resturant_owner_dashboard/order-history"
            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 uppercase tracking-wider"
          >
            Order History ›
          </Link>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {filteredOrders.length} Orders
          </span>
        </span>
      </div>

      {/* LIST BODY */}
      {isLoading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[45vh] gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#fc8019]" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Loading Orders...
          </span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[45vh] gap-2 px-6 text-center">
          <ClipboardList className="w-12 h-12 text-gray-300 mb-1" />
          <h3 className="text-sm font-bold text-gray-900">
            {activeFilter === "all" ? "No Orders Yet" : "No Orders In This Tab"}
          </h3>
          <p className="text-xs text-gray-500">
            {activeFilter === "all"
              ? "Orders from customers will appear here."
              : "Try another tab or check back later."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredOrders.map((order) => {
            const status = order.status;
            const isUpdating = updatingOrderIds.includes(order._id);
            const allowedNext = ORDER_STATUS_TRANSITIONS[status] || [];
            const isTerminal = allowedNext.length === 0;

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
                    className={`${ORDER_STATUS_PILLS[status] || "bg-gray-500"} text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded`}
                  >
                    {ORDER_STATUS_LABELS[status] || status}
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

                {/* FOOTER: TOTAL + STATUS UPDATE */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    Total
                    <span className="text-sm font-extrabold text-gray-900 normal-case tracking-normal pl-1">
                      ₹{order.totalAmount}
                    </span>
                  </div>

                  {isTerminal ? (
                    <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                      {status === "cancelled"
                        ? "Order cancelled"
                        : "Order completed"}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <span className="hidden sm:block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                        Update status
                      </span>
                      <div className="relative">
                        <select
                          value={selectedStatus[order._id] || ""}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="appearance-none pl-3 pr-8 py-2 rounded border border-gray-300 bg-white text-[11px] font-bold uppercase tracking-wide text-gray-700 hover:border-gray-400 focus:outline-none focus:border-[#fc8019] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                        >
                          <option value="" disabled>
                            {isUpdating ? "Updating..." : "Select status"}
                          </option>
                          {allowedNext.map((next) => (
                            <option key={next} value={next}>
                              {ORDER_STATUS_LABELS[next]}
                            </option>
                          ))}
                        </select>
                        {isUpdating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#fc8019] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
