"use client";

import React from "react";
import Link from "next/link";
import {
  Store,
  LogOut,
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { timeAgo } from "@/lib/utils";
import RestaurantSocket from "@/component/socket/restaurantSocket";
import { useDashboardLayout } from "@/features/hooks/dashboard/dashboard.hook";

export default function RestaurantOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    pathname,
    navItems,
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
  } = useDashboardLayout();

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-gray-800 antialiased flex flex-col font-sans">
      <RestaurantSocket />
      {/* TOP BAR / HEADER */}
      <header className="h-16 bg-[#1e232a] text-white flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 border-b border-gray-800 shadow-md">
        <div className="flex items-center gap-5">
          {/* Active Section Title */}
          <span className="text-sm font-bold uppercase tracking-wider text-gray-200">
            {activeLabel}
          </span>
          <span className="text-gray-600 font-light text-lg">|</span>

          {/* REAL-TIME ONLINE/OFFLINE TOGGLE */}
          <div className="flex items-center gap-2.5 bg-[#2b323b] px-3 py-1.5 rounded-full border border-gray-700 shadow-inner">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(restaurant?.isOpen)}
                onChange={handleToggleStatus}
                disabled={!restaurant || isLoading}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
            <span
              className={`text-xs font-bold tracking-wide uppercase ${
                restaurant?.isOpen ? "text-emerald-400" : "text-gray-400"
              }`}
            >
              {restaurant?.isOpen ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          {/* Restaurant Header Information */}
          <div className="flex flex-col justify-center ml-1">
            <span className="text-base font-extrabold text-white leading-snug">
              {restaurant?.restaurantName || (isLoading ? "Loading..." : "No Restaurant Found")}
            </span>
            <span className="text-xs text-gray-300 font-medium tracking-wide">
              <span>{formattedLocation}</span> &bull;{" "}
              <span className="text-gray-400">
                ID: <span>{restaurant?._id ? restaurant._id.slice(-6).toUpperCase() : "--"}</span>
              </span>
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-5">
          {/* Notification Bell */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setIsBellOpen(!isBellOpen)}
              aria-label="Notifications"
              className="relative p-2 text-gray-300 hover:text-white transition rounded-full hover:bg-gray-800/60 flex items-center justify-center"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#fc8019] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[#1e232a]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : (
                notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#fc8019] rounded-full ring-2 ring-[#1e232a]" />
                )
              )}
            </button>

            {/* Notification Dropdown */}
            {isBellOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#1e232a] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                {/* Header */}
                <div className="px-4 py-3 bg-[#2b323b] border-b border-gray-700 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-[#fc8019] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        title="Mark all as read"
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#fc8019] hover:text-white transition"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Read all
                      </button>
                    )}
                    <button
                      onClick={() => setIsBellOpen(false)}
                      className="text-gray-400 hover:text-white text-lg leading-none"
                    >
                      &times;
                    </button>
                  </div>
                </div>

                {/* Notification List */}
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <BellOff className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-400">No notifications yet</p>
                    <p className="text-xs text-gray-500 mt-1">
                      New orders and updates will appear here
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() =>
                            handleNotificationClick(notification.id, notification.orderId)
                          }
                          className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-gray-700/60 last:border-0 transition hover:bg-[#2b323b] ${
                            notification.read ? "" : "bg-[#2b323b]/60"
                          }`}
                        >
                          <span
                            className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                              notification.read ? "bg-gray-600" : "bg-[#fc8019]"
                            }`}
                          />
                          <span className="flex-1 min-w-0">
                            <span className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-white truncate">
                                {notification.title}
                              </span>
                              <span className="text-[10px] text-gray-500 shrink-0">
                                {timeAgo(notification.createdAt)}
                              </span>
                            </span>
                            <span className="block text-xs text-gray-400 mt-0.5 break-words">
                              {notification.message}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2.5 bg-[#2b323b] border-t border-gray-700 flex justify-end">
                      <button
                        onClick={clearAll}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear all
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button className="bg-[#fc8019] hover:bg-[#e06f12] text-white text-xs font-bold px-4 py-2 rounded-md transition shadow-xs tracking-wider">
            FAQS
          </button>
        </div>
      </header>

      {/* MAIN WRAPPER */}
      <div className="flex pt-16 min-h-screen">
        {/* DARK THEME SIDEBAR */}
        <aside className="w-20 bg-[#12161a] text-gray-400 flex flex-col items-center justify-between py-4 fixed top-16 bottom-0 left-0 z-40 border-r border-gray-800">
          {/* Top Section Nav Links */}
          <div className="w-full flex flex-col items-center space-y-4">
            {/* Brand Logo / Icon */}
            <div className="w-10 h-10 rounded-full bg-[#fc8019] flex items-center justify-center text-white mb-2 shadow-sm">
              <Store className="w-5 h-5" />
            </div>

            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 w-full py-2.5 transition ${
                    active
                      ? "bg-[#1e232a] text-[#fc8019] border-l-2 border-[#fc8019]"
                      : "hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-bold tracking-tight text-center leading-tight">
                    {item.label === "ORDER HISTORY" ? (
                      <>
                        ORDER
                        <br />
                        HISTORY
                      </>
                    ) : (
                      item.label
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Bottom Section Logout Button */}
          <div className="w-full pt-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 w-full py-2 text-gray-400 hover:text-red-400 transition cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight">LOGOUT</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 ml-20 p-6 space-y-5 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
