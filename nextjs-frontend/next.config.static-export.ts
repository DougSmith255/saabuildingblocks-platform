import type { NextConfig } from 'next';

/**
 * Static Export Configuration for Blog Pages Only
 *
 * This configuration is used ONLY for building static blog pages.
 * The main application continues to use next.config.ts for dynamic features.
 */
const nextConfig: NextConfig = {
  // Enable static HTML export
  output: 'export',

  // Experimental features
  experimental: {
    optimizeCss: true,
  },

  // Skip trailing slash redirect
  skipTrailingSlashRedirect: true,

  // Image configuration (unoptimized for static export)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.saabuildingblocks.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.saabuildingblocks.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'staging.saabuildingblocks.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-3c51ef19c1ce47f99b970656a9f11a22.r2.dev',
        pathname: '/**',
      },
    ],
  },

  // TypeScript checking (disabled for build)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint checking (disabled for build)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Trailing slash for static hosting
  trailingSlash: true,

  // Environment variables
  env: {
    NEXT_PUBLIC_WORDPRESS_API_URL: process.env['NEXT_PUBLIC_WORDPRESS_API_URL'] || 'https://saabuildingblocks.com/wp-json/wp/v2',
  },
};

export default nextConfig;
