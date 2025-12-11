#!/usr/bin/env tsx
/**
 * WordPress Content Migration Script
 *
 * Migrates blog posts and images from source WordPress to destination WordPress.
 *
 * SCOPE:
 * - Posts published/scheduled after cutoff date
 * - Featured images and embedded images
 * - Category/tag assignments (using existing destination IDs)
 *
 * DOES NOT:
 * - Create categories or tags
 * - Migrate users, settings, or other data
 *
 * USAGE:
 *   npx tsx scripts/migrate-wordpress-content.ts --dry-run   # Preview only
 *   npx tsx scripts/migrate-wordpress-content.ts             # Actual migration (skips existing)
 *   npx tsx scripts/migrate-wordpress-content.ts --update    # Process embedded images in existing posts
 */

import { config } from 'dotenv';
import path from 'path';
import https from 'https';
import { Readable } from 'stream';

// Allow self-signed certificates for localhost connections (bypassing Cloudflare)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Host header for local requests to route to correct vhost
const DEST_HOST = 'wp.saabuildingblocks.com';

// Custom fetch for local destination that uses SNI
async function localFetch(
  urlPath: string,
  options: { method?: string; headers?: Record<string, string>; body?: any } = {}
): Promise<{ ok: boolean; status: number; statusText: string; headers: Map<string, string>; text: () => Promise<string>; json: () => Promise<any> }> {
  return new Promise((resolve, reject) => {
    // Convert body to buffer and calculate length
    const bodyBuffer = options.body ? Buffer.from(options.body, 'utf-8') : null;

    const reqOptions: https.RequestOptions = {
      hostname: '127.0.0.1',
      port: 443,
      path: urlPath,
      method: options.method || 'GET',
      headers: {
        ...options.headers,
        'Host': DEST_HOST,
        ...(bodyBuffer ? { 'Content-Length': bodyBuffer.length } : {}),
      },
      servername: DEST_HOST, // SNI - critical for vhost routing
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const headers = new Map<string, string>();
        Object.entries(res.headers).forEach(([k, v]) => {
          if (typeof v === 'string') headers.set(k.toLowerCase(), v);
          else if (Array.isArray(v)) headers.set(k.toLowerCase(), v[0]);
        });

        resolve({
          ok: res.statusCode! >= 200 && res.statusCode! < 300,
          status: res.statusCode!,
          statusText: res.statusMessage || '',
          headers,
          text: async () => data,
          json: async () => JSON.parse(data),
        });
      });
    });

    req.on('error', reject);

    if (bodyBuffer) {
      req.write(bodyBuffer);
    }
    req.end();
  });
}

