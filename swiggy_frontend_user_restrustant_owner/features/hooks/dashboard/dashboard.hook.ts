"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  History,
} from "lucide-react";
import { useAuthStore } from "@/features/store/auth.store";
import { useRestaurantStore } from "@/features/store/restaurantOwner.store";
import { useNotificationStore } from "@/features/store/notification.store";
import { Food, OrderStatus } from "@/features/typescript/restaurantOwner.type";

// ---------------------------------------------------------------------------
// Dashboard shell (app/(dashboard)/resturant_owner_dashboard/layout.tsx)
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  {
    href: "/resturant_owner_dashboard",
    label: "DASHBOARD",
    icon: LayoutDashboard,
  },
  {
    href: "/resturant_owner_dashboard/customer-orders",
    label: "ORDERS",
    icon: ShoppingBag,
  },
  {
    href: "/resturant_owner_dashboard/menu",
    label: "MENU",
    icon: UtensilsCrossed,
  },
  {
    href: "/resturant_owner_dashboard/order-history",
    label: "ORDER HISTORY",
    icon: History,
  },
];

export function useDashboardLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const { restaurant, fetchMyRestaurant, updateRestaurantStatus, isLoading } =
    useRestaurantStore();
  const { logout } = useAuthStore();
  const { notifications, unreadCount, markRead, markAllRead, clearAll } =
    useNotificationStore();

  const [isBellOpen, setIsBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close the notification dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setIsBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchMyRestaurant();
  }, [fetchMyRestaurant]);

  const handleNotificationClick = (notificationId: string, orderId?: string) => {
    markRead(notificationId);
    setIsBellOpen(false);
    if (orderId) {
      router.push("/resturant_owner_dashboard/customer-orders");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/Login");
    // Drop cached owner-dashboard payloads so they cannot be reopened
    // from the client router cache after signing out.
    router.refresh();
  };

  const handleToggleStatus = async () => {
    if (!restaurant) return;
    try {
      await updateRestaurantStatus(!restaurant.isOpen);
    } catch {
      // Toast handles error automatically from store
    }
  };

  // Format header location safely
  const formattedLocation =
    typeof restaurant?.location === "string" ? restaurant.location : "--";

  // Determine active section label from sidebar nav
  const activeNav = NAV_ITEMS.find((item) => pathname === item.href);
  const activeLabel = activeNav?.label || "DASHBOARD";

  return {
    pathname,
    navItems: NAV_ITEMS,
    activeLabel,
    restaurant,
    isLoading,
    formattedLocation,
    notifications,
    unreadCount,
    markAllRead,
    clearAll,
    isBellOpen,
    setIsBellOpen,
    bellRef,
    handleNotificationClick,
    handleLogout,
    handleToggleStatus,
  };
}

// ---------------------------------------------------------------------------
// Dashboard overview (app/(dashboard)/resturant_owner_dashboard/page.tsx)
// ---------------------------------------------------------------------------

export function useDashboardOverview() {
  const {
    restaurant,
    foods,
    pendingFoodCount,
    fetchFoods,
    fetchPendingFoodCount,
    updateRestaurantStatus,
    isLoading,
  } = useRestaurantStore();

  useEffect(() => {
    fetchFoods({ page: 1, limit: 100 });
    fetchPendingFoodCount();
  }, [fetchFoods, fetchPendingFoodCount]);

  // Compute Food Metrics
  const activeCount = foods.filter((f) => f.isAvailable).length;
  const outOfStockCount = foods.filter((f) => !f.isAvailable).length;

  // Format Address from restaurant Object
  const addressString =
    typeof restaurant?.location === "string" ? restaurant.location : "--";

  const handleToggleStatus = () => {
    void updateRestaurantStatus(!restaurant?.isOpen);
  };

  return {
    restaurant,
    isLoading,
    pendingFoodCount,
    activeCount,
    outOfStockCount,
    addressString,
    handleToggleStatus,
  };
}

// ---------------------------------------------------------------------------
// Customer orders (app/(dashboard)/resturant_owner_dashboard/customer-orders/page.tsx)
// ---------------------------------------------------------------------------

export const ORDER_STATUS_PILLS: Record<OrderStatus, string> = {
  placed: "bg-amber-600",
  accepted: "bg-sky-600",
  preparing: "bg-[#4285f4]",
  out_for_delivery: "bg-purple-600",
  delivered: "bg-emerald-600",
  cancelled: "bg-red-600",
};

export const ORDER_STATUS_COUNT_BG: Record<OrderStatus, string> = {
  placed: "bg-amber-800",
  accepted: "bg-sky-800",
  preparing: "bg-[#1a56c4]",
  out_for_delivery: "bg-purple-800",
  delivered: "bg-emerald-800",
  cancelled: "bg-red-800",
};

