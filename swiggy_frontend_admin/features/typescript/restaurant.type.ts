
export interface Restaurant {
    _id: string;
    restaurantName: string;
    ownerName: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
}

export interface RestaurantListItem {
    _id: string;
    restaurantName: string;
    location: string;
    outletType: string;
    workingDays: string[];
    openingClosing: {
        sameForAllDays: boolean;
        slots: { open: string; close: string }[];
    };
    isOpen: boolean;
    status: string;
}

export interface RestaurantState {
    loading: boolean;
    error: string | null;
    restaurants: Restaurant[];
    approvedRestaurantlist: Restaurant[];
    pendingfoodlistData: FoodItem[];
    allRestaurants: RestaurantListItem[];
    updatingId: string | null;
}


export interface FoodItem {
    _id: string;
    restaurant: string;

    itemName: string;
    slug: string;
    description: string;

    category: string;
    cuisine: string;
    foodType: string;

    basePrice: number;
    discountPercentage: number;
    discountPrice: number;
    gst: number;

    image: string;

    preparationTime: number;

    isVeg: boolean;
    isAvailable: boolean;
    isRecommended: boolean;
    isDeleted: boolean;

    approvalStatus: "pending" | "approved" | "rejected";

    approvedAt: string | null;
    rejectedReason: string;

    rating: number;
    totalOrders: number;
    totalRatings: number;

    createdAt: string;
    updatedAt: string;

    __v: number;
}

export interface pendingRestaurantListResponse {
    _id: string;
    restaurantName: string;
    ownerName: string;
    email: string;
    status: string
}

export type Status = "pending" | "approved" | "rejected";

export type RestaurantStatus =
    | "draft"
    | "documents_pending"
    | "menu_pending"
    | "contract_pending"
    | "review_pending"
    | "approved"
    | "rejected";

// `PUT /admin/update-restaurant/:id` only accepts approved/rejected
// and refuses to change a restaurant that is already approved.
export type UpdateApplicationPayload = {
    id: string;
    status: RestaurantStatus;
    reason?: string;
};


export type FoodUpdatePayload = {
    id: string;
    status: "approved" | "rejected" | "suspended";

};


// ORDER TYPES

export type OrderStatus = "placed" | "accepted" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

export interface OrderUser {
    _id: string;
    full_name: string;
    email: string;
}

export interface OrderRestaurant {
    _id: string;
    restaurantName: string;
}

export interface OrderFood {
    _id: string;
    itemName: string;
    image: string;
}

export interface OrderItem {
    food: OrderFood;
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    user: OrderUser;
    restaurant: OrderRestaurant;
    items: OrderItem[];
    totalAmount: number;
    address: string;
    status: OrderStatus;
    createdAt: string;
}

export interface OrderState {
    loading: boolean;
    error: string | null;
    orders: Order[];
    updatingId: string | null;
}

export type UpdateOrderStatusPayload = {
    id: string;
    status: OrderStatus;
};
