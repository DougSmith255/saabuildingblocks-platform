/**
 * Rate Limiter for API Routes
 *
 * Implements token bucket algorithm for rate limiting
 * Stores limits in memory (consider Redis for production)
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier: string; // IP, token, user ID, etc.
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore: Map<string, RateLimitEntry> = new Map();

/**
 * Clean expired rate limit entries
 */
function cleanExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if request is rate limited
 *
 * @param config - Rate limit configuration
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(config: RateLimitConfig): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
} {
  cleanExpiredEntries();

  const now = Date.now();
  const key = config.identifier;
  const existing = rateLimitStore.get(key);

  // First request or expired window
  if (!existing || now > existing.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(key, {
      count: 1,
      resetTime,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  // Within window, check if under limit
  if (existing.count < config.maxRequests) {
    existing.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - existing.count,
      resetTime: existing.resetTime,
    };
  }

  // Rate limit exceeded
  return {
    allowed: false,
    remaining: 0,
    resetTime: existing.resetTime,
    retryAfter: Math.ceil((existing.resetTime - now) / 1000),
  };
}

/**
 * Rate limit middleware for Next.js API routes
 *
 * Usage:
 * const limiter = createRateLimiter({ maxRequests: 100, windowMs: 60000 });
 * const rateLimitResult = limiter(req);
 * if (!rateLimitResult.allowed) {
 *   return res.status(429).json({ error: 'Too many requests' });
 * }
 */
export function createRateLimiter(config: {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: Request | any) => string;
}) {
  return (req: Request | any) => {
    const identifier = config.keyGenerator
      ? config.keyGenerator(req)
      : getClientIdentifier(req);

    return checkRateLimit({
      maxRequests: config.maxRequests,
      windowMs: config.windowMs,
      identifier,
    });
  };
}

/**
 * Extract client identifier from request (IP, token, etc.)
 */
function getClientIdentifier(req: Request | any): string {
  // Try to get IP from various headers (Cloudflare, proxy, etc.)
  const forwarded = req.headers.get?.('cf-connecting-ip') ||
                   req.headers['cf-connecting-ip'] ||
                   req.headers.get?.('x-forwarded-for') ||
                   req.headers['x-forwarded-for'] ||
                   req.headers.get?.('x-real-ip') ||
                   req.headers['x-real-ip'];

  if (forwarded) {
    return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
  }

  // Fallback to generic identifier
  return 'unknown';
}

/**
 * Predefined rate limiters for common use cases
 */
export const rateLimiters = {
  /**
   * User activation endpoint: 3 attempts per hour per token
   */
  userActivation: createRateLimiter({
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyGenerator: (req) => {
      const token = req.url?.split('token=')[1] || 'unknown';
      return `activation:${token}`;
    },
  }),

  /**
   * GoHighLevel contacts API: 100 requests per hour
   */
  gohighlevelContacts: createRateLimiter({
    maxRequests: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
  }),

  /**
   * GoHighLevel webhooks: 1000 requests per hour
   */
  gohighlevelWebhooks: createRateLimiter({
    maxRequests: 1000,
    windowMs: 60 * 60 * 1000, // 1 hour
  }),

  /**
   * General API: 60 requests per minute
   */
  general: createRateLimiter({
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
  }),
};

/**
 * Get rate limiter statistics (for monitoring)
 */
export function getRateLimiterStats(): {
  totalEntries: number;
  topLimitedClients: Array<{ identifier: string; count: number }>;
} {
  const entries = Array.from(rateLimitStore.entries())
    .map(([identifier, entry]) => ({
      identifier,
      count: entry.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalEntries: rateLimitStore.size,
    topLimitedClients: entries,
  };
}
