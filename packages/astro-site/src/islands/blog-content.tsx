'use client';

import { CategoryBlogPostTemplate } from '@public-site/components/blog';
import type { BlogPost } from '@public-site/lib/wordpress/types';

interface Props {
  post: BlogPost;
  category: string;
  relatedPosts: BlogPost[];
}

/**
 * Lightweight blog content island - renders just the blog template.
 * No AppShell/LayoutWrapper overhead. Header, Footer, StarBackground,
 * and SmoothScroll are separate Astro islands with client:idle.
 */
export default function BlogContentIsland({ post, category, relatedPosts }: Props) {
  return (
    <main id="main-content">
      <CategoryBlogPostTemplate post={post} category={category} relatedPosts={relatedPosts} />
    </main>
  );
}
