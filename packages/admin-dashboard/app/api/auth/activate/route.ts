// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * User Activation API Route
 * Handles password setup and account activation from email invitation
 *
 * POST /api/auth/activate
 * Body: { token: string, password: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Password validation regex
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

interface ActivationRequest {
  token: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ActivationRequest = await request.json();
    const { token, password } = body;

    // Validate inputs
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Activation token is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long` },
        { status: 400 }
      );
    }

    if (!PASSWORD_REGEX.test(password)) {
      return NextResponse.json(
        {
          error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS (user has no auth session yet)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    // Hash the provided token to compare with stored hash
    const crypto = await import('crypto');
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Query user_invitations table for the token hash
    // Token hash is stored in the 'token' column; accept 'sent' or 'pending' status
    const { data: invitation, error: invitationError } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('token', tokenHash)
      .in('status', ['pending', 'sent'])
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired activation token' },
        { status: 404 }
      );
    }

    // Check token expiration using the expires_at field
    const expirationDate = new Date(invitation.expires_at);
    const now = new Date();

    if (now > expirationDate) {
      return NextResponse.json(
        { error: 'Activation token has expired. Please request a new invitation.' },
        { status: 410 }
      );
    }

    // Hash password with bcrypt (cost factor 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // Create Supabase Auth account with the same ID as the existing users row
    // This avoids having to update the primary key and break FK references
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      id: invitation.user_id,
      email: invitation.email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: invitation.full_name,
        ghl_contact_id: invitation.gohighlevel_contact_id,
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);

      if (authError.message?.includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Activate the existing user record
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        password_hash: passwordHash,
        status: 'active',
        email_verified: true,
        activated_at: new Date().toISOString(),
      })
      .eq('id', invitation.user_id);

    if (userUpdateError) {
      console.error('Error updating user record:', userUpdateError);
    }

    // Update invitation status to 'activated'
    const { error: updateError } = await supabase
      .from('user_invitations')
      .update({
        status: 'activated',
        activated_at: new Date().toISOString(),
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Error updating invitation status:', updateError);
      // Don't fail the entire operation
    }

    // Log activation in audit logs
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        user_id: authData.user.id,
        event_type: 'account_activated',
        event_category: 'account',
        success: true,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
        metadata: {
          invitation_id: invitation.id,
          email: invitation.email,
        },
      });

    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Don't fail the entire operation
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Account activated successfully',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: invitation.full_name,
        },
        redirect: '/login', // Frontend should redirect to login page
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Activation error:', error);

    return NextResponse.json(
      {
        error: 'An unexpected error occurred during activation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
