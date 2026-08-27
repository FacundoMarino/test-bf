import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
] as const satisfies readonly { key: string; value: string }[];

const nextConfig: NextConfig = {
  env: {
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME ?? "auth_session",
  },
  async headers() {
    return [{ source: "/(.*)", headers: [...securityHeaders] }];
  },
  images: {
    remotePatterns: [],
  },
  typedRoutes: true,
};

export default nextConfig;
