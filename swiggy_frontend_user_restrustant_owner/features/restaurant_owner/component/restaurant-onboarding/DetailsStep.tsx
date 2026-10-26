"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  basicDetailsSchema,
  BasicDetailsFormValues,
} from "@/features/validation/restaurantOnboarding.schema";

interface DetailsStepProps {
  initialData?: Partial<BasicDetailsFormValues>;
  onNext: (data: BasicDetailsFormValues) => void;
  loading?: boolean;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function DetailsStep({
  initialData,
  onNext,
  loading = false,
}: DetailsStepProps) {
  const defaultLocation =
    typeof initialData?.location === "object" && initialData?.location !== null
      ? initialData.location
      : { address: "", city: "", state: "", pincode: "" };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BasicDetailsFormValues>({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      ownerName: initialData?.ownerName || "",
      restaurantName: initialData?.restaurantName || "",
      location: defaultLocation,
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      whatsappNumber: initialData?.whatsappNumber || "",
      workingDays: initialData?.workingDays || [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      openingClosing: {
        open: initialData?.openingClosing?.open || "09:00",
        close: initialData?.openingClosing?.close || "23:00",
      },
    },
  });

  const selectedDays = watch("workingDays") || [];

  // Helper type-cast for union field errors on location
  const locationErrors = errors.location as
    | {
        address?: { message?: string };
        city?: { message?: string };
        state?: { message?: string };
        pincode?: { message?: string };
        message?: string;
      }
    | undefined;

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setValue(
        "workingDays",
        selectedDays.filter((d) => d !== day),
        { shouldValidate: true }
      );
    } else {
      setValue("workingDays", [...selectedDays, day], { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
          Basic Information
        </h3>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Owner Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("ownerName")}
            placeholder="Full Name of Primary Owner"
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          {errors.ownerName && (
            <p className="mt-1 text-xs text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Restaurant Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("restaurantName")}
            placeholder="Official Business Name"
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          {errors.restaurantName && (
            <p className="mt-1 text-xs text-red-500">{errors.restaurantName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Business Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="owner@restaurant.com"
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Location Details */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
          Address & Location
        </h3>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("location.address" as any)}
            placeholder="Shop No., Street Name, Area"
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          {locationErrors?.address?.message && (
            <p className="mt-1 text-xs text-red-500">
              {locationErrors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("location.city" as any)}
              placeholder="City"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {locationErrors?.city?.message && (
              <p className="mt-1 text-xs text-red-500">
                {locationErrors.city.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("location.state" as any)}
              placeholder="State"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {locationErrors?.state?.message && (
              <p className="mt-1 text-xs text-red-500">
                {locationErrors.state.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("location.pincode" as any)}
              placeholder="6-digit Pincode"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {locationErrors?.pincode?.message && (
              <p className="mt-1 text-xs text-red-500">
                {locationErrors.pincode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
          Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Primary Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("phone")}
              placeholder="10-digit Mobile Number"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              WhatsApp Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("whatsappNumber")}
              placeholder="10-digit WhatsApp Number"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {errors.whatsappNumber && (
              <p className="mt-1 text-xs text-red-500">
                {errors.whatsappNumber.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
          Operating Schedule
        </h3>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">
            Working Days <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                    isSelected
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          {errors.workingDays && (
            <p className="mt-1 text-xs text-red-500">
              {errors.workingDays.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Opening Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              {...register("openingClosing.open")}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
            />
            {errors.openingClosing?.open && (
              <p className="mt-1 text-xs text-red-500">
                {errors.openingClosing.open.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Closing Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              {...register("openingClosing.close")}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
            />
            {errors.openingClosing?.close && (
              <p className="mt-1 text-xs text-red-500">
                {errors.openingClosing.close.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />} Save & Proceed to Documents
      </button>
    </form>
  );
}