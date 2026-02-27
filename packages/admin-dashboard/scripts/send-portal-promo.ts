/**
 * Send Portal Promo Email to GHL Contacts (excluding team members)
 *
 * Fetches ALL contacts from GoHighLevel, then EXCLUDES those with
 * "active downline" or "exp agent" tags (those are already on the team).
 * Sends the PortalPromoEmail via Resend to the remaining contacts.
 *
 * Run with:
 *   cd packages/admin-dashboard && \
 *   export $(grep '^RESEND_API_KEY=' .env.local) && \
 *   export $(grep '^GOHIGHLEVEL_API_KEY=' .env.local) && \
 *   export $(grep '^GOHIGHLEVEL_LOCATION_ID=' .env.local) && \
 *   NODE_ENV=production npx tsx scripts/send-portal-promo.ts
 *
 * Dry run (no emails sent, just lists recipients):
 *   ... same as above ... --dry-run
 *
 * IMPORTANT: Always do a --dry-run first to verify the recipient list!
 */

import { sendEmail } from '../lib/email/client';
import { PortalPromoEmail } from '../lib/email/templates/PortalPromoEmail';

// GHL v2 API
const GHL_API_KEY = process.env.GOHIGHLEVEL_API_KEY!;
const GHL_BASE_URL = 'https://services.leadconnectorhq.com';
const GHL_LOCATION_ID = process.env.GOHIGHLEVEL_LOCATION_ID!;
const GHL_API_VERSION = '2021-07-28';

// Tags to EXCLUDE — these people are already on the team
const EXCLUDE_TAGS = ['active downline', 'active-downline', 'exp agent', 'exp-agent'];

// Skip these emails (team leadership, test accounts, etc.)
const SKIP_EMAILS = [
  'doug@smartagentalliance.com',
  'karrie@smartagentalliance.com',
  'team@smartagentalliance.com',
];

// Resend rate limit: be conservative (600ms between sends)
const DELAY_BETWEEN_EMAILS_MS = 600;

interface GHLContact {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  tags?: string[];
  dnd?: boolean;
  dndSettings?: {
    Email?: { status: string };
    [channel: string]: { status: string } | undefined;
  };
}

const isDryRun = process.argv.includes('--dry-run');

/**
 * Fetch ALL contacts from GHL, paginating through the full list
 */
async function fetchAllContacts(): Promise<GHLContact[]> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    throw new Error('Missing GOHIGHLEVEL_API_KEY or GOHIGHLEVEL_LOCATION_ID. Export from .env.local first.');
  }

  const allContacts: GHLContact[] = [];
  let startAfterId: string | undefined;
  let startAfter: number | undefined;
  const limit = 100;

  console.log('Fetching all contacts from GoHighLevel...\n');

  while (true) {
    const params = new URLSearchParams({
      locationId: GHL_LOCATION_ID,
      limit: String(limit),
    });
    if (startAfterId && startAfter) {
      params.set('startAfterId', startAfterId);
      params.set('startAfter', String(startAfter));
    }

    const url = `${GHL_BASE_URL}/contacts/?${params}`;

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': GHL_API_VERSION,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`GHL API error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    const contacts: GHLContact[] = data.contacts || [];

    if (contacts.length === 0) break;

    allContacts.push(...contacts);

    const total = data.meta?.total || '?';
    process.stdout.write(`\r  Fetched ${allContacts.length} of ${total} contacts...`);

    if (contacts.length < limit) break;

    // Pagination — GHL requires BOTH startAfterId and startAfter
    const meta = data.meta;
    if (meta?.startAfterId && meta?.startAfter) {
      startAfterId = meta.startAfterId;
      startAfter = meta.startAfter;
    } else {
      break;
    }

    // Small delay between API pages to avoid rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n  Total contacts fetched: ${allContacts.length}\n`);
  return allContacts;
}

/**
 * Check if a contact has any of the excluded tags
 */
function hasExcludedTag(contact: GHLContact): boolean {
  if (!contact.tags || contact.tags.length === 0) return false;
  return contact.tags.some(tag =>
    EXCLUDE_TAGS.includes(tag.toLowerCase().trim())
  );
}

