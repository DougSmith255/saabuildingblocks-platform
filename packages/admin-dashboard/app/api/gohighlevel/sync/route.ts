/**
 * GoHighLevel Sync Management API
 * POST /api/gohighlevel/sync
 *
 * Administrative endpoints for managing GHL sync operations:
 * - Retry failed syncs
 * - Bulk sync existing users
 * - Manual sync for specific user
 *
 * Security: Requires admin authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContactSyncService } from '@/lib/gohighlevel';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/**
 * POST /api/gohighlevel/sync
 *
 * Request body:
 * - action: 'retry' | 'bulk' | 'single'
 * - limit: number (for retry and bulk operations)
 * - userId: string (for single user sync)
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { action, limit = 10, userId } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    const syncService = getContactSyncService();

    switch (action) {
      case 'retry': {
        // TODO: Implement retryFailedSyncs in service
        return NextResponse.json({
          success: false,
          action: 'retry',
          error: 'Retry functionality not yet implemented',
        }, { status: 501 });
      }

      case 'bulk': {
        // TODO: Implement bulkSyncUsers in service
        return NextResponse.json({
          success: false,
          action: 'bulk',
          error: 'Bulk sync functionality not yet implemented',
        }, { status: 501 });
      }

      case 'single': {
        // Sync single user
        if (!userId) {
          return NextResponse.json(
            { error: 'userId is required for single user sync' },
            { status: 400 }
          );
        }

        // Lazy initialization - create client at runtime, not build time
        const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] || '';
        const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || '';
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Get user data
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, phone, gohighlevel_contact_id')
          .eq('id', userId)
          .single();

        if (userError || !user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Get invitation data
        const { data: invitation, error: invitationError } = await supabase
          .from('user_invitations')
          .select('token, status')
          .eq('user_id', userId)
          .single();

        if (invitationError || !invitation) {
          return NextResponse.json(
            { error: 'Invitation not found' },
            { status: 404 }
          );
        }

        // TODO: Implement syncInvitationSent in service
        return NextResponse.json({
          success: false,
          action: 'single',
          error: 'Single user sync functionality not yet implemented',
        }, { status: 501 });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gohighlevel/sync
 *
 * Get sync status and statistics
 */
export async function GET() {
  try {
    // Lazy initialization - create client at runtime, not build time
    const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] || '';
    const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get sync statistics
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: syncedUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .not('gohighlevel_contact_id', 'is', null);

    const { count: pendingUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .is('gohighlevel_contact_id', null);

    return NextResponse.json({
      success: true,
      data: {
        total: totalUsers || 0,
        synced: syncedUsers || 0,
        pending: pendingUsers || 0,
        syncRate: totalUsers ? ((syncedUsers || 0) / totalUsers) * 100 : 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch sync statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
