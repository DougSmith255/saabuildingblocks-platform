/**
 * Page Events Tracking API - Public (No Auth Required)
 *
 * POST /api/tracking/events
 * Records view and click events from agent link pages and attraction pages.
 * Fires from Cloudflare-served pages via sendBeacon — always returns 200.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

// CORS headers — public endpoint, any origin
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// In-memory slug → agent_page_id cache (5 min TTL)
const slugCache = new Map<string, { id: string; ts: number }>();
const SLUG_CACHE_TTL = 5 * 60 * 1000;

// Rate limiting: sliding window per IP (60 events/min)
const rateLimits = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 60;

// View dedup: skip duplicate views within 30 min
const viewDedup = new Map<string, number>();
const VIEW_DEDUP_WINDOW = 30 * 60 * 1000;

// Periodic cleanup (every 5 min)
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < SLUG_CACHE_TTL) return;
  lastCleanup = now;

  // Clean slug cache
  for (const [key, val] of slugCache) {
    if (now - val.ts > SLUG_CACHE_TTL) slugCache.delete(key);
  }
  // Clean rate limits
  for (const [key, times] of rateLimits) {
    const filtered = times.filter(t => now - t < RATE_LIMIT_WINDOW);
    if (filtered.length === 0) rateLimits.delete(key);
    else rateLimits.set(key, filtered);
  }
  // Clean dedup
  for (const [key, ts] of viewDedup) {
    if (now - ts > VIEW_DEDUP_WINDOW) viewDedup.delete(key);
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

function isDuplicateView(agentPageId: string, pageType: string, visitorId: string | undefined): boolean {
  if (!visitorId) return false;
  const key = `${agentPageId}:${pageType}:${visitorId}`;
  const last = viewDedup.get(key);
  const now = Date.now();
  if (last && now - last < VIEW_DEDUP_WINDOW) return true;
  viewDedup.set(key, now);
  return false;
}

const VALID_PAGE_TYPES = new Set(['links', 'attraction']);
const VALID_EVENT_TYPES = new Set(['view', 'click']);

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: { ...CORS_HEADERS, 'Access-Control-Max-Age': '86400' },
  });
}

export async function POST(request: NextRequest) {
  // Always return 200 — fire-and-forget from client perspective
  const ok = () => NextResponse.json({ ok: true }, { headers: CORS_HEADERS });

  try {
    cleanup();

    // Rate limit by IP
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

    const { slug, page_type, event_type, button_id, button_label, button_url, visitor_id, referrer } = body as {
      slug?: string;
      page_type?: string;
      event_type?: string;
      button_id?: string;
      button_label?: string;
      button_url?: string;
      visitor_id?: string;
      referrer?: string;
    };

    // Validate required fields
    if (!slug || typeof slug !== 'string') return ok();
    if (!page_type || !VALID_PAGE_TYPES.has(page_type)) return ok();
    if (!event_type || !VALID_EVENT_TYPES.has(event_type)) return ok();

    const supabase = getSupabaseServiceClient();
    if (!supabase) return ok();

    // Resolve slug → agent_page_id (cached)
    let agentPageId: string | null = null;
    const cached = slugCache.get(slug);
    if (cached && Date.now() - cached.ts < SLUG_CACHE_TTL) {
      agentPageId = cached.id;
    } else {
      const { data } = await supabase
        .from('agent_pages')
        .select('id')
        .eq('slug', slug)
        .single();
      if (data?.id) {
        agentPageId = data.id;
        slugCache.set(slug, { id: data.id, ts: Date.now() });
      }
    }

    if (!agentPageId) return ok();

    // View dedup: skip if same visitor saw this page type within 30 min
    if (event_type === 'view' && isDuplicateView(agentPageId, page_type, visitor_id as string | undefined)) {
      return ok();
    }

    // Insert event
    await supabase.from('page_events').insert({
      agent_page_id: agentPageId,
      slug,
      page_type,
      event_type,
      button_id: button_id || null,
      button_label: button_label ? String(button_label).slice(0, 200) : null,
      button_url: button_url ? String(button_url).slice(0, 2000) : null,
      visitor_id: visitor_id || null,
      referrer: referrer ? String(referrer).slice(0, 2000) : null,
    });

    return ok();
  } catch {
    // Never fail — fire-and-forget
    return ok();
  }
}
