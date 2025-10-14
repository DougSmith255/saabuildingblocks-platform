'use client';

import { Suspense } from 'react';
import type { BlogPost } from '@/lib/wordpress/types';
import type { CategoryInfo } from '../types/filters';
import { FilterBar } from './FilterBar';
import { FilterablePostList } from './FilterablePostList';

interface BlogContentProps {
  posts: BlogPost[];
  categories: CategoryInfo[];
}

/**
 * Client-side wrapper for blog filtering components
 * Required Suspense boundary for useSearchParams in Next.js 15
 */
export function BlogContent({ posts, categories }: BlogContentProps) {
  return (
    <Suspense fallback={
      <div className="animate-pulse">
        <div className="h-16 bg-[#404040]/30 rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-[#404040]/30 rounded-lg" />
          ))}
        </div>
      </div>
    }>
      {/* Filter Bar - Phase 11.2 */}
      <FilterBar categories={categories} />

      {/* Filterable Post List - Phase 11.2 */}
      <FilterablePostList posts={posts} />
    </Suspense>
  );
}
