// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Email Send Log API (Individual)
 *
 * Endpoints:
 * - GET /api/email-automations/send-logs/[id] - Get single send log (read-only)
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
// GET - Get single send log
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from('email_send_logs')
      .select(`
        *,
        schedule:email_automation_schedules(
          id,
          schedule_name,
          send_date,
          send_time,
          template:holiday_email_templates(
            id,
            holiday_name,
            holiday_slug,
            subject_line
          )
        ),
        template:holiday_email_templates(
          id,
          holiday_name,
          holiday_slug,
          subject_line
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Send log not found' },
          { status: 404 }
        );
      }

      console.error('Error fetching send log:', error);
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
    console.error('Send log GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
