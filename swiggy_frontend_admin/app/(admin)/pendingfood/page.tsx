
"use client";

import React from "react";
import { useDispatch } from "react-redux";
import {
    Search,
    CheckCircle,
    XCircle,
} from "lucide-react";

import {
    Food_aplication_status,
} from "@/features/redux-toolkit/slice/restaurantSlice";
import { FoodItem, Status } from "@/features/typescript/restaurant.type";
import { AppDispatch } from "@/features/redux-toolkit/store/store";
import { usePendingFood } from "@/features/hooks/admin/admin.hook";


export default function PendingList() {
    const dispatch = useDispatch<AppDispatch>();

    const { pendingfoodlistData, loading, query, setQuery } = usePendingFood();

    const initials = (name = "") => {
        return name
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const StatusBadge = ({ status }: { status: Status }) => {

        const statusConfig = {
            pending: {
                label: "Pending",
                className: "bg-orange-50 text-orange-600",
            },

            approved: {
                label: "Approved",
                className: "bg-emerald-50 text-emerald-600",
            },

            rejected: {
                label: "Rejected",
                className: "bg-rose-50 text-rose-600",
            },
        };

        const config =
            statusConfig[status] || {
                label: status || "Unknown",
                className: "bg-gray-100 text-gray-500",
            };

        return (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
            >
                {config.label}
            </span>
        );
    };

    const handleApprove = (id: string) => {

        dispatch(
            Food_aplication_status({
                id,
                status: "approved",
            })
        );
    };

    const handleReject = (id: string) => {

        dispatch(
            Food_aplication_status({
                id,
                status: "rejected",
            })
        );
    };

    const filtered: FoodItem[] = pendingfoodlistData.filter(
        (food: FoodItem) =>
            food.itemName?.toLowerCase().includes(query.toLowerCase()) ||
            food.category?.toLowerCase().includes(query.toLowerCase())
    );


    const totalCount = pendingfoodlistData.length;

    const pendingCount = pendingfoodlistData.filter(
        (food: FoodItem) => food.approvalStatus === "pending"
    ).length;

    const approvedCount = pendingfoodlistData.filter(
        (food: FoodItem) => food.approvalStatus === "approved"
    ).length;


    console.log(
        pendingfoodlistData,
        "pendingfoodlist"
    );


    return (
        <div className="flex min-h-screen bg-[#F7F7F5] text-[#282C3F]">

            <div className="flex-1 md:ml-64">

                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/90 px-8 py-4 backdrop-blur">

                    <div>
                        <h1 className="text-xl font-semibold">
                            Food Applications
                        </h1>

                        <p className="text-sm text-gray-400">
                            Review and manage food item requests
                        </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#282C3F] text-xs font-semibold text-white">
                        AD
                    </div>

                </header>
                <main className="px-8 py-6">
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">

                        <div className="rounded-xl border border-black/5 bg-white p-5">

                            <p className="text-sm text-gray-400">
                                Total Food Items
                            </p>

                            <p className="mt-2 text-3xl font-semibold">
                                {totalCount}
                            </p>

                        </div>


                        <div className="rounded-xl border border-black/5 bg-white p-5">

                            <p className="text-sm text-gray-400">
                                Approved
                            </p>

                            <p className="mt-2 text-3xl font-semibold text-emerald-600">
                                {approvedCount}
                            </p>

                        </div>


                        <div className="rounded-xl border border-black/5 bg-white p-5">

                            <p className="text-sm text-gray-400">
                                Pending Review
                            </p>

                            <p className="mt-2 text-3xl font-semibold text-[#FC8019]">
                                {pendingCount}
                            </p>

                        </div>

                    </div>


                    <div className="overflow-hidden rounded-xl border border-black/5 bg-white">


                        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">

                            <p className="text-sm font-semibold text-gray-700">
                                All Food Items
                            </p>



                            <div className="relative">

                                <Search
                                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) =>
                                        setQuery(e.target.value)
                                    }
                                    placeholder="Search food or category"
                                    className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#FC8019] focus:bg-white"
                                />

                            </div>

                        </div>


                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">


                                <thead>

                                    <tr className="border-b border-black/5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">

                                        <th className="px-5 py-3">
                                            Food Item
                                        </th>

                                        <th className="px-5 py-3">
                                            Category
                                        </th>

                                        <th className="px-5 py-3">
                                            Price
                                        </th>

                                        <th className="px-5 py-3">
                                            Availability
                                        </th>

                                        <th className="px-5 py-3">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-right">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>


                                    {/* Loading */}
                                    {loading && (

                                        <tr>

                                            <td
                                                colSpan={6}
                                                className="px-5 py-10 text-center text-sm text-gray-400"
                                            >
                                                Loading...
                                            </td>

                                        </tr>

                                    )}


                                    {/* Food List */}
                                    {!loading &&
                                        filtered.map((food: FoodItem) => (

                                            <tr
                                                key={food._id}
                                                className="border-b border-black/5 last:border-0 hover:bg-gray-50/60"
                                            >


                                                {/* ================= FOOD ITEM ================= */}
                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        {/* Initial */}
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-xs font-semibold text-[#FC8019]">

                                                            {initials(
                                                                food.itemName
                                                            )}

                                                        </div>


                                                        {/* Name */}
                                                        <div>

                                                            <span className="block font-medium">
                                                                {food.itemName}
                                                            </span>

                                                            <span className="text-xs text-gray-400">
                                                                {food.foodType}
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* ================= CATEGORY ================= */}
                                                <td className="px-5 py-4 text-gray-600">

                                                    {food.category || "-"}

                                                </td>


                                                {/* ================= PRICE ================= */}
                                                <td className="px-5 py-4">

                                                    <div className="flex flex-col">

                                                        <span className="font-medium text-gray-700">
                                                            ₹{food.discountPrice}
                                                        </span>


                                                        {food.basePrice !==
                                                            food.discountPrice && (

                                                                <span className="text-xs text-gray-400 line-through">
                                                                    ₹{food.basePrice}
                                                                </span>

                                                            )}

                                                    </div>

                                                </td>


                                                {/* ================= AVAILABILITY ================= */}
                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${food.isAvailable
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-gray-100 text-gray-500"
                                                            }`}
                                                    >

                                                        {food.isAvailable
                                                            ? "Available"
                                                            : "Unavailable"}

                                                    </span>

                                                </td>


                                                {/* ================= STATUS ================= */}
                                                <td className="px-5 py-4">

                                                    <StatusBadge
                                                        status={
                                                            food.approvalStatus
                                                        }
                                                    />

                                                </td>


                                                {/* ================= ACTION ================= */}
                                                <td className="px-5 py-4">

                                                    <div className="flex justify-end gap-2">



                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleApprove(
                                                                    food._id
                                                                )
                                                            }
                                                            disabled={
                                                                food.approvalStatus ===
                                                                "approved"
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >

                                                            <CheckCircle className="h-3.5 w-3.5" />

                                                            Approve

                                                        </button>



                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleReject(
                                                                    food._id
                                                                )
                                                            }
                                                            disabled={
                                                                food.approvalStatus ===
                                                                "rejected"
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >

                                                            <XCircle className="h-3.5 w-3.5" />

                                                            Reject

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}


                                    {/* ================= NO DATA ================= */}
                                    {!loading &&
                                        filtered.length === 0 && (

                                            <tr>

                                                <td
                                                    colSpan={6}
                                                    className="px-5 py-10 text-center text-sm text-gray-400"
                                                >
                                                    No Food Pending list found
                                                </td>

                                            </tr>

                                        )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
}

