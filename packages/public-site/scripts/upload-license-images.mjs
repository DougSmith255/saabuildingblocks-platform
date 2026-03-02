/**
 * Upload license summary PNGs to Cloudflare Images
 *
 * Usage:
 *   node upload-license-images.mjs                          # Upload from default ~/tmp/license-images/
 *   node upload-license-images.mjs --dir /path/to/images    # Custom source directory
 *
 * Outputs: license-images-mapping.json in the public-site package root
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

// Load license data for alt text generation
const DATA_FILE = resolve(__dirname, 'license-requirements-data.json');
const licenseData = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));

// Parse CLI args
const args = process.argv.slice(2);
const dirIdx = args.indexOf('--dir');
const sourceDir = dirIdx >= 0 ? args[dirIdx + 1] : resolve(process.env.HOME || '/home/ubuntu', 'tmp/license-images');

if (!existsSync(sourceDir)) {
  console.error(`Source directory does not exist: ${sourceDir}`);
  process.exit(1);
}

const API_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`;

/**
 * Upload a single image to Cloudflare Images with a deterministic ID.
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
 * Generate descriptive alt text for a state license image
 */
function generateAltText(slug) {
  const state = licenseData.states[slug];
  if (!state) return 'Real estate license requirements summary';
  return `${state.name} real estate license requirements - ${state.education.hours} hours education, ${state.exam.questions} exam questions, ${state.fees.total} total fees`;
}

/**
 * Generate title for a state license image
 */
function generateTitle(slug) {
  const state = licenseData.states[slug];
  if (!state) return 'Real Estate License Requirements';
  return `${state.name} Real Estate License Requirements at a Glance`;
}

async function main() {
  const files = readdirSync(sourceDir).filter(f => f.startsWith('license-') && f.endsWith('.png'));

  if (files.length === 0) {
    console.error(`No license-*.png files found in ${sourceDir}`);
    process.exit(1);
  }

  console.log(`Uploading ${files.length} license images to Cloudflare Images...\n`);

  const mapping = {};
  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    // Extract slug: license-california.png -> california
    const slug = file.replace('license-', '').replace('.png', '');
    const imageId = `license-${slug}`;
    const filePath = resolve(sourceDir, file);

    console.log(`  Uploading: ${file} (id: ${imageId})`);
    const url = await uploadImage(filePath, imageId);

    if (url) {
      mapping[slug] = {
        cloudflareUrl: url,
        alt: generateAltText(slug),
        title: generateTitle(slug),
      };
      uploaded++;
    } else {
      failed++;
    }
  }

  // Write mapping file
  const outputPath = resolve(PACKAGE_ROOT, 'license-images-mapping.json');
  writeFileSync(outputPath, JSON.stringify(mapping, null, 2));

  console.log(`\nDone!`);
  console.log(`  Uploaded/verified: ${uploaded}`);
  if (failed) console.log(`  Failed: ${failed}`);
  console.log(`  Mapping written to: ${outputPath}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
