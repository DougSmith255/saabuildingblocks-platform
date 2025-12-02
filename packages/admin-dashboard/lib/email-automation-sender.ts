/**
 * Email Automation Sender
 *
 * Handles automated email sending with:
 * - Dynamic typography from database settings
 * - Base template rendering (team/external)
 * - Personalization token replacement
 * - GoHighLevel integration
 * - Send log tracking
 */

import { createClient } from '@supabase/supabase-js';
import {
  sendEmailViaGoHighLevel,
  replacePersonalizationTokens,
  getContactByEmail,
  type PersonalizationToken,
  type GHLContact,
} from './gohighlevel-email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// Types
// ============================================================================

export interface EmailTemplate {
  id: string;
  holiday_name: string;
  holiday_slug: string;
  subject_line: string;
  preview_text: string;
  email_html: string;
  personalization_tokens: PersonalizationToken[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface SendAutomatedEmailOptions {
  recipientEmail: string;
  template: EmailTemplate;
  baseTemplate?: 'team' | 'external';
  unsubscribeUrl?: string;
}

export interface SendBatchOptions {
  scheduleId: string;
  contacts: GHLContact[];
  template: EmailTemplate;
  baseTemplate?: 'team' | 'external';
}

// ============================================================================
// Render Email with Dynamic Typography
// ============================================================================

async function renderEmailWithTypography(
  emailBody: string,
  emailTitle: string,
  baseTemplate: 'team' | 'external' = 'external',
  unsubscribeUrl?: string
): Promise<string> {
  // Call the render-template API endpoint
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email-automations/render-template`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baseTemplate,
        emailBody,
        emailTitle,
        unsubscribeUrl,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to render template: ${error.error}`);
  }

  const data = await response.json();
  return data.html;
}

// ============================================================================
// Send Single Automated Email
// ============================================================================

export async function sendAutomatedEmail(
  options: SendAutomatedEmailOptions
): Promise<{
  success: boolean;
  messageId?: string;
  conversationId?: string;
  error?: string;
  sendLogId?: string;
}> {
  try {
    // Fetch contact for personalization
    const contact = await getContactByEmail(options.recipientEmail);

    if (!contact) {
      return {
        success: false,
        error: `Contact not found: ${options.recipientEmail}`,
      };
    }

    // Replace personalization tokens in email body
    const personalizedBody = replacePersonalizationTokens(
      options.template.email_html,
      contact,
      options.template.personalization_tokens
    );

    // Replace personalization tokens in subject
    const personalizedSubject = replacePersonalizationTokens(
      options.template.subject_line,
      contact,
      options.template.personalization_tokens
    );

    // Generate unsubscribe URL if using external template
    const baseTemplate = options.baseTemplate || 'external';
    const unsubscribeUrl =
      baseTemplate === 'external'
        ? options.unsubscribeUrl ||
          `https://smartagentalliance.com/unsubscribe?email=${encodeURIComponent(options.recipientEmail)}`
        : undefined;

    // Render with dynamic typography
    const renderedHtml = await renderEmailWithTypography(
      personalizedBody,
      personalizedSubject,
      baseTemplate,
      unsubscribeUrl
    );

    // Create send log entry
    const { data: sendLog, error: logError } = await supabase
      .from('email_send_logs')
      .insert({
        template_id: options.template.id,
        recipient_email: options.recipientEmail,
        recipient_name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
        subject: personalizedSubject,
        status: 'sending',
      })
      .select()
      .single();

    if (logError) {
      console.error('Error creating send log:', logError);
    }

    // Send via GoHighLevel
    const result = await sendEmailViaGoHighLevel({
      recipientEmail: options.recipientEmail,
      subject: personalizedSubject,
      htmlContent: renderedHtml,
      personalizationTokens: options.template.personalization_tokens,
    });

    // Update send log with result
    if (sendLog) {
      await supabase
        .from('email_send_logs')
        .update({
          status: result.success ? 'sent' : 'failed',
          provider: 'gohighlevel',
          provider_message_id: result.messageId,
          error_message: result.error,
          sent_at: result.success ? new Date().toISOString() : null,
        })
        .eq('id', sendLog.id);
    }

    return {
      ...result,
      sendLogId: sendLog?.id,
    };
  } catch (error) {
    console.error('Error sending automated email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// Send Batch Emails (for schedule triggers)
// ============================================================================

export async function sendBatchEmails(
  options: SendBatchOptions
): Promise<{
  success: boolean;
  totalSent: number;
  totalFailed: number;
  results: Array<{
    email: string;
    success: boolean;
    error?: string;
  }>;
}> {
  const results: Array<{
    email: string;
    success: boolean;
    error?: string;
  }> = [];

  let totalSent = 0;
  let totalFailed = 0;

  // Process contacts sequentially to avoid rate limits
  for (const contact of options.contacts) {
    if (!contact.email) {
      results.push({
        email: 'unknown',
        success: false,
        error: 'No email address',
      });
      totalFailed++;
      continue;
    }

    const result = await sendAutomatedEmail({
      recipientEmail: contact.email,
      template: options.template,
      baseTemplate: options.baseTemplate,
    });

    results.push({
      email: contact.email,
      success: result.success,
      error: result.error,
    });

    if (result.success) {
      totalSent++;
    } else {
      totalFailed++;
    }

    // Add delay between emails to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Update schedule with final counts
  await supabase
    .from('email_automation_schedules')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      emails_sent: totalSent,
      emails_failed: totalFailed,
    })
    .eq('id', options.scheduleId);

  return {
    success: totalFailed === 0,
    totalSent,
    totalFailed,
    results,
  };
}
