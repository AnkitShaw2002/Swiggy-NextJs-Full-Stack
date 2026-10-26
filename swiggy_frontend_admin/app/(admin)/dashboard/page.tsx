import serverFetch from "@/lib/serverFetch";
import { endPoints } from "@/services/endpoints/endPoints";
import {
    FoodItem,
    Order,
    Restaurant,
} from "@/features/typescript/restaurant.type";
import DashboardView from "./dashboard-view";

export default async function DashboardPage() {
    const [orders, pendingRestaurants, approvedRestaurants, pendingFoods] =
        await Promise.all([
            serverFetch<Order[]>("/admin/orders"),
            serverFetch<Restaurant[]>(endPoints.restaurant.pendinglist),
            serverFetch<Restaurant[]>(endPoints.restaurant.approvedlist),
            serverFetch<FoodItem[]>(endPoints.restaurant.foodPendinglist),
        ]);

    return (
        <DashboardView
            initialOrders={orders}
            initialPendingRestaurants={pendingRestaurants}
            initialApprovedRestaurants={approvedRestaurants}
            initialPendingFoods={pendingFoods}
        />
    );
}
