// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Email Automation Schedules API
 *
 * Endpoints:
 * - GET /api/email-automations/schedules - List all schedules
 * - POST /api/email-automations/schedules - Create new schedule (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

const CreateScheduleSchema = z.object({
  template_id: z.string().uuid('Valid template ID required'),
  schedule_name: z.string().min(1, 'Schedule name is required').max(255),
  schedule_year: z.number().int().min(2024).max(2100),
  send_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  send_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:MM:SS format').default('09:00:00'),
  timezone: z.string().default('America/New_York'),
  ghl_tag_filter: z.string().default('active-downline'),
  auto_calculate_date: z.boolean().default(true), // Auto-calculate from template holiday info
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
// GET - List all schedules
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = request.nextUrl;

    // Optional filters
    const templateId = searchParams.get('template_id');
    const status = searchParams.get('status');
    const year = searchParams.get('year');
    const upcoming = searchParams.get('upcoming') === 'true'; // Only future schedules

    let query = supabase
      .from('email_automation_schedules')
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
      .order('send_date', { ascending: true });

    if (templateId) {
      query = query.eq('template_id', templateId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (year) {
      query = query.eq('schedule_year', parseInt(year));
    }

    if (upcoming) {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('send_date', today);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching schedules:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Schedules GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - Create new schedule (admin only)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();

    // Parse and validate request body
    const body = await request.json();
    const validation = CreateScheduleSchema.safeParse(body);

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

    const scheduleData = validation.data;

    // Fetch template to get holiday info
    const { data: template, error: templateError } = await supabase
      .from('holiday_email_templates')
      .select('*')
      .eq('id', scheduleData.template_id)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { success: false, error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    // Calculate send date if auto_calculate_date is true
    let sendDate = scheduleData.send_date;

    if (scheduleData.auto_calculate_date && !scheduleData.send_date) {
      // Use helper function to calculate date
      const { data: calculatedDate, error: calcError } = await supabase
        .rpc('calculate_holiday_date', {
          p_year: scheduleData.schedule_year,
          p_month: template.holiday_month,
          p_day: template.holiday_day,
          p_date_type: template.holiday_date_type,
          p_holiday_slug: template.holiday_slug,
        });

      if (calcError) {
        console.error('Error calculating date:', calcError);
        return NextResponse.json(
          { success: false, error: 'Failed to calculate holiday date' },
          { status: 500 }
        );
      }

      sendDate = calculatedDate;
    }

    if (!sendDate) {
      return NextResponse.json(
        { success: false, error: 'Send date is required when auto_calculate_date is false' },
        { status: 400 }
      );
    }

    // Insert schedule
    const { data, error } = await supabase
      .from('email_automation_schedules')
      .insert([{
        template_id: scheduleData.template_id,
        schedule_name: scheduleData.schedule_name,
        schedule_year: scheduleData.schedule_year,
        send_date: sendDate,
        send_time: scheduleData.send_time,
        timezone: scheduleData.timezone,
        ghl_tag_filter: scheduleData.ghl_tag_filter,
        status: 'scheduled',
      }])
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
      console.error('Error creating schedule:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Schedule created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Schedules POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
