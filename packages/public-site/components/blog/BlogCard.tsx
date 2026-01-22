/**
 * BlogCard Component
 *
 * Displays a blog post card with:
 * - Featured image with hover effect
 * - Title (H3 - auto-applies display font)
 * - Excerpt with line clamp
 * - Author and date metadata
 * - Category badges
 * - Click area linking to full post
 *
 * Uses GenericCard component from SAA design system
 * Colors: Brand palette (#e5e4dd, #dcdbd5, #ffd700)
 *
 * Performance optimization:
 * - Wrapped with React.memo to prevent re-renders when props haven't changed
 * - Uses shared IntersectionObserver (1 observer for all cards vs 20+ separate ones)
 */

import { memo, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GenericCard } from '@saa/shared/components/saa';
import type { BlogPost } from '@/lib/wordpress/types';
import { cleanExcerpt } from '@/lib/wordpress/fallbacks';
import { useSharedVisibility } from './useSharedVisibility';

export interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

/**
 * Convert category name to URL slug
 */
function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

function BlogCardComponent({ post, className = '' }: BlogCardProps) {
  // Get the primary category and convert to slug for URL
  const primaryCategory = post.categories[0] || 'uncategorized';
  const categorySlug = categoryToSlug(primaryCategory);

  // Use shared IntersectionObserver for all blog cards (1 observer vs 20+)
  const [cardRef, isVisible] = useSharedVisibility<HTMLDivElement>();

  // Track image loading state for smooth fade-in
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <div ref={cardRef} className={`h-full ${className}`}>
      <GenericCard hover padding="sm" className="h-full overflow-hidden !p-0">
        <Link
          href={`/blog/${categorySlug}/${post.slug}`}
          className="flex flex-col h-full group"
          aria-label={`Read full article: ${post.title}`}
        >
          {/* Featured Image - Only loads when card is near viewport */}
          {/* Image extends to card edges with rounded corners at top only */}
          <div className="relative w-full h-64 flex-shrink-0 overflow-hidden bg-gradient-to-br from-[#2a2a2a] to-[#191818] rounded-t-xl">
            {isVisible && post.featuredImage ? (
              <>
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`
                    object-cover
                    group-hover:scale-105
                    group-hover:brightness-110
                    ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                  `}
                  style={{
                    transition: 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s ease-out',
                  }}
                  loading="lazy"
                  onLoad={handleImageLoad}
                />
                {/* Gradient overlay on hover */}
                <div className="
                  absolute inset-0
                  bg-gradient-to-t from-black/60 to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                " />
              </>
            ) : (
              /* Placeholder shown until image is ready to load */
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-[#808080]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col flex-grow">
            {/* Category Badges */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category) => (
                  <span
                    key={category}
                    className="
                      inline-block
                      px-3 py-1
                      text-xs
                      font-[var(--font-taskor)]
                      text-[#ffd700]
                      bg-[#ffd700]/10
                      border border-[#ffd700]/30
                      rounded-full
                      uppercase
                      tracking-wider
                    "
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* Title (H3 - smaller and more appropriate for card grid) */}
            <h3
              className="
                text-h3
                font-bold
                mb-3
                text-[#e5e4dd]
                group-hover:text-[#ffd700]
                transition-colors duration-300
                leading-tight
              "
              style={{
                fontSize: 'clamp(20px, calc(20px + (50 - 20) * ((100vw - 250px) / (3000 - 250))), 50px)'
              }}
            >
              {post.title}
            </h3>

            {/* Description - prefer Rank Math meta description, fallback to cleaned excerpt */}
            {(post.metaDescription || post.excerpt) && (
              <p
                className="
                  font-[var(--font-amulya)]
                  text-body
                  text-[#dcdbd5]
                  mb-6
                  line-clamp-3
                  leading-relaxed
                  flex-grow
                "
              >
                {post.metaDescription || cleanExcerpt(post.excerpt, 200)}
              </p>
            )}

            {/* Author and Date Metadata - Professional Typography */}
            <div className="
              flex
              items-center
              gap-4
              pt-4
              mt-auto
              border-t border-[#e5e4dd]/15
              font-[var(--font-amulya)]
              text-xs
              tracking-wider
            ">
              {/* Author */}
              {post.author.name && (
                <>
                  <div className="flex items-center gap-2.5">
                    {isVisible && post.author.avatar && (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className="
                          rounded-full
                          ring-1.5
                          ring-[#e5e4dd]/30
                          flex-shrink-0
                          bg-[#dcdbd5]/10
                        "
                        loading="lazy"
                      />
                    )}
                    <span className="
                      font-medium
                      text-[#e5e4dd]
                      group-hover:text-[#ffd700]
                      transition-colors
                      duration-300
                      leading-snug
                    ">
                      {post.author.name}
                    </span>
                  </div>
                  <span className="text-[#e5e4dd]/20">•</span>
                </>
              )}

              {/* Date (Published or Updated based on modification) */}
              <time
                dateTime={post.modified && post.modified !== post.date ? post.modified : post.date}
                className="
                  text-[#dcdbd5]
                  group-hover:text-[#ffd700]
                  transition-colors
                  duration-300
                  leading-snug
                "
                title={`${post.modified && post.modified !== post.date ? 'Last updated' : 'Published'}: ${new Date(
                  post.modified && post.modified !== post.date ? post.modified : post.date
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}`}
              >
                {post.modified && post.modified !== post.date ? 'Updated' : 'Published'}{' '}
                {new Date(
                  post.modified && post.modified !== post.date ? post.modified : post.date
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>

              {/* Read time estimate (optional) */}
              {post.content && (
                <>
                  <span className="text-[#e5e4dd]/20">•</span>
                  <span className="
                    text-[#dcdbd5]
                    group-hover:text-[#ffd700]/80
                    transition-colors
                    duration-300
                    leading-snug
                  ">
                    {Math.ceil(post.content.split(' ').length / 200)} min read
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      </GenericCard>
    </div>
  );
}

// Memoize the component to prevent re-renders when props haven't changed
// This is crucial for performance when filtering - only new/removed posts will re-render
export const BlogCard = memo(BlogCardComponent);

export default BlogCard;
