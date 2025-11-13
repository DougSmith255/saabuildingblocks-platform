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

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 xl:flex-1">
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
        </div>
      </div>
      </div>
    </section>
  );
}
