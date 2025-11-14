/**
 * Cloudflare Image Resizing Loader for Next.js
 *
 * This loader integrates Next.js Image component with Cloudflare's Image Resizing service.
 * Automatically generates optimized image URLs with responsive sizing.
 *
 * Requires Cloudflare Image Resizing to be enabled ($5/month):
 * https://developers.cloudflare.com/images/image-resizing/
 *
 * How it works:
 * - Desktop: Full quality, larger sizes
 * - Tablet: Medium quality, medium sizes
 * - Mobile: Lower quality, smaller sizes
 * - Automatic format conversion (WebP/AVIF for modern browsers)
 */

export default function cloudflareLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Default quality settings
  const defaultQuality = quality || 85;

  // Handle external URLs (pass through without modification)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Build Cloudflare Image Resizing URL
  // Format: /cdn-cgi/image/[options]/[image-path]
  const params = [
    `width=${width}`,
    `quality=${defaultQuality}`,
    'format=auto', // Automatically serve WebP/AVIF to modern browsers
  ];

  return `/cdn-cgi/image/${params.join(',')}${src}`;
}
