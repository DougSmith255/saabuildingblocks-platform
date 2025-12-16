/**
 * Cloudflare Pages Middleware: Performance Optimizations + Agent Pages
 *
 * This middleware runs on EVERY request before serving the page.
 * It handles:
 *
 * 1. Dynamic Agent Pages - Serve agent pages from KV at /{slug}
 * 2. Early Hints (103) - Tell browser to preload resources before HTML arrives
 * 3. Preconnect headers - Establish connections to third-party domains early
 * 4. Cache-Control optimization - Ensure proper caching behavior
 * 5. Security headers - Add security best practices
 *
 * @see https://developers.cloudflare.com/pages/functions/middleware/
 */

/**
 * Critical resources to preload via Early Hints
 * These are resources needed for first paint / LCP
 */
const CRITICAL_RESOURCES = [
  // Fonts - preload critical fonts
  { url: '/fonts/taskor-regular-webfont.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
  { url: '/fonts/Synonym-Variable.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
];

/**
 * Third-party domains to preconnect to
 * Establishes TCP+TLS handshake early, saving ~100-300ms per domain
 */
const PRECONNECT_DOMAINS = [
  'https://imagedelivery.net',        // Cloudflare Images (hero images)
  'https://plausible.saabuildingblocks.com', // Analytics
];

/**
 * Build Link header value for preloads
 */
function buildLinkHeader(resources, preconnects) {
  const links = [];

  // Add preload links
  for (const resource of resources) {
    let link = `<${resource.url}>; rel=preload; as=${resource.as}`;
    if (resource.type) link += `; type="${resource.type}"`;
    if (resource.crossorigin) link += `; crossorigin=${resource.crossorigin}`;
    links.push(link);
  }

  // Add preconnect links
  for (const domain of preconnects) {
    links.push(`<${domain}>; rel=preconnect`);
  }

  return links.join(', ');
}

/**
 * Main middleware handler
 */
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Skip middleware for static assets (let Cloudflare handle them directly)
  const staticExtensions = ['.js', '.css', '.woff2', '.woff', '.ttf', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.json'];
  if (staticExtensions.some(ext => url.pathname.endsWith(ext))) {
    return next();
  }

  // Build Early Hints link header
  const linkHeader = buildLinkHeader(CRITICAL_RESOURCES, PRECONNECT_DOMAINS);

  // Send 103 Early Hints (if supported by browser)
  // This tells the browser to start loading resources BEFORE the HTML response arrives
  // Note: Cloudflare Pages automatically handles Early Hints when Link headers are present

  // Get the response from the origin
  const response = await next();

  // Clone response to modify headers
  const newHeaders = new Headers(response.headers);

  // Add Link header for preloads (browsers will honor these even without 103)
  newHeaders.set('Link', linkHeader);

  // Add security headers
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('X-Frame-Options', 'DENY');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Optimize cache for HTML pages
  if (url.pathname === '/' || url.pathname.endsWith('/')) {
    // HTML pages: cache at edge for 1 hour, stale-while-revalidate for 1 day
    // This dramatically speeds up repeat visits while still updating content
    newHeaders.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
  }

  // Return modified response
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
