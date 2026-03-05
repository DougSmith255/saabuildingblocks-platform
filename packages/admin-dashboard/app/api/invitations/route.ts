/**
 * Invitations API Route
 *
 * POST /api/invitations - Create new invitation (admin only)
 * GET /api/invitations - List all invitations (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';
import {
  createInvitationSchema,
  listInvitationsSchema,
  CreateInvitationInput,
} from '@/lib/validation/invitation';
import {
  listInvitations,
  createAuditLog,
} from '@saa/shared/lib/supabase/invitation-service';
import { sendWelcomeEmail } from '@/lib/email/send';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

/**
 * POST /api/invitations - Create new invitation
 *
 * Admin-only endpoint to create a new user invitation
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication (session cookies from Master Controller)
    const authResult = await verifySessionAdminAuth();
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
    let validatedData: CreateInvitationInput;

    try {
      validatedData = createInvitationSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.issues },
          { status: 400 }
        );
      }
      throw error;
    }

    // Check if user with email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, status')
      .eq('email', validatedData.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if there's already a pending invitation for this email
    const { data: existingInvitation } = await supabase
      .from('user_invitations')
      .select('id, status, expires_at')
      .eq('email', validatedData.email)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'An active invitation already exists for this email' },
        { status: 409 }
      );
    }

    // Create user record with 'invited' status
    const username = validatedData.username || validatedData.email.split('@')[0];
    const [firstName, ...lastNameParts] = validatedData.name.split(' ');
    const lastName = lastNameParts.join(' ') || undefined;

    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        username,
        role: validatedData.role,
        status: 'invited',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (userError) {
      return NextResponse.json(
        { error: 'Failed to create user', details: userError.message },
        { status: 500 }
      );
    }

    // Generate Supabase native invite link
    const activationBaseUrl = 'https://smartagentalliance.com';
    const redirectTo = `${activationBaseUrl}/agent-portal/activate`;

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'invite',
      email: validatedData.email,
      options: { redirectTo },
    });

    if (linkError || !linkData) {
      // Rollback user creation
      await supabase.from('users').delete().eq('id', newUser.id);
      return NextResponse.json(
        { error: 'Failed to generate invitation link', details: linkError?.message },
        { status: 500 }
      );
    }

    // Extract hashed_token from the generated link properties
    const hashedToken = linkData.properties?.hashed_token;
    if (!hashedToken) {
      await supabase.from('users').delete().eq('id', newUser.id);
      return NextResponse.json(
        { error: 'Failed to extract token from invitation link' },
        { status: 500 }
      );
    }

    // Create invitation record with token_hash
    const expiresAt = new Date(Date.now() + (validatedData.expiresInHours || 168) * 60 * 60 * 1000).toISOString();
    const { data: invitation, error: invitationError } = await supabase
      .from('user_invitations')
      .insert({
        user_id: newUser.id,
        email: validatedData.email,
        token_hash: hashedToken,
        status: 'pending',
        expires_at: expiresAt,
        invited_by: authResult.userId!,
        sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (invitationError || !invitation) {
      await supabase.from('users').delete().eq('id', newUser.id);
      return NextResponse.json(
        { error: 'Failed to create invitation', details: invitationError?.message },
        { status: 500 }
      );
    }

    // Link the Supabase auth user to our users table
    if (linkData.user?.id) {
      await supabase
        .from('users')
        .update({ auth_user_id: linkData.user.id })
        .eq('id', newUser.id);
    }

    // Send invitation email
    try {
      const firstName = validatedData.name?.split(' ')[0] || 'Agent';
      const emailResult = await sendWelcomeEmail(
        validatedData.email,
        firstName,
        hashedToken,
        168 // 7 days
      );

      if (!emailResult.success) {
        await supabase
          .from('user_invitations')
          .update({
            status: 'pending',
            sent_at: null,
          })
          .eq('id', invitation.id);
      }
    } catch (emailError) {
      // Email sending error - non-critical, continue
    }

    // Create audit log
    await createAuditLog(supabase, {
      userId: authResult.userId!,
      action: 'invitation.created',
      resourceType: 'invitation',
      resourceId: invitation.id,
      details: {
        email: validatedData.email,
        role: validatedData.role,
        expiresAt: invitation.expires_at,
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: invitation.id,
        email: invitation.email,
        status: invitation.status,
        expiresAt: invitation.expires_at,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          username: newUser.username,
          role: newUser.role,
        },
      },
      message: 'Invitation created successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/invitations - List all invitations
 *
 * Admin-only endpoint to list invitations with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication (session cookies from Master Controller)
    const authResult = await verifySessionAdminAuth();
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

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      status: searchParams.get('status') || undefined,
      email: searchParams.get('email') || undefined,
      limit: searchParams.get('limit') || '50',
      offset: searchParams.get('offset') || '0',
    };

    let validatedParams;
    try {
      validatedParams = listInvitationsSchema.parse(queryParams);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.issues },
          { status: 400 }
        );
      }
      throw error;
    }

    // Fetch invitations
    const { data: invitations, count, error: listError } = await listInvitations(
      supabase,
      validatedParams
    );

    if (listError) {
      return NextResponse.json(
        { error: 'Failed to fetch invitations', details: listError.message },
        { status: 500 }
      );
    }

    // Enrich invitations with user data
    const enrichedInvitations = await Promise.all(
      invitations.map(async (invitation) => {
        const { data: user } = await supabase
          .from('users')
          .select('id, email, name, username, role, status')
          .eq('id', invitation.user_id)
          .single();

        return {
          ...invitation,
          user: user || null,
        };
      })
    );

    const page = Math.floor(validatedParams.offset / validatedParams.limit) + 1;
    const hasMore = validatedParams.offset + validatedParams.limit < count;

    return NextResponse.json({
      success: true,
      data: enrichedInvitations,
      pagination: {
        total: count,
        page,
        limit: validatedParams.limit,
        offset: validatedParams.offset,
        hasMore,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
