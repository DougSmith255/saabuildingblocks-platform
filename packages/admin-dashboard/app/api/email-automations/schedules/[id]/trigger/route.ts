// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Email Automation Schedule Manual Trigger API
 *
 * Endpoints:
 * - POST /api/email-automations/schedules/[id]/trigger - Manually trigger a schedule
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { sendBatchEmails, type EmailTemplate } from '@/lib/email-automation-sender';
import { getContactByEmail, type GHLContact } from '@/lib/gohighlevel-email';

// ============================================================================
// Validation Schemas
// ============================================================================

const TriggerScheduleSchema = z.object({
  test_mode: z.boolean().default(false), // If true, only send to test contacts
  test_emails: z.array(z.string().email()).optional(), // Test email addresses
  override_tag: z.string().optional(), // Override GHL tag filter
});

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
// POST - Manually trigger schedule
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = getSupabaseClient();

    // Parse and validate request body
    const body = await request.json();
    const validation = TriggerScheduleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const triggerOptions = validation.data;

    // Fetch schedule with template
    const { data: schedule, error: fetchError } = await supabase
      .from('email_automation_schedules')
      .select(`
        *,
        template:holiday_email_templates(
          id,
          holiday_name,
          holiday_slug,
          subject_line,
          preview_text,
          email_html,
          personalization_tokens,
          category:email_automation_categories(id, name, slug)
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Schedule not found' },
          { status: 404 }
        );
      }

      console.error('Error fetching schedule:', fetchError);
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      );
    }

    // Check if schedule is already processing
    if (schedule.status === 'processing') {
      return NextResponse.json(
        {
          success: false,
          error: 'Schedule is already processing',
        },
        { status: 409 }
      );
    }

    // Update schedule status to processing
    const { error: updateError } = await supabase
      .from('email_automation_schedules')
      .update({
        status: 'processing',
        started_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating schedule status:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    // Fetch contacts from GoHighLevel
    let contacts: GHLContact[] = [];

    if (triggerOptions.test_mode && triggerOptions.test_emails) {
      // Test mode: fetch specific test contacts
      for (const email of triggerOptions.test_emails) {
        try {
          const contact = await getContactByEmail(email);
          if (contact) {
            contacts.push(contact);
          }
        } catch (error) {
          console.error(`Error fetching test contact ${email}:`, error);
        }
      }
    } else {
      // Production mode: fetch contacts with tag filter
      // TODO: Implement bulk contact fetching from GoHighLevel
      // For now, this will be empty and can be implemented later
      console.log('Production contact fetching not yet implemented');
    }

    if (contacts.length === 0) {
      await supabase
        .from('email_automation_schedules')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          emails_sent: 0,
          emails_failed: 0,
        })
        .eq('id', id);

      return NextResponse.json({
        success: true,
        data: {
          schedule_id: id,
          status: 'completed',
          message: 'No contacts found to send emails to',
          totalSent: 0,
          totalFailed: 0,
        },
      });
    }

    // Send batch emails with dynamic typography
    const result = await sendBatchEmails({
      scheduleId: id,
      contacts,
      template: schedule.template as any as EmailTemplate,
      baseTemplate: 'external',
    });

    return NextResponse.json({
      success: result.success,
      data: {
        schedule_id: id,
        status: 'completed',
        test_mode: triggerOptions.test_mode,
        totalSent: result.totalSent,
        totalFailed: result.totalFailed,
        results: result.results,
        message: `Sent ${result.totalSent} emails successfully, ${result.totalFailed} failed`,
      },
    });
  } catch (error) {
    console.error('Schedule trigger error:', error);

    // Revert schedule status on error
    try {
      const supabase = getSupabaseClient();
      await supabase
        .from('email_automation_schedules')
        .update({
          status: 'failed',
          error_message: 'Failed to trigger schedule',
        })
        .eq('id', id);
    } catch {
      // Ignore revert errors
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
