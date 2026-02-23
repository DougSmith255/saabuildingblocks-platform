/**
 * Send announcement email to all active downline agents from GoHighLevel
 *
 * 1. Uses GHL v2 API query to find contacts with "Active Downline" tag
 * 2. Sends announcement email via Resend to each contact
 * 3. Also sends to karrie@smartagentalliance.com
 *
 * Run with:
 *   cd packages/admin-dashboard && \
 *   export $(grep '^RESEND_API_KEY=' .env.local) && \
 *   export $(grep '^GOHIGHLEVEL_API_KEY=' .env.local) && \
 *   export $(grep '^GOHIGHLEVEL_LOCATION_ID=' .env.local) && \
 *   NODE_ENV=production npx tsx scripts/send-announcement-to-downline.ts
 *
 * Dry run (no emails sent):
 *   ... same as above ... --dry-run
 */

import { sendEmail } from '../lib/email/client';
import { AnnouncementEmail } from '../lib/email/templates/AnnouncementEmail';

// GHL v2 API
const GHL_API_KEY = process.env.GOHIGHLEVEL_API_KEY!;
const GHL_BASE_URL = 'https://services.leadconnectorhq.com';
const GHL_LOCATION_ID = process.env.GOHIGHLEVEL_LOCATION_ID!;
const GHL_API_VERSION = '2021-07-28';

const ACTIVE_DOWNLINE_TAGS = ['active downline', 'active-downline'];
const EXTRA_RECIPIENTS = ['karrie@smartagentalliance.com'];

// Skip these emails
const SKIP_EMAILS = ['doug@smartagentalliance.com', 'jane.smith@exprealty.com', 'karrie.hill@exprealty.com'];

// Resend rate limit: be conservative
const DELAY_BETWEEN_EMAILS_MS = 600;

interface GHLContact {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  tags?: string[];
}

const isDryRun = process.argv.includes('--dry-run');

async function fetchActiveDownlineContacts(): Promise<GHLContact[]> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    throw new Error('Missing GOHIGHLEVEL_API_KEY or GOHIGHLEVEL_LOCATION_ID. Export from .env.local first.');
  }

  const allContacts: GHLContact[] = [];
  let startAfterId: string | undefined;
  const limit = 100;

  console.log('Fetching "Active Downline" contacts from GoHighLevel...\n');

  while (true) {
    const params = new URLSearchParams({
      locationId: GHL_LOCATION_ID,
      query: 'Active Downline',
      limit: String(limit),
    });
    if (startAfterId) {
      params.set('startAfterId', startAfterId);
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

    // Double-check: only include contacts that actually have the active downline tag
    const verified = contacts.filter(c =>
      c.tags?.some(t => ACTIVE_DOWNLINE_TAGS.includes(t.toLowerCase()))
    );
    allContacts.push(...verified);

    process.stdout.write(`\r  Fetched ${allContacts.length} active downline contacts...`);

    if (contacts.length < limit) break;

    // Pagination
    const meta = data.meta;
    if (meta?.startAfterId) {
      startAfterId = meta.startAfterId;
    } else {
      break;
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n  Total active downline contacts: ${allContacts.length}\n`);
  return allContacts;
}

async function main() {
  console.log('========================================');
  console.log(' Send Announcement to Active Downline');
  console.log('========================================\n');

  if (isDryRun) {
    console.log('*** DRY RUN MODE - No emails will be sent ***\n');
  }

  // 1. Fetch active downline contacts from GHL
  const downlineContacts = await fetchActiveDownlineContacts();

  // 2. Build recipient list
  const recipients: Array<{ email: string; firstName: string }> = [];

  for (const contact of downlineContacts) {
    if (contact.email) {
      const email = contact.email.toLowerCase().trim();
      if (!SKIP_EMAILS.includes(email)) {
        recipients.push({
          email,
          firstName: contact.firstName || '',
        });
      }
    }
  }

  // Add extra recipients
  for (const extraEmail of EXTRA_RECIPIENTS) {
    if (!recipients.some(r => r.email === extraEmail.toLowerCase())) {
      recipients.push({
        email: extraEmail.toLowerCase(),
        firstName: extraEmail === 'karrie@smartagentalliance.com' ? 'Karrie' : '',
      });
    }
  }

  // Deduplicate by email
  const seen = new Set<string>();
  const uniqueRecipients = recipients.filter(r => {
    if (seen.has(r.email)) return false;
    seen.add(r.email);
    return true;
  });

  console.log(`Total unique recipients: ${uniqueRecipients.length}`);
  console.log('---');
  for (const r of uniqueRecipients) {
    console.log(`  ${r.firstName || '(no name)'} <${r.email}>`);
  }
  console.log('---\n');

  if (isDryRun) {
    console.log('Dry run complete. No emails sent.');
    console.log('Run without --dry-run to actually send.');
    process.exit(0);
  }

  // 3. Send emails one by one with delay
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < uniqueRecipients.length; i++) {
    const { email, firstName } = uniqueRecipients[i];

    try {
      const result = await sendEmail({
        to: email,
        subject: 'Big Things Are Coming - Smart Agent Alliance',
        react: AnnouncementEmail({ recipientName: firstName || undefined }),
        tags: [{ name: 'category', value: 'announcement' }],
      });

      if (result.success) {
        sent++;
        process.stdout.write(`\r  Sent ${sent}/${uniqueRecipients.length} (${failed} failed)`);
      } else {
        failed++;
        console.error(`\n  FAILED: ${email} - ${result.error}`);
      }
    } catch (err) {
      failed++;
      console.error(`\n  ERROR: ${email} - ${err instanceof Error ? err.message : err}`);
    }

    // Rate limit delay
    if (i < uniqueRecipients.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_EMAILS_MS));
    }
  }

  console.log(`\n\nDone! ${sent} emails sent, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
