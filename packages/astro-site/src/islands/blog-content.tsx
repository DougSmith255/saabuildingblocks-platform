'use client';

import { CategoryBlogPostTemplate } from '@public-site/components/blog';
import '@public-site/app/styles/blog.css';
import type { BlogPost } from '@public-site/lib/wordpress/types';
import type { FAQItem } from '@saa/shared/components/saa/interactive';

interface Props {
  post: BlogPost;
  category: string;
  relatedPosts: BlogPost[];
  faqs?: FAQItem[];
}

/**
 * Lightweight blog content island - renders just the blog template.
 * No AppShell/LayoutWrapper overhead. Header, Footer, StarBackground,
 * and SmoothScroll are separate Astro islands with client:idle.
 */
export default function BlogContentIsland({ post, category, relatedPosts, faqs }: Props) {
  return (
    <main id="main-content">
      <CategoryBlogPostTemplate post={post} category={category} relatedPosts={relatedPosts} faqs={faqs} />
    </main>
  );
}
