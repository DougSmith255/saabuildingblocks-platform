/**
 * Real Estate Agent Resources Blog Page
 * Main blog landing page with magazine-style layout
 *
 * Features:
 * - Hero section with H1 and Tagline from Master Controller
 * - Glassmorphism search bar
 * - Large featured post card
 * - Filter/category bar with animated chips
 * - Responsive grid layout (3 cols desktop, 2 tablet, 1 mobile)
 * - Card hover effects with neon green borders
 * - Gold category accents
 * - Staggered fade-in animations on scroll
 *
 * Design System:
 * - Background: #0a0a0a (inherits star background from layout)
 * - Heading: #e5e4dd (hover: #00ff88 neon green)
 * - Body text: #dcdbd5
 * - Accent: #ffd700 (gold for categories)
 * - Neon: #00ff88 (for interactive elements)
 */

import { H1, Tagline } from '@saa/shared/components/saa';
import { BlogCard } from '@/components/blog/BlogCard';
import type { BlogPost } from '@/lib/wordpress/types';
import type { Metadata } from 'next';

/**
 * Page Metadata for SEO
 */
export const metadata: Metadata = {
  title: 'Real Estate Agent Resources | Smart Agent Alliance',
  description: 'Expert insights, career guidance, and industry trends for real estate professionals. Learn about licensing, marketing strategies, brokerage comparisons, and more.',
  keywords: [
    'real estate agent resources',
    'real estate career advice',
    'real estate licensing',
    'real estate marketing',
    'eXp Realty',
    'brokerage comparison',
    'real estate agent blog',
    'real estate industry trends',
  ],
  openGraph: {
    title: 'Real Estate Agent Resources | Smart Agent Alliance',
    description: 'Expert insights, career guidance, and industry trends for real estate professionals.',
    type: 'website',
  },
};

/**
 * Mock blog posts data
 * Structure matches WordPress API format for easy replacement later
 * This will be replaced with actual WordPress data fetching
 */
