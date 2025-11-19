#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from 'dotenv';

async function uploadWolfPackImage() {
  // Load environment variables
  config({ path: path.join('/home/claude-flow/packages/public-site', '.env.local') });

  const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
  const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  const CLOUDFLARE_IMAGES_HASH = process.env.CLOUDFLARE_IMAGES_HASH;

  const imagePath = '/home/claude-flow/packages/public-site/public/images/hero/Smart-agent-alliance-and-the-wolf-pack.webp';
  const imageBuffer = fs.readFileSync(imagePath);

  // Generate hash for unique ID
  const hash = crypto.createHash('md5').update(imageBuffer).digest('hex').substring(0, 16);
  const filename = 'Smart-agent-alliance-and-the-wolf-pack.webp';
  const cloudflareId = `${hash}-${filename}`;

  console.log(`📤 Uploading wolf pack image to Cloudflare Images...`);
  console.log(`   File: ${filename}`);
  console.log(`   Size: ${(imageBuffer.length / 1024).toFixed(1)} KB`);
  console.log(`   ID: ${cloudflareId}\n`);

  // Create form data
  const formData = new FormData();
  formData.append('file', new Blob([imageBuffer]), filename);
  formData.append('id', cloudflareId);
  formData.append('requireSignedURLs', 'false');
  formData.append('metadata', JSON.stringify({ source: 'local-hero-image' }));

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

  const result = await response.json();

  if (result.success) {
    console.log('✅ Upload successful!');
    console.log(`   Cloudflare URL: https://imagedelivery.net/${CLOUDFLARE_IMAGES_HASH}/${cloudflareId}/public`);
    console.log(`\nImage mapping:`);
    console.log(JSON.stringify({
      localPath: '/images/hero/Smart-agent-alliance-and-the-wolf-pack.webp',
      cloudflareId: cloudflareId,
      cloudflareUrl: `https://imagedelivery.net/${CLOUDFLARE_IMAGES_HASH}/${cloudflareId}/public`,
      hash: hash,
      uploadedAt: new Date().toISOString(),
      size: imageBuffer.length
    }, null, 2));
  } else {
    console.error('❌ Upload failed:', result.errors);
    process.exit(1);
  }
}

uploadWolfPackImage().catch(console.error);
