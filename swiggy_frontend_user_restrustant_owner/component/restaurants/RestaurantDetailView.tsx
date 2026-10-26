"use client";

import React, { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Plus,
  Minus,
  ShoppingBag,
  MapPin,
  Clock,
  Star,
  ArrowLeft,
  Utensils,
  Zap,
  TrendingUp,
  Info,
} from "lucide-react";
import { useUserStore, FoodItem, RestaurantDetail, Cart } from "@/features/store/user.store";
import { getImageUrl } from "@/services/axios/axiosInstance";
import { getRestaurantImage } from "@/lib/constants";
import PriceRangeFilter from "@/component/common/PriceRangeFilter";
import Pagination from "@/component/common/Pagination";
import VegNonVegMark, {
  VegNonVegLegend,
} from "@/component/common/VegNonVegMark";
import { showClearCartPopup } from "@/lib/cartPopup";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const FOOD_IMAGES: Record<string, string> = {
  "north indian": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80",
  "biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
  "pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
  "burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
  "chinese": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80",
  "south indian": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80",
  "dosa": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80",
  "cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
  "paratha": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80",
  "default": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
};

/** Menu items shown per page on this screen - change it here. */
export const ITEMS_PER_PAGE = 2;

function getFoodPrice(food: FoodItem): number {
  return food.discountPrice || food.basePrice;
}

