/**
 * Optimized Image Component for Cloudflare Image Resizing
 *
 * This component generates responsive images that work with Cloudflare's Image Resizing
 * service while supporting Next.js static export.
 *
 * Features:
 * - Responsive srcset for different screen sizes
 * - Automatic WebP/AVIF format conversion
 * - Lazy loading by default
 * - Works with static export (output: 'export')
 *
 * Usage:
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   width={1200}
 *   height={800}
 * />
 */

'use client';

import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  quality?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality = 85,
  className = '',
  priority = false,
  sizes = '100vw',
  style,
}: OptimizedImageProps) {
  // Generate Cloudflare Image Resizing URL
  const cloudflareUrl = (imgSrc: string, imgWidth: number, imgQuality: number = quality) => {
    // Skip external URLs
    if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) {
      return imgSrc;
    }

    return `/cdn-cgi/image/width=${imgWidth},quality=${imgQuality},format=auto${imgSrc}`;
  };

  // Generate responsive srcset for different screen sizes
  const generateSrcSet = () => {
    const widths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    const applicableWidths = widths.filter((w) => w <= width);

    // Always include the original width
    if (!applicableWidths.includes(width)) {
      applicableWidths.push(width);
    }

    return applicableWidths
      .map((w) => `${cloudflareUrl(src, w)} ${w}w`)
      .join(', ');
  };

  return (
    <img
      src={cloudflareUrl(src, width)}
      srcSet={generateSrcSet()}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      className={className}
      style={{
        maxWidth: '100%',
        height: 'auto',
        ...style,
      }}
    />
  );
}
