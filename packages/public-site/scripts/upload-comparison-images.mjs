/**
 * Upload comparison chart PNGs to Cloudflare Images
 *
 * Usage:
 *   node upload-comparison-images.mjs                          # Upload from default ~/tmp/comparison-images/
 *   node upload-comparison-images.mjs --dir /path/to/images    # Custom source directory
 *
 * Outputs: comparison-images-mapping.json in the public-site package root
 *
 * Credentials: reads CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_IMAGES_HASH from .env.local
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = resolve(__dirname, '..');

// Load .env.local
config({ path: resolve(PACKAGE_ROOT, '.env.local') });

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const IMAGES_HASH = process.env.CLOUDFLARE_IMAGES_HASH;

if (!ACCOUNT_ID || !API_TOKEN || !IMAGES_HASH) {
  console.error('Missing CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, or CLOUDFLARE_IMAGES_HASH in .env.local');
  process.exit(1);
}

// Load brokerage data for alt text generation
const DATA_FILE = resolve(__dirname, 'brokerage-data.json');
const brokerageData = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));

// Parse CLI args
const args = process.argv.slice(2);
const dirIdx = args.indexOf('--dir');
const sourceDir = dirIdx >= 0 ? args[dirIdx + 1] : resolve(process.env.HOME || '/home/ubuntu', 'tmp/comparison-images');

if (!existsSync(sourceDir)) {
  console.error(`Source directory does not exist: ${sourceDir}`);
  process.exit(1);
}

const API_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`;

/**
 * Upload a single image to Cloudflare Images with a deterministic ID.
 * Returns the delivery URL, or null on failure.
 */
async function uploadImage(filePath, imageId) {
  const fileBuffer = readFileSync(filePath);
  const form = new FormData();
  form.append('file', new Blob([fileBuffer], { type: 'image/png' }), basename(filePath));
  form.append('id', imageId);

  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    body: form,
  });

  const data = await response.json();

  if (data.success) {
    return `https://imagedelivery.net/${IMAGES_HASH}/${imageId}/public`;
  }

  // 409 = already exists - return the expected URL
  if (response.status === 409 || data.errors?.some(e => e.code === 5409)) {
    console.log(`  ⏭  ${imageId} already exists, skipping`);
    return `https://imagedelivery.net/${IMAGES_HASH}/${imageId}/public`;
  }

  console.error(`  ❌ Failed to upload ${imageId}:`, data.errors);
  return null;
}

/**
 * Generate descriptive alt text for a comparison pair
 */
function generateAltText(slug) {
  const pair = brokerageData.slugMapping[slug];
  if (!pair) return `Brokerage comparison chart`;

  const [nameA, nameB] = pair;
  return `${nameA} vs ${nameB} side-by-side comparison of commission splits, fees, and benefits`;
}

/**
 * Generate title for a comparison pair
 */
function generateTitle(slug) {
  const pair = brokerageData.slugMapping[slug];
  if (!pair) return `Brokerage Comparison Chart`;

  const [nameA, nameB] = pair;
  return `${nameA} vs ${nameB} Comparison Chart`;
}

async function main() {
  const files = readdirSync(sourceDir).filter(f => f.startsWith('comparison-') && f.endsWith('.png'));

  if (files.length === 0) {
    console.error(`No comparison-*.png files found in ${sourceDir}`);
    process.exit(1);
  }

  console.log(`Uploading ${files.length} comparison images to Cloudflare Images...\n`);

  const mapping = {};
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    // Extract slug: comparison-exp-kw.png -> exp-kw
    const slug = file.replace('comparison-', '').replace('.png', '');
    const imageId = `comparison-${slug}`;
    const filePath = resolve(sourceDir, file);

    const url = await uploadImage(filePath, imageId);

    if (url) {
      mapping[slug] = {
        cloudflareUrl: url,
        alt: generateAltText(slug),
        title: generateTitle(slug),
      };

      if (url) uploaded++;
    } else {
      failed++;
    }
  }

  // Write mapping file
  const outputPath = resolve(PACKAGE_ROOT, 'comparison-images-mapping.json');
  writeFileSync(outputPath, JSON.stringify(mapping, null, 2));

  console.log(`\nDone!`);
  console.log(`  Uploaded/verified: ${uploaded}`);
  if (skipped) console.log(`  Skipped (exists): ${skipped}`);
  if (failed) console.log(`  Failed: ${failed}`);
  console.log(`  Mapping written to: ${outputPath}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
