import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { exec } from 'child_process';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Generate a short title (2-5 words) from a full blog title for featured image overlay.
 * Strips common prefixes like "eXp Realty", "How to", etc.
 */
function generateShortTitle(title: string): string {
  // Remove common suffixes after colons/dashes
  let short = title.split(':')[0].split(' - ')[0].split(' | ')[0].trim();

  // Remove common prefixes
  const prefixes = [
    /^(everything you need to know about|what you need to know about|what agents need to know about)\s+/i,
    /^(a complete guide to|the complete guide to|the ultimate guide to|guide to)\s+/i,
    /^(how to|why you should|what is|what are|is)\s+/i,
  ];
  for (const prefix of prefixes) {
    short = short.replace(prefix, '');
  }

  // Truncate to ~5 words max
  const words = short.split(/\s+/);
  if (words.length > 5) {
    short = words.slice(0, 5).join(' ');
  }

  return short.toUpperCase();
}

/**
 * Generate a Pexels search query from a blog title.
 */
function generateSearchQuery(title: string, category: string): string {
  // Category-specific base queries
  const categoryQueries: Record<string, string> = {
    'About eXp Realty': 'modern office technology business',
    'eXp Realty Sponsor': 'mentorship business meeting professional',
    'Brokerage Comparison': 'real estate office comparison business',
    'Marketing Mastery': 'digital marketing strategy creative',
    'Agent Career Info': 'career success professional growth',
    'Winning Clients': 'client handshake real estate deal',
    'Become an Agent': 'real estate license studying professional',
    'Real Estate Schools': 'education classroom learning professional',
    'Fun for Agents': 'team celebration success fun',
    'Industry Trends': 'modern cityscape real estate market',
  };

  // Extract key nouns from title
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'how', 'what', 'why', 'when', 'where', 'who', 'which', 'that', 'this', 'these', 'those', 'your', 'you', 'we', 'our', 'their', 'its', 'about', 'need', 'know', 'every', 'new', 'best', 'top', 'most']);
  const titleWords = title.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => !stopWords.has(w) && w.length > 2);
  const titleKeywords = titleWords.slice(0, 3).join(' ');

  const base = categoryQueries[category] || 'real estate professional business';
  return `${titleKeywords} ${base}`.trim();
}

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

    // Verify webhook secret
    const webhookSecret = process.env.WORDPRESS_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get('x-webhook-signature') || '';
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');
      if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
        console.error('[WordPress Webhook] Invalid signature');
        return NextResponse.json(
          { success: false, error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    } else {
      console.warn('[WordPress Webhook] WORDPRESS_WEBHOOK_SECRET not set - signature verification disabled');
    }

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

    // Generate featured image for new posts (fire-and-forget)
    if (payload.event_type === 'publish') {
      const shortTitle = generateShortTitle(payload.post_title || '');
      const category = payload.category || 'Uncategorized';
      const searchQuery = generateSearchQuery(payload.post_title || '', category);

      console.log('[WordPress Webhook] Generating featured image:', {
        post_id: payload.post_id,
        shortTitle,
        category,
        searchQuery,
      });

      // Run Python script in background - don't block the webhook response
      const scriptPath = '/home/ubuntu/saabuildingblocks-platform/packages/public-site/scripts/generate-featured-image.py';
      const cmd = [
        'python3', scriptPath,
        '--post-id', String(payload.post_id),
        '--title', JSON.stringify(payload.post_title || ''),
        '--short-title', JSON.stringify(shortTitle),
        '--category', JSON.stringify(category),
        '--query', JSON.stringify(searchQuery),
        '--upload',
      ].join(' ');

      exec(cmd, { timeout: 120000 }, (error, stdout, stderr) => {
        if (error) {
          console.error('[WordPress Webhook] Featured image generation failed:', error.message);
          if (stderr) console.error('[WordPress Webhook] stderr:', stderr);
        } else {
          console.log('[WordPress Webhook] Featured image generated:', stdout.trim());
        }
      });
    }

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
      category: 'string (optional, primary category name)',
    },
    automations: [
      'Generate branded featured image (on new publish)',
      'Trigger GitHub Actions deploy-cloudflare workflow',
      'Log to Supabase deployment_logs',
    ],
  });
}
