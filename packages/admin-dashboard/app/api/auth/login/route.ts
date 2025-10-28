// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Login API Route
 * POST /api/auth/login
 *
 * Authenticates user and returns access + refresh tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import {
  generateTokenPair,
  hashToken,
  logAuthEvent,
  checkRateLimit,
} from '@/lib/auth/jwt';
import { loginSchema, formatZodErrors } from '@/lib/auth/schemas';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  // Use service role client to bypass RLS and access password hashes
  const supabase = getSupabaseServiceClient();

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
    // Extract request data
    const body = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate request body
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodErrors(validation.error), { status: 400 });
    }

    const { identifier, password, rememberMe } = validation.data;

    // Determine if identifier is email or username
    const isEmail = identifier.includes('@');

    // Rate limiting check (5 attempts per 15 minutes per IP)
    const rateLimitKey = `login:${ipAddress}`;
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMIT_MAX_ATTEMPTS, RATE_LIMIT_WINDOW_MS);

    if (!rateLimit.allowed) {
      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'rate_limit_exceeded', identifier, isEmail },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many login attempts. Please try again later.',
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX_ATTEMPTS),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(Math.floor(rateLimit.resetAt / 1000)),
          },
        }
      );
    }

    // Find user by email or username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .or(isEmail ? `email.eq.${identifier}` : `username.eq.${identifier}`)
      .single();

    if (userError || !user) {
      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'user_not_found', identifier, isEmail },
      });

      // Generic error message to prevent user enumeration
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid username/email or password',
        },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      await logAuthEvent({
        userId: user.id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'account_locked', lockedUntil: user.locked_until },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'ACCOUNT_LOCKED',
          message: 'Account locked due to too many failed login attempts',
          unlockAt: user.locked_until,
        },
        { status: 423 }
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      // Increment failed login attempts
      const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
      const shouldLock = newFailedAttempts >= MAX_FAILED_ATTEMPTS;

      await supabase
        .from('users')
        .update({
          failed_login_attempts: newFailedAttempts,
          locked_until: shouldLock
            ? new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString()
            : null,
        })
        .eq('id', user.id);

      await logAuthEvent({
        userId: user.id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: {
          reason: 'invalid_password',
          failedAttempts: newFailedAttempts,
          locked: shouldLock,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid username/email or password',
          remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - newFailedAttempts),
        },
        { status: 401 }
      );
    }

    // Check account status (use 'status' field, not 'is_active')
    if (user.status !== 'active') {
      await logAuthEvent({
        userId: user.id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'account_inactive', status: user.status },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'ACCOUNT_INACTIVE',
          message: user.status === 'suspended'
            ? 'Your account has been suspended. Please contact support.'
            : 'Your account is not activated yet. Please complete activation first.',
        },
        { status: 403 }
      );
    }

    // Generate tokens
    const tokenId = nanoid();
    const deviceId = nanoid();

    const { accessToken, refreshToken, expiresIn } = await generateTokenPair(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
      },
      tokenId,
      deviceId
    );

    // Store refresh token in database (hashed)
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await supabase.from('refresh_tokens').insert({
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
    await supabase
      .from('users')
      .update({
        last_login_at: new Date().toISOString(),
        last_login_ip: ipAddress,
        failed_login_attempts: 0,
        locked_until: null,
      })
      .eq('id', user.id);

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
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          emailVerified: user.email_verified,
          lastLoginAt: new Date().toISOString(),
        },
        accessToken,
        expiresIn,
      },
    });

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
