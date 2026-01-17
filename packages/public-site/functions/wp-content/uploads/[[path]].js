/**
 * Cloudflare Pages Function: Dynamic Image Variant Selector
 *
 * This function runs automatically for /wp-content/uploads/* routes.
 * No separate Worker deployment needed - it's built into Cloudflare Pages!
 *
 * How it works:
 * 1. Browser requests: /wp-content/uploads/2025/11/image.webp?w=640
 * 2. This function intercepts the request
 * 3. Looks up Cloudflare Images ID from mapping
 * 4. Selects optimal variant based on width
 * 5. Returns 302 redirect to Cloudflare Images variant
 */

// Image mapping: filename → Cloudflare Images ID
// Auto-generated from cloudflare-images-mapping.json
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
 * Select optimal Cloudflare Images variant based on requested width
 */
function selectVariant(request) {
  const url = new URL(request.url);

  // Get width from URL parameter (e.g., ?w=640 from srcset)
  const widthParam = url.searchParams.get('w');

  // Get from Client Hints headers (if available)
  const viewportWidth = request.headers.get('Viewport-Width');
  const dpr = parseFloat(request.headers.get('DPR') || '1');

  // Calculate effective width
  let width = 1920; // default

  if (widthParam) {
    width = parseInt(widthParam);
  } else if (viewportWidth) {
    width = parseInt(viewportWidth) * dpr;
  }

  // Select variant based on width
  // Matches our created variants: mobile (375), tablet (768), desktop (1280)
  if (width <= 375) return 'mobile';
  if (width <= 768) return 'tablet';
  if (width <= 1280) return 'desktop';

  return 'public'; // fallback to original size
}

/**
 * Pages Function handler
 * Runs for every request to /wp-content/uploads/*
 */
export async function onRequest(context) {
  const { request, params } = context;

  // Extract filename from path
  // params.path will be like ["2025", "11", "image.webp"]
  const pathParts = params.path || [];
  const filename = pathParts[pathParts.length - 1];

  // Look up Cloudflare Images ID
  const mapping = IMAGE_MAPPING[filename];

  if (!mapping) {
    // Image not in mapping - return 404
    console.log(`Image not found in mapping: ${filename}`);
    return new Response('Image not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // Select optimal variant
  const variant = selectVariant(request);

  // Build Cloudflare Images URL
  const cloudflareUrl = `https://imagedelivery.net/${mapping.hash}/${mapping.id}/${variant}`;

  // Log for debugging (visible in Pages deployment logs)
  console.log(`Redirecting ${filename} → ${variant} variant (${cloudflareUrl})`);

  // Return 302 redirect
  // Using 302 (temporary) allows variant selection to adapt
  return Response.redirect(cloudflareUrl, 302);
}
