'use client';

import { useState, useEffect } from 'react';
import { H2, GenericButton } from '@saa/shared/components/saa';

/**
 * WordPress categories data type
 */
type CategoryData = {
  slug: string;
  name: string;
  count: number;
  description: string;
  icon: string;
};

/**
 * Parse hash parameters from URL
 */
function getHashParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams();
  const hash = window.location.hash.slice(1); // Remove '#'
  return new URLSearchParams(hash);
}

/**
 * Update hash in URL without triggering page reload or scroll
 */
function setHashParams(params: URLSearchParams) {
  const hashString = params.toString();

  // Save current scroll position
  const scrollY = window.scrollY;

  // Update hash (this may cause scroll)
  if (hashString) {
    window.location.hash = `#${hashString}`;
  } else {
    // Use replaceState to clear hash without scrolling
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // Restore scroll position
  window.scrollTo(0, scrollY);
}

/**
 * Filter Section Component
 * Full-width holographic card with brand-styled filter buttons
 * Supports multi-select filtering
 * Uses URL hash for static export compatibility
 */
export default function FilterSection({
  categories,
  onFilterChange
}: {
  categories: CategoryData[];
  onFilterChange: (categories: string[]) => void;
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const showAll = selectedCategories.length === 0;

  // Read hash params on mount and when hash changes
  useEffect(() => {
    const updateFromHash = () => {
      const params = getHashParams();
      const categoryParam = params.get('category');
      const categories = categoryParam ? categoryParam.split(',').filter(Boolean) : [];
      setSelectedCategories(categories);
      onFilterChange(categories);
    };

    updateFromHash();
    window.addEventListener('hashchange', updateFromHash);
    return () => window.removeEventListener('hashchange', updateFromHash);
  }, [onFilterChange]);

  const handleAllClick = () => {
    // When "All" is clicked, clear all category filters
    const params = getHashParams();
    params.delete('category');
    params.delete('page'); // Reset to page 1
    setHashParams(params);

    // Force immediate state update (don't wait for hashchange)
    setSelectedCategories([]);
    onFilterChange([]);
  };

  const handleCategoryClick = (slug: string) => {
    const params = getHashParams();
    let newCategories: string[];

    if (selectedCategories.includes(slug)) {
      // Remove category (toggle off)
      newCategories = selectedCategories.filter(cat => cat !== slug);

      // If this was the last selected category, automatically activate "All"
      // (Don't allow zero filters - automatically show all posts)
      if (newCategories.length === 0) {
        params.delete('category');
        params.delete('page');
        setHashParams(params);

        // Force immediate state update
        setSelectedCategories([]);
        onFilterChange([]);
        return;
      }
    } else {
      // Add category (toggle on)
      newCategories = [...selectedCategories, slug];
    }

    // Update URL with multi-select categories
    if (newCategories.length > 0) {
      params.set('category', newCategories.join(','));
    } else {
      params.delete('category');
    }
    params.delete('page'); // Reset to page 1 when filtering changes

    setHashParams(params);

    // Force immediate state update
    setSelectedCategories(newCategories);
    onFilterChange(newCategories);
  };

  return (
    <section className="relative py-16">
      <div className="px-4 sm:px-8 md:px-12">
        <div className="max-w-[2500px] mx-auto">
          <div className="flex flex-col xl:flex-row xl:items-start gap-6 xl:gap-12">
            {/* Filter Label - add left margin to account for metal plate effect */}
            <div className="ml-4">
              <H2>Filter:</H2>
            </div>

            {/* Desktop: Filter Buttons (show above 1340px) */}
            <div className="hidden min-[1340px]:flex flex-wrap gap-3 xl:flex-1">
              {/* All Button */}
              <GenericButton
                onClick={handleAllClick}
                selected={showAll}
                aria-label="Show all posts"
              >
                All
              </GenericButton>

              {/* Category Buttons */}
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.slug);

                return (
                  <GenericButton
                    key={category.slug}
                    onClick={() => handleCategoryClick(category.slug)}
                    selected={isSelected}
                    aria-label={`${isSelected ? 'Remove' : 'Add'} ${category.name} filter`}
                  >
                    {category.name}
                  </GenericButton>
                );
              })}
            </div>

            {/* Mobile/Tablet: Dropdown (show below 1340px) */}
            <div className="min-[1340px]:hidden xl:flex-1">
              <select
                id="category-filter-dropdown"
                value={selectedCategories.length > 0 ? selectedCategories[0] : 'all'}
                onChange={(e) => {
                  if (e.target.value === 'all') {
                    handleAllClick();
                  } else {
                    // For dropdown, replace current selection with single category
                    const params = getHashParams();
                    params.set('category', e.target.value);
                    params.delete('page');
                    setHashParams(params);
                    setSelectedCategories([e.target.value]);
                    onFilterChange([e.target.value]);
                  }
                }}
                style={{
                  fontSize: 'clamp(12px, calc(12px + (30 - 12) * ((100vw - 250px) / (3000 - 250))), 30px)',
                  backgroundPosition: 'right 15px center',
                }}
                className="w-full px-6 py-3 pr-12 rounded-lg bg-[#1a1a1a] border border-[#e5e4dd]/20 text-[#e5e4dd] font-[var(--font-amulya)] focus:border-[#00ff88]/50 focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3e%3cpath%20fill%3D%22%23e5e4dd%22%20d%3D%22M6%208L0%200h12z%22%2F%3e%3c%2Fsvg%3e')] bg-no-repeat"
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              <style jsx>{`
                #category-filter-dropdown option {
                  padding: 12px 16px;
                  background-color: #1a1a1a;
                  color: #e5e4dd;
                  position: relative;
                  transition: all 0.3s ease;
                }

                #category-filter-dropdown option:hover,
                #category-filter-dropdown option:focus {
                  background: linear-gradient(
                    to right,
                    rgba(0, 255, 136, 0.2) 0%,
                    rgba(0, 255, 136, 0.1) 100%
                  );
                  color: #00ff88;
                }

                #category-filter-dropdown option:checked {
                  background-color: rgba(0, 255, 136, 0.15);
                  color: #00ff88;
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
