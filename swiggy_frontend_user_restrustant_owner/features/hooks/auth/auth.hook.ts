"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import { useAuthStore } from "@/features/store/auth.store";

// The server only redirects to /Login when it could not authenticate the
// request, so bouncing straight back can loop: restaurants -> Login ->
// restaurants -> ...
const MAX_LOGIN_ATTEMPTS = 2;
const BOUNCE_WINDOW_MS = 15_000;

// Hook for app/(auth)/Login/page.tsx - drawer state, post-login routing and the
// bounce guard that keeps an unauthenticated redirect from looping.
export function useLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuthStore();

  const getDestination = (role?: string) => {
    if (role === "restaurant_owner") return "/resturant_owner_dashboard";
    if (redirect && redirect.startsWith("/")) return redirect;
    return "/";
  };

  // If already logged in, redirect back to the page that sent us here - but only
  // while the browser still has a refresh token proxy.ts can exchange for an
  // access token, and never more than MAX_LOGIN_ATTEMPTS times in a row.
  useEffect(() => {
    if (!user) return;

    const destination = getDestination(user.role);
    const key = `login-bounce:${destination}`;
    let attempts = 0;

    try {
      const stored = JSON.parse(sessionStorage.getItem(key) || "null");
      // Only rapid bounces count; a later visit starts over.
      if (stored?.at && Date.now() - stored.at < BOUNCE_WINDOW_MS) {
        attempts = stored.attempts || 0;
      }
    } catch {
      attempts = 0;
    }

    const canResume = Boolean(getCookie("refreshtoken")) && attempts < MAX_LOGIN_ATTEMPTS;

    if (!canResume) {
      sessionStorage.removeItem(key);
      toast.error("Session expired. Please log in again.", { id: "session-expired" });
      return;
    }

    try {
      sessionStorage.setItem(key, JSON.stringify({ attempts: attempts + 1, at: Date.now() }));
    } catch {
      // sessionStorage unavailable - push anyway.
    }

    router.push(destination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router, redirect]);

  const handleClose = () => {
    setIsOpen(false);
    // Redirect back to home page when closing the modal/drawer
    router.push("/");
  };

  const handleSwitchToRegister = () => {
    router.push("/Register");
  };

  const handleLoginSuccess = () => {
    setIsOpen(false);
    const latestUser = useAuthStore.getState().user;
    router.push(getDestination(latestUser?.role));
  };

  return {
    isOpen,
    setIsOpen,
    handleClose,
    handleSwitchToRegister,
    handleLoginSuccess,
  };
}

// Hook for app/(auth)/Register/page.tsx - drawer state and the routes between
// registration, login and OTP verification.
export function useRegisterPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    router.push("/");
  };

  const handleSwitchToLogin = () => {
    router.push("/Login");
  };

  const handleSuccess = (userId: string) => {
    // Navigate to OTP verification page passing userId in query params
    router.push(`/otp-verify?userId=${userId}`);
  };

  return {
    isOpen,
    setIsOpen,
    handleClose,
    handleSwitchToLogin,
    handleSuccess,
  };
}

// Hook for app/(auth)/otp-verify/page.tsx - reads the userId the registration
// flow handed over and owns the drawer/close navigation.
export function useOtpVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    // Redirect back to home page when closing the modal/drawer
    router.push("/");
  };

  return {
    userId,
    isOpen,
    setIsOpen,
    handleClose,
  };
}