// Upload media to local WordPress using multipart/form-data
async function localUploadMedia(
  imageBuffer: Buffer,
  filename: string,
  title: string,
  altText: string,
  authHeader: string
): Promise<{ ok: boolean; status: number; json: () => Promise<any>; text: () => Promise<string> }> {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

  // Build multipart body
  let body = '';
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`;
  body += `Content-Type: application/octet-stream\r\n\r\n`;

  const bodyStart = Buffer.from(body, 'utf-8');

  let bodyEnd = `\r\n--${boundary}\r\n`;
  bodyEnd += `Content-Disposition: form-data; name="title"\r\n\r\n`;
  bodyEnd += `${title}\r\n`;
  bodyEnd += `--${boundary}\r\n`;
  bodyEnd += `Content-Disposition: form-data; name="alt_text"\r\n\r\n`;
  bodyEnd += `${altText}\r\n`;
  bodyEnd += `--${boundary}--\r\n`;

  const bodyEndBuffer = Buffer.from(bodyEnd, 'utf-8');
  const fullBody = Buffer.concat([bodyStart, imageBuffer, bodyEndBuffer]);

  return new Promise((resolve, reject) => {
    const reqOptions: https.RequestOptions = {
      hostname: '127.0.0.1',
      port: 443,
      path: '/wp-json/wp/v2/media',
      method: 'POST',
      headers: {
        'Host': DEST_HOST,
        'Authorization': authHeader,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBody.length,
      },
      servername: DEST_HOST,
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          ok: res.statusCode! >= 200 && res.statusCode! < 300,
          status: res.statusCode!,
          text: async () => data,
          json: async () => JSON.parse(data),
        });
      });
    });

    req.on('error', reject);
    req.write(fullBody);
    req.end();
  });
}

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') });

// ============================================================================
// CONFIGURATION
// ============================================================================

interface MigrationConfig {
  source: {
    url: string;
    user: string;
    appPassword: string;
  };
  destination: {
    url: string;
    user: string;
    appPassword: string;
  };
  cutoffDate: string;
  dryRun: boolean;
}

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isUpdateMode = args.includes('--update'); // Update existing posts instead of skipping

const CONFIG: MigrationConfig = {
  source: {
    url: process.env.SOURCE_WP_URL || 'https://smartagentalliance.com',
    user: process.env.SOURCE_WP_USER || 'dougsmart1',
    appPassword: process.env.SOURCE_WP_APP_PASSWORD || 'zWUp ezw5 k9AP BY1x 5n27 5KxV',
  },
  destination: {
    // Use localhost HTTPS to bypass Cloudflare which strips Authorization headers
    url: 'https://localhost',
    user: process.env.WORDPRESS_USER || 'developer',
    appPassword: process.env.WORDPRESS_APP_PASSWORD || '',
  },
  cutoffDate: '2025-10-07T05:00:00',
  dryRun: isDryRun,
};

// ============================================================================
// TYPES
// ============================================================================

interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  slug: string;
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  meta: Record<string, any>;
  acf?: Record<string, any>;
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    'wp:term'?: WPTerm[][];
  };
}

interface WPMedia {
  id: number;
  source_url: string;
  title: { rendered: string };
  alt_text: string;
  media_details: {
    width?: number;
    height?: number;
  };
}

interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: 'category' | 'post_tag';
}

interface MigrationStats {
  postsFound: number;
  postsMigrated: number;
  postsSkipped: number;
  postsFailed: string[];
  mediaFound: number;
  mediaMigrated: number;
  mediaSkipped: number;
  mediaFailed: string[];
  embeddedImagesFound?: number;
  embeddedImagesMigrated?: number;
  embeddedImagesFailed?: string[];
}

// ============================================================================
// API HELPERS
// ============================================================================

function getBasicAuthHeader(user: string, password: string): string {
  const credentials = Buffer.from(`${user}:${password}`).toString('base64');
  return `Basic ${credentials}`;
}

async function fetchWithAuth(
  url: string,
  auth: { user: string; appPassword: string },
  options: RequestInit = {},
  isDestination: boolean = false
): Promise<any> {
  const headers: Record<string, string> = {
    'Authorization': getBasicAuthHeader(auth.user, auth.appPassword),
    ...(options.headers as Record<string, string>),
  };

  // Use localFetch for destination requests to bypass Cloudflare with proper SNI
  if (isDestination) {
    // Extract path from URL
    const urlObj = new URL(url);
    return localFetch(urlObj.pathname + urlObj.search, {
      method: options.method as string,
      headers,
      body: options.body as string,
    });
  }

  return fetch(url, { ...options, headers });
}

async function fetchAllPages<T>(
  baseUrl: string,
  auth: { user: string; appPassword: string },
  isDestination: boolean = false
): Promise<T[]> {
  const allItems: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const separator = baseUrl.includes('?') ? '&' : '?';
    const url = `${baseUrl}${separator}page=${page}&per_page=100`;

    const response = await fetchWithAuth(url, auth, {}, isDestination);

    if (!response.ok) {
      if (response.status === 400) {
        // No more pages
        hasMore = false;
        break;
      }
      // Log more details for debugging
      const errorBody = await response.text().catch(() => 'Could not read error body');
      console.error(`   API Error: ${response.status} ${response.statusText}`);
      console.error(`   URL: ${url}`);
      console.error(`   Response: ${errorBody.substring(0, 500)}`);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const items: T[] = await response.json();

    if (items.length === 0) {
      hasMore = false;
    } else {
      allItems.push(...items);
      page++;

      // Check X-WP-TotalPages header
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      if (page > totalPages) {
        hasMore = false;
      }
    }
  }

  return allItems;
}

// ============================================================================
// FETCH SOURCE DATA
// ============================================================================

async function fetchSourcePosts(): Promise<WPPost[]> {
  console.log('\n📥 Fetching posts from source WordPress...\n');

  try {
    const url = `${CONFIG.source.url}/wp-json/wp/v2/posts?after=${CONFIG.cutoffDate}&status=publish,future&_embed&orderby=date&order=asc`;
    const posts = await fetchAllPages<WPPost>(url, CONFIG.source);
    console.log(`   Found ${posts.length} posts after ${CONFIG.cutoffDate}\n`);
    return posts;
  } catch (error) {
    console.error(`   ❌ Could not fetch posts from source: ${error}`);
    console.error(`\n   The source WordPress (smartagentalliance.com) has MalCare firewall blocking API requests.`);
    console.error(`   Solutions:`);
    console.error(`   1. Whitelist this server's IP in MalCare settings`);
    console.error(`   2. Temporarily disable MalCare firewall`);
    console.error(`   3. Use WordPress Admin export/import instead\n`);
    throw error;
  }
}

