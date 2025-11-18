import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

/**
 * Next.js Configuration for Public Site (Static Export)
 *
 * This configuration is for the public-facing static site deployed to Cloudflare Pages.
 * It uses static export to generate HTML files for all public routes.
 *
 * Performance Tools (2025):
 * - Bundle Analyzer: Run with ANALYZE=true to visualize bundle sizes
 * - React Compiler: Stable in Next.js 16 - automatically memoizes components
 */

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Enable static export for Cloudflare Pages deployment
  output: 'export',

  // React Compiler (stable in Next.js 16) - automatic memoization
  // Reduces unnecessary re-renders without manual optimization
  reactCompiler: true,

  // Experimental features (2025)
  experimental: {
    // Inline CSS to eliminate render-blocking CSS requests
    inlineCss: true,
  },

  // Compiler optimizations for modern browsers
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Cloudflare Image Resizing integration
  // Uses Cloudflare's Image Resizing service ($5/month) for automatic responsive images
  images: {
    loader: 'custom',
    loaderFile: './lib/cloudflare-image-loader.ts',
  },

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

export default withBundleAnalyzer(nextConfig);
