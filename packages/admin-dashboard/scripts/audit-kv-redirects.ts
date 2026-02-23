/**
 * Audit all redirects in Cloudflare KV REDIRECT_OVERRIDES namespace.
 * Lists all keys, fetches their target values, and groups by type.
 *
 * Run with:
 *   cd packages/admin-dashboard && \
 *   export $(grep '^CLOUDFLARE_ACCOUNT_ID=' .env.local) && \
 *   export $(grep '^CLOUDFLARE_API_TOKEN=' .env.local) && \
 *   export $(grep '^REDIRECT_OVERRIDES_KV_NAMESPACE_ID=' .env.local) && \
 *   npx tsx scripts/audit-kv-redirects.ts
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const NAMESPACE_ID = process.env.REDIRECT_OVERRIDES_KV_NAMESPACE_ID!;

const BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}`;

async function listAllKeys(): Promise<string[]> {
  const allKeys: string[] = [];
  let cursor: string | undefined;

  while (true) {
    const params = new URLSearchParams({ limit: '1000' });
    if (cursor) params.set('cursor', cursor);

    const res = await fetch(`${BASE}/keys?${params}`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` },
    });
    const json = await res.json();
    const keys: Array<{ name: string }> = json.result || [];
    allKeys.push(...keys.map(k => k.name));

    cursor = json.result_info?.cursor;
    if (!cursor || keys.length === 0) break;
  }

  return allKeys;
}

async function getValue(key: string): Promise<string> {
  const res = await fetch(`${BASE}/values/${encodeURIComponent(key)}`, {
    headers: { 'Authorization': `Bearer ${API_TOKEN}` },
  });
  return res.text();
}

async function main() {
  if (!ACCOUNT_ID || !API_TOKEN || !NAMESPACE_ID) {
    console.error('Missing env vars');
    process.exit(1);
  }

  console.log('Fetching all KV keys...\n');
  const allKeys = await listAllKeys();
  console.log(`Total keys: ${allKeys.length}\n`);

  // Deduplicate: only look at non-trailing-slash versions (skip /foo/ if /foo exists)
  const uniquePaths = allKeys.filter(k => !k.endsWith('/'));
  // Also catch keys that ONLY have trailing slash
  const trailingOnly = allKeys.filter(k => k.endsWith('/') && !allKeys.includes(k.slice(0, -1)));
  const pathsToCheck = [...uniquePaths, ...trailingOnly];

  console.log(`Unique redirect paths (deduped slash variants): ${pathsToCheck.length}\n`);

  // Fetch all values
  console.log('Fetching redirect targets...');
  const redirects: Array<{ from: string; to: string }> = [];
  let fetched = 0;

  // Batch fetch with concurrency limit
  const CONCURRENCY = 10;
  for (let i = 0; i < pathsToCheck.length; i += CONCURRENCY) {
    const batch = pathsToCheck.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(async (key) => {
      const value = await getValue(key);
      return { from: key, to: value };
    }));
    redirects.push(...results);
    fetched += results.length;
    process.stdout.write(`\r  ${fetched}/${pathsToCheck.length}`);
  }
  console.log('\n');

  // Sort by source path
  redirects.sort((a, b) => a.from.localeCompare(b.from));

  // Group by category/pattern
  const groups: Record<string, Array<{ from: string; to: string }>> = {
    'Old WordPress slugs -> /blog/': [],
    'Old /real-estate-agent-job/career/ -> /blog/agent-career-info/': [],
    'Old /real-estate-agent-job/entertainment/ -> /blog/fun-for-agents/': [],
    'Old /real-estate-agent-job/trends/ -> /blog/industry-trends/': [],
    'Old /real-estate-agent-job/marketing(s)/ -> /blog/marketing-mastery/': [],
    'Old /real-estate-agent-job/clients/ -> /blog/winning-clients/': [],
    'Old /real-estate-agent-job/brokerage-comparison/ -> /blog/brokerage-comparison/': [],
    'Old /about-exp/ -> /about-exp-realty/': [],
    'Old /exp-realty-sponsor-team/ -> /exp-realty-sponsor/': [],
    'Other': [],
  };

  for (const r of redirects) {
    if (r.from.startsWith('/real-estate-agent-job/career/')) {
      groups['Old /real-estate-agent-job/career/ -> /blog/agent-career-info/'].push(r);
    } else if (r.from.startsWith('/real-estate-agent-job/entertainment/')) {
      groups['Old /real-estate-agent-job/entertainment/ -> /blog/fun-for-agents/'].push(r);
    } else if (r.from.startsWith('/real-estate-agent-job/trends/')) {
      groups['Old /real-estate-agent-job/trends/ -> /blog/industry-trends/'].push(r);
    } else if (r.from.startsWith('/real-estate-agent-job/marketing')) {
      groups['Old /real-estate-agent-job/marketing(s)/ -> /blog/marketing-mastery/'].push(r);
    } else if (r.from.startsWith('/real-estate-agent-job/clients/')) {
      groups['Old /real-estate-agent-job/clients/ -> /blog/winning-clients/'].push(r);
    } else if (r.from.startsWith('/real-estate-agent-job/brokerage-comparison/')) {
      groups['Old /real-estate-agent-job/brokerage-comparison/ -> /blog/brokerage-comparison/'].push(r);
    } else if (r.from.startsWith('/about-exp/')) {
      groups['Old /about-exp/ -> /about-exp-realty/'].push(r);
    } else if (r.from.startsWith('/exp-realty-sponsor-team/')) {
      groups['Old /exp-realty-sponsor-team/ -> /exp-realty-sponsor/'].push(r);
    } else if (r.to.startsWith('/blog/')) {
      groups['Old WordPress slugs -> /blog/'].push(r);
    } else {
      groups['Other'].push(r);
    }
  }

  // Print grouped
  for (const [group, items] of Object.entries(groups)) {
    if (items.length === 0) continue;
    console.log(`=== ${group} (${items.length} redirects) ===`);
    for (const r of items) {
      console.log(`  ${r.from}  ->  ${r.to}`);
    }
    console.log();
  }

  // Summary
  console.log('=== SUMMARY ===');
  for (const [group, items] of Object.entries(groups)) {
    if (items.length === 0) continue;
    console.log(`  ${group}: ${items.length}`);
  }
  console.log(`  TOTAL unique redirects: ${redirects.length}`);
  console.log(`  TOTAL KV entries (incl slash variants): ${allKeys.length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
