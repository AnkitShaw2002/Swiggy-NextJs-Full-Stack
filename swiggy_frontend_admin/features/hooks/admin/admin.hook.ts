"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/redux-toolkit/store/store";
import {
    fetchAllRestaurants,
    pendingRestaurantList,
    approvedRestaurantList,
    pendingfoodlist,
} from "@/features/redux-toolkit/slice/restaurantSlice";
import { fetchAllOrders } from "@/features/redux-toolkit/slice/orderSlice";
import {
    FoodItem,
    Order,
    Restaurant,
    RestaurantListItem,
} from "@/features/typescript/restaurant.type";

export function useRestaurants(initialRestaurants: RestaurantListItem[] | null) {
    const dispatch = useDispatch<AppDispatch>();

    const [restaurants, setRestaurants] = useState<RestaurantListItem[]>(
        initialRestaurants ?? []
    );
    const [loading, setLoading] = useState(initialRestaurants === null);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (initialRestaurants !== null) return;

        let active = true;

        dispatch(fetchAllRestaurants())
            .unwrap()
            .then((data) => {
                if (active) setRestaurants(data ?? []);
            })
            .catch(() => {
                if (active) setRestaurants([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [dispatch, initialRestaurants]);

    return {
        restaurants,
        setRestaurants,
        loading,
        query,
        setQuery,
        page,
        setPage,
    };
}

export function useOrders(initialOrders: Order[] | null) {
    const dispatch = useDispatch<AppDispatch>();

    const [orders, setOrders] = useState<Order[]>(initialOrders ?? []);
    const [loading, setLoading] = useState(initialOrders === null);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (initialOrders !== null) return;

        let active = true;

        dispatch(fetchAllOrders())
            .unwrap()
            .then((data) => {
                if (active) setOrders(data ?? []);
            })
            .catch(() => {
                if (active) setOrders([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [dispatch, initialOrders]);

    return {
        orders,
        loading,
        query,
        setQuery,
        statusFilter,
        setStatusFilter,
        page,
        setPage,
    };
}

export function useDashboard({
    initialOrders,
    initialPendingRestaurants,
    initialApprovedRestaurants,
    initialPendingFoods,
}: {
    initialOrders: Order[] | null;
    initialPendingRestaurants: Restaurant[] | null;
    initialApprovedRestaurants: Restaurant[] | null;
    initialPendingFoods: FoodItem[] | null;
}) {
    const dispatch = useDispatch<AppDispatch>();

    const needsFetch =
        initialOrders === null ||
        initialPendingRestaurants === null ||
        initialApprovedRestaurants === null ||
        initialPendingFoods === null;

    const [orders, setOrders] = useState<Order[]>(initialOrders ?? []);
    const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>(
        initialPendingRestaurants ?? []
    );
    const [approvedRestaurants, setApprovedRestaurants] = useState<Restaurant[]>(
        initialApprovedRestaurants ?? []
    );
    const [pendingFoods, setPendingFoods] = useState<FoodItem[]>(
        initialPendingFoods ?? []
    );
    const [loading, setLoading] = useState(needsFetch);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!needsFetch) return;

        let active = true;

        Promise.allSettled([
            dispatch(fetchAllOrders()).unwrap(),
            dispatch(pendingRestaurantList()).unwrap(),
            dispatch(approvedRestaurantList()).unwrap(),
            dispatch(pendingfoodlist()).unwrap(),
        ]).then((results) => {
            if (!active) return;

            const [ordersResult, pendingResult, approvedResult, foodsResult] = results;

            if (ordersResult.status === "fulfilled") {
                setOrders((ordersResult.value as Order[]) ?? []);
            }
            if (pendingResult.status === "fulfilled") {
                setPendingRestaurants((pendingResult.value as Restaurant[]) ?? []);
            }
            if (approvedResult.status === "fulfilled") {
                setApprovedRestaurants((approvedResult.value as Restaurant[]) ?? []);
            }
            if (foodsResult.status === "fulfilled") {
                setPendingFoods((foodsResult.value as FoodItem[]) ?? []);
            }

            setLoading(false);
        });

        return () => {
            active = false;
        };
    }, [dispatch, needsFetch]);

    return {
        orders,
        pendingRestaurants,
        approvedRestaurants,
        pendingFoods,
        loading,
        page,
        setPage,
    };
}

export function useApprovedRestaurants(initialApproved: Restaurant[] | null) {
    const dispatch = useDispatch<AppDispatch>();

    const [approved, setApproved] = useState<Restaurant[]>(
        initialApproved ?? []
    );
    const [loading, setLoading] = useState(initialApproved === null);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (initialApproved !== null) return;

        let active = true;

        dispatch(approvedRestaurantList())
            .unwrap()
            .then((data: Restaurant[]) => {
                if (active) setApproved(data ?? []);
            })
            .catch(() => {
                if (active) setApproved([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [dispatch, initialApproved]);

    return {
        approved,
        loading,
        query,
        setQuery,
        page,
        setPage,
    };
}

export function usePendingFood() {
    const dispatch = useDispatch<AppDispatch>();

    const { pendingfoodlistData, loading } = useSelector(
        (state: RootState) => state.restaurant
    );
    const [query, setQuery] = useState("");

    useEffect(() => {
        dispatch(pendingfoodlist());
    }, [dispatch]);

    return {
        pendingfoodlistData,
        loading,
        query,
        setQuery,
    };
}

export function useRestaurantList() {
    const dispatch = useDispatch<AppDispatch>();

    const { restaurants: data, loading, updatingId } = useSelector(
        (state: RootState) => state.restaurant
    );
    const [query, setQuery] = useState("");

    useEffect(() => {
        dispatch(pendingRestaurantList());
    }, [dispatch]);

    return {
        data,
        loading,
        updatingId,
        query,
        setQuery,
    };
}
