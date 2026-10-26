// components/auth/VerifyOtpCard.tsx
"use client";

import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";
import { X, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/store/auth.store";

const OTP_TTL_SECONDS = 120;

interface VerifyOtpCardProps {
  isOpen: boolean;
  onClose: () => void;


  userId: string;
  onSuccess?: () => void;
  redirectTo?: string;
  backUrl?: string;
}

export function VerifyOtpCard({
  isOpen,
  onClose,


  userId,
  onSuccess,
  redirectTo = "/Login",
  backUrl = "/Login",
}: VerifyOtpCardProps) {
  const router = useRouter();
  const { verifyOtp, clearError, error } = useAuthStore();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState<number>(OTP_TTL_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpExpiresAtRef = useRef<number>(0);

  // Single countdown driven by an absolute deadline: re-renders and failed
  // verifications can never restart it - only restartTimer() below can.
  useEffect(() => {
    otpExpiresAtRef.current = Date.now() + OTP_TTL_SECONDS * 1000;

    const tick = () => {
      setTimer(
        Math.max(0, Math.ceil((otpExpiresAtRef.current - Date.now()) / 1000))
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const restartTimer = () => {
    otpExpiresAtRef.current = Date.now() + OTP_TTL_SECONDS * 1000;
    setTimer(OTP_TTL_SECONDS);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasteData)) return;

    const digits = pasteData.slice(0, 6).split("");
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = digit;
      }
    });
    setOtp(newOtp);

    const focusIndex = Math.min(digits.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6 || !userId) return;

    setIsSubmitting(true);
    clearError();
    try {
      const response = await verifyOtp({ userId, otp: otpValue });
      if (response.status) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "";

      // The backend deletes the expired OTP and emails a brand new one when an
      // expired code is submitted, so the countdown has to restart from 60 and
      // the old digits must not stay in the boxes.
      if (message.toLowerCase().includes("otp expired")) {
        restartTimer();
        setOtp(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }

      setIsSubmitting(false);
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
          <div className="mb-6">
            <Link
              href={backUrl}
              className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-black transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-orange-50 text-[#fc8019] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Verify OTP
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter the 6-digit verification code sent to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="text-sm font-medium text-red-600 text-center">{error}</p>
            )}
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onChangeCapture={clearError}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#fc8019] focus:border-[#fc8019] outline-none transition bg-white"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={otp.join("").length < 6 || isSubmitting}
              className="w-full py-3.5 px-4 bg-[#fc8019] hover:bg-[#e26f12] text-white font-bold rounded-2xl shadow-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? "Verifying..." : "Verify & Proceed"}
            </button>
          </form>

          {timer > 0 ? (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Code valid for{" "}
                <span className="font-semibold text-gray-800">
                  {/* 00:{timer < 10 ? `0${timer}` : timer} */}
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
                </span>
              </p>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                OTP expired. Verify again to get a new code on your email.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}