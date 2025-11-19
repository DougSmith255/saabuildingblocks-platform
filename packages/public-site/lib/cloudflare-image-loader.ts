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
 * 2. cloudflare-images-mapping.json (WordPress URL → Cloudflare Images mapping)
 * 3. Cloudflare Images variants (automatically resize images)
 *
 * Requires Cloudflare Images ($5/month):
 * https://developers.cloudflare.com/images/cloudflare-images/
 */

// Import the mapping file at build time
import imageMapping from '../cloudflare-images-mapping.json';

export default function cloudflareLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) {
  // For WordPress images, transform to Cloudflare Images URL
  if (src.includes('wp.saabuildingblocks.com/wp-content/uploads/')) {
    // Look up the Cloudflare Images URL from the mapping
    const mapping = imageMapping.find(m => m.wordpressUrl === src);

    if (mapping) {
      // Use the Cloudflare Images URL with variant selection
      src = mapping.cloudflareUrl;
    } else {
      // Fallback: if not in mapping, return WordPress URL
      // This handles images that haven't been synced yet
      return `${src}?w=${width}`;
    }
  }

  // Check if this is a Cloudflare Images URL
  const isCloudflareImage = src.includes('imagedelivery.net');

  if (!isCloudflareImage) {
    // For non-Cloudflare images (local images, external URLs)
    // just return as-is
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