function isRestaurantOpenByTime(restaurant: RestaurantDetail): boolean {
  const now = new Date();
  const currentDay = DAY_NAMES[now.getDay()].toLowerCase();
  const workingDays: string[] = (restaurant.workingDays || []).map((d: string) => d.toLowerCase());
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

function getFoodImage(food: FoodItem): string {
  if (food.image) return getImageUrl(food.image);
  const key = (food.category || food.cuisine || "").toLowerCase();
  return FOOD_IMAGES[key] || FOOD_IMAGES["default"];
}

const subscribeToClock = (onStoreChange: () => void): (() => void) => {
  const interval = setInterval(onStoreChange, 30_000);
  return () => clearInterval(interval);
};

function isRestaurantOffline(restaurant: RestaurantDetail): boolean {
  return restaurant.isOpen === false;
}

// The open/closed badge must render identically on the server and during
// hydration, so the server snapshot comes from the restaurant record while the
// wall-clock check only takes over once React owns the page on the client.
// An outlet the owner switched off is closed in both snapshots.
function useRestaurantOpen(restaurant: RestaurantDetail): boolean {
  return useSyncExternalStore(
    subscribeToClock,
    () => !isRestaurantOffline(restaurant) && isRestaurantOpenByTime(restaurant),
    () => !isRestaurantOffline(restaurant)
  );
}

interface RestaurantDetailViewProps {
  initialRestaurant: RestaurantDetail;
  initialFoods: FoodItem[];
  initialCart: Cart | null;
}

export default function RestaurantDetailView({
  initialRestaurant,
  initialFoods,
  initialCart,
}: RestaurantDetailViewProps) {
  const { addToCart, fetchCart } = useUserStore();

  // Everything below renders from these states so the first paint after
  // hydration matches the markup the server already streamed to the browser.
  const [restaurant, setRestaurant] = useState<RestaurantDetail>(initialRestaurant);
  const [foods, setFoods] = useState<FoodItem[]>(initialFoods);
  const [cart, setCart] = useState<Cart | null>(initialCart);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"default" | "low-high" | "high-low">("default");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [rangeKey, setRangeKey] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  // Seed the shared store with the server-rendered data, then follow it so
  // realtime (socket) updates and the navbar cart badge stay in sync.
  useEffect(() => {
    useUserStore.setState({
      selectedRestaurant: initialRestaurant,
      restaurantFoods: initialFoods,
    });

    if (initialCart && !useUserStore.getState().cart) {
      useUserStore.setState({
        cart: initialCart,
        cartCount: initialCart.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
      });
    }

    const unsubscribe = useUserStore.subscribe((state) => {
      setFoods(state.restaurantFoods);
      setCart(state.cart);
      if (state.selectedRestaurant?._id === initialRestaurant._id) {
        setRestaurant(state.selectedRestaurant);
      }
    });

    return unsubscribe;
  }, [initialRestaurant, initialFoods, initialCart]);

  const priceBounds = useMemo(() => {
    const prices = foods.map(getFoodPrice);
    if (prices.length === 0) return { min: 0, max: 500 };
    const lo = Math.min(...prices);
    const hi = Math.max(...prices);
    const min = Math.max(0, Math.floor(lo / 50) * 50);
    const max = Math.max(min + 100, Math.ceil((hi * 1.1) / 50) * 50);
    return { min, max };
  }, [foods]);

  const clearPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    setRangeKey((k) => k + 1);
    setPage(0);
  };

  const categories = useMemo(() => {
    const cats = new Set<string>(foods.map((f) => f.category || "Other"));
    return ["All", ...Array.from(cats)];
  }, [foods]);

  const filteredFoods = useMemo(() => {
    let list = foods;

    if (activeCategory !== "All") {
      list = list.filter((f) => (f.category || "Other") === activeCategory);
    }

    const min = minPrice === "" ? NaN : Number(minPrice);
    const max = maxPrice === "" ? NaN : Number(maxPrice);
    if (!Number.isNaN(min)) list = list.filter((f) => getFoodPrice(f) >= min);
    if (!Number.isNaN(max)) list = list.filter((f) => getFoodPrice(f) <= max);

    if (sortBy === "low-high") list = [...list].sort((a, b) => getFoodPrice(a) - getFoodPrice(b));
    if (sortBy === "high-low") list = [...list].sort((a, b) => getFoodPrice(b) - getFoodPrice(a));

    return list;
  }, [foods, activeCategory, sortBy, minPrice, maxPrice]);

  const pageCount = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(page, Math.max(pageCount - 1, 0));

  const pagedFoods = useMemo(
    () =>
      filteredFoods.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE),
    [filteredFoods, currentPage]
  );

  const scrollToMenu = () => {
    document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Every filter change invalidates the current page.
  const selectCategory = (cat: string) => {
    setActiveCategory(cat);
    setPage(0);
  };

  const selectSort = (value: "default" | "low-high" | "high-low") => {
    setSortBy(sortBy === value ? "default" : value);
    setPage(0);
  };

  const getQty = (foodId: string) => quantities[foodId] || 0;

  const updateQty = (foodId: string, delta: number) => {
    setQuantities((prev) => {
      const newQty = Math.max(0, (prev[foodId] || 0) + delta);
      if (newQty === 0) {
        const { [foodId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [foodId]: newQty };
    });
  };

  const handleAddToCart = async (foodId: string) => {
    if (isRestaurantOffline(restaurant)) return;
    const qty = getQty(foodId);
    if (qty === 0) return;

    // A cart can only hold items from one restaurant. When it still holds
    // items from another one, ask before the backend replaces them.
    const storeCart = useUserStore.getState().cart;
    const cartRestaurant = storeCart?.restaurant;
    const cartRestaurantId =
      typeof cartRestaurant === "string" ? cartRestaurant : cartRestaurant?._id;
    const cartRestaurantName =
      typeof cartRestaurant === "string" ? "" : cartRestaurant?.restaurantName;
    const hasOtherRestaurantItems = Boolean(
      storeCart?.items?.length && cartRestaurantId && cartRestaurantId !== restaurant._id
    );

    if (hasOtherRestaurantItems) {
      const confirmed = await showClearCartPopup(cartRestaurantName, restaurant.restaurantName);
      if (!confirmed) return;
    }

    await addToCart(foodId, qty);
    setQuantities((prev) => {
      const { [foodId]: _, ...rest } = prev;
      return rest;
    });
    fetchCart();
  };

  const slot = restaurant?.openingClosing?.slots?.[0];
  const isActuallyOpen = useRestaurantOpen(restaurant);
  const rating = restaurant?.rating || 4.2;
  const deliveryTime = restaurant?.deliveryTime || 25;
  const costForTwo = restaurant?.costForTwo || 400;
  const totalCartQty = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalCartPrice =
    cart?.items?.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src={getRestaurantImage(restaurant)}
          alt={restaurant.restaurantName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back Button */}
        <Link
          href="/restaurants"
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
          <Star className="w-4 h-4 text-white fill-white" />
          <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            {rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-gray-500 font-medium">
            {restaurant?.totalRatings || "100+"}
          </span>
        </div>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  isActuallyOpen ? "bg-green-500 text-white" : "bg-gray-600 text-gray-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isActuallyOpen ? "bg-white animate-pulse" : "bg-gray-400"}`}
                />
                {isActuallyOpen ? "Open Now" : "Closed"}
              </span>
              {restaurant.outletType && (
                <span className="text-[10px] text-gray-300 font-medium bg-white/10 px-2 py-0.5 rounded-full">
                  {restaurant.outletType}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
              {restaurant.restaurantName}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {restaurant.location || "Location not set"}
              </span>
              {slot && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {slot.open} – {slot.close}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <Zap className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{deliveryTime} min</p>
                <p className="text-[10px] text-gray-500">Delivery</p>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200 shrink-0" />
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">₹{costForTwo}</p>
                <p className="text-[10px] text-gray-500">For two</p>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200 shrink-0" />
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Utensils className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{foods.length}</p>
                <p className="text-[10px] text-gray-500">Items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closed Banner */}
      {!isActuallyOpen && (
        <div className="bg-red-50 border-b border-red-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600 font-medium">
              {isRestaurantOffline(restaurant)
                ? "This restaurant is currently closed and not accepting orders. You can browse the menu, but items can't be added to the cart."
                : "Restaurant is currently closed. Orders cannot be placed."}
            </p>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div
              className="flex items-center gap-1 overflow-x-auto py-3"
              style={{ scrollbarWidth: "none" }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    activeCategory === cat
                      ? "bg-[#fc8019] text-white shadow-md shadow-orange-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Section */}
      <div id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-8 py-6 pb-32 scroll-mt-4">
        <div className="mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              <div className="flex items-center gap-3 flex-wrap mt-1.5">
                <p className="text-xs text-gray-500">
                  {filteredFoods.length} item{filteredFoods.length !== 1 ? "s" : ""}
                  {activeCategory !== "All" && ` in ${activeCategory}`}
                  {(minPrice !== "" || maxPrice !== "") &&
                    ` · ₹${minPrice || 0} – ₹${maxPrice || "∞"}`}
                  {pageCount > 1 &&
                    ` · showing ${currentPage * ITEMS_PER_PAGE + 1}–${Math.min(
                      (currentPage + 1) * ITEMS_PER_PAGE,
                      filteredFoods.length
                    )}`}
                </p>
                <VegNonVegLegend />
              </div>
            </div>

            {/* Sort by cost */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => selectSort("low-high")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  sortBy === "low-high"
                    ? "bg-[#fc8019] text-white shadow-sm shadow-orange-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Price: Low → High
              </button>
              <button
                onClick={() => selectSort("high-low")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  sortBy === "high-low"
                    ? "bg-[#fc8019] text-white shadow-sm shadow-orange-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Price: High → Low
              </button>
            </div>
          </div>

          <PriceRangeFilter
            key={rangeKey}
            bounds={priceBounds}
            value={{ min: minPrice, max: maxPrice }}
            onApply={(lo, hi) => {
              setMinPrice(lo);
              setMaxPrice(hi);
              setPage(0);
            }}
            onReset={clearPriceFilter}
          />
        </div>

        {filteredFoods.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">No items available</p>
            <p className="text-xs text-gray-500">
              {(minPrice !== "" || maxPrice !== "")
                ? `No items between ₹${minPrice || 0} and ₹${maxPrice || "∞"}.`
                : activeCategory !== "All"
                  ? `No items in this category. Try "All".`
                  : "Menu items will appear here once added."}
            </p>
            {(minPrice !== "" || maxPrice !== "") && (
              <button
                onClick={clearPriceFilter}
                className="mt-3 text-xs font-bold text-[#fc8019] hover:underline"
              >
                Clear price filter
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {pagedFoods.map((food) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  qty={getQty(food._id)}
                  onIncrement={() => updateQty(food._id, 1)}
                  onDecrement={() => updateQty(food._id, -1)}
                  onAdd={() => handleAddToCart(food._id)}
                  disabled={!isActuallyOpen}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                scrollToMenu();
              }}
              className="mt-8"
            />
          </>
        )}
      </div>

      {/* Floating Cart Bar */}
      {cart && cart.items && cart.items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#2e7d32] text-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-2xl shadow-green-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {totalCartQty} item{totalCartQty > 1 ? "s" : ""}
                  </p>
                  <p className="text-[11px] text-green-200">₹{totalCartPrice}</p>
                </div>
              </div>
              <a
                href="/cart"
                className="flex items-center gap-2 bg-white text-[#2e7d32] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-50 transition shadow-sm"
              >
                View Cart
                <span className="text-[10px] bg-[#2e7d32] text-white px-1.5 py-0.5 rounded-full">
                  {totalCartQty}
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FoodCard({
  food,
  qty,
  onIncrement,
  onDecrement,
  onAdd,
  disabled,
}: {
  food: FoodItem;
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAdd: () => void;
  disabled?: boolean;
}) {
  const hasDiscount = food.discountPrice && food.discountPrice < food.basePrice;
  const discountPct = hasDiscount
    ? Math.round(((food.basePrice - food.discountPrice!) / food.basePrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4 p-4">
        {/* Food Image */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
          <img
            src={getFoodImage(food)}
            alt={food.itemName}
            className="w-full h-full object-cover"
          />
          {/* Veg/Non-veg Badge */}
          {food.isVeg !== undefined && (
            <div className="absolute bottom-1.5 left-1.5 bg-white rounded-md p-0.5 shadow-md">
              <VegNonVegMark isVeg={food.isVeg} size={20} />
            </div>
          )}
        </div>

        {/* Food Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 truncate">{food.itemName}</h3>
          {food.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{food.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-extrabold text-gray-900">
              ₹{food.discountPrice || food.basePrice}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xs text-gray-400 line-through">₹{food.basePrice}</span>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                  {discountPct}% OFF
                </span>
              </>
            )}
          </div>
          {food.category && (
            <span className="inline-block mt-1.5 text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {food.category}
            </span>
          )}
        </div>

        {/* Add Button */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          {qty === 0 ? (
            <button
              onClick={onIncrement}
              disabled={!food.isAvailable || disabled}
              className="px-6 py-2.5 border-2 border-[#fc8019] text-[#fc8019] text-xs font-bold rounded-xl hover:bg-orange-50 transition disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {disabled ? "Closed" : "Add"}
            </button>
          ) : (
            <>
              <div className="flex items-center gap-0 bg-[#2e7d32] text-white rounded-xl overflow-hidden shadow-md shadow-green-200">
                <button
                  onClick={onDecrement}
                  disabled={disabled}
                  className="w-9 h-9 flex items-center justify-center hover:bg-green-700 transition disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold">{qty}</span>
                <button
                  onClick={onIncrement}
                  disabled={disabled}
                  className="w-9 h-9 flex items-center justify-center hover:bg-green-700 transition disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={onAdd}
                disabled={disabled}
                className="text-[10px] font-bold text-[#fc8019] hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bestseller / Available Info */}
      {food.isAvailable === false && (
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
          <p className="text-[10px] font-medium text-gray-400 uppercase">Currently unavailable</p>
        </div>
      )}
    </div>
  );
}
