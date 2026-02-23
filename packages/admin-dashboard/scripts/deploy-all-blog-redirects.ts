/**
 * Deploy all WordPress → new site blog redirects to Cloudflare KV
 *
 * Reads blog-posts-chunk-*.json files to get slug → customUri mappings,
 * then writes both /slug and /slug/ to KV pointing at /blog/{customUri}
 *
 * Run with: npx tsx scripts/deploy-all-blog-redirects.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const NAMESPACE_ID = process.env.REDIRECT_OVERRIDES_KV_NAMESPACE_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

interface BlogPost {
  slug: string;
  customUri?: string;
}

async function writeKV(kvPath: string, target: string): Promise<boolean> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(kvPath)}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'text/plain',
    },
    body: target,
  });

  return res.ok;
}

async function main() {
  if (!ACCOUNT_ID || !NAMESPACE_ID || !API_TOKEN) {
    console.error('Missing env vars. Source .env.local first.');
    process.exit(1);
  }

  // Read all blog-posts-chunk files
  const chunksDir = path.join(__dirname, '../../public-site/public');
  const chunkFiles = fs.readdirSync(chunksDir).filter(f => f.startsWith('blog-posts-chunk'));

  const mappings: Array<{ slug: string; newPath: string }> = [];

  for (const file of chunkFiles) {
    const posts: BlogPost[] = JSON.parse(fs.readFileSync(path.join(chunksDir, file), 'utf8'));
    for (const post of posts) {
      if (post.slug && post.customUri) {
        mappings.push({ slug: post.slug, newPath: `/blog/${post.customUri}` });
      }
    }
  }

  console.log(`Found ${mappings.length} blog post redirects to deploy.\n`);

  let success = 0;
  let failed = 0;

  // Deploy in batches of 10 to avoid rate limits
  for (let i = 0; i < mappings.length; i += 10) {
    const batch = mappings.slice(i, i + 10);

    const results = await Promise.all(
      batch.flatMap(({ slug, newPath }) => [
        writeKV(`/${slug}`, newPath).then(ok => ({ path: `/${slug}`, newPath, ok })),
        writeKV(`/${slug}/`, newPath).then(ok => ({ path: `/${slug}/`, newPath, ok })),
      ])
    );

    for (const r of results) {
      if (r.ok) {
        success++;
      } else {
        failed++;
        console.error(`  FAILED: ${r.path} → ${r.newPath}`);
      }
    }

    // Progress
    const done = Math.min(i + 10, mappings.length);
    process.stdout.write(`\r  Deployed ${done}/${mappings.length} posts (${success} KV writes ok, ${failed} failed)`);

    // Small delay between batches
    if (i + 10 < mappings.length) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\n\nDone! ${success} KV entries written, ${failed} failed.`);
  console.log(`Each post has 2 entries (with and without trailing slash).`);
}

main();
