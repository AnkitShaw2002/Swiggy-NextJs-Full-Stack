// app/(dashboard)/resturant_owner_dashboard/menu/page.tsx
"use client";

import React from "react";
import {
  Search,
  MoreVertical,
  Loader2,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import VegNonVegMark, {
  VegNonVegLegend,
} from "@/component/common/VegNonVegMark";
import MenuItemRow from "@/features/dashboard/component/MenuItemRow";
import {
  ALL_CATEGORIES,
  useMenuPage,
} from "@/features/hooks/dashboard/dashboard.hook";

export default function MenuPage() {
  const {
    foods,
    isLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    categoryCounts,
    outOfStockCount,
    disabledCount,
    filteredFoods,
    groupedFoods,
    handleToggle,
    handleDelete,
  } = useMenuPage();

  return (
    <div className="-m-6 bg-[#f0f2f5] min-h-screen text-gray-800 font-sans">
      {/* SUB-HEADER TABS */}
      <div className="bg-[#2b323b] px-6 pt-3 flex items-center border-b border-gray-700">
        <button
          onClick={() => setActiveTab("MY_MENU")}
          className={`px-4 py-2 text-xs font-bold tracking-wider transition border-b-2 uppercase ${
            activeTab === "MY_MENU"
              ? "text-white border-[#fc8019]"
              : "text-gray-400 border-transparent hover:text-gray-200"
          }`}
        >
          MY MENU
        </button>
        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`px-4 py-2 text-xs font-bold tracking-wider transition border-b-2 uppercase ${
            activeTab === "HISTORY"
              ? "text-white border-[#fc8019]"
              : "text-gray-400 border-transparent hover:text-gray-200"
          }`}
        >
          HISTORY OF MENU CHANGES
        </button>
      </div>

      {activeTab === "HISTORY" ? (
        <div className="p-8 text-center text-sm text-gray-500 bg-white m-6 rounded shadow-xs">
          No recent menu change history recorded.
        </div>
      ) : (
        <div className="p-6 space-y-4">
          {/* TOP TOOLBAR: SEARCH & BADGES */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  placeholder="Search for an item or category"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-xs text-gray-800 placeholder-gray-400 pl-3 pr-8 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-gray-400 shadow-2xs"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5" />
              </div>
              <button className="text-xs font-bold text-sky-600 hover:underline uppercase tracking-wide">
                NEED HELP?
              </button>
            </div>

            {/* ACTION / STATUS BADGES */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button className="bg-[#4285f4] text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-2 shadow-2xs">
                <span>MENU ADD ONS</span>
                <span className="bg-white text-[#4285f4] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
                  1
                </span>
              </button>
              <button className="bg-[#8b95a5] text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-2 shadow-2xs">
                <span>DISABLED</span>
                <span className="bg-white text-[#8b95a5] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
                  {disabledCount}
                </span>
              </button>
              <button className="bg-[#fc8019] text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-2 shadow-2xs">
                <span>OUT OF STOCK</span>
                <span className="bg-white text-[#fc8019] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
                  {outOfStockCount}
                </span>
              </button>
            </div>
          </div>

          {/* MAIN TWO-COLUMN CONTAINER */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded shadow-xs border border-gray-200 min-h-[550px]">
            {/* LEFT COLUMN: CATEGORIES */}
            <div className="md:col-span-4 border-r border-gray-200 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50/50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  CATEGORY ({categories.length + 1})
                </span>
                <button className="text-xs font-bold text-sky-600 hover:underline uppercase tracking-wide">
                  + ADD NEW
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* ALL CATEGORIES ROW */}
                <div
                  onClick={() => setSelectedCategory(ALL_CATEGORIES)}
                  className={`flex items-center justify-between px-4 py-3.5 cursor-pointer border-b border-gray-100 transition ${
                    selectedCategory === ALL_CATEGORIES
                      ? "bg-[#2b323b] text-white"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span className="text-xs font-semibold flex items-center gap-2">
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    {ALL_CATEGORIES}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedCategory === ALL_CATEGORIES
                          ? "bg-white/15 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {foods.length}
                    </span>
                    <MoreVertical
                      className={`w-4 h-4 ${
                        selectedCategory === ALL_CATEGORIES
                          ? "text-gray-300"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>

                {categories.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    No categories found.
                  </div>
                ) : (
                  categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <div
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex items-center justify-between px-4 py-3.5 cursor-pointer border-b border-gray-100 transition ${
                          isSelected
                            ? "bg-[#2b323b] text-white"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="text-xs font-semibold">{cat}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? "bg-white/15 text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {categoryCounts[cat] || 0}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected ? "bg-emerald-400" : "bg-emerald-500"
                            }`}
                          />
                          <MoreVertical
                            className={`w-4 h-4 ${
                              isSelected ? "text-gray-300" : "text-gray-400"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: ITEMS LIST */}
            <div className="md:col-span-8 flex flex-col">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50/50 gap-3 flex-wrap">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {selectedCategory === ALL_CATEGORIES
                      ? "ALL ITEMS"
                      : selectedCategory}{" "}
                    ({filteredFoods.length})
                  </span>
                  <VegNonVegLegend className="hidden sm:flex" />
                </div>
                <Link
                  href="/resturant_owner_dashboard/menu/add"
                  className="text-xs font-bold text-sky-600 hover:underline uppercase tracking-wide flex items-center gap-1"
                >
                  + ADD NEW
                </Link>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {isLoading && foods.length === 0 ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-[#fc8019]" />
                  </div>
                ) : filteredFoods.length === 0 ? (
                  <div className="text-center py-16">
                    <UtensilsCrossed className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">
                      No food items found in this category.
                    </p>
                  </div>
                ) : groupedFoods ? (
                  <div className="space-y-5">
                    {groupedFoods.map(([cat, items]) => (
                      <div key={cat}>
                        <div className="flex items-center justify-between gap-2 sticky top-0 bg-white z-10 py-1 pb-1.5 border-b-2 border-gray-200">
                          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                            {cat}
                          </span>
                          <span className="text-[10px] font-semibold text-gray-400">
                            {items.length} item{items.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {items.map((food) => (
                            <MenuItemRow
                              key={food._id}
                              food={food}
                              onToggle={handleToggle}
                              onDelete={handleDelete}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredFoods.map((food) => (
                      <MenuItemRow
                        key={food._id}
                        food={food}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
