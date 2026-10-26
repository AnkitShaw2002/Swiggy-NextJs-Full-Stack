"use client";

import {
    Store,
    ShoppingBag,
    CheckCircle2,
    Clock,
    TrendingUp,
    Utensils,
} from "lucide-react";
import {
    FoodItem,
    Order,
    Restaurant,
} from "@/features/typescript/restaurant.type";
import { useDashboard } from "@/features/hooks/admin/admin.hook";
import Pagination from "@/component/common/pagination";
import {
    SkeletonCard,
    TableSkeleton,
} from "@/component/common/skeleton";

const PAGE_SIZE = 5;

export default function DashboardView({
    initialOrders,
    initialPendingRestaurants,
    initialApprovedRestaurants,
    initialPendingFoods,
}: {
    initialOrders: Order[] | null;
    initialPendingRestaurants: Restaurant[] | null;
    initialApprovedRestaurants: Restaurant[] | null;
    initialPendingFoods: FoodItem[] | null;
}) {
    const {
        orders,
        pendingRestaurants,
        approvedRestaurants,
        pendingFoods,
        loading,
        page,
        setPage,
    } = useDashboard({
        initialOrders,
        initialPendingRestaurants,
        initialApprovedRestaurants,
        initialPendingFoods,
    });

    const totalRestaurants = approvedRestaurants.length + pendingRestaurants.length;
    const pendingRestaurantCount = pendingRestaurants.length;
    const approvedRestaurantCount = approvedRestaurants.length;
    const pendingFoodCount = pendingFoods.length;
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
    const pendingOrders = orders.filter((o) => o.status === "placed").length;

    const stats = [
        {
            label: "Total Restaurants",
            value: totalRestaurants,
            icon: Store,
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Pending Approvals",
            value: pendingRestaurantCount,
            icon: Clock,
            color: "bg-amber-50 text-amber-600",
        },
        {
            label: "Approved Restaurants",
            value: approvedRestaurantCount,
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Total Orders",
            value: totalOrders,
            icon: ShoppingBag,
            color: "bg-purple-50 text-purple-600",
        },
    ];

    const quickStats = [
        {
            label: "Pending Food Items",
            value: pendingFoodCount,
            icon: Utensils,
            color: "text-amber-600",
        },
        {
            label: "Pending Orders",
            value: pendingOrders,
            icon: Clock,
            color: "text-orange-600",
        },
        {
            label: "Delivered Orders",
            value: deliveredOrders,
            icon: CheckCircle2,
            color: "text-emerald-600",
        },
    ];

    const pageCount = Math.ceil(orders.length / PAGE_SIZE);
    const currentPage = pageCount > 0 ? Math.min(page, pageCount) : 1;
    const recentOrders = orders.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const statusColors: Record<string, string> = {
        placed: "bg-amber-50 text-amber-700",
        accepted: "bg-blue-50 text-blue-700",
        preparing: "bg-purple-50 text-purple-700",
        out_for_delivery: "bg-indigo-50 text-indigo-700",
        delivered: "bg-emerald-50 text-emerald-700",
        cancelled: "bg-rose-50 text-rose-700",
    };

    return (
        <div className="flex min-h-screen bg-[#F7F7F5] text-[#282C3F]">
            <div className="flex-1 md:ml-64">
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/90 px-8 py-4 backdrop-blur">
                    <div>
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                        <p className="text-sm text-gray-400">Overview of your admin panel</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#282C3F] text-xs font-semibold text-white">
                        AD
                    </div>
                </header>

                <main className="px-8 py-6">
                    {/* MAIN STATS */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {loading
                            ? Array.from({ length: 4 }).map((_, index) => (
                                  <SkeletonCard key={index} />
                              ))
                            : stats.map((stat) => {
                                  const Icon = stat.icon;
                                  return (
                                      <div
                                          key={stat.label}
                                          className="rounded-xl border border-black/5 bg-white p-5"
                                      >
                                          <div className="flex items-center justify-between">
                                              <p className="text-sm text-gray-400">{stat.label}</p>
                                              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                                                  <Icon className="h-[18px] w-[18px]" />
                                              </div>
                                          </div>
                                          <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
                                      </div>
                                  );
                              })}
                    </div>

                    {/* QUICK STATS */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        {loading
                            ? Array.from({ length: 3 }).map((_, index) => (
                                  <SkeletonCard key={index} />
                              ))
                            : quickStats.map((stat) => {
                                  const Icon = stat.icon;
                                  return (
                                      <div
                                          key={stat.label}
                                          className="flex items-center gap-4 rounded-xl border border-black/5 bg-white p-5"
                                      >
                                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 ${stat.color}`}>
                                              <Icon className="h-5 w-5" />
                                          </div>
                                          <div>
                                              <p className="text-sm text-gray-400">{stat.label}</p>
                                              <p className="text-2xl font-semibold">{stat.value}</p>
                                          </div>
                                      </div>
                                  );
                              })}
                    </div>

                    {/* RECENT ORDERS */}
                    <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
                        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                            <p className="text-sm font-semibold text-gray-700">Recent Orders</p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <TrendingUp className="h-3.5 w-3.5" />
                                Latest orders
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        <th className="px-5 py-3">Order ID</th>
                                        <th className="px-5 py-3">Customer</th>
                                        <th className="px-5 py-3">Restaurant</th>
                                        <th className="px-5 py-3">Amount</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && <TableSkeleton rows={5} columns={5} />}

                                    {!loading && recentOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                                                No orders found
                                            </td>
                                        </tr>
                                    )}

                                    {!loading &&
                                        recentOrders.map((order) => (
                                            <tr
                                                key={order._id}
                                                className="border-b border-black/5 last:border-0 hover:bg-gray-50/60"
                                            >
                                                <td className="px-5 py-4 font-medium">
                                                    {order._id.slice(-8).toUpperCase()}
                                                </td>
                                                <td className="px-5 py-4 text-gray-600">
                                                    {order.user?.full_name || "N/A"}
                                                </td>
                                                <td className="px-5 py-4 text-gray-600">
                                                    {order.restaurant?.restaurantName || "N/A"}
                                                </td>
                                                <td className="px-5 py-4 font-medium">
                                                    ₹{order.totalAmount}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-500"}`}
                                                    >
                                                        {order.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {!loading && orders.length > 0 && (
                            <Pagination
                                pageCount={pageCount}
                                currentPage={currentPage}
                                onPageChange={setPage}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
