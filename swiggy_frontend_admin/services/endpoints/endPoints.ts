
export const endPoints = {
    auth: {
        signIn: "/auth/login",
        logout: "/logout",
    },

    restaurant: {
        pendinglist: "/admin/restaurants/pending",
        updateApplicationStatus: (id: string) => `/admin/update-restaurant/${id}`,
        approvedlist: "/admin/restaurants/approved",
        foodPendinglist: "/pending/foodlist",
        updateFoodStatus: (id: string) => `/food/${id}/status`,
        deleteRestaurant: (id: string) => `/restaurant/delete/${id}`,
        allList: "/user/restaurant-list",
    },

    orders: {
        updateStatus: (id: string) => `/orders/${id}/status`,
    }
};
