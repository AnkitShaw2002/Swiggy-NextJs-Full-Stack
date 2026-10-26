"use client";

import { useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Star, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/features/store/user.store";
import { useAuthStore } from "@/features/store/auth.store";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { getRestaurantImage } from "@/lib/constants";

export default function DineoutRestaurants() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { restaurants, fetchRestaurants } = useUserStore();
  const { token } = useAuthStore();

  const handleRestaurantClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    restaurantId: string
  ) => {
    if (!token) {
      e.preventDefault();
      router.push(
        `/Login?redirect=${encodeURIComponent(`/restaurants/${restaurantId}`)}`
      );
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return restaurants.length === 0 ? null : (
    <section className="w-full bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            <AnimatedShinyText className="mx-0 max-w-none text-gray-900/80 dark:text-gray-900/80">
              Best restaurants near you
            </AnimatedShinyText>
          </h2>
          <div className="flex items-center gap-2">
            <button
              suppressHydrationWarning
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-gray-300/80 text-gray-700 flex items-center justify-center transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              suppressHydrationWarning
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-gray-300/80 text-gray-700 flex items-center justify-center transition"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              href={`/restaurants/${restaurant._id}`}
              onClick={(e) => handleRestaurantClick(e, restaurant._id)}
              className="flex flex-col shrink-0 w-[280px] sm:w-[320px] rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition duration-200 overflow-hidden group cursor-pointer"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <Store className="absolute w-16 h-16 text-gray-300" />
                <img
                  src={getRestaurantImage(restaurant)}
                  alt={restaurant.restaurantName}
                  className="relative w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <h3 className="absolute bottom-3 left-3 text-white font-bold text-lg truncate max-w-[70%]">
                  {restaurant.restaurantName}
                </h3>
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-xs font-semibold ${
                    restaurant.isOpen
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {restaurant.isOpen ? "Open" : "Closed"}
                </span>
              </div>

              <div className="p-3.5 flex flex-col gap-2 flex-1 justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    {restaurant.outletType || "Restaurant"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {restaurant.location || "Location not set"}
                  </p>
                </div>
                {restaurant.openingClosing?.slots?.[0] && (
                  <p className="text-[11px] text-gray-400">
                    {restaurant.openingClosing.slots[0].open} – {restaurant.openingClosing.slots[0].close}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
