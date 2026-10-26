// features/dashboard/component/MenuItemRow.tsx
"use client";

import React from "react";
import { Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Food } from "@/features/typescript/restaurantOwner.type";
import { getImageUrl } from "@/services/axios/axiosInstance";
import VegNonVegMark from "@/component/common/VegNonVegMark";

interface MenuItemRowProps {
  food: Food;
  onToggle: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export default function MenuItemRow({ food, onToggle, onDelete }: MenuItemRowProps) {
  const price = food.discountPrice || food.basePrice;
  const hasDiscount = Boolean(
    food.discountPrice && food.discountPrice < food.basePrice
  );
  const discountPct = hasDiscount
    ? Math.round(
        ((food.basePrice - food.discountPrice!) / food.basePrice) * 100
      )
    : 0;

  return (
    <div className="py-4 flex items-start gap-4 first:pt-0 last:pb-0">
      {/* FOOD IMAGE */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gray-200 relative">
        {food.image ? (
          <img
            src={getImageUrl(food.image)}
            alt={food.itemName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300">
            <ImageIcon className="w-6 h-6" />
            <span className="text-[9px] font-semibold uppercase">No image</span>
          </div>
        )}
        <span className="absolute bottom-1 left-1 bg-white rounded p-0.5 shadow-xs">
          <VegNonVegMark isVeg={food.isVeg} size={14} />
        </span>
      </div>

      {/* FULL ITEM DETAILS */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <VegNonVegMark isVeg={food.isVeg} size={14} />
          <span className="text-xs font-bold text-gray-800">{food.itemName}</span>
          <span className="text-xs font-extrabold text-gray-900">₹{price}</span>
          {hasDiscount && (
            <>
              <span className="text-[11px] text-gray-400 line-through">
                ₹{food.basePrice}
              </span>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                {discountPct}% OFF
              </span>
            </>
          )}
          {food.approvalStatus && (
            <span
              className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                food.approvalStatus === "approved"
                  ? "bg-emerald-50 text-emerald-700"
                  : food.approvalStatus === "pending"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {food.approvalStatus}
            </span>
          )}
        </div>

        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
          {food.description || "No description added for this item."}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
            {food.category || food.foodType || "Uncategorized"}
          </span>
          {food.foodType && (
            <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
              {food.foodType}
            </span>
          )}
          {food.cuisine && (
            <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
              {food.cuisine}
            </span>
          )}
          <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
            Base ₹{food.basePrice}
          </span>
          <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
            GST {food.gst ?? 0}%
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              food.isAvailable
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {food.isAvailable ? "Available" : "Out of stock"}
          </span>
        </div>
      </div>

      {/* ACTIONS & TOGGLE */}
      <div className="flex flex-col items-end gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/resturant_owner_dashboard/menu/edit/${food._id}`}
            className="flex items-center gap-1 text-[11px] font-bold text-[#fc8019] hover:text-[#e06f12] uppercase tracking-wide"
          >
            EDIT ITEM
            <Pencil className="w-3 h-3" />
          </Link>

          <button
            onClick={() => food._id && food.itemName && onDelete(food._id, food.itemName)}
            className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wide cursor-pointer"
          >
            DELETE
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        {/* Availability Toggle Switch */}
        <label className="relative inline-flex items-center gap-2 cursor-pointer">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            {food.isAvailable ? "Available" : "Disabled"}
          </span>
          <input
            type="checkbox"
            checked={Boolean(food.isAvailable)}
            onChange={() => food._id && onToggle(food._id)}
            className="sr-only peer"
          />
          <div className="relative w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>
    </div>
  );
}
