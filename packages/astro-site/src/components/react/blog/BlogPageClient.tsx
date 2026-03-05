'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { BlogCard } from './BlogCard';

interface CategoryData {
  slug: string;
  name: string;
  count: number;
  description: string;
  icon: string;
}

interface BlogPost {
  id: number;
  slug: string;
  customUri?: string;
  title: string;
  excerpt: string;
  date: string;
  categories: string[];
  featuredImage?: { url: string; alt: string };
}

interface BlogIndex {
  posts: Array<{ id: number; categories: string[]; chunk: number }>;
  categoryMap: Record<string, number[]>;
  totalPosts: number;
  totalChunks: number;
  postsPerChunk: number;
}

const STANDALONE_CATEGORIES = ['about-exp-realty', 'exp-realty-sponsor'];
const KNOWN_CATEGORY_SLUGS = [
  'about-exp-realty', 'exp-realty-sponsor', 'brokerage-comparison',
  'marketing-mastery', 'agent-career-info', 'winning-clients',
  'real-estate-schools', 'become-an-agent', 'industry-trends', 'fun-for-agents',
];

function categoryNameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function getPostUrl(post: BlogPost): string {
  const categorySlug = categoryNameToSlug(post.categories[0] || 'uncategorized');
  let uri = post.customUri || `${categorySlug}/${post.slug}`;
  const firstSegment = uri.split('/')[0];
  if (!KNOWN_CATEGORY_SLUGS.includes(firstSegment)) {
    const slug = uri.split('/').pop() || post.slug;
    uri = `${categorySlug}/${slug}`;
  }
  if (STANDALONE_CATEGORIES.includes(uri.split('/')[0])) {
    return `/${uri}/`;
  }
  return `/blog/${uri}/`;
}

const POSTS_PER_PAGE = 9;

interface BlogPageClientProps {
  categories: CategoryData[];
}

export default function BlogPageClient({ categories }: BlogPageClientProps) {
  const [index, setIndex] = useState<BlogIndex | null>(null);
  const [loadedChunks, setLoadedChunks] = useState<Map<number, BlogPost[]>>(new Map());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load index on mount
  useEffect(() => {
    fetch('/blog-posts-index.json')
      .then(r => r.json())
      .then((data: BlogIndex) => {
        setIndex(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Load needed chunks
  const neededChunks = useMemo(() => {
    if (!index) return [];
    const selectedSlugs = Array.from(selectedCategories);
    if (selectedSlugs.length === 0) {
      // All chunks needed for current page range
      const startChunk = Math.floor((currentPage - 1) * POSTS_PER_PAGE / index.postsPerChunk) + 1;
      const endChunk = Math.min(startChunk + 2, index.totalChunks);
      return Array.from({ length: endChunk - startChunk + 1 }, (_, i) => startChunk + i);
    }
    // Only chunks containing selected categories
    const chunks = new Set<number>();
    selectedSlugs.forEach(slug => {
      (index.categoryMap[slug] || []).forEach(c => chunks.add(c));
    });
    return Array.from(chunks).sort((a, b) => a - b);
  }, [index, selectedCategories, currentPage]);

  useEffect(() => {
    const toLoad = neededChunks.filter(c => !loadedChunks.has(c));
    if (toLoad.length === 0) return;

    Promise.all(
      toLoad.map(c =>
        fetch(`/blog-posts-chunk-${c}.json`)
          .then(r => r.json())
          .then(posts => ({ chunk: c, posts: posts as BlogPost[] }))
          .catch(() => ({ chunk: c, posts: [] as BlogPost[] }))
      )
    ).then(results => {
      setLoadedChunks(prev => {
        const next = new Map(prev);
        results.forEach(({ chunk, posts }) => next.set(chunk, posts));
        return next;
      });
    });
  }, [neededChunks]);

  // Filter and paginate
  const allLoadedPosts = useMemo(() => {
    if (!index) return [];
    const posts: BlogPost[] = [];
    const sorted = [...loadedChunks.entries()].sort(([a], [b]) => a - b);
    sorted.forEach(([, chunkPosts]) => posts.push(...chunkPosts));
    return posts;
  }, [loadedChunks, index]);

  const filteredPosts = useMemo(() => {
    if (selectedCategories.size === 0) return allLoadedPosts;
    return allLoadedPosts.filter(post =>
      post.categories.some(cat => selectedCategories.has(categoryNameToSlug(cat)))
    );
  }, [allLoadedPosts, selectedCategories]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const toggleCategory = useCallback((slug: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    setCurrentPage(1);
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-body">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 md:px-12 pb-16">
      <div className="max-w-[1900px] mx-auto">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => toggleCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategories.has(cat.slug)
                  ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/50'
                  : 'bg-white/5 text-[#dcdbd5] border border-white/10 hover:bg-white/10'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map(post => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              category={post.categories[0] || 'Uncategorized'}
              date={post.date}
              featuredImage={post.featuredImage}
              href={getPostUrl(post)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/5 text-[#dcdbd5] rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-body">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/5 text-[#dcdbd5] rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
