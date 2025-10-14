/**
 * CategoryChips Component
 * Multi-select category filter chips with brand styling
 * Phase 11.2 - Filtering & Sorting Implementation
 */

'use client';

import type { CategorySlug, CategoryInfo } from '../types/filters';

interface CategoryChipsProps {
  categories: CategoryInfo[];
  selected: CategorySlug[];
  onChange: (slug: CategorySlug) => void;
}

export function CategoryChips({ categories, selected, onChange }: CategoryChipsProps) {
  const isAllSelected = selected.length === 0;

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="flex flex-wrap gap-2"
    >
      {/* "All Categories" chip */}
      <button
        role="checkbox"
        aria-checked={isAllSelected}
        aria-label="Show all categories"
        onClick={() => {
          // Clear all selections
          selected.forEach(slug => onChange(slug));
        }}
        className={`
          px-4 py-2 rounded-full text-sm font-[var(--font-taskor)]
          transition-all duration-200
          ${isAllSelected
            ? 'bg-[#404040] text-[#00ff88] border border-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)]'
            : 'bg-[#404040] text-[#dcdbd5] border border-[#808080] hover:border-[#00ff88]'
          }
        `}
      >
        All
      </button>

      {/* Individual category chips */}
      {categories.map(cat => {
        const isSelected = selected.includes(cat.slug);

        return (
          <button
            key={cat.slug}
            role="checkbox"
            aria-checked={isSelected}
            aria-label={`Filter by ${cat.name}, ${cat.count} posts`}
            onClick={() => onChange(cat.slug)}
            className={`
              px-4 py-2 rounded-full text-sm font-[var(--font-taskor)]
              transition-all duration-200
              ${isSelected
                ? 'bg-[#404040] text-[#ffd700] border border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                : 'bg-[#404040] text-[#dcdbd5] border border-[#808080] hover:border-[#ffd700]'
              }
            `}
          >
            {cat.name}
            {cat.count > 0 && (
              <span className="ml-1.5 text-xs opacity-70">
                {cat.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
