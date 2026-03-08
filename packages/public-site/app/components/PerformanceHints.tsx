/**
 * PerformanceHints Component
 *
 * Provides resource hints to the browser for optimal performance.
 * Only includes hints for domains that are actually used during page load.
 *
 * Note: imagedelivery.net preconnect is handled via Early Hints in public/_headers
 * (without crossorigin, matching how images are actually fetched).
 *
 * Removed (unused on page load):
 * - preconnect saabuildingblocks.com (API calls only happen in agent portal, not marketing pages)
 * - preconnect staging.saabuildingblocks.com (staging environment)
 * - preconnect imagedelivery.net with crossorigin (wrong CORS mode; _headers has correct one)
 * - dns-prefetch pub-3c51ef19c1ce47f99b970656a9f11a22.r2.dev (R2 CDN not used)
 * - dns-prefetch staging.smartagentalliance.com (staging environment)
 *
 * @see https://web.dev/preconnect-and-dns-prefetch/
 */

export function PerformanceHints() {
  return null;
}

export default PerformanceHints;
