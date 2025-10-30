/**
 * BlogCard Component
 *
 * Displays a blog post card with:
 * - Featured image with hover effect
 * - Title (H2 - auto-applies display font)
 * - Excerpt with line clamp
 * - Author and date metadata
 * - Category badges
 * - Click area linking to full post
 *
 * Follows AI Agent Page Building Protocol:
 * - Typography: H2 auto-applies display font, body uses Amulya
 * - Colors: Brand palette only (#e5e4dd, #dcdbd5, #00ff88)
 * - Responsive: Fluid typography with clamp()
 * - Accessibility: Semantic HTML, proper ARIA labels
 */

import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/wordpress/types';

export interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className = '' }: BlogCardProps) {
  return (
    <article
      className={`
        border border-[#e5e4dd]/20
        rounded-lg
        overflow-hidden
        hover:border-[#00ff88]/50
        transition-all duration-300
        hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]
        ${className}
      `.trim()}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block group"
        aria-label={`Read full article: ${post.title}`}
      >
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative w-full h-64 overflow-hidden bg-[#191818]">
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
          </div>
        )}

        <div className="p-6">
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

          {/* Title (H2 - auto-applies display font) */}
          <h2
            className="
              text-h2
              font-bold
              mb-3
              text-[#e5e4dd]
              group-hover:text-[#00ff88]
              transition-colors duration-300
              leading-tight
            "
          >
            {post.title}
          </h2>

          {/* Excerpt with line clamp */}
          {post.excerpt && (
            <div
              className="
                font-[var(--font-amulya)]
                text-body
                text-[#dcdbd5]
                mb-4
                line-clamp-3
                leading-relaxed
              "
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
          )}

          {/* Author and Date Metadata */}
          <div className="
            flex
            flex-wrap
            items-center
            gap-3
            font-[var(--font-amulya)]
            text-caption
            text-[#dcdbd5]/70
          ">
            {/* Author */}
            {post.author.name && (
              <>
                <span className="flex items-center gap-2">
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span>By {post.author.name}</span>
                </span>
                <span className="text-[#dcdbd5]/40">•</span>
              </>
            )}

            {/* Date */}
            <time
              dateTime={post.date}
              className="group-hover:text-[#dcdbd5] transition-colors"
            >
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>

            {/* Read time estimate (optional) */}
            {post.content && (
              <>
                <span className="text-[#dcdbd5]/40">•</span>
                <span>
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

export default BlogCard;
