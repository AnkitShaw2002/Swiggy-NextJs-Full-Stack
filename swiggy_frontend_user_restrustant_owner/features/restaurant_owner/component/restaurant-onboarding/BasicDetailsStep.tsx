"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Store,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  basicDetailsSchema,
  BasicDetailsFormValues,
} from "@/features/validation/restaurantOnboarding.schema";

interface BasicDetailsStepProps {
  initialData?: Partial<BasicDetailsFormValues>;
  onNext: (data: BasicDetailsFormValues) => void;
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

export default function BasicDetailsStep({
  initialData,
  onNext,
}: BasicDetailsStepProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BasicDetailsFormValues>({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      ownerName: initialData?.ownerName || "",
      restaurantName: initialData?.restaurantName || "",
      location: {
        address: initialData?.location?.address || "",
        city: initialData?.location?.city || "",
        state: initialData?.location?.state || "",
        pincode: initialData?.location?.pincode || "",
      },
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
      ],
      openingClosing: {
        open: initialData?.openingClosing?.open || "09:00",
        close: initialData?.openingClosing?.close || "22:00",
      },
    },
  });

  // Sync state cleanly if async data populates after mount
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        ownerName: initialData.ownerName || "",
        restaurantName: initialData.restaurantName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        whatsappNumber: initialData.whatsappNumber || "",
        workingDays: initialData.workingDays || [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        location: {
          address: initialData.location?.address || "",
          city: initialData.location?.city || "",
          state: initialData.location?.state || "",
          pincode: initialData.location?.pincode || "",
        },
        openingClosing: {
          open: initialData.openingClosing?.open || "09:00",
          close: initialData.openingClosing?.close || "22:00",
        },
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: BasicDetailsFormValues) => {
    try {
      await onNext(data);
    } catch (err) {
      console.error("Step 1 Submission Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Owner & Restaurant Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Owner Name
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <User className="h-4 w-4" />
            </div>
            <input
              {...register("ownerName")}
              type="text"
              placeholder="John Doe"
              aria-invalid={Boolean(errors.ownerName)}
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm transition-colors"
            />
          </div>
          {errors.ownerName && (
            <p className="mt-1 text-xs text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Restaurant Name
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Store className="h-4 w-4" />
            </div>
            <input
              {...register("restaurantName")}
              type="text"
              placeholder="Tasty Bites"
              aria-invalid={Boolean(errors.restaurantName)}
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm transition-colors"
            />
          </div>
          {errors.restaurantName && (
            <p className="mt-1 text-xs text-red-500">{errors.restaurantName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Mail className="h-4 w-4" />
          </div>
          <input
            {...register("email")}
            type="email"
            placeholder="owner@restaurant.com"
            aria-invalid={Boolean(errors.email)}
            className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm transition-colors"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Phone & WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Phone className="h-4 w-4" />
            </div>
            <input
              {...register("phone")}
              type="tel"
              maxLength={10}
              placeholder="9876543210"
              aria-invalid={Boolean(errors.phone)}
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm transition-colors"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            WhatsApp Number
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <input
              {...register("whatsappNumber")}
              type="tel"
              maxLength={10}
              placeholder="9876543210"
              aria-invalid={Boolean(errors.whatsappNumber)}
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm transition-colors"
            />
          </div>
          {errors.whatsappNumber && (
            <p className="mt-1 text-xs text-red-500">
              {errors.whatsappNumber.message}
            </p>
          )}
        </div>
      </div>

      {/* Location Details */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Street Address
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <MapPin className="h-4 w-4" />
            </div>
            <input
              {...register("location.address")}
              type="text"
              placeholder="123 Main Street, Sector 5"
              aria-invalid={Boolean(errors.location?.address)}
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] focus:bg-white text-sm transition-colors"
            />
          </div>
          {errors.location?.address && (
            <p className="mt-1 text-xs text-red-500">
              {errors.location.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              City
            </label>
            <input
              {...register("location.city")}
              type="text"
              placeholder="Kolkata"
              aria-invalid={Boolean(errors.location?.city)}
              className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] text-sm transition-colors"
            />
            {errors.location?.city && (
              <p className="mt-1 text-xs text-red-500">
                {errors.location.city.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              State
            </label>
            <input
              {...register("location.state")}
              type="text"
              placeholder="West Bengal"
              aria-invalid={Boolean(errors.location?.state)}
              className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] text-sm transition-colors"
            />
            {errors.location?.state && (
              <p className="mt-1 text-xs text-red-500">
                {errors.location.state.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Pincode
            </label>
            <input
              {...register("location.pincode")}
              type="text"
              maxLength={6}
              placeholder="700001"
              aria-invalid={Boolean(errors.location?.pincode)}
              className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] text-sm transition-colors"
            />
            {errors.location?.pincode && (
              <p className="mt-1 text-xs text-red-500">
                {errors.location.pincode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Working Days */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Working Days
        </label>
        <Controller
          name="workingDays"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const currentSelected = field.value || [];
                const isSelected = currentSelected.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => {
                      const updated = isSelected
                        ? currentSelected.filter((d) => d !== day)
                        : [...currentSelected, day];
                      field.onChange(updated);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                      isSelected
                        ? "bg-[#fc8019] text-white border-[#fc8019]"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.workingDays && (
          <p className="mt-1 text-xs text-red-500">
            {errors.workingDays.message}
          </p>
        )}
      </div>

      {/* Opening & Closing Times */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Opening Time
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Clock className="h-4 w-4" />
            </div>
            <input
              {...register("openingClosing.open")}
              type="time"
              aria-invalid={Boolean(errors.openingClosing?.open)}
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] text-sm transition-colors"
            />
          </div>
          {errors.openingClosing?.open && (
            <p className="mt-1 text-xs text-red-500">
              {errors.openingClosing.open.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Closing Time
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Clock className="h-4 w-4" />
            </div>
            <input
              {...register("openingClosing.close")}
              type="time"
              aria-invalid={Boolean(errors.openingClosing?.close)}
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fc8019] text-sm transition-colors"
            />
          </div>
          {errors.openingClosing?.close && (
            <p className="mt-1 text-xs text-red-500">
              {errors.openingClosing.close.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#fc8019] hover:bg-[#e06d10] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fc8019] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            Save & Continue <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}