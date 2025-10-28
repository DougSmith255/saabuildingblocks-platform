// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * User Activation API Route
 * POST /api/users/activate
 *
 * Activates user account after email verification
 * Creates username, password, uploads profile picture
 * Updates GoHighLevel contact
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import { activationSchema, formatZodErrors } from '@/lib/auth/activation-schemas';
import { syncInvitationAccepted } from '@/lib/gohighlevel/index';

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Authentication service is not available',
      },
      { status: 503 }
    );
  }

  try {
    // Parse request body
    const body = await request.json();

    // Validate request
    const validation = activationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodErrors(validation.error), { status: 400 });
    }

    const { token, username, password } = validation.data;

    // Find user by activation token
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('activation_token', token)
      .eq('status', 'pending_activation')
      .single();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Invalid or expired activation token',
        },
        { status: 400 }
      );
    }

    // Check if token is expired (24 hours)
    const tokenCreatedAt = new Date(user.created_at);
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - tokenCreatedAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCreation > 24) {
      return NextResponse.json(
        {
          success: false,
          error: 'TOKEN_EXPIRED',
          message: 'Activation token has expired. Please request a new activation email.',
        },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'USERNAME_TAKEN',
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update user in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        username,
        password_hash: passwordHash,
        status: 'active',
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        activation_token: null,
        is_active: true,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[Activation] Error updating user:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'ACTIVATION_FAILED',
          message: 'Failed to activate account',
        },
        { status: 500 }
      );
    }

    // Sync activation to GoHighLevel (non-blocking)
    if (user.gohighlevel_contact_id) {
      syncInvitationAccepted({
        userId: user.id,
        email: user.email,
        username,
        gohighlevel_contact_id: user.gohighlevel_contact_id,
      }).catch((err) => {
        console.error('[Activation] Failed to sync GHL activation:', err);
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Account activated successfully',
      data: {
        userId: user.id,
        username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('[Activation API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
