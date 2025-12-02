// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Email Send Logs Statistics API
 *
 * Endpoints:
 * - GET /api/email-automations/send-logs/statistics - Get aggregated statistics
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
// GET - Get statistics
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = request.nextUrl;

    // Optional filters
    const scheduleId = searchParams.get('schedule_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Use the helper function from migration 004
    const { data, error } = await supabase
      .rpc('get_send_logs_summary', {
        p_schedule_id: scheduleId || null,
        p_start_date: startDate || null,
        p_end_date: endDate || null,
      });

    if (error) {
      console.error('Error fetching statistics:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Fetch email_send_stats view for schedule-specific stats
    let statsQuery = supabase
      .from('email_send_stats')
      .select('*');

    if (scheduleId) {
      statsQuery = statsQuery.eq('schedule_id', scheduleId);
    }

    const { data: scheduleStats, error: statsError } = await statsQuery;

    if (statsError) {
      console.error('Error fetching schedule stats:', statsError);
    }

    // Get status breakdown
    let statusQuery = supabase
      .from('email_send_logs')
      .select('status');

    if (scheduleId) {
      statusQuery = statusQuery.eq('schedule_id', scheduleId);
    }

    if (startDate) {
      statusQuery = statusQuery.gte('created_at', startDate);
    }

    if (endDate) {
      statusQuery = statusQuery.lte('created_at', endDate);
    }

    const { data: statusData, error: statusError } = await statusQuery;

    if (statusError) {
      console.error('Error fetching status breakdown:', statusError);
    }

    // Calculate status breakdown
    const statusBreakdown = statusData?.reduce((acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Get provider breakdown
    let providerQuery = supabase
      .from('email_send_logs')
      .select('email_provider, status');

    if (scheduleId) {
      providerQuery = providerQuery.eq('schedule_id', scheduleId);
    }

    if (startDate) {
      providerQuery = providerQuery.gte('created_at', startDate);
    }

    if (endDate) {
      providerQuery = providerQuery.lte('created_at', endDate);
    }

    const { data: providerData, error: providerError } = await providerQuery;

    if (providerError) {
      console.error('Error fetching provider breakdown:', providerError);
    }

    // Calculate provider breakdown
    const providerBreakdown = providerData?.reduce((acc, log) => {
      const provider = log.email_provider || 'unknown';
      if (!acc[provider]) {
        acc[provider] = { total: 0, sent: 0, failed: 0 };
      }
      acc[provider].total++;
      if (log.status === 'sent' || log.status === 'delivered') {
        acc[provider].sent++;
      } else if (log.status === 'failed' || log.status === 'bounced') {
        acc[provider].failed++;
      }
      return acc;
    }, {} as Record<string, { total: number; sent: number; failed: number }>) || {};

    return NextResponse.json({
      success: true,
      data: {
        summary: data?.[0] || {
          total_emails: 0,
          sent_count: 0,
          delivered_count: 0,
          bounced_count: 0,
          failed_count: 0,
          pending_count: 0,
          success_rate: 0,
          avg_retry_count: 0,
        },
        status_breakdown: statusBreakdown,
        provider_breakdown: providerBreakdown,
        schedule_stats: scheduleStats || [],
      },
    });
  } catch (error) {
    console.error('Statistics GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
