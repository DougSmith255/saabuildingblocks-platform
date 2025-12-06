'use client';

import { useState, useEffect, useRef } from 'react';
import { H2, GenericButton } from '@saa/shared/components/saa';
import { ChevronDown, Check } from 'lucide-react';

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
 * Update hash in URL using replaceState to avoid polluting browser history
 * This allows "Back" button to go directly to previous page instead of
 * stepping through each filter change
 */
function setHashParams(params: URLSearchParams) {
  const hashString = params.toString();

  // Save current scroll position
  const scrollY = window.scrollY;

  // Use replaceState to update hash without adding to history stack
  // This means clicking "Back" takes you to the previous actual page, not previous hash state
  if (hashString) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${hashString}`);
  } else {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // Manually dispatch hashchange event since replaceState doesn't trigger it
  window.dispatchEvent(new HashChangeEvent('hashchange'));

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const showAll = selectedCategories.length === 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

            {/* Mobile/Tablet: Custom Dropdown (show below 1340px) */}
            <div className="min-[1340px]:hidden xl:flex-1 relative" ref={dropdownRef}>
              {/* Dropdown Trigger Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  fontSize: 'clamp(12px, calc(12px + (30 - 12) * ((100vw - 250px) / (3000 - 250))), 30px)',
                }}
                className="w-full px-6 py-3 pr-12 rounded-lg bg-[#0a0a0a] border border-[#ffd700]/30 text-[#e5e4dd] text-left focus:border-[#ffd700]/50 focus:outline-none transition-all cursor-pointer relative hover:border-[#ffd700]/50 hover:shadow-[0_0_15px_rgba(255,215,0,0.15)]"
                aria-label="Filter by category"
                aria-expanded={isDropdownOpen}
              >
                <span className="block truncate">
                  {showAll
                    ? 'All Categories'
                    : categories.find(c => c.slug === selectedCategories[0])?.name || 'All Categories'}
                </span>
                <ChevronDown
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ffd700] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 rounded-lg bg-[#0a0a0a] border border-[#ffd700]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_20px_rgba(255,215,0,0.1)] overflow-hidden">
                  {/* All Categories Option */}
                  <button
                    type="button"
                    onClick={() => {
                      handleAllClick();
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-6 py-3 text-left flex items-center justify-between transition-all ${
                      showAll
                        ? 'bg-[#ffd700]/15 text-[#ffd700]'
                        : 'text-[#e5e4dd] hover:bg-[#ffd700]/10 hover:text-[#ffd700]'
                    }`}
                    style={{
                      fontSize: 'clamp(12px, calc(12px + (26 - 12) * ((100vw - 250px) / (3000 - 250))), 26px)',
                    }}
                  >
                    <span>All Categories</span>
                    {showAll && <Check className="w-5 h-5 text-[#ffd700]" />}
                  </button>

                  {/* Category Options */}
                  {categories.map((category) => {
                    const isSelected = selectedCategories.includes(category.slug);
                    return (
                      <button
                        key={category.slug}
                        type="button"
                        onClick={() => {
                          // For dropdown, replace current selection with single category
                          const params = getHashParams();
                          params.set('category', category.slug);
                          params.delete('page');
                          setHashParams(params);
                          setSelectedCategories([category.slug]);
                          onFilterChange([category.slug]);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-6 py-3 text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#ffd700]/15 text-[#ffd700]'
                            : 'text-[#e5e4dd] hover:bg-[#ffd700]/10 hover:text-[#ffd700]'
                        }`}
                        style={{
                          fontSize: 'clamp(12px, calc(12px + (26 - 12) * ((100vw - 250px) / (3000 - 250))), 26px)',
                        }}
                      >
                        <span>{category.name}</span>
                        {isSelected && <Check className="w-5 h-5 text-[#ffd700]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
