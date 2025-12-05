'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/wordpress/types';
import { CTAButton } from '@saa/shared/components/saa';
import { cleanExcerpt } from '@/lib/wordpress/fallbacks';

/**
 * Convert category name to URL slug
 */
function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

/**
 * BlogPostCard - SAA-enhanced blog post card component
 *
 * Features:
 * - CyberCardHolographic for card wrapper
 * - CTAButton for "Read More" action
 * - Featured image with hover effects
 * - Category badges with SAA styling
 * - Author and date metadata
 *
 * @example
 * ```tsx
 * <BlogPostCard post={post} />
 * <BlogPostCard post={post} featured />
 * ```
 */
export function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  // Get the primary category and convert to slug for URL
  const primaryCategory = post.categories[0] || 'uncategorized';
  const categorySlug = categoryToSlug(primaryCategory);
  const postUrl = `/blog/${categorySlug}/${post.slug}`;

  return (
    <div
      className={`${featured ? 'col-span-full md:col-span-2' : ''} h-full rounded-2xl overflow-hidden border border-[#ffd700]/20`}
      style={{
        background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
      }}
    >
      <article className="flex flex-col h-full p-5">
        {/* Featured Image - Always display with fallback, optimized with Next.js Image */}
        <Link href={postUrl} className="block mb-4 overflow-hidden rounded-lg group">
          <div className={`relative bg-gradient-to-br from-[#2a2a2a] to-[#191818] ${featured ? 'h-80 md:h-96' : 'h-48 md:h-64'}`}>
            {post.featuredImage ? (
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                quality={85}
              />
            ) : (
              /* Fallback placeholder when no featured image */
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-[#808080]"
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
        </Link>

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((category, idx) => (
              <span
                key={idx}
                className="
                  px-3 py-1 text-xs uppercase tracking-wider
                  bg-[#ffd700]/10 text-[#ffd700]
                  border border-[#ffd700]/30
                  rounded-md
                  hover:bg-[#ffd700]/20 transition-colors
                "
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={postUrl} className="block group mb-3">
          <h3
            className={`
              font-bold text-[#e5e4dd] group-hover:text-[#ffd700] transition-colors
              ${featured ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}
            `}
          >
            {post.title}
          </h3>
        </Link>

        {/* Description - prefer Rank Math meta description, fallback to cleaned excerpt */}
        {(post.metaDescription || post.excerpt) && (
          <p
            className={`
              text-[#dcdbd5] mb-4
              ${featured ? 'text-base md:text-lg' : 'text-sm md:text-base'}
            `}
          >
            {post.metaDescription || cleanExcerpt(post.excerpt, featured ? 300 : 160)}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center gap-3 text-sm text-[#dcdbd5]/70 mb-4 pb-4 border-b border-[#e5e4dd]/10">
          {post.author.name && <span>By {post.author.name}</span>}
          <span>•</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow" />

        {/* CTA Button - always aligned to bottom */}
        <CTAButton href={postUrl} className="mt-4">
          READ MORE
        </CTAButton>
      </article>
    </div>
  );
}
