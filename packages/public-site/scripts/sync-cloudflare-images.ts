#!/usr/bin/env tsx
/**
 * Cloudflare Images Sync Script
 *
 * WHAT THIS DOES:
 * 1. Scans all built pages for image URLs (WordPress-hosted images)
 * 2. Uploads ONLY used images to Cloudflare Images (via API)
 * 3. Creates a mapping file (WordPress URL → Cloudflare URL)
 * 4. Generates _redirects file for legacy URL support
 *
 * USAGE:
 * - Run during build: npm run build && npm run sync-images
 * - Environment variables required:
 *   - CLOUDFLARE_ACCOUNT_ID
 *   - CLOUDFLARE_API_TOKEN (with Images Write permission)
 *
 * GLOBAL DOMINANCE MODE: ✅ ACTIVATED
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') });

// ============================================
// CONFIGURATION
// ============================================

interface ImageMapping {
  wordpressUrl: string;
  cloudflareId: string;
  cloudflareUrl: string;
  hash: string;
  uploadedAt: string;
  size: number;
}

interface CloudflareImageResponse {
  result: {
    id: string;
    filename: string;
    uploaded: string;
    requireSignedURLs: boolean;
    variants: string[];
  };
  success: boolean;
  errors: any[];
  messages: any[];
}

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_IMAGES_HASH = process.env.CLOUDFLARE_IMAGES_HASH; // Account hash for delivery URLs

const OUT_DIR = path.join(process.cwd(), 'out');
const MAPPING_FILE = path.join(process.cwd(), 'cloudflare-images-mapping.json');
const REDIRECTS_FILE = path.join(OUT_DIR, '_redirects');

// ============================================
// STEP 1: FIND ALL IMAGES USED IN BUILT PAGES
// ============================================

async function findUsedImages(): Promise<Set<string>> {
  console.log('🔍 Scanning built pages for WordPress images...\n');

  const imageUrls = new Set<string>();
  const htmlFiles: string[] = [];
  const jsonFiles: string[] = [];

  // Recursively find all HTML and JSON files
  async function walkDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walkDir(fullPath);
      } else if (entry.name.endsWith('.html')) {
        htmlFiles.push(fullPath);
      } else if (entry.name.endsWith('.json') && entry.name.startsWith('blog-posts-chunk-')) {
        jsonFiles.push(fullPath);
      }
    }
  }

  await walkDir(OUT_DIR);
  console.log(`  ✅ Found ${htmlFiles.length} HTML files`);
  console.log(`  ✅ Found ${jsonFiles.length} blog post JSON files\n`);

  // Extract WordPress image URLs from HTML
  const wpDomains = [
    'wp.saabuildingblocks.com',
    'saabuildingblocks.com/wp-content',
    'smartagentalliance.com/wp-content', // Future migration
  ];

  for (const file of htmlFiles) {
    const content = await fs.readFile(file, 'utf-8');

    // Match image URLs in src, srcset, data-src, href attributes
    const imgRegex = /(src|srcset|data-src|href)=["']([^"']+)["']/gi;
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
      const url = match[2];

      // Check if it's a WordPress image
      if (wpDomains.some(domain => url.includes(domain)) &&
          /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url)) {
        // Normalize URL (remove query params, ensure https)
        const cleanUrl = url.split('?')[0].replace(/^http:/, 'https:');
        imageUrls.add(cleanUrl);
      }
    }

    // ALSO match CSS background-image URLs (style="background-image:url(...)")
    // This catches hero images and other images loaded via inline CSS
    const cssRegex = /background(?:-image)?:\s*url\((['"]?)([^'"()]+)\1\)/gi;
    let cssMatch;

    while ((cssMatch = cssRegex.exec(content)) !== null) {
      const url = cssMatch[2];

      // Check if it's a WordPress image
      if (wpDomains.some(domain => url.includes(domain)) &&
          /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url)) {
        // Normalize URL (remove query params, ensure https)
        const cleanUrl = url.split('?')[0].replace(/^http:/, 'https:');
        imageUrls.add(cleanUrl);
      }
    }
  }

  // Extract WordPress image URLs from blog post JSON files
  for (const file of jsonFiles) {
    const content = await fs.readFile(file, 'utf-8');
    const blogPosts = JSON.parse(content);

    // Iterate through blog posts and extract featured image URLs
    for (const post of blogPosts) {
      if (post.featuredImage && post.featuredImage.url) {
        const url = post.featuredImage.url;

        // Check if it's a WordPress image
        if (wpDomains.some(domain => url.includes(domain)) &&
            /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url)) {
          // Normalize URL (remove query params, ensure https)
          const cleanUrl = url.split('?')[0].replace(/^http:/, 'https:');
          imageUrls.add(cleanUrl);
        }
      }
    }
  }

  console.log(`  ✅ Found ${imageUrls.size} unique WordPress images in use\n`);

  // Log images found
  Array.from(imageUrls).forEach((url, i) => {
    console.log(`    ${i + 1}. ${url.split('/').pop()}`);
  });
  console.log();

  return imageUrls;
}

// ============================================
// STEP 2: LOAD EXISTING MAPPING (AVOID RE-UPLOADS)
// ============================================

async function loadExistingMapping(): Promise<Map<string, ImageMapping>> {
  try {
    const content = await fs.readFile(MAPPING_FILE, 'utf-8');
    const data: ImageMapping[] = JSON.parse(content);
    const map = new Map<string, ImageMapping>();

    data.forEach(item => {
      map.set(item.wordpressUrl, item);
    });

    console.log(`  ✅ Loaded ${map.size} existing image mappings\n`);
    return map;
  } catch (error) {
    console.log('  ℹ️  No existing mapping file found (will create new)\n');
    return new Map();
  }
}

// ============================================
// STEP 3: UPLOAD IMAGE TO CLOUDFLARE
// ============================================

async function uploadToCloudflare(
  imageUrl: string,
  existingMapping?: ImageMapping
): Promise<ImageMapping> {

  // Generate stable ID from URL
  const hash = crypto
    .createHash('md5')
    .update(imageUrl)
    .digest('hex')
    .substring(0, 16);

  const filename = imageUrl.split('/').pop() || 'unknown';
  const imageId = `${hash}-${filename.replace(/[^a-zA-Z0-9.-]/g, '-')}`;

  // Check if already uploaded (by hash)
  if (existingMapping && existingMapping.hash === hash) {
    console.log(`  ⏭️  Already uploaded: ${filename}`);
    return existingMapping;
  }

  console.log(`  📤 Uploading: ${filename}`);

  try {
    const formData = new FormData();
    formData.append('url', imageUrl);
    formData.append('id', imageId);
    formData.append('requireSignedURLs', 'false');

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      const errorData = JSON.parse(errorText);

      // Handle 409: Image already exists - fetch existing image info
      if (response.status === 409) {
        console.log(`    ⏭️  Image already exists in Cloudflare, fetching info...`);

        // Fetch existing image details by ID
        const getResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            },
          }
        );

        if (getResponse.ok) {
          const getData: CloudflareImageResponse = await getResponse.json();

          // Get image size
          const sizeResponse = await fetch(imageUrl, { method: 'HEAD' });
          const size = parseInt(sizeResponse.headers.get('content-length') || '0');

          const mapping: ImageMapping = {
            wordpressUrl: imageUrl,
            cloudflareId: getData.result.id,
            cloudflareUrl: `https://imagedelivery.net/${CLOUDFLARE_IMAGES_HASH}/${getData.result.id}/public`,
            hash,
            uploadedAt: getData.result.uploaded,
            size,
          };

          console.log(`    ✅ Retrieved existing: ${mapping.cloudflareUrl}`);
          return mapping;
        }
      }

      throw new Error(`Upload failed (${response.status}): ${errorText}`);
    }

    const data: CloudflareImageResponse = await response.json();

    if (!data.success) {
      throw new Error(`Cloudflare API error: ${JSON.stringify(data.errors)}`);
    }

    // Get image size
    const sizeResponse = await fetch(imageUrl, { method: 'HEAD' });
    const size = parseInt(sizeResponse.headers.get('content-length') || '0');

    const mapping: ImageMapping = {
      wordpressUrl: imageUrl,
      cloudflareId: data.result.id,
      cloudflareUrl: `https://imagedelivery.net/${CLOUDFLARE_IMAGES_HASH}/${data.result.id}/public`,
      hash,
      uploadedAt: data.result.uploaded,
      size,
    };

    console.log(`    ✅ Success: ${mapping.cloudflareUrl}`);
    return mapping;

  } catch (error) {
    console.error(`    ❌ Failed to upload ${filename}:`, error);
    throw error;
  }
}

// ============================================
// STEP 4: SYNC ALL IMAGES
// ============================================

async function syncImages() {
  console.log('\n🚀 CLOUDFLARE IMAGES SYNC - GLOBAL DOMINANCE MODE\n');
  console.log('='.repeat(60) + '\n');

  // Validate environment variables
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN || !CLOUDFLARE_IMAGES_HASH) {
    console.log('⚠️  Cloudflare Images credentials not configured');
    console.log('   Skipping image upload (local development mode)');
    console.log('   To enable, set these environment variables:');
    console.log('   - CLOUDFLARE_ACCOUNT_ID');
    console.log('   - CLOUDFLARE_API_TOKEN');
    console.log('   - CLOUDFLARE_IMAGES_HASH');
    console.log('\n   Get credentials: https://dash.cloudflare.com/?to=/:account/images\n');
    console.log('✅ Build can continue without Cloudflare Images sync\n');
    return; // Exit gracefully without error
  }

  // Step 1: Find images used in built pages
  const usedImages = await findUsedImages();

  if (usedImages.size === 0) {
    console.log('⚠️  No WordPress images found in built pages. Exiting.\n');
    return;
  }

  // Step 2: Load existing mapping
  console.log('📂 Loading existing mappings...\n');
  const existingMapping = await loadExistingMapping();

  // Step 3: Upload images to Cloudflare
  console.log('☁️  Uploading to Cloudflare Images...\n');

  const mappings: ImageMapping[] = [];
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const imageUrl of usedImages) {
    try {
      const mapping = await uploadToCloudflare(
        imageUrl,
        existingMapping.get(imageUrl)
      );

      mappings.push(mapping);

      if (mapping.uploadedAt === new Date().toISOString().split('T')[0]) {
        uploaded++;
      } else {
        skipped++;
      }
    } catch (error) {
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SYNC SUMMARY:\n');
  console.log(`  Total images: ${usedImages.size}`);
  console.log(`  Uploaded: ${uploaded}`);
  console.log(`  Skipped (already exist): ${skipped}`);
  console.log(`  Failed: ${failed}\n`);

  // Step 4: Save mapping file
  console.log('💾 Saving image mappings...\n');
  await fs.writeFile(
    MAPPING_FILE,
    JSON.stringify(mappings, null, 2),
    'utf-8'
  );
  console.log(`  ✅ Saved to: ${MAPPING_FILE}\n`);

  // Step 5: Generate _redirects file for legacy URLs
  console.log('🔀 Generating redirect rules...\n');
  await generateRedirects(mappings);

  console.log('='.repeat(60));
  console.log('\n✅ SYNC COMPLETE - GLOBAL DOMINANCE ACHIEVED!\n');
}

// ============================================
// STEP 5: GENERATE _REDIRECTS FOR CLOUDFLARE PAGES
// ============================================

async function generateRedirects(mappings: ImageMapping[]) {
  const redirects: string[] = [
    '# Cloudflare Images - WordPress Legacy URL Redirects',
    '# Generated automatically by sync-cloudflare-images.ts',
    '# DO NOT EDIT MANUALLY',
    '',
  ];

  for (const mapping of mappings) {
    // Extract path from WordPress URL
    const wpUrl = new URL(mapping.wordpressUrl);
    const wpPath = wpUrl.pathname;

    // Create redirect rule: /wp-content/uploads/... → Cloudflare Images URL
    redirects.push(`${wpPath} ${mapping.cloudflareUrl} 301`);
  }

  await fs.writeFile(REDIRECTS_FILE, redirects.join('\n'), 'utf-8');
  console.log(`  ✅ Generated ${mappings.length} redirect rules`);
  console.log(`  ✅ Saved to: ${REDIRECTS_FILE}\n`);
}

// ============================================
// RUN THE SYNC
// ============================================

syncImages().catch((error) => {
  console.error('\n❌ SYNC FAILED:\n', error);
  process.exit(1);
});
