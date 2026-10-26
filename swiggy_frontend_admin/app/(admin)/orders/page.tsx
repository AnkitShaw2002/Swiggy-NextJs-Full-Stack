import serverFetch from "@/lib/serverFetch";
import { Order } from "@/features/typescript/restaurant.type";
import OrdersView from "./orders-view";

export default async function OrdersPage() {
    const orders = await serverFetch<Order[]>("/admin/orders");

    return <OrdersView initialOrders={orders} />;
}
