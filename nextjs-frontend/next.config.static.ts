import type { NextConfig } from 'next';

/**
 * 🌍 CLOUDFLARE PAGES CONFIGURATION (STATIC EXPORT)
 *
 * PURPOSE: Public-facing static site on global CDN (300+ edge locations)
 * DEPLOYMENT: Cloudflare Pages
 * URL: https://saabuildingblocks.pages.dev
 *
 * FEATURES EXPORTED:
 * ✅ Public content pages (homepage, about, blog, etc.)
 * ✅ Master Controller CSS (settings baked from Supabase)
 * ✅ Lightning-fast delivery (20-50ms TTFB globally)
 *
 * NOT EXPORTED (stays on VPS):
 * ❌ Master Controller UI (admin interface)
 * ❌ API routes (Next.js excludes automatically)
 * ❌ Authentication pages
 * ❌ Agent Portal
 *
 * DEPLOY COMMANDS:
 * npm run generate:css  # Generate CSS from Supabase
 * npm run export:clean   # Build static export
 * npx wrangler pages deploy out --project-name=saabuildingblocks
 *
 * OR USE SAFE SCRIPT (recommended):
 * bash scripts/build-export-safe.sh
 *
 * CRITICAL: API routes excluded automatically by Next.js (no file movement)
 */
const staticConfig: NextConfig = {
  /**
   * Enable static HTML export
   * Generates /out directory with pre-rendered HTML
   */
  output: 'export',

  /**
   * API routes excluded automatically by Next.js 16
   * No exportPathMap needed - Next.js handles this automatically
   */

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
   * TypeScript checks
   * TEMPORARILY DISABLED - Re-enable after Phase 2 cleanup
   */
  typescript: {
    ignoreBuildErrors: true,
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
