/**
 * Centralized Platform Error Logger
 *
 * Fire-and-forget error logging to Supabase `platform_errors` table.
 * Never throws, never blocks the response. Falls back to console.error
 * if the Supabase insert fails.
 *
 * Usage in any API route catch block:
 *   logPlatformError({
 *     source: '/api/auth/activate',
 *     severity: 'error',
 *     error_code: 'ACTIVATION_FAILED',
 *     error_message: error.message,
 *     request,  // optional NextRequest
 *     user_id: userId,  // optional
 *     metadata: { token_expired: true },  // optional
 *   });
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

interface LogErrorOptions {
  source: string;
  severity?: 'warning' | 'error' | 'critical';
  error_code?: string;
  error_message: string;
  stack_trace?: string;
  user_id?: string;
  request?: NextRequest;
  request_path?: string;
  request_method?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
}

let supabaseClient: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (supabaseClient) return supabaseClient;

  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  if (!url || !key) return null;

  supabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabaseClient;
}

export function logPlatformError(opts: LogErrorOptions): void {
  // Fire-and-forget - don't await, don't throw
  (async () => {
    try {
      const client = getClient();
      if (!client) {
        console.error(`[ErrorLogger] Supabase not configured. Error: ${opts.error_message}`);
        return;
      }

      const row: Record<string, unknown> = {
        source: opts.source,
        severity: opts.severity || 'error',
        error_code: opts.error_code || null,
        error_message: opts.error_message,
        stack_trace: opts.stack_trace || null,
        user_id: opts.user_id || null,
        metadata: opts.metadata || {},
      };

      // Extract request info if NextRequest is provided
      if (opts.request) {
        row.request_path = opts.request.nextUrl?.pathname || opts.request.url;
        row.request_method = opts.request.method;
        row.user_agent = opts.request.headers.get('user-agent') || null;
      } else {
        row.request_path = opts.request_path || null;
        row.request_method = opts.request_method || null;
        row.user_agent = opts.user_agent || null;
      }

      const { error } = await client.from('platform_errors' as never).insert(row as never);
      if (error) {
        console.error(`[ErrorLogger] Failed to insert:`, error.message);
      }
    } catch (err) {
      console.error(`[ErrorLogger] Unexpected failure:`, err);
    }
  })();
}
