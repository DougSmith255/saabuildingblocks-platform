/**
 * Send Test Email to Both Email Addresses
 *
 * Sends New Year's Day template to:
 * - doug@smartagentalliance.com
 * - sheldontosmart@gmail.com
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GHL_API_KEY = process.env.GHL_API_KEY!;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID!;

async function sendTestEmails() {
  try {
    console.log('=== FETCHING NEW YEAR\'S DAY TEMPLATE ===');

    const { data: template, error: templateError } = await supabase
      .from('holiday_email_templates')
      .select('*')
      .eq('holiday_slug', 'new-years-day')
      .single();

    if (templateError || !template) {
      console.error('❌ Failed to fetch template:', templateError);
      process.exit(1);
    }

    console.log(`✅ Template found: ${template.holiday_name}`);
    console.log(`Subject: ${template.subject_line}\n`);

    // Email addresses to send to
    const emails = [
      { email: 'doug@smartagentalliance.com', name: 'Doug' },
      { email: 'sheldontosmart@gmail.com', name: 'Sheldon' }
    ];

    for (const recipient of emails) {
      console.log(`=== SENDING TO ${recipient.name.toUpperCase()} ===`);
      console.log(`Email: ${recipient.email}`);

      // Send email via GoHighLevel
      const emailPayload = {
        conversationId: 'test-conversation',
        locationId: GHL_LOCATION_ID,
        type: 'Email',
        emailFrom: 'doug@smartagentalliance.com',
        emailTo: recipient.email,
        subject: `[CLEAN TEMPLATE TEST] ${template.subject_line}`,
        html: template.email_html || template.html_template
      };

      const response = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GHL_API_KEY}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        },
        body: JSON.stringify(emailPayload)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`❌ Failed to send to ${recipient.email}:`, result);
      } else {
        console.log(`✅ EMAIL SENT!`);
        console.log(`Message ID: ${result.messageId || 'N/A'}`);
        console.log(`Conversation ID: ${result.conversationId || 'N/A'}\n`);
      }
    }

    console.log('=== TEST COMPLETE ===');
    console.log('\n📧 Check both inboxes:');
    console.log('  - doug@smartagentalliance.com');
    console.log('  - sheldontosmart@gmail.com');
    console.log('\n🔍 VERIFY:');
    console.log('  - No logo/header should appear');
    console.log('  - No "$2" or other artifacts');
    console.log('  - Clean template content only');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

sendTestEmails();