export type FilterKey = "all" | OrderStatus;

/** Delivered & cancelled orders live in the Order History page. */
const INACTIVE_STATUSES: OrderStatus[] = ["delivered", "cancelled"];

export const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "placed", label: "NEW" },
  { key: "accepted", label: "ACCEPTED" },
  { key: "preparing", label: "PREPARING" },
  { key: "out_for_delivery", label: "OUT FOR DELIVERY" },
];

export const SUMMARY_TABS: { key: OrderStatus; label: string }[] = [
  { key: "placed", label: "NEW ORDERS" },
  { key: "accepted", label: "ACCEPTED" },
  { key: "preparing", label: "PREPARING" },
  { key: "out_for_delivery", label: "OUT FOR DELIVERY" },
];

export function useCustomerOrdersPage() {
  const { orders, isLoading, updatingOrderIds, fetchOrders, updateOrderStatus } =
    useRestaurantStore();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const activeOrders = useMemo(
    () => orders.filter((order) => !INACTIVE_STATUSES.includes(order.status)),
    [orders]
  );

  const counts = useMemo(() => {
    const map: Partial<Record<OrderStatus, number>> = {
      placed: 0,
      accepted: 0,
      preparing: 0,
      out_for_delivery: 0,
    };
    activeOrders.forEach((order) => {
      if (map[order.status] !== undefined) map[order.status]! += 1;
    });
    return map;
  }, [activeOrders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return activeOrders;
    return activeOrders.filter((order) => order.status === activeFilter);
  }, [activeOrders, activeFilter]);

  const handleUpdate = async (orderId: string, status: OrderStatus) => {
    if (status === "cancelled") {
      const result = await Swal.fire({
        title: "Cancel Order?",
        text: "Are you sure you want to cancel this order? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, cancel it!",
        cancelButtonText: "Keep order",
      });

      if (!result.isConfirmed) return;
    }

    try {
      await updateOrderStatus(orderId, status);
    } catch {
      // Store handles toast errors
    }
  };

  const handleStatusChange = async (orderId: string, value: string) => {
    if (!value) return;

    setSelectedStatus((prev) => ({ ...prev, [orderId]: value }));
    try {
      await handleUpdate(orderId, value as OrderStatus);
    } finally {
      setSelectedStatus((prev) => ({ ...prev, [orderId]: "" }));
    }
  };

  return {
    orders,
    isLoading,
    updatingOrderIds,
    activeFilter,
    setActiveFilter,
    selectedStatus,
    counts,
    filteredOrders,
    handleStatusChange,
  };
}

// ---------------------------------------------------------------------------
// Menu list (app/(dashboard)/resturant_owner_dashboard/menu/page.tsx)
// ---------------------------------------------------------------------------

export const ALL_CATEGORIES = "ALL CATEGORIES";

