import { cookies, headers } from "next/headers";

export const API_BASE = (process.env.API_BASE_URL || "http://localhost:4000").replace(/\/+$/, "");

export type JsonRecord = Record<string, unknown>;

export function asRecord(value: unknown): JsonRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

/**
 * Headers for a server-side fetch to the backend: the session cookies plus a
 * bearer token. proxy() refreshes an expired access token before the render
 * and forwards the new one - prefer it over the (possibly stale) cookie so
 * this request never triggers a second, cookie-less refresh.
 */
export async function authHeaders(): Promise<Record<string, string>> {
  const store = await cookies();
  const requestHeaders = await headers();
  const result: Record<string, string> = { Accept: "application/json" };

  const cookieHeader = store
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (cookieHeader) result.Cookie = cookieHeader;

  const forwarded = requestHeaders.get("authorization");
  if (forwarded) {
    result.Authorization = forwarded;
  } else {
    const token = store.get("token")?.value;
    if (token) result.Authorization = `Bearer ${token}`;
  }

  return result;
}

export interface ApiResult {
  status: number;
  body: JsonRecord | null;
}

// Token refresh lives in proxy.ts only: it is the one place that can write the
// rotated tokens back to the browser. Here we just call the API and report the
// status so the page can redirect to /Login when it is 401/403.
export async function getJson(path: string): Promise<ApiResult> {
  const requestHeaders = await authHeaders();

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { headers: requestHeaders, cache: "no-store" });
  } catch {
    return { status: 0, body: null };
  }

  if (!response.ok) return { status: response.status, body: null };

  try {
    const body: JsonRecord | null = asRecord(await response.json());
    return { status: response.status, body };
  } catch {
    return { status: response.status, body: null };
  }
}
