import { cookies } from "next/headers";

const API_BASE_URL =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";

/**
 * Server-side GET helper used by Server Components (SSR).
 * Reads the auth cookie from the incoming request and returns the
 * same payload shape the client thunks read (`response.data.data`).
 * Returns `null` when the request fails so callers can fall back to
 * a client-side fetch (and show the skeleton while it loads).
 */
export async function serverFetch<T>(path: string): Promise<T | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
        });

        if (!response.ok) return null;

        const payload = await response.json();

        return (payload?.data ?? payload) as T;
    } catch {
        return null;
    }
}

export default serverFetch;
