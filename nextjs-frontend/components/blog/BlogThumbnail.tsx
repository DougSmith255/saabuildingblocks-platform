/**
 * BlogThumbnail Component
 * Optimized small images for blog post cards and listing pages
 * Consistent aspect ratio with lazy loading
 */

import Image from 'next/image';
import type { BlogPost } from '@/lib/wordpress/types';

interface BlogThumbnailProps {
  post: BlogPost;
  size?: 'small' | 'medium' | 'large';
  aspectRatio?: '16/9' | '4/3' | '1/1';
  className?: string;
}

/**
 * Size mappings for different thumbnail sizes
 */
const SIZE_CONFIG = {
  small: {
    sizes: '(max-width: 640px) 100vw, 300px',
    quality: 75,
  },
  medium: {
    sizes: '(max-width: 640px) 100vw, 400px',
    quality: 80,
  },
  large: {
    sizes: '(max-width: 640px) 100vw, 600px',
    quality: 85,
  },
} as const;

/**
 * Fallback thumbnail when image is missing
 */
function FallbackThumbnail({
  title,
  aspectRatio,
  className
}: {
  title: string;
  aspectRatio: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden ${className || ''}`}
      style={{ aspectRatio }}
      aria-label={`Thumbnail placeholder for ${title}`}
    >
      {/* Icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-white/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}

/**
 * BlogThumbnail Component
 *
 * Displays optimized thumbnail images for blog post cards with:
 * - Consistent aspect ratios
 * - Optimized for listing pages
 * - Multiple size options
 * - Lazy loading by default
 * - Fallback for missing images
 *
 * @param post - Blog post object with featuredImage data
 * @param size - Thumbnail size preset (small/medium/large)
 * @param aspectRatio - Image aspect ratio
 * @param className - Additional CSS classes
 */
export default function BlogThumbnail({
  post,
  size = 'medium',
  aspectRatio = '16/9',
  className = ''
}: BlogThumbnailProps) {
  const { featuredImage, title } = post;
  const config = SIZE_CONFIG[size];

  // No featured image - show fallback
  if (!featuredImage) {
    return (
      <FallbackThumbnail
        title={title}
        aspectRatio={aspectRatio}
        className={className}
      />
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden bg-gray-900 ${className}`}
      style={{ aspectRatio }}
    >
      <Image
        src={featuredImage.url}
        alt={featuredImage.alt || title}
        fill
        sizes={config.sizes}
        quality={config.quality}
        className="object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzFhMjAyYyIvPjwvc3ZnPg=="
      />
    </div>
  );
}

/**
 * Export size configuration for external use
 */
export { SIZE_CONFIG };
