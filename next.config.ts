import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

const withPWA = require("next-pwa")({
  dest: "public",
  disable: isDev, // don't generate service worker during dev
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);