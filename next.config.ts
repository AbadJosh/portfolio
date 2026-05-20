import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["framer-motion"],
  },
  webpack(config, { isServer, webpack }) {
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /next[\\/]dist[\\/](esm[\\/])?build[\\/]polyfills[\\/]polyfill-module/,
          path.join(process.cwd(), "lib", "polyfill-override.js")
        )
      );
    }
    return config;
  },
};

export default nextConfig;
