import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

interface ComponentCategory {
  name: string;
  slug: string;
  count: number;
  description: string;
}

async function getComponentCategories(): Promise<ComponentCategory[]> {
  const componentsDir = path.join(process.cwd(), 'public', 'saa-components');

  try {
    const categories = await fs.readdir(componentsDir);

    const categoryData = await Promise.all(
      categories.map(async (category) => {
        const categoryPath = path.join(componentsDir, category);
        const stats = await fs.stat(categoryPath);

        if (!stats.isDirectory()) return null;

        const files = await fs.readdir(categoryPath);
        const componentCount = files.filter(f => f.endsWith('.html')).length;

        const descriptions: Record<string, string> = {
          animations: 'Dynamic stacked card animations with motion effects',
          buttons: 'CTA and secondary buttons with multiple variants',
          cards: 'Cyber-themed cards with holographic and neural network effects',
          gallery: 'Scroll-based image galleries with smooth animations',
          icons: 'Comprehensive icon library with sprite system',
          navigation: 'Scrollport and infinite loop navigation components',
          special: 'Advanced components like accessible accordions',
          team: '3D team carousels with touch support',
          text: 'Matrix-style text scramble effects',
          effects: 'Special visual effects and transitions',
          status: 'Status indicators and badges'
        };

        return {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          slug: category,
          count: componentCount,
          description: descriptions[category] || `${category} components`
        };
      })
    );

    return categoryData.filter((cat): cat is ComponentCategory => cat !== null && cat.count > 0);
  } catch (error) {
    console.error('Error reading components:', error);
    return [];
  }
}

export default async function ComponentsPage() {
  const categories = await getComponentCategories();
  const totalComponents = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-blue-500/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            SAA Component Gallery
          </h1>
          <p className="mt-2 text-lg text-slate-300">
            {totalComponents} design system components across {categories.length} categories
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/components/${category.slug}`}
              className="group relative overflow-hidden rounded-xl border border-blue-500/20 bg-slate-900/50 p-6 transition-all hover:border-blue-400/40 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-blue-500/10"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Content */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-semibold text-white">
                    {category.name}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium">
                    {category.count}
                  </span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed">
                  {category.description}
                </p>

                {/* View arrow */}
                <div className="mt-4 flex items-center text-blue-400 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                  View components
                  <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No components found. Please check the installation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
