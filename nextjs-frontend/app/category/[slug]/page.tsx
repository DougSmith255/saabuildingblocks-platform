/**
 * Category Dynamic Route
 * Phase 7.4: Component Implementation
 *
 * Dynamic route: /category/[slug]
 * - Uses Next.js 15 generateStaticParams for SSG
 * - Fetches WordPress posts at build time
 * - Passes data to CategoryTemplate (Client Component)
 * - Implements ISR with 5-minute revalidation
 */

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CategoryTemplate } from '../components/CategoryTemplate';
import { fetchPostsByCategory } from '../lib/wordpress-api';
import {
  getCategoryConfig,
  getAllCategorySlugs,
  isValidCategorySlug
} from '../configs/category-configs';
import type { WordPressPost } from '../types';

/**
 * Route Parameters Type
 */
interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Dynamic Route Segment Config
 * Force dynamic rendering - no static generation at build time
 * This is required because WordPress API needs authentication
 */
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

/**
 * Generate Metadata (SEO)
 * Dynamic metadata for each category page
 */
export async function generateMetadata({
  params
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getCategoryConfig(slug);

  if (!config) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }

  return {
    title: `${config.title} | SAA Building Blocks`,
    description: config.seo?.description || config.tagline,
    keywords: config.seo?.keywords || [],
    openGraph: {
      title: config.title,
      description: config.seo?.description || config.tagline,
      type: 'website',
      images: config.seo?.ogImage ? [{ url: config.seo.ogImage }] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.seo?.description || config.tagline
    }
  };
}

/**
 * Category Page Component (Server Component)
 *
 * Flow:
 * 1. Validate slug exists in config
 * 2. Fetch WordPress posts by category ID
 * 3. Pass config + posts to CategoryTemplate (Client Component)
 * 4. CategoryTemplate handles Master Controller integration + rendering
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // ============================================================================
  // VALIDATION
  // ============================================================================

  // Check if slug exists in configuration
  if (!isValidCategorySlug(slug)) {
    notFound();
  }

  // Get category configuration
  const config = getCategoryConfig(slug);

  // Double-check config exists (TypeScript safety)
  if (!config) {
    notFound();
  }

  // ============================================================================
  // DATA FETCHING (SSG)
  // ============================================================================

  let initialPosts: WordPressPost[] = [];
  let fetchError: Error | null = null;

  try {
    // Fetch posts from WordPress API
    initialPosts = await fetchPostsByCategory(config.id, {
      per_page: 200,
      _embed: true,
      order: 'desc',
      orderby: 'date'
    });
  } catch (error) {
    // Log error but don't crash the page
    console.error(`[CategoryPage] Error fetching posts for ${slug}:`, error);
    fetchError = error instanceof Error ? error : new Error('Unknown error');

    // Return empty array - BlogGrid will show error state
    initialPosts = [];
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <main className="min-h-screen">
      <CategoryTemplate
        config={config}
        initialPosts={initialPosts}
      />
    </main>
  );
}

// Dynamic rendering - no revalidation needed
