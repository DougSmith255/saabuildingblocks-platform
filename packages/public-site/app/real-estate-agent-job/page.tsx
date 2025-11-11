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
 * Mock categories data
 * Will be replaced with actual category counts from WordPress
 */
const MOCK_CATEGORIES = [
  { slug: 'agent-career-info' as const, name: 'Agent Career Info', count: 15 },
  { slug: 'best-real-estate-brokerage' as const, name: 'Best Brokerage', count: 8 },
  { slug: 'brokerage-comparison' as const, name: 'Brokerage Comparison', count: 12 },
  { slug: 'industry-trends' as const, name: 'Industry Trends', count: 10 },
  { slug: 'marketing-mastery' as const, name: 'Marketing Mastery', count: 18 },
  { slug: 'winning-clients' as const, name: 'Winning Clients', count: 14 },
];

/**
 * Blog Page Component
 * Server Component - No 'use client' directive
 * Renders static content, delegates interactivity to client components
 */
export default function RealEstateAgentBlogPage() {
  // Separate featured post from regular posts
  const [featuredPost, ...regularPosts] = MOCK_POSTS;

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative px-4 sm:px-8 md:px-12 min-h-screen flex items-center"
        aria-labelledby="blog-heading"
      >
        <div className="max-w-[2500px] mx-auto text-center">
          {/* H1: Using Master Controller H1 component */}
          <div className="mb-6 hero-animate-h1">
            <H1 id="blog-heading">
              Agent Success Hub
            </H1>
          </div>

          {/* Tagline: Using Master Controller Tagline component */}
          <div className="mb-12 hero-animate-tagline">
            <Tagline>
              Expert Insights, Career Guidance, and Industry Trends
            </Tagline>
          </div>

          {/* Search Bar with Glassmorphism - Client Component */}
          <div className="hero-animate-cta">
            <SearchBarClient />
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      <section
        className="relative px-4 sm:px-8 md:px-12 pb-12"
        aria-labelledby="featured-heading"
      >
        <div className="max-w-[2500px] mx-auto">
          <h2
            id="featured-heading"
            className="
              text-h3 font-bold mb-6
              text-[#ffd700]
              font-[var(--font-taskor)]
              uppercase tracking-wider
            "
          >
            Featured Article
          </h2>

          <div className="featured-post-hover">
            <FeaturedBlogCard post={featuredPost} />
          </div>
        </div>
      </section>

      {/* Filter/Category Bar with Glassmorphism */}
      <section className="relative px-4 sm:px-8 md:px-12 pb-8">
        <div className="max-w-[2500px] mx-auto">
          <div className="
            p-6 rounded-lg
            glass-effect
            border border-[#808080]/30
          ">
            <h3 className="
              text-sm font-[var(--font-taskor)] text-[#dcdbd5]
              mb-4 uppercase tracking-wider
            ">
              Filter by Category:
            </h3>
            <CategoryChipsClient categories={MOCK_CATEGORIES} />
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
            Recent Articles
          </h2>

          {/* Responsive Grid: 3 cols desktop, 2 tablet, 1 mobile */}
          <div className="
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            gap-6 md:gap-8
          ">
            {regularPosts.map((post) => (
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

/**
 * Featured Blog Card Component
 * Large card format for featured post with enhanced styling
 */
function FeaturedBlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="
      border border-[#e5e4dd]/20 rounded-lg overflow-hidden
      hover:border-[#00ff88]/50
      transition-all duration-300
      hover:shadow-[0_0_30px_rgba(0,255,136,0.15)]
      bg-[#191818]/50
    ">
      <a
        href={`/blog/${post.slug}`}
        className="block group"
        aria-label={`Read featured article: ${post.title}`}
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full h-80 md:h-full overflow-hidden bg-[#191818]">
              <img
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                className="
                  w-full h-full object-cover
                  group-hover:scale-105
                  transition-transform duration-500
                  group-hover:brightness-110
                "
                loading="eager"
              />
              {/* Gradient overlay on hover */}
              <div className="
                absolute inset-0
                bg-gradient-to-r from-black/60 to-transparent
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
              " />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            {/* Category Badges */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.slice(0, 2).map((category) => (
                  <span
                    key={category}
                    className="
                      inline-block px-4 py-2
                      text-xs font-[var(--font-taskor)]
                      text-[#ffd700] bg-[#ffd700]/10
                      border border-[#ffd700]/30
                      rounded-full uppercase tracking-wider
                    "
                  >
                    {category.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Title (H2 - auto-applies display font) */}
            <h2 className="
              text-h2 md:text-h1 font-bold mb-4
              text-[#e5e4dd]
              group-hover:text-[#00ff88]
              transition-colors duration-300
              leading-tight
            ">
              {post.title}
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <div
                className="
                  font-[var(--font-amulya)] text-body md:text-lg
                  text-[#dcdbd5] mb-6
                  line-clamp-3 leading-relaxed
                "
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )}

            {/* Author and Date */}
            <div className="
              flex items-center gap-3
              font-[var(--font-amulya)] text-caption
              text-[#dcdbd5]/70
            ">
              {post.author.name && (
                <>
                  <span>By {post.author.name}</span>
                  <span className="text-[#dcdbd5]/40">•</span>
                </>
              )}
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}

/**
 * Search Bar Client Component
 * Glassmorphism search with real-time filtering
 * Separated for client-side interactivity
 */
function SearchBarClient() {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="
        relative
        glass-effect
        border border-[#808080]/30
        rounded-lg
        search-bar-focus
      ">
        <input
          type="search"
          placeholder="Search articles..."
          aria-label="Search blog posts"
          className="
            w-full px-6 py-4 pl-14
            bg-transparent
            text-[#e5e4dd] placeholder:text-[#dcdbd5]/60
            font-[var(--font-taskor)] text-lg
            focus:outline-none
            rounded-lg
          "
        />

        {/* Search Icon */}
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * Category Chips Client Component
 * Animated filter chips with multi-select
 */
function CategoryChipsClient({ categories }: { categories: typeof MOCK_CATEGORIES }) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* All Categories Chip */}
      <button
        className="
          px-4 py-2 rounded-full text-sm
          font-[var(--font-taskor)]
          filter-chip filter-chip-active
        "
        aria-label="Show all categories"
      >
        All
      </button>

      {/* Category Chips */}
      {categories.map((cat) => (
        <button
          key={cat.slug}
          className="
            px-4 py-2 rounded-full text-sm
            font-[var(--font-taskor)]
            bg-[#404040] text-[#dcdbd5]
            border border-[#808080]
            filter-chip
          "
          aria-label={`Filter by ${cat.name}, ${cat.count} posts`}
        >
          {cat.name}
          <span className="ml-1.5 text-xs opacity-70">{cat.count}</span>
        </button>
      ))}
    </div>
  );
}
