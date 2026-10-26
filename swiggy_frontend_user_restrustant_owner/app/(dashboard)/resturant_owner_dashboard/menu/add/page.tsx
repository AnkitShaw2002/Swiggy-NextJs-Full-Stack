"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useAddFoodPage } from "@/features/hooks/dashboard/dashboard.hook";
import FoodItemFormChild from "@/features/dashboard/component/FoodItemFormChild";

export default function AddFoodPage() {
  const {
    form,
    setForm,
    image,
    setImage,
    submitting,
    isLoading,
    handleChange,
    handleSubmit,
    handleBack,
  } = useAddFoodPage();

  return (
    <div className="-m-6 bg-[#f0f2f5] min-h-screen text-gray-800 font-sans">
      {/* SUB-HEADER NAVBAR */}
      <div className="bg-[#2b323b] px-6 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-1 rounded text-gray-300 hover:text-white hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            ADD NEW MENU ITEM
          </span>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <FoodItemFormChild
          form={form}
          setForm={setForm}
          image={image}
          setImage={setImage}
          submitting={submitting}
          isLoading={isLoading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleBack={handleBack}
          submitLabel="Save Item"
        />
      </div>
    </div>
  );
}
