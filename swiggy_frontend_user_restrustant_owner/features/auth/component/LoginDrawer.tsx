// features/auth/LoginDrawer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Eye, EyeOff } from "lucide-react";
import { ShinyButton } from "@/components/ui/shiny-button";

import { LoginSchema, LoginFormData } from "@/features/validation/auth.schema";
import { useAuthStore } from "@/features/store/auth.store";

interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onSuccess?: () => void;
}

export default function LoginDrawer({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSuccess,
}: LoginDrawerProps) {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      const response = await login(data);
      if (response.status) {
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      }
    } catch {
      // Error state is automatically captured in Zustand store (useAuthStore)
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto">
        <div>
          <button 
            onClick={handleClose}
            className="p-1 text-gray-500 hover:text-black transition mb-6"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Login</h2>
              <p className="mt-2 text-sm text-gray-500 font-medium">
                or{" "}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-[#FF5200] font-bold hover:underline"
                >
                  create an account
                </button>
              </p>
              <div className="w-10 h-0.5 bg-black mt-3"></div>
            </div>

            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center p-2">
              <span className="text-4xl">🌯</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="border border-gray-300 rounded-lg p-3 focus-within:border-black transition">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="w-full mt-1 text-base text-gray-900 focus:outline-none bg-transparent"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="border border-gray-300 rounded-lg p-3 focus-within:border-black transition flex items-center justify-between">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className="w-full mt-1 text-base text-gray-900 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            <ShinyButton
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 rounded-lg bg-[#FF5200] hover:bg-orange-600 text-white font-extrabold text-sm uppercase tracking-wider shadow-md border-transparent [&_span]:text-white disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "LOGIN"}
            </ShinyButton>
          </form>

          <p className="mt-4 text-[11px] text-gray-500 leading-relaxed font-medium">
            By clicking on Login, I accept the{" "}
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