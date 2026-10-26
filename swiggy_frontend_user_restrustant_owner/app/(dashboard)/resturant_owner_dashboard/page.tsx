"use client";

import React from "react";
import {
  Info,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Landmark,
  Banknote,
  FileCheck,
} from "lucide-react";
import { useDashboardOverview } from "@/features/hooks/dashboard/dashboard.hook";

export default function RestaurantDashboardPage() {
  const {
    restaurant,
    pendingFoodCount,
    activeCount,
    outOfStockCount,
    addressString,
    handleToggleStatus,
  } = useDashboardOverview();

  // Status Theme Logic Helper
  const getStatusBanner = () => {
    const status = restaurant?.status?.toLowerCase();
    if (status === "approved" || status === "active") {
      return {
        bg: "bg-emerald-800",
        border: "border-emerald-700",
        pillBg: "bg-emerald-900",
        pillText: "text-emerald-200",
        icon: <CheckCircle2 className="w-7 h-7 text-emerald-300" />,
        title: "Approved & Accepting Orders",
        desc: "Your restaurant is live and listed on the platform.",
      };
    }
    if (status === "rejected") {
      return {
        bg: "bg-red-800",
        border: "border-red-700",
        pillBg: "bg-red-900",
        pillText: "text-red-200",
        icon: <XCircle className="w-7 h-7 text-red-300" />,
        title: "Application Rejected",
        desc: "Please review your documents or contact support for assistance.",
      };
    }
    return {
      bg: "bg-gray-800",
      border: "border-gray-700",
      pillBg: "bg-gray-900",
      pillText: "text-gray-200",
      icon: <Clock className="w-7 h-7 text-amber-400" />,
      title: "Application Under Review",
      desc: "Your restaurant application and details are being processed by admin.",
    };
  };

  const statusBannerConfig = getStatusBanner();

  return (
    <div className="space-y-5">
      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="bg-[#2b323b] text-gray-200 text-sm px-5 py-3 rounded-md shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-sky-400" />
          <span>
            You are viewing details for{" "}
            <strong className="text-white">
              {restaurant?.restaurantName || "--"}
            </strong>
          </span>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide text-white ${
            restaurant?.status?.toLowerCase() === "approved"
              ? "bg-emerald-600"
              : restaurant?.status?.toLowerCase() === "rejected"
              ? "bg-red-600"
              : "bg-amber-600"
          }`}
        >
          {restaurant?.status || "Pending"}
        </span>
      </div>

      {/* DYNAMIC STATUS HERO BANNER */}
      <div
        className={`${statusBannerConfig.bg} text-white p-6 rounded-md shadow flex items-center justify-between transition-colors`}
      >
        <div className="flex items-center gap-5">
          <div className={`p-3.5 ${statusBannerConfig.pillBg} rounded-full border ${statusBannerConfig.border}`}>
            {statusBannerConfig.icon}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">
                {statusBannerConfig.title}
              </h2>
              <span
                className={`${statusBannerConfig.pillBg} ${statusBannerConfig.pillText} text-xs font-semibold px-2.5 py-0.5 rounded border ${statusBannerConfig.border}`}
              >
                Onboarding Step {restaurant?.onboardingStep ?? 1} of 3
              </span>
            </div>
            <p className="text-sm opacity-90 mt-1">
              {statusBannerConfig.desc}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleStatus}
          disabled={!restaurant}
          className={`text-xs font-bold px-5 py-2.5 rounded flex items-center gap-2 transition shadow-sm cursor-pointer ${
            restaurant?.isOpen
              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-200"
          }`}
        >
          <span>{restaurant?.isOpen ? "ONLINE" : "OFFLINE"}</span>
        </button>
      </div>

      {/* METRICS & SUMMARY BADGES BAR */}
      <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-xs border border-gray-200 text-sm">
        <span className="font-bold text-gray-800 uppercase tracking-wider text-xs">
          Restaurant Metrics
        </span>
        <div className="flex items-center gap-3">
          <span className="bg-sky-600 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-2">
            <span>ACTIVE MENU ITEMS</span>
            <span className="bg-sky-800 text-white px-2 py-0.5 rounded-full text-[11px]">
              {activeCount}
            </span>
          </span>
          <span className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-2">
            <span>PENDING REVIEW</span>
            <span className="bg-amber-800 text-white px-2 py-0.5 rounded-full text-[11px]">
              {pendingFoodCount}
            </span>
          </span>
          <span className="bg-[#fc8019] text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-2">
            <span>OUT OF STOCK</span>
            <span className="bg-orange-800 text-white px-2 py-0.5 rounded-full text-[11px]">
              {outOfStockCount}
            </span>
          </span>
        </div>
      </div>

      {/* INFORMATION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Contact Details Card */}
        <div className="bg-white rounded-md border border-gray-200 shadow-xs">
          <div className="bg-[#2b323b] text-white text-xs font-bold px-5 py-3 rounded-t-md flex items-center justify-between">
            <span>CONTACT DETAILS</span>
            <Mail className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-5 space-y-3.5 text-sm">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-4 h-4 text-sky-600" />
              <span>{restaurant?.email || "--"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-4 h-4 text-sky-600" />
              <span>{restaurant?.phone || "--"}</span>
            </div>
            <div className="flex items-start gap-3 text-gray-700">
              <MapPin className="w-4 h-4 text-sky-600 mt-0.5" />
              <span>{addressString}</span>
            </div>
          </div>
        </div>

        {/* Bank & Compliance Card */}
        <div className="bg-white rounded-md border border-gray-200 shadow-xs">
          <div className="bg-[#2b323b] text-white text-xs font-bold px-5 py-3 rounded-t-md flex items-center justify-between">
            <span>BANK & COMPLIANCE</span>
            <Landmark className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-700">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>
                Account No:{" "}
                <strong className="text-gray-900">
                  {restaurant?.bankAccountNumber || "--"}
                </strong>
              </span>
            </div>
            <div className="text-gray-700">
              <span className="text-gray-500">IFSC Code: </span>
              <strong className="text-gray-900">
                {restaurant?.ifscCode || "--"}
              </strong>
            </div>
            <div className="text-gray-700">
              <span className="text-gray-500">FSSAI License: </span>
              <strong className="text-gray-900">
                  {restaurant?.fssaiNumber || "--"}
              </strong>
            </div>
          </div>
        </div>

        {/* Contract Status Card */}
        <div className="bg-white rounded-md border border-gray-200 shadow-xs md:col-span-2">
          <div className="bg-[#2b323b] text-white text-xs font-bold px-5 py-3 rounded-t-md flex items-center justify-between">
            <span>PARTNER CONTRACT STATUS</span>
            <FileCheck className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-5 flex items-center gap-3 text-sm">
            {restaurant?.contract?.accepted ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-emerald-700">
                  Partner Contract Signed & Accepted
                </span>
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-gray-700">
                  Partner Contract Agreement Pending Acceptance
                </span>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}