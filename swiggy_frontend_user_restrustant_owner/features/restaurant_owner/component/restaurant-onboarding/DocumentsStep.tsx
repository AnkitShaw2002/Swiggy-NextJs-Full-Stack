"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  CreditCard,
  Building,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import {
  documentsSchema,
  DocumentsFormValues,
} from "@/features/validation/restaurantOnboarding.schema";

export interface DocumentsStepProps {
  initialData?: Partial<DocumentsFormValues>;
  onNext: (data: DocumentsFormValues) => Promise<void> | void;
  onBack: () => void;
  loading?: boolean;
}

export default function DocumentsStep({
  initialData,
  onNext,
  onBack,
  loading = false,
}: DocumentsStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocumentsFormValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      outletType: initialData?.outletType || "Restaurant",
      pan: initialData?.pan || "",
      gstin: initialData?.gstin || "",
      ifscCode: initialData?.ifscCode || "",
      bankAccountNumber: initialData?.bankAccountNumber || "",
      fssaiNumber: initialData?.fssaiNumber || "",
    },
  });

  // Synchronize state when initialData updates asynchronously
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        outletType: initialData.outletType || "Restaurant",
        pan: initialData.pan || "",
        gstin: initialData.gstin || "",
        ifscCode: initialData.ifscCode || "",
        bankAccountNumber: initialData.bankAccountNumber || "",
        fssaiNumber: initialData.fssaiNumber || "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: DocumentsFormValues) => {
    try {
      await onNext(data);
    } catch (err) {
      console.error("Documents Step Submission Error:", err);
    }
  };

  const isFormBusy = isSubmitting || loading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Outlet Type Selection */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Outlet Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { id: "Restaurant", label: "Restaurant" },
            { id: "Cloud Kitchen", label: "Cloud Kitchen" },
            { id: "Cafe", label: "Cafe" },
            { id: "Bakery", label: "Bakery" },
            { id: "Sweet Shop", label: "Sweet Shop" },
          ].map((type) => (
            <label
              key={type.id}
              className="relative flex items-center justify-center p-3 border rounded-xl cursor-pointer text-xs font-medium hover:bg-gray-50 has-[:checked]:border-[#fc8019] has-[:checked]:bg-orange-50/30 transition"
            >
              <input
                {...register("outletType")}
                type="radio"
                value={type.id}
                className="sr-only"
                disabled={isFormBusy}
              />
              <span className="text-gray-800">{type.label}</span>
            </label>
          ))}
        </div>
        {errors.outletType && (
          <p className="mt-1 text-xs text-red-500">
            {errors.outletType.message}
          </p>
        )}
      </div>

      {/* PAN & GSTIN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            PAN Card Number
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <CreditCard className="h-4 w-4" />
            </div>
            <input
              {...register("pan")}
              type="text"
              maxLength={10}
              placeholder="ABCDE1234F"
              disabled={isFormBusy}
              aria-invalid={Boolean(errors.pan)}
              onChange={(e) =>
                setValue("pan", e.target.value.toUpperCase(), {
                  shouldValidate: true,
                })
              }
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm uppercase transition-colors disabled:opacity-50"
            />
          </div>
          {errors.pan && (
            <p className="mt-1 text-xs text-red-500">{errors.pan.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            GSTIN Number <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FileText className="h-4 w-4" />
            </div>
            <input
              {...register("gstin")}
              type="text"
              maxLength={15}
              placeholder="19ABCDE1234F1Z5"
              disabled={isFormBusy}
              aria-invalid={Boolean(errors.gstin)}
              onChange={(e) =>
                setValue("gstin", e.target.value.toUpperCase(), {
                  shouldValidate: true,
                })
              }
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm uppercase transition-colors disabled:opacity-50"
            />
          </div>
          {errors.gstin && (
            <p className="mt-1 text-xs text-red-500">{errors.gstin.message}</p>
          )}
        </div>
      </div>

      {/* Banking Information */}
      <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
          <Building className="w-4 h-4 text-[#fc8019]" />
          Bank Details for Payouts
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Bank Account Number
            </label>
            <input
              {...register("bankAccountNumber")}
              type="text"
              maxLength={18}
              placeholder="918010023456789"
              disabled={isFormBusy}
              aria-invalid={Boolean(errors.bankAccountNumber)}
              className="block w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] text-sm transition-colors disabled:opacity-50"
            />
            {errors.bankAccountNumber && (
              <p className="mt-1 text-xs text-red-500">
                {errors.bankAccountNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              IFSC Code
            </label>
            <input
              {...register("ifscCode")}
              type="text"
              maxLength={11}
              placeholder="SBIN0001234"
              disabled={isFormBusy}
              aria-invalid={Boolean(errors.ifscCode)}
              onChange={(e) =>
                setValue("ifscCode", e.target.value.toUpperCase(), {
                  shouldValidate: true,
                })
              }
              className="block w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] text-sm uppercase transition-colors disabled:opacity-50"
            />
            {errors.ifscCode && (
              <p className="mt-1 text-xs text-red-500">
                {errors.ifscCode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* FSSAI License */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          FSSAI Registration License Number
        </label>
        <div className="relative rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <input
            {...register("fssaiNumber")}
            type="text"
            maxLength={14}
            placeholder="14-digit FSSAI Number"
            disabled={isFormBusy}
            aria-invalid={Boolean(errors.fssaiNumber)}
            className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm transition-colors disabled:opacity-50"
          />
        </div>
        {errors.fssaiNumber && (
          <p className="mt-1 text-xs text-red-500">
            {errors.fssaiNumber.message}
          </p>
        )}
      </div>

      {/* Notice Callout */}
      <div className="flex gap-2.5 p-3.5 bg-orange-50/50 border border-orange-100 rounded-xl text-xs text-orange-800">
        <ShieldAlert className="w-4 h-4 text-[#fc8019] shrink-0 mt-0.5" />
        <p>
          Ensure all legal documentation matches the registered business owner's identity to avoid delay in application verification.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isFormBusy}
          className="w-1/3 flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition duration-200 disabled:opacity-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="submit"
          disabled={isFormBusy}
          className="w-2/3 flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#fc8019] hover:bg-[#e06d10] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fc8019] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isFormBusy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              Save & Proceed <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}