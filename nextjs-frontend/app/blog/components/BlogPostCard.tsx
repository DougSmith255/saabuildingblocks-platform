'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CyberCardHolographic } from '@/components/saa';
import type { BlogPost } from '@/lib/wordpress/types';
import { CTAButton } from '@/components/saa';

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
  return (
    <CyberCardHolographic
      className={featured ? 'col-span-full md:col-span-2' : ''}
    >
      <article className="flex flex-col h-full">
        {/* Featured Image - Optimized with Next.js Image */}
        {post.featuredImage && (
          <Link href={`/blog/${post.slug}`} className="block mb-4 overflow-hidden rounded-lg group">
            <div className={`relative ${featured ? 'h-80 md:h-96' : 'h-48 md:h-64'}`}>
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                quality={85}
              />
            </div>
          </Link>
        )}

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
        <Link href={`/blog/${post.slug}`} className="block group mb-3">
          <h2
            className={`
              font-bold text-[#e5e4dd] group-hover:text-[#00ff88] transition-colors
              ${featured ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}
            `}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <div
            className={`
              text-[#dcdbd5] mb-4 flex-grow
              ${featured ? 'text-base md:text-lg' : 'text-sm md:text-base'}
            `}
            dangerouslySetInnerHTML={{
              __html: featured ? post.excerpt : post.excerpt.substring(0, 200) + '...'
            }}
          />
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

        {/* CTA Button */}
        <CTAButton href={`/blog/${post.slug}`} className="mt-auto">
          READ MORE
        </CTAButton>
      </article>
    </CyberCardHolographic>
  );
}
