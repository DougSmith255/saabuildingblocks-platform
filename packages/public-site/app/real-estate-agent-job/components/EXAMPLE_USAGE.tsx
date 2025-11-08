// Example Usage - Complete Blog Page Implementation
// Copy this to your blog page file and customize as needed

'use client';

import { useState, useMemo } from 'react';
import { BlogFilterBar, FilterState } from './BlogFilterBar';
import { BlogCardGrid, ScaleOnHover, GlowOnHover } from './BlogAnimations';

// Sample blog post interface
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  image?: string;
  readTime?: string;
}

// Sample data (replace with your actual data source)
const SAMPLE_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'How AI is Transforming Real Estate Lead Generation',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way agents find and qualify leads.',
    category: 'Technology',
    date: 'Nov 5, 2025',
    author: 'Sarah Johnson',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: '10 Cold Calling Scripts That Actually Work',
    excerpt: 'Proven scripts that help you connect with potential clients and book more appointments.',
    category: 'Sales',
    date: 'Nov 3, 2025',
    author: 'Mike Chen',
    readTime: '8 min read'
  },
  {
    id: '3',
    title: 'Social Media Marketing for Real Estate Agents in 2025',
    excerpt: 'Master Instagram, Facebook, and TikTok to attract high-quality leads.',
    category: 'Marketing',
    date: 'Nov 1, 2025',
    author: 'Emily Rodriguez',
    readTime: '12 min read'
  },
  {
    id: '4',
    title: 'The Future of Real Estate: Industry Trends to Watch',
    excerpt: 'Stay ahead of the curve with these emerging trends shaping the real estate industry.',
    category: 'Industry News',
    date: 'Oct 28, 2025',
    author: 'David Park',
    readTime: '6 min read'
  }
];

export default function BlogPage() {
  // State management for filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategories: []
  });

  // Extract unique categories from posts
  const categories = useMemo(() => {
    return Array.from(new Set(SAMPLE_POSTS.map(post => post.category)));
  }, []);

  // Filter posts based on current filters (memoized for performance)
  const filteredPosts = useMemo(() => {
    return SAMPLE_POSTS.filter(post => {
      // Filter by search query (search in title and excerpt)
      const matchesSearch = !filters.searchQuery ||
        post.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(filters.searchQuery.toLowerCase());

      // Filter by selected categories
      const matchesCategory = filters.selectedCategories.length === 0 ||
        filters.selectedCategories.includes(post.category);

      return matchesSearch && matchesCategory;
    });
  }, [filters.searchQuery, filters.selectedCategories]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#00ff88] to-white bg-clip-text text-transparent">
            Blog & Resources
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Stay updated with the latest insights, strategies, and industry trends
            to supercharge your real estate career.
          </p>
        </div>
      </section>

      {/* Filter Bar Section */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <BlogFilterBar
            categories={categories}
            onFilterChange={setFilters}
            resultCount={filteredPosts.length}
          />
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <BlogCardGrid staggerDelay={100}>
                {filteredPosts.map(post => (
                  <ScaleOnHover key={post.id} scale={1.03}>
                    <GlowOnHover glowColor="#00ff88">
                      <article className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col hover:border-[#00ff88]/30 transition-all duration-300">
                        {/* Optional Image */}
                        {post.image && (
                          <div className="relative h-48 bg-gradient-to-br from-[#00ff88]/20 to-[#ffd700]/20">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Card Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          {/* Category & Date */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-[#ffd700]/20 text-[#ffd700] text-xs font-semibold rounded-full border border-[#ffd700]/30">
                              {post.category}
                            </span>
                            <span className="text-sm text-gray-400">{post.date}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-[#00ff88] transition-colors">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-gray-400 mb-4 flex-1 line-clamp-3">
                            {post.excerpt}
                          </p>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-[#00ff88] to-[#ffd700] rounded-full flex items-center justify-center text-black font-bold text-sm">
                                {post.author[0]}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{post.author}</p>
                                {post.readTime && (
                                  <p className="text-xs text-gray-500">{post.readTime}</p>
                                )}
                              </div>
                            </div>
                            <button className="text-[#00ff88] hover:text-[#00ff88]/80 transition-colors font-medium flex items-center gap-1">
                              Read
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </article>
                    </GlowOnHover>
                  </ScaleOnHover>
                ))}
              </BlogCardGrid>
            </div>
          ) : (
            // No Results State
            <div className="text-center py-24">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-300">No articles found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters or search query to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setFilters({ searchQuery: '', selectedCategories: [] });
                }}
                className="px-6 py-3 bg-[#00ff88] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#00ff88]/50 transition-all duration-300"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Optional: CTA Section */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#00ff88]/10 via-[#ffd700]/10 to-[#00ff88]/10 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Want More Exclusive Content?</h2>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for weekly insights, tips, and strategies
              delivered straight to your inbox.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:border-transparent"
              />
              <button className="px-6 py-3 bg-[#00ff88] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#00ff88]/50 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
