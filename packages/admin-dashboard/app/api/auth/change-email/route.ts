// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Change Email API Route
 *
 * Handles email change requests with password verification.
 * Sends verification email to new address.
 *
 * POST /api/auth/change-email
 * Body: { newEmail: string, password: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { newEmail, password } = await request.json();

    // Validate input
    if (!newEmail || !password) {
      return NextResponse.json(
        { message: 'New email and password are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get access token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized - No access token' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);

    // Create admin Supabase client for user operations
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify token and get user ID from it
    const { data: { user }, error: userError } = await adminSupabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Check if new email is already in use
    const { data: existingUser } = await adminSupabase
      .from('users')
      .select('id')
      .eq('email', newEmail)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email address is already in use' },
        { status: 400 }
      );
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await adminSupabase.auth.signInWithPassword({
      email: user.email!,
      password,
    });

    if (signInError) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Update user email with Supabase Auth (admin)
    // This will automatically send a verification email
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
      user.id,
      { email: newEmail }
    );

    if (updateError) {
      console.error('Email update error:', updateError);
      return NextResponse.json(
        { message: updateError.message || 'Failed to update email' },
        { status: 500 }
      );
    }

    // Update email in users table to match Supabase Auth
    // This is critical - login queries the users table by email!
    const { error: dbError } = await adminSupabase
      .from('users')
      .update({
        email: newEmail,
        email_verification_pending: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (dbError) {
      console.error('Database update error:', dbError);
      // If users table update fails, this is critical - revert the Auth change
      await adminSupabase.auth.admin.updateUserById(user.id, { email: user.email! });
      return NextResponse.json(
        { message: 'Failed to update email in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Email change request sent. Please check your new email to verify.',
      success: true,
    });
  } catch (error) {
    console.error('Change email error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
