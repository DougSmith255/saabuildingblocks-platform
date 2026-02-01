/**
 * POST /api/automations/exp-guest-pass
 *
 * Receives guest info from the Cloudflare Function (join-team.js) and
 * spawns a Playwright automation that submits the guest pass on eXp's
 * invite-a-guest portal.
 *
 * - Validates a shared AUTOMATION_SECRET to prevent unauthorized calls
 * - Responds 202 immediately (fire-and-forget)
 * - Logs result to Supabase exp_guest_pass_logs table
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use direct Supabase client (no cookie context needed — this is a machine-to-machine call)
function getSupabase() {
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  if (!url || !key) return null;
  return createClient(url, key);
}

async function logToSupabase(
  data: {
    guest_email: string;
    guest_first_name: string;
    guest_last_name: string;
    status: 'success' | 'failed' | 'pending';
    error_message?: string;
  }
) {
  const supabase = getSupabase();
  if (!supabase) {
    console.error('[exp-guest-pass] Supabase not configured — skipping log');
    return;
  }

  const { error } = await supabase.from('exp_guest_pass_logs').insert(data);
  if (error) {
    console.error('[exp-guest-pass] Failed to log to Supabase:', error.message);
  }
}

export async function POST(request: NextRequest) {
  // Validate shared secret
  const automationSecret = process.env.AUTOMATION_SECRET;
  if (!automationSecret) {
    console.error('[exp-guest-pass] AUTOMATION_SECRET not configured');
    return NextResponse.json(
      { error: 'Server misconfigured' },
      { status: 500 }
    );
  }

  let body: { firstName?: string; lastName?: string; email?: string; secret?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { firstName, lastName, email, secret } = body;

  if (secret !== automationSecret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (!firstName || !email) {
    return NextResponse.json(
      { error: 'firstName and email are required' },
      { status: 400 }
    );
  }

  // Respond 202 immediately — automation runs in background
  const response = NextResponse.json(
    { accepted: true, message: 'Guest pass submission queued' },
    { status: 202 }
  );

  // Log pending status
  logToSupabase({
    guest_email: email,
    guest_first_name: firstName,
    guest_last_name: lastName || '',
    status: 'pending',
  }).catch(() => {});

  // Fire-and-forget: run the automation in the background
  // Dynamic import to avoid loading Playwright at module init time
  (async () => {
    try {
      console.log(`[exp-guest-pass] Starting automation for ${email}`);
      const { submitExpGuestPass } = await import('@/lib/exp-guest-pass-automation');

      const result = await submitExpGuestPass({
        firstName,
        lastName: lastName || '',
        email,
      });

      if (result.success) {
        console.log(`[exp-guest-pass] Success for ${email}`);
        await logToSupabase({
          guest_email: email,
          guest_first_name: firstName,
          guest_last_name: lastName || '',
          status: 'success',
        });
      } else {
        console.error(`[exp-guest-pass] Failed for ${email}: ${result.error}`);
        await logToSupabase({
          guest_email: email,
          guest_first_name: firstName,
          guest_last_name: lastName || '',
          status: 'failed',
          error_message: result.error,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[exp-guest-pass] Unhandled error for ${email}: ${message}`);
      await logToSupabase({
        guest_email: email,
        guest_first_name: firstName,
        guest_last_name: lastName || '',
        status: 'failed',
        error_message: message,
      }).catch(() => {});
    }
  })();

  return response;
}
