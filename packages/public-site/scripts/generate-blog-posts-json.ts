/**
 * Generate chunked blog posts JSON files at build time
 * Creates a lightweight index + page chunks for optimal loading
 *
 * Output:
 * - blog-posts-index.json (lightweight metadata with category mapping)
 * - blog-posts-chunk-1.json, chunk-2.json, etc. (9 posts per chunk)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface BlogPost {
  id: number;
  title: string;
  categories: string[];
  [key: string]: any;
}

interface BlogIndex {
  posts: Array<{
    id: number;
    categories: string[];
    chunk: number;
  }>;
  categoryMap: Record<string, number[]>; // category slug -> chunk numbers
  totalPosts: number;
  totalChunks: number;
  postsPerChunk: number;
}

// Import the blog API function
async function fetchBlogPosts(options: { page: number; per_page: number }) {
  const url = new URL('https://wp.saabuildingblocks.com/wp-json/saa/v1/blog/posts');
  url.searchParams.set('page', options.page.toString());
  url.searchParams.set('per_page', options.per_page.toString());

  console.log(`🔍 Fetching blog posts: ${url.toString()}`);

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.posts?.length || 0} posts (page ${data.pagination?.current_page}/${data.pagination?.total_pages})`);

    return data;
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    throw error;
  }
}

/**
 * Convert category name to slug format (matches FilterSection.tsx logic)
 */
function categoryNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Transform WordPress API response to match frontend BlogPost interface
 * Converts snake_case to camelCase
 */
function transformPost(apiPost: any): BlogPost {
  return {
    ...apiPost,
    // Convert featured_image (snake_case) to featuredImage (camelCase)
    featuredImage: apiPost.featured_image || null,
    // Remove the snake_case version
    featured_image: undefined,
  };
}

async function generateBlogPostsJson() {
  console.log('\n📝 Generating chunked blog posts with category index...');

  try {
    // Fetch ALL posts
    const allPostsData = await fetchBlogPosts({
      page: 1,
      per_page: 100,
    });

    // Transform posts to use camelCase
    let allPosts: BlogPost[] = allPostsData.posts.map(transformPost);
    const totalPages = allPostsData.pagination.total_pages;

    // Fetch remaining pages if needed
    if (totalPages > 1) {
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);

      for (const page of remainingPages) {
        try {
          const pageData = await fetchBlogPosts({ page, per_page: 100 });
          // Transform each post to camelCase
          allPosts = [...allPosts, ...pageData.posts.map(transformPost)];
        } catch (error) {
          console.warn(`⚠️  Skipping page ${page} due to error:`, (error as Error).message);
        }
      }
    }

    const POSTS_PER_CHUNK = 9; // Match pagination size
    const totalChunks = Math.ceil(allPosts.length / POSTS_PER_CHUNK);

    console.log(`\n📊 Total posts: ${allPosts.length}`);
    console.log(`📦 Creating ${totalChunks} chunks (${POSTS_PER_CHUNK} posts per chunk)`);

    // Create public directory if it doesn't exist
    const publicDir = join(process.cwd(), 'public');
    mkdirSync(publicDir, { recursive: true });

    // Build category map and index data
    const categoryMap: Record<string, Set<number>> = {};
    const indexPosts: BlogIndex['posts'] = [];

    // Split into chunks and build index
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const startIdx = chunkIndex * POSTS_PER_CHUNK;
      const endIdx = Math.min(startIdx + POSTS_PER_CHUNK, allPosts.length);
      const chunkPosts = allPosts.slice(startIdx, endIdx);
      const chunkNumber = chunkIndex + 1; // 1-indexed chunks

      // Write chunk file
      const chunkPath = join(publicDir, `blog-posts-chunk-${chunkNumber}.json`);
      writeFileSync(chunkPath, JSON.stringify(chunkPosts, null, 2));

      const chunkSizeKB = (JSON.stringify(chunkPosts).length / 1024).toFixed(1);
      console.log(`  ✅ Chunk ${chunkNumber}: ${chunkPosts.length} posts (${chunkSizeKB}KB)`);

      // Build index data for this chunk
      chunkPosts.forEach(post => {
        // Add to index
        const categorySlugs = (post.categories || []).map(categoryNameToSlug);
        indexPosts.push({
          id: post.id,
          categories: categorySlugs,
          chunk: chunkNumber,
        });

        // Update category map
        categorySlugs.forEach(slug => {
          if (!categoryMap[slug]) {
            categoryMap[slug] = new Set();
          }
          categoryMap[slug].add(chunkNumber);
        });
      });
    }

    // Convert category map sets to sorted arrays
    const categoryMapArrays: Record<string, number[]> = {};
    Object.keys(categoryMap).forEach(slug => {
      categoryMapArrays[slug] = Array.from(categoryMap[slug]).sort((a, b) => a - b);
    });

    // Create index file
    const index: BlogIndex = {
      posts: indexPosts,
      categoryMap: categoryMapArrays,
      totalPosts: allPosts.length,
      totalChunks,
      postsPerChunk: POSTS_PER_CHUNK,
    };

    const indexPath = join(publicDir, 'blog-posts-index.json');
    writeFileSync(indexPath, JSON.stringify(index, null, 2));

    const indexSizeKB = (JSON.stringify(index).length / 1024).toFixed(1);
    console.log(`\n📋 Generated index: ${indexSizeKB}KB`);
    console.log(`📍 Location: ${publicDir}/`);

    // Show category distribution
    console.log('\n🏷️  Category distribution:');
    Object.entries(categoryMapArrays)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10)
      .forEach(([slug, chunks]) => {
        console.log(`  ${slug}: ${chunks.length} chunks`);
      });

    console.log(`\n✅ Complete! Generated:`);
    console.log(`  - 1 index file (${indexSizeKB}KB)`);
    console.log(`  - ${totalChunks} chunk files`);
    console.log(`  - Total: ${allPosts.length} posts`);

  } catch (error) {
    console.error('❌ Failed to generate blog posts:', error);
    process.exit(1);
  }
}

generateBlogPostsJson();
