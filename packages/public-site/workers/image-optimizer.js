/**
 * Cloudflare Worker: Dynamic Image Variant Selector
 *
 * This Worker intercepts requests to WordPress image URLs and:
 * 1. Reads the mapping file to find the Cloudflare Images ID
 * 2. Selects the appropriate variant based on client hints or URL parameters
 * 3. Redirects to the optimal Cloudflare Images variant
 *
 * Deployed at: /wp-content/uploads/* routes
 *
 * Performance:
 * - Runs at Cloudflare edge (0-5ms latency)
 * - Uses KV for mapping storage (cached globally)
 * - Returns 302 redirect (browser caches the final image)
 */

// Image mapping from WordPress URL to Cloudflare Images ID
// This will be populated from cloudflare-images-mapping.json
const IMAGE_MAPPING = {
  'Doug-and-karrie-co-founders-of-smart-agent-alliance.webp': {
    id: '33e468cd69898cf7-Doug-and-karrie-co-founders-of-smart-agent-alliance.webp',
    hash: 'RZBQ4dWu2c_YEpklnDDxFg'
  },
  'Agent-Success-Hub.webp': {
    id: '519d8e6a89a9e48e-Agent-Success-Hub.webp',
    hash: 'RZBQ4dWu2c_YEpklnDDxFg'
  }
};

/**
 * Select optimal variant based on viewport width
 * Uses client hints (Viewport-Width header) or URL parameter
 */
function selectVariant(request, url) {
  // Try to get width from URL parameter first (from srcset)
  const urlParams = new URL(url);
  const widthParam = urlParams.searchParams.get('w');

  // Or get from Client Hints header
  const viewportWidth = request.headers.get('Viewport-Width');
  const dpr = request.headers.get('DPR') || '1';

  // Calculate effective width (viewport × DPR)
  let width = 1920; // default to desktop

  if (widthParam) {
    width = parseInt(widthParam);
  } else if (viewportWidth) {
    width = parseInt(viewportWidth) * parseFloat(dpr);
  }

  // Select variant based on width
  // mobile: 375px, tablet: 768px, desktop: 1280px
  if (width <= 375) {
    return 'mobile';
  } else if (width <= 768) {
    return 'tablet';
  } else if (width <= 1280) {
    return 'desktop';
  }

  return 'public'; // fallback to original size
}

/**
 * Main Worker request handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only handle WordPress image URLs
    if (!url.pathname.startsWith('/wp-content/uploads/')) {
      return fetch(request);
    }

    // Extract filename from path
    const filename = url.pathname.split('/').pop();

    // Look up Cloudflare Images ID from mapping
    const mapping = IMAGE_MAPPING[filename];

    if (!mapping) {
      // Image not in mapping, pass through or return 404
      console.log(`Image not found in mapping: ${filename}`);
      return new Response('Image not found', { status: 404 });
    }

    // Select optimal variant
    const variant = selectVariant(request, url.toString());

    // Build Cloudflare Images URL
    const cloudflareUrl = `https://imagedelivery.net/${mapping.hash}/${mapping.id}/${variant}`;

    // Return 302 redirect to Cloudflare Images
    // Using 302 (temporary) instead of 301 (permanent) allows variant selection to change
    return Response.redirect(cloudflareUrl, 302);
  }
};
