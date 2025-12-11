# Filter & Animation Components Integration Guide

## Overview
This guide shows how to integrate the BlogFilterBar and BlogAnimations components into your blog page.

## Components Created

### 1. BlogFilterBar (`/home/claude-flow/packages/public-site/app/real-estate-agent-job/components/BlogFilterBar.tsx`)
- Client-side filter component with glassmorphism styling
- Search input with 300ms debouncing
- Multi-select category chips
- Real-time result count display
- Clear all filters functionality

### 2. BlogAnimations (`/home/claude-flow/packages/public-site/app/real-estate-agent-job/components/BlogAnimations.tsx`)
- Multiple animation components for different use cases
- GPU-accelerated transforms
- Intersection Observer for performance
- Staggered animations for blog cards

## Component APIs

### BlogFilterBar

**Props:**
```typescript
interface BlogFilterBarProps {
  categories: string[];           // Array of category names
  onFilterChange: (filters: FilterState) => void;  // Callback when filters change
  resultCount: number;            // Number of filtered results
}

interface FilterState {
  searchQuery: string;            // Current search query (debounced)
  selectedCategories: string[];   // Selected category names
}
```

**Usage Example:**
```tsx
import { BlogFilterBar, FilterState } from './components/BlogFilterBar';

export default function BlogPage() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategories: []
  });

  const categories = ['Technology', 'Marketing', 'Sales', 'Industry News'];

  const filteredPosts = posts.filter(post => {
    // Filter by search query
    const matchesSearch = !filters.searchQuery ||
      post.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(filters.searchQuery.toLowerCase());

    // Filter by categories
    const matchesCategory = filters.selectedCategories.length === 0 ||
      filters.selectedCategories.includes(post.category);

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <BlogFilterBar
        categories={categories}
        onFilterChange={setFilters}
        resultCount={filteredPosts.length}
      />
      {/* Render filtered posts */}
    </div>
  );
}
```

### BlogAnimations

**Available Components:**

1. **StaggerAnimation** - Individual animated wrapper
```typescript
interface StaggerAnimationProps {
  children: ReactNode;
  delay?: number;        // Delay in ms (default: 0)
  className?: string;
}
```

2. **BlogCardGrid** - Auto-staggers children
```typescript
interface BlogCardGridProps {
  children: ReactNode[];
  staggerDelay?: number;  // Delay between items in ms (default: 100)
}
```

3. **FadeInSection** - Directional fade-in
```typescript
interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';  // Default: 'up'
  duration?: number;     // Duration in ms (default: 700)
}
```

4. **ScaleOnHover** - Hover scale effect
```typescript
interface ScaleOnHoverProps {
  children: ReactNode;
  className?: string;
  scale?: number;        // Scale factor (default: 1.02)
}
```

5. **GlowOnHover** - Hover glow effect
```typescript
interface GlowOnHoverProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;    // Hex color (default: '#00ff88')
}
```

6. **Pulse** - Pulsing glow animation
```typescript
interface PulseProps {
  children: ReactNode;
  className?: string;
  color?: string;        // Hex color (default: '#00ff88')
  duration?: number;     // Duration in ms (default: 2000)
}
```

## Complete Integration Example

