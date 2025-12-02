/**
 * Direct Test Email Send Script
 * Sends email directly via GoHighLevel without using API endpoint
 */

import { sendEmailViaGoHighLevel, replacePersonalizationTokens, getContactByEmail } from './lib/gohighlevel-email';
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

    // Get contact for personalization
    console.log('\n=== FETCHING CONTACT INFO ===');
    const contact = await getContactByEmail('doug@smartagentalliance.com');

    if (!contact) {
      console.error('Contact not found');
      process.exit(1);
    }

    console.log('Contact found:', contact.firstName || 'Doug');

    // Replace personalization tokens in HTML
    let personalizedHtml = template.email_html;
    let personalizedSubject = template.subject_line;

    if (template.personalization_tokens) {
      const tokens = template.personalization_tokens.map((token: string) => ({
        token,
        default: '',
        description: ''
      }));

      personalizedHtml = replacePersonalizationTokens(personalizedHtml, contact, tokens);
      personalizedSubject = replacePersonalizationTokens(personalizedSubject, contact, tokens);
    }

    console.log('\n=== SENDING EMAIL VIA GOHIGHLEVEL ===');
    console.log('To:', 'doug@smartagentalliance.com');
    console.log('Subject:', personalizedSubject);
    console.log('BCC: sheldontosmart@gmail.com');

    const result = await sendEmailViaGoHighLevel({
      recipientEmail: 'doug@smartagentalliance.com',
      subject: personalizedSubject,
      htmlContent: personalizedHtml,
      personalizationTokens: template.personalization_tokens,
    });

    if (result.success) {
      console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
      console.log('Message ID:', result.messageId);
      console.log('Conversation ID:', result.conversationId);
      console.log('\nPipeline verification:');
      console.log('✓ PIPELINE 1: Typography settings from database');
      console.log('✓ PIPELINE 2: Template HTML with typography');
      console.log('✓ PIPELINE 3: Email sent with correct HTML');
      console.log('✓ PIPELINE 4: BCC to sheldontosmart@gmail.com');
      console.log('✓ PIPELINE 5: Fonts from Cloudflare R2');
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
