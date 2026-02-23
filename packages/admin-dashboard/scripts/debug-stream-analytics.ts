/**
 * Debug: Fetch raw Cloudflare Stream analytics to verify data accuracy
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

const VIDEO_IDS = [
  'f8c3f1bd9c2db2409ed0e90f60fd4d5b',  // The Inside Look
  '14ba82ce03943a64ef90e3c9771a0d56',   // Portal Walkthrough
];

const VIDEO_NAMES: Record<string, string> = {
  'f8c3f1bd9c2db2409ed0e90f60fd4d5b': 'The Inside Look (DISABLED)',
  '14ba82ce03943a64ef90e3c9771a0d56': 'Portal Walkthrough',
};

async function fetchRaw(startDate: string, endDate: string) {
  const query = `
    query {
      viewer {
        accounts(filter: { accountTag: "${ACCOUNT_ID}" }) {
          streamMinutesViewedAdaptiveGroups(
            filter: {
              date_geq: "${startDate}"
              date_leq: "${endDate}"
              uid_in: ${JSON.stringify(VIDEO_IDS)}
            }
            orderBy: [date_ASC]
            limit: 10000
          ) {
            count
            sum { minutesViewed }
            dimensions { uid date }
          }
        }
      }
    }
  `;

  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

async function main() {
  if (!ACCOUNT_ID || !API_TOKEN) {
    console.error('Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN');
    process.exit(1);
  }

  const today = new Date().toISOString().split('T')[0];
  const thirtyAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

  console.log(`Fetching raw Cloudflare Stream data: ${thirtyAgo} to ${today}\n`);

  const result = await fetchRaw(thirtyAgo, today);

  if (result.errors) {
    console.error('GraphQL errors:', JSON.stringify(result.errors, null, 2));
    process.exit(1);
  }

  const groups = result.data?.viewer?.accounts?.[0]?.streamMinutesViewedAdaptiveGroups || [];
  console.log(`Total rows returned: ${groups.length}\n`);

  // Group by video
  const byVideo: Record<string, Array<{ date: string; count: number; minutesViewed: number }>> = {};

  for (const g of groups) {
    const uid = g.dimensions.uid;
    const date = g.dimensions.date;
    const count = g.count;
    const minutesViewed = g.sum.minutesViewed;

    if (!byVideo[uid]) byVideo[uid] = [];
    byVideo[uid].push({ date, count, minutesViewed });
  }

  for (const [uid, entries] of Object.entries(byVideo)) {
    console.log(`=== ${VIDEO_NAMES[uid] || uid} ===`);
    let totalCount = 0;
    let totalMinutes = 0;
    for (const e of entries) {
      console.log(`  ${e.date}: count=${e.count}, minutesViewed=${e.minutesViewed}`);
      totalCount += e.count;
      totalMinutes += e.minutesViewed;
    }
    console.log(`  TOTAL: count=${totalCount}, minutesViewed=${totalMinutes}`);
    console.log();
  }

  // Check video status
  console.log('=== Video Status via Stream API ===\n');
  for (const uid of VIDEO_IDS) {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream/${uid}`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` },
    });
    const data = await res.json();
    const v = data.result;
    if (v) {
      console.log(`${VIDEO_NAMES[uid]}:`);
      console.log(`  Status: ${v.status?.state || 'unknown'}`);
      console.log(`  Ready to stream: ${v.readyToStream}`);
      console.log(`  Created: ${v.created}`);
      console.log(`  Modified: ${v.modified}`);
      console.log(`  Duration: ${v.duration}s`);
      console.log(`  Require signed URLs: ${v.requireSignedURLs}`);
      console.log(`  Allowed origins: ${JSON.stringify(v.allowedOrigins)}`);
      console.log(`  Meta: ${JSON.stringify(v.meta)}`);
      console.log();
    } else {
      console.log(`${VIDEO_NAMES[uid]}: NOT FOUND`);
      console.log(`  Response: ${JSON.stringify(data)}\n`);
    }
  }
}

main();