```tsx
'use client';

import { useState } from 'react';
import { BlogFilterBar, FilterState } from './components/BlogFilterBar';
import { BlogCardGrid, ScaleOnHover, GlowOnHover } from './components/BlogAnimations';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  image?: string;
}

export default function BlogPage() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategories: []
  });

  // Your blog posts data
  const posts: BlogPost[] = [
    // ... your posts
  ];

  // Extract unique categories
  const categories = Array.from(new Set(posts.map(p => p.category)));

  // Filter posts based on current filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !filters.searchQuery ||
      post.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesCategory = filters.selectedCategories.length === 0 ||
      filters.selectedCategories.includes(post.category);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Blog & Resources</h1>
          <p className="text-xl text-gray-400">
            Stay updated with the latest insights and trends
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <BlogFilterBar
            categories={categories}
            onFilterChange={setFilters}
            resultCount={filteredPosts.length}
          />
        </div>
      </section>

      {/* Blog Grid with Animations */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCardGrid staggerDelay={100}>
              {filteredPosts.map(post => (
                <ScaleOnHover key={post.id} scale={1.03}>
                  <GlowOnHover glowColor="#00ff88">
                    <article className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden h-full">
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-[#ffd700]/20 text-[#ffd700] text-xs font-semibold rounded-full">
                            {post.category}
                          </span>
                          <span className="text-sm text-gray-400">{post.date}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <p className="text-gray-400 mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{post.author}</span>
                          <button className="text-[#00ff88] hover:text-[#00ff88]/80 transition-colors">
                            Read More →
                          </button>
                        </div>
                      </div>
                    </article>
                  </GlowOnHover>
                </ScaleOnHover>
              ))}
            </BlogCardGrid>
          </div>

          {/* No Results Message */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">
                No articles found matching your criteria.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Try adjusting your filters or search query.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
```

## Styling Reference

### Color Palette
- **Neon Green (Primary)**: `#00ff88`
- **Gold (Active/Highlight)**: `#ffd700`
- **Background**: `bg-black` or `bg-black/40`
- **Text**: `text-white`, `text-gray-400`

### Glassmorphism Pattern
```tsx
className="backdrop-blur-lg bg-white/5 border border-white/10"
```

### Focus States
```tsx
className="focus:ring-2 focus:ring-[#00ff88] focus:border-transparent"
```

### Active Category Style
```tsx
className="bg-[#ffd700]/20 text-[#ffd700] border-2 border-[#ffd700] shadow-lg shadow-[#ffd700]/20"
```

## Performance Considerations

### 1. Search Debouncing
- The search input is debounced by 300ms to prevent excessive re-renders
- This significantly reduces filter operations during typing

### 2. Intersection Observer
- All animations use Intersection Observer API
- Components only animate when entering the viewport
- Observer disconnects after animation triggers (memory efficient)

### 3. GPU Acceleration
- All animations use CSS transforms (translate, scale)
- `willChange` property set only when needed
- Automatically removed after animation completes

### 4. Memoization Opportunities
```tsx
// Consider memoizing filter function for large datasets
const filteredPosts = useMemo(() => {
  return posts.filter(post => {
    // ... filter logic
  });
}, [posts, filters.searchQuery, filters.selectedCategories]);

// Memoize category extraction
const categories = useMemo(() => {
  return Array.from(new Set(posts.map(p => p.category)));
}, [posts]);
```

### 5. Virtual Scrolling (Optional)
For very large datasets (100+ posts), consider using `react-window` or `react-virtual`:
```tsx
import { FixedSizeGrid } from 'react-window';
// Implementation details...
```

## Accessibility Features

### BlogFilterBar
- Clear button has `aria-label="Clear search"`
- Keyboard navigation for category chips
- Focus indicators with neon green ring
- Screen reader friendly result count

### Animations
- Respects `prefers-reduced-motion` system setting (add to CSS):
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing Checklist

- [ ] Search filters posts by title and excerpt
- [ ] Category selection works (multi-select)
- [ ] "Clear All" button resets all filters
- [ ] Result count updates correctly
- [ ] Animations trigger on scroll
- [ ] No layout shift during animations
- [ ] Performance is smooth with 50+ posts
- [ ] Works on mobile devices
- [ ] Keyboard navigation functions properly
- [ ] Screen reader announces filter changes

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 12+)
- **Intersection Observer**: Polyfill needed for IE11 (not recommended)

## Future Enhancements

1. **Sorting Options**: Add sort by date, title, popularity
2. **URL State**: Sync filters with URL query parameters
3. **Saved Filters**: Store user preferences in localStorage
4. **Advanced Search**: Add tags, date ranges, author filters
5. **Infinite Scroll**: Load more posts as user scrolls
6. **Animation Presets**: Create predefined animation combinations
