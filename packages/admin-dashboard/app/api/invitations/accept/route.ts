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
} from '@saa/shared/lib/supabase/invitation-service';
import { createOrUpdateGHLContact } from '@/lib/gohighlevel';
import { ZodError } from 'zod';
import bcrypt from 'bcryptjs';
import { AGENT_PAGE_DEFAULTS } from '@/lib/agent-page-defaults';

export const dynamic = 'force-dynamic';

// Allowed origins for CORS (public sites that can call this API)
const ALLOWED_ORIGINS = [
  'https://saabuildingblocks.pages.dev',
  'https://saabuildingblocks.com',
  'https://www.saabuildingblocks.com',
  'https://smartagentalliance.com',
  'https://www.smartagentalliance.com',
];

// Get CORS headers based on request origin
function getCorsHeaders(origin?: string | null): Record<string, string> {
  // Check if origin is in allowed list
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]; // Default to Cloudflare Pages

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

/**
 * Generate unique slug from name
 */
async function generateUniqueSlug(
  supabase: ReturnType<typeof getSupabaseServiceClient>,
  firstName: string,
  lastName: string
): Promise<string> {
  const base = `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  let slug = base;
  let counter = 0;

  while (true) {
    const checkSlug = counter === 0 ? slug : `${slug}-${counter}`;
    const { data: existing } = await supabase!
      .from('agent_pages')
      .select('id')
      .eq('slug', checkSlug)
      .single();

    if (!existing) {
      return checkSlug;
    }
    counter++;
  }
}

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
  // Get origin for CORS
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

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
            ...corsHeaders,
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
        { status: 503, headers: corsHeaders }
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
          { error: 'Validation error', details: error.issues },
          { status: 400, headers: corsHeaders }
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
        { status: 404, headers: corsHeaders }
      );
    }

    // Validate invitation status and expiration
    const validationResult = isInvitationValid(invitation);
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: validationResult.reason || 'Invitation is not valid' },
        { status: 400, headers: corsHeaders }
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
        { status: 404, headers: corsHeaders }
      );
    }

    // Verify user status is 'invited'
    if (user.status !== 'invited') {
      return NextResponse.json(
        { error: `User account is already ${user.status}` },
        { status: 400, headers: corsHeaders }
      );
    }

    // Hash password with bcrypt (cost factor 12)
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Update username if provided
    const username = validatedData.username || user.username;

    // Update email if provided (this is the login/notification email, separate from exp_email)
    const userEmail = validatedData.email || user.email;

    // Check if new email is already taken by another user
    if (userEmail !== user.email) {
      const { data: existingEmailUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userEmail)
        .neq('id', user.id)
        .single();

      if (existingEmailUser) {
        return NextResponse.json(
          { error: 'Email address is already in use by another account' },
          { status: 409, headers: corsHeaders }
        );
      }
    }

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
          { status: 409, headers: corsHeaders }
        );
      }
    }

    // Update user with password, first_name, last_name, email, and active status
    const fullName = `${validatedData.first_name} ${validatedData.last_name}`;
    const { data: updatedUser, error: updateUserError } = await supabase
      .from('users')
      .update({
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        full_name: fullName,
        email: userEmail, // Update login/notification email (exp_email stays unchanged)
        username,
        password_hash: hashedPassword,
        status: 'active',
        email_verified: true,
        activated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateUserError) {
      return NextResponse.json(
        { error: 'Failed to activate user account', details: updateUserError.message },
        { status: 500, headers: corsHeaders }
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

    // Create agent_pages record for the newly activated user
    // This enables them to customize their Agent Attraction Page
    try {
      // Check if agent page already exists
      const { data: existingPage } = await supabase
        .from('agent_pages')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!existingPage) {
        // Generate unique slug
        const slug = await generateUniqueSlug(
          supabase,
          validatedData.first_name,
          validatedData.last_name
        );

        // Create agent page record with default settings
        const { data: newPage, error: pageError } = await supabase
          .from('agent_pages')
          .insert({
            user_id: user.id,
            slug,
            display_first_name: validatedData.first_name,
            display_last_name: validatedData.last_name,
            email: user.email,
            ...AGENT_PAGE_DEFAULTS,
          })
          .select()
          .single();

        if (pageError) {
          console.error('Failed to create agent page:', pageError);
        } else {
          console.log('✅ Created agent page for user:', user.id, 'slug:', newPage.slug);
        }
      }
    } catch (pageError) {
      // Don't fail activation if agent page creation fails
      console.error('Error creating agent page:', pageError);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        username: updatedUser.username,
        role: updatedUser.role,
        status: updatedUser.status,
      },
      message: 'Account activated successfully. You can now log in.',
    }, {
      status: 200,
      headers: {
        ...corsHeaders,
        'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
        'X-RateLimit-Remaining': rateLimit.remainingAttempts.toString(),
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  return NextResponse.json({}, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Access-Control-Max-Age': '86400',
    },
  });
}
