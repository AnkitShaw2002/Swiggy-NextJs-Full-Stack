"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCities } from "@/component/common/useCities";

export default function FooterSection() {
  const [showAll, setShowAll] = useState(false);
  const { cities } = useCities();

  // Show only 6 cities initially (matching your original list size), or all if expanded
  const displayedCities = showAll ? cities : cities.slice(0, 6);
  return (
    <footer className="w-full bg-gray-100 text-gray-700 pt-12 pb-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-gray-300">
          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-extrabold text-[#fc8019] mb-2">
              Swiggy
            </h2>
            <p className="text-xs text-gray-500">
              © 2026 Swiggy Limited
            </p>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-black">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-black">Swiggy Corporate</Link></li>
              <li><Link href="/careers" className="hover:text-black">Careers</Link></li>
              <li><Link href="/team" className="hover:text-black">Team</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact & Legal */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Contact us</h3>
            <ul className="space-y-2.5 text-sm text-gray-600 mb-6">
              <li><Link href="/support" className="hover:text-black">Help & Support</Link></li>
              <li><Link href="/partner" className="hover:text-black">Partner with us</Link></li>
              <li><Link href="/ride" className="hover:text-black">Ride with us</Link></li>
            </ul>

            <h3 className="text-sm font-bold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><Link href="/terms" className="hover:text-black">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-black">Privacy Policy</Link></li>
              <li><Link href="/cookie" className="hover:text-black">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Available Cities */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Available in:</h3>


            <ul className="space-y-2.5 text-sm text-gray-600">
              {displayedCities.length > 0 ? (
                displayedCities.map((city) => (
                  <li key={city}>
                    <Link
                      href={`/restaurants?city=${encodeURIComponent(city)}`}
                      className="hover:text-gray-900 transition-colors"
                    >
                      {city}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 italic">No cities found</li>
              )}
            </ul>

            {cities.length > 6 && (
              <div className="pt-3">
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="flex items-center justify-between gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:border-gray-400 bg-white transition cursor-pointer"
                >
                  <span>
                    {showAll ? "Show less" : `${cities.length} cities`}
                  </span>
                  {showAll ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}



            {/* <ul className="space-y-2.5 text-sm text-gray-600">
              <li>Bangalore</li>
              <li>Gurgaon</li>
              <li>Hyderabad</li>
              <li>Delhi</li>
              <li>Mumbai</li>
              <li>Pune</li>
            </ul> */}
            {/* <div className="pt-2">
              <button
                suppressHydrationWarning
                type="button"
                className="flex items-center justify-between w-32 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:border-gray-400 bg-white transition"
              >
                <span>674 cities</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div> */}
          </div>

          {/* Column 5: Life at Swiggy */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Life at Swiggy</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><Link href="/explore" className="hover:text-black">Explore with Swiggy</Link></li>
              <li><Link href="/swiggy-news" className="hover:text-black">Swiggy News</Link></li>
              <li><Link href="/snackables" className="hover:text-black">Snackables</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}