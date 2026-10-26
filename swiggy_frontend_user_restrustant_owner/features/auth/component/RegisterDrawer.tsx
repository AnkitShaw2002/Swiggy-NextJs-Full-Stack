// features/auth/RegisterDrawer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Eye, EyeOff } from "lucide-react";
import { ShinyButton } from "@/components/ui/shiny-button";

import { RegisterSchema, RegisterFormData } from "@/features/validation/auth.schema";
import { useAuthStore } from "@/features/store/auth.store";

interface RegisterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
  onSuccess?: (userId: string) => void;
}

export default function RegisterDrawer({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSuccess,
}: RegisterDrawerProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register: registerUser, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    clearError();

    try {
      const response = await registerUser(data);

      if (response.status) {
        const userId = response.data?.id;
        if (!userId) {
          throw new Error("Registration succeeded but no user ID was returned.");
        }
        if (onSuccess) {
          onSuccess(userId);
        } else if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      }
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-black transition mb-4"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign up</h2>
              <p className="mt-2 text-sm text-gray-500 font-medium">
                or{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-[#FF5200] font-bold hover:underline"
                >
                  login to your account
                </button>
              </p>
              <div className="w-10 h-0.5 bg-black mt-3"></div>
            </div>

            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center p-2">
              <span className="text-4xl">🍔</span>
            </div>
          </div>

          {/* API Error Alert */}
          {(apiError || error) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">
              {apiError || error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Full Name */}
            <div>
              <div className="border border-gray-300 rounded-lg p-2.5 focus-within:border-black transition">
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  {...register("full_name")}
                  className="w-full mt-0.5 text-sm text-gray-900 focus:outline-none bg-transparent"
                />
              </div>
              {errors.full_name && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <div className="border border-gray-300 rounded-lg p-2.5 focus-within:border-black transition">
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  {...register("email")}
                  className="w-full mt-0.5 text-sm text-gray-900 focus:outline-none bg-transparent"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <div className="border border-gray-300 rounded-lg p-2.5 focus-within:border-black transition">
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="10-digit mobile number"
                  {...register("mobile_Number")}
                  className="w-full mt-0.5 text-sm text-gray-900 focus:outline-none bg-transparent"
                />
              </div>
              {errors.mobile_Number && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.mobile_Number.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <div className="border border-gray-300 rounded-lg p-2.5 focus-within:border-black transition">
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter delivery address"
                  {...register("address")}
                  className="w-full mt-0.5 text-sm text-gray-900 focus:outline-none bg-transparent"
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.address.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="border border-gray-300 rounded-lg p-2.5 focus-within:border-black transition flex items-center justify-between">
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="6-10 characters"
                    {...register("password")}
                    className="w-full mt-0.5 text-sm text-gray-900 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="border border-gray-300 rounded-lg p-2.5 focus-within:border-black transition flex items-center justify-between">
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    {...register("confirm_password")}
                    className="w-full mt-0.5 text-sm text-gray-900 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirm_password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <ShinyButton
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 rounded-lg bg-[#FF5200] hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md border-transparent [&_span]:text-white disabled:opacity-70"
            >
              {isLoading ? "CONTINUE..." : "CONTINUE"}
            </ShinyButton>
          </form>

          {/* Terms Notice */}
          <p className="mt-4 text-[11px] text-gray-500 leading-relaxed font-medium">
            By creating an account, I accept the{" "}
            <Link href="/terms" className="text-gray-800 font-bold hover:underline">
              Terms & Conditions
            </Link>{" "}
            &{" "}
            <Link href="/privacy" className="text-gray-800 font-bold hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  ) : null;
}