async function fetchSourceCategories(): Promise<WPTerm[]> {
  console.log('📥 Fetching categories from source...');

  try {
    const url = `${CONFIG.source.url}/wp-json/wp/v2/categories`;
    const categories = await fetchAllPages<WPTerm>(url, CONFIG.source);
    console.log(`   Found ${categories.length} categories\n`);
    return categories;
  } catch (error) {
    console.log(`   ⚠️  Could not fetch categories (firewall block?), continuing without\n`);
    return [];
  }
}

async function fetchSourceTags(): Promise<WPTerm[]> {
  console.log('📥 Fetching tags from source...');

  try {
    const url = `${CONFIG.source.url}/wp-json/wp/v2/tags`;
    const tags = await fetchAllPages<WPTerm>(url, CONFIG.source);
    console.log(`   Found ${tags.length} tags\n`);
    return tags;
  } catch (error) {
    console.log(`   ⚠️  Could not fetch tags (firewall block?), continuing without tags\n`);
    return [];
  }
}

// ============================================================================
// FETCH DESTINATION DATA
// ============================================================================

async function fetchDestinationCategories(): Promise<WPTerm[]> {
  console.log('📥 Fetching categories from destination...');

  const url = `${CONFIG.destination.url}/wp-json/wp/v2/categories`;
  const categories = await fetchAllPages<WPTerm>(url, CONFIG.destination, true);

  console.log(`   Found ${categories.length} categories\n`);
  return categories;
}

async function fetchDestinationTags(): Promise<WPTerm[]> {
  console.log('📥 Fetching tags from destination...');

  const url = `${CONFIG.destination.url}/wp-json/wp/v2/tags`;
  const tags = await fetchAllPages<WPTerm>(url, CONFIG.destination, true);

  console.log(`   Found ${tags.length} tags\n`);
  return tags;
}

async function fetchDestinationSlugs(): Promise<Set<string>> {
  console.log('📥 Fetching existing post slugs from destination...');

  const url = `${CONFIG.destination.url}/wp-json/wp/v2/posts?status=publish,future,draft&per_page=100`;
  const posts = await fetchAllPages<WPPost>(url, CONFIG.destination, true);

  const slugs = new Set(posts.map(p => p.slug));
  console.log(`   Found ${slugs.size} existing posts\n`);

  return slugs;
}

// Fetch destination posts as a map of slug -> post for update mode
async function fetchDestinationPosts(): Promise<Map<string, WPPost>> {
  console.log('📥 Fetching existing posts from destination for update mode...');

  const url = `${CONFIG.destination.url}/wp-json/wp/v2/posts?status=publish,future,draft&per_page=100`;
  const posts = await fetchAllPages<WPPost>(url, CONFIG.destination, true);

  const postMap = new Map(posts.map(p => [p.slug, p]));
  console.log(`   Found ${postMap.size} existing posts\n`);

  return postMap;
}

// ============================================================================
// BUILD TAXONOMY MAPPINGS
// ============================================================================

interface TaxonomyMapping {
  categories: Map<number, number>; // source ID -> dest ID
  tags: Map<number, number>;       // source ID -> dest ID
}

// Category slug remapping: source slug -> destination slug
// These handle cases where the source and destination use different slugs
const CATEGORY_SLUG_REMAP: Record<string, string> = {
  'career': 'agent-career-info',
  'clients': 'winning-clients',
  'entertainment': 'fun-for-agents',
  'exp-realty-sponsor-team': 'exp-realty-sponsor',
  'marketing': 'marketing-mastery',
  'trends': 'industry-trends',
  // 'global-locations' has 0 posts, ignore it
};

