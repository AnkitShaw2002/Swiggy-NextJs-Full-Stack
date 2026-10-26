"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ShieldCheck, RefreshCw } from "lucide-react";
import { ShinyButton } from "@/components/ui/shiny-button";

export interface VerifyOtpCardProps {
  email?: string;
  userId?: string;
  onVerify?: (otp: string) => Promise<void>;
  onResend?: () => Promise<void>;
  onBack?: () => void;
  onSuccess?: () => void;
  backUrl?: string;
  loading?: boolean;
  error?: string;
}

const OTP_TTL_SECONDS = 30;

export default function VerifyOtpCard({
  email = "",
  userId = "",
  onVerify,
  onResend,
  onBack,
  onSuccess,
  backUrl,
  loading = false,
  error = "",
}: VerifyOtpCardProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState<number>(OTP_TTL_SECONDS);
  const [resending, setResending] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpExpiresAtRef = useRef<number>(0);

  const targetEmail = email || userId;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Single countdown driven by an absolute deadline - only restartTimer()
  // (after a successful resend) can ever bring it back to 30s.
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

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 6 && !loading) {
      try {
        if (onVerify) {
          await onVerify(otpString);
        }
        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        console.error("OTP verification error:", err);
      }
    }
  };

  const handleResendClick = async () => {
    if (timer > 0 || resending || !onResend) return;

    setResending(true);
    try {
      // Only restart the countdown and clear the boxes once the resend has
      // actually gone through - a failed resend must keep the current state.
      await onResend();
      restartTimer();
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP error:", err);
    } finally {
      setResending(false);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (backUrl) {
      window.location.href = backUrl;
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="bg-white text-gray-900 p-6 sm:p-7 rounded-2xl shadow-2xl w-full max-w-sm shrink-0 border border-gray-100">
      <button
        type="button"
        onClick={handleBackClick}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black mb-4 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to email
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF4500] shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">
            Verify Email
          </h2>
          <p className="text-[11px] text-gray-500 truncate max-w-[200px]">
            OTP sent to{" "}
            <span className="font-semibold text-gray-800">{targetEmail}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 text-xs bg-red-50 text-red-600 rounded-lg border border-red-100 font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-1.5" onPaste={handlePaste}>
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
              disabled={loading}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-11 sm:w-11 sm:h-12 text-center text-lg font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent outline-none transition disabled:opacity-50"
            />
          ))}
        </div>

        <ShinyButton
          type="submit"
          disabled={loading || !isComplete}
          suppressHydrationWarning
          className="w-full py-3 rounded-xl bg-[#FF4500] text-white font-bold text-sm shadow-sm border-transparent [&_span]:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </ShinyButton>

        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
          <span>Didn&apos;t receive code?</span>
          {timer > 0 ? (
            <span className="font-semibold text-gray-400">
              Resend in <span className="text-[#FF4500]">{timer}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendClick}
              disabled={resending}
              className="font-bold text-[#FF4500] hover:underline flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`w-3 h-3 ${resending ? "animate-spin" : ""}`}
              />
              Resend OTP
            </button>
          )}
        </div>
      </form>
    </div>
  );
}