/**
 * Test Email Send Script
 * Sends a test email using the email automation sender to verify all pipelines
 */

import { sendAutomatedEmail } from './lib/email-automation-sender';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendTestEmail() {
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

    console.log('\n=== SENDING TEST EMAIL ===');

    const result = await sendAutomatedEmail({
      recipientEmail: 'doug@smartagentalliance.com',
      template: template,
    });

    if (result.success) {
      console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
      console.log('Message ID:', result.messageId);
      console.log('Conversation ID:', result.conversationId);
      console.log('\nEmail sent to:');
      console.log('- doug@smartagentalliance.com (recipient)');
      console.log('- sheldontosmart@gmail.com (BCC)');
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

sendTestEmail();
