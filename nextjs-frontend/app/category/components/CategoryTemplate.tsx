/**
 * CategoryTemplate Component
 * Phase 7.4: Component Implementation
 *
 * Main orchestrator component that:
 * - Receives category config + initial WordPress posts
 * - Integrates with Master Controller stores (typography, colors, spacing)
 * - Composes CategoryHero + BlogGrid
 * - Implements React Query for client-side data fetching
 * - Props drilling pattern (no Context API)
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { useTypographyStore } from '@/app/master-controller/stores/typographyStore';
import { useBrandColorsStore } from '@/app/master-controller/stores/brandColorsStore';
import { useSpacingStore } from '@/app/master-controller/stores/spacingStore';
import { CategoryHero } from './CategoryHero';
import { BlogGrid } from './BlogGrid';
import { fetchPostsByCategory } from '../lib/wordpress-api';
import type { CategoryTemplateProps, WordPressPost } from '../types';

/**
 * CategoryTemplate - Main orchestrator component
 *
 * This component:
 * 1. Receives initial posts from SSG (Server Component)
 * 2. Fetches Master Controller settings from Zustand stores
 * 3. Sets up React Query for client-side data refresh
 * 4. Props-drills settings to child components (no Context)
 * 5. Composes CategoryHero + BlogGrid with shared settings
 *
 * @param config - Category configuration (slug, title, background, etc.)
 * @param initialPosts - Initial posts from generateStaticParams (SSG)
 * @param className - Optional CSS class
 */
export function CategoryTemplate({
  config,
  initialPosts,
  className = ''
}: CategoryTemplateProps) {
  // ============================================================================
  // MASTER CONTROLLER INTEGRATION
  // ============================================================================

  // Get typography settings from Master Controller
  const { settings: typography } = useTypographyStore();

  // Get brand colors from Master Controller
  const { settings: colors } = useBrandColorsStore();

  // Get spacing settings from Master Controller
  const { settings: spacing } = useSpacingStore();

  // ============================================================================
  // WORDPRESS API INTEGRATION (React Query)
  // ============================================================================

  /**
   * React Query hook for WordPress posts
   * - Uses initialPosts as initialData (from SSG)
   * - Refetches on client-side with 5-minute stale time
   * - Provides loading/error states
   */
  const {
    data: posts,
    isLoading,
    error
  } = useQuery<WordPressPost[]>({
    queryKey: ['posts', 'category', config.id],
    queryFn: () => fetchPostsByCategory(config.id, {
      per_page: 200,
      _embed: true
    }),
    initialData: initialPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`category-template ${className}`}>
      {/* Hero Section */}
      <CategoryHero
        config={config}
        typography={typography}
        colors={colors}
        spacing={spacing}
      />

      {/* Blog Grid Section */}
      <BlogGrid
        posts={posts || []}
        typography={typography}
        colors={colors}
        spacing={spacing}
        loading={isLoading}
        error={error as Error | null}
      />
    </div>
  );
}
