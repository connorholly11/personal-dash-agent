/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Disable React strict mode for faster development
  reactStrictMode: false,
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
  // Increase build speed by disabling compression
  compress: false,
}

module.exports = nextConfig 