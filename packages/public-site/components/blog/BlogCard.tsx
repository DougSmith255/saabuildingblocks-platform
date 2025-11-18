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
 * Follows AI Agent Page Building Protocol:
 * - Typography: H3 auto-applies display font, body uses Amulya
 * - Colors: Brand palette only (#e5e4dd, #dcdbd5, #00ff88)
 * - Responsive: Fluid typography with clamp()
 * - Accessibility: Semantic HTML, proper ARIA labels
 *
 * Performance optimization:
 * - Wrapped with React.memo to prevent re-renders when props haven't changed
 */

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/wordpress/types';

export interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

function BlogCardComponent({ post, className = '' }: BlogCardProps) {
  return (
    <article
      className={`
        border border-[#e5e4dd]/20
        rounded-lg
        overflow-hidden
        hover:border-[#00ff88]/50
        transition-all duration-300
        hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]
        flex flex-col
        h-full
        ${className}
      `.trim()}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="flex flex-col h-full group"
        aria-label={`Read full article: ${post.title}`}
      >
        {/* Featured Image - Always display, with fallback background */}
        <div className="relative w-full h-64 flex-shrink-0 overflow-hidden bg-gradient-to-br from-[#2a2a2a] to-[#191818]">
          {post.featuredImage ? (
            <>
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                width={post.featuredImage.width}
                height={post.featuredImage.height}
                className="
                  w-full h-full
                  object-cover
                  group-hover:scale-105
                  transition-transform duration-500
                  group-hover:brightness-110
                "
                loading="lazy"
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
            /* Fallback placeholder when no featured image */
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
              group-hover:text-[#00ff88]
              transition-colors duration-300
              leading-tight
            "
            style={{
              fontSize: 'clamp(20px, calc(20px + (50 - 20) * ((100vw - 250px) / (3000 - 250))), 50px)'
            }}
          >
            {post.title}
          </h3>

          {/* Excerpt with line clamp */}
          {post.excerpt && (
            <div
              className="
                font-[var(--font-amulya)]
                text-body
                text-[#dcdbd5]
                mb-6
                line-clamp-3
                leading-relaxed
                flex-grow
              "
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
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
                  {post.author.avatar && (
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
                    />
                  )}
                  <span className="
                    font-medium
                    text-[#e5e4dd]
                    group-hover:text-[#00ff88]
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
                group-hover:text-[#00ff88]
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
                  group-hover:text-[#00ff88]/80
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
    </article>
  );
}

// Memoize the component to prevent re-renders when props haven't changed
// This is crucial for performance when filtering - only new/removed posts will re-render
export const BlogCard = memo(BlogCardComponent);

export default BlogCard;
