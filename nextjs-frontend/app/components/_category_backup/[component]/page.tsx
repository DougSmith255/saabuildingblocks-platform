import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ComponentPreview from './ComponentPreview';

interface ComponentPageProps {
  params: {
    category: string;
    component: string;
  };
}

async function getComponentFiles(category: string, component: string) {
  const componentPath = path.join(process.cwd(), 'public', 'saa-components', category);

  try {
    const htmlPath = path.join(componentPath, `${component}.html`);
    const cssPath = path.join(componentPath, `${component}.css`);
    const jsPath = path.join(componentPath, `${component}.js`);

    const html = await fs.readFile(htmlPath, 'utf-8').catch(() => null);
    const css = await fs.readFile(cssPath, 'utf-8').catch(() => null);
    const js = await fs.readFile(jsPath, 'utf-8').catch(() => null);

    if (!html) {
      return null;
    }

    return { html, css, js };
  } catch {
    return null;
  }
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const files = await getComponentFiles(params.category, params.component);

  if (!files) {
    notFound();
  }

  const componentName = params.component
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-blue-500/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={`/components/${params.category}`}
            className="text-blue-400 hover:text-cyan-300 transition-colors inline-flex items-center text-sm mb-3"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {categoryName}
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            {componentName}
          </h1>
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium">
              HTML
            </span>
            {files.css && (
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium">
                CSS
              </span>
            )}
            {files.js && (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium">
                JavaScript
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Component Preview */}
      <ComponentPreview
        html={files.html}
        css={files.css}
        js={files.js}
        componentName={componentName}
      />
    </div>
  );
}
