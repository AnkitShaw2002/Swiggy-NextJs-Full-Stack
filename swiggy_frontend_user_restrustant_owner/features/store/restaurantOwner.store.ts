import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axiosInstance";
import { endpoints } from "@/services/endpoints/endpoints";
import {
  Restaurant,
  Food,
  Order,
  Pagination,
  ApplyRestaurantPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  RestaurantDetailsPayload,
  RestaurantDocumentsPayload,
  PartnerContractPayload,
  FoodListQueryParams,
  OrderStatus,
} from "@/features/typescript/restaurantOwner.type";

interface RestaurantState {
  restaurant: Restaurant | null;
  hasRestaurant: boolean;
  foods: Food[];
  selectedFood: Food | null;
  orders: Order[];
  totalOrdersCount: number;
  updatingOrderIds: string[];
  pendingFoodCount: number;
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;

  // Step Management State
  currentStep: number;

  // Step Management Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // API Actions
  applyRestaurant: (payload: ApplyRestaurantPayload) => Promise<any>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<any>;
  resendOtp: (payload: ResendOtpPayload) => Promise<any>;
  saveRestaurantDetails: (payload: RestaurantDetailsPayload) => Promise<any>;
  saveRestaurantDocuments: (payload: RestaurantDocumentsPayload) => Promise<any>;
  acceptPartnerContract: (payload: PartnerContractPayload) => Promise<any>;

  fetchMyRestaurant: () => Promise<void>;
  updateRestaurantStatus: (isOpen: boolean) => Promise<any>;

  addFood: (formData: FormData) => Promise<any>;
  deleteFood: (id: string) => Promise<void>;
  fetchFoods: (params?: FoodListQueryParams) => Promise<void>;
  fetchFoodById: (id: string) => Promise<Food>;
  toggleFoodAvailability: (id: string) => Promise<void>;
  editFood: (id: string, formData: FormData) => Promise<any>;
  fetchPendingFoodCount: () => Promise<number>;

  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<any>;
  clearError: () => void;
  /** Wipe owner data on logout / account switch (no stale restaurant room). */
  reset: () => void;

  // Realtime (socket) actions
  applyOrderStatusUpdate: (orderId: string, status: OrderStatus) => void;
  applyFoodAvailability: (foodId: string, isAvailable: boolean) => void;
  applyRestaurantStatus: (restaurantId: string, isOpen: boolean) => void;
}

const { restaurantOwner } = endpoints;

// Orders the owner just updated themselves (orderId -> timestamp).
// Used to skip the socket echo so the owner's own action doesn't
// show up as a notification in their own bell.
const selfUpdatedOrders = new Map<string, number>();

