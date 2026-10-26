"use client";

import React from "react";
import {
  ORDER_STATUS_PILLS,
  ORDER_STATUS_COUNT_BG,
  SUMMARY_TABS,
  useCustomerOrdersPage,
} from "@/features/hooks/dashboard/dashboard.hook";
import CustomerOrderChild from "@/features/dashboard/component/customerOrderchild";

export default function OrdersPage() {
  const {
    orders,
    isLoading,
    updatingOrderIds,
    activeFilter,
    setActiveFilter,
    selectedStatus,
    counts,
    filteredOrders,
    handleStatusChange,
  } = useCustomerOrdersPage();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      {/* ORDER SUMMARY BADGES BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-md shadow-xs border border-gray-200 text-sm">
        <span className="font-bold text-gray-800 uppercase tracking-wider text-xs">
          Order Summary
        </span>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {SUMMARY_TABS.map((tab) => (
            <span
              key={tab.key}
              className={`${ORDER_STATUS_PILLS[tab.key]} text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-2`}
            >
              <span>{tab.label}</span>
              <span
                className={`${ORDER_STATUS_COUNT_BG[tab.key]} text-white px-2 py-0.5 rounded-full text-[11px]`}
              >
                {counts[tab.key]}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ORDERS LIST CONTAINER */}
      <CustomerOrderChild
        orders={orders}
        isLoading={isLoading}
        updatingOrderIds={updatingOrderIds}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedStatus={selectedStatus}
        filteredOrders={filteredOrders}
        handleStatusChange={handleStatusChange}
      />
    </div>
  );
}
