"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  User,
  MapPin,
  Calendar,
  CheckSquare,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Building,
} from "lucide-react";
import {
  contractSchema,
  ContractFormValues,
} from "@/features/validation/restaurantOnboarding.schema";

export interface ContractStepProps {
  initialData?: Partial<ContractFormValues>;
  onBack: () => void;
  onSubmit: (data: ContractFormValues) => Promise<void> | void;
  loading?: boolean;
}

const AGREEMENT_SECTIONS = [
  {
    id: "terms_of_service",
    title: "1. Terms of Service & Platform Usage",
    content:
      "The Restaurant Partner agrees to comply with the operational standards, quality metrics, and order fulfillment guidelines established by the platform.",
  },
  {
    id: "commission_payment_terms",
    title: "2. Commission Structure & Payment Cycles",
    content:
      "A commission percentage will be deducted per completed order. Settlements are processed on a weekly payout cycle directly into the registered bank account.",
  },
  {
    id: "operational_guidelines",
    title: "3. Operational Hours & Order Handling",
    content:
      "The partner must ensure menu accuracy, pricing consistency, and timely preparation of food items upon receiving orders via the partner dashboard.",
  },
  {
    id: "privacy_data_policy",
    title: "4. Privacy & Data Handling Policy",
    content:
      "Customer contact information must be treated as strictly confidential and used solely for the fulfillment of the active order.",
  },
];

export default function ContractStep({
  initialData,
  onBack,
  onSubmit,
  loading = false,
}: ContractStepProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      designation: initialData?.designation || "Owner",
      date: initialData?.date || new Date().toISOString().split("T")[0],
      place: initialData?.place || "",
      declarationAccepted: true as const,
      reviewedSections: initialData?.reviewedSections || [
        "terms_of_service",
        "commission_payment_terms",
        "operational_guidelines",
        "privacy_data_policy",
      ],
    },
  });

  // Re-hydrate state if initialData resolves asynchronously
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        fullName: initialData.fullName || "",
        designation: initialData.designation || "Owner",
        date: initialData.date || new Date().toISOString().split("T")[0],
        place: initialData.place || "",
        declarationAccepted: true as const,
        reviewedSections: initialData.reviewedSections || [
          "terms_of_service",
          "commission_payment_terms",
          "operational_guidelines",
          "privacy_data_policy",
        ],
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: ContractFormValues) => {
    try {
      await onSubmit(data);
    } catch (err) {
      console.error("Contract Step Submission Error:", err);
    }
  };

  const isBusy = isSubmitting || loading;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      {/* Header Info Banner */}
      <div className="flex items-center gap-3 p-4 bg-orange-50/60 border border-orange-100 rounded-xl text-orange-950">
        <ShieldCheck className="w-5 h-5 text-[#fc8019] shrink-0" />
        <div className="text-xs">
          <p className="font-semibold text-sm text-gray-900 mb-0.5">
            Partner Service Agreement
          </p>
          <p className="text-gray-600">
            Please review the terms and complete the authorized signature declaration to complete your onboarding application.
          </p>
        </div>
      </div>

      {/* Contract Terms Box */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Terms & Operational Conditions
          </h3>
        </div>
        <div className="p-4 space-y-4 max-h-56 overflow-y-auto text-xs text-gray-600 divide-y divide-gray-100">
          {AGREEMENT_SECTIONS.map((section) => (
            <div key={section.id} className="pt-3 first:pt-0 space-y-1">
              <h4 className="font-semibold text-gray-800">{section.title}</h4>
              <p className="leading-relaxed text-gray-600">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Authorized Person Details */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-[#fc8019]" />
          Signatory Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Authorized Person Full Name
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="h-4 w-4" />
              </div>
              <input
                {...register("fullName")}
                type="text"
                placeholder="e.g. Rahul Sharma"
                disabled={isBusy}
                aria-invalid={Boolean(errors.fullName)}
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm transition-colors disabled:opacity-50"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Designation */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Designation / Role
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Building className="h-4 w-4" />
              </div>
              <input
                {...register("designation")}
                type="text"
                placeholder="Owner / Managing Director"
                disabled={isBusy}
                aria-invalid={Boolean(errors.designation)}
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm transition-colors disabled:opacity-50"
              />
            </div>
            {errors.designation && (
              <p className="mt-1 text-xs text-red-500">{errors.designation.message}</p>
            )}
          </div>

          {/* Signing Place */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              City / Place of Execution
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <MapPin className="h-4 w-4" />
              </div>
              <input
                {...register("place")}
                type="text"
                placeholder="e.g. Kolkata"
                disabled={isBusy}
                aria-invalid={Boolean(errors.place)}
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm transition-colors disabled:opacity-50"
              />
            </div>
            {errors.place && (
              <p className="mt-1 text-xs text-red-500">{errors.place.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Execution Date
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                {...register("date")}
                type="date"
                disabled={isBusy}
                aria-invalid={Boolean(errors.date)}
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm transition-colors disabled:opacity-50"
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Checkbox Declaration */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <label className="flex items-start gap-3 cursor-pointer">
          <Controller
            name="declarationAccepted"
            control={control}
            render={({ field: { value, onChange, ref } }) => (
              <input
                type="checkbox"
                ref={ref}
                checked={Boolean(value)}
                onChange={(e) => onChange(e.target.checked)}
                disabled={isBusy}
                className="mt-0.5 h-4 w-4 text-[#fc8019] focus:ring-[#fc8019] border-gray-300 rounded cursor-pointer disabled:opacity-50"
              />
            )}
          />
          <span className="text-xs text-gray-700 leading-relaxed">
            I confirm that I am an authorized representative of this restaurant business, and all details provided above are accurate and legally binding under the partner agreement.
          </span>
        </label>
        {errors.declarationAccepted && (
          <p className="mt-1.5 text-xs text-red-500 pl-7">
            {errors.declarationAccepted.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isBusy}
          className="w-1/3 flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition duration-200 disabled:opacity-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="submit"
          disabled={isBusy}
          className="w-2/3 flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#fc8019] hover:bg-[#e06d10] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fc8019] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isBusy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
            </>
          ) : (
            <>
              Accept & Submit Application <CheckSquare className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}