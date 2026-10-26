"use client";

import React from "react";
import { Provider } from "react-redux";

import { Toaster } from "sonner";

import { CookiesNextProvider } from "cookies-next";
import { store } from "../store/store";

import { Suspense } from "react";
import AuthToastListener from "@/component/common/AuthToastListener"; // Adjust import path

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider store={store}>
        <CookiesNextProvider>
          <Toaster position="top-right" theme="dark" richColors duration={3000} />

           {/* Suspense wrapper is recommended by Next.js when using useSearchParams */}
        <Suspense fallback={null}>
          <AuthToastListener />
        </Suspense>

          {children}
        </CookiesNextProvider>
      </Provider>
    </>
  );
}