async function buildTaxonomyMappings(): Promise<TaxonomyMapping> {
  console.log('🔗 Building taxonomy mappings (by slug)...\n');

  const [srcCats, srcTags, destCats, destTags] = await Promise.all([
    fetchSourceCategories(),
    fetchSourceTags(),
    fetchDestinationCategories(),
    fetchDestinationTags(),
  ]);

  // Build slug -> ID maps for destination
  const destCatsBySlug = new Map(destCats.map(c => [c.slug, c.id]));
  const destTagsBySlug = new Map(destTags.map(t => [t.slug, t.id]));

  // Map source IDs to destination IDs by matching slugs
  const categoryMapping = new Map<number, number>();
  const tagMapping = new Map<number, number>();

  for (const cat of srcCats) {
    // Check if we have a slug remap for this category
    const remappedSlug = CATEGORY_SLUG_REMAP[cat.slug];
    const lookupSlug = remappedSlug || cat.slug;

    const destId = destCatsBySlug.get(lookupSlug);
    if (destId) {
      categoryMapping.set(cat.id, destId);
      if (remappedSlug) {
        console.log(`   Category: ${cat.slug} → ${remappedSlug} (${cat.id} → ${destId}) [remapped]`);
      } else {
        console.log(`   Category: ${cat.slug} (${cat.id} → ${destId})`);
      }
    } else {
      console.log(`   Category: ${cat.slug} (${cat.id} → NOT FOUND, will skip)`);
    }
  }

  for (const tag of srcTags) {
    const destId = destTagsBySlug.get(tag.slug);
    if (destId) {
      tagMapping.set(tag.id, destId);
      console.log(`   Tag: ${tag.slug} (${tag.id} → ${destId})`);
    } else {
      console.log(`   Tag: ${tag.slug} (${tag.id} → NOT FOUND, will skip)`);
    }
  }

  console.log(`\n   Mapped ${categoryMapping.size}/${srcCats.length} categories`);
  console.log(`   Mapped ${tagMapping.size}/${srcTags.length} tags\n`);

  return { categories: categoryMapping, tags: tagMapping };
}

// ============================================================================
// MIGRATE MEDIA
// ============================================================================

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadMediaToDestination(
  imageUrl: string,
  title: string,
  altText: string
): Promise<number | null> {
  console.log(`   📤 Uploading: ${imageUrl.split('/').pop()}`);

  if (CONFIG.dryRun) {
    console.log(`      [DRY RUN] Would upload to destination`);
    return null;
  }

  try {
    // Download the image
    const imageBuffer = await downloadImage(imageUrl);
    const filename = imageUrl.split('/').pop() || 'image.jpg';

    // Use localUploadMedia for proper SNI and multipart handling
    const authHeader = getBasicAuthHeader(CONFIG.destination.user, CONFIG.destination.appPassword);
    const response = await localUploadMedia(imageBuffer, filename, title, altText, authHeader);

    if (!response.ok) {
      const error = await response.text();
      console.log(`      ❌ Upload failed: ${response.status} - ${error}`);
      return null;
    }

    const media: WPMedia = await response.json();
    console.log(`      ✅ Uploaded as media ID: ${media.id}`);
    return media.id;

  } catch (error) {
    console.log(`      ❌ Error: ${error}`);
    return null;
  }
}

// Upload an embedded image and return the new URL
async function uploadEmbeddedImage(
  imageUrl: string,
  urlMapping: Map<string, string>
): Promise<string | null> {
  // Check if we've already uploaded this image
  if (urlMapping.has(imageUrl)) {
    return urlMapping.get(imageUrl)!;
  }

  if (CONFIG.dryRun) {
    return null;
  }

  try {
    // Download the image
    const imageBuffer = await downloadImage(imageUrl);
    const filename = imageUrl.split('/').pop() || 'image.jpg';

    // Use localUploadMedia for proper SNI and multipart handling
    const authHeader = getBasicAuthHeader(CONFIG.destination.user, CONFIG.destination.appPassword);
    const response = await localUploadMedia(imageBuffer, filename, filename, '', authHeader);

    if (!response.ok) {
      console.log(`      ❌ Embedded image upload failed: ${response.status}`);
      return null;
    }

    const media: WPMedia = await response.json();
    const newUrl = media.source_url;
    urlMapping.set(imageUrl, newUrl);
    return newUrl;

  } catch (error) {
    console.log(`      ❌ Embedded image error: ${error}`);
    return null;
  }
}

