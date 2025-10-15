import type { NextConfig } from 'next';

/**
 * Next.js 15 Configuration for Static Export to Cloudflare Pages
 *
 * Key Features:
 * - Static export mode for Cloudflare Pages deployment
 * - Optimized image handling with unoptimized export
 * - Dynamic routes excluded via `dynamic = 'force-dynamic'`
 * - WordPress API integration ready
 *
 * Excluded Routes (VPS-only, not exported):
 * - /login (auth)
 * - /sign-up (auth)
 * - /accept-invitation/[token] (auth)
 * - /agent-portal/* (admin dashboard)
 * - /master-controller/* (settings admin - no page.tsx, uses client-side)
 *
 * See: STATIC-EXPORT-EXCLUDED-ROUTES.md for complete list
 */
const nextConfig: NextConfig = {
  /**
   * Enable static HTML export for Cloudflare Pages
   * Routes with `export const dynamic = 'force-dynamic'` will be excluded automatically
   */
  output: 'export',

  /**
   * Experimental features (Next.js 15)
   * Combined configuration for all experimental options
   */
  experimental: {
    optimizeCss: true,
  },

  /**
   * File tracing root (moved out of experimental in Next.js 15)
   * Temporarily disabled to fix build issues
   */
  // outputFileTracingRoot: '/home/claude-flow',

  /**
   * Skip trailing slash redirect (moved out of experimental in Next.js 15)
   */
  skipTrailingSlashRedirect: true,

  /**
   * Image configuration
   * - WordPress domain allowed for external images
   * - Unoptimized mode for Cloudflare Pages static export
   */
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
        hostname: 'staging.smartagentalliance.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-3c51ef19c1ce47f99b970656a9f11a22.r2.dev',
        pathname: '/**',
      },
    ],
  },

  /**
   * TypeScript checking during build (temporarily disabled for development)
   */
  typescript: {
    ignoreBuildErrors: true,
  },

  /**
   * ESLint checking during build (temporarily disabled for development)
   */
  eslint: {
    ignoreDuringBuilds: true,
  },

  /**
   * Trailing slash configuration
   * Set to true for better static hosting compatibility (Cloudflare Pages)
   */
  trailingSlash: true,

  /**
   * Security headers for authentication system
   * NOTE: Disabled for static export - use Cloudflare Pages _headers file instead
   * See: /public/_headers for Cloudflare Pages header configuration
   */
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         // Headers configuration here...
  //       ],
  //     },
  //   ];
  // },

  /**
   * Environment variables available to the browser
   */
  env: {
    NEXT_PUBLIC_WORDPRESS_API_URL: process.env['NEXT_PUBLIC_WORDPRESS_API_URL'] || 'https://saabuildingblocks.com/wp-json',
  },
};

export default nextConfig;
