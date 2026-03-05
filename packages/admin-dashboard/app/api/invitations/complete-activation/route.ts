/**
 * Complete Activation API Route
 *
 * POST /api/invitations/complete-activation
 *
 * Called after the client-side Supabase verifyOtp succeeds.
 * Receives the Supabase access token + user's chosen password.
 * Sets password, activates user, creates agent_pages, syncs GHL, issues JWT.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import {
  generateTokenPair,
  hashToken,
  logAuthEvent,
} from '@/lib/auth/jwt';
import {
  updateInvitationStatus,
  createAuditLog,
} from '@saa/shared/lib/supabase/invitation-service';
import { createOrUpdateGHLContact, getGHLContactByEmail, updateGHLContact } from '@/lib/gohighlevel';
import { AGENT_PAGE_DEFAULTS } from '@/lib/agent-page-defaults';
import { logPlatformError } from '@/lib/error-logger';

export const dynamic = 'force-dynamic';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://saabuildingblocks.pages.dev',
  'https://saabuildingblocks.com',
  'https://www.saabuildingblocks.com',
  'https://smartagentalliance.com',
  'https://www.smartagentalliance.com',
];

function getCorsHeaders(origin?: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };
}

function getServiceClient() {
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['SUPABASE_SECRET_KEY'];
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Generate unique slug from name
 */
