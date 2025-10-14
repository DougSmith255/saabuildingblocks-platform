/**
 * Blog Page Component Types
 * Type definitions for blog listing and post pages
 */

// Note: Import BlogPost from '@/lib/wordpress' in actual page components
// This file uses relative import for standalone compilation
import type { BlogPost } from '../../lib/wordpress/types';

/**
 * Props for blog listing page
 * Static page with no props
 */
export interface BlogListingProps {
  // No props for static page
}

/**
 * Props for individual blog post page
 * Includes dynamic route params
 */
export interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

/**
 * Params for generateStaticParams
 * Used to pre-render all blog posts at build time
 */
export interface BlogPostParams {
  slug: string;
}

/**
 * Category filter state (for future client-side filtering)
 */
export interface CategoryFilterState {
  selectedCategory: string | null;
  filteredPosts: BlogPost[];
}

/**
 * Blog post metadata for SEO
 */
export interface BlogMetadata {
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
}
