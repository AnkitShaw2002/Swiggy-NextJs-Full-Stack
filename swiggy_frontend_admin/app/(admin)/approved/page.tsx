import serverFetch from "@/lib/serverFetch";
import { endPoints } from "@/services/endpoints/endPoints";
import { Restaurant } from "@/features/typescript/restaurant.type";
import ApprovedView from "./approved-view";

export default async function ApprovedPage() {
    const approvedRestaurants = await serverFetch<Restaurant[]>(
        endPoints.restaurant.approvedlist
    );

    return <ApprovedView initialApproved={approvedRestaurants} />;
}
