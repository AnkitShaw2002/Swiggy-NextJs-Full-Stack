import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OrdersView from "@/component/orders/OrdersView";
import type { Order } from "@/features/store/user.store";
import { getJson } from "@/lib/serverFetch";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Track your current and past orders, delivery status and order history.",
};

export default async function OrdersPage() {
  const loginUrl = `/Login?redirect=${encodeURIComponent("/orders")}`;

  // Orders require an authenticated user - guests go straight to login.
  const session = await cookies();
  const hasSession =
    session.get("token") || session.get("refreshtoken") || session.get("refreshToken");

  if (!hasSession) {
    redirect(loginUrl);
  }

  // Backend route behind the `/api/orders/my-orders` rewrite.
  const { status, body } = await getJson("/orders/my-orders");

  if (status === 401 || status === 403) {
    redirect(loginUrl);
  }

  const data =
    body && Array.isArray(body.data)
      ? body.data
      : body && Array.isArray(body.orders)
        ? body.orders
        : null;
  const orders = (data as Order[]) ?? [];

  return <OrdersView initialOrders={orders} />;
}