export const wasSelfUpdated = (orderId: string, withinMs = 5000): boolean => {
  const at = selfUpdatedOrders.get(orderId);
  if (!at) return false;
  if (Date.now() - at > withinMs) {
    selfUpdatedOrders.delete(orderId);
    return false;
  }
  return true;
};

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurant: null,
  hasRestaurant: false,
  foods: [],
  selectedFood: null,
  orders: [],
  totalOrdersCount: 0,
  updatingOrderIds: [],
  pendingFoodCount: 0,
  pagination: null,
  isLoading: false,
  error: null,

  currentStep: 1,

  setCurrentStep: (step: number) => set({ currentStep: step }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 3),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      restaurant: null,
      hasRestaurant: false,
      foods: [],
      selectedFood: null,
      orders: [],
      totalOrdersCount: 0,
      updatingOrderIds: [],
      pendingFoodCount: 0,
      pagination: null,
      isLoading: false,
      error: null,
      currentStep: 1,
    }),

  // 1. Apply Restaurant
  applyRestaurant: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(restaurantOwner.apply, payload);
      set({ isLoading: false });
      toast.success(response.data?.message || "OTP sent successfully!");
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to apply restaurant";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 2. Verify OTP
  verifyOtp: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(restaurantOwner.verify_otp, payload);
      set({ isLoading: false });
      toast.success(response.data?.message || "OTP verified successfully!");
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid OTP entered";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 3. Resend OTP
  resendOtp: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(restaurantOwner.resend_otp, payload);
      set({ isLoading: false });
      toast.success(response.data?.message || "OTP resent successfully!");
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to resend OTP";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 4. Save Restaurant Details
  saveRestaurantDetails: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(restaurantOwner.details, payload);
      set({ restaurant: response.data.data, hasRestaurant: true, isLoading: false });
      toast.success(response.data?.message || "Restaurant details saved!");
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to save restaurant details";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 5. Save Documents
  saveRestaurantDocuments: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(restaurantOwner.documents, payload);
      set({ restaurant: response.data.data, isLoading: false });
      toast.success(response.data?.message || "Documents saved successfully!");
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to save documents";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 6. Partner Contract Acceptance
  acceptPartnerContract: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(restaurantOwner.partner_contract, payload);
      const currentRes = get().restaurant;

      if (currentRes) {
        set({
          restaurant: {
            ...currentRes,
            onboardingStep: response.data?.data?.onboardingStep ?? currentRes.onboardingStep,
            status: response.data?.data?.status ?? currentRes.status,
          },
        });
      }

      set({ isLoading: false });
      toast.success(response.data?.message || "Contract accepted successfully!");
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to accept contract";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 7. Fetch My Restaurant
  fetchMyRestaurant: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(restaurantOwner.my_restaurant);
      set({
        restaurant: response.data.data || null,
        hasRestaurant: Boolean(response.data.hasRestaurant),
        isLoading: false,
      });
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Failed to fetch restaurant details";
      if (status === 403 || status === 404) {
        set({ restaurant: null, hasRestaurant: false, isLoading: false });
      } else {
        set({ error: msg, isLoading: false });
        toast.error(msg);
      }
    }
  },

  // 8. Update Restaurant Status
  updateRestaurantStatus: async (isOpen) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch(restaurantOwner.status, { isOpen });
      set({ restaurant: response.data.data, isLoading: false });
      toast.success(response.data?.message || "Status updated successfully!");
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update status";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 9. Add Food
  addFood: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(restaurantOwner.add_food, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ isLoading: false });
      toast.success(response.data?.message || "Food item added successfully!");
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to add food";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 10. Delete Food
  deleteFood: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(restaurantOwner.delete_food(id));
      set((state) => ({
        foods: state.foods.filter((food) => food._id !== id),
        isLoading: false,
      }));
      toast.success("Food item deleted successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete food";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 11. Fetch Foods
  fetchFoods: async (params = { page: 1, limit: 10 }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(restaurantOwner.food_list, { params });
      set({
        foods: response.data.data || [],
        pagination: response.data.pagination || null,
        isLoading: false,
      });
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 403 || status === 404) {
        set({ foods: [], isLoading: false });
      } else {
        const msg = err.response?.data?.message || "Failed to fetch food items";
        set({ error: msg, isLoading: false });
        toast.error(msg);
      }
    }
  },

  // 12. Fetch Food By ID
  fetchFoodById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(restaurantOwner.food_details(id));
      set({ selectedFood: response.data.data, isLoading: false });
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch food details";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 13. Toggle Food Availability
  toggleFoodAvailability: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch(restaurantOwner.toggle_availability(id));
      const updatedFood = response.data.data;
      set((state) => ({
        foods: state.foods.map((food) => (food._id === id ? updatedFood : food)),
        isLoading: false,
      }));
      toast.success(response.data?.message || "Item availability updated!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update item availability";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 14. Edit Food Item
  editFood: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(restaurantOwner.edit_food(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedItem = response.data.data;
      set((state) => ({
        foods: state.foods.map((food) => (food._id === id ? updatedItem : food)),
        isLoading: false,
      }));
      toast.success(response.data?.message || "Food item updated successfully!");
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to edit food item";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 15. Fetch Pending Food Count
  fetchPendingFoodCount: async () => {
    try {
      const response = await axiosInstance.get(restaurantOwner.pending_food_count);
      const count = response.data.count || 0;
      set({ pendingFoodCount: count });
      return count;
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 403 || status === 404) {
        set({ pendingFoodCount: 0 });
      } else {
        console.error("Pending food count fetch error:", err);
        if (status !== 401) {
          toast.error(err.response?.data?.message || "Couldn't load pending items count");
        }
      }
      return 0;
    }
  },

  // 16. Fetch Orders
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(restaurantOwner.orders);
      set({
        orders: response.data.data || [],
        totalOrdersCount: response.data.totalOrders || 0,
        isLoading: false,
      });
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 403 || status === 404) {
        set({ orders: [], isLoading: false });
      } else {
        const msg = err.response?.data?.message || "Failed to fetch orders";
        set({ error: msg, isLoading: false });
        toast.error(msg);
      }
    }
  },

  // 17. Update Order Status
  updateOrderStatus: async (id, status) => {
    set((state) => ({
      error: null,
      updatingOrderIds: [...state.updatingOrderIds, id],
    }));
    try {
      const response = await axiosInstance.put(
        restaurantOwner.update_order_status(id),
        { status }
      );
      const currentStatus: OrderStatus =
        response.data?.data?.currentStatus || status;

      // Remember this was the owner's own action - suppress the socket echo.
      selfUpdatedOrders.set(id, Date.now());

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id
            ? { ...order, status: currentStatus, updatedAt: new Date().toISOString() }
            : order
        ),
        updatingOrderIds: state.updatingOrderIds.filter((orderId) => orderId !== id),
      }));
      toast.success(response.data?.message || "Order status updated!");
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update order status";
      set((state) => ({
        error: msg,
        updatingOrderIds: state.updatingOrderIds.filter((orderId) => orderId !== id),
      }));
      toast.error(msg);
      throw new Error(msg);
    }
  },

  // 18. Apply order status pushed over socket (order:status)
  applyOrderStatusUpdate: (orderId, status) =>
    set((state) => {
      const orders = state.orders.map((order) =>
        order._id === orderId && order.status !== status
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      );
      const changed = orders.some((order, index) => order !== state.orders[index]);
      return changed ? { orders } : state;
    }),

  // 19. Apply food availability pushed over socket (food:status)
  applyFoodAvailability: (foodId, isAvailable) =>
    set((state) => {
      const foods = state.foods.map((food) =>
        food._id === foodId && food.isAvailable !== isAvailable
          ? { ...food, isAvailable }
          : food
      );
      const changed = foods.some((food, index) => food !== state.foods[index]);
      return changed ? { foods } : state;
    }),

  // 20. Apply restaurant open/close pushed over socket (restaurant:status)
  applyRestaurantStatus: (restaurantId, isOpen) =>
    set((state) => {
      if (!state.restaurant || state.restaurant._id !== restaurantId) return state;
      if (Boolean(state.restaurant.isOpen) === isOpen) return state;
      return { restaurant: { ...state.restaurant, isOpen } };
    }),
}));