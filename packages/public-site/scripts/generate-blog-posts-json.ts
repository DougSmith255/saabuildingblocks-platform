/**
 * Generate static blog-posts.json file at build time
 * This keeps the HTML tiny and allows hero sections to load instantly
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

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

async function generateBlogPostsJson() {
  console.log('\n📝 Generating blog-posts.json...');

  try {
    // Fetch ALL posts
    const allPostsData = await fetchBlogPosts({
      page: 1,
      per_page: 100,
    });

    let allPosts = allPostsData.posts;
    const totalPages = allPostsData.pagination.total_pages;

    // Fetch remaining pages if needed
    if (totalPages > 1) {
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);

      // Fetch pages with error handling - skip failed pages
      for (const page of remainingPages) {
        try {
          const pageData = await fetchBlogPosts({ page, per_page: 100 });
          allPosts = [...allPosts, ...pageData.posts];
        } catch (error) {
          console.warn(`⚠️  Skipping page ${page} due to error:`, (error as Error).message);
        }
      }
    }

    // Write to public directory
    const outputPath = join(process.cwd(), 'public', 'blog-posts.json');
    writeFileSync(outputPath, JSON.stringify(allPosts, null, 2));

    console.log(`✅ Generated blog-posts.json with ${allPosts.length} posts`);
    console.log(`📦 File size: ${(JSON.stringify(allPosts).length / 1024 / 1024).toFixed(2)}MB`);
    console.log(`📍 Location: ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to generate blog-posts.json:', error);
    process.exit(1);
  }
}

generateBlogPostsJson();
