import type { NextConfig } from "next";

// Fallback to localhost for local development if the env var isn't set
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/socket.io/:path*", destination: `${API_URL}/socket.io/:path*` },
      { source: "/auth/:path*", destination: `${API_URL}/auth/:path*` },
      { source: "/uploads/:path*", destination: `${API_URL}/uploads/:path*` },
      { source: "/user/:path*", destination: `${API_URL}/user/:path*` },
      { source: "/restaurant/:path*", destination: `${API_URL}/restaurant/:path*` },
      { source: "/food/:path*", destination: `${API_URL}/food/:path*` },
      { source: "/add/:path*", destination: `${API_URL}/add/:path*` },
      { source: "/list/:path*", destination: `${API_URL}/list/:path*` },
      { source: "/cart/:path*", destination: `${API_URL}/cart/:path*` },
      { source: "/order/:path*", destination: `${API_URL}/order/:path*` },
      { source: "/api/orders/:path*", destination: `${API_URL}/orders/:path*` },
      { source: "/refresh-token", destination: `${API_URL}/refresh-token` },
      { source: "/partner-contract", destination: `${API_URL}/partner-contract` },
      { source: "/my-restaurant", destination: `${API_URL}/my-restaurant` },
      { source: "/add-food", destination: `${API_URL}/add-food` },
      { source: "/:id/toggle-availability", destination: `${API_URL}/:id/toggle-availability` },
    ];
  },
};

export default nextConfig;