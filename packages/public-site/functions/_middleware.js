/**
 * Cloudflare Pages Middleware
 *
 * This middleware runs before all Pages Functions and can modify responses.
 * Used to handle security headers that need to be different for certain routes.
 */

export async function onRequest(context) {
  // Get the response from the next handler
  const response = await context.next();

  // Clone the response so we can modify headers
  const newResponse = new Response(response.body, response);

  // Get the URL path
  const url = new URL(context.request.url);
  const path = url.pathname;

  // For agent attraction pages (single slug, not containing special paths),
  // allow iframe embedding by removing X-Frame-Options
  // These are paths like /doug-smart, /jane-doe, etc.
  const isAgentPage = path.match(/^\/[a-z0-9-]+\/?$/i) &&
    !path.startsWith('/api') &&
    !path.startsWith('/agent-portal') &&
    !path.startsWith('/master-controller') &&
    !path.startsWith('/blog') &&
    !path.startsWith('/about') &&
    !path.startsWith('/_next') &&
    !path.startsWith('/fonts') &&
    !path.startsWith('/images') &&
    path !== '/' &&
    !path.endsWith('-links') &&
    !path.endsWith('-links/');

  if (isAgentPage) {
    // Remove X-Frame-Options to allow iframe embedding
    newResponse.headers.delete('X-Frame-Options');
    // Add CSP frame-ancestors as the modern alternative
    newResponse.headers.set('Content-Security-Policy', "frame-ancestors 'self' https://saabuildingblocks.pages.dev https://smartagentalliance.com");
  }

  return newResponse;
}
