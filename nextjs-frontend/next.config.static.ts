import type { NextConfig } from 'next';

/**
 * Next.js 15 Configuration for Static Export to Cloudflare Pages
 *
 * This config exports ONLY public-facing pages as static HTML.
 * API routes, Master Controller, and Agent Portal remain on PM2 origin server.
 * Cloudflare Pages _redirects file proxies protected routes back to origin.
 */
const staticConfig: NextConfig = {
  /**
   * Enable static HTML export
   * Generates /out directory with pre-rendered HTML
   */
  output: 'export',

  /**
   * Disable server features not needed for static export
   */
  experimental: {
    optimizeCss: true,
  },

  /**
   * Image optimization disabled for static export
   * Images served directly without Next.js optimization
   */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'saabuildingblocks.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.saabuildingblocks.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-3c51ef19c1ce47f99b970656a9f11a22.r2.dev',
        pathname: '/**',
      },
    ],
  },

  /**
   * Trailing slash for better static hosting compatibility
   */
  trailingSlash: true,

  /**
   * TypeScript and ESLint checks
   * TEMPORARILY DISABLED - Re-enable after Phase 2 cleanup
   */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  /**
   * Environment variables for client-side
   */
  env: {
    NEXT_PUBLIC_WORDPRESS_API_URL: process.env['NEXT_PUBLIC_WORDPRESS_API_URL'] || 'https://saabuildingblocks.com/wp-json',
    NEXT_PUBLIC_API_URL: process.env['NEXT_PUBLIC_API_URL'] || 'https://saabuildingblocks.com/api',
  },

  /**
   * Skip trailing slash redirect
   */
  skipTrailingSlashRedirect: true,
};

export default staticConfig;
