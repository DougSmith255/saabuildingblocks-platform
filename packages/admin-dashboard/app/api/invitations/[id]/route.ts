/**
 * Invitation Management API Route
 *
 * GET /api/invitations/[id] - Get single invitation (admin only)
 * PATCH /api/invitations/[id] - Update invitation (resend, cancel) (admin only)
 * DELETE /api/invitations/[id] - Delete invitation (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { verifyAdminAuth } from '@/app/api/middleware/adminAuth';
import { updateInvitationSchema } from '@/lib/validation/invitation';
import {
  getInvitationById,
  updateInvitationStatus,
  deleteInvitation,
  createAuditLog,
  getUserById,
} from '@saa/shared/lib/supabase/invitation-service';
import { sendInvitationEmail } from '@/lib/email/send';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

// Next.js 16 requires generateStaticParams for dynamic routes even when excluded
export async function generateStaticParams() {
  return [];
}

/**
 * GET /api/invitations/[id] - Get single invitation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    // Fetch invitation
    const { data: invitation, error: invitationError } = await getInvitationById(
      supabase,
      id
    );

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Fetch associated user
    const { data: user } = await getUserById(supabase, invitation.user_id);

    return NextResponse.json({
      success: true,
      data: {
        ...invitation,
        user: user || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/invitations/[id] - Update invitation (resend or cancel)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    let validatedData;

    try {
      validatedData = updateInvitationSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.issues },
          { status: 400 }
        );
      }
      throw error;
    }

    // Fetch invitation
    const { data: invitation, error: invitationError } = await getInvitationById(
      supabase,
      id
    );

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Handle action
    if (validatedData.action === 'cancel') {
      // Cancel invitation
      const { data: updatedInvitation, error: updateError } = await updateInvitationStatus(
        supabase,
        id,
        'cancelled'
      );

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to cancel invitation', details: updateError.message },
          { status: 500 }
        );
      }

      // Create audit log
      await createAuditLog(supabase, {
        userId: authResult.userId!,
        action: 'invitation.cancelled',
        resourceType: 'invitation',
        resourceId: id,
        details: {
          email: invitation.email,
          previousStatus: invitation.status,
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      });

      return NextResponse.json({
        success: true,
        data: updatedInvitation,
        message: 'Invitation cancelled successfully',
      });
    } else if (validatedData.action === 'resend') {
      // Verify invitation is still pending
      if (invitation.status !== 'pending') {
        return NextResponse.json(
          { error: `Cannot resend invitation with status: ${invitation.status}` },
          { status: 400 }
        );
      }

      // Check if invitation has expired
      const now = new Date();
      const expiresAt = new Date(invitation.expires_at);

      if (now > expiresAt) {
        return NextResponse.json(
          { error: 'Invitation has expired. Please create a new invitation.' },
          { status: 400 }
        );
      }

      // Fetch user details for email
      const { data: user } = await getUserById(supabase, invitation.user_id);

      if (!user) {
        return NextResponse.json(
          { error: 'Associated user not found' },
          { status: 404 }
        );
      }

      // Resend invitation email
      try {
        const emailResult = await sendInvitationEmail({
          to: invitation.email,
          full_name: user.name,
          activationToken: invitation.token,
        });

        if (!emailResult.success) {
          return NextResponse.json(
            { error: 'Failed to send invitation email', details: emailResult.error },
            { status: 500 }
          );
        }

        // Update sent_at timestamp
        const { data: updatedInvitation } = await updateInvitationStatus(
          supabase,
          id,
          'pending',
          { sent_at: new Date().toISOString() }
        );

        // Create audit log
        await createAuditLog(supabase, {
          userId: authResult.userId!,
          action: 'invitation.resent',
          resourceType: 'invitation',
          resourceId: id,
          details: {
            email: invitation.email,
            messageId: emailResult.messageId,
          },
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
          userAgent: request.headers.get('user-agent') || undefined,
        });

        return NextResponse.json({
          success: true,
          data: updatedInvitation,
          message: 'Invitation resent successfully',
        });
      } catch (emailError) {
        return NextResponse.json(
          { error: 'Failed to resend invitation email' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/invitations/[id] - Delete invitation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    // Fetch invitation to get details for audit log
    const { data: invitation, error: invitationError } = await getInvitationById(
      supabase,
      id
    );

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Only allow deletion of pending or cancelled invitations
    if (invitation.status === 'accepted') {
      return NextResponse.json(
        { error: 'Cannot delete accepted invitation' },
        { status: 400 }
      );
    }

    // Delete invitation
    const { success, error: deleteError } = await deleteInvitation(supabase, id);

    if (!success || deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete invitation', details: deleteError?.message },
        { status: 500 }
      );
    }

    // Create audit log
    await createAuditLog(supabase, {
      userId: authResult.userId!,
      action: 'invitation.deleted',
      resourceType: 'invitation',
      resourceId: id,
      details: {
        email: invitation.email,
        status: invitation.status,
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
