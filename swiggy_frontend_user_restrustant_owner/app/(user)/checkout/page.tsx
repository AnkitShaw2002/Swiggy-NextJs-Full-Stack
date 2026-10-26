"use client";

import React from "react";
import { ShinyButton } from "@/components/ui/shiny-button";
import {
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { getImageUrl } from "@/services/axios/axiosInstance";
import VegNonVegMark from "@/component/common/VegNonVegMark";
import { useCheckoutPage, FOOD_IMAGES } from "@/features/hooks/user/user.hook";

export default function CheckoutPage() {
  const {
    router,
    cart,
    isLoading,
    placing,
    success,
    error,
    setError,
    selectedTip,
    setSelectedTip,
    addressForm,
    setAddressForm,
    subtotal,
    deliveryFee,
    gst,
    total,
    totalQty,
    restaurantName,
    handlePlaceOrder,
  } = useCheckoutPage();

  return isLoading && !cart ? (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#fc8019]" />
        <span className="text-sm text-gray-500">Loading checkout...</span>
      </div>
    </div>
  ) : !cart || !cart.items || cart.items.length === 0 ? (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#fc8019]/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#fc8019]" />
            </div>
            <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
              Checkout
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            No Items to Checkout
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
            Add items to your cart before checking out.
          </p>
          <button
            onClick={() => router.push("/restaurants")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#fc8019] text-white text-sm font-bold rounded-xl hover:bg-[#e06f12] transition shadow-md shadow-orange-200"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Restaurants
          </button>
        </div>
      </div>
    </div>
  ) : success ? (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
              Order Confirmed
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Order Placed Successfully!
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 -mt-6 relative z-10">
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Thank you for your order!</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8">
            Your order has been placed successfully. You can track your order status in the orders section.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => router.push("/orders")}
              className="px-8 py-3 bg-[#fc8019] text-white text-sm font-bold rounded-xl hover:bg-[#e06f12] transition shadow-md shadow-orange-200"
            >
              View My Orders
            </button>
            <button
              onClick={() => router.push("/restaurants")}
              className="px-8 py-3 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition"
            >
              Order More
            </button>
          </div>
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
                  <CreditCard className="w-5 h-5 text-[#fc8019]" />
                </div>
                <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Checkout
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
        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Items & Delivery */}
          <div className="lg:col-span-2 space-y-3">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
                Delivery Address
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Address *</label>
                  <input
                    type="text"
                    value={addressForm.address}
                    onChange={(e) => setAddressForm((p) => ({ ...p, address: e.target.value }))}
                    placeholder="House/Flat no, Street, Area"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019]/30 focus:border-[#fc8019]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">City *</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                      placeholder="City"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019]/30 focus:border-[#fc8019]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">State *</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))}
                      placeholder="State"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019]/30 focus:border-[#fc8019]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Pincode *</label>
                    <input
                      type="text"
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm((p) => ({ ...p, pincode: e.target.value }))}
                      placeholder="Pincode"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019]/30 focus:border-[#fc8019]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Landmark</label>
                    <input
                      type="text"
                      value={addressForm.landmark}
                      onChange={(e) => setAddressForm((p) => ({ ...p, landmark: e.target.value }))}
                      placeholder="Near..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019]/30 focus:border-[#fc8019]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
                Order Items
              </h3>
              <div className="space-y-3">
                {cart.items.map((item, index) => (
                  <div
                    key={item._id || item.food._id}
                    className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0"
                  >
                    {/* Food Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
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
                      {item.food.isVeg !== undefined && (
                        <div className="absolute bottom-1 left-1 bg-white rounded p-0.5 shadow-md">
                          <VegNonVegMark isVeg={item.food.isVeg} size={14} />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {item.food.itemName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-gray-400">
                            (₹{item.price} × {item.quantity})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <span className="text-sm font-extrabold text-gray-900 shrink-0">
                      ₹{(item.price || 0) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Tip your delivery partner
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {[20, 30, 50].map((tipAmount) => (
                  <button
                    key={tipAmount}
                    onClick={() => setSelectedTip(selectedTip === tipAmount ? null : tipAmount)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition border ${
                      selectedTip === tipAmount
                        ? "bg-[#fc8019] text-white border-[#fc8019] shadow-md shadow-orange-200"
                        : "border-gray-200 text-gray-600 hover:border-[#fc8019] hover:text-[#fc8019]"
                    }`}
                  >
                    ₹{tipAmount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Payment Summary</h3>

              {/* Bill Breakdown */}
              <div className="space-y-3 text-sm">
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
                {selectedTip && selectedTip > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Tip</span>
                    <span className="font-medium">₹{selectedTip}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-gray-900">
                  <span>To Pay</span>
                  <span className="text-lg">₹{total}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <ShinyButton
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full py-3.5 rounded-xl bg-[#fc8019] hover:bg-[#e06f12] text-white text-sm font-bold shadow-md shadow-orange-200 border-transparent [&_span]:text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order — ₹{total}
                  </>
                )}
              </ShinyButton>

              {/* Payment Method */}
              <div className="flex items-center justify-center gap-2 py-1">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-[10px]">💵</span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium">Cash on Delivery</span>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 justify-center pt-1 border-t border-gray-50">
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
