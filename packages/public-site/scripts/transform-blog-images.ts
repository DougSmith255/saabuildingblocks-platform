#!/usr/bin/env tsx
/**
 * Transform Blog Post Images to Cloudflare URLs
 *
 * This script replaces WordPress image URLs in blog-posts-chunk-*.json files
 * with their Cloudflare Images equivalents using the mapping file.
 *
 * USAGE:
 *   npx tsx scripts/transform-blog-images.ts [--dry-run]
 */

import fs from 'fs/promises';
import path from 'path';

interface ImageMapping {
  wordpressUrl: string;
  cloudflareId: string;
  cloudflareUrl: string;
  hash: string;
  uploadedAt: string;
  size: number;
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const MAPPING_FILE = path.join(process.cwd(), 'cloudflare-images-mapping.json');
const DRY_RUN = process.argv.includes('--dry-run');

// Extract filename from WordPress URL (handles size variants like -480x262-1)
function getFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // Get filename without path
    return pathname.split('/').pop() || '';
  } catch {
    return url.split('/').pop() || '';
  }
}

// Get base filename without WordPress size suffix
function getBaseFilename(filename: string): string {
  // Remove WordPress size variants like -480x262-1 or -300x65
  return filename.replace(/-\d+x\d+(-\d+)?(\.[^.]+)$/, '$2');
}

// Get base name without extension (for cross-extension matching)
function getBaseName(filename: string): string {
  // Remove WordPress size variants AND extension
  const withoutSize = filename.replace(/-\d+x\d+(-\d+)?(\.[^.]+)$/, '$2');
  // Remove extension
  return withoutSize.replace(/\.[^.]+$/, '');
}

async function main() {
  console.log('\n🔄 TRANSFORM BLOG IMAGES TO CLOUDFLARE\n');
  console.log('='.repeat(60) + '\n');

  if (DRY_RUN) {
    console.log('🏃 DRY RUN MODE - No files will be modified\n');
  }

  // Load mapping file
  console.log('📂 Loading Cloudflare image mappings...\n');

  let mappings: ImageMapping[];
  try {
    const content = await fs.readFile(MAPPING_FILE, 'utf-8');
    mappings = JSON.parse(content);
    console.log(`  ✅ Loaded ${mappings.length} image mappings\n`);
  } catch (error) {
    console.error('❌ Failed to load mapping file:', error);
    process.exit(1);
  }

  // Build lookup map by filename (handles both exact and base filename matches)
  const urlMap = new Map<string, string>();
  const filenameMap = new Map<string, string>();
  const baseNameMap = new Map<string, string>(); // Map by base name without extension

  for (const mapping of mappings) {
    // Direct URL mapping
    urlMap.set(mapping.wordpressUrl, mapping.cloudflareUrl);

    // Filename-based mapping (for finding base images)
    const filename = getFilenameFromUrl(mapping.wordpressUrl);
    filenameMap.set(filename, mapping.cloudflareUrl);

    // Base name mapping (for cross-extension matching, e.g., .jpg -> .webp)
    const baseName = getBaseName(filename);
    baseNameMap.set(baseName, mapping.cloudflareUrl);
  }

  // Find all blog-posts-chunk files
  const allFiles = await fs.readdir(PUBLIC_DIR);
  const chunkFiles = allFiles.filter(f => f.startsWith('blog-posts-chunk-') && f.endsWith('.json'));
  console.log(`📄 Found ${chunkFiles.length} blog post chunk files\n`);

  let totalReplacements = 0;
  let totalMissing = 0;
  const missingImages = new Set<string>();

  for (const chunkFile of chunkFiles.sort()) {
    const filePath = path.join(PUBLIC_DIR, chunkFile);
    let content = await fs.readFile(filePath, 'utf-8');
    let replacements = 0;

    // Find all WordPress image URLs in the content
    const wpUrlRegex = /https?:\/\/wp\.saabuildingblocks\.com\/wp-content\/uploads\/[^"'\s]+?\.(jpg|jpeg|png|webp|gif)/gi;

    const matches = content.match(wpUrlRegex) || [];

    for (const wpUrl of matches) {
      // Try direct URL match first
      let cloudflareUrl = urlMap.get(wpUrl);

      // If no direct match, try to find by base filename
      if (!cloudflareUrl) {
        const filename = getFilenameFromUrl(wpUrl);
        const baseFilename = getBaseFilename(filename);

        // Look for the base image in mapping
        for (const [mappedFilename, cfUrl] of filenameMap) {
          if (mappedFilename === baseFilename || getBaseFilename(mappedFilename) === baseFilename) {
            cloudflareUrl = cfUrl;
            break;
          }
        }
      }

      // If still no match, try by base name without extension (handles .jpg -> .webp)
      if (!cloudflareUrl) {
        const filename = getFilenameFromUrl(wpUrl);
        const baseName = getBaseName(filename);
        cloudflareUrl = baseNameMap.get(baseName);
      }

      if (cloudflareUrl) {
        // Replace with mobile variant by default (loader will pick correct variant)
        const cfUrlWithVariant = cloudflareUrl.replace('/public', '/mobile');
        content = content.split(wpUrl).join(cfUrlWithVariant);
        replacements++;
      } else {
        missingImages.add(wpUrl);
        totalMissing++;
      }
    }

    if (replacements > 0) {
      console.log(`  ${chunkFile}: ${replacements} replacements`);
      totalReplacements += replacements;

      if (!DRY_RUN) {
        await fs.writeFile(filePath, content, 'utf-8');
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 TRANSFORMATION SUMMARY:\n');
  console.log(`  Total replacements: ${totalReplacements}`);
  console.log(`  Missing mappings: ${missingImages.size} unique images\n`);

  if (missingImages.size > 0 && missingImages.size <= 20) {
    console.log('⚠️  Missing images (need to be uploaded to Cloudflare):');
    for (const url of missingImages) {
      console.log(`    - ${getFilenameFromUrl(url)}`);
    }
    console.log();
  } else if (missingImages.size > 20) {
    console.log(`⚠️  ${missingImages.size} images missing - run sync-cloudflare-images.ts first\n`);
  }

  if (DRY_RUN) {
    console.log('🏃 DRY RUN complete - no files were modified\n');
  } else {
    console.log('✅ TRANSFORMATION COMPLETE\n');
  }
}

main().catch((error) => {
  console.error('\n❌ TRANSFORMATION FAILED:\n', error);
  process.exit(1);
});
