"use client";

import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

interface ApplyRestaurantHeroProps {
  userEmail: string;
  onSubmit: (email: string) => void;
  loading: boolean;
  error?: string;
}

export default function ApplyRestaurantHero({
  userEmail, // This comes prop comes from parent component which should handle getting the email
  onSubmit,
  loading,
  error,
}: ApplyRestaurantHeroProps) {
  const [inputValue, setInputValue] = useState(userEmail || "");

  // Update input value if userEmail prop changes
  useEffect(() => {
    setInputValue(userEmail || "");
  }, [userEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
    }
  };

  return (
    <div className="bg-white text-gray-900 p-6 sm:p-7 rounded-2xl shadow-2xl w-full max-w-sm shrink-0">
        <h2 className="text-xl font-bold text-gray-950 mb-1">
          <AnimatedShinyText className="mx-0 max-w-none text-gray-950/80 dark:text-gray-950/80">
            Get Started
          </AnimatedShinyText>
        </h2>
      <p className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        Enter a mobile number or restaurant ID to continue
        <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Restaurant ID / Mobile number"
            suppressHydrationWarning={true}
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition"
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          suppressHydrationWarning={true}
          style={{ backgroundColor: "#FF4500" }}
          className="w-full py-3.5 text-white font-bold text-sm rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </form>

      <p className="text-[10px] text-gray-400 text-center mt-3">
        By logging in, I agree to Jubilant&apos;s{" "}
        <span className="underline cursor-pointer">terms & conditions</span>
      </p>
    </div>
  );
}