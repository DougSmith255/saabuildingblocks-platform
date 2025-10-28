/**
 * Accept Invitation API Route
 *
 * POST /api/invitations/accept - Accept invitation with token
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { acceptInvitationSchema } from '@/lib/validation/invitation';
import {
  getInvitationByToken,
  updateInvitationStatus,
  isInvitationValid,
  createAuditLog,
  getUserById,
} from '@/lib/supabase/invitation-service';
import { createOrUpdateGHLContact } from '@/lib/gohighlevel';
import { ZodError } from 'zod';
import bcrypt from 'bcryptjs';

export const dynamic = 'error';

// Rate limiting map: IP -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit: 5 attempts per minute per IP
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in ms

/**
 * Check rate limit for IP address
 */
function checkRateLimit(ipAddress: string): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now();
  const existing = rateLimitMap.get(ipAddress);

  // Clean up expired entries
  if (existing && now > existing.resetTime) {
    rateLimitMap.delete(ipAddress);
  }

  const current = rateLimitMap.get(ipAddress);

  if (!current) {
    // First request from this IP
    rateLimitMap.set(ipAddress, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remainingAttempts: RATE_LIMIT_MAX - 1 };
  }

  if (current.count >= RATE_LIMIT_MAX) {
    // Rate limit exceeded
    return { allowed: false, remainingAttempts: 0 };
  }

  // Increment counter
  current.count++;
  return { allowed: true, remainingAttempts: RATE_LIMIT_MAX - current.count };
}

/**
 * POST /api/invitations/accept - Accept invitation with token
 *
 * Public endpoint (no auth required) to accept an invitation
 * and activate user account with password
 */
export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(ipAddress);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many attempts. Please try again later.',
          retryAfter: 60
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
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
      validatedData = acceptInvitationSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    // Fetch invitation by token (automatically hashes token)
    const { data: invitation, error: invitationError } = await getInvitationByToken(
      supabase,
      validatedData.token
    );

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token' },
        { status: 404 }
      );
    }

    // Validate invitation status and expiration
    const validationResult = isInvitationValid(invitation);
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: validationResult.reason || 'Invitation is not valid' },
        { status: 400 }
      );
    }

    // Fetch user
    const { data: user, error: userError } = await getUserById(
      supabase,
      invitation.user_id
    );

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Associated user not found' },
        { status: 404 }
      );
    }

    // Verify user status is 'invited'
    if (user.status !== 'invited') {
      return NextResponse.json(
        { error: `User account is already ${user.status}` },
        { status: 400 }
      );
    }

    // Hash password with bcrypt (cost factor 12)
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Update username if provided
    const username = validatedData.username || user.username;

    // Check if username is already taken (if different from current)
    if (username !== user.username) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 409 }
        );
      }
    }

    // Update user with password, first_name, last_name, and active status
    const fullName = `${validatedData.first_name} ${validatedData.last_name}`;
    const { data: updatedUser, error: updateUserError } = await supabase
      .from('users')
      .update({
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        name: fullName, // Maintain backward compatibility
        username,
        password_hash: hashedPassword,
        status: 'active',
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateUserError) {
      return NextResponse.json(
        { error: 'Failed to activate user account', details: updateUserError.message },
        { status: 500 }
      );
    }

    // Mark invitation as accepted
    const { error: invitationUpdateError } = await updateInvitationStatus(
      supabase,
      invitation.id,
      'accepted',
      { accepted_at: new Date().toISOString() }
    );

    if (invitationUpdateError) {
      // Log warning but don't fail the request
    }

    // Update GoHighLevel contact
    try {
      const ghlResult = await createOrUpdateGHLContact({
        email: user.email,
        firstName: validatedData.first_name,
        lastName: validatedData.last_name,
        tags: ['saa-portal-user', 'invitation-accepted', 'account-active'],
        customFields: {
          'portal_user_id': user.id,
          'account_status': 'active',
          'activation_date': new Date().toISOString(),
        },
      });

      if (ghlResult.success && !user.gohighlevel_contact_id) {
        // Update user with GoHighLevel contact ID
        await supabase
          .from('users')
          .update({ gohighlevel_contact_id: ghlResult.contactId })
          .eq('id', user.id);
      }
    } catch (ghlError) {
      // Don't fail activation if GHL fails
    }

    // Create audit log
    await createAuditLog(supabase, {
      userId: user.id,
      action: 'invitation.accepted',
      resourceType: 'invitation',
      resourceId: invitation.id,
      details: {
        email: user.email,
        username: updatedUser.username,
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        activatedAt: new Date().toISOString(),
      },
      ipAddress,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    // Create Supabase Auth user for future authentication
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: validatedData.password,
        email_confirm: true,
        user_metadata: {
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          name: fullName,
          username: updatedUser.username,
          user_id: user.id,
        },
      });

      if (!authError && authData.user) {
        // Link Supabase auth user to our users table
        await supabase
          .from('users')
          .update({ auth_user_id: authData.user.id })
          .eq('id', user.id);
      }
    } catch (authError) {
      // Don't fail activation if auth creation fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        username: updatedUser.username,
        role: updatedUser.role,
        status: updatedUser.status,
      },
      message: 'Account activated successfully. You can now log in.',
    }, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
        'X-RateLimit-Remaining': rateLimit.remainingAttempts.toString(),
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
