/**
 * Cloudflare Images Loader for Next.js (GLOBAL DOMINANCE MODE)
 *
 * RESPONSIVE VARIANT SELECTION - LIGHTWEIGHT VERSION
 *
 * This loader automatically selects the optimal Cloudflare Images variant
 * based on the requested width:
 * - mobile (375px) for widths ≤ 375
 * - tablet (768px) for widths ≤ 768
 * - desktop (1280px) for widths ≤ 1280
 * - tablet2x (1536px) for widths ≤ 1536 (retina tablets)
 * - desktop2x (2560px) for larger sizes (retina desktops)
 *
 * NOTE: The URL mapping (WordPress → Cloudflare) is done at BUILD TIME
 * by sync-cloudflare-images.ts. This loader only handles variant selection
 * at runtime, keeping the client bundle small.
 *
 * Requires Cloudflare Images ($5/month):
 * https://developers.cloudflare.com/images/cloudflare-images/
 */

export default function cloudflareLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Check if this is a Cloudflare Images URL
  const isCloudflareImage = src.includes('imagedelivery.net');

  if (!isCloudflareImage) {
    // For non-Cloudflare images, return as-is
    // WordPress URLs should already be transformed to Cloudflare URLs at build time
    return src;
  }

  // For Cloudflare Images URLs, select the appropriate variant
  // based on the requested width (Next.js provides this).
  // On retina/HiDPI displays, Next.js requests 2× the CSS width,
  // so we need 2× variants to avoid blurry images.
  let variant = 'desktop2x'; // default fallback — largest variant

  if (width <= 375) {
    variant = 'mobile';     // 375px — 1× phone
  } else if (width <= 768) {
    variant = 'tablet';     // 768px — 1× tablet / 2× small phone
  } else if (width <= 1280) {
    variant = 'desktop';    // 1280px — 1× desktop
  } else if (width <= 1536) {
    variant = 'tablet2x';   // 1536px — 2× tablet
  }

  // Replace the variant in the URL
  // URL format: https://imagedelivery.net/{hash}/{id}/{variant}
  const urlParts = src.split('/');
  if (urlParts.length >= 6) {
    // Replace the last part (current variant) with the selected variant
    urlParts[urlParts.length - 1] = variant;
    return urlParts.join('/');
  }

  // If URL format doesn't match expected pattern, return as-is
  return src;
}
