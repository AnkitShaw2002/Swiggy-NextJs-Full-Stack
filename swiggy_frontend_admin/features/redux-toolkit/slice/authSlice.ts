
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { AxiosError } from "axios";

import { getCookie, setCookie, deleteCookie } from "cookies-next";

import { toast } from "sonner";
import AxiosInstance from "@/services/axios/axios";
import { endPoints } from "@/services/endpoints/endPoints";

// COOKIES

const token = (getCookie("token") as string) ?? null;

const role = (getCookie("role") as string) ?? null;

const user = getCookie("user") ? JSON.parse(getCookie("user") as string) : null;

//  INITIAL STATE

const initialState: {
    loading: boolean;
    user: any;
    error: string | null;
    token: string | null;
    role: string | null;
} = {
    loading: false,
    user,
    error: null,
    token,
    role,
};

// LOGIN

export const userSignin = createAsyncThunk<
    any,
    { email: string; password: string },
    { rejectValue: string }
>("auth/signin", async (data, { rejectWithValue }) => {
    try {
        const response = await AxiosInstance.post(endPoints.auth.signIn, data);

        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;

        return rejectWithValue(err.response?.data?.message || "Login failed");
    }
});

// LOGOUT
export const userLogout = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await AxiosInstance.post(endPoints.auth.logout);
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;

        return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
});

// SLICE
const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder

            //  LOGIN

            .addCase(userSignin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(userSignin.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.token = payload.accessToken;
                state.user = payload.data;
                state.role = payload.data.role;

                // save cookies

                if (payload.status == true) {
                    setCookie("token", payload.accessToken, {
                        path: "/",
                        sameSite: "lax",
                    });

                    setCookie("refresh-token", payload.refreshToken, {
                        path: "/",
                        sameSite: "lax",
                    });

                    setCookie("role", payload.data.role, {
                        path: "/",
                        sameSite: "lax",
                    });

                    setCookie("user", JSON.stringify(payload.data), {
                        path: "/",
                        sameSite: "lax",
                    });

                    toast.success(payload?.message || "Login successful");
                }
            })

            .addCase(userSignin.rejected, (state, action) => {
                state.loading = false;

                const message =
                    action.payload || action.error.message || "Login failed";

                state.error = message;

                toast.error(message);
            })

            //  LOGOUT

            .addCase(userLogout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(userLogout.fulfilled, (state) => {
                state.loading = false;
                state.token = null;
                state.user = null;
                state.role = null;

                deleteCookie("token", { path: "/" });
                deleteCookie("refresh-token", { path: "/" });
                deleteCookie("role", { path: "/" });
                deleteCookie("user", { path: "/" });

                toast.success("Logged out successfully");
            })

            .addCase(userLogout.rejected, (state, action) => {
                state.loading = false;

                const message =
                    action.payload || action.error.message || "Logout failed";

                state.error = message;

                // Clear cookies even if API fails
                deleteCookie("token", { path: "/" });
                deleteCookie("refresh-token", { path: "/" });
                deleteCookie("role", { path: "/" });
                deleteCookie("user", { path: "/" });

                state.token = null;
                state.user = null;
                state.role = null;

                toast.success("Logged out successfully");
            });
    },
});

export default authSlice.reducer;
