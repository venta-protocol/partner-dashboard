const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const TerserPlugin = require("terser-webpack-plugin");

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "https",
        hostname: "pigetnoyzgoyafavoldj.supabase.co",
      },
    ],
  },
  webpack(config, { isServer, dev }) {
    if (!dev && !isServer) {
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: { drop_console: true },
          },
        })
      );
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(baseConfig);
