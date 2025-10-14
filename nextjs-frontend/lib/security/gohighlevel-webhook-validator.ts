import crypto from 'crypto';

/**
 * GoHighLevel Webhook Signature Validator
 *
 * Validates webhook requests from GoHighLevel using RSA signature verification
 * Prevents replay attacks and ensures request authenticity
 */

interface ValidationResult {
  valid: boolean;
  error?: string;
  timestamp?: number;
}

interface ReplayCache {
  [signature: string]: number; // signature -> timestamp
}

// In-memory cache for replay attack prevention (consider Redis for production)
const replayCache: ReplayCache = {};
const REPLAY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_TIMESTAMP_DIFF = 5 * 60 * 1000; // 5 minutes

/**
 * Clean expired entries from replay cache
 */
function cleanReplayCache(): void {
  const now = Date.now();
  Object.keys(replayCache).forEach((signature) => {
    if (now - replayCache[signature] > REPLAY_CACHE_TTL) {
      delete replayCache[signature];
    }
  });
}

/**
 * Verify RSA signature from GoHighLevel webhook
 *
 * @param payload - Raw webhook payload (JSON string)
 * @param signature - Base64 encoded signature from X-Signature header
 * @param publicKey - GoHighLevel public key (PEM format)
 * @returns ValidationResult
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  publicKey: string
): ValidationResult {
  try {
    // Clean old cache entries periodically
    cleanReplayCache();

    // Check for replay attack
    if (replayCache[signature]) {
      return {
        valid: false,
        error: 'Replay attack detected: signature already used',
      };
    }

    // Parse payload to extract timestamp
    let parsedPayload: any;
    try {
      parsedPayload = JSON.parse(payload);
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid JSON payload',
      };
    }

    // Validate timestamp (reject requests older than 5 minutes)
    const timestamp = parsedPayload.timestamp || parsedPayload.createdAt;
    if (!timestamp) {
      return {
        valid: false,
        error: 'Missing timestamp in payload',
      };
    }

    const payloadTimestamp = new Date(timestamp).getTime();
    const now = Date.now();
    const timeDiff = Math.abs(now - payloadTimestamp);

    if (timeDiff > MAX_TIMESTAMP_DIFF) {
      return {
        valid: false,
        error: `Request timestamp too old (${Math.floor(timeDiff / 1000)}s ago)`,
        timestamp: payloadTimestamp,
      };
    }

    // Verify RSA signature
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(payload);
    verifier.end();

    const isValid = verifier.verify(
      publicKey,
      signature,
      'base64'
    );

    if (!isValid) {
      return {
        valid: false,
        error: 'Invalid signature',
      };
    }

    // Cache signature to prevent replay
    replayCache[signature] = now;

    return {
      valid: true,
      timestamp: payloadTimestamp,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Middleware for validating GoHighLevel webhooks
 *
 * Usage in API route:
 * const validation = await validateGoHighLevelWebhook(req);
 * if (!validation.valid) {
 *   return res.status(401).json({ error: validation.error });
 * }
 */
export async function validateGoHighLevelWebhook(
  req: Request | any
): Promise<ValidationResult> {
  try {
    // Extract signature from headers
    const signature = req.headers.get?.('x-signature') || req.headers['x-signature'];
    if (!signature) {
      return {
        valid: false,
        error: 'Missing X-Signature header',
      };
    }

    // Get public key from environment
    const publicKey = process.env.GOHIGHLEVEL_PUBLIC_KEY;
    if (!publicKey) {
      return {
        valid: false,
        error: 'GoHighLevel public key not configured',
      };
    }

    // Get raw body (must be preserved for signature verification)
    const rawBody = typeof req.body === 'string'
      ? req.body
      : JSON.stringify(req.body);

    // Verify signature
    return verifyWebhookSignature(rawBody, signature, publicKey);
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Validation error',
    };
  }
}

/**
 * Generate test signature for development/testing
 *
 * @param payload - Payload to sign
 * @param privateKey - Private key (PEM format)
 * @returns Base64 encoded signature
 */
export function generateTestSignature(
  payload: string,
  privateKey: string
): string {
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(payload);
  signer.end();
  return signer.sign(privateKey, 'base64');
}

/**
 * Get replay cache statistics (for monitoring)
 */
export function getReplayCacheStats(): {
  size: number;
  oldestEntry: number | null;
} {
  const entries = Object.values(replayCache);
  return {
    size: entries.length,
    oldestEntry: entries.length > 0 ? Math.min(...entries) : null,
  };
}
