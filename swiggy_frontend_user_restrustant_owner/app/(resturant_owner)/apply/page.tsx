"use client";

import React from "react";
import ApplyRestaurantHero from "@/features/restaurant_owner/component/restaurant-apply/ApplyRestaurantHero";
import VerifyOtpCard from "@/features/restaurant_owner/component/restaurant-apply/VerifyOtpCard";
import { useApplyRestaurantPage } from "@/features/hooks/owner/owner.hook";

export default function ApplyPage() {
  const {
    bgImage,
    step,
    setStep,
    contactEmail,
    userId,
    loading,
    error,
    serviceType,
    setServiceType,
    handleHeroSubmit,
    handleOtpVerify,
    handleResend,
  } = useApplyRestaurantPage();

  return (
    <div className="min-h-screen bg-white">

      {/* Top Hero Section */}
      <div className="w-full bg-white font-sans text-gray-900">
        <div className="relative w-full min-h-[500px] sm:min-h-[460px] bg-slate-900 text-white flex items-center overflow-hidden py-10">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${bgImage}')` }}
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />

          <div className="relative z-10 w-full px-6 sm:px-12 md:px-20 lg:px-32 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Hero Content */}
            <div className="space-y-3 text-center md:text-left max-w-lg">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="relative w-16 h-16 rounded-full bg-white p-0.5 shadow-lg shrink-0 flex items-center justify-center overflow-hidden border-2 border-white/80">
                  <img
                    src="/Images/JUBILANT Logo.jpg"
                    alt="Jubilant Logo"
                    className="w-full h-full object-cover rounded-full"
                    suppressHydrationWarning
                  />
                </div>
                <span className="text-sm font-extrabold tracking-widest uppercase text-gray-100">
                  PARTNER WITH JUBILANT!
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Expand your reach & grow sales effortlessly
              </h1>

              <div
                className="w-12 h-1 mx-auto md:mx-0 rounded-full"
                style={{ backgroundColor: "#FF4500" }}
              />
            </div>

            {/* Right Card: Dynamic Swap based on step */}
            {step === "hero" ? (
              <ApplyRestaurantHero
                userEmail={contactEmail} // Passes the autofilled or entered email
                onSubmit={handleHeroSubmit}
                loading={loading}
                error={error}
              />
            ) : (
              <VerifyOtpCard
                email={contactEmail}
                userId={userId}
                onVerify={handleOtpVerify}
                onResend={handleResend}
                onBack={() => setStep("hero")}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </div>
      </div>

      {/* Steps & Required Documents */}
      <div className="w-full px-6 sm:px-12 md:px-20 lg:px-32 py-10 relative z-20">
        <div className="flex justify-center -mt-16 mb-10">
          <div className="bg-white p-1 rounded-full flex gap-1 shadow-md border border-gray-100">
            <button
              type="button"
              onClick={() => setServiceType("delivery")}
              suppressHydrationWarning
              style={{
                backgroundColor: serviceType === "delivery" ? "#FF4500" : "transparent",
              }}
              className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                serviceType === "delivery"
                  ? "text-white shadow-xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Food Delivery
            </button>
            <button
              type="button"
              onClick={() => setServiceType("dineout")}
              suppressHydrationWarning
              style={{
                backgroundColor: serviceType === "dineout" ? "#FF4500" : "transparent",
              }}
              className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                serviceType === "dineout"
                  ? "text-white shadow-xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Dineout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1">
              In just 3 easy steps
            </p>
            <h3 className="text-base font-bold text-gray-900 mb-6">
              Get your restaurant delivery-ready in 24hrs!
            </h3>

            <div className="bg-gray-50/80 border border-gray-100 p-6 rounded-2xl space-y-6">
              <div className="flex gap-4 items-start">
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: "#FF4500" }}
                />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    STEP 1
                  </p>
                  <p className="text-xs font-bold text-gray-800">
                    Install the Jubilant Partner App
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: "#FF4500" }}
                />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    STEP 2
                  </p>
                  <p className="text-xs font-bold text-gray-800">
                    Login/Register using your phone number
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: "#FF4500" }}
                />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    STEP 3
                  </p>
                  <p className="text-xs font-bold text-gray-800">
                    Enter restaurant details
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-600 font-medium mb-4 leading-relaxed">
              For an easy form filling process,
              <br />
              you can keep these documents handy:
            </p>

            <ul className="space-y-3 text-xs text-gray-700 font-medium border-t border-gray-100 pt-4">
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>FSSAI License copy</span>
                <span
                  className="cursor-pointer hover:underline font-bold text-[11px] ml-1"
                  style={{ color: "#FF4500" }}
                >
                  Apply Here
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Your Restaurant menu</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Bank details</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>GSTIN</span>
                <span
                  className="cursor-pointer hover:underline font-bold text-[11px] ml-1"
                  style={{ color: "#FF4500" }}
                >
                  Apply Here
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>PAN card copy</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}