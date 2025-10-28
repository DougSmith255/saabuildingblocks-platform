/**
 * Rate Limiting Middleware
 *
 * In-memory rate limiting for API endpoints
 * For production, consider using Redis or a dedicated rate limiting service
 */

import { NextRequest } from 'next/server';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries every 5 minutes
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limit a request based on IP address
 *
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<{
  success: boolean;
  remaining: number;
  resetTime: number;
}> {
  // Get client IP address
  const ip = getClientIp(request);
  const key = `ratelimit:${ip}`;
  const now = Date.now();

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // Increment request count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP address from request headers
 *
 * Checks multiple headers in order of preference:
 * 1. X-Forwarded-For (behind proxy)
 * 2. X-Real-IP (nginx)
 * 3. CF-Connecting-IP (Cloudflare)
 * 4. Fallback to 'unknown'
 */
function getClientIp(request: NextRequest): string {
  // Try X-Forwarded-For first (most common behind reverse proxy)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, use the first one
    return forwardedFor.split(',')[0].trim();
  }

  // Try X-Real-IP (nginx)
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Try Cloudflare-specific header
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Fallback
  return 'unknown';
}

/**
 * Create a rate limiter with specific configuration
 *
 * Usage:
 * ```typescript
 * const limiter = createRateLimiter({ maxRequests: 10, windowMs: 60000 });
 * const result = await limiter(request);
 * ```
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (request: NextRequest) => rateLimit(request, config);
}

/**
 * Rate limit configurations for different endpoint types
 */
export const RateLimitPresets = {
  // Public endpoints (strict)
  public: {
    maxRequests: 5,
    windowMs: 60000, // 1 minute
  },

  // Authentication endpoints (very strict)
  auth: {
    maxRequests: 3,
    windowMs: 60000, // 1 minute
  },

  // API endpoints (moderate)
  api: {
    maxRequests: 30,
    windowMs: 60000, // 1 minute
  },

  // Admin endpoints (lenient)
  admin: {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
  },
};
