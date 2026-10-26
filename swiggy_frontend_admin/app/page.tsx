"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/features/validation/authSchema";
import { userSignin } from "@/features/redux-toolkit/slice/authSlice";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      setLoading(true);

      const result = await dispatch(userSignin(data) as any);

      if (userSignin.fulfilled.match(result)) {
        router.push("/restaurantlist");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#FAF7F2] text-[#1A1A1A] lg:grid lg:grid-cols-[1.2fr_1fr]">
      {/* Left Panel: Branding & Value Proposition */}
      <section className="relative hidden overflow-hidden bg-[#1E1E1E] text-[#FAF7F2] lg:flex lg:flex-col lg:justify-between lg:p-16">
        {/* Subtle Background Pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #FAF7F2 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Top Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FC8019] font-display text-xl font-extrabold text-[#1E1E1E] shadow-lg shadow-[#FC8019]/20">
              S
            </span>
            <span className="font-display text-2xl font-bold tracking-tight">
              swiggy <span className="font-semibold text-[#FC8019]">admin</span>
            </span>
          </div>
        </div>

        {/* Center Hero Copy */}
        <div className="relative z-10 max-w-lg my-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs font-medium text-[#FC8019] mb-6 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#FC8019] animate-pulse" />
            Operations Control Console
          </div>
          
          <h2 className="font-display text-4xl font-extrabold leading-[1.15] tracking-tight">
            Every order, partner and outlet — tracked from one console.
          </h2>

          <p className="mt-5 text-base text-[#FAF7F2]/70 leading-relaxed">
            Sign in securely with your admin credentials to manage live orders,
            restaurant onboarding, delivery partners, and financial payouts.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#FAF7F2]/40 pt-6 border-t border-white/10">
          <span>Secure Enterprise Access</span>
          <span>v4.2.0-prod</span>
        </div>
      </section>

      {/* Right Panel: Login Form */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white lg:bg-[#FAF7F2]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FC8019] font-display text-xl font-extrabold text-[#1E1E1E]">
              S
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-[#1E1E1E]">
              swiggy <span className="font-semibold text-[#FC8019]">admin</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#1E1E1E]">
              Sign in to Admin
            </h1>
            <p className="text-sm text-gray-500">
              Use the work email and password issued by your operations lead.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
            suppressHydrationWarning
          >
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#1E1E1E]"
              >
                Work Email
              </label>

              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="you@swiggy.in"
                  suppressHydrationWarning
                  {...register("email")}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-[#1E1E1E] outline-none transition-all shadow-sm ${
                    errors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-[#FC8019] focus:ring-4 focus:ring-[#FC8019]/10"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#1E1E1E]"
                >
                  Password
                </label>

                <button
                  type="button"
                  suppressHydrationWarning
                  className="text-xs font-semibold text-[#FC8019] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  suppressHydrationWarning
                  {...register("password")}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-14 text-sm text-[#1E1E1E] outline-none transition-all shadow-sm ${
                    errors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-[#FC8019] focus:ring-4 focus:ring-[#FC8019]/10"
                  }`}
                />

                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-xs font-semibold text-gray-500 hover:text-[#1E1E1E] transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  suppressHydrationWarning
                  className="h-4 w-4 rounded border-gray-300 text-[#FC8019] focus:ring-[#FC8019]"
                />
                Keep me signed in on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="w-full mt-2 flex items-center justify-center rounded-xl bg-[#FC8019] py-3.5 text-sm font-bold text-[#1E1E1E] shadow-md shadow-[#FC8019]/25 transition-all hover:bg-[#e06e12] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#1E1E1E]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In to Console"
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 text-xs text-gray-500">
            <svg className="w-4 h-4 text-[#FC8019] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>All sign-ins are logged securely for compliance and auditing.</span>
          </div>

          {/* Support / Help footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            Need access? Ask your account owner to invite you from{" "}
            <span className="font-semibold text-[#1E1E1E]">Team Settings</span>.
          </p>
        </div>
      </section>
    </main>
  );
}