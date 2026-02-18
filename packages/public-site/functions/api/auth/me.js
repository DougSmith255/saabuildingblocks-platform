/**
 * Cloudflare Function: /api/auth/me
 *
 * Same-origin proxy for fetching fresh user data.
 * Proxies requests to the admin-dashboard API on the VPS.
 * This avoids cross-origin issues when the portal runs on pages.dev.
 *
 * IMPORTANT: Uses cf.cacheTtl = 0 to bypass Cloudflare edge caching.
 * This ensures every request gets fresh data from the database.
 */

const VPS_API_URL = 'https://saabuildingblocks.com';

export async function onRequestGet(context) {
  const authorization = context.request.headers.get('Authorization');

  if (!authorization) {
    return new Response(
      JSON.stringify({ success: false, error: 'No authorization header' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Cache-busting timestamp prevents ANY caching layer from returning stale data
    const cacheBuster = `_t=${Date.now()}`;
    const url = new URL(`${VPS_API_URL}/api/auth/me`);
    url.searchParams.set('_t', cacheBuster);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
      // Bypass Cloudflare edge cache — always fetch fresh from origin
      cf: {
        cacheTtl: 0,
        cacheEverything: false,
      },
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Proxy request failed' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
