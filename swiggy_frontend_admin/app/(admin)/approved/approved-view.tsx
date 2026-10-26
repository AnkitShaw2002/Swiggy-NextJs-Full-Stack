"use client";

import {
    Search,
    Mail,
} from "lucide-react";
import { Restaurant } from "@/features/typescript/restaurant.type";
import { useApprovedRestaurants } from "@/features/hooks/admin/admin.hook";
import Pagination from "@/component/common/pagination";
import { TableSkeleton } from "@/component/common/skeleton";

const PAGE_SIZE = 10;

type DisplayStatus = "approved" | "rejected" | "pending";

function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function displayStatus(status: string): DisplayStatus {
    if (status === "approved") return "approved";
    if (status === "rejected") return "rejected";
    return "pending";
}

const STATUS_STYLES: Record<DisplayStatus, string> = {
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    rejected: "bg-rose-50 text-rose-700 ring-rose-600/20",
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

const STATUS_DOT: Record<DisplayStatus, string> = {
    approved: "bg-emerald-500",
    rejected: "bg-rose-500",
    pending: "bg-amber-500",
};

function StatusBadge({ status }: { status: DisplayStatus }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export default function ApprovedView({
    initialApproved,
}: {
    initialApproved: Restaurant[] | null;
}) {
    const {
        approved,
        loading,
        query,
        setQuery,
        page,
        setPage,
    } = useApprovedRestaurants(initialApproved);

    const filtered = approved.filter(
        (r: Restaurant) =>
            r.restaurantName?.toLowerCase().includes(query.toLowerCase()) ||
            r.ownerName?.toLowerCase().includes(query.toLowerCase())
    );

    const approvedCount = approved.filter(
        (d: Restaurant) => d.status === "approved"
    ).length;
    const pendingCount = approved.filter(
        (d: Restaurant) => displayStatus(d.status) === "pending"
    ).length;

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

    return (
        <div className="flex min-h-screen bg-[#F7F7F5] text-[#282C3F]">
            <div className="flex-1 md:ml-64">
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/90 px-8 py-4 backdrop-blur">
                    <div>
                        <h1 className="text-xl font-semibold">Restaurant applications</h1>
                        <p className="text-sm text-gray-400">Review and manage restaurant partner requests</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#282C3F] text-xs font-semibold text-white">
                        AD
                    </div>
                </header>

                <main className="px-8 py-6">
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-black/5 bg-white p-5">
                            <p className="text-sm text-gray-400">Total applications</p>
                            <p className="mt-2 text-3xl font-semibold">{approved.length}</p>
                        </div>
                        <div className="rounded-xl border border-black/5 bg-white p-5">
                            <p className="text-sm text-gray-400">Approved</p>
                            <p className="mt-2 text-3xl font-semibold text-emerald-600">{approvedCount}</p>
                        </div>
                        <div className="rounded-xl border border-black/5 bg-white p-5">
                            <p className="text-sm text-gray-400">Pending review</p>
                            <p className="mt-2 text-3xl font-semibold text-[#FC8019]">{pendingCount}</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
                        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                            <p className="text-sm font-semibold text-gray-700">All applications</p>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search restaurant or owner"
                                    className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#FC8019] focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        <th className="px-5 py-3">Restaurant</th>
                                        <th className="px-5 py-3">Owner</th>
                                        <th className="px-5 py-3">Email</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && <TableSkeleton rows={8} columns={4} />}

                                    {!loading && pageItems.map((restaurant: Restaurant) => (
                                        <tr
                                            key={restaurant._id}
                                            className="border-b border-black/5 last:border-0 hover:bg-gray-50/60"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-xs font-semibold text-[#FC8019]">
                                                        {initials(restaurant.restaurantName)}
                                                    </div>
                                                    <span className="font-medium">{restaurant.restaurantName}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600">{restaurant.ownerName}</td>
                                            <td className="px-5 py-4 text-gray-500">
                                                <span className="flex items-center gap-1.5">
                                                    <Mail className="h-3.5 w-3.5 text-gray-300" />
                                                    {restaurant.email}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <StatusBadge status={displayStatus(restaurant.status)} />
                                            </td>
                                        </tr>
                                    ))}

                                    {!loading && filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
                                                No restaurants match your search.
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
