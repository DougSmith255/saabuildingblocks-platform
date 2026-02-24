/**
 * Video Events Tracking API - Public (No Auth Required)
 *
 * POST /api/video/events
 * Records play, heartbeat, and ended events from video players.
 * Fires from sendBeacon — always returns 200.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Rate limiting: sliding window per IP (120 events/min — higher than page events since heartbeats are frequent)
const rateLimits = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 120;

let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;
  for (const [key, times] of rateLimits) {
    const filtered = times.filter(t => now - t < RATE_LIMIT_WINDOW);
    if (filtered.length === 0) rateLimits.delete(key);
    else rateLimits.set(key, filtered);
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = rateLimits.get(ip) || [];
  const recent = times.filter(t => now - t < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  rateLimits.set(ip, recent);
  return false;
}

const VALID_EVENT_TYPES = new Set(['play', 'heartbeat', 'ended']);

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: { ...CORS_HEADERS, 'Access-Control-Max-Age': '86400' },
  });
}

export async function POST(request: NextRequest) {
  const ok = () => NextResponse.json({ ok: true }, { headers: CORS_HEADERS });

  try {
    cleanup();

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    if (isRateLimited(ip)) return ok();

    // Parse body — sendBeacon may send as text/plain
    let body: Record<string, unknown>;
    try {
      const text = await request.text();
      body = JSON.parse(text);
    } catch {
      return ok();
    }

    const {
      video_id,
      session_id,
      event_type,
      watch_time_seconds,
      video_duration_seconds,
      visitor_id,
      page_url,
      slug,
    } = body as {
      video_id?: string;
      session_id?: string;
      event_type?: string;
      watch_time_seconds?: number;
      video_duration_seconds?: number;
      visitor_id?: string;
      page_url?: string;
      slug?: string;
    };

    // Validate required fields
    if (!video_id || typeof video_id !== 'string') return ok();
    if (!session_id || typeof session_id !== 'string') return ok();
    if (!event_type || !VALID_EVENT_TYPES.has(event_type)) return ok();

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      console.error('[video/events] Supabase service client is null — check SUPABASE_SERVICE_ROLE_KEY');
      return ok();
    }

    const completed = event_type === 'ended';
    const watchTime = typeof watch_time_seconds === 'number' ? watch_time_seconds : 0;
    const videoDuration = typeof video_duration_seconds === 'number' ? video_duration_seconds : null;

    // Use RPC function for proper GREATEST/OR upsert logic
    const { error: rpcError } = await supabase.rpc('upsert_video_view', {
      p_video_id: video_id,
      p_session_id: session_id,
      p_visitor_id: visitor_id || null,
      p_page_url: page_url ? String(page_url).slice(0, 2000) : null,
      p_slug: slug ? String(slug).slice(0, 200) : null,
      p_watch_time_seconds: watchTime,
      p_video_duration_seconds: videoDuration,
      p_completed: completed,
    });

    if (rpcError) {
      console.error('[video/events] RPC upsert_video_view failed:', rpcError.message, rpcError.code, rpcError.details);
    }

    return ok();
  } catch (err) {
    console.error('[video/events] Unexpected error:', err);
    return ok();
  }
}
