import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axiosInstance";
import { endpoints } from "@/services/endpoints/endpoints";
import { useNotificationStore } from "@/features/store/notification.store";

const { user, user_action } = endpoints;

const isAuthError = (err: unknown): boolean => {
  const status = (err as { response?: { status?: number } })?.response?.status;
  return status === 401 || status === 403;
};

// ==========================================
// Types
// ==========================================

export interface FoodItem {
  _id: string;
  itemName: string;
  slug?: string;
  description?: string;
  image?: string;
  foodType?: string;
  isVeg?: boolean;
  category?: string;
  cuisine?: string;
  basePrice: number;
  discountPrice?: number;
  gst?: number;
  preparationTime?: number;
  rating?: number;
  totalOrders?: number;
  isAvailable: boolean;
  restaurant?: string | { _id: string; restaurantName: string; location?: string; isOpen?: boolean };
}

export interface RestaurantListItem {
  _id: string;
  restaurantName: string;
  location?: string;
  outletType?: string;
  workingDays?: string[];
  openingClosing?: {
    sameForAllDays?: boolean;
    slots?: Array<{ open: string; close: string }>;
  };
  isOpen?: boolean;
  menus?: FoodItem[];
}

export interface RestaurantDetail extends RestaurantListItem {
  image?: string;
  coverImage?: string;
  photo?: string;
  rating?: number;
  totalRatings?: number | string;
  deliveryTime?: number;
  costForTwo?: number;
  totalOrders?: number;
  cuisine?: string[];
  categories?: string[];
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
  price: number;
  _id?: string;
}

export interface Cart {
  _id: string;
  user: string;
  restaurant: string | { _id: string; restaurantName: string };
  items: CartItem[];
  totalPrice: number;
  createdAt?: string;
}

export interface OrderItem {
  food: FoodItem | string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: { _id: string; name: string; email: string; phone: string };
  restaurant: { _id: string; name: string; email: string; phone: string; address?: string; status?: string };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Cart helpers
// ==========================================

export const getFoodId = (food: CartItem["food"]): string => {
  const value = food as unknown;
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "_id" in value) {
    return String((value as { _id: unknown })._id);
  }
  return "";
};

// The backend returns `data: []` for an empty cart and `data: null`
// when the last item is deleted. Normalise both to `null`.
const normalizeCart = (data: unknown): Cart | null => {
  if (!data) return null;
  if (Array.isArray(data)) return null;
  return data as Cart;
};

const cartQuantity = (cart: Cart | null): number =>
  cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;

// Mutation responses (DELETE /cart/item/:foodId) come back WITHOUT
// `.populate("items.food")`, so `item.food` is a raw ObjectId string.
// Those cannot be rendered, so we always re-fetch a populated cart.
const isPopulatedCart = (cart: Cart | null): boolean =>
  Boolean(cart?.items?.every((item) => item && typeof item.food === "object" && item.food !== null));

// ==========================================
// Store Interface
// ==========================================

interface UserState {
  // Food & Restaurant listing
  foods: FoodItem[];
  restaurants: RestaurantListItem[];
  selectedRestaurant: RestaurantListItem | null;
  restaurantFoods: FoodItem[];
  searchQuery: string;

  // Cart
  cart: Cart | null;
  cartCount: number;

  // Orders
  orders: Order[];
  selectedOrder: Order | null;

  isLoading: boolean;
  error: string | null;
  isCartUpdating: boolean;

