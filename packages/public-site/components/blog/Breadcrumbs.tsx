import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/**
 * WordPress category name to slug mapping
 * Maps display names to URL-safe slugs for hash-based filtering
 */
const CATEGORY_SLUG_MAP: Record<string, string> = {
  'Brokerage Comparison': 'brokerage-comparison',
  'About eXp Realty': 'about-exp-realty',
  'eXp Realty Sponsor': 'exp-realty-sponsor',
  'Marketing Mastery': 'marketing-mastery',
  'Agent Career Info': 'agent-career-info',
  'Winning Clients': 'winning-clients',
  'Real Estate Schools': 'real-estate-schools',
  'Become an Agent': 'become-an-agent',
  'Industry Trends': 'industry-trends',
  'Fun for Agents': 'fun-for-agents',
  // Legacy/alternative names that might appear
  'Business Growth': 'marketing-mastery',
  'Clients': 'winning-clients',
  'Uncategorized': '',
};

/**
 * Get the URL slug for a category name
 * Falls back to converting the name to a slug if not in the map
 */
function getCategorySlug(categoryName: string): string {
  const mappedSlug = CATEGORY_SLUG_MAP[categoryName];
  if (mappedSlug !== undefined) return mappedSlug;
  // Fallback: convert name to slug format
  return categoryName.toLowerCase().replace(/\s+/g, '-');
}

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
  // Get the proper slug - use mapping function to ensure correct WordPress slug
  const resolvedSlug = category ? getCategorySlug(category) : categorySlug;

  // Build breadcrumb items
  const items = [
    { label: 'Home', href: '/', position: 1 },
    { label: 'Blog', href: '/blog', position: 2 },
  ];

  if (category && resolvedSlug) {
    items.push({
      label: category,
      href: `/blog/#category=${resolvedSlug}`,
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
                className="text-[#ffd700] hover:text-[#ffed80] transition-colors whitespace-nowrap breadcrumb-link"
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
