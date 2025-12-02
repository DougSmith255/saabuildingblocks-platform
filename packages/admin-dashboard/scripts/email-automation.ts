#!/usr/bin/env tsx
/**
 * Email Automation Script
 *
 * Runs daily at 4:00 AM PST to:
 * 1. Check for holidays happening today
 * 2. Fetch all contacts from GoHighLevel
 * 3. Calculate timezone for each contact based on location
 * 4. Queue emails to send at 9:30-10:00 AM in each contact's local timezone
 */

import { createClient } from '@supabase/supabase-js';
import {
  sendEmailViaGoHighLevel,
  getContactByEmail,
} from '../lib/gohighlevel-email';
import { assembleEmail } from '../lib/email-template-merger';

// ============================================================================
// Configuration
// ============================================================================

const SUPABASE_URL = process.env['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'];
const GHL_API_KEY = process.env['GHL_API_KEY'];
const GHL_LOCATION_ID = process.env['GHL_LOCATION_ID'] || 'wmYRsn57bNL8Z2tMlIZ7';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

if (!GHL_API_KEY) {
  console.error('❌ Missing GHL_API_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================================
// Timezone Mappings
// ============================================================================

// US State to Timezone mapping
const US_STATE_TIMEZONES: Record<string, string> = {
  // Eastern Time
  'Connecticut': 'America/New_York',
  'Delaware': 'America/New_York',
  'Florida': 'America/New_York', // Most of FL is EST
  'Georgia': 'America/New_York',
  'Maine': 'America/New_York',
  'Maryland': 'America/New_York',
  'Massachusetts': 'America/New_York',
  'Michigan': 'America/Detroit',
  'New Hampshire': 'America/New_York',
  'New Jersey': 'America/New_York',
  'New York': 'America/New_York',
  'North Carolina': 'America/New_York',
  'Ohio': 'America/New_York',
  'Pennsylvania': 'America/New_York',
  'Rhode Island': 'America/New_York',
  'South Carolina': 'America/New_York',
  'Vermont': 'America/New_York',
  'Virginia': 'America/New_York',
  'West Virginia': 'America/New_York',

  // Central Time
  'Alabama': 'America/Chicago',
  'Arkansas': 'America/Chicago',
  'Illinois': 'America/Chicago',
  'Indiana': 'America/Indiana/Indianapolis', // Most of IN is EST but some CST
  'Iowa': 'America/Chicago',
  'Kansas': 'America/Chicago',
  'Kentucky': 'America/Kentucky/Louisville',
  'Louisiana': 'America/Chicago',
  'Minnesota': 'America/Chicago',
  'Mississippi': 'America/Chicago',
  'Missouri': 'America/Chicago',
  'Nebraska': 'America/Chicago',
  'North Dakota': 'America/Chicago',
  'Oklahoma': 'America/Chicago',
  'South Dakota': 'America/Chicago',
  'Tennessee': 'America/Chicago',
  'Texas': 'America/Chicago',
  'Wisconsin': 'America/Chicago',

  // Mountain Time
  'Arizona': 'America/Phoenix', // No DST
  'Colorado': 'America/Denver',
  'Idaho': 'America/Boise',
  'Montana': 'America/Denver',
  'Nevada': 'America/Los_Angeles', // Most of NV is PST
  'New Mexico': 'America/Denver',
  'Utah': 'America/Denver',
  'Wyoming': 'America/Denver',

  // Pacific Time
  'California': 'America/Los_Angeles',
  'Oregon': 'America/Los_Angeles',
  'Washington': 'America/Los_Angeles',

  // Alaska & Hawaii
  'Alaska': 'America/Anchorage',
  'Hawaii': 'Pacific/Honolulu',
};

// Country to default timezone mapping
const COUNTRY_TIMEZONES: Record<string, string> = {
  'United States': 'America/New_York', // Default to EST
  'USA': 'America/New_York',
  'US': 'America/New_York',
  'Canada': 'America/Toronto',
  'United Kingdom': 'Europe/London',
  'UK': 'Europe/London',
  'Australia': 'Australia/Sydney',
  'New Zealand': 'Pacific/Auckland',
  'Germany': 'Europe/Berlin',
  'France': 'Europe/Paris',
  'Spain': 'Europe/Madrid',
  'Italy': 'Europe/Rome',
  'Mexico': 'America/Mexico_City',
  'Brazil': 'America/Sao_Paulo',
  'Japan': 'Asia/Tokyo',
  'China': 'Asia/Shanghai',
  'India': 'Asia/Kolkata',
};

// ============================================================================
// Helper Functions
// ============================================================================

function getTimezoneForContact(contact: any): string {
  // Priority 1: US State
  if (contact.state) {
    const timezone = US_STATE_TIMEZONES[contact.state];
    if (timezone) {
      console.log(`  📍 ${contact.email}: ${contact.state} → ${timezone}`);
      return timezone;
    }
  }

  // Priority 2: Country
  if (contact.country) {
    const timezone = COUNTRY_TIMEZONES[contact.country];
    if (timezone) {
      console.log(`  📍 ${contact.email}: ${contact.country} → ${timezone}`);
      return timezone;
    }
  }

  // Default: PST
  console.log(`  ⚠️  ${contact.email}: No location data, defaulting to PST`);
  return 'America/Los_Angeles';
}

function calculateSendDelay(timezone: string): number {
  const now = new Date();

  // Get current time in the target timezone
  const targetTime = new Date(
    now.toLocaleString('en-US', { timeZone: timezone })
  );

  // Set target to 9:30 AM in their timezone
  const sendTime = new Date(targetTime);
  sendTime.setHours(9, 30, 0, 0);

  // If 9:30 AM has already passed today, don't send
  if (sendTime < targetTime) {
    console.log(`  ⏰ ${timezone}: 9:30 AM already passed, skipping`);
    return -1;
  }

  // Calculate delay in milliseconds
  const delay = sendTime.getTime() - now.getTime();
  const hours = Math.floor(delay / (1000 * 60 * 60));
  const minutes = Math.floor((delay % (1000 * 60 * 60)) / (1000 * 60));

  console.log(`  ⏰ ${timezone}: Send in ${hours}h ${minutes}m`);
  return delay;
}

async function getAllContacts(): Promise<any[]> {
  const accessToken = GHL_API_KEY;

  console.log('📋 Fetching all contacts from GoHighLevel...');

  const response = await fetch(
    `https://services.leadconnectorhq.com/contacts/?locationId=${GHL_LOCATION_ID}&limit=100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Version: '2021-07-28',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch contacts: ${response.status}`);
  }

  const data = await response.json();
  console.log(`✅ Found ${data.contacts?.length || 0} contacts`);

  return data.contacts || [];
}

function calculateHolidayDate(
  month: number,
  day: number | null,
  dateType: string,
  year: number
): Date | null {
  if (dateType === 'fixed' && day) {
    return new Date(year, month - 1, day);
  }

  // For floating holidays (e.g., "2nd Monday of May")
  // We'll handle this later if needed
  return null;
}

// ============================================================================
// Main Automation Logic
// ============================================================================

async function main() {
  console.log('🚀 Email Automation Starting...');
  console.log(`   Time: ${new Date().toISOString()}`);
  console.log('');

  try {
    // 1. Check for today's holidays
    console.log('📅 Checking for holidays today...');

    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JS months are 0-indexed
    const currentDay = today.getDate();

    const { data: templates, error: templatesError } = await supabase
      .from('holiday_email_templates')
      .select('*')
      .eq('is_active', true)
      .eq('holiday_month', currentMonth)
      .eq('holiday_day', currentDay);

    if (templatesError) {
      throw new Error(`Failed to fetch templates: ${templatesError.message}`);
    }

    if (!templates || templates.length === 0) {
      console.log('ℹ️  No holidays today - nothing to send');
      return;
    }

    console.log(`✅ Found ${templates.length} holiday(s) today:`);
    templates.forEach((t) => console.log(`   - ${t.holiday_name}`));
    console.log('');

    // 2. Fetch all contacts
    const contacts = await getAllContacts();

    if (contacts.length === 0) {
      console.log('⚠️  No contacts found - nothing to send');
      return;
    }

    console.log('');

    // 3. Process each template
    for (const template of templates) {
      console.log(`📧 Processing: ${template.holiday_name}`);
      console.log('');

      let sentCount = 0;
      let skippedCount = 0;

      // 4. Send to each contact
      for (const contact of contacts) {
        if (!contact.email) {
          console.log(`  ⚠️  Skipping contact with no email`);
          skippedCount++;
          continue;
        }

        // Get timezone for contact
        const timezone = getTimezoneForContact(contact);

        // Calculate when to send
        const delay = calculateSendDelay(timezone);

        if (delay < 0) {
          skippedCount++;
          continue;
        }

        // Queue the email
        setTimeout(async () => {
          try {
            console.log(`  📤 Sending to ${contact.email}...`);

            // Assemble email with base template (header/footer)
            const finalHtml = await assembleEmail({
              contactEmail: contact.email,
              contactTags: contact.tags || [],
              emailTitle: template.subject_line,
              emailBody: template.email_html,
              ghlLocationId: GHL_LOCATION_ID,
            });

            const result = await sendEmailViaGoHighLevel({
              recipientEmail: contact.email,
              subject: template.subject_line,
              htmlContent: finalHtml,
              personalizationTokens: template.personalization_tokens,
            });

            if (result.success) {
              // Log to database
              await supabase.from('email_send_logs').insert({
                template_id: template.id,
                ghl_contact_id: contact.id,
                recipient_email: contact.email,
                recipient_name: contact.firstName || contact.email,
                subject_line: template.subject_line,
                status: 'sent',
                sent_at: new Date().toISOString(),
                email_provider: 'gohighlevel',
                message_id: result.messageId,
              });

              console.log(`  ✅ Sent to ${contact.email}`);
            } else {
              console.error(`  ❌ Failed to send to ${contact.email}: ${result.error}`);

              // Log failure
              await supabase.from('email_send_logs').insert({
                template_id: template.id,
                ghl_contact_id: contact.id,
                recipient_email: contact.email,
                recipient_name: contact.firstName || contact.email,
                subject_line: template.subject_line,
                status: 'failed',
                sent_at: new Date().toISOString(),
                email_provider: 'gohighlevel',
              });
            }
          } catch (error) {
            console.error(`  ❌ Error sending to ${contact.email}:`, error);
          }
        }, delay);

        sentCount++;
      }

      console.log('');
      console.log(`📊 Summary for ${template.holiday_name}:`);
      console.log(`   - Queued: ${sentCount}`);
      console.log(`   - Skipped: ${skippedCount}`);
      console.log('');
    }

    console.log('✅ Email automation completed successfully!');
    console.log('   All emails queued and will send at scheduled times');

  } catch (error) {
    console.error('❌ Email automation failed:', error);
    process.exit(1);
  }
}

// Run the automation
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
