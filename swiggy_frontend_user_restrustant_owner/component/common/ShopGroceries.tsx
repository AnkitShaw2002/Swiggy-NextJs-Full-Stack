"use client";

import { useEffect, useRef, useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore, FoodItem } from "@/features/store/user.store";
import { useAuthStore } from "@/features/store/auth.store";
import { getImageUrl } from "@/services/axios/axiosInstance";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import VegNonVegMark from "@/component/common/VegNonVegMark";

const fallbackNonVeg: FoodItem[] = [
  { _id: "fnv1", itemName: "Chicken Biryani", category: "biryani", cuisine: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80", isVeg: false, basePrice: 280, discountPrice: 229, isAvailable: true, description: "Fragrant basmati with tender chicken", restaurant: "" as any },
  { _id: "fnv2", itemName: "Butter Chicken", category: "north indian", cuisine: "North Indian", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80", isVeg: false, basePrice: 320, discountPrice: 269, isAvailable: true, description: "Creamy tomato curry with chicken", restaurant: "" as any },
  { _id: "fnv3", itemName: "Chicken Burger", category: "burger", cuisine: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80", isVeg: false, basePrice: 180, discountPrice: 149, isAvailable: true, description: "Crispy chicken patty with mayo", restaurant: "" as any },
  { _id: "fnv4", itemName: "Chicken Momos", category: "chinese", cuisine: "Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80", isVeg: false, basePrice: 150, discountPrice: 119, isAvailable: true, description: "Steamed dumplings with spicy chutney", restaurant: "" as any },
  { _id: "fnv5", itemName: "Egg Pasta", category: "pasta", cuisine: "Pasta", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGKTXxvRoD6QXT8bkqYz1OsTPeFw7iWv1GnLZmos0z4Q&s=10", isVeg: false, basePrice: 200, discountPrice: 169, isAvailable: true, description: "Alfredo pasta with scrambled eggs", restaurant: "" as any },
  { _id: "fnv6", itemName: "Fish Curry", category: "south indian", cuisine: "South Indian", image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=300&q=80", isVeg: false, basePrice: 350, discountPrice: 299, isAvailable: true, description: "Coconut-based tangy fish curry", restaurant: "" as any },
  { _id: "fnv7", itemName: "Chicken Shawarma", category: "mughlai", cuisine: "Mughlai", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBBoyirXWCiKVhoUZXjDjOouh0E4Ql_mYkNfqLZnoJTQ&s=10", isVeg: false, basePrice: 220, discountPrice: 179, isAvailable: true, description: "Grilled chicken wrapped in pita", restaurant: "" as any },
  { _id: "fnv8", itemName: "Mutton Rogan Josh", category: "north indian", cuisine: "North Indian", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80", isVeg: false, basePrice: 400, discountPrice: 349, isAvailable: true, description: "Slow-cooked aromatic mutton curry", restaurant: "" as any },
];

function getFoodImage(food: FoodItem): string {
  if (food.image) return getImageUrl(food.image);
  const key = (food.category || food.cuisine || "").toLowerCase();
  const categoryImages: Record<string, string> = {
    "north indian": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80",
    "biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80",
    "burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
    "chinese": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80",
    "south indian": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=300&q=80",
    "mughlai": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=300&q=80",
    "pasta": "https://images.unsplash.com/photo-1621996346565-e3d5d6281288?auto=format&fit=crop&w=300&q=80",
    "default": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80",
  };
  return categoryImages[key] || categoryImages["default"];
}

export default function ShopGroceries() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { foods, fetchFoods, isLoading } = useUserStore();
  const { token } = useAuthStore();

  const handleFoodClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    restaurantId: string
  ) => {
    // Guests are sent to the login drawer instead of the restaurant page.
    if (!token) {
      e.preventDefault();
      router.push(
        `/Login?redirect=${encodeURIComponent(
          restaurantId ? `/restaurants/${restaurantId}` : "/restaurants"
        )}`
      );
      return;
    }
    // Demo fallback items have no restaurant to open.
    if (!restaurantId) e.preventDefault();
  };

  useEffect(() => {
    if (foods.length === 0) {
      fetchFoods();
    }
  }, [fetchFoods, foods.length]);

  const nonVegFoods = useMemo(() => {
    if (foods.length > 0) {
      return foods.filter((f) => !f.isVeg);
    }
    return fallbackNonVeg;
  }, [foods]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -400 : 400,
        behavior: "smooth",
      });
    }
  };

  return isLoading ? null : (
    <section className="w-full bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            <AnimatedShinyText className="mx-0 max-w-none text-gray-900/80 dark:text-gray-900/80">
              Non-Veg Cravings
            </AnimatedShinyText>
          </h2>
          <div className="flex items-center gap-2">
            <button
              suppressHydrationWarning
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-gray-300/80 text-gray-700 flex items-center justify-center transition"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              suppressHydrationWarning
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-gray-300/80 text-gray-700 flex items-center justify-center transition"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {nonVegFoods.map((item) => {
            const restaurantId =
              typeof item.restaurant === "object" && item.restaurant
                ? item.restaurant._id
                : "";
            return (
              <Link
                key={item._id}
                href={restaurantId ? `/restaurants/${restaurantId}` : "#"}
                onClick={(e) => handleFoodClick(e, restaurantId)}
                className="flex flex-col items-center group w-32 cursor-pointer shrink-0"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  <img
                    src={getFoodImage(item)}
                    alt={item.itemName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="mt-2 text-sm font-semibold text-gray-700 text-center group-hover:text-black flex items-center justify-center gap-1.5">
                  <VegNonVegMark isVeg={item.isVeg ?? false} size={13} />
                  {item.itemName}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
