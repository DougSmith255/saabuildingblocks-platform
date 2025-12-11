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
          className="
            px-6 py-3
            text-base font-medium
            text-saa-white
            bg-saa-white/5
            border border-saa-white/20
            rounded-lg
            hover:bg-saa-neon-green/10
            hover:border-saa-neon-green
            hover:text-saa-neon-green
            transition-all duration-200
            backdrop-blur-sm
          "
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
