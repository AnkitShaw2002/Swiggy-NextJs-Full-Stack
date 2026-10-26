// features/dashboard/component/FoodItemFormChild.tsx
"use client";

import React from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Loader2, Upload } from "lucide-react";
import VegNonVegMark from "@/component/common/VegNonVegMark";
import type { FoodFormState } from "@/features/hooks/dashboard/dashboard.hook";

interface FoodItemFormChildProps {
  form: FoodFormState;
  setForm: React.Dispatch<React.SetStateAction<FoodFormState>>;
  image: File | null;
  setImage: (image: File | null) => void;
  submitting: boolean;
  isLoading: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleBack: () => void;
  submitLabel?: string;
}

export default function FoodItemFormChild({
  form,
  setForm,
  image,
  setImage,
  submitting,
  isLoading,
  handleChange,
  handleSubmit,
  handleBack,
  submitLabel = "Save Item",
}: FoodItemFormChildProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded shadow-2xs divide-y divide-gray-100"
    >
      {/* SECTION 1: BASIC DETAILS */}
      <div className="p-5 space-y-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Basic Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              required
              placeholder="e.g. Chilli Egg (3 eggs)"
              className="w-full bg-white text-xs text-gray-800 placeholder-gray-400 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Main Course, Combos"
              className="w-full bg-white text-xs text-gray-800 placeholder-gray-400 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            placeholder="Brief description of ingredients or preparation..."
            className="w-full bg-white text-xs text-gray-800 placeholder-gray-400 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-gray-500 resize-none"
          />
        </div>
      </div>

      {/* SECTION 2: CLASSIFICATION & DIET */}
      <div className="p-5 space-y-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Classification & Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Food Type
            </label>
            <select
              name="foodType"
              value={form.foodType}
              onChange={handleChange}
              className="w-full bg-white text-xs text-gray-800 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-gray-500"
            >
              <option value="Starter">Starter</option>
              <option value="Main Course">Main Course</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Cuisine
            </label>
            <input
              type="text"
              name="cuisine"
              value={form.cuisine}
              onChange={handleChange}
              placeholder="e.g. North Indian, Chinese"
              className="w-full bg-white text-xs text-gray-800 placeholder-gray-400 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Dietary Indicator
            </label>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="isVeg"
                  checked={form.isVeg === true}
                  onChange={() => setForm({ ...form, isVeg: true })}
                  className="accent-[#fc8019]"
                />
                <VegNonVegMark isVeg size={14} />
                <span>Veg</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="isVeg"
                  checked={form.isVeg === false}
                  onChange={() => setForm({ ...form, isVeg: false })}
                  className="accent-[#fc8019]"
                />
                <VegNonVegMark isVeg={false} size={14} />
                <span>Non-Veg / Egg</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: PRICING & MEDIA */}
      <div className="p-5 space-y-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Pricing & Item Media
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Base Price (₹) *
            </label>
            <input
              type="number"
              name="basePrice"
              value={form.basePrice}
              onChange={handleChange}
              required
              min="1"
              placeholder="155"
              className="w-full bg-white text-xs text-gray-800 placeholder-gray-400 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              GST Rate (%)
            </label>
            <input
              type="number"
              name="gst"
              value={form.gst}
              onChange={handleChange}
              min="0"
              max="28"
              placeholder="5"
              className="w-full bg-white text-xs text-gray-800 placeholder-gray-400 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Item Photo
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full px-4 py-4 border border-dashed border-gray-300 rounded text-center hover:border-gray-400 transition flex flex-col items-center justify-center gap-1.5 bg-gray-50/50">
              <Upload className="w-5 h-5 text-gray-400" />
              {image ? (
                <span className="text-xs font-semibold text-gray-800">
                  {image.name}
                </span>
              ) : (
                <span className="text-xs text-gray-500">
                  Click or drag image file here to upload
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-4 bg-gray-50/50 flex items-center justify-end gap-3 rounded-b">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 transition uppercase"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || isLoading}
          className="px-6 py-2 bg-[#fc8019] hover:bg-[#e06f12] text-white text-xs font-bold rounded shadow-2xs transition flex items-center gap-2 disabled:opacity-50 uppercase tracking-wide"
        >
          {(submitting || isLoading) && (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
