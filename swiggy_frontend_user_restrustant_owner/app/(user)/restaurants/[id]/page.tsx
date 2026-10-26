import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import RestaurantDetailView from "@/component/restaurants/RestaurantDetailView";
import type { Cart, FoodItem, RestaurantDetail } from "@/features/store/user.store";
import { asRecord, getJson } from "@/lib/serverFetch";

export const dynamic = "force-dynamic";

interface RestaurantMenu {
  restaurant: RestaurantDetail | null;
  foods: FoodItem[];
  unauthorized: boolean;
}

async function fetchRestaurantMenu(restaurantId: string): Promise<RestaurantMenu> {
  const empty: RestaurantMenu = { restaurant: null, foods: [], unauthorized: false };
  if (!restaurantId) return empty;

  try {
    const { status, body } = await getJson(`/user/restaurant/${restaurantId}/foods`);

    if (status === 401 || status === 403) return { ...empty, unauthorized: true };
    if (!body) return empty;

    // Uncached responses carry `restaurant`/`foods` at the top level, cached
    // ones nest the same object under `data`.
    const payload =
      body.restaurant !== undefined || body.foods !== undefined ? body : asRecord(body.data);

    return {
      restaurant: (payload?.restaurant as RestaurantDetail | undefined) ?? null,
      foods: Array.isArray(payload?.foods) ? (payload.foods as FoodItem[]) : [],
      unauthorized: false,
    };
  } catch {
    return empty;
  }
}

async function fetchServerCart(): Promise<Cart | null> {
  try {
    const { status, body } = await getJson("/list/cart");
    if (status !== 200 || !body) return null;

    const cart = body?.data;
    if (!cart || Array.isArray(cart)) return null;

    return cart as Cart;
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { restaurant } = await fetchRestaurantMenu(id);

  if (!restaurant) {
    return {
      title: "Restaurant Not Found",
      description: "This restaurant doesn't exist or has been removed.",
    };
  }

  const location = restaurant.location ? ` in ${restaurant.location}` : "";

  return {
    title: `${restaurant.restaurantName} Menu & Prices`,
    description: `Order online from ${restaurant.restaurantName}${location}. Browse the full menu, prices, offers and more.`,
  };
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const { id } = await params;
  const loginUrl = `/Login?redirect=${encodeURIComponent(`/restaurants/${id}`)}`;

  // The menu API requires an authenticated user - send guests to login before
  // any data is fetched so they get an instant redirect instead of a 404.
  // `refreshToken` is the httpOnly 7-day cookie the backend sets on login;
  // proxy() turns it into an access token for this request.
  const session = await cookies();
  const hasSession =
    session.get("token") || session.get("refreshtoken") || session.get("refreshToken");

  if (!hasSession) {
    redirect(loginUrl);
  }

  const [{ restaurant, foods, unauthorized }, cart] = await Promise.all([
    fetchRestaurantMenu(id),
    fetchServerCart(),
  ]);

  if (unauthorized) {
    redirect(loginUrl);
  }

  if (!restaurant) notFound();

  return (
    <RestaurantDetailView
      key={restaurant._id}
      initialRestaurant={restaurant}
      initialFoods={foods}
      initialCart={cart}
    />
  );
}
