import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.rbxcdn.com" },
      { protocol: "https", hostname: "thumbnails.roblox.com" },
    ],
  },
};

export default nextConfig;
