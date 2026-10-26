import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { toast } from "sonner";

export async function proxy(req: NextRequest) {
    // Role-based route protection for the owner dashboard
    // 2. Define your Admin-only path prefixes here
    const userOnlyPaths = ["/approved", "/dashboard", "/orders", "/pendingfood", "/restaurantlist", "/restaurants"];
    const isUserRoute = userOnlyPaths.some((prefix) => req.nextUrl.pathname.startsWith(prefix));

    if (isUserRoute) {
        const role = req.cookies.get("role")?.value;
        if (role !== "admin") {
            const redirectUrl = new URL("/", req.url);
            redirectUrl.searchParams.set("error", "unauthorized_admin");
            return NextResponse.redirect(redirectUrl);
        }
    }


    // Silent token refresh for SSR pages that fetch authorized data.
    //   const refreshed = await refreshAccessToken(req);
    //   if (refreshed) return refreshed;

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/approved", "/dashboard", "/orders", "/pendingfood", "/restaurantlist", "/restaurants"
    ],
};