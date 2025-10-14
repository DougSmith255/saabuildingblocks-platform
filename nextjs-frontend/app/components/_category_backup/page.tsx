import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

interface Component {
  name: string;
  filename: string;
  hasCSS: boolean;
  hasJS: boolean;
}

async function getCategoryComponents(category: string): Promise<Component[]> {
  const categoryPath = path.join(process.cwd(), 'public', 'saa-components', category);

  try {
    const files = await fs.readdir(categoryPath);
    const htmlFiles = files.filter(f => f.endsWith('.html'));

    const components = htmlFiles.map(file => {
      const baseName = file.replace('.html', '');
      const name = baseName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        name,
        filename: baseName,
        hasCSS: files.includes(`${baseName}.css`),
        hasJS: files.includes(`${baseName}.js`)
      };
    });

    return components;
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const components = await getCategoryComponents(params.category);

  if (components.length === 0) {
    notFound();
  }

  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-blue-500/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/components" className="text-blue-400 hover:text-cyan-300 transition-colors mb-4 inline-flex items-center text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Gallery
          </Link>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mt-2">
            {categoryName} Components
          </h1>
          <p className="mt-2 text-lg text-slate-300">
            {components.length} component{components.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* Components Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((component) => (
            <Link
              key={component.filename}
              href={`/components/${params.category}/${component.filename}`}
              className="group relative overflow-hidden rounded-xl border border-blue-500/20 bg-slate-900/50 p-6 transition-all hover:border-blue-400/40 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-blue-500/10"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Content */}
              <div className="relative">
                <h2 className="text-xl font-semibold text-white mb-3">
                  {component.name}
                </h2>

                {/* File indicators */}
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-medium">
                    HTML
                  </span>
                  {component.hasCSS && (
                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-medium">
                      CSS
                    </span>
                  )}
                  {component.hasJS && (
                    <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-medium">
                      JS
                    </span>
                  )}
                </div>

                {/* View link */}
                <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                  View preview
                  <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
