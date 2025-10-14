import { notFound } from 'next/navigation';
import { CategoryTemplate } from '../components/CategoryTemplate';
import { getCategoryConfig, getAllCategorySlugs } from '../config/category-configs';
import { fetchPostsByCategory } from '@/lib/wordpress/api';
import { getTemplateBySlug, hasTemplate } from '@/lib/category-templates/registry';
import { useTypographyStore } from '@/app/master-controller/stores/typographyStore';
import { useBrandColorsStore } from '@/app/master-controller/stores/brandColorsStore';
import { useSpacingStore } from '@/app/master-controller/stores/spacingStore';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all 12 categories (Phase 7.3 - Complete)
export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getCategoryConfig(slug);

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

// Server component that fetches data and renders client component
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const config = getCategoryConfig(slug);

  if (!config) {
    notFound();
  }

  // Fetch WordPress posts for this category
  const posts = await fetchPostsByCategory(config.categorySlug);

  // Check if this category has a custom template (Phase 11 - New Template System)
  if (hasTemplate(slug)) {
    const template = getTemplateBySlug(slug);
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
              typography: {} as any, // Will be filled by store in client
              colors: {} as any,
              spacing: {} as any
            }}
          />
        </main>
      );
    }
  }

  // Fallback to old CategoryTemplate for categories without custom templates
  return (
    <main className="min-h-screen bg-black">
      <CategoryTemplate config={config} posts={posts} />
    </main>
  );
}
