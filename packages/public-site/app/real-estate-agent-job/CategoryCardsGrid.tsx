'use client';

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
 * Simple Category List Component
 * Displays category names as simple clickable text
 */
export default function CategoryCardsGrid({
  categories
}: {
  categories: CategoryData[]
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <button
          key={category.slug}
          onClick={() => {
            // TODO: Implement filter functionality
            console.log(`Filter by: ${category.slug}`);
          }}
          className="text-saa-white hover:text-saa-neon-green transition-colors duration-200"
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
