import { getImageUrl } from "@/services/axios/axiosInstance";

export const RESTAURANT_TYPE_IMAGES: Record<string, string> = {
  restaurant: "/Images/ResturantImage.png",
  "cloud kitchen": "/Images/cloud%20Kitchen.png",
  cafe: "/Images/Cafe.png",
  bakery: "/Images/Bakery.png",
  "sweet shop": "/Images/sweet%20shop.png",
};

export const DEFAULT_RESTAURANT_IMAGE = RESTAURANT_TYPE_IMAGES.restaurant;

type RestaurantLike = {
  outletType?: string;
  image?: string;
  coverImage?: string;
  photo?: string;
};

export function getRestaurantImage(restaurant?: RestaurantLike | null): string {
  const uploaded = restaurant?.image || restaurant?.coverImage || restaurant?.photo;
  if (uploaded) return getImageUrl(uploaded);

  const key = (restaurant?.outletType || "").trim().toLowerCase();
  return RESTAURANT_TYPE_IMAGES[key] || DEFAULT_RESTAURANT_IMAGE;
}
