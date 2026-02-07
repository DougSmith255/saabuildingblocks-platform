// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Login API Route
 * POST /api/auth/login
 *
 * Authenticates user via Supabase Auth and returns access + refresh tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createClient } from '@supabase/supabase-js';
import {
  generateTokenPair,
  hashToken,
  logAuthEvent,
  checkRateLimit,
  incrementRateLimit,
  resetRateLimit,
} from '@/lib/auth/jwt';
import { loginSchema, formatZodErrors } from '@/lib/auth/schemas';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 5;

// CORS headers for cross-origin requests from public site
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// Helper to create JSON response with CORS headers
function jsonResponse(data: object, status: number = 200, extraHeaders?: Record<string, string>) {
  return NextResponse.json(data, {
    status,
    headers: { ...CORS_HEADERS, ...extraHeaders },
  });
}

// Create Supabase clients
function getSupabaseClients() {
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const anonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['SUPABASE_SECRET_KEY'];

  if (!url || !anonKey || !serviceKey) return null;

  // Anon client for auth (uses Supabase Auth)
  const authClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  // Service client for database queries (bypasses RLS)
  const serviceClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  return { authClient, serviceClient };
}

export async function POST(request: NextRequest) {
  const clients = getSupabaseClients();

  if (!clients) {
    return jsonResponse({
      success: false,
      error: 'SERVICE_UNAVAILABLE',
      message: 'Authentication service is not available',
    }, 503);
  }

  const { authClient, serviceClient } = clients;

  try {
    // Extract request data
    const body = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate request body
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return jsonResponse(formatZodErrors(validation.error), 400);
    }

    const { identifier, password, rememberMe } = validation.data;

    // Rate limiting check
    const rateLimitKey = `login:${ipAddress}`;
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMIT_MAX_ATTEMPTS, RATE_LIMIT_WINDOW_MS, false);

    if (!rateLimit.allowed) {
      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'rate_limit_exceeded', identifier },
      });

      return jsonResponse({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many login attempts. Please try again later.',
        resetAt: new Date(rateLimit.resetAt).toISOString(),
      }, 429, {
        'X-RateLimit-Limit': String(RATE_LIMIT_MAX_ATTEMPTS),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(Math.floor(rateLimit.resetAt / 1000)),
      });
    }

    // Authenticate via Supabase Auth
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email: identifier,
      password: password,
    });

    if (authError || !authData.user) {
      // Increment rate limit counter on failed attempt
      incrementRateLimit(rateLimitKey, RATE_LIMIT_WINDOW_MS);

      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'invalid_credentials', identifier },
      });

      return jsonResponse({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      }, 401);
    }

    // Get user data from users table (using service client to bypass RLS)
    // Query by email since users table ID may differ from Supabase Auth ID
    // Use ilike for case-insensitive matching (Supabase Auth may lowercase emails)
    const { data: user, error: userError } = await serviceClient
      .from('users')
      .select('*')
      .ilike('email', authData.user.email || '')
      .single();

    if (userError || !user) {
      await logAuthEvent({
        userId: authData.user.id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'user_not_found_in_db', authUserId: authData.user.id },
      });

      return jsonResponse({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User account not found. Please contact support.',
      }, 401);
    }

    // Check account status
    if (user.status !== 'active') {
      await logAuthEvent({
        userId: user.id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'account_inactive', status: user.status },
      });

      return jsonResponse({
        success: false,
        error: 'ACCOUNT_INACTIVE',
        message: user.status === 'suspended'
          ? 'Your account has been suspended. Please contact support.'
          : 'Your account is not activated yet. Please complete activation first.',
      }, 403);
    }

    // Generate JWT tokens for Agent Portal
    const tokenId = nanoid();
    const deviceId = nanoid();

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

    // Store refresh token in database (hashed)
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await serviceClient.from('refresh_tokens').insert({
      id: tokenId,
      user_id: user.id,
      token_hash: tokenHash,
      device_name: userAgent.substring(0, 255),
      device_type: 'web',
      expires_at: expiresAt.toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    // Update user login info
    await serviceClient
      .from('users')
      .update({
        last_login_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // Reset in-memory rate limit for this IP on successful login
    resetRateLimit(rateLimitKey);

    // Log successful login
    await logAuthEvent({
      userId: user.id,
      eventType: 'login',
      success: true,
      ipAddress,
      userAgent,
      metadata: { deviceId },
    });

    // Create response with refresh token cookie
    // Format matches what AuthProvider expects
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      access_token: accessToken,
      user: {
        id: user.id,
        username: user.email,
        email: user.email,
        fullName: user.full_name,
        full_name: user.full_name,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        profile_picture_url: user.profile_picture_url,
        emailVerified: user.email_verified,
        lastLoginAt: new Date().toISOString(),
        gender: user.gender || 'male',
        is_leader: user.is_leader || false,
        state: user.state || null,
        isFirstLogin: false,
      },
      expiresIn,
    }, { headers: CORS_HEADERS });

    // Set refresh token in HttpOnly cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days or session
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Login API] Error:', error);

    return jsonResponse({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    }, 500);
  }
}
