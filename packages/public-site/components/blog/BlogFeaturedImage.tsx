/**
 * BlogFeaturedImage Component
 * Hero image for blog posts with Next.js Image optimization
 * Displays featured image with responsive sizes and loading states
 */

import Image from 'next/image';
import type { BlogPost } from '@/lib/wordpress/types';

export interface BlogFeaturedImageProps {
  post: BlogPost;
  priority?: boolean;
  className?: string;
}

/**
 * Skeleton loader for featured image
 */
function FeaturedImageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`w-full aspect-[16/9] bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse ${className || ''}`}
      aria-label="Loading featured image"
    >
      <div className="flex items-center justify-center h-full">
        <svg
          className="w-16 h-16 text-gray-600"
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
    </div>
  );
}

/**
 * Fallback image when featured image is missing
 */
function FallbackImage({ title, className }: { title: string; className?: string }) {
  return (
    <div
      className={`w-full aspect-[16/9] bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden ${className || ''}`}
      aria-label={`Featured image placeholder for ${title}`}
    >
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-32 h-32 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 border-2 border-white rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Title overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg line-clamp-3">
          {title}
        </h3>
      </div>
    </div>
  );
}

/**
 * BlogFeaturedImage Component
 *
 * Displays optimized featured image for blog posts with:
 * - Next.js Image component for automatic optimization
 * - Responsive sizes for different viewports
 * - Loading skeleton during image load
 * - Fallback for missing images
 * - Proper aspect ratio (16:9)
 *
 * @param post - Blog post object with featuredImage data
 * @param priority - Whether to prioritize loading (LCP optimization)
 * @param className - Additional CSS classes
 */
export default function BlogFeaturedImage({
  post,
  priority = false,
  className = ''
}: BlogFeaturedImageProps) {
  const { featuredImage, title } = post;

  // No featured image - show fallback
  if (!featuredImage) {
    return <FallbackImage title={title} className={className} />;
  }

  return (
    <div className={`relative w-full aspect-[16/9] overflow-hidden bg-gray-900 ${className}`}>
      <Image
        src={featuredImage.url}
        alt={featuredImage.alt || title}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzFhMjAyYyIvPjwvc3ZnPg=="
      />
    </div>
  );
}

/**
 * Export skeleton for use in loading states
 */
export { FeaturedImageSkeleton };
