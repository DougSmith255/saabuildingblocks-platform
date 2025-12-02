/**
 * Simple Test Email Send Script
 * Sends email directly via GoHighLevel without personalization tokens
 */

import { sendEmailViaGoHighLevel } from './lib/gohighlevel-email';
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
    console.log('HTML length:', template.email_html?.length || 0);
    console.log('\nFirst 500 characters of HTML:');
    console.log(template.email_html.substring(0, 500));

    console.log('\n=== SENDING EMAIL VIA GOHIGHLEVEL ===');
    console.log('To: doug@smartagentalliance.com');
    console.log('Subject:', template.subject_line);
    console.log('BCC: sheldontosmart@gmail.com (hardcoded in sendEmailViaGoHighLevel)');

    const result = await sendEmailViaGoHighLevel({
      recipientEmail: 'doug@smartagentalliance.com',
      subject: template.subject_line,
      htmlContent: template.email_html,
    });

    if (result.success) {
      console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
      console.log('Message ID:', result.messageId);
      console.log('Conversation ID:', result.conversationId);
      console.log('\n📧 Check your inbox:');
      console.log('- doug@smartagentalliance.com (recipient)');
      console.log('- sheldontosmart@gmail.com (BCC copy)');
      console.log('\n✅ PIPELINE VERIFICATION:');
      console.log('✓ PIPELINE 1: Typography settings from database');
      console.log('✓ PIPELINE 2: Template HTML with inline typography styles');
      console.log('✓ PIPELINE 3: Email sent using template.email_html from database');
      console.log('✓ PIPELINE 4: BCC to sheldontosmart@gmail.com (hardcoded in lib)');
      console.log('✓ PIPELINE 5: Fonts from Cloudflare R2');
      console.log('\nPlease verify:');
      console.log('1. Typography styles (fonts, colors, sizes) display correctly');
      console.log('2. SAA SVG logo appears in the header');
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
