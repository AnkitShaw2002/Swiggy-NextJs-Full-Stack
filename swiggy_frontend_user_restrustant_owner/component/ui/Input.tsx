// src/components/restaurant-apply/UI/Input.tsx
"use client";

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3.5 text-sm text-gray-900 bg-gray-50/50 border rounded-xl 
            outline-none transition focus:ring-2 focus:bg-white
            ${
              error
                ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            }
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-[11px] font-medium text-red-500">{error}</span>}
        {!error && helperText && (
          <span className="text-[11px] text-gray-400">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";