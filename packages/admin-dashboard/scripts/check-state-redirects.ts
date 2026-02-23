/**
 * Check if become-an-agent and real-estate-schools posts have existing redirects
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const NAMESPACE_ID = process.env.REDIRECT_OVERRIDES_KV_NAMESPACE_ID || '';
const BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}`;

const slugs = [
  'oklahoma', 'missouri', 'indiana', 'georgia', 'colorado', 'ohio',
  'michigan', 'illinois', 'texas', 'florida', 'california', 'license',
  'oklahoma-2', 'missouri-2', 'indiana-2', 'georgia-2', 'colorado-2', 'ohio-2',
  'michigan-2', 'illinois-2', 'texas-2', 'florida-2', 'california-2', 'schools',
];

async function getValue(key: string): Promise<string | null> {
  const res = await fetch(`${BASE}/values/${encodeURIComponent(key)}`, {
    headers: { 'Authorization': `Bearer ${API_TOKEN}` },
  });
  if (!res.ok) return null;
  return res.text();
}

async function main() {
  console.log('Checking existing redirects for become-an-agent / real-estate-schools slugs:\n');

  console.log('--- become-an-agent posts ---');
  for (const slug of slugs.slice(0, 12)) {
    const val = await getValue('/' + slug);
    console.log(val
      ? `  /${slug}  ->  ${val}  (EXISTS)`
      : `  /${slug}  ->  (NO REDIRECT)`
    );
  }

  console.log('\n--- real-estate-schools posts ---');
  for (const slug of slugs.slice(12)) {
    const val = await getValue('/' + slug);
    console.log(val
      ? `  /${slug}  ->  ${val}  (EXISTS)`
      : `  /${slug}  ->  (NO REDIRECT)`
    );
  }
}

main();
