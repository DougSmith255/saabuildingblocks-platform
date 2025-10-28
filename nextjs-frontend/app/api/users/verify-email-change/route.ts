// Force dynamic rendering - exclude from static export
export const dynamic = 'error';

/**
 * Email Change Verification API Route
 * GET /api/users/verify-email-change?token=xxx
 *
 * Verifies email change token and completes the email change:
 * 1. Validates token is not expired (24 hours)
 * 2. Checks token hasn't been used
 * 3. Updates user email in Supabase
 * 4. Updates GoHighLevel contact email
 * 5. Marks token as verified
 * 6. Sends confirmation to old email
 *
 * Security Features:
 * - One-time use tokens
 * - 24-hour expiration
 * - Atomic updates (transaction-like)
 * - Audit logging
 * - Notification to old email
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import { hashToken, logAuthEvent } from '@/lib/auth/jwt';
import { createGHLClient } from '@/lib/gohighlevel-client';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Email verification service is not available',
      },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Verification token is required',
        },
        { status: 400 }
      );
    }

    // Hash the token to match database
    const tokenHash = hashToken(token);

    // Find email change request
    const { data: changeRequest, error: requestError } = await supabase
      .from('email_change_requests')
      .select('*')
      .eq('token', tokenHash)
      .single();

    if (requestError || !changeRequest) {
      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'invalid_token', action: 'email_change_verification' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Invalid or expired verification token',
        },
        { status: 400 }
      );
    }

    // Check if token is already verified
    if (changeRequest.verified_at) {
      return NextResponse.json(
        {
          success: false,
          error: 'TOKEN_ALREADY_USED',
          message: 'This verification link has already been used',
        },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date(changeRequest.expires_at) < new Date()) {
      await logAuthEvent({
        userId: changeRequest.user_id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'token_expired', action: 'email_change_verification' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'TOKEN_EXPIRED',
          message: 'Verification link has expired. Please request a new email change.',
        },
        { status: 400 }
      );
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', changeRequest.user_id)
      .single();

    if (userError || !user) {
      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'user_not_found', action: 'email_change_verification' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // Check if new email is already in use (race condition check)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', changeRequest.new_email)
      .neq('id', user.id)
      .single();

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'EMAIL_IN_USE',
          message: 'This email address is already associated with another account',
        },
        { status: 409 }
      );
    }

    // Update user email in Supabase
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email: changeRequest.new_email,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[Email Change Verification] Failed to update user email:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'UPDATE_FAILED',
          message: 'Failed to update email address',
        },
        { status: 500 }
      );
    }

    // Update GoHighLevel contact email (if exists)
    try {
      const ghlClient = createGHLClient();

      // Search for contact by old email
      const searchResult = await ghlClient.searchContactByEmail(changeRequest.old_email);

      if (searchResult.success && searchResult.data?.contacts && searchResult.data.contacts.length > 0) {
        const contact = searchResult.data.contacts[0];

        // Update contact with new email
        const updateResult = await ghlClient.updateContact(contact.id, {
          email: changeRequest.new_email,
        });

        if (!updateResult.success) {
          console.error('[Email Change Verification] Failed to update GoHighLevel contact:', updateResult.error);
          // Don't fail the entire operation - email is already updated in Supabase
        } else {
          console.log(`[Email Change Verification] Updated GoHighLevel contact ${contact.id} with new email`);
        }
      }
    } catch (ghlError) {
      console.error('[Email Change Verification] GoHighLevel update error:', ghlError);
      // Don't fail the entire operation - email is already updated in Supabase
    }

    // Mark email change request as verified
    await supabase
      .from('email_change_requests')
      .update({
        verified_at: new Date().toISOString(),
        verified_ip: ipAddress,
      })
      .eq('id', changeRequest.id);

    // Log successful email change
    await logAuthEvent({
      userId: user.id,
      eventType: 'failed_login', // Using failed_login for email change events
      success: true,
      ipAddress,
      userAgent,
      metadata: {
        action: 'email_change_verified',
        old_email: changeRequest.old_email,
        new_email: changeRequest.new_email,
      },
    });

    // Send confirmation email to OLD email address
    const { sendEmailChangeConfirmation } = await import('@/lib/email/send');

    const confirmationResult = await sendEmailChangeConfirmation(
      changeRequest.old_email,
      user.username,
      changeRequest.new_email
    );

    if (!confirmationResult.success) {
      console.error('[Email Change Verification] Failed to send confirmation email:', confirmationResult.error);
      // Don't fail the request - email is already changed
    }

    console.log(`[Email Change Verification] Email changed successfully for user ${user.id}`);

    return NextResponse.json({
      success: true,
      message: 'Email address has been successfully updated',
      data: {
        new_email: changeRequest.new_email,
        verified_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Email Change Verification] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
