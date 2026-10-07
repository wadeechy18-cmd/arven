import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All site imagery lives in /public/images (see IMAGES.md).
    localPatterns: [{ pathname: "/images/**", search: "" }],
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