export function useMenuPage() {
  const { foods, isLoading, fetchFoods, toggleFoodAvailability, deleteFood } =
    useRestaurantStore();

  const [activeTab, setActiveTab] = useState<"MY_MENU" | "HISTORY">("MY_MENU");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORIES);

  useEffect(() => {
    fetchFoods({ page: 1, limit: 100 });
  }, [fetchFoods]);

  // Extract unique categories from backend foods array
  const categories = useMemo(() => {
    const cats = new Set<string>();
    foods.forEach((food) => {
      const catName = food.category || food.foodType || "Uncategorized";
      cats.add(catName);
    });
    return Array.from(cats);
  }, [foods]);

  // Item count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    foods.forEach((food) => {
      const catName = food.category || food.foodType || "Uncategorized";
      counts[catName] = (counts[catName] || 0) + 1;
    });
    return counts;
  }, [foods]);

  // Compute counts for top action badges
  const outOfStockCount = useMemo(
    () => foods.filter((f) => !f.isAvailable).length,
    [foods]
  );

  const disabledCount = useMemo(
    () => foods.filter((f) => f.approvalStatus === "rejected").length,
    [foods]
  );

  // Filter foods based on category and search query
  const filteredFoods = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return foods.filter((food) => {
      const foodCat = food.category || food.foodType || "Uncategorized";
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES || foodCat === selectedCategory;
      const matchesSearch =
        !query ||
        food.itemName?.toLowerCase().includes(query) ||
        foodCat.toLowerCase().includes(query) ||
        food.description?.toLowerCase().includes(query) ||
        food.cuisine?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [foods, selectedCategory, searchQuery]);

  // Group filtered foods by category (used by the ALL CATEGORIES view)
  const groupedFoods = useMemo(() => {
    if (selectedCategory !== ALL_CATEGORIES) return null;
    const map = new Map<string, Food[]>();
    filteredFoods.forEach((food) => {
      const cat = food.category || food.foodType || "Uncategorized";
      const list = map.get(cat);
      if (list) list.push(food);
      else map.set(cat, [food]);
    });
    return Array.from(map.entries());
  }, [selectedCategory, filteredFoods]);

  const handleToggle = async (id: string) => {
    try {
      await toggleFoodAvailability(id);
    } catch {
      // Store handles toast errors
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    const result = await Swal.fire({
      title: "Delete Item?",
      html: `Are you sure you want to delete <strong>${itemName}</strong>?<br/>This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteFood(id);
      } catch {
        // Store handles toast errors
      }
    }
  };

  return {
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
  };
}

// ---------------------------------------------------------------------------
// Add / Edit food (menu/add and menu/edit/[id])
// ---------------------------------------------------------------------------

export interface FoodFormState {
  itemName: string;
  description: string;
  category: string;
  cuisine: string;
  foodType: string;
  isVeg: boolean;
  basePrice: string;
  gst: string;
  isAvailable: boolean;
}

const INITIAL_FOOD_FORM: FoodFormState = {
  itemName: "",
  description: "",
  category: "",
  cuisine: "",
  foodType: "Main Course",
  isVeg: true,
  basePrice: "",
  gst: "5",
  isAvailable: true,
};

type FoodFormChange = ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

function useFoodForm() {
  const [form, setForm] = useState<FoodFormState>(INITIAL_FOOD_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: FoodFormChange) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return {
    form,
    setForm,
    image,
    setImage,
    submitting,
    setSubmitting,
    handleChange,
  };
}

function buildFoodFormData(form: FoodFormState, image: File | null) {
  const formData = new FormData();
  formData.append("itemName", form.itemName);
  formData.append("description", form.description);
  formData.append("category", form.category);
  formData.append("cuisine", form.cuisine);
  formData.append("foodType", form.foodType);
  formData.append("isVeg", String(form.isVeg));
  formData.append("basePrice", form.basePrice);
  formData.append("gst", form.gst || "0");
  formData.append("isAvailable", String(form.isAvailable));
  if (image) formData.append("image", image);
  return formData;
}

export function useAddFoodPage() {
  const router = useRouter();
  const { addFood, isLoading } = useRestaurantStore();
  const foodForm = useFoodForm();

  const handleBack = () => router.back();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!foodForm.form.itemName || !foodForm.form.basePrice) return;

    const result = await Swal.fire({
      title: "Add New Item?",
      html: `Are you sure you want to add <strong>${foodForm.form.itemName}</strong> to your menu?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#fc8019",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, add it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    foodForm.setSubmitting(true);
    try {
      await addFood(buildFoodFormData(foodForm.form, foodForm.image));
      router.push("/resturant_owner_dashboard/menu");
    } catch {
      // handled by store
    } finally {
      foodForm.setSubmitting(false);
    }
  };

  return {
    isLoading,
    handleBack,
    handleSubmit,
    ...foodForm,
  };
}

export function useEditFoodPage() {
  const router = useRouter();
  const params = useParams();
  const foodId = params.id as string;

  const { fetchFoodById, editFood, isLoading } = useRestaurantStore();
  const foodForm = useFoodForm();
  const [loadingFood, setLoadingFood] = useState(true);

  useEffect(() => {
    if (!foodId) return;
    const loadFood = async () => {
      try {
        const food = await fetchFoodById(foodId);
        foodForm.setForm({
          itemName: food.itemName || "",
          description: food.description || "",
          category: food.category || "",
          cuisine: food.cuisine || "",
          foodType: food.foodType || "Main Course",
          isVeg: food.isVeg ?? true,
          basePrice: String(food.basePrice || ""),
          gst: String(food.gst ?? 5),
          isAvailable: food.isAvailable ?? true,
        });
      } catch {
        // Store handles toast errors
      } finally {
        setLoadingFood(false);
      }
    };
    loadFood();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foodId, fetchFoodById]);

  const handleBack = () => router.back();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!foodForm.form.itemName || !foodForm.form.basePrice) return;

    const result = await Swal.fire({
      title: "Update Item?",
      html: `Are you sure you want to update <strong>${foodForm.form.itemName}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#fc8019",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    foodForm.setSubmitting(true);
    try {
      await editFood(foodId, buildFoodFormData(foodForm.form, foodForm.image));
      router.push("/resturant_owner_dashboard/menu");
    } catch {
      // handled by store
    } finally {
      foodForm.setSubmitting(false);
    }
  };

  return {
    foodId,
    isLoading,
    loadingFood,
    handleBack,
    handleSubmit,
    ...foodForm,
  };
}
