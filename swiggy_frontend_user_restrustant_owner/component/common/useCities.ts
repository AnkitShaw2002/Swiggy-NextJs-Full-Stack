import { useEffect, useMemo } from "react";
import { useUserStore } from "@/features/store/user.store"; // Adjust import path to your store
import { useAuthStore } from "@/features/store/auth.store"; // Adjust import path to your auth store

export function useCities() {
  const { restaurants, fetchRestaurants } = useUserStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token && restaurants.length === 0) {
      fetchRestaurants();
    }
  }, [token, fetchRestaurants, restaurants.length]);

  const cities = useMemo(() => {
    const citySet = new Set<string>();
    
    restaurants.forEach((r) => {
      if (r.location && typeof r.location === "string") {
        // Split by comma: ["Address", " City", " State - Pincode"]
        const parts = r.location.split(",");
        if (parts.length >= 2) {
          const city = parts[1].trim();
          if (city) {
            citySet.add(city);
          }
        }
      }
    });
    
    return Array.from(citySet).sort();
  }, [restaurants]);

  return { cities, restaurants };
}