async function main() {
  console.log('========================================');
  console.log(' Send Portal Promo to Non-Team Contacts');
  console.log('========================================\n');

  if (isDryRun) {
    console.log('*** DRY RUN MODE — No emails will be sent ***\n');
  }

  // 1. Fetch all contacts from GHL
  const allContacts = await fetchAllContacts();

  // 2. Filter: exclude team members, DND contacts, and contacts without email
  const excluded: GHLContact[] = [];
  const dndSkipped: GHLContact[] = [];
  const noEmail: GHLContact[] = [];
  const recipients: Array<{ email: string; firstName: string }> = [];

  for (const contact of allContacts) {
    if (!contact.email) {
      noEmail.push(contact);
      continue;
    }

    const email = contact.email.toLowerCase().trim();

    if (SKIP_EMAILS.includes(email)) {
      excluded.push(contact);
      continue;
    }

    if (hasExcludedTag(contact)) {
      excluded.push(contact);
      continue;
    }

    // Skip contacts with DND enabled (global or email-specific)
    if (contact.dnd === true || contact.dndSettings?.Email?.status === 'active') {
      dndSkipped.push(contact);
      continue;
    }

    recipients.push({
      email,
      firstName: contact.firstName || '',
    });
  }

  // Deduplicate by email
  const seen = new Set<string>();
  const uniqueRecipients = recipients.filter(r => {
    if (seen.has(r.email)) return false;
    seen.add(r.email);
    return true;
  });

  // 3. Print summary
  console.log('=== SUMMARY ===');
  console.log(`  Total GHL contacts:    ${allContacts.length}`);
  console.log(`  Excluded (team/tags):  ${excluded.length}`);
  console.log(`  Skipped (DND):         ${dndSkipped.length}`);
  console.log(`  No email address:      ${noEmail.length}`);
  console.log(`  Promo recipients:      ${uniqueRecipients.length}`);
  console.log('');

  // Print excluded contacts for visibility
  if (excluded.length > 0) {
    console.log('--- Excluded contacts (team members) ---');
    for (const c of excluded) {
      const tags = c.tags?.join(', ') || 'none';
      console.log(`  ${c.firstName || ''} ${c.lastName || ''} <${c.email}> [${tags}]`);
    }
    console.log('');
  }

  // Print DND contacts
  if (dndSkipped.length > 0) {
    console.log('--- Skipped contacts (DND enabled) ---');
    for (const c of dndSkipped) {
      console.log(`  ${c.firstName || ''} ${c.lastName || ''} <${c.email}>`);
    }
    console.log('');
  }

  // Print recipients
  console.log('--- Recipients ---');
  for (const r of uniqueRecipients) {
    console.log(`  ${r.firstName || '(no name)'} <${r.email}>`);
  }
  console.log('');

  if (isDryRun) {
    console.log('Dry run complete. No emails sent.');
    console.log('Run without --dry-run to actually send.');
    process.exit(0);
  }

  if (uniqueRecipients.length === 0) {
    console.log('No recipients to send to. Exiting.');
    process.exit(0);
  }

  // 4. Send emails one by one with rate limiting
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < uniqueRecipients.length; i++) {
    const { email, firstName } = uniqueRecipients[i];

    try {
      const result = await sendEmail({
        to: email,
        subject: 'We Just Built Something for Our Agents — Take a Look Inside',
        react: PortalPromoEmail({ firstName: firstName || 'there' }),
        tags: [{ name: 'category', value: 'portal_promo' }],
      });

      if (result.success) {
        sent++;
        process.stdout.write(`\r  Sent ${sent}/${uniqueRecipients.length} (${failed} failed)`);
      } else {
        failed++;
        console.error(`\n  FAILED: ${email} — ${result.error}`);
      }
    } catch (err) {
      failed++;
      console.error(`\n  ERROR: ${email} — ${err instanceof Error ? err.message : err}`);
    }

    // Rate limit delay
    if (i < uniqueRecipients.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_EMAILS_MS));
    }
  }

  console.log(`\n\n=== DONE ===`);
  console.log(`  Sent:   ${sent}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total:  ${uniqueRecipients.length}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
