// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Email Automation Schedule API (Individual)
 *
 * Endpoints:
 * - GET /api/email-automations/schedules/[id] - Get single schedule
 * - PUT /api/email-automations/schedules/[id] - Update schedule (admin only)
 * - DELETE /api/email-automations/schedules/[id] - Delete schedule (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

const UpdateScheduleSchema = z.object({
  template_id: z.string().uuid().optional(),
  schedule_name: z.string().min(1).max(255).optional(),
  schedule_year: z.number().int().min(2024).max(2100).optional(),
  send_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  send_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
  timezone: z.string().optional(),
  ghl_tag_filter: z.string().optional(),
  status: z.enum(['scheduled', 'processing', 'completed', 'failed', 'cancelled']).optional(),
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
// GET - Get single schedule
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from('email_automation_schedules')
      .select(`
        *,
        template:holiday_email_templates(
          id,
          holiday_name,
          holiday_slug,
          subject_line,
          preview_text,
          category:email_automation_categories(id, name, slug, icon)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Schedule not found' },
          { status: 404 }
        );
      }

      console.error('Error fetching schedule:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Schedule GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT - Update schedule (admin only)
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    // Parse and validate request body
    const body = await request.json();
    const validation = UpdateScheduleSchema.safeParse(body);

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

    const updates = validation.data;

    // If template_id is being updated, verify it exists
    if (updates.template_id) {
      const { data: template, error: templateError } = await supabase
        .from('holiday_email_templates')
        .select('id')
        .eq('id', updates.template_id)
        .single();

      if (templateError || !template) {
        return NextResponse.json(
          { success: false, error: 'Invalid template ID' },
          { status: 400 }
        );
      }
    }

    // Prevent updating schedule if it's already processing or completed
    const { data: currentSchedule } = await supabase
      .from('email_automation_schedules')
      .select('status')
      .eq('id', id)
      .single();

    if (currentSchedule?.status === 'processing') {
      return NextResponse.json(
        { success: false, error: 'Cannot update schedule while processing' },
        { status: 409 }
      );
    }

    // Update schedule
    const { data, error } = await supabase
      .from('email_automation_schedules')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        template:holiday_email_templates(
          id,
          holiday_name,
          holiday_slug,
          subject_line,
          category:email_automation_categories(id, name, slug, icon)
        )
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Schedule not found' },
          { status: 404 }
        );
      }

      console.error('Error updating schedule:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Schedule updated successfully',
    });
  } catch (error) {
    console.error('Schedule PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE - Delete schedule (admin only)
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    // Check schedule status
    const { data: schedule } = await supabase
      .from('email_automation_schedules')
      .select('status')
      .eq('id', id)
      .single();

    if (schedule?.status === 'processing') {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete schedule while processing',
        },
        { status: 409 }
      );
    }

    // Delete schedule (cascade will delete send logs)
    const { error } = await supabase
      .from('email_automation_schedules')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting schedule:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Schedule deleted successfully',
    });
  } catch (error) {
    console.error('Schedule DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
