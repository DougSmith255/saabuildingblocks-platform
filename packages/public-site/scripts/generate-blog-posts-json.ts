/**
 * Generate chunked blog posts JSON files at build time
 * Creates a lightweight index + page chunks for optimal loading
 *
 * Output:
 * - blog-posts-index.json (lightweight metadata with category mapping)
 * - blog-posts-chunk-1.json, chunk-2.json, etc. (9 posts per chunk)
 *
 * Updated: Uses standard WordPress REST API (/wp/v2/posts) instead of custom SAA endpoint
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Load Cloudflare Images mapping for URL transformation (filename-based)
interface CloudflareImageEntry {
  cloudflareId: string;
  cloudflareUrl: string;
  hash: string;
  uploadedAt: string;
  filename: string;
}

// Slug-based featured image mapping (most accurate)
interface SlugToCloudflareEntry {
  cloudflareUrl: string;
  source: string;
  matchType: string;
}

// Map: lowercase filename -> Cloudflare URL (for content images)
let imageMapping: Map<string, string> = new Map();
// Map: post slug -> Cloudflare URL (for featured images)
let slugToFeaturedImage: Map<string, string> = new Map();

function loadImageMapping(): void {
  // Load slug-to-cloudflare mapping for featured images (primary method)
  const slugMappingPath = join(process.cwd(), 'slug-to-cloudflare-featured.json');
  if (existsSync(slugMappingPath)) {
    try {
      const data: Record<string, SlugToCloudflareEntry> = JSON.parse(readFileSync(slugMappingPath, 'utf-8'));
      Object.entries(data).forEach(([slug, entry]) => {
        slugToFeaturedImage.set(slug, entry.cloudflareUrl);
      });
      console.log(`✅ Loaded ${slugToFeaturedImage.size} slug-to-featured-image mappings`);
    } catch (error) {
      console.warn(`⚠️  Could not load slug-to-cloudflare mapping:`, error);
    }
  }

  // Load filename-based mapping for content images (fallback)
  const mappingPaths = [
    join(process.cwd(), 'cloudflare-images-mapping-rebuilt.json'),
    join(process.cwd(), 'cloudflare-images-mapping.json'),
  ];

  for (const mappingPath of mappingPaths) {
    if (existsSync(mappingPath)) {
      try {
        const data: Record<string, CloudflareImageEntry> = JSON.parse(readFileSync(mappingPath, 'utf-8'));
        Object.entries(data).forEach(([filename, entry]) => {
          // Key by lowercase filename for case-insensitive matching
          imageMapping.set(filename.toLowerCase(), entry.cloudflareUrl);
        });
        console.log(`✅ Loaded ${imageMapping.size} filename-to-cloudflare mappings from ${mappingPath.split('/').pop()}`);
        return; // Stop after first successful load
      } catch (error) {
        console.warn(`⚠️  Could not load Cloudflare Images mapping from ${mappingPath}:`, error);
      }
    }
  }

  if (imageMapping.size === 0) {
    console.warn('⚠️  No Cloudflare Images mapping file found');
  }
}

/**
 * Get featured image URL for a post by slug
 * This is the most accurate method - uses pre-computed matching
 */
function getFeaturedImageBySlug(slug: string): string | null {
  return slugToFeaturedImage.get(slug) || null;
}

/**
 * Extract filename from a WordPress URL
 * e.g., "https://wp.saabuildingblocks.com/wp-content/uploads/2024/05/image.webp" -> "image.webp"
 */
function extractFilename(url: string): string {
  try {
    // Get the last part of the URL path
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1] || '';
  } catch {
    // If URL parsing fails, try simple extraction
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  }
}

/**
 * Transform WordPress URL to Cloudflare Images URL if mapping exists
 * Uses filename-based matching (case-insensitive)
 */
