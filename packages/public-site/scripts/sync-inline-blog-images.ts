#!/usr/bin/env tsx
/**
 * Sync Inline Blog Images to Cloudflare
 *
 * This script uploads images embedded within blog post HTML content
 * (not featured images - those are handled by sync-cloudflare-images.ts)
 *
 * USAGE:
 *   npx tsx scripts/sync-inline-blog-images.ts [--dry-run]
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') });

interface ImageMapping {
  wordpressUrl: string;
  cloudflareId: string;
  cloudflareUrl: string;
  hash: string;
  uploadedAt: string;
  size: number;
}

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_IMAGES_HASH = process.env.CLOUDFLARE_IMAGES_HASH;

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const MAPPING_FILE = path.join(process.cwd(), 'cloudflare-images-mapping.json');
const DRY_RUN = process.argv.includes('--dry-run');

// Rate limiting - Cloudflare allows 1000 requests per minute
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Extract base filename without WordPress size suffix
function getBaseImageUrl(url: string): string {
  return url.replace(/-\d+x\d+(-\d+)?(\.[^.]+)$/, '$2');
}

async function loadExistingMapping(): Promise<Map<string, ImageMapping>> {
  try {
    const content = await fs.readFile(MAPPING_FILE, 'utf-8');
    const data: ImageMapping[] = JSON.parse(content);
    const map = new Map<string, ImageMapping>();
    data.forEach(item => map.set(item.wordpressUrl, item));
    return map;
  } catch {
    return new Map();
  }
}

async function saveMapping(mappings: ImageMapping[]) {
  await fs.writeFile(MAPPING_FILE, JSON.stringify(mappings, null, 2), 'utf-8');
}

async function uploadToCloudflare(imageUrl: string): Promise<ImageMapping | null> {
  const hash = crypto
    .createHash('md5')
    .update(imageUrl)
    .digest('hex')
    .substring(0, 16);

  const filename = imageUrl.split('/').pop() || 'unknown';
  const imageId = `${hash}-${filename.replace(/[^a-zA-Z0-9.-]/g, '-')}`;

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

    if (response.status === 409) {
      // Image already exists
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
        const getData = await getResponse.json();
        return {
          wordpressUrl: imageUrl,
          cloudflareId: getData.result.id,
          cloudflareUrl: `https://imagedelivery.net/${CLOUDFLARE_IMAGES_HASH}/${getData.result.id}/public`,
          hash,
          uploadedAt: getData.result.uploaded,
          size: 0,
        };
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`    Failed (${response.status}): ${filename}`);
      return null;
    }

    const data = await response.json();

    if (!data.success) {
      console.error(`    API error: ${filename}`);
      return null;
    }

    return {
      wordpressUrl: imageUrl,
      cloudflareId: data.result.id,
      cloudflareUrl: `https://imagedelivery.net/${CLOUDFLARE_IMAGES_HASH}/${data.result.id}/public`,
      hash,
      uploadedAt: data.result.uploaded,
      size: 0,
    };

  } catch (error) {
    console.error(`    Error uploading ${filename}:`, error);
    return null;
  }
}

async function main() {
  console.log('\n🔄 SYNC INLINE BLOG IMAGES TO CLOUDFLARE\n');
  console.log('='.repeat(60) + '\n');

  if (DRY_RUN) {
    console.log('🏃 DRY RUN MODE - No uploads will happen\n');
  }

  // Validate environment
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN || !CLOUDFLARE_IMAGES_HASH) {
    console.error('❌ Missing Cloudflare credentials in environment');
    process.exit(1);
  }

  // Load existing mappings
  console.log('📂 Loading existing mappings...\n');
  const existingMapping = await loadExistingMapping();
  console.log(`  ✅ Found ${existingMapping.size} existing mappings\n`);

  // Find all inline images from blog-posts-chunk files
  console.log('🔍 Scanning blog posts for inline images...\n');

  const allFiles = await fs.readdir(PUBLIC_DIR);
  const chunkFiles = allFiles.filter(f => f.startsWith('blog-posts-chunk-') && f.endsWith('.json'));
  console.log(`  ✅ Found ${chunkFiles.length} chunk files\n`);

  // Extract all unique WordPress URLs
  const wpUrlRegex = /https?:\/\/wp\.saabuildingblocks\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"'\s,]+?\.(jpg|jpeg|png|webp|gif)/gi;
  const allUrls = new Set<string>();

  for (const chunkFile of chunkFiles) {
    const content = await fs.readFile(path.join(PUBLIC_DIR, chunkFile), 'utf-8');
    const matches = content.match(wpUrlRegex) || [];
    matches.forEach(url => allUrls.add(url));
  }

  console.log(`  ✅ Found ${allUrls.size} total WordPress URLs\n`);

  // Get unique base images (without size variants)
  const baseUrls = new Set<string>();
  for (const url of allUrls) {
    baseUrls.add(getBaseImageUrl(url));
  }

  // Filter out already uploaded images
  const toUpload: string[] = [];
  for (const url of baseUrls) {
    if (!existingMapping.has(url)) {
      toUpload.push(url);
    }
  }

  console.log(`  ✅ ${baseUrls.size} unique base images`);
  console.log(`  ✅ ${existingMapping.size} already uploaded`);
  console.log(`  📤 ${toUpload.length} new images to upload\n`);

  if (toUpload.length === 0) {
    console.log('✅ All images already uploaded!\n');
    return;
  }

  if (DRY_RUN) {
    console.log('Sample images that would be uploaded:');
    toUpload.slice(0, 20).forEach((url, i) => {
      console.log(`  ${i + 1}. ${url.split('/').pop()}`);
    });
    if (toUpload.length > 20) {
      console.log(`  ... and ${toUpload.length - 20} more`);
    }
    console.log('\n🏃 DRY RUN complete\n');
    return;
  }

  // Upload in batches
  console.log('☁️  Uploading to Cloudflare Images...\n');

  let uploaded = 0;
  let failed = 0;
  let alreadyExists = 0;
  const newMappings: ImageMapping[] = [...existingMapping.values()];

  for (let i = 0; i < toUpload.length; i += BATCH_SIZE) {
    const batch = toUpload.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toUpload.length / BATCH_SIZE);

    console.log(`  Batch ${batchNum}/${totalBatches} (${batch.length} images)...`);

    const results = await Promise.all(
      batch.map(async (url) => {
        const result = await uploadToCloudflare(url);
        if (result) {
          const filename = url.split('/').pop();
          if (result.uploadedAt && !result.uploadedAt.startsWith(new Date().toISOString().split('T')[0])) {
            console.log(`    ⏭️  ${filename} (already exists)`);
            alreadyExists++;
          } else {
            console.log(`    ✅ ${filename}`);
            uploaded++;
          }
          return result;
        }
        failed++;
        return null;
      })
    );

    // Add successful uploads to mappings
    for (const result of results) {
      if (result && !existingMapping.has(result.wordpressUrl)) {
        newMappings.push(result);
      }
    }

    // Save progress every batch
    await saveMapping(newMappings);

    // Rate limit
    if (i + BATCH_SIZE < toUpload.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 UPLOAD SUMMARY:\n');
  console.log(`  New uploads: ${uploaded}`);
  console.log(`  Already existed: ${alreadyExists}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total mappings: ${newMappings.length}\n`);

  console.log('✅ SYNC COMPLETE\n');
  console.log('Now run: npx tsx scripts/transform-blog-images.ts\n');
}

main().catch((error) => {
  console.error('\n❌ SYNC FAILED:\n', error);
  process.exit(1);
});
