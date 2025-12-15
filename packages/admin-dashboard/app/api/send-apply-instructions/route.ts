/**
 * API Route: Send Apply Instructions Email
 *
 * POST /api/send-apply-instructions
 *
 * Request body:
 * {
 *   recipientEmail: string;
 *   recipientFirstName: string;
 *   agentName: string;
 *   agentEmail: string;
 * }
 *
 * Response:
 * {
 *   success: boolean;
 *   messageId?: string;
 *   message?: string;
 *   error?: string;
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendApplyInstructionsEmail } from '@/lib/email/send';

export const dynamic = 'force-dynamic';

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 5 emails per minute per IP
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
    const { recipientEmail, recipientFirstName, agentName, agentEmail } = body;

    // Validate required fields
    if (!recipientEmail || !recipientFirstName || !agentName || !agentEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: recipientEmail, recipientFirstName, agentName, agentEmail',
        },
        { status: 400 }
      );
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid recipient email format',
        },
        { status: 400 }
      );
    }

    if (!emailRegex.test(agentEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid agent email format',
        },
        { status: 400 }
      );
    }

    // Send the email
    const result = await sendApplyInstructionsEmail({
      recipientEmail,
      recipientFirstName,
      agentName,
      agentEmail,
    });

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          messageId: result.messageId,
          message: 'Instructions sent successfully',
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to send email',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error sending apply instructions:', error);

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
 * GET /api/send-apply-instructions - Health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/send-apply-instructions',
    rateLimit: {
      limit: RATE_LIMIT,
      window: `${RATE_WINDOW / 1000}s`,
    },
  });
}
