export const endpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    otp: "/auth/otp",
    refresh_token: "/refresh-token",
  },
  user_action: {
    addToCart: "/add/cart",
    cartList: "/list/cart",
    removeCartItem: "/cart/item/:foodId",
    placeOrder: "/order/place",
    myOrders: "/orders/my-orders",
    singeOrder: "/orders/:id",
    cancelOrder: "/orders/:id/cancel",
    updateOrderStatus: "/orders/:id/status",
  },
  user: {
    food_list: "/user/food_list",
    restaurant_list: "/user/restaurant-list",
    restaurant_foods: (restaurantId: string) => `/user/restaurant/${restaurantId}/foods`,
  },
  restaurantOwner: {
    // Onboarding & Application
    apply: "/auth/apply/restaurant",
    verify_otp: "/restaurant/otp",
    details: "/restaurant/details",
    resend_otp: "/restaurant/resend-otp",
    documents: "/restaurant/documents",
    partner_contract: "/partner-contract",

    // Restaurant Profile & Status
    my_restaurant: "/my-restaurant",
    status: "/restaurant/status",

    // Food Management
    add_food: "/add-food",
    delete_food: (id: string) => `/food/${id}`,
    food_list: "/food/list",
    food_details: (id: string) => `/food/details/${id}`,
    toggle_availability: (id: string) => `/${id}/toggle-availability`,
    edit_food: (id: string) => `/food/edit/${id}`,
    pending_food_count: "/restaurant/foods/pending-count",

    // Orders
    orders: "/restaurant/orders",
    update_order_status: (id: string) => `/orders/${id}/status`,
  }

} 
