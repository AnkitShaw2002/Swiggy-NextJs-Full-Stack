"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, ArrowRight } from "lucide-react";

interface InformationalSectionProps {
  onShowInterestClick?: () => void;
}

const STEPS = [
  {
    stepNumber: 1,
    title: 'Click on "Show Interest"',
    description: "Start your onboarding process in under a minute.",
  },
  {
    stepNumber: 2,
    title: "Enter restaurant details & contact info",
    description: "Provide basic information about your business location.",
  },
  {
    stepNumber: 3,
    title: "An Executive will reach out to you shortly!",
    description: "Our partner team will guide you through contract signing.",
  },
];

const DOCUMENTS = [
  {
    label: "FSSAI License copy",
    linkText: "Apply Here",
    href: "https://fotscos.fssai.gov.in/",
  },
  {
    label: "Your Restaurant menu",
  },
  {
    label: "Bank details & canceled cheque",
  },
  {
    label: "GSTIN registration",
    linkText: "Apply Here",
    href: "https://www.gst.gov.in/",
  },
  {
    label: "PAN card copy",
  },
];

export default function InformationalSection({
  onShowInterestClick,
}: InformationalSectionProps) {
  const handleScrollToTop = () => {
    if (onShowInterestClick) {
      onShowInterestClick();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Container: Step-by-Step Guide */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold text-[#fc8019] uppercase tracking-wider">
            In just 3 easy steps
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1 mb-6">
            Get your restaurant discovered by millions of diners
          </h3>

          <div className="relative pl-4 space-y-6 before:absolute before:left-[23px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-100">
            {STEPS.map((step) => (
              <div key={step.stepNumber} className="relative flex gap-4 items-start group">
                <div className="w-5 h-5 rounded-full bg-orange-100 text-[#fc8019] ring-4 ring-white flex items-center justify-center font-bold text-xs shrink-0 z-10 group-hover:bg-[#fc8019] group-hover:text-white transition-colors">
                  {step.stepNumber}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#fc8019] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action CTA Button */}
        <div className="mt-8 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={handleScrollToTop}
            className="w-full py-3.5 bg-[#fc8019] hover:bg-[#e06d10] text-white font-bold rounded-xl shadow-md transition duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            Show interest, I want to list restaurant <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Container: Required Documents Checklist */}
      <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Required Documents
          </h3>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Keep these documents ready to ensure a smooth and quick form filling process:
          </p>

          <ul className="space-y-3">
            {DOCUMENTS.map((doc, index) => {
              const isLast = index === DOCUMENTS.length - 1;
              return (
                <li
                  key={doc.label}
                  className={`flex items-center justify-between text-xs font-medium text-gray-700 ${
                    !isLast ? "border-b border-gray-100 pb-3" : ""
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {doc.label}
                  </span>
                  {doc.href && (
                    <Link
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#fc8019] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      {doc.linkText} <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6 p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 text-center">
          Need help with documentation? Reach out to support after submitting your interest.
        </div>
      </div>
    </div>
  );
}