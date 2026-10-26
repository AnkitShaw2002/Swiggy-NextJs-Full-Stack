"use client";

import React from "react";
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  XCircle,
} from "lucide-react";
import VegNonVegMark from "@/component/common/VegNonVegMark";
import { useOrderDetailPage, STATUS_COLORS } from "@/features/hooks/user/user.hook";

export default function OrderDetailPage() {
  const { router, selectedOrder, isLoading, canCancel, cancelOrder } =
    useOrderDetailPage();

  return isLoading && !selectedOrder ? (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Loader2 className="w-6 h-6 animate-spin text-[#fc8019]" />
    </div>
  ) : !selectedOrder ? (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center py-20">
      <p className="text-sm text-gray-500">Order not found.</p>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Order #{selectedOrder._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-xs text-gray-500">
            {new Date(selectedOrder.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
              STATUS_COLORS[selectedOrder.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {selectedOrder.status.replace(/_/g, " ")}
          </span>
          {canCancel && (
            <button
              onClick={() => cancelOrder(selectedOrder._id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items</h3>
          {selectedOrder.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                  {item.quantity}
                </span>
                <span className="text-sm text-gray-900 flex items-center gap-1.5">
                  {typeof item.food === "object" && (
                    <VegNonVegMark isVeg={item.food.isVeg} size={14} />
                  )}
                  {typeof item.food === "object" ? item.food.itemName : "Food Item"}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-sm text-gray-900">
            <span>Total</span>
            <span>₹{selectedOrder.totalAmount}</span>
          </div>
        </div>

        {/* Restaurant & Delivery Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Restaurant</h3>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {selectedOrder.restaurant?.name || "N/A"}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                {selectedOrder.restaurant?.address || "Address not available"}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Phone className="w-3.5 h-3.5" />
                {selectedOrder.restaurant?.phone || "N/A"}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery To</h3>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">{selectedOrder.user?.name}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Phone className="w-3.5 h-3.5" />
                {selectedOrder.user?.phone}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Timeline</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              Ordered: {new Date(selectedOrder.createdAt).toLocaleString()}
            </div>
            {selectedOrder.updatedAt !== selectedOrder.createdAt && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                Updated: {new Date(selectedOrder.updatedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
