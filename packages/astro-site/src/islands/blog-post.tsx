'use client';
import AppShell from '../lib/AppShell';
import { CategoryBlogPostTemplate } from '@public-site/components/blog';
import type { BlogPost } from '@public-site/lib/wordpress/types';

interface Props {
  post: BlogPost;
  category: string;
  relatedPosts: BlogPost[];
}

export default function BlogPostIsland({ post, category, relatedPosts }: Props) {
  return (
    <AppShell>
      <main id="main-content">
        <CategoryBlogPostTemplate post={post} category={category} relatedPosts={relatedPosts} />
      </main>
    </AppShell>
  );
}
