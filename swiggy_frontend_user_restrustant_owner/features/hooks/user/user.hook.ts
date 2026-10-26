"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUserStore, RestaurantListItem, RestaurantDetail } from "@/features/store/user.store";
import { useAuthStore } from "@/features/store/auth.store";

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const FILTERS = [
  "Rating 4.0+",
  "Pure Veg",
  "Cost: Low to High",
  "Cost: High to Low",
  "Fast Delivery",
];

export const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80",
];

export const STATUS_COLORS: Record<string, string> = {
  placed: "bg-amber-50 text-amber-600",
  accepted: "bg-blue-50 text-blue-600",
  preparing: "bg-purple-50 text-purple-600",
  out_for_delivery: "bg-indigo-50 text-indigo-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

export function isRestaurantOpenByTime(restaurant: RestaurantListItem): boolean {
  if (restaurant.isOpen === false) return false;

  const now = new Date();
  const currentDay = DAY_NAMES[now.getDay()].toLowerCase();
  const workingDays: string[] = (restaurant.workingDays || []).map((d: string) =>
    d.toLowerCase()
  );
  if (!workingDays.includes(currentDay)) return false;

  const slot = restaurant.openingClosing?.slots?.[0];
  if (!slot?.open || !slot?.close) return false;

  const [openH, openM] = slot.open.split(":").map(Number);
  const [closeH, closeM] = slot.close.split(":").map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.0) return "bg-green-500";
  if (rating >= 3.5) return "bg-green-400";
  if (rating >= 3.0) return "bg-yellow-500";
  return "bg-orange-500";
}

