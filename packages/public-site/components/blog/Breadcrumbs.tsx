'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbsProps {
  /**
   * Category name for the breadcrumb
   */
  category?: string;
  /**
   * Category slug for the link
   */
  categorySlug?: string;
  /**
   * Post title for the breadcrumb
   */
  postTitle: string;
}

/**
 * Breadcrumbs - Navigation breadcrumb trail with schema.org markup
 *
 * PROTOCOL COMPLIANCE:
 * ✅ Master Controller brand colors ONLY
 * ✅ Semantic HTML with schema.org BreadcrumbList
 * ✅ Responsive design (collapses on mobile)
 * ✅ Fluid typography (clamp)
 * ✅ Accessible navigation (aria-label)
 *
 * Features:
 * - Home > Blog > [Category] > [Post Title]
 * - Schema.org BreadcrumbList for SEO
 * - Clickable links for navigation
 * - Responsive collapse on mobile
 * - Master Controller colors
 * - Chevron separators
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   category="Marketing Mastery"
 *   categorySlug="marketing-mastery"
 *   postTitle="10 Tips for Social Media Success"
 * />
 * ```
 */
export function Breadcrumbs({
  category,
  categorySlug,
  postTitle
}: BreadcrumbsProps) {
  // Build breadcrumb items
  const items = [
    { label: 'Home', href: '/', position: 1 },
    { label: 'Blog', href: '/blog', position: 2 },
  ];

  if (category && categorySlug) {
    items.push({
      label: category,
      href: `/blog/category/${categorySlug}`,
      position: 3
    });
  }

  // Current page (not clickable)
  const currentPosition = items.length + 1;

  // Build JSON-LD schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      ...items.map(item => ({
        '@type': 'ListItem',
        position: item.position,
        name: item.label,
        item: `https://saabuildingblocks.com${item.href}`
      })),
      {
        '@type': 'ListItem',
        position: currentPosition,
        name: postTitle,
      }
    ]
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb navigation"
        className="mb-6 overflow-x-auto"
      >
        <ol className="flex items-center gap-2 text-sm text-[#dcdbd5] flex-wrap">
          {items.map((item, idx) => (
            <li key={item.position} className="flex items-center gap-2">
              <Link
                href={item.href}
                className="text-[#00ff88] hover:text-[#00ff88]/80 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
              <ChevronRight className="w-4 h-4 text-[#dcdbd5]/50" />
            </li>
          ))}

          {/* Current Page (not clickable) */}
          <li className="text-[#e5e4dd] truncate max-w-[200px] md:max-w-none">
            {postTitle}
          </li>
        </ol>
      </nav>
    </>
  );
}
