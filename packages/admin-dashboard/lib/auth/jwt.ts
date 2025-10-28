/**
 * JWT Token Management
 * Authentication API - Phase 1: Agent Portal
 *
 * Provides JWT token generation, verification, and management utilities
 * using jose library for modern, edge-compatible JWT handling.
 */

import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';
import { createHash } from 'crypto';

// Environment variables with fallbacks
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-replace-in-production'
);

const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-min-32-chars-replace-in-production'
);

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '30d';

export interface AccessTokenData {
  userId: string;
  username: string;
  email: string;
  role: string;
  permissions?: string[];
}

export interface RefreshTokenData {
  userId: string;
  tokenId: string;
  deviceId?: string;
}

export interface AccessTokenPayload {
  sub: string;              // User ID
  username: string;
  email: string;
  role: string;
  permissions: string[];
  iat: number;             // Issued at
  exp: number;             // Expiration
  jti: string;             // JWT ID
}

export interface RefreshTokenPayload {
  sub: string;              // User ID
  tokenId: string;
  deviceId?: string;
  iat: number;
  exp: number;
  jti: string;
}

/**
 * Generate Access Token (15 minutes)
 * Stored in memory only for XSS protection
 */
export async function generateAccessToken(data: AccessTokenData): Promise<string> {
  const jwt = await new SignJWT({
    sub: data.userId,
    username: data.username,
    email: data.email,
    role: data.role,
    permissions: data.permissions || [],
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setJti(nanoid())
    .sign(JWT_SECRET);

  return jwt;
}

/**
 * Generate Refresh Token (30 days)
 * Stored in HttpOnly, Secure, SameSite cookie
 */
export async function generateRefreshToken(data: RefreshTokenData): Promise<string> {
  const jwt = await new SignJWT({
    sub: data.userId,
    tokenId: data.tokenId,
    deviceId: data.deviceId,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .setJti(nanoid())
    .sign(JWT_REFRESH_SECRET);

  return jwt;
}

/**
 * Verify Access Token
 * Returns payload if valid, null if invalid
 */
export async function verifyAccessToken(token: string): Promise<{
  valid: boolean;
  payload?: AccessTokenPayload;
  error?: string;
}> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });

    return {
      valid: true,
      payload: payload as unknown as AccessTokenPayload,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid token',
    };
  }
}

/**
 * Verify Refresh Token
 * Returns payload if valid, null if invalid
 */
export async function verifyRefreshToken(token: string): Promise<{
  valid: boolean;
  payload?: RefreshTokenPayload;
  error?: string;
}> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET, {
      algorithms: ['HS256'],
    });

    return {
      valid: true,
      payload: payload as unknown as RefreshTokenPayload,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid token',
    };
  }
}

/**
 * Hash token for database storage (SHA-256)
 * Never store raw tokens in database
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Generate token pair (access + refresh)
 */
export async function generateTokenPair(
  userData: AccessTokenData,
  tokenId: string,
  deviceId?: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(userData),
    generateRefreshToken({
      userId: userData.userId,
      tokenId,
      deviceId,
    }),
  ]);

  return {
    accessToken,
    refreshToken,
    expiresIn: 900, // 15 minutes in seconds
  };
}

/**
 * Decode JWT without verification (for debugging only)
 * DO NOT use for authentication - always verify!
 */
export function decodeToken(token: string): any {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const payload = JSON.parse(
    Buffer.from(parts[1], 'base64url').toString('utf-8')
  );
  return payload;
}

/**
 * Extract user ID from authorization header
 */
export function extractUserIdFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const payload = decodeToken(token);
    return payload.sub || null;
  } catch {
    return null;
  }
}

/**
 * Create audit log entry for authentication events
 */
export async function logAuthEvent(params: {
  userId?: string;
  eventType: 'login' | 'logout' | 'refresh' | 'failed_login' | 'token_refresh' | 'token_revoked';
  success: boolean;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
}) {
  const { getSupabaseClient } = await import('@/app/master-controller/lib/supabaseClient');
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn('Supabase not configured - skipping audit log');
    return;
  }

  try {
    await supabase.from('audit_logs').insert({
      user_id: params.userId || null,
      event_type: params.eventType,
      event_category: 'auth',
      ip_address: params.ipAddress,
      user_agent: params.userAgent,
      success: params.success,
      metadata: params.metadata || {},
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Rate limiting check (simple in-memory implementation)
 * For production, use Redis or Upstash
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Reset if window expired
  if (!record || record.resetAt < now) {
    const resetAt = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: maxAttempts - 1, resetAt };
  }

  // Check if limit exceeded
  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  // Increment count
  record.count++;
  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