export function useRestaurantsPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const { restaurants, isLoading, fetchRestaurants } = useUserStore();
  const { token } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQueryState] = useState(initialSearch);
  const [userLocation, setUserLocation] = useState("");
  // The store starts empty on a hard refresh, so the very first paint would
  // look like "No Restaurants Found" before the fetch begins. Stay in the
  // loading state until the first fetch settles.
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("deliveryLocation");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setUserLocation(saved);
  }, []);

  // The list endpoint serves guests too (the home page fetches it without a
  // token), so never gate this on `token` - a logged-out or freshly-reloaded
  // visitor would otherwise see an empty list forever. Re-fetch whenever the
  // session changes.
  useEffect(() => {
    let active = true;
    (async () => {
      await fetchRestaurants();
      if (active) setHasLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [fetchRestaurants, token]);

  // The input keeps its own state for fast typing while the address bar is
  // kept in step via history.replaceState (no server round trip per
  // keystroke). Clearing the box removes ?search=, so a refresh shows the
  // full list instead of resurrecting the old query.
  const setSearchQuery = (q: string) => {
    setSearchQueryState(q);
    const params = new URLSearchParams(window.location.search);
    if (q.trim()) params.set("search", q);
    else params.delete("search");
    const qs = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${qs ? `?${qs}` : ""}`
    );
  };

  // Sync URL param changes (navigation from the home search bar,
  // back/forward buttons)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQueryState(initialSearch);
  }, [initialSearch]);

  const filteredRestaurants = useMemo(() => {
    let list = [...restaurants];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => {
        const d = r as RestaurantDetail;
        const name = r.restaurantName?.toLowerCase() || "";
        const loc = r.location?.toLowerCase() || "";
        const outlet = r.outletType?.toLowerCase() || "";
        const cuisines = (d.cuisine || []).join(" ").toLowerCase();
        const categories = (d.categories || []).join(" ").toLowerCase();
        return (
          name.includes(q) ||
          loc.includes(q) ||
          outlet.includes(q) ||
          cuisines.includes(q) ||
          categories.includes(q)
        );
      });
    }

    // Sort: nearby restaurants first (match by location text)
    if (userLocation.trim()) {
      const userLocLower = userLocation.toLowerCase();
      const userParts = userLocLower.split(",").map((s) => s.trim());

      list.sort((a, b) => {
        const aLoc = (a.location || "").toLowerCase();
        const bLoc = (b.location || "").toLowerCase();

        // Exact match
        const aExact = aLoc === userLocLower ? 1 : 0;
        const bExact = bLoc === userLocLower ? 1 : 0;
        if (bExact !== aExact) return bExact - aExact;

        // Partial match (city name)
        const aPartial = userParts.some((p) => aLoc.includes(p)) ? 1 : 0;
        const bPartial = userParts.some((p) => bLoc.includes(p)) ? 1 : 0;
        if (bPartial !== aPartial) return bPartial - aPartial;

        return 0;
      });
    }

    // Active filter
    if (activeFilter === "Rating 4.0+") {
      list = list.filter((r) => (r as RestaurantDetail).rating! >= 4.0);
    } else if (activeFilter === "Pure Veg") {
      list = list.filter((r) => r.outletType?.toLowerCase().includes("veg"));
    } else if (activeFilter === "Cost: Low to High") {
      list.sort(
        (a, b) =>
          ((a as RestaurantDetail).costForTwo || 0) -
          ((b as RestaurantDetail).costForTwo || 0)
      );
    } else if (activeFilter === "Cost: High to Low") {
      list.sort(
        (a, b) =>
          ((b as RestaurantDetail).costForTwo || 0) -
          ((a as RestaurantDetail).costForTwo || 0)
      );
    } else if (activeFilter === "Fast Delivery") {
      list = list.filter((r) => (r as RestaurantDetail).deliveryTime! <= 30);
    }

    return list;
  }, [restaurants, activeFilter, searchQuery, userLocation]);

  return {
    isLoading: isLoading || !hasLoaded,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    userLocation,
    filteredRestaurants,
  };
}

export function useRestaurantCard(restaurant: RestaurantListItem, userLocation: string) {
  const router = useRouter();
  const { token } = useAuthStore();
  const isOpen = isRestaurantOpenByTime(restaurant);
  const slot = restaurant.openingClosing?.slots?.[0];
  const detail = restaurant as RestaurantDetail;
  const rating = detail.rating || 4.2;
  const deliveryTime = detail.deliveryTime || 25;
  const costForTwo = detail.costForTwo || 400;
  // Deterministic fallback derived from the id (keeps renders pure/stable).
  const idHash = restaurant._id
    .split("")
    .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 5000, 0);
  const totalOrders = detail.totalOrders || idHash + 500;

  const isNearby =
    userLocation.trim() &&
    restaurant.location &&
    userLocation
      .toLowerCase()
      .split(",")
      .some((part) => restaurant.location!.toLowerCase().includes(part.trim()));

  const handleRestaurantClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!token) {
      e.preventDefault();
      router.push(
        `/Login?redirect=${encodeURIComponent(`/restaurants/${restaurant._id}`)}`
      );
    }
  };

  return {
    isOpen,
    slot,
    rating,
    deliveryTime,
    costForTwo,
    totalOrders,
    cuisine: detail.cuisine,
    isNearby: Boolean(isNearby),
    handleRestaurantClick,
  };
}

export function useCartPage() {
  const router = useRouter();
  const {
    cart,
    isLoading,
    isCartUpdating,
    fetchCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useUserStore();
  const { token } = useAuthStore();
  const [userLocation, setUserLocation] = useState("");

  useEffect(() => {
    if (token) fetchCart();
    const saved = localStorage.getItem("deliveryLocation");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setUserLocation(saved);
  }, [fetchCart, token]);

  const subtotal = cart?.items?.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  ) ?? 0;
  const deliveryFee = 30;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst;
  const totalQty = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const restaurantName =
    typeof cart?.restaurant === "object" ? cart.restaurant.restaurantName : "Restaurant";

  return {
    router,
    cart,
    isLoading,
    isCartUpdating,
    userLocation,
    subtotal,
    deliveryFee,
    gst,
    total,
    totalQty,
    restaurantName,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  };
}

export function useCheckoutPage() {
  const router = useRouter();
  const { cart, fetchCart, placeOrder, isLoading } = useUserStore();
  const { token } = useAuthStore();
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  useEffect(() => {
    if (token) fetchCart();
    const saved = localStorage.getItem("deliveryLocation");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setAddressForm((prev) => ({ ...prev, address: saved }));
  }, [fetchCart, token]);

  const subtotal = cart?.items?.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  ) ?? 0;
  const deliveryFee = 30;
  const gst = Math.round(subtotal * 0.05);
  const tip = selectedTip || 0;
  const total = subtotal + deliveryFee + gst + tip;
  const totalQty = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const restaurantName =
    typeof cart?.restaurant === "object" ? cart.restaurant.restaurantName : "Restaurant";

  const handlePlaceOrder = async () => {
    if (!addressForm.address) {
      setError("Please fill in a valid delivery address.");
      return;
    }
    setPlacing(true);
    setError(null);
    try {
      const parts = [
        addressForm.address,
        addressForm.city,
        addressForm.state,
        addressForm.pincode,
        addressForm.landmark,
      ].filter(Boolean);
      await placeOrder(parts.join(", "));
      setSuccess(true);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to order. Please try again.";
      setError(message);
      setPlacing(false);
    }
  };

  return {
    router,
    cart,
    isLoading,
    placing,
    success,
    error,
    setError,
    selectedTip,
    setSelectedTip,
    addressForm,
    setAddressForm,
    subtotal,
    deliveryFee,
    gst,
    tip,
    total,
    totalQty,
    restaurantName,
    handlePlaceOrder,
  };
}

export function useOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { selectedOrder, isLoading, fetchOrderById, cancelOrder } = useUserStore();

  useEffect(() => {
    if (id) fetchOrderById(id);
  }, [id, fetchOrderById]);

  const canCancel = ["placed", "accepted"].includes(selectedOrder?.status ?? "");

  return {
    id,
    router,
    selectedOrder,
    isLoading,
    canCancel,
    cancelOrder,
  };
}
