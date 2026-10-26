"use client";

import React from "react";
import Link from "next/link";
import {
  Loader2,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Filter,
  Utensils,
  Zap,
  Search,
  X,
} from "lucide-react";
import { RestaurantListItem } from "@/features/store/user.store";
import { getRestaurantImage } from "@/lib/constants";
import {
  useRestaurantsPage,
  useRestaurantCard,
  FILTERS,
  getRatingColor,
} from "@/features/hooks/user/user.hook";

export default function RestaurantsPage() {
  const {
    isLoading,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    userLocation,
    filteredRestaurants,
  } = useRestaurantsPage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#fc8019]/20 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-[#fc8019]" />
            </div>
            <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
              Discover Restaurants
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : userLocation
              ? `Restaurants in ${userLocation.split(",")[0]}`
              : "Best Restaurants Near You"}
          </h1>

          {/* Search Bar */}
          <div className="max-w-xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/20">
              <Search className="w-5 h-5 text-gray-300 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants, cuisines, or food..."
                className="w-full bg-transparent text-white text-sm font-medium focus:outline-none placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 hover:bg-white/10 rounded-full transition"
                >
                  <X className="w-4 h-4 text-gray-300" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-10">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-2 shrink-0 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-semibold text-gray-600">Filter</span>
          </div>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(activeFilter === f ? null : f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border shrink-0 shadow-sm ${
                activeFilter === f
                  ? "bg-[#fc8019] text-white border-[#fc8019]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#fc8019] hover:text-[#fc8019]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Restaurant Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {filteredRestaurants.length} Restaurant{filteredRestaurants.length !== 1 ? "s" : ""}
            {searchQuery && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                • found for &quot;{searchQuery}&quot;
              </span>
            )}
            {activeFilter && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                • filtered by {activeFilter}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-[#fc8019] hover:underline"
              >
                Clear search
              </button>
            )}
            {activeFilter && (
              <button
                onClick={() => setActiveFilter(null)}
                className="text-xs font-semibold text-[#fc8019] hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Restaurant Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#fc8019]" />
              <span className="text-sm text-gray-500">Loading restaurants...</span>
            </div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Restaurants Found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {searchQuery
                ? `No restaurants found for "${searchQuery}". Try a different search term.`
                : activeFilter
                ? "No restaurants match this filter. Try a different one."
                : "Check back later for available restaurants."}
            </p>
            {(searchQuery || activeFilter) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter(null);
                }}
                className="mt-4 text-sm font-bold text-[#fc8019] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
            {filteredRestaurants.map((r) => (
              <RestaurantCard key={r._id} restaurant={r} userLocation={userLocation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RestaurantCard({
  restaurant,
  userLocation,
}: {
  restaurant: RestaurantListItem;
  userLocation: string;
}) {
  const {
    isOpen,
    slot,
    rating,
    deliveryTime,
    costForTwo,
    totalOrders,
    cuisine,
    isNearby,
    handleRestaurantClick,
  } = useRestaurantCard(restaurant, userLocation);

  return (
    <Link
      href={`/restaurants/${restaurant._id}`}
      onClick={handleRestaurantClick}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getRestaurantImage(restaurant)}
          alt={restaurant.restaurantName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-white fill-white" />
          <span className={`text-xs font-bold text-white ${getRatingColor(rating)} px-1.5 py-0.5 rounded`}>
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Near You Badge */}
        {isNearby && (
          <div className="absolute top-3 left-[4.5rem]">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-[#fc8019] text-white shadow-sm">
              <MapPin className="w-3 h-3" />
              Near you
            </span>
          </div>
        )}

        {/* Open/Closed Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
              isOpen
                ? "bg-green-500 text-white"
                : "bg-gray-800/80 text-gray-300 backdrop-blur-sm"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-white animate-pulse" : "bg-gray-500"}`} />
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* Offer Banner */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#fc8019] to-[#e8530e] px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-white" />
            <span className="text-[11px] font-bold text-white">
              {deliveryTime} min delivery • ₹{costForTwo} for two
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-gray-900 group-hover:text-[#fc8019] transition-colors line-clamp-1">
            {restaurant.restaurantName}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <TrendingUp className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-400 font-medium">
              {totalOrders.toLocaleString()}+ orders
            </span>
          </div>
        </div>

        {/* Cuisine Tags */}
        <div className="flex items-center gap-1.5 mb-2.5">
          {cuisine?.slice(0, 3).map((c: string, i: number) => (
            <span
              key={i}
              className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
            >
              {c}
            </span>
          ))}
          {!cuisine && restaurant.outletType && (
            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {restaurant.outletType}
            </span>
          )}
        </div>

        {/* Location & Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
            <MapPin className="w-3 h-3 shrink-0 text-gray-400" />
            <span className="truncate">{restaurant.location || "Location not set"}</span>
          </div>
          {slot && (
            <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0 ml-2">
              <Clock className="w-3 h-3" />
              <span>{slot.open} – {slot.close}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
