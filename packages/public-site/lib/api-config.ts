/**
 * API Configuration
 *
 * Centralized API URL configuration for the public site.
 * When migrating to a new domain, only this file needs to be updated.
 */

/**
 * Admin Dashboard API URL
 * This is where auth, user profiles, agent pages, and other API calls go.
 *
 * For production: https://saabuildingblocks.com (or smartagentalliance.com after migration)
 * The API runs on the VPS via PM2 and is proxied through Apache.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://saabuildingblocks.com';

/**
 * Public Site URL
 * This is the Cloudflare Pages URL where agent attraction pages are hosted.
 *
 * For production: https://saabuildingblocks.pages.dev (or smartagentalliance.com after migration)
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartagentalliance.com';

/**
 * CDN URL for assets
 * Used for profile pictures, agent page images, etc.
 */
export const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.saabuildingblocks.com';

/**
 * WordPress API URL
 * Used for fetching blog posts and content.
 */
export const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://wp.saabuildingblocks.com';

/**
 * Helper function to build API endpoint URLs
 */
export function apiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
}

/**
 * Helper function to build site URLs (for agent pages, etc.)
 */
export function siteUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}
