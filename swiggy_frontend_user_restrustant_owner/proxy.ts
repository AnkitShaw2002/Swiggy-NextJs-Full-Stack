import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { toast } from "sonner";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/+$/, "");

// Keep these in sync with features/store/auth.store.ts
const ACCESS_COOKIE_MAX_AGE = 60 * 15;
const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function isExpired(token?: string): boolean {
  if (!token) return true;

  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    if (typeof payload?.exp !== "number") return false;
    // Refresh slightly before the token actually dies.
    return payload.exp * 1000 <= Date.now() + 10_000;
  } catch {
    return true;
  }
}

function setSessionCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  response.cookies.set("token", accessToken, {
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  response.cookies.set("refreshtoken", refreshToken, {
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}

function dropSessionCookies(response: NextResponse) {
  for (const name of ["token", "refreshtoken"]) {
    response.cookies.delete({ name, path: "/" });
  }
}

async function refreshAccessToken(
  request: NextRequest
): Promise<NextResponse | null> {
  const accessToken = request.cookies.get("token")?.value;
  const refreshToken =
    request.cookies.get("refreshtoken")?.value || request.cookies.get("refreshToken")?.value;

  if (!isExpired(accessToken)) return null;
  if (!refreshToken) return null;

  try {
    const upstream = await fetch(`${API_BASE}/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (upstream.status >= 400 && upstream.status < 500) {
      // The refresh token was rotated away or revoked - forget it so the page
      // redirects to /Login instead of retrying a dead token on every request.
      const response = NextResponse.next();
      dropSessionCookies(response);
      return response;
    }

    if (!upstream.ok) return null;

    const data = await upstream.json();
    const newAccessToken = data?.accessToken;
    const newRefreshToken = data?.refreshToken || refreshToken;
    if (!newAccessToken) return null;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("authorization", `Bearer ${newAccessToken}`);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    setSessionCookies(response, newAccessToken, newRefreshToken);
    return response;
  } catch {
    // Backend unreachable - continue unrefreshed, the page handles auth.
    return null;
  }
}

export async function proxy(req: NextRequest) {
  // Role-based route protection for the owner dashboard.
  if (req.nextUrl.pathname.startsWith("/resturant_owner_dashboard")) {
    const role = req.cookies.get("role")?.value;
    if (role !== "restaurant_owner" ) {
        
      // return NextResponse.redirect(new URL("/", req.url));
      const redirectUrl = new URL("/", req.url);
            redirectUrl.searchParams.set("error", "unauthorized_owner");
            return NextResponse.redirect(redirectUrl);
    }
    
  }
  // 2. Define your 3 user-only path prefixes here
  const userOnlyPaths = ["/checkout", "/orders", "/restaurants","/apply","/onboarding","/success"]; 
  const isUserRoute = userOnlyPaths.some((prefix) => req.nextUrl.pathname.startsWith(prefix));

  if (isUserRoute) {
    const role = req.cookies.get("role")?.value;
    if (role !== "user") {
      // return NextResponse.redirect(new URL("/Login", req.url));
      const redirectUrl = new URL("/Login", req.url);
            redirectUrl.searchParams.set("error", "unauthorized_user");
            return NextResponse.redirect(redirectUrl);
    }
  }
  

  // Silent token refresh for SSR pages that fetch authorized data.
  const refreshed = await refreshAccessToken(req);
  if (refreshed) return refreshed;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout", "/orders", "/restaurants","/apply","/onboarding","/success",
    "/restaurants/:path*",
    "/orders",
    "/orders/:path*",
    "/resturant_owner_dashboard/:path*",
  ],
};
