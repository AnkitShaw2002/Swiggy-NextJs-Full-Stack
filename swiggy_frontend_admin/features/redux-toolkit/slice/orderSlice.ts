import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "sonner";
import AxiosInstance from "@/services/axios/axios";
import { endPoints } from "@/services/endpoints/endPoints";
import { Order, OrderState, UpdateOrderStatusPayload } from "@/features/typescript/restaurant.type";



// INITIAL STATE

const initialState: OrderState = {
    loading: false,
    error: null,
    orders: [],
    updatingId: null,
};


// FETCH ALL ORDERS

export const fetchAllOrders = createAsyncThunk<
    Order[],
    void,
    { rejectValue: string }
>(
    "orders/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.get(
                "/admin/orders"
            );

            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to fetch orders"
            );
        }
    }
);


// UPDATE ORDER STATUS

export const updateOrderStatus = createAsyncThunk<
    { orderId: string; previousStatus: string; currentStatus: string },
    UpdateOrderStatusPayload,
    { rejectValue: string }
>(
    "orders/updateStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.put(
                endPoints.orders.updateStatus(id),
                { status }
            );

            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to update order status"
            );
        }
    }
);



// SLICE

const orderSlice = createSlice({
    name: "orders",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder


            // FETCH ALL ORDERS

            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })

            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;

                const message =
                    action.payload ??
                    action.error.message ??
                    "Failed to fetch orders";

                state.error = message;

                toast.error(message);
            })


            // UPDATE ORDER STATUS

            .addCase(updateOrderStatus.pending, (state, action) => {
                // Don't touch global `loading` here — it would replace the
                // whole table with "Loading..." and unmount the open menu.
                state.updatingId = action.meta.arg.id;
                state.error = null;
            })

            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.updatingId = null;

                const updatedOrder = state.orders.find(
                    (order) =>
                        String(order._id) === String(action.payload.orderId)
                );

                if (updatedOrder) {
                    updatedOrder.status = action.payload.currentStatus as Order["status"];
                }

                toast.success(`Order status updated to ${action.payload.currentStatus}`);
            })

            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.updatingId = null;

                const message =
                    action.payload ??
                    action.error.message ??
                    "Failed to update order status";

                state.error = message;

                toast.error(message);
            });
    },
});

export default orderSlice.reducer;
