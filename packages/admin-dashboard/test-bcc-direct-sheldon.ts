/**
 * Direct BCC Test - Send to Sheldon as primary, Doug as BCC
 * This diagnostic test swaps the recipient and BCC to determine if:
 * 1. GoHighLevel BCC functionality works at all
 * 2. There's a specific issue with sheldontosmart@gmail.com delivery
 */

import { createClient } from '@supabase/supabase-js';
import { getContactByEmail, getGHLAccessToken } from './lib/gohighlevel-email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GHL_API_KEY = process.env['GHL_API_KEY'];

async function getAccessToken(): Promise<string> {
  if (GHL_API_KEY) {
    return GHL_API_KEY;
  }
  throw new Error('GHL_API_KEY not found in environment');
}

async function sendBCCDiagnosticEmail() {
  try {
    console.log('=== FETCHING NEW YEAR\'S DAY TEMPLATE ===');

    // Fetch New Year's Day template
    const { data: template, error: templateError } = await supabase
      .from('holiday_email_templates')
      .select('*')
      .eq('holiday_slug', 'new-years-day')
      .single();

    if (templateError || !template) {
      console.error('Failed to fetch template:', templateError);
      process.exit(1);
    }

    console.log('Template found:', template.holiday_name);
    console.log('Subject:', template.subject_line);

    console.log('\n=== GETTING CONTACT FOR SHELDON ===');
    // We need to use sheldontosmart@gmail.com for the contactId lookup
    // This will fail if there's no contact with that email

    const accessToken = await getAccessToken();
    console.log('Got access token');

    // Try to get contact for sheldontosmart@gmail.com
    const response = await fetch(
      `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=wmYRsn57bNL8Z2tMlIZ7&email=${encodeURIComponent('sheldontosmart@gmail.com')}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Version: '2021-07-28',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch contact:', response.statusText);
      console.log('\n⚠️  ISSUE: No contact found for sheldontosmart@gmail.com in GoHighLevel');
      console.log('This is likely why BCC is not working.');
      console.log('GoHighLevel may not send emails to addresses not in the contact list.');
      process.exit(1);
    }

    const data = await response.json();
    const contact = data.contact;

    if (!contact) {
      console.error('\\n⚠️  ISSUE: No contact found for sheldontosmart@gmail.com');
      console.log('This explains why BCC is not working!');
      console.log('GoHighLevel requires the email address to be a valid contact in the system.');
      console.log('\\nSOLUTION: Add sheldontosmart@gmail.com as a contact in GoHighLevel.');
      process.exit(1);
    }

    console.log('Contact found:', contact.firstName || contact.email);
    console.log('Contact ID:', contact.id);

    console.log('\\n=== SENDING TEST EMAIL ===');
    console.log('PRIMARY RECIPIENT: sheldontosmart@gmail.com');
    console.log('BCC: doug@smartagentalliance.com');
    console.log('Purpose: Test if BCC works when reversed');

    const emailResponse = await fetch(
      `https://services.leadconnectorhq.com/conversations/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Version: '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'Email',
          contactId: contact.id,
          subject: '[BCC TEST] ' + template.subject_line,
          html: template.email_html,
          emailFrom: 'doug@smartagentalliance.com',
          bcc: ['doug@smartagentalliance.com'],
        }),
      }
    );

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('\n❌ EMAIL SEND FAILED:');
      console.error(`Status: ${emailResponse.status}`);
      console.error('Error:', errorText);
      process.exit(1);
    }

    const emailData = await emailResponse.json();
    console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
    console.log('Message ID:', emailData.messageId);
    console.log('Conversation ID:', emailData.conversationId);
    console.log('\n📧 Check both inboxes:');
    console.log('- sheldontosmart@gmail.com (PRIMARY recipient)');
    console.log('- doug@smartagentalliance.com (BCC copy)');
    console.log('\n🔍 DIAGNOSTIC RESULTS:');
    console.log('If Doug receives the BCC, then BCC functionality works in GoHighLevel.');
    console.log('If Sheldon receives the primary email, delivery to that address works.');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

sendBCCDiagnosticEmail();
