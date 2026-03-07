/**
 * Build-time blog data loader for Astro.
 * Reads the same chunked JSON files that Next.js uses.
 * Only runs during `astro build` (server-side, uses fs).
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { BlogPost } from '@public-site/lib/wordpress/types';

const AUTHOR_NAME_MAP: Record<string, string> = {
  'karriehill': 'Karrie Hill',
  'dougsmart1': 'Doug Smart',
};

function normalizeAuthorName(post: BlogPost): BlogPost {
  const mapped = AUTHOR_NAME_MAP[post.author.name.toLowerCase()];
  if (mapped) {
    return { ...post, author: { ...post.author, name: mapped } };
  }
  return post;
}

/** Resolve the public-site/public directory */
function getPublicDir(): string {
  return new URL('../../../public-site/public/', import.meta.url).pathname;
}

let cachedPosts: BlogPost[] | null = null;

export function getAllBlogPosts(): BlogPost[] {
  if (cachedPosts) return cachedPosts;

  const publicDir = getPublicDir();
  const allPosts: BlogPost[] = [];

  const indexPath = join(publicDir, 'blog-posts-index.json');
  let totalChunks = 50;
  try {
    if (existsSync(indexPath)) {
      const index = JSON.parse(readFileSync(indexPath, 'utf-8'));
      totalChunks = index.totalChunks || totalChunks;
    }
  } catch {}

  for (let i = 1; i <= totalChunks; i++) {
    const chunkPath = join(publicDir, `blog-posts-chunk-${i}.json`);
    try {
      if (existsSync(chunkPath)) {
        const data: BlogPost[] = JSON.parse(readFileSync(chunkPath, 'utf-8'));
        allPosts.push(...data.map(normalizeAuthorName));
      }
    } catch (error) {
      console.warn(`Failed to load blog-posts-chunk-${i}.json:`, error);
    }
  }

  console.log(`📚 Astro: Loaded ${allPosts.length} blog posts from ${totalChunks} chunks`);
  cachedPosts = allPosts;
  return allPosts;
}

export function findPostBySlug(posts: BlogPost[], slug: string): BlogPost | undefined {
  const byUri = posts.find((p) => {
    if (!p.customUri) return false;
    const uriSlug = p.customUri.split('/').pop();
    return uriSlug === slug;
  });
  if (byUri) return byUri;
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(
  posts: BlogPost[],
  currentPost: BlogPost,
  limit = 6
): BlogPost[] {
  const currentCategory = currentPost.categories[0];
  const candidates = posts.filter((p) => p.id !== currentPost.id);
  const sameCategory = candidates.filter((p) =>
    p.categories.includes(currentCategory)
  );
  const other = candidates.filter(
    (p) => !p.categories.includes(currentCategory)
  );
  const sorted = [...sameCategory, ...other].slice(0, limit);
  return sorted.map((p) => ({ ...p, content: '' }));
}
