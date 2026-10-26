import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import axiosInstance, {
  markSignedIn,
  markSignedOut,
} from "@/services/axios/axiosInstance";
import { endpoints } from "@/services/endpoints/endpoints";
import {
  AuthState,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
} from "@/features/typescript/auth.type";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { toast } from "sonner";
import {
  useNotificationStore,
  notificationScopeFor,
} from "@/features/store/notification.store";
import { useRestaurantStore } from "@/features/store/restaurantOwner.store";
import { useUserStore } from "@/features/store/user.store";

// Refresh tokens are valid for 7 days on the backend (see proxy.ts) - the
// cookie has to outlive the 15 minute access token or the server has nothing
// left to authenticate SSR with and users get bounced to /Login.
const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;




const getResponseUser = (data: AuthResponse["data"]) => {
  if (!data) return null;
  if (data.user) return data.user;
  if (data.id && data.email && data.role) {
    return {
      id: String(data.id),
      name: data.name,
      email: data.email,
      role: data.role,
      isVerified: data.is_verified,
    };
  }
  return null;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      (!error.response
        ? "Unable to reach the server. Start the backend on port 4000."
        : fallback)
    );
  }
  return error instanceof Error ? error.message : fallback;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),

      clearError: () => set({ error: null }),

      // 1. REGISTER
      register: async (payload: RegisterPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post<AuthResponse>(
            endpoints.auth.register,
            payload
          );
          set({ isLoading: false });
          toast.success(response.data?.message || "OTP sent to your email");
          return response.data;
        } catch (err: unknown) {
          const errorMessage = getErrorMessage(err, "Registration failed");
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      },

      // 2. VERIFY OTP
      verifyOtp: async (payload: VerifyOtpPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post<AuthResponse>(
            endpoints.auth.otp,
            payload
          );
          const data = response.data;

          const user = getResponseUser(data.data);


          const token = data.accessToken || data.data?.accessToken || null;
          const refreshToken= data.refreshToken || data.data?.refreshToken || null;
          if (token) {
            if (typeof window !== "undefined") {
              setCookie("token", token, {
                maxAge: 60 * 15,
                path: "/",
                sameSite: "lax",
              });
              setCookie("refreshtoken", refreshToken, {
                maxAge: REFRESH_COOKIE_MAX_AGE,
                path: "/",
                sameSite: "lax",
              });
              if (user?.role) {
                setCookie("role", user.role, {
                  maxAge: REFRESH_COOKIE_MAX_AGE,
                  path: "/",
                  sameSite: "lax",
                });
              }
            }
          }

          if (user && token) {
            // Fresh session: drop the previous account's owner data and move
            // the notification bell to this account.
            useRestaurantStore.getState().reset();
            useNotificationStore
              .getState()
              .switchScope(notificationScopeFor(user));
            set({ user, token, isLoading: false });
          } else {
            set({ isLoading: false });
          }

          markSignedIn();
          toast.success("OTP verified successfully!");
          return data;
        } catch (err: unknown) {
          const errorMessage = getErrorMessage(err, "OTP verification failed");
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      },

      // 3. LOGIN
      login: async (credentials: LoginPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post<AuthResponse>(
            endpoints.auth.login,
            credentials
          );
          const data = response.data;

          const user = getResponseUser(data.data);
          const token = data.accessToken || data.data?.accessToken || null;
          const refreshToken= data.refreshToken || data.data?.refreshToken || null;

          if (token) {
            if (typeof window !== "undefined") {
              setCookie("token", token, {
                maxAge: 60 * 15,
                path: "/",
                sameSite: "lax",
              });

              setCookie("refreshtoken", refreshToken, {
                maxAge: REFRESH_COOKIE_MAX_AGE,
                path: "/",
                sameSite: "lax",
              });

              if (user?.role) {
                setCookie("role", user.role, {
                  maxAge: REFRESH_COOKIE_MAX_AGE,
                  path: "/",
                  sameSite: "lax",
                });
              }
            }
          }

          if (token && user) {
            // Fresh session: drop the previous account's owner data and move
            // the notification bell to this account.
            useRestaurantStore.getState().reset();
            useNotificationStore
              .getState()
              .switchScope(notificationScopeFor(user));
            set({ user, token, isLoading: false });
          } else {
            set({ isLoading: false });
          }

          markSignedIn();
          toast.success(`Welcome back${user?.name ? `, ${user.name}` : ""}!`);
          return data;
        } catch (err: unknown) {
          const errorMessage = getErrorMessage(err, "Login failed");
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      },

      // 4. LOGOUT
      logout: () => {
        // Revoke the server session FIRST. The httpOnly `refreshToken` cookie
        // is written by the backend and cannot be deleted from JS, so without
        // POST /auth/logout proxy.ts keeps minting access tokens and guests
        // would still be able to open protected pages. Raw axios (not
        // axiosInstance) so the refresh interceptor can never resurrect the
        // session we are tearing down.
        const accessToken = getCookie("token");
        axios
          .post(endpoints.auth.logout, null, {
            withCredentials: true,
            headers: accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : undefined,
          })
          .catch(() => {});

        // Signing out is deliberate: any request still in flight must fail
        // quietly instead of reporting a dead session.
        markSignedOut();
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
          deleteCookie("token");
          deleteCookie("refreshtoken");
          deleteCookie("role");
        }
        // Clear everything scoped to this account so the next login on this
        // browser never inherits the previous user's/owner's data.
        useRestaurantStore.getState().reset();
        useUserStore.getState().reset();
        useNotificationStore.getState().switchScope(null);
        set({ user: null, token: null, error: null });
        // Drop a "session expired" toast that may still be on screen.
        toast.dismiss("session-expired");
        toast.success("Logged out successfully");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);