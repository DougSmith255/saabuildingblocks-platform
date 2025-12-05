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
  // NOTE: inlineCss breaks Tailwind arbitrary values like bg-[rgb(45,45,45)]
  // Disabled until Turbopack properly supports it
  // experimental: {
  //   inlineCss: true,
  // },

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
    // Remote patterns for WordPress images (improves caching)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.saabuildingblocks.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },

  // Experimental webpack optimizations for faster builds
  experimental: {
    // Optimize CSS handling
    optimizeCss: true,
    // Faster webpack builds
    webpackBuildWorker: true,
    // Inline critical CSS to eliminate render-blocking stylesheets
    // WARNING: May break Tailwind arbitrary values like bg-[rgb(45,45,45)]
    // Testing to see if it improves LCP performance
    inlineCss: true,
    // View Transitions API for smooth page-to-page navigation
    // Supported: Chrome, Edge, Safari 18+. Graceful fallback for others.
    viewTransition: true,
  },

  // Turbopack configuration (Next.js 16+)
  // Empty config to silence the Turbopack warning while using webpack
  turbopack: {},

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

  // Webpack optimizations to reduce long main-thread tasks
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split chunks more aggressively to avoid long main-thread tasks
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Split large vendor libraries into separate chunks
            default: false,
            vendors: false,
            // Framework chunk (React, Next.js core)
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Common libraries chunk
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module: any) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
                return `npm.${packageName?.replace('@', '')}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // Commons chunk for shared code
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
          },
          // Limit max initial requests to avoid too many small chunks
          maxInitialRequests: 25,
          // Minimum size for a chunk to be generated (20KB)
          minSize: 20000,
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
