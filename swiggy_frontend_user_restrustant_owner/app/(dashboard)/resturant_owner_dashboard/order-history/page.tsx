import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OrderHistoryView from "@/component/orders/OrderHistoryView";
import { getJson } from "@/lib/serverFetch";
import {
  Order,
  OrderStatus,
} from "@/features/typescript/restaurantOwner.type";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order History",
  description:
    "Delivered and cancelled orders of your restaurant, with server-rendered pagination.",
};

/** Only these statuses belong to the Order History page. */
const HISTORY_STATUSES: OrderStatus[] = ["delivered", "cancelled"];

type Search = { status?: string; page?: string };

export default async function OrderHistoryPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const loginUrl = `/Login?redirect=${encodeURIComponent(
    "/resturant_owner_dashboard/order-history"
  )}`;

  // Owner area requires an authenticated session - guests go to login.
  const session = await cookies();
  const hasSession =
    session.get("token") ||
    session.get("refreshtoken") ||
    session.get("refreshToken");

  if (!hasSession) {
    redirect(loginUrl);
  }

  const params = await searchParams;
  const status =
    params.status === "delivered" || params.status === "cancelled"
      ? params.status
      : "all";

  // Server-side data fetch: cookies + bearer token are forwarded by getJson.
  const result = await getJson("/restaurant/orders");

  if (result.status === 401 || result.status === 403) {
    redirect(loginUrl);
  }

  const raw = result.body?.data;
  const allOrders: Order[] = Array.isArray(raw) ? (raw as Order[]) : [];

  const historyOrders = allOrders.filter((order) =>
    HISTORY_STATUSES.includes(order.status)
  );
  const statusOrders =
    status === "all"
      ? historyOrders
      : historyOrders.filter((order) => order.status === status);

  const counts = {
    all: historyOrders.length,
    delivered: historyOrders.filter((order) => order.status === "delivered")
      .length,
    cancelled: historyOrders.filter((order) => order.status === "cancelled")
      .length,
  };

  // URL page numbers are 1-based; react-paginate wants a 0-based index.
  const pageCount = Math.max(1, Math.ceil(statusOrders.length / 10));
  const requested = Number.parseInt(params.page || "1", 10);
  const currentPageOneBased = Number.isNaN(requested)
    ? 1
    : Math.min(Math.max(requested, 1), pageCount);

  const pageOrders = statusOrders.slice(
    (currentPageOneBased - 1) * 10,
    currentPageOneBased * 10
  );

  return (
    <OrderHistoryView
      orders={pageOrders}
      currentPage={currentPageOneBased - 1}
      pageCount={pageCount}
      status={status}
      counts={counts}
      totalItems={statusOrders.length}
    />
  );
}
