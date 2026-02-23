/**
 * 404 Paths API - Deploy Redirect
 *
 * POST /api/404-paths/deploy-redirect
 * Writes a redirect to Cloudflare KV and updates the DB status to 'redirect'.
 * The redirect takes effect at all edge locations within ~60s.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { id, path, target } = body;

    if (!path || !target) {
      return NextResponse.json(
        { error: 'Missing required fields: path and target' },
        { status: 400 }
      );
    }

    // Write to Cloudflare KV via REST API
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const namespaceId = process.env.REDIRECT_OVERRIDES_KV_NAMESPACE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !namespaceId || !apiToken) {
      return NextResponse.json(
        { error: 'Cloudflare KV credentials not configured' },
        { status: 503 }
      );
    }

    // Write the redirect to KV - both with and without trailing slash
    // so /foo and /foo/ both resolve in a single KV read
    const withSlash = path.endsWith('/') ? path : path + '/';
    const withoutSlash = path.endsWith('/') ? path.slice(0, -1) : path;
    const kvPaths = withoutSlash ? [withoutSlash, withSlash] : [path];

    for (const kvPath of kvPaths) {
      const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(kvPath)}`;

      const kvResponse = await fetch(kvUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'text/plain',
        },
        body: target,
      });

      if (!kvResponse.ok) {
        const kvError = await kvResponse.text();
        console.error('[deploy-redirect] KV write failed for', kvPath, ':', kvError);
        return NextResponse.json(
          { error: 'Failed to write redirect to Cloudflare KV', details: kvError },
          { status: 502 }
        );
      }
    }

    // Update DB status to 'redirect'
    if (id) {
      const { error: dbError } = await supabase
        .from('http_404_paths')
        .update({
          status: 'redirect',
          redirect_target: target,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin',
        })
        .eq('id', id);

      if (dbError) {
        console.error('[deploy-redirect] DB update failed:', dbError);
        // KV write succeeded but DB update failed - not ideal but redirect still works
        return NextResponse.json({
          success: true,
          warning: 'Redirect deployed to edge but database update failed',
          details: dbError.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Redirect deployed: ${path} → ${target}`,
    });
  } catch (error) {
    console.error('[deploy-redirect] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
