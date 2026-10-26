// app/(auth)/Register/page.tsx
"use client";

import RegisterDrawer from "@/features/auth/component/RegisterDrawer";
import { useRegisterPage } from "@/features/hooks/auth/auth.hook";

export default function RegisterPage() {
  const { isOpen, setIsOpen, handleClose, handleSwitchToLogin, handleSuccess } =
    useRegisterPage();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-700">Account Registration</h1>
        <p className="text-sm text-gray-500 mt-1">Please fill in your details to create an account.</p>

        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="mt-4 px-6 py-2.5 bg-[#FF5200] text-white font-bold rounded-lg shadow hover:bg-orange-600 transition"
          >
            Open Register Drawer
          </button>
        )}
      </div>

      <RegisterDrawer
        isOpen={isOpen}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
