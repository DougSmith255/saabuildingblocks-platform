/**
 * Test Direct Email to Sheldon
 * Sends email directly to sheldontosmart@gmail.com as primary recipient
 * This helps diagnose if the issue is with BCC or with email delivery to that address
 */

import { sendEmailViaGoHighLevel } from './lib/gohighlevel-email';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    console.log('Template found:', template.holiday_name);
    console.log('Subject:', template.subject_line);

    console.log('\n=== SENDING EMAIL DIRECTLY TO SHELDONTOSMART@GMAIL.COM ===');
    console.log('This is a diagnostic test to verify email delivery to this address');
    console.log('Recipient: sheldontosmart@gmail.com (PRIMARY, not BCC)');
    console.log('BCC: doug@smartagentalliance.com (so Doug can verify it was sent)');

    const result = await sendEmailViaGoHighLevel({
      recipientEmail: 'sheldontosmart@gmail.com',
      subject: '[TEST] ' + template.subject_line,
      htmlContent: template.email_html,
    });

    if (result.success) {
      console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
      console.log('Message ID:', result.messageId);
      console.log('Conversation ID:', result.conversationId);
      console.log('\n📧 Check both inboxes:');
      console.log('- sheldontosmart@gmail.com (PRIMARY recipient)');
      console.log('- doug@smartagentalliance.com (BCC copy)');
      console.log('\n🔍 DIAGNOSTIC PURPOSE:');
      console.log('If Sheldon receives this email, the issue is specifically with BCC functionality.');
      console.log('If Sheldon does NOT receive this email, there may be a delivery issue to that address.');
    } else {
      console.error('\n❌ EMAIL SEND FAILED:');
      console.error(result.error);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

sendDirectTestEmail();
