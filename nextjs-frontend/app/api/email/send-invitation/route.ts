// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * API Route: Send Invitation Email
 *
 * POST /api/email/send-invitation
 *
 * Request body:
 * {
 *   to: string;
 *   firstName: string;
 *   activationToken: string;
 *   inviterName?: string;
 *   role?: string;
 *   expiresInDays?: number;
 * }
 *
 * Response:
 * {
 *   success: boolean;
 *   messageId?: string;
 *   error?: string;
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendInvitationEmail } from '@/lib/email/send';
import { getEmailServiceHealth } from '@/lib/email/email-service';

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 emails per minute per IP
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.to || !body.firstName || !body.activationToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: to, firstName, activationToken',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.to)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // Send invitation email
    const result = await sendInvitationEmail({
      to: body.to,
      firstName: body.firstName,
      activationToken: body.activationToken,
      inviterName: body.inviterName,
      role: body.role,
      expiresInDays: body.expiresInDays,
    });

    // Return appropriate status code
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('❌ API error sending invitation email:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/email/send-invitation - Health check
 */
export async function GET() {
  const health = getEmailServiceHealth();

  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/email/send-invitation',
    health,
    rateLimit: {
      limit: RATE_LIMIT,
      window: `${RATE_WINDOW / 1000}s`,
    },
  });
}
