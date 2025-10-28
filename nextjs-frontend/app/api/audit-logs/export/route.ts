// Force dynamic rendering - exclude from static export
export const dynamic = 'error';

/**
 * Audit Logs Export API Route
 * Phase 3: Activity Log UI
 *
 * GET /api/audit-logs/export - Export audit logs to CSV
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    // Check if user is admin
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

    // Parse query parameters (same filters as main API)
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const severity = searchParams.get('severity');

    // Build query (no pagination for export - get all matching records)
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
      `
      )
      .order('created_at', { ascending: false })
      .limit(10000); // Safety limit

    // Apply filters
    if (userId) query = query.eq('user_id', userId);
    if (action) query = query.ilike('event_type', `%${action}%`);
    if (severity) query = query.eq('severity', severity);
    if (startDate)
      query = query.gte('created_at', new Date(startDate).toISOString());
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      query = query.lte('created_at', endDateTime.toISOString());
    }

    // Execute query
    const { data: logs, error: queryError } = await query;

    if (queryError) {
      console.error('Export query error:', queryError);
      return NextResponse.json(
        { error: 'Failed to export audit logs' },
        { status: 500 }
      );
    }

    // Convert to CSV
    const headers = [
      'Timestamp',
      'User Email',
      'User Name',
      'Event Type',
      'Category',
      'Severity',
      'Description',
      'IP Address',
      'User Agent',
      'Success',
      'Error Message',
    ];

    const rows = (logs || []).map((log: any) => [
      log.created_at,
      log.user?.email || 'N/A',
      log.user?.full_name || 'N/A',
      log.event_type,
      log.event_category,
      log.severity,
      log.description || '',
      log.ip_address || 'N/A',
      log.user_agent || 'N/A',
      log.success ? 'Success' : 'Failed',
      log.error_message || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) =>
        row
          .map((cell) =>
            typeof cell === 'string' &&
            (cell.includes(',') || cell.includes('"'))
              ? `"${cell.replace(/"/g, '""')}"`
              : cell
          )
          .join(',')
      ),
    ].join('\n');

    // Return CSV file
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `audit-logs-${timestamp}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
