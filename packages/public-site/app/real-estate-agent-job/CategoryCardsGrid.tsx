'use client';

import { GlossyCategoryCard } from '@saa/shared/components/saa/cards';

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
 * Category Cards Grid Component
 * Displays category cards in responsive grid using GlossyCategoryCard
 * Client Component to handle onClick events
 */
export default function CategoryCardsGrid({
  categories
}: {
  categories: CategoryData[]
}) {
  return (
    <div className="
      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
      gap-4 md:gap-6
    ">
      {categories.map((category) => (
        <GlossyCategoryCard
          key={category.slug}
          icon={<span className="text-4xl"></span>}
          title={category.name}
          description=""
          count={0}
          onClick={() => {
            // TODO: Implement filter functionality
            console.log(`Filter by: ${category.slug}`);
          }}
        />
      ))}
    </div>
  );
}
