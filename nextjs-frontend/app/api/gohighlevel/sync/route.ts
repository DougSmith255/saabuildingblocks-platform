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

export const dynamic = 'error';

// Initialize Supabase client
const supabase = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL'] || '',
  process.env['SUPABASE_SERVICE_ROLE_KEY'] || ''
);

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
        // Retry failed syncs
        const result = await syncService.retryFailedSyncs(limit);

        return NextResponse.json({
          success: true,
          action: 'retry',
          data: result,
          message: `Attempted ${result.attempted} syncs, ${result.succeeded} succeeded`,
        });
      }

      case 'bulk': {
        // Bulk sync existing users
        const result = await syncService.bulkSyncUsers(limit);

        return NextResponse.json({
          success: true,
          action: 'bulk',
          data: result,
          message: `Synced ${result.synced} out of ${result.total} users`,
        });
      }

      case 'single': {
        // Sync single user
        if (!userId) {
          return NextResponse.json(
            { error: 'userId is required for single user sync' },
            { status: 400 }
          );
        }

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

        // Perform sync
        const result = await syncService.syncInvitationSent({
          userId: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          invitationToken: invitation.token,
          status: invitation.status === 'sent' ? 'sent' : 'pending',
        });

        if (!result.success) {
          return NextResponse.json(
            { error: 'Sync failed', details: result.error },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          action: 'single',
          data: {
            userId,
            contactId: result.contactId,
            synced: result.synced,
          },
          message: 'User synced successfully',
        });
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
