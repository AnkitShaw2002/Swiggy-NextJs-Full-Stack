"use client";

import { useDispatch } from "react-redux";
import {
  Search,
  CheckCircle,
  XCircle,
  Mail,
} from "lucide-react";
import {
  aplication_status,
} from "@/features/redux-toolkit/slice/restaurantSlice";
import { AppDispatch } from "@/features/redux-toolkit/store/store";
import { useRestaurantList } from "@/features/hooks/admin/admin.hook";
import { pendingRestaurantListResponse, Status } from "@/features/typescript/restaurant.type";
import Swal from "sweetalert2";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus: Status =
    status === "approved" || status === "rejected" || status === "pending"
      ? status
      : "pending";

  const styles: Record<Status, string> = {
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    rejected: "bg-rose-50 text-rose-700 ring-rose-600/20",
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[normalizedStatus]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${normalizedStatus === "approved"
          ? "bg-emerald-500"
          : normalizedStatus === "rejected"
            ? "bg-rose-500"
            : "bg-amber-500"
          }`}
      />
      {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
    </span>
  );
}

export default function RestaurantPage() {

  const dispatch = useDispatch<AppDispatch>();

  const { data, loading, updatingId, query, setQuery } = useRestaurantList();

  const handleApprove = (id: string) => {
    dispatch(
      aplication_status({
        id,
        status: "approved",
      })
    );
  };

  const handleReject = async (id: string, restaurantName: string) => {
    const result = await Swal.fire({
      title: "Reject application",
      html: `<p class="swal2-text-left text-sm text-gray-600">
               Reject <strong>${restaurantName}</strong>. The reason below is sent to the applicant.
             </p>`,
      input: "textarea",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "e.g. FSSAI certificate missing",
      inputAttributes: {
        maxlength: "300",
        autocapitalize: "off",
        autocorrect: "off",
        "aria-label": "Reason for rejection",
      },
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Please enter a reason";
        }
      },
      showCancelButton: true,
      confirmButtonText: "Reject application",
      confirmButtonColor: "#e11d48",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "swal2-popup",
        title: "swal2-title",
        htmlContainer: "swal2-html-container",
      },
    });

    if (!result.isConfirmed) return;

    await dispatch(
      aplication_status({
        id,
        status: "rejected",
        reason: (result.value || "").trim(),
      })
    );
  };

  const filtered = data.filter(
    (r: { restaurantName: string; ownerName: string }) =>
      r.restaurantName.toLowerCase().includes(query.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(query.toLowerCase())
  );

  const pendingCount = data.filter((d: { status: string }) => d.status === "pending").length;
  const approvedCount = data.filter((d: { status: string }) => d.status === "approved").length;

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
            {/* change to admin name not AD only */}
          </div>
        </header>

        <main className="px-8 py-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-black/5 bg-white p-5">
              <p className="text-sm text-gray-400">Total applications</p>
              <p className="mt-2 text-3xl font-semibold">{data.length}</p>
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
                  onChange={(e) => setQuery(e.target.value)}
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
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                        Loading...
                      </td>
                    </tr>
                  )}

                  {!loading && filtered.map((restaurant: pendingRestaurantListResponse) => (
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
                        <StatusBadge status={restaurant.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApprove(restaurant._id)}
                            disabled={restaurant.status === "approved" || updatingId === restaurant._id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(restaurant._id, restaurant.restaurantName)}
                            disabled={restaurant.status === "rejected" || updatingId === restaurant._id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                        No restaurants match your search.
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