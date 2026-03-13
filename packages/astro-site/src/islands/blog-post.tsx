'use client';
import AppShell from '../lib/AppShell';
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

export default function BlogPostIsland({ post, category, relatedPosts, faqs }: Props) {
  return (
    <AppShell>
      <main id="main-content">
        <CategoryBlogPostTemplate post={post} category={category} relatedPosts={relatedPosts} faqs={faqs} />
      </main>
    </AppShell>
  );
}
