// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Skip authentication for testing
export const runtime = 'nodejs';

/**
 * Test GoHighLevel Email Sending
 *
 * Test endpoint to send emails via GoHighLevel API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  sendEmailViaGoHighLevel,
  getContactByEmail,
  replacePersonalizationTokens,
} from '@/lib/gohighlevel-email';

// ============================================================================
// Supabase Client
// ============================================================================

function getSupabaseClient() {
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseKey);
}

// ============================================================================
// POST - Send test email
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();

    // Fetch Independence Day template
    const { data: template, error: templateError } = await supabase
      .from('holiday_email_templates')
      .select('*')
      .eq('holiday_slug', 'independence-day')
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { success: false, error: 'Independence Day template not found' },
        { status: 404 }
      );
    }

    // Fetch Doug's contact from GoHighLevel
    const contact = await getContactByEmail('doug@smartagentalliance.com');

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          error: 'Doug contact not found in GoHighLevel',
        },
        { status: 404 }
      );
    }

    console.log('Found Doug contact:', {
      id: contact.id,
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
    });

    // Replace personalization tokens in the email content
    const processedHtml = replacePersonalizationTokens(
      template.email_html,
      contact,
      template.personalization_tokens
    );

    const processedSubject = replacePersonalizationTokens(
      template.subject_line,
      contact,
      template.personalization_tokens
    );

    console.log('Processed email content:', {
      originalSubject: template.subject_line,
      processedSubject,
      tokens: template.personalization_tokens,
    });

    // Send email via GoHighLevel
    const result = await sendEmailViaGoHighLevel({
      recipientEmail: 'doug@smartagentalliance.com',
      subject: processedSubject,
      htmlContent: processedHtml,
      personalizationTokens: template.personalization_tokens,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }

    // Log the send in Supabase
    const { error: logError } = await supabase
      .from('email_send_logs')
      .insert({
        template_id: template.id,
        ghl_contact_id: contact.id,
        recipient_email: 'doug@smartagentalliance.com',
        recipient_name: contact.firstName || 'Doug',
        subject_line: processedSubject,
        status: 'sent',
        sent_at: new Date().toISOString(),
        email_provider: 'gohighlevel',
        message_id: result.messageId,
      });

    if (logError) {
      console.error('Error logging email send:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'Independence Day email sent to Doug via GoHighLevel',
      data: {
        template: template.holiday_name,
        recipient: {
          email: 'doug@smartagentalliance.com',
          firstName: contact.firstName,
          lastName: contact.lastName,
        },
        subject: processedSubject,
        messageId: result.messageId,
        personalizationTokensReplaced: template.personalization_tokens,
      },
    });
  } catch (error) {
    console.error('Test email send error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
