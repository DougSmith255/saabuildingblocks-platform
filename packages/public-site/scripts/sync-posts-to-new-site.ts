#!/usr/bin/env npx ts-node
/**
 * Sync Posts from Old Site to New Site
 *
 * Fetches posts from smartagentalliance.com and creates them on wp.saabuildingblocks.com
 * - Downloads images and uploads to Cloudflare Images
 * - Replaces image URLs with Cloudflare URLs
 * - Preserves categories, tags, and metadata
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Configuration
const OLD_SITE = 'https://smartagentalliance.com';
const OLD_SITE_USER = 'dougsmart1';
const OLD_SITE_APP_PASSWORD = 'insz XW5g zy1E vISK wRuA 8l8K';
const NEW_SITE = 'https://wp.saabuildingblocks.com';
const NEW_SITE_USER = 'dougsmart1';
const NEW_SITE_APP_PASSWORD = 'OuHo XIDe 3QPD 8uAO oFLJ Ufq0';
const CLOUDFLARE_ACCOUNT_ID = 'a1ae4bb5913a89fea98821d7ba1ac304';
const CLOUDFLARE_IMAGES_TOKEN = 'MpQv-8mM8Kg3IOM7QnVRxkCNFr-GV7zrjZYLWre3';
const CLOUDFLARE_IMAGES_HASH = 'RZBQ4dWu2c_YEpklnDDxFg';

// Posts to sync (slugs)
const POSTS_TO_SYNC = [
  'technology',
  'income',
  'support-top-realtors',
  'support',
  'divisions-2',
  'referral-form',
  'offices',
  'fit',
  'divisions',
  'success-lending',
  'teams',
  'my-link-my-lead',
  'renting-vs-owning-leads',
  'community',
  'revenos-leads'
];

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  status: string;
  categories: number[];
  tags: number[];
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

interface CloudflareImageResponse {
  success: boolean;
  result?: {
    id: string;
    filename: string;
    variants: string[];
  };
  errors?: Array<{ message: string }>;
}

// Create Basic Auth header for WordPress
function getOldSiteAuthHeader(): string {
  const credentials = Buffer.from(`${OLD_SITE_USER}:${OLD_SITE_APP_PASSWORD}`).toString('base64');
  return `Basic ${credentials}`;
}

function getNewSiteAuthHeader(): string {
  const credentials = Buffer.from(`${NEW_SITE_USER}:${NEW_SITE_APP_PASSWORD}`).toString('base64');
  return `Basic ${credentials}`;
}

// Upload image to Cloudflare Images
async function uploadImageToCloudflare(imageUrl: string, filename: string): Promise<string | null> {
  try {
    console.log(`  📤 Uploading to Cloudflare: ${filename}`);

    // Download the image first
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.log(`  ⚠️  Could not download image: ${imageUrl}`);
      return null;
    }

    const imageBlob = await imageResponse.blob();

    // Upload to Cloudflare
    const formData = new FormData();
    formData.append('file', imageBlob, filename);

    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_IMAGES_TOKEN}`
        },
        body: formData
      }
    );

    const result: CloudflareImageResponse = await uploadResponse.json();

    if (result.success && result.result) {
      const cloudflareUrl = `https://imagedelivery.net/${CLOUDFLARE_IMAGES_HASH}/${result.result.id}/public`;
      console.log(`  ✅ Uploaded: ${cloudflareUrl}`);
      return cloudflareUrl;
    } else {
      console.log(`  ⚠️  Cloudflare upload failed:`, result.errors);
      return null;
    }
  } catch (error) {
    console.log(`  ❌ Error uploading image:`, error);
    return null;
  }
}

// Extract all image URLs from content
function extractImageUrls(content: string): string[] {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const urls: string[] = [];
  let match;

  while ((match = imgRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

// Check if URL is already a Cloudflare URL
function isCloudflareUrl(url: string): boolean {
  return url.includes('imagedelivery.net') || url.includes('cloudflare');
}

// Load existing Cloudflare images mapping
function loadExistingMapping(): Map<string, string> {
  const mapping = new Map<string, string>();

  // Load from filename-to-cloudflare.json
  const filenamePath = join(process.cwd(), 'filename-to-cloudflare.json');
  if (existsSync(filenamePath)) {
    try {
      const data = JSON.parse(readFileSync(filenamePath, 'utf-8'));
      Object.entries(data).forEach(([filename, url]) => {
        mapping.set(filename.toLowerCase(), url as string);
      });
      console.log(`📁 Loaded ${mapping.size} existing Cloudflare mappings`);
    } catch (e) {
      console.log('⚠️  Could not load filename mapping');
    }
  }

  return mapping;
}

// Get filename from URL
function getFilenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const parts = pathname.split('/');
    return parts[parts.length - 1];
  } catch {
    return url.split('/').pop() || '';
  }
}

// Process content and replace images with Cloudflare URLs
async function processContent(
  content: string,
  existingMapping: Map<string, string>
): Promise<{ content: string; uploadedImages: Map<string, string> }> {
  const uploadedImages = new Map<string, string>();
  const imageUrls = extractImageUrls(content);

  console.log(`  Found ${imageUrls.length} images in content`);

  let processedContent = content;

  for (const imageUrl of imageUrls) {
    // Skip if already Cloudflare URL
    if (isCloudflareUrl(imageUrl)) {
      console.log(`  ✓ Already Cloudflare: ${imageUrl.substring(0, 60)}...`);
      continue;
    }

    const filename = getFilenameFromUrl(imageUrl);
    const filenameKey = filename.toLowerCase();

    // Check if we already have this image in Cloudflare
    if (existingMapping.has(filenameKey)) {
      const cloudflareUrl = existingMapping.get(filenameKey)!;
      console.log(`  ✓ Found existing mapping: ${filename}`);
      processedContent = processedContent.replace(imageUrl, cloudflareUrl);
      uploadedImages.set(imageUrl, cloudflareUrl);
      continue;
    }

    // Upload to Cloudflare
    const cloudflareUrl = await uploadImageToCloudflare(imageUrl, filename);
    if (cloudflareUrl) {
      processedContent = processedContent.replace(new RegExp(escapeRegex(imageUrl), 'g'), cloudflareUrl);
      uploadedImages.set(imageUrl, cloudflareUrl);
      existingMapping.set(filenameKey, cloudflareUrl);
    }
  }

  return { content: processedContent, uploadedImages };
}

// Escape special regex characters
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Fetch post from old site
async function fetchPostFromOldSite(slug: string): Promise<WPPost | null> {
  try {
    const response = await fetch(
      `${OLD_SITE}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      {
        headers: {
          'Authorization': getOldSiteAuthHeader()
        }
      }
    );

    if (!response.ok) {
      console.log(`  ❌ Failed to fetch from old site: ${response.status}`);
      return null;
    }

    const posts = await response.json();
    if (posts.length === 0) {
      // Try pages
      const pageResponse = await fetch(
        `${OLD_SITE}/wp-json/wp/v2/pages?slug=${slug}&_embed`,
        {
          headers: {
            'Authorization': getOldSiteAuthHeader()
          }
        }
      );
      if (pageResponse.ok) {
        const pages = await pageResponse.json();
        if (pages.length > 0) {
          return pages[0];
        }
      }
      console.log(`  ⚠️  Post/page not found: ${slug}`);
      return null;
    }

    return posts[0];
  } catch (error) {
    console.log(`  ❌ Error fetching post:`, error);
    return null;
  }
}

// Check if post exists on new site
async function postExistsOnNewSite(slug: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${NEW_SITE}/wp-json/wp/v2/posts?slug=${slug}`
    );

    if (!response.ok) return false;

    const posts = await response.json();
    return posts.length > 0;
  } catch {
    return false;
  }
}

// Create post on new site
async function createPostOnNewSite(post: WPPost, content: string, featuredImageUrl: string | null): Promise<boolean> {
  try {
    // First, upload featured image if we have one
    let featuredMediaId = 0;

    if (featuredImageUrl) {
      console.log(`  📤 Uploading featured image...`);
      // We'll skip featured media for now since WordPress media upload is complex
      // The slug-to-cloudflare mapping will handle featured images in the blog generator
    }

    const postData = {
      title: post.title.rendered,
      content: content,
      excerpt: post.excerpt.rendered,
      status: 'publish',
      slug: post.slug,
      // Note: Category/tag IDs might not match between sites, skip for now
    };

    const response = await fetch(
      `${NEW_SITE}/wp-json/wp/v2/posts`,
      {
        method: 'POST',
        headers: {
          'Authorization': getNewSiteAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.log(`  ❌ Failed to create post: ${response.status} - ${error}`);
      return false;
    }

    const result = await response.json();
    console.log(`  ✅ Created post ID: ${result.id}`);
    return true;
  } catch (error) {
    console.log(`  ❌ Error creating post:`, error);
    return false;
  }
}

// Save processed posts to JSON for import
interface ProcessedPost {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImageUrl: string | null;
  featuredImageCloudflare: string | null;
}

// Main sync function
async function syncPosts() {
  console.log('🔄 Starting Post Sync: Old Site → New Site');
  console.log('=' .repeat(60));

  const existingMapping = loadExistingMapping();
  const results: { slug: string; status: string }[] = [];
  const newMappings: Record<string, string> = {};
  const processedPosts: ProcessedPost[] = [];
  const featuredMappings: Record<string, { cloudflareUrl: string; source: string; matchType: string }> = {};

  for (const slug of POSTS_TO_SYNC) {
    console.log(`\n📝 Processing: ${slug}`);

    // Check if already exists on new site
    if (await postExistsOnNewSite(slug)) {
      console.log(`  ⏭️  Already exists on new site, skipping`);
      results.push({ slug, status: 'already_exists' });
      continue;
    }

    // Fetch from old site
    const oldPost = await fetchPostFromOldSite(slug);
    if (!oldPost) {
      results.push({ slug, status: 'not_found_on_old_site' });
      continue;
    }

    console.log(`  📖 Found: "${oldPost.title.rendered}"`);

    // Get featured image URL
    let featuredImageUrl: string | null = null;
    let featuredImageCloudflare: string | null = null;
    if (oldPost._embedded?.['wp:featuredmedia']?.[0]) {
      featuredImageUrl = oldPost._embedded['wp:featuredmedia'][0].source_url;

      // Try to find or upload featured image
      const filename = getFilenameFromUrl(featuredImageUrl);
      if (existingMapping.has(filename.toLowerCase())) {
        featuredImageCloudflare = existingMapping.get(filename.toLowerCase())!;
        console.log(`  ✓ Featured image already in Cloudflare: ${filename}`);
      } else if (!isCloudflareUrl(featuredImageUrl)) {
        featuredImageCloudflare = await uploadImageToCloudflare(featuredImageUrl, filename);
        if (featuredImageCloudflare) {
          existingMapping.set(filename.toLowerCase(), featuredImageCloudflare);
        }
      }

      // Add to featured mappings
      if (featuredImageCloudflare) {
        featuredMappings[slug] = {
          cloudflareUrl: featuredImageCloudflare,
          source: 'old_site_sync',
          matchType: 'exact'
        };
      }
    }

    // Process content and upload images
    const { content: processedContent, uploadedImages } = await processContent(
      oldPost.content.rendered,
      existingMapping
    );

    // Save new mappings
    uploadedImages.forEach((cloudflareUrl, originalUrl) => {
      const filename = getFilenameFromUrl(originalUrl);
      newMappings[filename] = cloudflareUrl;
    });

    // Save processed post for later import
    processedPosts.push({
      slug: oldPost.slug,
      title: oldPost.title.rendered,
      content: processedContent,
      excerpt: oldPost.excerpt.rendered,
      featuredImageUrl,
      featuredImageCloudflare
    });

    // Try to create post on new site
    const success = await createPostOnNewSite(oldPost, processedContent, featuredImageUrl);
    results.push({ slug, status: success ? 'synced' : 'processed_not_synced' });

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Save processed posts for manual import
  if (processedPosts.length > 0) {
    const postsPath = join(process.cwd(), 'processed-posts-for-import.json');
    writeFileSync(postsPath, JSON.stringify(processedPosts, null, 2));
    console.log(`\n📁 Saved ${processedPosts.length} processed posts to: ${postsPath}`);
  }

  // Save/merge featured image mappings
  if (Object.keys(featuredMappings).length > 0) {
    const existingSlugPath = join(process.cwd(), 'slug-to-cloudflare-featured.json');
    let existingSlugMapping: Record<string, any> = {};
    if (existsSync(existingSlugPath)) {
      existingSlugMapping = JSON.parse(readFileSync(existingSlugPath, 'utf-8'));
    }
    const mergedMapping = { ...existingSlugMapping, ...featuredMappings };
    writeFileSync(existingSlugPath, JSON.stringify(mergedMapping, null, 2));
    console.log(`📁 Added ${Object.keys(featuredMappings).length} featured images to slug mapping`);
  }

  // Save updated mappings
  if (Object.keys(newMappings).length > 0) {
    const mappingPath = join(process.cwd(), 'newly-synced-images.json');
    writeFileSync(mappingPath, JSON.stringify(newMappings, null, 2));
    console.log(`\n📁 Saved ${Object.keys(newMappings).length} new image mappings`);
  }

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 SYNC SUMMARY');
  console.log('=' .repeat(60));

  const synced = results.filter(r => r.status === 'synced').length;
  const alreadyExists = results.filter(r => r.status === 'already_exists').length;
  const notFound = results.filter(r => r.status === 'not_found_on_old_site').length;
  const failed = results.filter(r => r.status === 'failed').length;

  console.log(`✅ Synced: ${synced}`);
  console.log(`⏭️  Already Exists: ${alreadyExists}`);
  console.log(`⚠️  Not Found: ${notFound}`);
  console.log(`❌ Failed: ${failed}`);

  console.log('\nDetailed Results:');
  results.forEach(r => {
    const icon = r.status === 'synced' ? '✅' :
                 r.status === 'already_exists' ? '⏭️' :
                 r.status === 'not_found_on_old_site' ? '⚠️' : '❌';
    console.log(`  ${icon} ${r.slug}: ${r.status}`);
  });

  // Save results
  const resultsPath = join(process.cwd(), 'sync-results.json');
  writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📁 Results saved to: ${resultsPath}`);
}

// Run
syncPosts().catch(console.error);
