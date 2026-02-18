import type { NextConfig } from 'next';

/**
 * Next.js Configuration for Admin Dashboard (Dynamic Mode)
 *
 * This configuration is for the admin dashboard deployed to VPS.
 * It runs in dynamic mode with all server features enabled:
 * - API routes
 * - Server actions
 * - Authentication middleware
 * - Real-time features
 */

const nextConfig: NextConfig = {
  // Dynamic mode - DO NOT set output: 'export'
  // This allows API routes and server features

  // Image optimization enabled (VPS has runtime)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.saabuildingblocks.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },

  // Environment variables available in the browser
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://smartagentalliance.com',
    WORDPRESS_URL: process.env.WORDPRESS_URL || 'https://wp.saabuildingblocks.com',
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
