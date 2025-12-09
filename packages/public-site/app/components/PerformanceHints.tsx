/**
 * PerformanceHints Component
 *
 * Provides resource hints to the browser for optimal performance:
 * - preconnect: Establish early connections to critical domains
 * - dns-prefetch: Resolve DNS for domains before they're needed
 *
 * These hints improve page load performance by reducing connection overhead
 * when fetching resources from external domains.
 *
 * @see https://web.dev/preconnect-and-dns-prefetch/
 */

export function PerformanceHints() {
  return (
    <>
      {/* Preconnect to production domain - highest priority */}
      <link
        rel="preconnect"
        href="https://saabuildingblocks.com"
        crossOrigin="anonymous"
      />

      {/* Preconnect to staging domain */}
      <link
        rel="preconnect"
        href="https://staging.saabuildingblocks.com"
        crossOrigin="anonymous"
      />

      {/* Preconnect to Cloudflare Images CDN - critical for LCP */}
      <link
        rel="preconnect"
        href="https://imagedelivery.net"
        crossOrigin="anonymous"
      />

      {/* DNS prefetch for Cloudflare R2 CDN (images/media) */}
      <link
        rel="dns-prefetch"
        href="https://pub-3c51ef19c1ce47f99b970656a9f11a22.r2.dev"
      />

      {/* DNS prefetch for WordPress API */}
      <link
        rel="dns-prefetch"
        href="https://staging.smartagentalliance.com"
      />
    </>
  );
}

export default PerformanceHints;
