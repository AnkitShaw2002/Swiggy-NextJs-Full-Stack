import serverFetch from "@/lib/serverFetch";
import { endPoints } from "@/services/endpoints/endPoints";
import { RestaurantListItem } from "@/features/typescript/restaurant.type";
import RestaurantsView from "./restaurants-view";

export default async function RestaurantsPage() {
    const restaurants = await serverFetch<RestaurantListItem[]>(
        endPoints.restaurant.allList
    );

    return <RestaurantsView initialRestaurants={restaurants} />;
}
