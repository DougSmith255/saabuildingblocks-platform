// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Email Send Logs API
 *
 * Endpoints:
 * - GET /api/email-automations/send-logs - List send logs (read-only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
// GET - List send logs
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = request.nextUrl;

    // Optional filters
    const scheduleId = searchParams.get('schedule_id');
    const templateId = searchParams.get('template_id');
    const status = searchParams.get('status');
    const contactId = searchParams.get('ghl_contact_id');
    const email = searchParams.get('recipient_email');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('email_send_logs')
      .select(`
        *,
        schedule:email_automation_schedules(
          id,
          schedule_name,
          template:holiday_email_templates(
            id,
            holiday_name,
            holiday_slug
          )
        ),
        template:holiday_email_templates(
          id,
          holiday_name,
          holiday_slug
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (scheduleId) {
      query = query.eq('schedule_id', scheduleId);
    }

    if (templateId) {
      query = query.eq('template_id', templateId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (contactId) {
      query = query.eq('ghl_contact_id', contactId);
    }

    if (email) {
      query = query.ilike('recipient_email', `%${email}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching send logs:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      count,
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: count ? offset + limit < count : false,
      },
    });
  } catch (error) {
    console.error('Send logs GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
