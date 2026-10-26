"use client";

import Navbar from "@/component/layout/navbar/navbar";
import React from "react";

interface ApplyLayoutProps {
  children: React.ReactNode;
}

export default function ApplyLayout({ children }: ApplyLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex flex-col font-sans antialiased text-gray-900">
      {/* Optional top layout header */}
      <header className="w-full bg-white border-b border-gray-100 py-4 px-6 sm:px-12 lg:px-20">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Partner Registration
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Complete your onboarding steps to register and manage your restaurant.
        </p>
      </header>

      {/* Main container stretching edge-to-edge */}
      <main className="w-full flex-1">
         {/* <Navbar /> */}
        {children}
      </main>
    </div>
  );
}