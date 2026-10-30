import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las fotos no cambian de nombre: se pueden cachear 30 días (menos transformaciones y carga más rápida).
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
