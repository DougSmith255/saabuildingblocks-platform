/**
 * Portal Heartbeat API
 *
 * POST - Agent sends heartbeat (JWT auth) — records last-seen
 * GET  - Admin checks active agents (session auth)
 *
 * In-memory tracking — no database needed. Agents not seen
 * in 2 minutes are considered offline.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAgentAuth } from '@/app/api/middleware/agentPageAuth';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Agents considered offline after this many ms without a heartbeat
const OFFLINE_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes

// Emails to exclude from the count (leadership)
const EXCLUDED_EMAILS = ['doug@smartagentalliance.com', 'karrie@smartagentalliance.com'];

interface AgentPresence {
  userId: string;
  username: string;
  email: string;
  lastSeen: number;
  section: string;
}

// In-memory presence map
const activeAgents = new Map<string, AgentPresence>();

// Clean up stale entries
function pruneStale() {
  const now = Date.now();
  for (const [userId, presence] of activeAgents) {
    if (now - presence.lastSeen > OFFLINE_THRESHOLD_MS) {
      activeAgents.delete(userId);
    }
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST /api/portal-heartbeat - Agent sends heartbeat
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAgentAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ ok: true }, { status: 200, headers: CORS_HEADERS });
    }

    const body = await request.json().catch(() => ({}));

    activeAgents.set(auth.userId!, {
      userId: auth.userId!,
      username: body.username || 'Unknown',
      email: body.email || '',
      lastSeen: Date.now(),
      section: body.section || 'unknown',
    });

    pruneStale();

    return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
  } catch {
    return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
  }
}

/**
 * GET /api/portal-heartbeat - Admin checks active agents
 */
export async function GET() {
  try {
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    pruneStale();

    const agents: AgentPresence[] = [];
    for (const presence of activeAgents.values()) {
      if (!EXCLUDED_EMAILS.includes(presence.email.toLowerCase())) {
        agents.push(presence);
      }
    }

    // Sort by most recently seen
    agents.sort((a, b) => b.lastSeen - a.lastSeen);

    return NextResponse.json({
      success: true,
      count: agents.length,
      agents: agents.map(a => ({
        username: a.username,
        section: a.section,
        lastSeen: a.lastSeen,
        secsAgo: Math.round((Date.now() - a.lastSeen) / 1000),
      })),
    });
  } catch (error) {
    console.error('[portal-heartbeat] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
