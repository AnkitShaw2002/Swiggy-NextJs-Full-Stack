"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, ArrowRight, ChevronDown, X, Navigation } from "lucide-react";
import { useUserStore, RestaurantDetail } from "@/features/store/user.store";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { toast } from "sonner";

type SearchSuggestion = { name: string; sub: string };

const SERVICES = [
  {
    title: "Food Delivery",
    subtitle: "From Restaurants",
    offer: "Upto 60% OFF",
    href: "/restaurants",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=250&q=80",
    alt: "Food Delivery Bowl",
  },
  {
    title: "Instamart",
    subtitle: "Instant Grocery",
    offer: "Upto 60% OFF",
    href: "/restaurants",
    image: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=250&q=80",
    alt: "Grocery Basket",
  },
  {
    title: "Dineout",
    subtitle: "Eat Out & Save More",
    offer: "Upto 50% OFF",
    href: "/restaurants",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=250&q=80",
    alt: "Dineout Table",
  },
];

export default function HeaderSection() {
  const router = useRouter();
  const { restaurants, fetchRestaurants } = useUserStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Fetch restaurants for search suggestions. The list endpoint serves
  // guests too (the home page sections fetch it the same way), so this must
  // not depend on a token - otherwise suggestions are empty after logout.
  useEffect(() => {
    if (restaurants.length === 0) {
      fetchRestaurants();
    }
  }, [fetchRestaurants, restaurants.length]);

  // Load saved location or auto-detect
  useEffect(() => {
    const saved = localStorage.getItem("deliveryLocation");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocation(saved);
      return;
    }

    // Auto-detect location if browser supports it
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Try reverse geocoding to get readable address
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "";
          const state = data.address?.state || "";
          const display = city
            ? `${city}${state ? ", " + state : ""}`
            : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocation(display);
          localStorage.setItem("deliveryLocation", display);
        } catch {
          const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocation(fallback);
          localStorage.setItem("deliveryLocation", fallback);
        }
      },
      () => {
        // User denied geolocation — leave empty for manual input
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  }, []);

  // Close suggestions on outside click. Only the search dropdown is handled
  // here: the search suggestions share state with the (disabled) location
  // dropdown, and clearing them from a document mousedown unmounted the
  // dropdown between mousedown and click, so a suggestion click never fired.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matched: SearchSuggestion[] = [];

    restaurants.forEach((r) => {
      const name = r.restaurantName || "";
      const cuisines = ((r as RestaurantDetail).cuisine || []).join(", ");
      const location = r.location || "";

      if (name.toLowerCase().includes(q)) {
        matched.push({ name, sub: location || cuisines });
      }
    });

    // Also match by cuisine/category
    if (matched.length < 5) {
      restaurants.forEach((r) => {
        const name = r.restaurantName || "";
        const cuisines = ((r as RestaurantDetail).cuisine || []).join(" ").toLowerCase();
        const location = r.location || "";
        if (
          cuisines.includes(q) &&
          !matched.some((m) => m.name === name)
        ) {
          matched.push({ name, sub: `${cuisines} • ${location}` });
        }
      });
    }

    // Also match by location
    if (matched.length < 5) {
      restaurants.forEach((r) => {
        const name = r.restaurantName || "";
        const location = (r.location || "").toLowerCase();
        if (
          location.includes(q) &&
          !matched.some((m) => m.name === name)
        ) {
          matched.push({ name, sub: r.location || "" });
        }
      });
    }

    setSuggestions(matched.slice(0, 6));
  }, [searchQuery, restaurants]);

  // Generate location suggestions from restaurant locations
  const locationSuggestions = Array.from(
    new Set(restaurants.map((r) => r.location).filter(Boolean))
  )
    .filter((loc) => loc!.toLowerCase().includes(location.toLowerCase()))
    .slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(false);
    router.push(`/restaurants?search=${encodeURIComponent(value)}`);
  };

  const handleLocationSelect = (loc: string) => {
    setLocation(loc);
    localStorage.setItem("deliveryLocation", loc);
    setSuggestions([]);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "";
          const state = data.address?.state || "";
          const display = city
            ? `${city}${state ? ", " + state : ""}`
            : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocation(display);
          localStorage.setItem("deliveryLocation", display);
        } catch {
          toast.error("Couldn't fetch your address. Using coordinates instead.");
          const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocation(fallback);
          localStorage.setItem("deliveryLocation", fallback);
        }
      },
      () => {
        toast.error("Unable to detect location. Please enter it manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const clearLocation = () => {
    setLocation("");
    localStorage.removeItem("deliveryLocation");
  };

  return (
    <section className="relative w-full bg-[#FF5200] px-4 pt-10 pb-16 md:px-12 lg:px-20 overflow-hidden">
      {/* Decorative Image Left */}
      <div className="absolute left-0 top-0 hidden md:block w-48 lg:w-64 -translate-x-6 pointer-events-none">
        <img
          src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Veggies_new.png"
          alt="Fresh Groceries"
          className="w-full h-auto object-contain opacity-90 drop-shadow-lg rounded-r-3xl"
        />
      </div>

      {/* Decorative Image Right */}
      <div className="absolute right-0 top-0 hidden md:block w-48 lg:w-64 translate-x-6 pointer-events-none">
        <img
          src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Sushi_replace.png"
          alt="Sushi Dish"
          className="w-full h-auto object-contain opacity-90 drop-shadow-lg rounded-l-3xl"
        />
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10">
        {/* Title */}
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center leading-tight tracking-tight max-w-3xl">
          Order food & groceries. Discover best restaurants. Swiggy it!
        </h1>

        {/* Input Controls Bar */}
        <div className="w-full max-w-3xl mt-8 flex flex-col sm:flex-row items-center gap-3">
          {/* Location Selector */}
          <div className="relative w-full sm:w-1/3" ref={locationRef}>
            <div className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-sm border border-transparent focus-within:border-black transition">
              <div className="flex items-center gap-2 overflow-hidden flex-1">
                <MapPin className="w-5 h-5 text-[#FF5200] shrink-0" />
                <input
                  suppressHydrationWarning
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    localStorage.setItem("deliveryLocation", e.target.value);
                  }}
                  onFocus={() => location.length > 0 && setSuggestions([])}
                  placeholder="Enter your delivery location"
                  className="w-full text-sm font-medium text-gray-800 focus:outline-none bg-transparent truncate placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {location && (
                  <button
                    suppressHydrationWarning
                    onClick={clearLocation}
                    className="p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}
                <button
                  suppressHydrationWarning
                  onClick={handleDetectLocation}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                  title="Detect my location"
                >
                  <Navigation className="w-4 h-4 text-[#FF5200]" />
                </button>
              </div>
            </div>

            {/* Location Suggestions */}
            {/* {locationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                {locationSuggestions.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLocationSelect(loc!)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF5200] transition text-left"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {loc}
                  </button>
                ))}
              </div>
            )} */}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-2/3" ref={searchRef}>
            <form onSubmit={handleSearch} className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-sm border border-transparent focus-within:border-black transition">
              <input
                suppressHydrationWarning
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search for restaurant, item or more"
                className="w-full text-sm font-medium text-gray-800 focus:outline-none bg-transparent placeholder:text-gray-400"
              />
              <button suppressHydrationWarning type="submit" className="shrink-0 ml-2">
                <Search className="w-5 h-5 text-gray-400 hover:text-[#FF5200] transition" />
              </button>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                {suggestions.map((s, i) => (
                  <button
                    key={`${s.name}-${i}`}
                    type="button"
                    onClick={() => handleSuggestionClick(s.name)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-orange-50 transition"
                  >
                    <Search className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                      {s.sub && (
                        <p className="text-[11px] text-gray-400 truncate">{s.sub}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Service Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {SERVICES.map((service) => (
            <button
              suppressHydrationWarning
              key={service.title}
              onClick={() => router.push(service.href)}
              className="bg-white rounded-3xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200 text-left"
            >
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-tight">
                  {service.title}
                </h2>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
                  {service.subtitle}
                </p>
                <span className="inline-block mt-3 px-2.5 py-1 bg-orange-50 text-[#FF5200] text-[11px] font-extrabold rounded-md uppercase">
                  <AnimatedShinyText className="mx-0 max-w-none text-[#FF5200]/80 dark:text-[#FF5200]/80">
                    {service.offer}
                  </AnimatedShinyText>
                </span>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div className="w-9 h-9 rounded-full bg-[#FF5200] text-white flex items-center justify-center group-hover:bg-orange-600 transition">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div className="w-28 h-28 relative flex-shrink-0">
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="w-full h-full object-cover rounded-full shadow-md group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
