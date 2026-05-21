import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["framer-motion"],
  },
  turbopack: {
    resolveAlias: {
      "next/dist/build/polyfills/polyfill-module": "./lib/polyfill-override.js",
      "next/dist/esm/build/polyfills/polyfill-module": "./lib/polyfill-override.js",
    },
  },
};

export default nextConfig;
