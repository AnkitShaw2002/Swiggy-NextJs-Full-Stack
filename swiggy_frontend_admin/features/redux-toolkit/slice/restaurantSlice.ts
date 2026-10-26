import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "sonner";
import AxiosInstance from "@/services/axios/axios";
import { endPoints } from "@/services/endpoints/endPoints";
import { FoodUpdatePayload, Restaurant, RestaurantListItem, RestaurantState, UpdateApplicationPayload } from "@/features/typescript/restaurant.type";



// INITIAL STATE

const initialState: RestaurantState = {
    loading: false,
    error: null,
    restaurants: [],
    approvedRestaurantlist: [],
    pendingfoodlistData: [],
    allRestaurants: [],
    updatingId: null
};


const statusLabel = (status: string) =>
    status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());


export const pendingRestaurantList = createAsyncThunk<
    Restaurant[],
    void,
    { rejectValue: string }
>(
    "restaurant/pendingList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.get(
                endPoints.restaurant.pendinglist
            );



            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to fetch pending restaurants"
            );
        }
    }
);


export const aplication_status = createAsyncThunk<
    any,
    UpdateApplicationPayload,
    { rejectValue: string }
>(
    "restaurant/updateStatus",
    async ({ id, status, reason }, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.put(
                endPoints.restaurant.updateApplicationStatus(id),
                {
                    status,
                    reason,
                }
            );

            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to update application status"
            );
        }
    }
);


export const approvedRestaurantList = createAsyncThunk<
    any,
    void,
    { rejectValue: string }
>(
    "restaurant/approvedList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.get(
                endPoints.restaurant.approvedlist);

            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to approve restaurant"
            );
        }
    }
);




export const pendingfoodlist = createAsyncThunk<
    any,
    void,
    { rejectValue: string }
>(
    "restaurant/pendingfoodlist",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.get(endPoints.restaurant.foodPendinglist);

            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to approve restaurant"
            );
        }
    }
);


export const Food_aplication_status = createAsyncThunk<
    any,
    FoodUpdatePayload,
    { rejectValue: string }
>(
    "restaurant/updateFoodStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.patch(
                endPoints.restaurant.updateFoodStatus(id),
                {
                    status,
                }
            );

            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to update application status"
            );
        }
    }
);


export const fetchAllRestaurants = createAsyncThunk<
    RestaurantListItem[],
    void,
    { rejectValue: string }
>(
    "restaurant/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.get(
                endPoints.restaurant.allList
            );

            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to fetch restaurants"
            );
        }
    }
);


export const deleteRestaurant = createAsyncThunk<
    { _id: string },
    string,
    { rejectValue: string }
>(
    "restaurant/delete",
    async (id, { rejectWithValue }) => {
        try {
            await AxiosInstance.delete(
                endPoints.restaurant.deleteRestaurant(id)
            );

            return { _id: id };
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to delete restaurant"
            );
        }
    }
);



// SLICE

const restaurantSlice = createSlice({
    name: "restaurant",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder



            .addCase(pendingRestaurantList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })


            .addCase(pendingRestaurantList.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurants = action.payload;
            })



            .addCase(pendingRestaurantList.rejected, (state, action) => {
                state.loading = false;

                const message =
                    action.payload ??
                    action.error.message ??
                    "Failed to fetch pending restaurants";

                state.error = message;

                toast.error(message);
            })


            .addCase(aplication_status.pending, (state, action) => {
                // Keep the table mounted so the open dropdown doesn't unmount.
                state.updatingId = action.meta.arg.id;
                state.error = null;
            })

            .addCase(aplication_status.fulfilled, (state, action) => {
                state.updatingId = null;

                const updated = action.payload ?? {};
                const updatedId = updated._id ?? action.meta.arg.id;
                const status = updated.status ?? action.meta.arg.status;

                state.restaurants = state.restaurants.filter(
                    (item) => item._id !== updatedId
                );

                state.approvedRestaurantlist = state.approvedRestaurantlist.map(
                    (item) => (item._id === updatedId ? { ...item, ...updated, status } : item)
                );

                toast.success(`Restaurant status updated to ${statusLabel(status)}`);
            })


            .addCase(aplication_status.rejected, (state, action) => {
                state.updatingId = null;

                const message =
                    action.payload ??
                    action.error.message ??
                    "Failed to update application status";

                state.error = message;

                toast.error(message);
            })


            .addCase(approvedRestaurantList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })


            .addCase(approvedRestaurantList.fulfilled, (state, action) => {
                state.loading = false;
                state.approvedRestaurantlist = action.payload;

            })


            .addCase(approvedRestaurantList.rejected, (state, action) => {
                state.loading = false;

                const message =
                    action.payload ??
                    action.error.message ??
                    "Failed to fetch pending restaurants";

                state.error = message;

                toast.error(message);
            })



            .addCase(pendingfoodlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })


            .addCase(pendingfoodlist.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.pendingfoodlistData = payload;

            })

            .addCase(pendingfoodlist.rejected, (state, action) => {
                state.loading = false;

                const message =
                    action.payload ??
                    action.error.message ??
                    "Failed to fetch pending restaurants";

                state.error = message;

                toast.error(message);
            })


            .addCase(Food_aplication_status.pending, (state) => {
                state.loading = true;
                state.error = null;
            })


            .addCase(Food_aplication_status.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingfoodlistData = state.pendingfoodlistData.filter(
                    (item) => item._id !== action.payload._id
                );

                toast.success(
                    action.meta.arg.status === "rejected"
                        ? "Food item rejected"
                        : "Food item approved"
                );
            })

            .addCase(Food_aplication_status.rejected, (state, action) => {
                state.loading = false;

                const message =
                    action.payload ??
                    action.error.message ??
                    "Failed to fetch pending restaurants";

                state.error = message;

                toast.error(message);
            })


            // FETCH ALL RESTAURANTS

            .addCase(fetchAllRestaurants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAllRestaurants.fulfilled, (state, action) => {
                state.loading = false;
                state.allRestaurants = action.payload;
            })

            .addCase(fetchAllRestaurants.rejected, (state, action) => {
                state.loading = false;

                const message =
                    action.payload ??
                    action.error.message ??
                    "Failed to fetch restaurants";

                state.error = message;

                toast.error(message);
            })


            // DELETE RESTAURANT

            .addCase(deleteRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteRestaurant.fulfilled, (state, action) => {
                state.loading = false;
                state.allRestaurants = state.allRestaurants.filter(
                    (item) => item._id !== action.payload._id
                );
                toast.success("Restaurant deleted successfully");
            })

            .addCase(deleteRestaurant.rejected, (state, action) => {
                state.loading = false;

                const message =
                    action.payload ??
                    action.error.message ??
                    "Failed to delete restaurant";

                state.error = message;

                toast.error(message);
            });
    },
});

export default restaurantSlice.reducer;
