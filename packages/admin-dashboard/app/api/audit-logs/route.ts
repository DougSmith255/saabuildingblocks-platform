// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Audit Logs API Route
 * Phase 3: Activity Log UI
 *
 * GET /api/audit-logs - Fetch audit logs with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@saa/shared/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (simplified check - enhance with proper role validation)
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Build query
    let query = supabase
      .from('audit_logs')
      .select(
        `
        *,
        user:users!audit_logs_user_id_fkey (
          id,
          email,
          full_name
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false });

    // Apply filters
    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (action) {
      query = query.ilike('event_type', `%${action}%`);
    }

    if (severity) {
      query = query.eq('severity', severity);
    }

    if (startDate) {
      query = query.gte('created_at', new Date(startDate).toISOString());
    }

    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      query = query.lte('created_at', endDateTime.toISOString());
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: logs, error: queryError, count } = await query;

    if (queryError) {
      console.error('Audit logs query error:', queryError);
      return NextResponse.json(
        { error: 'Failed to fetch audit logs' },
        { status: 500 }
      );
    }

    const total = count || 0;
    const page = Math.floor(offset / limit) + 1;
    const hasMore = offset + limit < total;

    return NextResponse.json({
      logs: logs || [],
      total,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error('Audit logs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
