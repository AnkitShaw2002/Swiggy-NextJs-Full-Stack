"use client";

import { useDispatch } from "react-redux";
import {
    Search,
    Trash2,
    MapPin,
    Store,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { AppDispatch } from "@/features/redux-toolkit/store/store";
import { deleteRestaurant } from "@/features/redux-toolkit/slice/restaurantSlice";
import { RestaurantListItem } from "@/features/typescript/restaurant.type";
import { useRestaurants } from "@/features/hooks/admin/admin.hook";
import Swal from "sweetalert2";
import Pagination from "@/component/common/pagination";
import { TableSkeleton } from "@/component/common/skeleton";

const PAGE_SIZE = 10;

export default function RestaurantsView({
    initialRestaurants,
}: {
    initialRestaurants: RestaurantListItem[] | null;
}) {
    const dispatch = useDispatch<AppDispatch>();

    const {
        restaurants,
        setRestaurants,
        loading,
        query,
        setQuery,
        page,
        setPage,
    } = useRestaurants(initialRestaurants);

    const handleDelete = (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            customClass: {
                popup: "swal2-popup",
                title: "swal2-title",
                htmlContainer: "swal2-html-container",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteRestaurant(id))
                    .unwrap()
                    .then(({ _id }) => {
                        setRestaurants((prev) =>
                            prev.filter((item) => item._id !== _id)
                        );
                    })
                    .catch(() => undefined);
            }
        });
    };

    const filtered = restaurants.filter(
        (r: RestaurantListItem) =>
            r.restaurantName?.toLowerCase().includes(query.toLowerCase()) ||
            r.location?.toLowerCase().includes(query.toLowerCase()) ||
            r.outletType?.toLowerCase().includes(query.toLowerCase())
    );

    const openCount = restaurants.filter((r) => r.isOpen).length;
    const closedCount = restaurants.filter((r) => !r.isOpen).length;

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
                        <h1 className="text-xl font-semibold">All Restaurants</h1>
                        <p className="text-sm text-gray-400">View and manage all registered restaurants</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#282C3F] text-xs font-semibold text-white">
                        AD
                    </div>
                </header>

                <main className="px-8 py-6">
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-black/5 bg-white p-5">
                            <p className="text-sm text-gray-400">Total Restaurants</p>
                            <p className="mt-2 text-3xl font-semibold">{restaurants.length}</p>
                        </div>
                        <div className="rounded-xl border border-black/5 bg-white p-5">
                            <p className="text-sm text-gray-400">Open Now</p>
                            <p className="mt-2 text-3xl font-semibold text-emerald-600">{openCount}</p>
                        </div>
                        <div className="rounded-xl border border-black/5 bg-white p-5">
                            <p className="text-sm text-gray-400">Closed</p>
                            <p className="mt-2 text-3xl font-semibold text-rose-600">{closedCount}</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
                        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                            <p className="text-sm font-semibold text-gray-700">All Restaurants</p>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search restaurant, location, type"
                                    className="w-72 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#FC8019] focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        <th className="px-5 py-3">Restaurant</th>
                                        <th className="px-5 py-3">Location</th>
                                        <th className="px-5 py-3">Type</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Open/Close</th>
                                        <th className="px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && <TableSkeleton rows={8} columns={6} />}

                                    {!loading && pageItems.map((restaurant: RestaurantListItem) => (
                                        <tr
                                            key={restaurant._id}
                                            className="border-b border-black/5 last:border-0 hover:bg-gray-50/60"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-xs font-semibold text-[#FC8019]">
                                                        <Store className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-medium">{restaurant.restaurantName}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600">
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-gray-300" />
                                                    {restaurant.location || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600">
                                                {restaurant.outletType || "N/A"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        restaurant.status === "approved"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : restaurant.status === "rejected"
                                                                ? "bg-rose-50 text-rose-700"
                                                                : "bg-amber-50 text-amber-700"
                                                    }`}
                                                >
                                                    {restaurant.status?.charAt(0).toUpperCase() + restaurant.status?.slice(1) || "Unknown"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="flex items-center gap-1.5">
                                                    {restaurant.isOpen ? (
                                                        <ToggleRight className="h-5 w-5 text-emerald-500" />
                                                    ) : (
                                                        <ToggleLeft className="h-5 w-5 text-gray-300" />
                                                    )}
                                                    <span className={`text-xs font-medium ${restaurant.isOpen ? "text-emerald-600" : "text-gray-400"}`}>
                                                        {restaurant.isOpen ? "Open" : "Closed"}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDelete(restaurant._id)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {!loading && filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                                                No restaurants found.
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