function transformToCloudflareUrl(wpUrl: string): string {
  if (!wpUrl) return wpUrl;

  // Extract the filename from the WordPress URL
  let filename = extractFilename(wpUrl);
  if (!filename) return wpUrl;

  // Try exact filename match (case-insensitive)
  const lowerFilename = filename.toLowerCase();
  if (imageMapping.has(lowerFilename)) {
    return imageMapping.get(lowerFilename)!;
  }

  // Try without WordPress size suffix (e.g., image-300x200.webp -> image.webp)
  const baseFilename = filename.replace(/-\d+x\d+(\.[^.]+)$/, '$1').toLowerCase();
  if (baseFilename !== lowerFilename && imageMapping.has(baseFilename)) {
    return imageMapping.get(baseFilename)!;
  }

  // Try removing any additional size variations that might be in the middle
  // e.g., image-scaled.webp -> image.webp
  const cleanFilename = filename.replace(/-scaled(\.[^.]+)$/, '$1').toLowerCase();
  if (cleanFilename !== lowerFilename && imageMapping.has(cleanFilename)) {
    return imageMapping.get(cleanFilename)!;
  }

  // Return original if no mapping found
  return wpUrl;
}

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

interface WPCategory {
  id: number;
  name: string;
  slug: string;
}

// Cache for category data
let categoryCache: Map<number, WPCategory> = new Map();

/**
 * Fetch all categories from WordPress and cache them
 */
async function fetchCategories(): Promise<void> {
  console.log('🏷️  Fetching categories...');

  const url = 'https://wp.saabuildingblocks.com/wp-json/wp/v2/categories?per_page=100';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const categories: WPCategory[] = await response.json();
    categories.forEach(cat => {
      categoryCache.set(cat.id, cat);
    });

    console.log(`✅ Cached ${categories.length} categories`);
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }
}

/**
 * Fetch blog posts from standard WordPress REST API
 */
async function fetchBlogPosts(options: { page: number; per_page: number }): Promise<{
  posts: any[];
  pagination: { current_page: number; total_pages: number; total_posts: number };
}> {
  // Use standard WP REST API with _embed for featured images
  const url = new URL('https://wp.saabuildingblocks.com/wp-json/wp/v2/posts');
  url.searchParams.set('page', options.page.toString());
  url.searchParams.set('per_page', options.per_page.toString());
  url.searchParams.set('_embed', 'true'); // Include featured image and author data
  url.searchParams.set('status', 'publish');
  url.searchParams.set('orderby', 'date');
  url.searchParams.set('order', 'desc');

  console.log(`🔍 Fetching blog posts: ${url.toString()}`);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();

    // Get pagination info from headers
    const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);

    console.log(`✅ Fetched ${posts.length} posts (page ${options.page}/${totalPages})`);

    return {
      posts,
      pagination: {
        current_page: options.page,
        total_pages: totalPages,
        total_posts: totalPosts,
      },
    };
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
 * Extract the first image from HTML content as a fallback for featured image
 */
function extractFirstImageFromContent(content: string): { url: string; alt: string } | null {
  if (!content) return null;

  // Match <img> tags with src attribute
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/i;
  const match = content.match(imgRegex);

  if (match && match[1]) {
    // Also try to get alt from different position in tag
    const altRegex = /alt=["']([^"']*)["']/i;
    const altMatch = content.match(altRegex);

    return {
      url: match[1],
      alt: match[2] || (altMatch ? altMatch[1] : '') || '',
    };
  }

  return null;
}

/**
 * Fix broken /staging/ paths in URLs
 * These were created during migration and don't exist on the new site
 */
function fixStagingPaths(url: string): string {
  if (!url) return url;
  // Remove /staging/ from the path
  return url.replace('/staging/wp-content/', '/wp-content/');
}

/**
 * Transform all image URLs in HTML content to Cloudflare Images URLs
 */
function transformContentImages(content: string): string {
  if (!content) return content;

  // First fix any /staging/ paths
  let fixedContent = content.replace(
    /https:\/\/wp\.saabuildingblocks\.com\/staging\/wp-content\//g,
    'https://wp.saabuildingblocks.com/wp-content/'
  );

  // Match all img src attributes and replace with Cloudflare URLs
  return fixedContent.replace(
    /<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi,
    (match, before, url, after) => {
      const cloudflareUrl = transformToCloudflareUrl(url);
      return `<img${before}src="${cloudflareUrl}"${after}>`;
    }
  );
}