// Extract all image URLs from HTML content
function extractImageUrls(content: string): string[] {
  const urls: string[] = [];

  // Match src attributes in img tags
  const imgSrcRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgSrcRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  // Match srcset attributes (multiple URLs)
  const srcsetRegex = /srcset=["']([^"']+)["']/gi;
  while ((match = srcsetRegex.exec(content)) !== null) {
    const srcsetUrls = match[1].split(',').map(s => s.trim().split(' ')[0]);
    urls.push(...srcsetUrls);
  }

  // Match URLs in data-src (lazy loading)
  const dataSrcRegex = /data-src=["']([^"']+)["']/gi;
  while ((match = dataSrcRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  // Filter to only include smartagentalliance.com images
  return [...new Set(urls)].filter(url =>
    url.includes('smartagentalliance.com') &&
    (url.includes('/wp-content/uploads/') || url.includes('/wp-content/'))
  );
}

// Replace image URLs in content with new URLs
function replaceImageUrls(content: string, urlMapping: Map<string, string>): string {
  let newContent = content;

  for (const [oldUrl, newUrl] of urlMapping) {
    // Replace all occurrences (in src, srcset, data-src, etc.)
    newContent = newContent.split(oldUrl).join(newUrl);
  }

  return newContent;
}

// Process embedded images in post content
async function processEmbeddedImages(
  content: string,
  urlMapping: Map<string, string>,
  stats: MigrationStats
): Promise<string> {
  const imageUrls = extractImageUrls(content);

  if (imageUrls.length === 0) {
    return content;
  }

  console.log(`   🖼️  Found ${imageUrls.length} embedded images to migrate`);

  for (const imageUrl of imageUrls) {
    // Skip if already mapped
    if (urlMapping.has(imageUrl)) {
      continue;
    }

    stats.embeddedImagesFound = (stats.embeddedImagesFound || 0) + 1;

    const newUrl = await uploadEmbeddedImage(imageUrl, urlMapping);
    if (newUrl) {
      stats.embeddedImagesMigrated = (stats.embeddedImagesMigrated || 0) + 1;
      console.log(`      ✅ ${imageUrl.split('/').pop()} → uploaded`);
    } else {
      stats.embeddedImagesFailed = stats.embeddedImagesFailed || [];
      stats.embeddedImagesFailed.push(imageUrl);
      console.log(`      ❌ ${imageUrl.split('/').pop()} → failed`);
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return replaceImageUrls(content, urlMapping);
}

// ============================================================================
// MIGRATE POSTS
// ============================================================================

async function migratePost(
  post: WPPost,
  taxonomyMapping: TaxonomyMapping,
  existingPosts: Map<string, WPPost>,
  mediaMapping: Map<number, number>,
  embeddedUrlMapping: Map<string, string>,
  stats: MigrationStats
): Promise<void> {
  const title = post.title.rendered;
  console.log(`\n📄 Processing: "${title}"`);
  console.log(`   Slug: ${post.slug}`);
  console.log(`   Date: ${post.date}`);
  console.log(`   Status: ${post.status}`);

  // Check if already exists
  const existingPost = existingPosts.get(post.slug);
  if (existingPost && !isUpdateMode) {
    console.log(`   ⏭️  SKIPPED: Slug already exists in destination (use --update to process embedded images)`);
    stats.postsSkipped++;
    return;
  }

  if (existingPost && isUpdateMode) {
    console.log(`   🔄 UPDATE MODE: Will process embedded images and update post ID ${existingPost.id}`);
  }

  // Map categories (skip unmapped ones)
  const destCategories = post.categories
    .map(id => taxonomyMapping.categories.get(id))
    .filter((id): id is number => id !== undefined);

  console.log(`   Categories: ${post.categories.length} source → ${destCategories.length} mapped`);

  // Map tags (skip unmapped ones)
  const destTags = post.tags
    .map(id => taxonomyMapping.tags.get(id))
    .filter((id): id is number => id !== undefined);

  console.log(`   Tags: ${post.tags.length} source → ${destTags.length} mapped`);

  // Handle featured image
  let destFeaturedMedia = 0;
  if (post.featured_media && post._embedded?.['wp:featuredmedia']?.[0]) {
    const featuredImage = post._embedded['wp:featuredmedia'][0];
    console.log(`   Featured image: ${featuredImage.source_url.split('/').pop()}`);

    // Check if we've already uploaded this image
    if (mediaMapping.has(post.featured_media)) {
      destFeaturedMedia = mediaMapping.get(post.featured_media)!;
      console.log(`      Already uploaded as: ${destFeaturedMedia}`);
    } else {
      // Upload the featured image
      stats.mediaFound++;
      const mediaId = await uploadMediaToDestination(
        featuredImage.source_url,
        featuredImage.title.rendered,
        featuredImage.alt_text || ''
      );

      if (mediaId) {
        destFeaturedMedia = mediaId;
        mediaMapping.set(post.featured_media, mediaId);
        stats.mediaMigrated++;
      } else {
        stats.mediaFailed.push(featuredImage.source_url);
      }
    }
  }

  if (CONFIG.dryRun) {
    const imageUrls = extractImageUrls(post.content.rendered);
    console.log(`   [DRY RUN] Would ${existingPost ? 'update' : 'create'} post with:`);
    console.log(`      - Categories: [${destCategories.join(', ')}]`);
    console.log(`      - Tags: [${destTags.join(', ')}]`);
    console.log(`      - Featured Media: ${destFeaturedMedia || 'none'}`);
    console.log(`      - Embedded images to process: ${imageUrls.length}`);
    stats.postsMigrated++;
    return;
  }

  // Create or update the post in destination
  try {
    // Debug: check what content we have
    if (!post.title?.rendered || !post.content?.rendered) {
      console.log(`   ⚠️  Missing content from source!`);
      console.log(`      title.rendered: ${post.title?.rendered ? 'present' : 'MISSING'}`);
      console.log(`      content.rendered: ${post.content?.rendered ? `${post.content.rendered.substring(0, 50)}...` : 'MISSING'}`);
      console.log(`      excerpt.rendered: ${post.excerpt?.rendered ? 'present' : 'MISSING'}`);
    }

    // Process embedded images in content
    const processedContent = await processEmbeddedImages(
      post.content.rendered,
      embeddedUrlMapping,
      stats
    );

    if (existingPost && isUpdateMode) {
      // Update mode: only update the content with processed embedded images
      const updateData = {
        content: processedContent,
      };

      const response = await fetchWithAuth(
        `${CONFIG.destination.url}/wp-json/wp/v2/posts/${existingPost.id}`,
        CONFIG.destination,
        {
          method: 'POST', // WordPress REST API uses POST for updates too
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        },
        true // isDestination - bypass Cloudflare
      );

      if (!response.ok) {
        const error = await response.text();
        console.log(`   ❌ UPDATE FAILED: ${response.status} - ${error}`);
        stats.postsFailed.push(`${post.slug}: ${response.status}`);
        return;
      }

      const updatedPost: WPPost = await response.json();
      console.log(`   ✅ UPDATED: Post ID ${updatedPost.id} (embedded images processed)`);
      stats.postsMigrated++;
      return;
    }

    // Create new post
    const postData = {
      title: post.title.rendered,
      content: processedContent,
      excerpt: post.excerpt.rendered,
      slug: post.slug,
      status: post.status,
      date: post.date,
      date_gmt: post.date_gmt,
      categories: destCategories.length > 0 ? destCategories : undefined,
      tags: destTags.length > 0 ? destTags : undefined,
      featured_media: destFeaturedMedia || undefined,
      meta: post.meta || {},
    };

    const response = await fetchWithAuth(
      `${CONFIG.destination.url}/wp-json/wp/v2/posts`,
      CONFIG.destination,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      },
      true // isDestination - bypass Cloudflare
    );

    if (!response.ok) {
      const error = await response.text();
      console.log(`   ❌ FAILED: ${response.status} - ${error}`);
      stats.postsFailed.push(`${post.slug}: ${response.status}`);
      return;
    }

    const createdPost: WPPost = await response.json();
    console.log(`   ✅ CREATED: Post ID ${createdPost.id}`);
    stats.postsMigrated++;
    existingPosts.set(post.slug, createdPost); // Add to map to prevent duplicates in same run

  } catch (error) {
    console.log(`   ❌ ERROR: ${error}`);
    stats.postsFailed.push(`${post.slug}: ${error}`);
  }
}

// ============================================================================
// MAIN MIGRATION FUNCTION
// ============================================================================

async function migrate(): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('   WORDPRESS CONTENT MIGRATION');
  console.log('   ' + (CONFIG.dryRun ? '🔍 DRY RUN MODE - No changes will be made' : '🚀 LIVE MODE'));
  console.log('='.repeat(70));

  console.log(`\n📋 Configuration:`);
  console.log(`   Source:      ${CONFIG.source.url}`);
  console.log(`   Destination: ${CONFIG.destination.url}`);
  console.log(`   Cutoff Date: ${CONFIG.cutoffDate}`);
  console.log(`   Dry Run:     ${CONFIG.dryRun}`);
  console.log(`   Update Mode: ${isUpdateMode}`);

  // Validate credentials
  if (!CONFIG.destination.appPassword) {
    console.error('\n❌ ERROR: Destination WordPress app password not configured');
    console.error('   Set WORDPRESS_APP_PASSWORD in .env.local');
    process.exit(1);
  }

  const stats: MigrationStats = {
    postsFound: 0,
    postsMigrated: 0,
    postsSkipped: 0,
    postsFailed: [],
    mediaFound: 0,
    mediaMigrated: 0,
    mediaSkipped: 0,
    mediaFailed: [],
  };

  try {
    // Step 1: Build taxonomy mappings
    const taxonomyMapping = await buildTaxonomyMappings();

    // Step 2: Get existing destination posts (for update mode we need IDs)
    const existingPosts = await fetchDestinationPosts();

    // Step 3: Fetch source posts
    const posts = await fetchSourcePosts();
    stats.postsFound = posts.length;

    if (posts.length === 0) {
      console.log('\n✅ No posts to migrate. All done!');
      return;
    }

    // Display posts to be migrated
    console.log('📝 Posts to migrate:');
    for (const post of posts) {
      const exists = existingPosts.has(post.slug);
      const marker = exists ? (isUpdateMode ? '🔄' : '⏭️ ') : '→';
      console.log(`   ${marker} [${post.status}] ${post.title.rendered} (${post.slug})`);
    }

    // Step 4: Migrate each post
    console.log('\n' + '='.repeat(70));
    console.log('   MIGRATING POSTS');
    console.log('='.repeat(70));

    const mediaMapping = new Map<number, number>();
    const embeddedUrlMapping = new Map<string, string>();

    for (const post of posts) {
      await migratePost(post, taxonomyMapping, existingPosts, mediaMapping, embeddedUrlMapping, stats);

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('   MIGRATION SUMMARY');
    console.log('='.repeat(70));
    console.log(`\n📊 Posts:`);
    console.log(`   Found:    ${stats.postsFound}`);
    console.log(`   Migrated: ${stats.postsMigrated}`);
    console.log(`   Skipped:  ${stats.postsSkipped} (already exist)`);
    console.log(`   Failed:   ${stats.postsFailed.length}`);

    if (stats.postsFailed.length > 0) {
      console.log(`\n   Failed posts:`);
      stats.postsFailed.forEach(f => console.log(`      - ${f}`));
    }

    console.log(`\n📸 Featured Images:`);
    console.log(`   Found:    ${stats.mediaFound}`);
    console.log(`   Uploaded: ${stats.mediaMigrated}`);
    console.log(`   Failed:   ${stats.mediaFailed.length}`);

    if (stats.mediaFailed.length > 0) {
      console.log(`\n   Failed media:`);
      stats.mediaFailed.forEach(f => console.log(`      - ${f}`));
    }

    console.log(`\n🖼️  Embedded Images:`);
    console.log(`   Found:    ${stats.embeddedImagesFound || 0}`);
    console.log(`   Uploaded: ${stats.embeddedImagesMigrated || 0}`);
    console.log(`   Failed:   ${stats.embeddedImagesFailed?.length || 0}`);

    if (stats.embeddedImagesFailed && stats.embeddedImagesFailed.length > 0) {
      console.log(`\n   Failed embedded images:`);
      stats.embeddedImagesFailed.forEach(f => console.log(`      - ${f}`));
    }

    console.log('\n' + '='.repeat(70));
    if (CONFIG.dryRun) {
      console.log('   DRY RUN COMPLETE - No changes were made');
      console.log('   Run without --dry-run to perform actual migration');
    } else {
      console.log('   ✅ MIGRATION COMPLETE');
      console.log('   Next steps:');
      console.log('   1. Verify posts in wp.saabuildingblocks.com/wp-admin');
      console.log('   2. Run: npm run build');
      console.log('   3. Push to deploy');
    }
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
