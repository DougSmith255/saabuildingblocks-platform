/**
 * Public Error Logging Endpoint
 * POST /api/errors/log
 *
 * Allows Cloudflare Functions to report errors to the platform_errors table.
 * Rate-limited and CORS-enabled for smartagentalliance.com.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Simple in-memory rate limiter (100 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

const ALLOWED_ORIGINS = [
  'https://smartagentalliance.com',
  'https://www.smartagentalliance.com',
  'https://saabuildingblocks.com',
  'https://saabuildingblocks.pages.dev',
];

function getCorsHeaders(origin?: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get('origin')),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: corsHeaders }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400, headers: corsHeaders }
    );
  }

  // Validate required fields
  const source = typeof body.source === 'string' ? body.source.slice(0, 200) : null;
  const errorMessage = typeof body.error_message === 'string' ? body.error_message.slice(0, 5000) : null;

  if (!source || !errorMessage) {
    return NextResponse.json(
      { error: 'source and error_message are required' },
      { status: 400, headers: corsHeaders }
    );
  }

  const validSeverities = ['warning', 'error', 'critical'];
  const severity = validSeverities.includes(body.severity as string) ? body.severity : 'error';

  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  if (!url || !key) {
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 503, headers: corsHeaders }
    );
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from('platform_errors').insert({
    source,
    severity,
    error_code: typeof body.error_code === 'string' ? body.error_code.slice(0, 100) : null,
    error_message: errorMessage,
    stack_trace: typeof body.stack_trace === 'string' ? body.stack_trace.slice(0, 10000) : null,
    request_path: typeof body.request_path === 'string' ? body.request_path.slice(0, 500) : null,
    request_method: typeof body.request_method === 'string' ? body.request_method.slice(0, 10) : null,
    user_agent: typeof body.user_agent === 'string' ? body.user_agent.slice(0, 500) : null,
    metadata: typeof body.metadata === 'object' && body.metadata !== null ? body.metadata : {},
  });

  if (error) {
    console.error('[errors/log] Insert failed:', error.message);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500, headers: corsHeaders }
    );
  }

  return NextResponse.json({ success: true }, { headers: corsHeaders });
}
