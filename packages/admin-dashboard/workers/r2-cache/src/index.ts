/**
 * R2 Edge Cache Worker
 *
 * Sits in front of R2 bucket to provide global edge caching for profile images.
 * Uses Cloudflare's Cache API to cache images at the edge for fast delivery.
 *
 * Flow:
 * 1. Request comes to assets.saabuildingblocks.com/profiles/xyz.webp
 * 2. Worker checks edge cache first
 * 3. If cached, return immediately (sub-50ms globally)
 * 4. If not cached, fetch from R2, cache at edge, return
 */

export interface Env {
  ASSETS_BUCKET: R2Bucket;
}

// Cache TTL settings
const CACHE_TTL = {
  profiles: 60 * 60 * 24 * 365, // 1 year for profile images (URLs include ?v= cache-bust param when updated)
  default: 60 * 60 * 24 * 30,   // 30 days for other assets
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1); // Remove leading slash

    // Only handle GET requests
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Check edge cache first
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);

    let response = await cache.match(cacheKey);

    if (response) {
      // Cache hit - return cached response with header indicating cache hit
      const headers = new Headers(response.headers);
      headers.set('X-Cache', 'HIT');
      headers.set('CF-Cache-Status', 'HIT');
      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }

    // Cache miss - fetch from R2
    try {
      const object = await env.ASSETS_BUCKET.get(key);

      if (!object) {
        return new Response('Not found', { status: 404 });
      }

      // Determine content type
      const contentType = object.httpMetadata?.contentType || getContentType(key);

      // Determine cache TTL based on path
      const cacheTTL = key.startsWith('profiles/') ? CACHE_TTL.profiles : CACHE_TTL.default;

      // Build response headers
      const headers = new Headers();
      headers.set('Content-Type', contentType);
      headers.set('Cache-Control', `public, max-age=${cacheTTL}, immutable`);
      headers.set('X-Cache', 'MISS');
      headers.set('CF-Cache-Status', 'MISS');

      // Add ETag if available
      if (object.etag) {
        headers.set('ETag', object.etag);
      }

      // CORS headers for cross-origin requests
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

      // Create response
      response = new Response(object.body, {
        status: 200,
        headers,
      });

      // Cache the response at the edge (don't wait for it)
      ctx.waitUntil(cache.put(cacheKey, response.clone()));

      return response;
    } catch (error) {
      console.error('R2 fetch error:', error);
      return new Response('Internal server error', { status: 500 });
    }
  },
};

/**
 * Get content type from file extension
 */
function getContentType(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase();

  const types: Record<string, string> = {
    'webp': 'image/webp',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'pdf': 'application/pdf',
  };

  return types[ext || ''] || 'application/octet-stream';
}