  // Actions
  setSearchQuery: (q: string) => void;
  fetchFoods: (search?: string) => Promise<void>;
  fetchRestaurants: () => Promise<void>;
  fetchRestaurantFoods: (restaurantId: string) => Promise<void>;
  addToCart: (foodId: string, quantity?: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  removeFromCart: (foodId: string) => Promise<void>;
  increaseQuantity: (foodId: string) => Promise<void>;
  decreaseQuantity: (foodId: string) => Promise<void>;
  placeOrder: (address?: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  clearCart: () => void;
  reset: () => void;

  // Realtime (socket) actions
  applyOrderStatusUpdate: (orderId: string, status: string) => void;
  applyFoodAvailability: (foodId: string, isAvailable: boolean) => void;
  applyRestaurantStatus: (restaurantId: string, isOpen: boolean) => void;
}

// ==========================================
// Store
// ==========================================

export const useUserStore = create<UserState>((set, get) => {
  // Writes a cart mutation response into the store. When the response is
  // missing or not populated (`items[].food` still an ObjectId string) we
  // fall back to a fresh GET /list/cart so the UI always renders objects.
  const commitCart = async (data: unknown) => {
    const cart = normalizeCart(data);
    if (!cart) {
      set({ cart: null, cartCount: 0 });
      return;
    }
    if (!isPopulatedCart(cart)) {
      await get().fetchCart();
      return;
    }
    set({ cart, cartCount: cartQuantity(cart) });
  };

  return {
  foods: [],
  restaurants: [],
  selectedRestaurant: null,
  restaurantFoods: [],
  searchQuery: "",

  cart: null,
  cartCount: 0,

  orders: [],
  selectedOrder: null,

  isLoading: false,
  error: null,
  isCartUpdating: false,

  setSearchQuery: (q) => set({ searchQuery: q }),

  // --- Foods ---
  fetchFoods: async (search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params = search ? { search } : {};
      const res = await axiosInstance.get(user.food_list, { params });
      set({ foods: res.data.data || [], isLoading: false });
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401 || status === 403 || status === 404) {
        set({ foods: [], isLoading: false });
      } else {
        const msg = err.response?.data?.message || "Failed to fetch foods";
        set({ error: msg, isLoading: false });
        toast.error(msg);
      }
    }
  },

  // --- Restaurants ---
  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(user.restaurant_list);
      set({ restaurants: res.data.data || [], isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch restaurants";
      set({ error: msg, isLoading: false });
      if (!isAuthError(err)) toast.error(msg);
    }
  },

  // --- Restaurant Foods ---
  fetchRestaurantFoods: async (restaurantId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(user.restaurant_foods(restaurantId));
      set({
        selectedRestaurant: res.data.restaurant || null,
        restaurantFoods: res.data.foods || [],
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch menu";
      set({ error: msg, isLoading: false });
      if (!isAuthError(err)) toast.error(msg);
    }
  },

  // --- Cart ---
  addToCart: async (foodId, quantity = 1) => {
    try {
      const res = await axiosInstance.post(user_action.addToCart, { foodId, quantity });
      await commitCart(res.data.data);
      toast.success("Added to cart");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  },

  increaseQuantity: async (foodId) => {
    if (get().isCartUpdating) return;
    set({ isCartUpdating: true });
    try {
      const res = await axiosInstance.post(user_action.addToCart, { foodId, quantity: 1 });
      await commitCart(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Couldn't update quantity");
    } finally {
      set({ isCartUpdating: false });
    }
  },

  // DELETE /cart/item/:foodId decrements by one (and drops the line at
  // quantity 1). Its response is not populated, so commitCart re-fetches.
  decreaseQuantity: async (foodId) => {
    if (get().isCartUpdating) return;
    set({ isCartUpdating: true });
    try {
      const res = await axiosInstance.delete(
        user_action.removeCartItem.replace(":foodId", foodId)
      );
      await commitCart(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Couldn't update quantity");
    } finally {
      set({ isCartUpdating: false });
    }
  },

  fetchCart: async () => {
    try {
      const res = await axiosInstance.get(user_action.cartList);
      const cart = normalizeCart(res.data?.data);
      set({ cart, cartCount: cartQuantity(cart) });
    } catch (err: any) {
      set({ cart: null, cartCount: 0 });
      if (!isAuthError(err)) {
        toast.error(err.response?.data?.message || "Couldn't load your cart");
      }
    }
  },

  // Removes the whole line. The API only decrements, so repeat the call
  // until the food is no longer in the returned cart (max quantity is 10).
  removeFromCart: async (foodId) => {
    if (get().isCartUpdating) return;
    set({ isCartUpdating: true });
    try {
      const url = user_action.removeCartItem.replace(":foodId", foodId);
      for (let attempt = 0; attempt < 10; attempt++) {
        const res = await axiosInstance.delete(url);
        const data = res.data?.data;
        if (!data || !Array.isArray(data.items)) break;
        const stillInCart = data.items.some(
          (item: { food?: unknown }) => String(item.food) === String(foodId)
        );
        if (!stillInCart) break;
      }
      await get().fetchCart();
      toast.success("Removed from cart");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove from cart");
    } finally {
      set({ isCartUpdating: false });
    }
  },

  clearCart: () => set({ cart: null, cartCount: 0 }),

  // Drops every piece of commerce data. Called on logout so the next visitor
  // on this browser never inherits the previous account's menu, cart or orders.
  reset: () =>
    set({
      foods: [],
      restaurants: [],
      selectedRestaurant: null,
      restaurantFoods: [],
      searchQuery: "",
      cart: null,
      cartCount: 0,
      orders: [],
      selectedOrder: null,
      isLoading: false,
      error: null,
      isCartUpdating: false,
    }),

  // --- Orders ---
  placeOrder: async (address?: string) => {
    try {
      const body: Record<string, string> = {};
      if (address) body.address = address;
      const res = await axiosInstance.post(user_action.placeOrder, body);
      set({ cart: null, cartCount: 0 });
      toast.success("Order placed successfully!");

      const order = res.data.data as Order | undefined;
      if (order?._id) {
        useNotificationStore.getState().addNotification({
          type: "order_placed",
          title: "Order placed",
          message: `Order #${order._id.slice(-8).toUpperCase()} placed successfully · ₹${order.totalAmount}`,
          orderId: order._id,
        });
      }

      return res.data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order");
      throw err;
    }
  },

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(user_action.myOrders);
      set({ orders: res.data.data || [], isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch orders";
      set({ error: msg, isLoading: false });
      if (!isAuthError(err)) toast.error(msg);
    }
  },

  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(user_action.singeOrder.replace(":id", orderId));
      set({ selectedOrder: res.data.data, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch order";
      set({ error: msg, isLoading: false });
      if (!isAuthError(err) && err.response?.status !== 404) toast.error(msg);
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const res = await axiosInstance.put(user_action.cancelOrder.replace(":id", orderId));
      set({ selectedOrder: res.data.data });
      toast.success("Order cancelled");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  },

  // --- Realtime (socket) updates ---
  applyOrderStatusUpdate: (orderId, status) =>
    set((state) => {
      let changed = false;
      const orders = state.orders.map((order) => {
        if (order._id === orderId && order.status !== status) {
          changed = true;
          return { ...order, status, updatedAt: new Date().toISOString() };
        }
        return order;
      });
      const selectedOrder =
        state.selectedOrder &&
        state.selectedOrder._id === orderId &&
        state.selectedOrder.status !== status
          ? { ...state.selectedOrder, status, updatedAt: new Date().toISOString() }
          : state.selectedOrder;
      if (selectedOrder !== state.selectedOrder) changed = true;
      return changed ? { orders, selectedOrder } : state;
    }),

  applyFoodAvailability: (foodId, isAvailable) =>
    set((state) => {
      const foods = state.foods.map((food) =>
        food._id === foodId && food.isAvailable !== isAvailable
          ? { ...food, isAvailable }
          : food
      );
      const restaurantFoods = state.restaurantFoods.map((food) =>
        food._id === foodId && food.isAvailable !== isAvailable
          ? { ...food, isAvailable }
          : food
      );
      const restaurants = state.restaurants.map((restaurant) =>
        restaurant.menus
          ? {
              ...restaurant,
              menus: restaurant.menus.map((menu) =>
                menu._id === foodId && menu.isAvailable !== isAvailable
                  ? { ...menu, isAvailable }
                  : menu
              ),
            }
          : restaurant
      );
      const changed =
        foods.some((food, index) => food !== state.foods[index]) ||
        restaurantFoods.some((food, index) => food !== state.restaurantFoods[index]) ||
        restaurants.some((restaurant, index) => restaurant !== state.restaurants[index]);
      return changed ? { foods, restaurantFoods, restaurants } : state;
    }),

  applyRestaurantStatus: (restaurantId, isOpen) =>
    set((state) => {
      const restaurants = state.restaurants.map((restaurant) =>
        restaurant._id === restaurantId && Boolean(restaurant.isOpen) !== isOpen
          ? { ...restaurant, isOpen }
          : restaurant
      );
      const selectedRestaurant =
        state.selectedRestaurant &&
        state.selectedRestaurant._id === restaurantId &&
        Boolean(state.selectedRestaurant.isOpen) !== isOpen
          ? { ...state.selectedRestaurant, isOpen }
          : state.selectedRestaurant;
      const changed =
        restaurants.some((restaurant, index) => restaurant !== state.restaurants[index]) ||
        selectedRestaurant !== state.selectedRestaurant;
      return changed ? { restaurants, selectedRestaurant } : state;
    }),
  };
});