const MOCK_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'comprehensive-guide-starting-real-estate-career',
    permalink: 'real-estate-agent-job/career/comprehensive-guide-starting-real-estate-career',
    title: 'The Comprehensive Guide to Starting Your Real Estate Career in 2025',
    excerpt: '<p>Breaking into real estate has never been more exciting. Learn everything you need to know about licensing, choosing the right brokerage, and setting yourself up for success in today\'s competitive market.</p>',
    content: '',
    date: '2025-01-15T10:00:00',
    modified: '2025-01-15T10:00:00',
    featuredImage: {
      url: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/real-estate-agent-success-guide.jpg',
      alt: 'Real estate agent celebrating success with keys',
      width: 1200,
      height: 800,
    },
    author: {
      name: 'Doug Houghton',
      avatar: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/doug-avatar.jpg',
    },
    categories: ['agent-career-info', 'become-a-real-estate-agent'],
  },
  {
    id: 2,
    slug: 'exp-realty-vs-traditional-brokerages',
    permalink: 'real-estate-agent-job/brokerage/exp-realty-vs-traditional-brokerages',
    title: 'eXp Realty vs Traditional Brokerages: What\'s the Real Difference?',
    excerpt: '<p>Compare the cloud-based model of eXp Realty with traditional brick-and-mortar brokerages. Discover which model fits your career goals and lifestyle best.</p>',
    content: '',
    date: '2025-01-12T14:30:00',
    modified: '2025-01-12T14:30:00',
    featuredImage: {
      url: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/brokerage-comparison.jpg',
      alt: 'eXp Realty office space comparison',
      width: 1200,
      height: 800,
    },
    author: {
      name: 'Karrie Houghton',
      avatar: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/karrie-avatar.jpg',
    },
    categories: ['brokerage-comparison', 'about-exp-realty'],
  },
  {
    id: 3,
    slug: 'top-10-marketing-strategies-2025',
    permalink: 'real-estate-agent-job/marketing/top-10-marketing-strategies-2025',
    title: 'Top 10 Marketing Strategies Every Agent Needs in 2025',
    excerpt: '<p>From social media mastery to AI-powered lead generation, discover the marketing tactics that are driving results for top-performing agents this year.</p>',
    content: '',
    date: '2025-01-10T09:00:00',
    modified: '2025-01-10T09:00:00',
    featuredImage: {
      url: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/marketing-strategies.jpg',
      alt: 'Digital marketing dashboard for real estate',
      width: 1200,
      height: 800,
    },
    author: {
      name: 'Doug Houghton',
      avatar: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/doug-avatar.jpg',
    },
    categories: ['marketing-mastery', 'winning-clients'],
  },
  {
    id: 4,
    slug: 'real-estate-license-requirements-by-state',
    permalink: 'real-estate-agent-job/licensing/real-estate-license-requirements-by-state',
    title: 'Real Estate License Requirements by State: 2025 Complete Guide',
    excerpt: '<p>Navigate the licensing process with our comprehensive state-by-state breakdown of requirements, timelines, and costs to become a licensed real estate agent.</p>',
    content: '',
    date: '2025-01-08T11:00:00',
    modified: '2025-01-08T11:00:00',
    featuredImage: {
      url: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/license-requirements.jpg',
      alt: 'Real estate license certificate',
      width: 1200,
      height: 800,
    },
    author: {
      name: 'Karrie Houghton',
      avatar: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/karrie-avatar.jpg',
    },
    categories: ['getting-your-license', 'become-a-real-estate-agent'],
  },
  {
    id: 5,
    slug: 'ai-tools-revolutionizing-real-estate',
    permalink: 'real-estate-agent-job/trends/ai-tools-revolutionizing-real-estate',
    title: 'AI Tools That Are Revolutionizing Real Estate in 2025',
    excerpt: '<p>Explore how artificial intelligence is transforming property valuation, client communication, and market analysis. Stay ahead of the curve with these cutting-edge tools.</p>',
    content: '',
    date: '2025-01-05T16:00:00',
    modified: '2025-01-05T16:00:00',
    featuredImage: {
      url: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/ai-real-estate.jpg',
      alt: 'AI technology in real estate visualization',
      width: 1200,
      height: 800,
    },
    author: {
      name: 'Doug Houghton',
      avatar: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/doug-avatar.jpg',
    },
    categories: ['industry-trends', 'agent-career-info'],
  },
  {
    id: 6,
    slug: 'first-year-agent-mistakes-to-avoid',
    permalink: 'real-estate-agent-job/career/first-year-agent-mistakes-to-avoid',
    title: '7 Common Mistakes First-Year Agents Make (And How to Avoid Them)',
    excerpt: '<p>Learn from the experiences of seasoned professionals. We break down the most common pitfalls new agents face and provide actionable solutions.</p>',
    content: '',
    date: '2025-01-03T13:00:00',
    modified: '2025-01-03T13:00:00',
    featuredImage: {
      url: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/new-agent-mistakes.jpg',
      alt: 'New real estate agent learning',
      width: 1200,
      height: 800,
    },
    author: {
      name: 'Karrie Houghton',
      avatar: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/karrie-avatar.jpg',
    },
    categories: ['agent-career-info', 'become-a-real-estate-agent'],
  },
  {
    id: 7,
    slug: 'best-real-estate-schools-online',
    permalink: 'real-estate-agent-job/education/best-real-estate-schools-online',
    title: 'Best Online Real Estate Schools: Reviews and Comparisons',
    excerpt: '<p>Find the perfect online real estate school for your needs. We\'ve tested and reviewed the top programs to help you make an informed decision.</p>',
    content: '',
    date: '2025-01-01T10:00:00',
    modified: '2025-01-01T10:00:00',
    featuredImage: {
      url: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/online-schools.jpg',
      alt: 'Online real estate education platform',
      width: 1200,
      height: 800,
    },
    author: {
      name: 'Doug Houghton',
      avatar: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/01/doug-avatar.jpg',
    },
    categories: ['best-real-estate-school', 'getting-your-license'],
  },
  {
    id: 8,
    slug: 'work-life-balance-real-estate-agent',
    permalink: 'real-estate-agent-job/lifestyle/work-life-balance-real-estate-agent',
    title: 'Achieving Work-Life Balance as a Real Estate Agent',
    excerpt: '<p>Discover practical strategies for maintaining healthy boundaries while building a thriving real estate business. Success doesn\'t have to mean burnout.</p>',
    content: '',
    date: '2024-12-28T15:00:00',
    modified: '2024-12-28T15:00:00',
    featuredImage: {
      url: 'https://wp.saabuildingblocks.com/wp-content/uploads/2024/12/work-life-balance.jpg',
      alt: 'Real estate agent enjoying free time',
      width: 1200,
      height: 800,
    },
    author: {
      name: 'Karrie Houghton',
      avatar: 'https://wp.saabuildingblocks.com/wp-content/uploads/2024/12/karrie-avatar.jpg',
    },
    categories: ['fun-for-agents', 'agent-career-info'],
  },
];

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
 * Blog Page Component
 * Server Component - No 'use client' directive
 * Renders static content, delegates interactivity to client components
 */
export default function RealEstateAgentBlogPage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative px-4 sm:px-8 md:px-12 min-h-screen flex items-center"
        aria-labelledby="blog-heading"
      >
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

      {/* Blog Posts Grid */}
      <section
        className="relative px-4 sm:px-8 md:px-12 pb-24"
        aria-labelledby="posts-heading"
      >
        <div className="max-w-[2500px] mx-auto">
          <h2 id="posts-heading" className="sr-only">
            Blog Articles
          </h2>

          {/* Responsive Grid: 3 cols desktop, 2 tablet, 1 mobile */}
          <div className="
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            gap-6 md:gap-8
          ">
            {MOCK_POSTS.map((post) => (
              <div
                key={post.id}
                className="blog-card-hover"
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}


