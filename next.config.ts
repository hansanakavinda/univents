import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      }
    ],
    formats: ["image/avif", "image/webp"], // Serve modern formats
    minimumCacheTTL: 60 * 60 * 24 * 30,   // Cache for 30 days
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 96, 128, 256],
  },
};

export default nextConfig;
