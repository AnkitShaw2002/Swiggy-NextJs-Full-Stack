"use client";

import React from "react";
import Link from "next/link";
import { ShinyButton } from "@/components/ui/shiny-button";
import {
  Loader2,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  MapPin,
  Tag,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { getFoodId } from "@/features/store/user.store";
import { getImageUrl } from "@/services/axios/axiosInstance";
import VegNonVegMark from "@/component/common/VegNonVegMark";
import { useCartPage, FOOD_IMAGES } from "@/features/hooks/user/user.hook";

export default function CartPage() {
  const {
    router,
    cart,
    isLoading,
    isCartUpdating,
    userLocation,
    subtotal,
    deliveryFee,
    gst,
    total,
    totalQty,
    restaurantName,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCartPage();

  return isLoading && !cart ? (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#fc8019]" />
        <span className="text-sm text-gray-500">Loading cart...</span>
      </div>
    </div>
  ) : !cart || !cart.items || cart.items.length === 0 ? (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#fc8019]/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#fc8019]" />
            </div>
            <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
              Your Cart
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Cart is Empty
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 -mt-6 relative z-10">
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            Looks like you haven&apos;t added anything to your cart yet. Browse restaurants and add your favorite items.
          </p>
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#fc8019] text-white text-sm font-bold rounded-xl hover:bg-[#e06f12] transition shadow-md shadow-orange-200"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Restaurants
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-[#fc8019]/20 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[#fc8019]" />
                </div>
                <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Your Cart
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {totalQty} item{totalQty !== 1 ? "s" : ""} from {restaurantName}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-4 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {/* Delivery Info */}
            {userLocation && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                    Delivering to
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{userLocation}</p>
                </div>
                <button className="text-xs font-bold text-[#fc8019] hover:underline">
                  Change
                </button>
              </div>
            )}

            {/* Items */}
            {cart.items.map((item, index) => {
              const foodId = getFoodId(item.food);
              return (
              <div
                key={item._id || foodId}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Food Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
                    {item.food.image ? (
                      <img
                        src={getImageUrl(item.food.image)}
                        alt={item.food.itemName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={FOOD_IMAGES[index % FOOD_IMAGES.length]}
                        alt={item.food.itemName}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* Veg/Non-veg Badge */}
                    {item.food.isVeg !== undefined && (
                      <div className="absolute bottom-1.5 left-1.5 bg-white rounded-md p-0.5 shadow-md">
                        <VegNonVegMark isVeg={item.food.isVeg} size={16} />
                      </div>
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {item.food.itemName}
                    </h3>
                    {item.food.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {item.food.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-base font-extrabold text-gray-900">
                        ₹{item.price || item.food.discountPrice || item.food.basePrice}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-xs text-gray-400">
                          × {item.quantity} = ₹{(item.price || item.food.discountPrice || item.food.basePrice) * item.quantity}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-0 bg-[#2e7d32] text-white rounded-xl overflow-hidden shadow-sm">
                      <button
                        onClick={() => foodId && decreaseQuantity(foodId)}
                        disabled={isCartUpdating || !foodId}
                        aria-label="Decrease quantity"
                        className="w-9 h-9 flex items-center justify-center hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => foodId && increaseQuantity(foodId)}
                        disabled={isCartUpdating || !foodId || item.quantity >= 10}
                        aria-label="Increase quantity"
                        className="w-9 h-9 flex items-center justify-center hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => foodId && removeFromCart(foodId)}
                      disabled={isCartUpdating || !foodId}
                      className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-red-500 transition disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              );
            })}

            {/* Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Tip your delivery partner
              </p>
              <div className="flex items-center gap-2">
                {[20, 30, 50].map((tip) => (
                  <button
                    key={tip}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-[#fc8019] hover:text-[#fc8019] transition"
                  >
                    ₹{tip}
                  </button>
                ))}
                <button className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-[#fc8019] hover:text-[#fc8019] transition">
                  Other
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Order Summary</h3>

              {/* Coupon */}
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#fc8019]" />
                  <span className="text-sm font-semibold text-gray-700">Apply Coupon</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {/* Bill Details */}
              <div className="space-y-3 text-sm">
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Bill Details
                </p>
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST & Charges</span>
                  <span className="font-medium">₹{gst}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-gray-900">
                  <span>To Pay</span>
                  <span className="text-lg">₹{total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <ShinyButton
                onClick={() => router.push("/checkout")}
                className="w-full py-3.5 rounded-xl bg-[#fc8019] hover:bg-[#e06f12] text-white text-sm font-bold shadow-md shadow-orange-200 border-transparent [&_span]:text-white"
              >
                Proceed to Payment
              </ShinyButton>

              {/* Safety */}
              <div className="flex items-center gap-2 text-center justify-center">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span className="text-[11px] text-gray-400 font-medium">
                  Safe and secure payment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
