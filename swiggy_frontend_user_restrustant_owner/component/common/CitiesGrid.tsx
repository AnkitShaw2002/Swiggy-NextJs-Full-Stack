"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useUserStore } from "@/features/store/user.store";
import { useAuthStore } from "@/features/store/auth.store";
import { useCities } from "@/component/common/useCities";

export default function CitiesGrid() {
  const [showAll, setShowAll] = useState(false);
  const { cities } = useCities();
  // const { restaurants, fetchRestaurants } = useUserStore();
  // const { token } = useAuthStore();

  // useEffect(() => {
  //   if (token && restaurants.length === 0) {
  //     fetchRestaurants();
  //   }
  // }, [token, fetchRestaurants, restaurants.length]);

  // const cities = useMemo(() => {
  //   const citySet = new Set<string>();
  //   restaurants.forEach((r) => {
  //     if (r.location && typeof r.location === "string") {
  //       // const city = r.location.trim();
  //     //   if (city) citySet.add(city);
  //     // }

  //     // Split by comma: ["Address", " City", " State - Pincode"]
  //       const parts = r.location.split(",");
  //       if (parts.length >= 2) {
  //         // Take the second part and trim whitespace to get the City name
  //         const city = parts[1].trim();
  //         if (city) {
  //           citySet.add(city);
  //         }
  //       }
  //     }
  //   });
  //   return Array.from(citySet).sort();
  // }, [restaurants]);

  const displayedCities = showAll ? cities : cities.slice(0, 11);

  return cities.length === 0 ? null : (
    <section className="w-full bg-white py-12 px-4 sm:px-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">
          Cities we deliver to
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {displayedCities.map((city) => (
            <div
              key={city}
              className="border border-gray-200 rounded-2xl p-4 text-center text-sm font-semibold text-gray-700 hover:shadow-md hover:border-gray-300 transition duration-200 truncate cursor-default select-none"
            >
              {city}
            </div>
          ))}

          {cities.length > 11 && (
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="border border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-sm font-bold text-[#fc8019] hover:bg-orange-50 transition duration-200"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show More <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
