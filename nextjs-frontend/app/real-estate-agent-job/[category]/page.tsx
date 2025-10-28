import { notFound } from 'next/navigation';
import { CategoryTemplate } from '@/components/blog/category-components/CategoryTemplate';
import { getCategoryConfig, getAllCategorySlugs } from '@/components/blog/config/category-configs';
import { fetchPostsByCategory, getAllowedCategories } from '@/lib/wordpress/api';
import { getTemplateBySlug, hasTemplate } from '@/lib/category-templates/registry';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

/**
 * Generate static paths for all allowed categories at build time
 * No ISR - pure static generation
 */
export async function generateStaticParams() {
  const allowedCategories = getAllowedCategories();
  return allowedCategories.map((category) => ({ category }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const config = getCategoryConfig(category);

  if (!config) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${config.name} | SAA Building Blocks`,
    description: config.meta.description,
    keywords: config.meta.keywords.join(', '),
    openGraph: {
      title: config.title,
      description: config.meta.description,
      images: [config.backgroundImage],
    },
  };
}

/**
 * Category Archive Page
 * Server component that fetches data and renders category template
 */
export default async function CategoryArchivePage({ params }: CategoryPageProps) {
  const { category } = await params;
  const config = getCategoryConfig(category);

  if (!config) {
    notFound();
  }

  // Fetch WordPress posts for this category at build time
  const posts = await fetchPostsByCategory(config.categorySlug);

  // Check if this category has a custom template (Phase 11 - Template System)
  if (hasTemplate(category)) {
    const template = getTemplateBySlug(category);
    if (template && template.meta.status === 'active') {
      const TemplateComponent = template.component;

      return (
        <main className="min-h-screen bg-black">
          <TemplateComponent
            category={{
              id: parseInt(config.id as string, 10),
              name: config.name,
              slug: config.slug,
              description: config.tagline,
              count: posts.length
            }}
            posts={posts.map(post => ({
              id: typeof post.id === 'number' ? post.id : parseInt(post.id as string, 10),
              slug: post.slug,
              title: post.title,
              excerpt: post.excerpt,
              content: post.content || '',
              featuredImage: post.featuredImage?.url || undefined,
              author: (typeof post.author === 'object' && post.author?.name
                ? post.author.name
                : (post.author || 'Unknown')) as string,
              date: post.date,
              categories: [config.slug]
            }))}
            settings={{
              typography: {} as any, // Master Controller settings applied via CSS variables
              colors: {} as any,
              spacing: {} as any
            }}
          />
        </main>
      );
    }
  }

  // Fallback to default CategoryTemplate
  return (
    <main className="min-h-screen bg-black">
      <CategoryTemplate config={config} posts={posts} />
    </main>
  );
}
