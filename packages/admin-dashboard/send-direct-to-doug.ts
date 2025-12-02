/**
 * Send Test Email Directly to Doug
 * Bypasses the library function and sends directly via GoHighLevel API
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GHL_API_KEY = process.env['GHL_API_KEY'];
const GHL_LOCATION_ID = 'wmYRsn57bNL8Z2tMlIZ7';

async function sendDirectTestEmail() {
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

    console.log('✅ Template found:', template.holiday_name);
    console.log('Subject:', template.subject_line);

    console.log('\n=== FETCHING DOUG\'S CONTACT ===');

    // Get Doug's contact from GoHighLevel
    const contactResponse = await fetch(
      `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${GHL_LOCATION_ID}&email=${encodeURIComponent('doug@smartagentalliance.com')}`,
      {
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          Version: '2021-07-28',
        },
      }
    );

    if (!contactResponse.ok) {
      console.error('Failed to fetch contact:', contactResponse.statusText);
      process.exit(1);
    }

    const contactData = await contactResponse.json();
    const contact = contactData.contact;

    if (!contact) {
      console.error('❌ Contact not found for doug@smartagentalliance.com');
      process.exit(1);
    }

    console.log('✅ Contact found:', contact.firstName || contact.email);
    console.log('Contact ID:', contact.id);

    console.log('\n=== SENDING EMAIL ===');
    console.log('To: doug@smartagentalliance.com');
    console.log('From: doug@smartagentalliance.com');
    console.log('Subject:', '[FONT TEST] ' + template.subject_line);
    console.log('NO BCC - Direct send only');

    // Send email WITHOUT BCC
    const emailResponse = await fetch(
      `https://services.leadconnectorhq.com/conversations/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          Version: '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'Email',
          contactId: contact.id,
          subject: '[FONT TEST] ' + template.subject_line,
          html: template.email_html,
          emailFrom: 'doug@smartagentalliance.com',
          // NO BCC FIELD AT ALL
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
    console.log('\n📧 Check your inbox: doug@smartagentalliance.com');
    console.log('\n🎨 VERIFY:');
    console.log('- Headings should be in Impact font (bold, impactful)');
    console.log('- Body text should be in Lucida Sans Unicode (clean, readable)');
    console.log('- SAA logo should appear in the header');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

sendDirectTestEmail();
