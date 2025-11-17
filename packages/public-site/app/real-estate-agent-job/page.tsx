/**
 * Real Estate Agent Resources Blog Page
 * Main blog landing page with magazine-style layout
 *
 * Features:
 * - Hero section with H1 and Tagline from Master Controller
 * - WordPress API integration - ALL posts fetched at build time for static export
 * - Pagination with secondary buttons (client-side)
 * - Filter/category bar with animated chips (multi-select, client-side)
 * - Responsive grid layout (3 cols desktop, 2 tablet, 1 mobile)
 * - Card hover effects with neon green borders
 * - Gold category accents
 * - Client-side filtering and pagination with scroll position preservation
 *
 * Design System:
 * - Background: #0a0a0a (inherits star background from layout)
 * - Heading: #e5e4dd (hover: #00ff88 neon green)
 * - Body text: #dcdbd5
 * - Accent: #ffd700 (gold for categories)
 * - Neon: #00ff88 (for interactive elements)
 */

import { H1, Tagline } from '@saa/shared/components/saa';
import { fetchBlogPosts } from '@/lib/wordpress/blog-api';
import type { BlogPost } from '@/lib/wordpress/types';
import BlogPageClient from './BlogPageClient';
import Image from 'next/image';

/**
 * WordPress categories data (from actual WordPress API)
 * Fetched from: https://wp.saabuildingblocks.com/wp-json/wp/v2/categories
 */
const WORDPRESS_CATEGORIES = [
  {
    slug: 'brokerage-comparison',
    name: 'Brokerage Comparison',
    count: 70,
    description: 'Compare different real estate brokerages and find the perfect fit for your career goals.',
    icon: '🏢',
  },
  {
    slug: 'about-exp-realty',
    name: 'About eXp Realty',
    count: 58,
    description: 'Learn about eXp Realty\'s cloud-based model, agent benefits, and unique commission structure.',
    icon: '☁️',
  },
  {
    slug: 'exp-realty-sponsor',
    name: 'eXp Realty Sponsor',
    count: 32,
    description: 'Discover how eXp\'s sponsorship program can accelerate your real estate career.',
    icon: '🤝',
  },
  {
    slug: 'marketing-mastery',
    name: 'Marketing Mastery',
    count: 28,
    description: 'Master digital marketing strategies to attract more clients and grow your business.',
    icon: '📱',
  },
  {
    slug: 'agent-career-info',
    name: 'Agent Career Info',
    count: 21,
    description: 'Essential guidance for building a successful and sustainable real estate career.',
    icon: '💼',
  },
  {
    slug: 'winning-clients',
    name: 'Winning Clients',
    count: 12,
    description: 'Proven strategies for attracting, converting, and retaining loyal real estate clients.',
    icon: '🎯',
  },
  {
    slug: 'real-estate-schools',
    name: 'Real Estate Schools',
    count: 12,
    description: 'Reviews and comparisons of top real estate education programs and licensing courses.',
    icon: '🎓',
  },
  {
    slug: 'become-an-agent',
    name: 'Become an Agent',
    count: 12,
    description: 'Everything you need to know to start your journey as a licensed real estate professional.',
    icon: '🚀',
  },
  {
    slug: 'industry-trends',
    name: 'Industry Trends',
    count: 8,
    description: 'Stay ahead with insights on market shifts, technology changes, and industry innovations.',
    icon: '📊',
  },
  {
    slug: 'fun-for-agents',
    name: 'Fun for Agents',
    count: 8,
    description: 'Work-life balance tips, agent lifestyle content, and fun industry stories.',
    icon: '🎉',
  },
];

/**
 * Blog Page Component (Server Component)
 * Hero section renders immediately
 * Blog posts are loaded asynchronously from static JSON file for instant page load
 */
export default async function RealEstateAgentBlogPage() {
  // Note: We don't fetch posts here anymore - they're loaded client-side from /blog-posts.json
  // This keeps the HTML tiny and allows hero section to load instantly

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section - Renders first, immediately visible */}
      <section
        className="relative px-4 sm:px-8 md:px-12 flex items-center justify-center"
        style={{ minHeight: '100vh', paddingTop: '50px' }}
        aria-labelledby="blog-heading"
      >
        {/* Agent Success Hub Background Image - furthest back layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]">
          <div className="relative w-full min-w-[300px] max-w-[2000px] h-full">
            <div
              className="absolute inset-0 hero-animate-bg agent-hero-bg animate-in"
              style={{
                maskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
              }}
            >
              <Image
                src="https://wp.saabuildingblocks.com/wp-content/uploads/2025/11/Agent-Success-Hub.webp"
                alt="Agent Success Hub - Real estate professionals collaborating"
                fill
                priority
                quality={90}
                sizes="(max-width: 768px) 80vw, 100vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center 55%',
                }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-[2500px] mx-auto w-full text-center">
          {/* H1: Using Master Controller H1 component */}
          <div className="mb-6">
            <H1 id="blog-heading">
              Agent Success Hub
            </H1>
          </div>

          {/* Tagline: Using Master Controller Tagline component */}
          <div className="mb-12">
            <Tagline>
              Expert Insights, Career Guidance, and Industry Trends
            </Tagline>
          </div>
        </div>
      </section>

      {/* Blog content loads progressively with client component */}
      <BlogPageClient categories={WORDPRESS_CATEGORIES} />
    </main>
  );
}


