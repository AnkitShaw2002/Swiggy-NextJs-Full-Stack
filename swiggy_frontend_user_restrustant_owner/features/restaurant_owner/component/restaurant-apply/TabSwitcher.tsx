// src/components/restaurant-apply/TabSwitcher.tsx
"use client";

import React from "react";

export type TabOption = "delivery" | "dineout";

interface TabSwitcherProps {
  activeTab: TabOption;
  onChange: (tab: TabOption) => void;
}

export default function TabSwitcher({ activeTab, onChange }: TabSwitcherProps) {
  return (
    <div className="flex justify-start mb-8">
      <div 
        role="tablist"
        aria-label="Restaurant partnership type"
        className="inline-flex p-1.5 bg-gray-200/80 rounded-full border border-gray-300/40 backdrop-blur-sm"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "delivery"}
          onClick={() => onChange("delivery")}
          style={{
            backgroundColor: activeTab === "delivery" ? "#FF4500" : "transparent",
          }}
          className={`px-8 py-2.5 text-sm font-bold rounded-full transition-all duration-200 focus:outline-none cursor-pointer ${
            activeTab === "delivery"
              ? "text-white shadow-md scale-100"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          Food Delivery
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "dineout"}
          onClick={() => onChange("dineout")}
          style={{
            backgroundColor: activeTab === "dineout" ? "#FF4500" : "transparent",
          }}
          className={`px-8 py-2.5 text-sm font-bold rounded-full transition-all duration-200 focus:outline-none cursor-pointer ${
            activeTab === "dineout"
              ? "text-white shadow-md scale-100"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          Dineout
        </button>
      </div>
    </div>
  );
}