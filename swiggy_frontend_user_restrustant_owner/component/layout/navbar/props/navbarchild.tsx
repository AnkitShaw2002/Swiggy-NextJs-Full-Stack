"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { NavbarChildProps } from "@/features/typescript/navbar.type";
import {
  ArrowUpRight,
  LogOut,
  ChevronDown,
  ShoppingBag,
  Minus,
  Plus,
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getImageUrl } from "@/services/axios/axiosInstance";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { AppNotification } from "@/features/typescript/notification.type";
import { timeAgo } from "@/lib/utils";
import VegNonVegMark from "@/component/common/VegNonVegMark";

export default function NavbarChild({
  user,
  links,
  onLogout,
  cartItems = [],
  cartTotal = 0,
  onFetchCart,
  notifications = [],
  unreadCount = 0,
  onMarkRead,
  onMarkAllRead,
  onClearAll,
}: NavbarChildProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  const totalCartQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setIsCartOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setIsBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch cart when dropdown opens
  useEffect(() => {
    if (isCartOpen && onFetchCart) {
      onFetchCart();
    }
  }, [isCartOpen, onFetchCart]);

  const handleNotificationClick = (notification: AppNotification) => {
    onMarkRead?.(notification.id);
    setIsBellOpen(false);
    if (notification.orderId) {
      router.push(`/orders/${notification.orderId}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FF5200] text-white shadow-lg shadow-orange-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <svg
                viewBox="0 0 512 512"
                className="w-6 h-6 fill-[#FF5200]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M256 32c-64 0-112 48-112 112 0 88 112 208 112 208s112-120 112-208c0-64-48-112-112-112zm0 160c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight hidden sm:block">
              Swiggy
            </span>
          </Link>

          {user && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 uppercase tracking-wider hidden md:inline-block ml-1">
              {user.role === "restaurant_owner" ? "Owner" : "Customer"}
            </span>
          )}
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Static Links */}
          <Link
            href="/corporate"
            className="hidden lg:inline-block text-sm font-bold text-white/90 hover:text-white transition"
          >
            Corporate
          </Link>

          <Link
            href="/apply"
            className="hidden sm:inline-block text-sm font-bold text-white/90 hover:text-white transition"
          >
            Partner with us
          </Link>

          <Link
            href="/download-app"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white border-2 border-white/80 rounded-xl hover:bg-white/10 transition"
          >
            <AnimatedShinyText className="mx-0 max-w-none text-white/80 dark:text-white/80">
              Get App
            </AnimatedShinyText>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>

          <AnimatedThemeToggler
            variant="circle"
            className="p-2 rounded-xl text-white hover:bg-white/10 transition"
          />

          {/* Notification Bell - Only for logged-in users */}
          {user && (
            <div className="relative" ref={bellRef}>
              <button
                suppressHydrationWarning
                onClick={() => {
                  setIsBellOpen(!isBellOpen);
                  setIsCartOpen(false);
                  setIsMenuOpen(false);
                }}
                aria-label="Notifications"
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-white text-[#FF5200] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <span className="text-sm font-bold hidden sm:inline">Updates</span>
              </button>

              {/* Notification Dropdown */}
              {isBellOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {/* Header */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-[#FF5200] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && onMarkAllRead && (
                        <button
                          onClick={onMarkAllRead}
                          title="Mark all as read"
                          className="flex items-center gap-1 text-[11px] font-semibold text-[#FF5200] hover:text-[#e64a00] transition"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Read all
                        </button>
                      )}
                      <button
                        onClick={() => setIsBellOpen(false)}
                        className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                      >
                        &times;
                      </button>
                    </div>
                  </div>

                  {/* Notification List */}
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <BellOff className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-500">No notifications yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Order updates will appear here in real time
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-gray-50 last:border-0 transition hover:bg-gray-50 ${
                              notification.read ? "" : "bg-orange-50/60"
                            }`}
                          >
                            {/* Unread dot / icon */}
                            <span
                              className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                                notification.read ? "bg-gray-200" : "bg-[#FF5200]"
                              }`}
                            />
                            <span className="flex-1 min-w-0">
                              <span className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-gray-900 truncate">
                                  {notification.title}
                                </span>
                                <span className="text-[10px] text-gray-400 shrink-0">
                                  {timeAgo(notification.createdAt)}
                                </span>
                              </span>
                              <span className="block text-xs text-gray-600 mt-0.5 break-words">
                                {notification.message}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Footer */}
                      {onClearAll && (
                        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex justify-end">
                          <button
                            onClick={onClearAll}
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Clear all
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Cart Icon - Only for customers */}
          {user && user.role !== "restaurant_owner" && (
            <div className="relative" ref={cartRef}>
              <button
                suppressHydrationWarning
                onClick={() => {
                  setIsCartOpen(!isCartOpen);
                  setIsBellOpen(false);
                  setIsMenuOpen(false);
                }}
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartQty > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#FF5200] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                    {totalCartQty}
                  </span>
                )}
                <span className="text-sm font-bold hidden sm:inline">Cart</span>
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {/* Header */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">
                      My Cart ({totalCartQty} item{totalCartQty !== 1 ? "s" : ""})
                    </h3>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Cart Items */}
                  {cartItems.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-500">Your cart is empty</p>
                      <p className="text-xs text-gray-400 mt-1">Add items to get started</p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-64 overflow-y-auto">
                        {cartItems.map((item, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 flex items-center gap-3 border-b border-gray-50 last:border-0"
                          >
                            {/* Food Image */}
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              {item.image ? (
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.foodName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                                  No img
                                </div>
                              )}
                            </div>

                            {/* Item Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1.5">
                                <VegNonVegMark isVeg={item.isVeg} size={13} />
                                {item.foodName}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs font-bold text-gray-900">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-600">Total</span>
                          <span className="text-base font-extrabold text-gray-900">₹{cartTotal}</span>
                        </div>
                        <Link
                          href="/cart"
                          onClick={() => setIsCartOpen(false)}
                          className="block w-full text-center bg-[#FF5200] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#e64a00] transition"
                        >
                          View Cart
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Auth Section */}
          {!user ? (
            <Link
              href="/Login"
              className="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-black/80 transition shadow-md"
            >
              <AnimatedShinyText className="mx-0 max-w-none text-white/80 dark:text-white/80">
                Sign in
              </AnimatedShinyText>
            </Link>
          ) : (
            /* User Profile Menu */
            <div className="relative" ref={menuRef}>
              <button
                suppressHydrationWarning
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setIsCartOpen(false);
                  setIsBellOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/20 hover:bg-black/30 transition"
              >
                <div className="w-8 h-8 bg-white text-[#FF5200] rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold hidden sm:inline">{user.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-2xl shadow-xl py-2 z-50 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold truncate mt-0.5">{user.email}</p>
                  </div>

                  {links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition ${
                          pathname === link.href
                            ? "text-[#FF5200] bg-orange-50 font-bold"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{link.label}</span>
                        {link.badge !== undefined && link.badge > 0 && (
                          <span className="ml-auto bg-[#FF5200] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition text-left border-t border-gray-100 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