async function generateUniqueSlug(
  supabase: ReturnType<typeof getServiceClient>,
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

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const existing = rateLimitMap.get(ip);
  if (existing && now > existing.resetTime) {
    rateLimitMap.delete(ip);
  }
  const current = rateLimitMap.get(ip);
  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX) return false;
  current.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    // Rate limit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429, headers: { ...corsHeaders, 'Retry-After': '60' } }
      );
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 503, headers: corsHeaders }
      );
    }

    // Parse body
    const body = await request.json();
    const { password, supabaseAccessToken } = body;

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!supabaseAccessToken || typeof supabaseAccessToken !== 'string') {
      return NextResponse.json(
        { error: 'Missing Supabase access token' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify the Supabase access token to get the auth user
    console.log('[Complete Activation] Verifying Supabase access token...');
    const { data: authData, error: authError } = await supabase.auth.getUser(supabaseAccessToken);

    if (authError || !authData.user) {
      console.error('[Complete Activation] getUser failed:', authError?.message, authError?.status, 'token length:', supabaseAccessToken?.length);
      return NextResponse.json(
        { error: 'Invalid or expired session. Please try the activation link again.' },
        { status: 401, headers: corsHeaders }
      );
    }
    console.log('[Complete Activation] Token verified for:', authData.user.email);

    const authUser = authData.user;
    const email = authUser.email;

    if (!email) {
      return NextResponse.json(
        { error: 'No email associated with this invitation' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Look up user in our users table by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User account not found. Please contact support.' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check user isn't already active
    if (user.status === 'active') {
      return NextResponse.json(
        { error: 'Account is already activated. Please log in instead.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Set password in Supabase Auth
    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
      authUser.id,
      {
        password,
        email_confirm: true,
        user_metadata: {
          first_name: user.first_name,
          last_name: user.last_name,
          name: user.full_name || user.name,
          username: user.username,
          user_id: user.id,
        },
      }
    );

    if (updateAuthError) {
      console.error('[Complete Activation] Failed to set password in Auth:', updateAuthError.message);
      return NextResponse.json(
        { error: 'Failed to set password. Please try again.' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Update users table
    const now = new Date().toISOString();
    const { data: updatedUser, error: updateUserError } = await supabase
      .from('users')
      .update({
        status: 'active',
        email_verified: true,
        activated_at: now,
        auth_user_id: authUser.id,
        updated_at: now,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateUserError) {
      console.error('[Complete Activation] Failed to update user:', updateUserError.message);
      return NextResponse.json(
        { error: 'Failed to activate account. Please try again.' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Update invitation status
    const { data: invitation } = await supabase
      .from('user_invitations')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['pending', 'sent'])
      .limit(1)
      .single();

    if (invitation) {
      await updateInvitationStatus(supabase, invitation.id, 'accepted', {
        activated_at: now,
      });
    }

    // Create agent_pages record
    try {
      const { data: existingPage } = await supabase
        .from('agent_pages')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!existingPage) {
        const firstName = user.first_name || user.name?.split(' ')[0] || 'Agent';
        const lastName = user.last_name || user.name?.split(' ').slice(1).join(' ') || '';

        const slug = await generateUniqueSlug(supabase, firstName, lastName);

        await supabase
          .from('agent_pages')
          .insert({
            user_id: user.id,
            slug,
            display_first_name: firstName,
            display_last_name: lastName,
            email: user.email,
            ...AGENT_PAGE_DEFAULTS,
          });
      }
    } catch (pageError) {
      console.error('[Complete Activation] Agent page creation error:', pageError);
    }

    // Sync GoHighLevel tags
    try {
      let ghlContactId = user.gohighlevel_contact_id;

      if (ghlContactId) {
        await updateGHLContact({
          contactId: ghlContactId,
          tags: ['saa-portal-user', 'invitation-accepted', 'account-active'],
          customFields: {
            'portal_user_id': user.id,
            'account_status': 'active',
            'activation_date': now,
          },
        });
      } else {
        const existingContact = await getGHLContactByEmail(user.email);
        if (existingContact.success && existingContact.contact?.id) {
          ghlContactId = existingContact.contact.id;
          await updateGHLContact({
            contactId: ghlContactId,
            tags: ['saa-portal-user', 'invitation-accepted', 'account-active'],
            customFields: {
              'portal_user_id': user.id,
              'account_status': 'active',
              'activation_date': now,
            },
          });
        } else {
          const ghlResult = await createOrUpdateGHLContact({
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            tags: ['saa-portal-user', 'invitation-accepted', 'account-active'],
            customFields: {
              'portal_user_id': user.id,
              'account_status': 'active',
              'activation_date': now,
            },
          });
          if (ghlResult.success) {
            ghlContactId = ghlResult.contactId;
          }
        }

        if (ghlContactId) {
          await supabase
            .from('users')
            .update({ gohighlevel_contact_id: ghlContactId })
            .eq('id', user.id);
        }
      }
    } catch (ghlError) {
      console.error('[Complete Activation] GHL sync error:', ghlError);
    }

    // Issue custom JWT for Agent Portal (same pattern as login)
    const tokenId = nanoid();
    const deviceId = nanoid();
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const { accessToken, refreshToken, expiresIn } = await generateTokenPair(
      {
        userId: user.id,
        username: user.email,
        email: user.email,
        role: user.role,
        permissions: [],
      },
      tokenId,
      deviceId
    );

    // Store refresh token
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await supabase.from('refresh_tokens').insert({
      id: tokenId,
      user_id: user.id,
      token_hash: tokenHash,
      device_name: userAgent.substring(0, 255),
      device_type: 'web',
      expires_at: expiresAt.toISOString(),
      ip_address: ip,
      user_agent: userAgent,
    });

    // Update last login
    await supabase
      .from('users')
      .update({ last_login_at: now })
      .eq('id', user.id);

    // Audit log
    await createAuditLog(supabase, {
      userId: user.id,
      action: 'invitation.accepted',
      resourceType: 'invitation',
      resourceId: invitation?.id || 'unknown',
      details: {
        email: user.email,
        method: 'supabase_native_auth',
        activatedAt: now,
      },
      ipAddress: ip,
      userAgent,
    });

    await logAuthEvent({
      userId: user.id,
      eventType: 'login',
      success: true,
      ipAddress: ip,
      userAgent,
      metadata: { method: 'activation', deviceId },
    });

    // Return JWT + user data (same shape as login endpoint)
    const response = NextResponse.json({
      success: true,
      message: 'Account activated successfully',
      access_token: accessToken,
      user: {
        id: updatedUser.id,
        username: updatedUser.email,
        email: updatedUser.email,
        fullName: updatedUser.full_name,
        full_name: updatedUser.full_name,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        role: updatedUser.role,
        profile_picture_url: updatedUser.profile_picture_url,
        emailVerified: true,
        lastLoginAt: now,
        gender: updatedUser.gender || 'male',
        is_leader: updatedUser.is_leader || false,
        state: updatedUser.state || null,
        isFirstLogin: true,
      },
      expiresIn,
      refresh_token: refreshToken,
    }, { headers: corsHeaders });

    // Set refresh token cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Complete Activation] Error:', error);
    logPlatformError({
      source: '/api/invitations/complete-activation',
      severity: 'error',
      error_code: 'ACTIVATION_ERROR',
      error_message: error instanceof Error ? error.message : 'Unknown error',
      stack_trace: error instanceof Error ? error.stack : undefined,
      request,
    });

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return NextResponse.json({}, {
    status: 200,
    headers: {
      ...getCorsHeaders(origin),
      'Access-Control-Max-Age': '86400',
    },
  });
}
