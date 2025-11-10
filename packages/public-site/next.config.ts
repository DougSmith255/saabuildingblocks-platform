import type { NextConfig } from 'next';

/**
 * Next.js Configuration for Public Site (Static Export)
 *
 * This configuration is for the public-facing static site deployed to Cloudflare Pages.
 * It uses static export to generate HTML files for all public routes.
 */

const nextConfig: NextConfig = {
  // Enable static export for Cloudflare Pages deployment
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Production URL - only use CDN when explicitly deploying to Cloudflare
  // Use CLOUDFLARE_DEPLOY=true during CI/CD, not NODE_ENV=production
  assetPrefix: process.env.CLOUDFLARE_DEPLOY === 'true'
    ? 'https://saabuildingblocks.pages.dev'
    : undefined,

  // Trailing slashes for better CDN caching
  trailingSlash: true,

  // Disable server features (not available in static export)
  // No middleware, no API routes, no server components with dynamic features

  // Environment variables available in the browser
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://saabuildingblocks.com',
    WORDPRESS_URL: process.env.WORDPRESS_URL || 'https://wp.saabuildingblocks.com',
  },

  // TypeScript configuration
  typescript: {
    // Type checking happens in workspace root
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
