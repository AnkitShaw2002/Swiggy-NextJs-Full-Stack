// app/(auth)/otp-verify/page.tsx
"use client";

import Link from "next/link";
import { VerifyOtpCard } from "@/features/auth/component/VerifyOtpCard";
import { useOtpVerifyPage } from "@/features/hooks/auth/auth.hook";

export default function VerifyOtp() {
  const { userId, isOpen, handleClose } = useOtpVerifyPage();

  return userId ? (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <VerifyOtpCard isOpen={isOpen} onClose={handleClose} userId={userId} />
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-2xl shadow border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">User ID Missing</h2>
        <p className="text-sm text-gray-500">
          No active verification request found. Please log in or register again to obtain a verification code.
        </p>
        <div className="pt-2">
          <Link
            href="/register"
            className="inline-block px-6 py-2.5 bg-[#FF5200] text-white font-medium rounded-xl hover:bg-[#e04800] transition"
          >
            Go to Registration
          </Link>
        </div>
      </div>
    </div>
  );
}
