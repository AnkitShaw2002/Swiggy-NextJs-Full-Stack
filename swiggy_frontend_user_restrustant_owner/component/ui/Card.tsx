// src/components/restaurant-apply/UI/Card.tsx
"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "none";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
}) => {
  const paddings = {
    none: "p-0",
    sm: "p-4 sm:p-5",
    md: "p-6 sm:p-8",
    lg: "p-8 sm:p-10",
  };

  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-100 shadow-sm
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};