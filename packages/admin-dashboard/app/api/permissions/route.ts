import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * GET /api/permissions
 * List all available permissions grouped by category
 * Access: All authenticated users
 */
export async function GET(request: NextRequest) {
  try {
    // Lazy initialization - create client at runtime, not build time
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: permissions, error } = await supabase
      .from('permissions')
      .select('*')
      .order('resource')
      .order('action');

    if (error) {
      console.error('Error fetching permissions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch permissions' },
        { status: 500 }
      );
    }

    // Group permissions by category based on resource
    const categorized = {
      'User Management': permissions?.filter(p => p.resource === 'users') || [],
      'Role Management': permissions?.filter(p => p.resource === 'roles') || [],
      'Content': permissions?.filter(p => ['dashboard', 'notes', 'reports'].includes(p.resource)) || [],
      'System': permissions?.filter(p => ['settings', 'audit_logs'].includes(p.resource)) || [],
      'Profile': permissions?.filter(p => p.resource === 'profile') || []
    };

    return NextResponse.json({
      success: true,
      permissions: permissions || [],
      categorized
    });
  } catch (error) {
    console.error('Error in GET /api/permissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
