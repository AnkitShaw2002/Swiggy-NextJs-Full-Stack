"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useSuccessPage } from "@/features/hooks/owner/owner.hook";

export default function SuccessPage() {
  const { handleBackHome } = useSuccessPage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Application Submitted!
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your restaurant registration has been submitted successfully. Our
            team will review your application and get back to you shortly.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-700 text-xs font-medium">
            Please wait for admin approval. You will receive a notification once
            your account is activated.
          </p>
        </div>

        <button
          onClick={handleBackHome}
          className="w-full bg-[#FF4500] hover:bg-[#e63e00] text-white font-semibold py-3 px-6 rounded-xl transition-colors cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