/**
 * Transform WordPress REST API response to match frontend BlogPost interface
 * Converts from standard WP format to the expected format
 */
function transformPost(wpPost: any): BlogPost {
  // PRIMARY: Get featured image by slug from pre-computed mapping
  // This is the most accurate method since WordPress featured_media is often 0
  let featuredImage = null;
  const slugBasedUrl = getFeaturedImageBySlug(wpPost.slug);

  if (slugBasedUrl) {
    featuredImage = {
      url: slugBasedUrl,
      alt: wpPost.title?.rendered || '',
      width: undefined,
      height: undefined,
    };
  }

  // FALLBACK 1: Try WordPress _embedded featured media
  if (!featuredImage && wpPost._embedded?.['wp:featuredmedia']?.[0]) {
    const media = wpPost._embedded['wp:featuredmedia'][0];
    featuredImage = {
      url: transformToCloudflareUrl(media.source_url),
      alt: media.alt_text || wpPost.title?.rendered || '',
      width: media.media_details?.width,
      height: media.media_details?.height,
    };
  }

  // FALLBACK 2: Extract first image from content if still no featured image
  if (!featuredImage && wpPost.content?.rendered) {
    const contentImage = extractFirstImageFromContent(wpPost.content.rendered);
    if (contentImage) {
      featuredImage = {
        url: transformToCloudflareUrl(contentImage.url),
        alt: contentImage.alt || wpPost.title?.rendered || '',
        width: undefined,
        height: undefined,
      };
    }
  }

  // Extract author from _embedded data
  let author: { name: string; avatar?: string } = { name: 'Unknown Author' };
  if (wpPost._embedded?.author?.[0]) {
    const wpAuthor = wpPost._embedded.author[0];
    author = {
      name: wpAuthor.name,
      avatar: wpAuthor.avatar_urls?.['96'] || wpAuthor.avatar_urls?.['48'],
    };
  }

  // Get category names from cached category data
  const categoryNames: string[] = [];
  if (Array.isArray(wpPost.categories)) {
    wpPost.categories.forEach((catId: number) => {
      const cat = categoryCache.get(catId);
      if (cat) {
        categoryNames.push(cat.name);
      }
    });
  }

  // Extract excerpt - remove HTML tags
  const excerpt = wpPost.excerpt?.rendered
    ? wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').trim()
    : '';

  // Extract meta description from Yoast or Rank Math if available
  const metaDescription = wpPost.yoast_head_json?.description
    || wpPost.rank_math_description
    || excerpt.slice(0, 160);

  return {
    id: wpPost.id,
    title: wpPost.title?.rendered || '',
    slug: wpPost.slug,
    excerpt,
    content: transformContentImages(wpPost.content?.rendered || ''),
    date: wpPost.date,
    modified: wpPost.modified,
    link: wpPost.link,
    categories: categoryNames,
    featuredImage,
    author,
    metaDescription,
    // Additional fields that might be expected
    comparisonImages: [], // Standard WP API doesn't have this, but keep for compatibility
  };
}

async function generateBlogPostsJson() {
  console.log('\n📝 Generating chunked blog posts with category index...');
  console.log('📡 Using standard WordPress REST API (/wp/v2/posts)\n');

  try {
    // Load Cloudflare Images mapping for URL transformation
    loadImageMapping();

    // First, fetch and cache all categories
    await fetchCategories();

    // Fetch first page of posts
    const firstPageData = await fetchBlogPosts({
      page: 1,
      per_page: 100,
    });

    // Transform posts to match expected format
    let allPosts: BlogPost[] = firstPageData.posts.map(transformPost);
    const totalPages = firstPageData.pagination.total_pages;

    // Fetch remaining pages if needed
    if (totalPages > 1) {
      for (let page = 2; page <= totalPages; page++) {
        try {
          const pageData = await fetchBlogPosts({ page, per_page: 100 });
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
