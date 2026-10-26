// app/(auth)/Login/page.tsx
"use client";

import LoginDrawer from "@/features/auth/component/LoginDrawer";
import { useLoginPage } from "@/features/hooks/auth/auth.hook";

export default function LoginPage() {
  const {
    isOpen,
    setIsOpen,
    handleClose,
    handleSwitchToRegister,
    handleLoginSuccess,
  } = useLoginPage();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Background landing content preview */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-700">Authentication Portal</h1>
        <p className="text-sm text-gray-500 mt-1">Please sign in using the drawer to continue.</p>

        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="mt-4 px-6 py-2.5 bg-[#FF5200] text-white font-bold rounded-lg shadow hover:bg-orange-600 transition"
          >
            Open Login Drawer
          </button>
        )}
      </div>

      {/* Login Side Drawer */}
      <LoginDrawer
        isOpen={isOpen}
        onClose={handleClose}
        onSwitchToRegister={handleSwitchToRegister}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
