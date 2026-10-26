"use client";

import {
    Search,
    Package,
    Truck,
    CheckCircle2,
    XCircle,
    CookingPot,
} from "lucide-react";
import { Order, OrderStatus } from "@/features/typescript/restaurant.type";
import { useOrders } from "@/features/hooks/admin/admin.hook";
import Pagination from "@/component/common/pagination";
import { TableSkeleton } from "@/component/common/skeleton";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
    { value: "placed", label: "Placed" },
    { value: "accepted", label: "Accepted" },
    { value: "preparing", label: "Preparing" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

const STATUS_COLORS: Record<string, string> = {
    placed: "bg-amber-50 text-amber-700",
    accepted: "bg-blue-50 text-blue-700",
    preparing: "bg-purple-50 text-purple-700",
    out_for_delivery: "bg-indigo-50 text-indigo-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-rose-50 text-rose-700",
};

const STATUS_ICONS: Record<string, typeof Package> = {
    placed: Package,
    accepted: CheckCircle2,
    preparing: CookingPot,
    out_for_delivery: Truck,
    delivered: CheckCircle2,
    cancelled: XCircle,
};

export default function OrdersView({
    initialOrders,
}: {
    initialOrders: Order[] | null;
}) {
    const {
        orders,
        loading,
        query,
        setQuery,
        statusFilter,
        setStatusFilter,
        page,
        setPage,
    } = useOrders(initialOrders);

    const filtered = orders.filter((order: Order) => {
        const matchesSearch =
            order._id?.toLowerCase().includes(query.toLowerCase()) ||
            order.user?.full_name?.toLowerCase().includes(query.toLowerCase()) ||
            order.restaurant?.restaurantName?.toLowerCase().includes(query.toLowerCase()) ||
            order.address?.toLowerCase().includes(query.toLowerCase());

        const matchesStatus = statusFilter === "all" || (order.status || "").toLowerCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const statusCounts = orders.reduce((acc, order) => {
        const key = (order.status || "").toLowerCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
    const currentPage = pageCount > 0 ? Math.min(page, pageCount) : 1;
    const pageItems = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleSearch = (value: string) => {
        setQuery(value);
        setPage(1);
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(statusFilter === value ? "all" : value);
        setPage(1);
    };

    return (
        <div className="flex min-h-screen bg-[#F7F7F5] text-[#282C3F]">
            <div className="flex-1 md:ml-64">
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/90 px-8 py-4 backdrop-blur">
                    <div>
                        <h1 className="text-xl font-semibold">Orders</h1>
                        <p className="text-sm text-gray-400">Track current order statuses</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#282C3F] text-xs font-semibold text-white">
                        AD
                    </div>
                </header>

                <main className="px-8 py-6">
                    {/* STATUS CARDS */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {STATUS_OPTIONS.map((status) => {
                            const Icon = STATUS_ICONS[status.value];
                            const count = statusCounts[status.value] || 0;
                            return (
                                <button
                                    key={status.value}
                                    onClick={() => handleStatusFilter(status.value)}
                                    className={`rounded-xl border p-4 text-left transition ${
                                        statusFilter === status.value
                                            ? "border-[#FC8019] bg-orange-50 ring-1 ring-[#FC8019]/20"
                                            : "border-black/5 bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <Icon className={`h-4 w-4 ${STATUS_COLORS[status.value]?.split(" ")[1] || "text-gray-500"}`} />
                                        <span className="text-2xl font-semibold">{count}</span>
                                    </div>
                                    <p className="mt-2 text-xs font-medium text-gray-500">{status.label}</p>
                                </button>
                            );
                        })}
                    </div>

                    {/* ORDERS TABLE */}
                    <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
                        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                            <p className="text-sm font-semibold text-gray-700">
                                All Orders
                                <span className="ml-2 text-xs font-normal text-gray-400">({filtered.length})</span>
                            </p>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search by ID, customer, restaurant"
                                    className="w-72 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#FC8019] focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        <th className="px-5 py-3">Order ID</th>
                                        <th className="px-5 py-3">Customer</th>
                                        <th className="px-5 py-3">Restaurant</th>
                                        <th className="px-5 py-3">Items</th>
                                        <th className="px-5 py-3">Amount</th>
                                        <th className="px-5 py-3">Address</th>
                                        <th className="px-5 py-3">Current Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && <TableSkeleton rows={8} columns={7} />}

                                    {!loading && pageItems.map((order: Order) => {
                                        const normalizedStatus = (order.status || "").toLowerCase();

                                        return (
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
                                                <td className="px-5 py-4">
                                                    <div className="flex flex-col gap-0.5">
                                                        {order.items?.map((item, idx) => (
                                                            <span key={idx} className="text-xs text-gray-500">
                                                                {item.food?.itemName || "Item"} x{item.quantity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 font-medium">
                                                    ₹{order.totalAmount}
                                                </td>
                                                <td className="px-5 py-4 text-gray-500 max-w-[150px] truncate">
                                                    {order.address}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[normalizedStatus] || "bg-gray-100 text-gray-500"}`}
                                                    >
                                                        {normalizedStatus.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {!loading && filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">
                                                No orders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {!loading && filtered.length > 0 && (
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
