/**
 * Cloudflare Images Loader for Next.js (GLOBAL DOMINANCE MODE)
 *
 * RESPONSIVE VARIANT SELECTION
 *
 * This loader automatically selects the optimal Cloudflare Images variant
 * based on the requested width:
 * - mobile (375px) for widths ≤ 375
 * - tablet (768px) for widths ≤ 768
 * - desktop (1280px) for widths ≤ 1280
 * - public (original) for larger sizes
 *
 * Next.js Image component automatically generates srcset with multiple widths,
 * and this loader returns the appropriate variant URL for each width.
 *
 * The heavy lifting is done by:
 * 1. sync-cloudflare-images.ts (uploads images to Cloudflare)
 * 2. _redirects file (301 redirects WordPress URLs → Cloudflare Images)
 * 3. Cloudflare Images variants (automatically resize images)
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
    // For non-Cloudflare images (local images, external URLs)
    // just return as-is - they'll be handled by _redirects if needed
    return src;
  }

  // For Cloudflare Images URLs, select the appropriate variant
  // based on the requested width (Next.js provides this)
  let variant = 'public'; // default fallback

  if (width <= 375) {
    variant = 'mobile';   // 375px variant
  } else if (width <= 768) {
    variant = 'tablet';   // 768px variant
  } else if (width <= 1280) {
    variant = 'desktop';  // 1280px variant
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
