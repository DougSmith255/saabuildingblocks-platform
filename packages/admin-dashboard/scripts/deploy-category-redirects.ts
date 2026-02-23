/**
 * Deploy bulk category-based redirects to Cloudflare KV
 *
 * Maps old WordPress URL patterns to new blog/page URLs.
 * Reads blog post data from public-site chunk files to get all posts in a category,
 * then deploys redirects (both with and without trailing slash) to Cloudflare KV.
 *
 * Run with:
 *   cd packages/admin-dashboard && \
 *   export $(grep '^CLOUDFLARE_ACCOUNT_ID=' .env.local) && \
 *   export $(grep '^CLOUDFLARE_API_TOKEN=' .env.local) && \
 *   export $(grep '^REDIRECT_OVERRIDES_KV_NAMESPACE_ID=' .env.local) && \
 *   npx tsx scripts/deploy-category-redirects.ts [--dry-run]
 */

import * as fs from 'fs';
import * as path from 'path';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const NAMESPACE_ID = process.env.REDIRECT_OVERRIDES_KV_NAMESPACE_ID!;

const isDryRun = process.argv.includes('--dry-run');

// Old URL prefix -> new category + new base path
// newBase: '/blog' for most categories, '' for top-level pages
const CATEGORY_MAPPINGS: Array<{
  oldPrefix: string;
  newCategory: string;
  newBase: string;
}> = [
  // /real-estate-agent-job/{old} -> /blog/{new}
  { oldPrefix: '/real-estate-agent-job/career', newCategory: 'agent-career-info', newBase: '/blog' },
  { oldPrefix: '/real-estate-agent-job/entertainment', newCategory: 'fun-for-agents', newBase: '/blog' },
  { oldPrefix: '/real-estate-agent-job/trends', newCategory: 'industry-trends', newBase: '/blog' },
  { oldPrefix: '/real-estate-agent-job/marketings', newCategory: 'marketing-mastery', newBase: '/blog' },
  { oldPrefix: '/real-estate-agent-job/marketing', newCategory: 'marketing-mastery', newBase: '/blog' },
  { oldPrefix: '/real-estate-agent-job/clients', newCategory: 'winning-clients', newBase: '/blog' },
  { oldPrefix: '/real-estate-agent-job/brokerage-comparison', newCategory: 'brokerage-comparison', newBase: '/blog' },

  // Top-level old paths (no /real-estate-agent-job/ prefix, no /blog/ in new URL)
  { oldPrefix: '/about-exp', newCategory: 'about-exp-realty', newBase: '' },
  { oldPrefix: '/exp-realty-sponsor-team', newCategory: 'exp-realty-sponsor', newBase: '' },

  // WordPress category URLs: /{category}/{slug} -> /blog/{category}/{slug}
  // These were the actual WordPress permalink structure
  { oldPrefix: '/marketing-mastery', newCategory: 'marketing-mastery', newBase: '/blog' },
  { oldPrefix: '/agent-career-info', newCategory: 'agent-career-info', newBase: '/blog' },
  { oldPrefix: '/winning-clients', newCategory: 'winning-clients', newBase: '/blog' },
  { oldPrefix: '/industry-trends', newCategory: 'industry-trends', newBase: '/blog' },
  { oldPrefix: '/fun-for-agents', newCategory: 'fun-for-agents', newBase: '/blog' },
  { oldPrefix: '/brokerage-comparison', newCategory: 'brokerage-comparison', newBase: '/blog' },
  { oldPrefix: '/real-estate-schools', newCategory: 'real-estate-schools', newBase: '/blog' },
  { oldPrefix: '/become-an-agent', newCategory: 'become-an-agent', newBase: '/blog' },
];

interface Post {
  slug: string;
  customUri?: string;
  title?: string;
}

async function loadAllPosts(): Promise<Post[]> {
  const chunksDir = path.join(__dirname, '../../public-site/public');
  const files = fs.readdirSync(chunksDir).filter(f => f.startsWith('blog-posts-chunk'));
  const allPosts: Post[] = [];
  for (const file of files) {
    allPosts.push(...JSON.parse(fs.readFileSync(path.join(chunksDir, file), 'utf8')));
  }
  return allPosts;
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

  if (!res.ok) {
    const err = await res.text();
    console.error(`  FAILED: ${kvPath} -> ${err}`);
    return false;
  }
  return true;
}

async function main() {
  console.log('==========================================');
  console.log(' Deploy Category-Based Redirects to KV');
  console.log('==========================================\n');

  if (isDryRun) {
    console.log('*** DRY RUN - No KV writes will be made ***\n');
  }

  if (!isDryRun && (!ACCOUNT_ID || !API_TOKEN || !NAMESPACE_ID)) {
    console.error('Missing env vars. Export CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, REDIRECT_OVERRIDES_KV_NAMESPACE_ID');
    process.exit(1);
  }

  const allPosts = await loadAllPosts();
  console.log(`Loaded ${allPosts.length} total blog posts\n`);

  // Group posts by category
  const byCategory: Record<string, Array<{ slug: string; customUri: string; lastSlug: string; title: string }>> = {};
  for (const p of allPosts) {
    if (!p.customUri) continue;
    const parts = p.customUri.split('/');
    const category = parts[0];
    const lastSlug = parts.slice(1).join('/');
    if (!byCategory[category]) byCategory[category] = [];
    byCategory[category].push({ slug: p.slug, customUri: p.customUri, lastSlug, title: p.title || '' });
  }

  let totalDeployed = 0;
  let totalFailed = 0;

  // Deduplicate: if two old prefixes map to the same category (e.g. marketing + marketings),
  // track deployed per-category so we only count each post once in totals
  const deployedPosts = new Set<string>();

  for (const mapping of CATEGORY_MAPPINGS) {
    const posts = byCategory[mapping.newCategory] || [];
    const newPrefix = mapping.newBase ? `${mapping.newBase}/${mapping.newCategory}` : `/${mapping.newCategory}`;
    console.log(`--- ${mapping.newCategory} (${posts.length} posts) ---`);
    console.log(`  Old: ${mapping.oldPrefix}/{slug}`);
    console.log(`  New: ${newPrefix}/{slug}\n`);

    for (const post of posts) {
      const oldPath = `${mapping.oldPrefix}/${post.lastSlug}`;
      const newPath = mapping.newBase ? `${mapping.newBase}/${post.customUri}` : `/${post.customUri}`;

      if (isDryRun) {
        console.log(`  ${oldPath}  ->  ${newPath}`);
        totalDeployed++;
        deployedPosts.add(`${mapping.newCategory}:${post.lastSlug}`);
        continue;
      }

      // Write both with and without trailing slash
      const withoutSlash = oldPath;
      const withSlash = oldPath + '/';

      const ok1 = await writeKV(withoutSlash, newPath);
      const ok2 = await writeKV(withSlash, newPath);

      if (ok1 && ok2) {
        totalDeployed++;
        deployedPosts.add(`${mapping.newCategory}:${post.lastSlug}`);
        process.stdout.write(`\r  Deployed ${totalDeployed} redirects...`);
      } else {
        totalFailed++;
      }

      // Small delay to respect rate limits
      await new Promise(r => setTimeout(r, 100));
    }

    if (!isDryRun) console.log(); // newline after progress
  }

  console.log(`\nDone! ${totalDeployed} redirects deployed, ${totalFailed} failed.`);
  if (isDryRun) {
    console.log(`\nRun without --dry-run to actually deploy ${totalDeployed} redirects (${totalDeployed * 2} KV entries).`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
