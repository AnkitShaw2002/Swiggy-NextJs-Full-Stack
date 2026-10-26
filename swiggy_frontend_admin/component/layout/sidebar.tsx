"use client";

import React from "react";
import {
    LayoutDashboard,
    ShoppingBag,
    Store,
    Clock,
    CheckCircle2,
    LogOut,
    Utensils,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userLogout } from "@/features/redux-toolkit/slice/authSlice";
import { AppDispatch } from "@/features/redux-toolkit/store/store";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const navItems = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Orders", href: "/orders", icon: ShoppingBag },
        { label: "Restaurants", href: "/restaurants", icon: Store },
    ];

    const handleLogout = async () => {
        await dispatch(userLogout());
        router.push("/");
    };

    return (
        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-black/5 bg-white md:flex">

            {/* header */}
            <div className="flex items-center gap-2.5 px-6 py-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FC8019] text-sm font-bold text-white">
                    BN
                </div>
                <div>
                    <p className="text-base font-semibold leading-tight">Swiggy</p>
                    <p className="text-xs text-gray-400">Admin panel</p>
                </div>
            </div>

            {/* nav */}
            <nav className="flex-1 space-y-1 px-3 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition
                ${isActive
                                    ? "bg-orange-50 text-[#FC8019]"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-[#282C3F]"
                                }`}
                        >
                            <Icon className="h-[18px] w-[18px]" />
                            {item.label}
                        </Link>
                    );
                })}

                <p className="px-3 pt-5 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Restaurant Management
                </p>

                <Link
                    href="/restaurantlist"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${pathname === "/restaurantlist"
                        ? "bg-orange-50 text-[#FC8019]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#282C3F]"
                        }`}
                >
                    <Clock className="h-[18px] w-[18px]" />
                    Pending requests
                </Link>

                <Link
                    href="/pendingfood"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${pathname === "/pendingfood"
                        ? "bg-orange-50 text-[#FC8019]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#282C3F]"
                        }`}
                >
                    <Utensils className="h-[18px] w-[18px]" />
                    Pending Food List
                </Link>

                <Link
                    href="/approved"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${pathname === "/approved"
                        ? "bg-orange-50 text-[#FC8019]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#282C3F]"
                        }`}
                >
                    <CheckCircle2 className="h-[18px] w-[18px]" />
                    Approved
                </Link>
            </nav>

            {/* logout */}
            <div className="border-t border-black/5 p-3">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                    <LogOut className="h-4 w-4" />
                    Log out
                </button>
            </div>
        </aside>
    );
}
