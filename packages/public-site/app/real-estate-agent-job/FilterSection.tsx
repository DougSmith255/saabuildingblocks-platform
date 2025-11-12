'use client';

import { useState } from 'react';
import { H2, CyberCardHolographic } from '@saa/shared/components/saa';

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
 * Filter Section Component
 * Full-width holographic card with brand-styled filter buttons
 */
export default function FilterSection({
  categories
}: {
  categories: CategoryData[]
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  return (
    <section className="relative px-4 sm:px-8 md:px-12 py-16">
      <div className="max-w-[2500px] mx-auto">
        <CyberCardHolographic className="p-8 md:p-12">
          {/* Filter Label and Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <H2>Filter:</H2>

            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.slug);

              return (
                <button
                  key={category.slug}
                  onClick={() => toggleCategory(category.slug)}
                  className="filter-button"
                  data-selected={isSelected}
                  aria-pressed={isSelected}
                  aria-label={`Filter by ${category.name}`}
                >
                  <div className="filter-button-inner">
                    <span className="font-[var(--font-amulya)] text-body">
                      {category.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </CyberCardHolographic>
      </div>

      <style jsx>{`
        .filter-button {
          min-width: 131px;
          height: 51px;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(
            to bottom right,
            #ffd700 0%,
            rgba(255, 215, 0, 0) 30%
          );
          background-color: rgba(255, 215, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          box-shadow: none;
        }

        .filter-button:hover,
        .filter-button:focus {
          background-color: rgba(255, 215, 0, 0.4);
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          outline: none;
        }

        .filter-button[data-selected="true"] {
          background: linear-gradient(
            to bottom right,
            #00ff88 0%,
            rgba(0, 255, 136, 0) 30%
          );
          background-color: rgba(0, 255, 136, 0.3);
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }

        .filter-button[data-selected="true"]:hover,
        .filter-button[data-selected="true"]:focus {
          background-color: rgba(0, 255, 136, 0.5);
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.6);
        }

        .filter-button-inner {
          width: 100%;
          height: 47px;
          border-radius: 13px;
          background-color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          color: #fff;
        }
      `}</style>
    </section>
  );
}
