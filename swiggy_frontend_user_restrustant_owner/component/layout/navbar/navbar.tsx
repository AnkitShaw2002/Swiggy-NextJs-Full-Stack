"use client";

import NavbarChild from "./props/navbarchild";
import { useAuthStore } from "@/features/store/auth.store";
import { NavLinkItem } from "@/features/typescript/navbar.type";
import { Home, ShoppingBag, LayoutDashboard, Utensils, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/features/store/user.store";
import { useNotificationStore } from "@/features/store/notification.store";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { cart, cartCount, fetchCart } = useUserStore();
  const { notifications, unreadCount, markRead, markAllRead, clearAll } =
    useNotificationStore();

  const userLinks: NavLinkItem[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Restaurants", href: "/restaurants", icon: Utensils },
    { label: "My Orders", href: "/orders", icon: ShoppingBag },
  ];

  const ownerLinks: NavLinkItem[] = [
    { label: "Dashboard", href: "/resturant_owner_dashboard", icon: LayoutDashboard },
    { label: "Menu", href: "/resturant_owner_dashboard/menu", icon: Utensils },
    { label: "Orders", href: "/resturant_owner_dashboard/customer-orders", icon: ClipboardList },
  ];

  const activeLinks = user?.role === "restaurant_owner" ? ownerLinks : userLinks;

  const cartItems = (cart?.items || []).map((item) => ({
    foodName: item.food?.itemName || "Item",
    quantity: item.quantity,
    price: item.price || item.food?.discountPrice || item.food?.basePrice || 0,
    image: item.food?.image,
    isVeg: item.food?.isVeg,
  }));

  const cartTotal = cart?.items?.reduce((sum, item) => sum + (item.price || item.food?.discountPrice || item.food?.basePrice || 0) * item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    router.push("/Login");
    // Purge the client router cache so pages visited while logged in
    // (menus, cart) cannot be re-opened from cache after signing out.
    router.refresh();
  };

  return (
    <NavbarChild
      user={user ? { ...user, name: user.name ?? user.email } : null}
      links={activeLinks}
      onLogout={handleLogout}
      cartItems={user?.role !== "restaurant_owner" ? cartItems : undefined}
      cartTotal={user?.role !== "restaurant_owner" ? cartTotal : undefined}
      onFetchCart={user?.role !== "restaurant_owner" ? fetchCart : undefined}
      notifications={user ? notifications : undefined}
      unreadCount={user ? unreadCount : undefined}
      onMarkRead={user ? markRead : undefined}
      onMarkAllRead={user ? markAllRead : undefined}
      onClearAll={user ? clearAll : undefined}
    />
  );
}