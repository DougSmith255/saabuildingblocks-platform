import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/webhooks/wordpress
 * Webhook endpoint for WordPress blog post publish/update events
 *
 * Security:
 * - Whitelisted in middleware (no HTTP Basic Auth required)
 * - Optional: Validate webhook signature (TODO)
 *
 * Flow:
 * 1. WordPress blog post published/updated
 * 2. WordPress plugin (saa-auto-rebuild) sends webhook
 * 3. This endpoint receives webhook
 * 4. Triggers GitHub Actions workflow
 * 5. Logs to Supabase deployment_logs table
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse webhook payload
    const payload = await request.json();

    console.log('[WordPress Webhook] Received:', {
      post_id: payload.post_id,
      post_slug: payload.post_slug,
      post_title: payload.post_title,
      event_type: payload.event_type,
    });

    // Validate required fields
    if (!payload.post_id || !payload.post_slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'post_id and post_slug are required',
        },
        { status: 400 }
      );
    }

    // TODO: Validate webhook signature for security
    // const signature = request.headers.get('x-webhook-signature');
    // if (!validateSignature(payload, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    // Get GitHub credentials from environment
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER || 'DougSmith255';
    const githubRepo = process.env.GITHUB_REPO || 'saabuildingblocks-platform';

    if (!githubToken) {
      console.error('[WordPress Webhook] GITHUB_TOKEN not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'GitHub token not configured',
        },
        { status: 500 }
      );
    }

    console.log('[WordPress Webhook] Triggering GitHub Actions workflow...');

    // Trigger GitHub Actions workflow using workflow_dispatch
    const workflowUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/actions/workflows/deploy-cloudflare.yml/dispatches`;

    const response = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'SAA-WordPress-Webhook/1.0',
      },
      body: JSON.stringify({
        ref: 'main', // Branch to run workflow on
        inputs: {
          post_id: String(payload.post_id),
          post_slug: String(payload.post_slug),
          deployment_type: 'incremental',
          triggered_by: 'wordpress',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[WordPress Webhook] GitHub API error:', response.status, errorText);

      throw new Error(`GitHub API error: ${response.status} ${errorText}`);
    }

    const duration = Date.now() - startTime;

    // Log to Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase.from('deployment_logs').insert({
        trigger_type: 'blog',
        status: 'triggered',
        duration,
        metadata: {
          post_id: payload.post_id,
          post_slug: payload.post_slug,
          post_title: payload.post_title,
          event_type: payload.event_type,
          triggered_by: 'wordpress',
          github_owner: githubOwner,
          github_repo: githubRepo,
        },
      });

      console.log('[WordPress Webhook] Logged to Supabase');
    } catch (logError) {
      console.warn('[WordPress Webhook] Failed to log to Supabase:', logError);
      // Non-fatal error
    }

    const workflowRunsUrl = `https://github.com/${githubOwner}/${githubRepo}/actions/workflows/deploy-cloudflare.yml`;

    console.log('[WordPress Webhook] Success - workflow triggered');

    return NextResponse.json({
      success: true,
      message: 'Deployment triggered successfully',
      data: {
        post_id: payload.post_id,
        post_slug: payload.post_slug,
        workflowUrl: workflowRunsUrl,
        status: 'triggered',
        duration: `${duration}ms`,
        triggeredAt: new Date().toISOString(),
      },
    });

  } catch (error: unknown) {
    const duration = Date.now() - startTime;

    console.error('[WordPress Webhook] Error:', error);

    // Type guard for Error objects
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Log error to Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase.from('deployment_logs').insert({
        trigger_type: 'blog',
        status: 'error',
        duration,
        metadata: {
          error: errorMessage,
          triggered_by: 'wordpress',
        },
      });
    } catch (logError) {
      console.warn('[WordPress Webhook] Failed to log error to Supabase:', logError);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to trigger deployment',
        details: errorMessage,
        duration: `${duration}ms`,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/wordpress
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'WordPress webhook endpoint operational',
    endpoint: '/api/webhooks/wordpress',
    method: 'POST',
    expectedPayload: {
      post_id: 'number (required)',
      post_slug: 'string (required)',
      post_title: 'string (optional)',
      event_type: 'string (optional, e.g., "publish" or "update")',
    },
  });
}
