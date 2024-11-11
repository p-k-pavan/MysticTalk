// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignores ESLint errors during production builds.
    ignoreDuringBuilds: true,
  },
  // You can add other configurations here as needed.
}

module.exports = nextConfig;
