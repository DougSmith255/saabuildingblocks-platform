import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Rate limiting: 1 deploy per 5 minutes
const deploymentCooldown = 5 * 60 * 1000; // 5 minutes in milliseconds
let lastDeploymentTime = 0;

/**
 * POST /api/master-controller/deploy
 * Triggers GitHub Actions workflow to deploy to Cloudflare Pages
 *
 * Security:
 * - Protected by middleware (HTTP Basic Auth)
 * - Rate limited (1 deploy per 5 minutes)
 * - Requires GITHUB_TOKEN environment variable
 *
 * Workflow triggered: .github/workflows/deploy-cloudflare.yml
 * Note: All caching disabled in workflow for guaranteed fresh builds
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check rate limiting
    const now = Date.now();
    const timeSinceLastDeploy = now - lastDeploymentTime;

    if (timeSinceLastDeploy < deploymentCooldown) {
      const remainingTime = Math.ceil((deploymentCooldown - timeSinceLastDeploy) / 1000);

      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: `Please wait ${remainingTime} seconds before deploying again`,
          remainingSeconds: remainingTime,
        },
        { status: 429 }
      );
    }

    // Parse request body (optional parameters)
    const body = await request.json().catch(() => ({}));
    const { deploymentType = 'incremental' } = body;

    // Validate deployment type
    if (!['incremental', 'full'].includes(deploymentType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid deployment type',
          message: 'deploymentType must be "incremental" or "full"',
        },
        { status: 400 }
      );
    }

    // Get GitHub credentials from environment
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER || 'DougSmith255';
    const githubRepo = process.env.GITHUB_REPO || 'saabuildingblocks-platform';

    if (!githubToken) {
      console.error('[Deploy] GITHUB_TOKEN not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'GitHub token not configured',
          message: 'GITHUB_TOKEN environment variable is required',
        },
        { status: 500 }
      );
    }

    console.log('[Deploy] Triggering GitHub Actions workflow...');
    console.log('[Deploy] Repository:', `${githubOwner}/${githubRepo}`);
    console.log('[Deploy] Deployment type:', deploymentType);

    // Trigger GitHub Actions workflow using workflow_dispatch
    const workflowUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/actions/workflows/deploy-cloudflare.yml/dispatches`;

    const response = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'SAA-Master-Controller/1.0',
      },
      body: JSON.stringify({
        ref: 'main', // Branch to run workflow on
        inputs: {
          deployment_type: deploymentType,
          triggered_by: 'master-controller',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Deploy] GitHub API error:', response.status, errorText);

      throw new Error(`GitHub API error: ${response.status} ${errorText}`);
    }

    // Update rate limit timestamp
    lastDeploymentTime = now;

    // Log to Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase.from('deployment_logs').insert({
        trigger_type: 'deploy',
        status: 'triggered',
        duration: Date.now() - startTime,
        metadata: {
          deployment_type: deploymentType,
          triggered_by: 'master-controller',
          github_owner: githubOwner,
          github_repo: githubRepo,
        },
      });
    } catch (logError) {
      console.warn('[Deploy] Failed to log to Supabase:', logError);
      // Non-fatal error
    }

    const duration = Date.now() - startTime;

    // GitHub API doesn't return run ID immediately for workflow_dispatch
    // We can only return the workflow URL
    const workflowRunsUrl = `https://github.com/${githubOwner}/${githubRepo}/actions/workflows/deploy-cloudflare.yml`;

    console.log('[Deploy] Success - workflow triggered');

    return NextResponse.json({
      success: true,
      message: 'Deployment triggered successfully',
      data: {
        workflowUrl: workflowRunsUrl,
        status: 'triggered',
        deploymentType,
        duration: `${duration}ms`,
        triggeredAt: new Date().toISOString(),
        note: 'Workflow will start shortly. Check GitHub Actions for progress.',
      },
    });

  } catch (error: unknown) {
    const duration = Date.now() - startTime;

    console.error('[Deploy] Error:', error);

    // Type guard for Error objects
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Log error to Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase.from('deployment_logs').insert({
        trigger_type: 'deploy',
        status: 'error',
        duration,
        metadata: {
          error: errorMessage,
          triggered_by: 'master-controller',
        },
      });
    } catch (logError) {
      console.warn('[Deploy] Failed to log error to Supabase:', logError);
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
 * GET /api/master-controller/deploy
 * Get deployment status and rate limit info
 */
export async function GET() {
  try {
    const now = Date.now();
    const timeSinceLastDeploy = now - lastDeploymentTime;
    const canDeploy = timeSinceLastDeploy >= deploymentCooldown;
    const remainingTime = canDeploy ? 0 : Math.ceil((deploymentCooldown - timeSinceLastDeploy) / 1000);

    // Get recent deployments from Supabase
    let recentDeployments = null;
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data } = await supabase
        .from('deployment_logs')
        .select('*')
        .eq('trigger_type', 'deploy')
        .order('created_at', { ascending: false })
        .limit(5);

      recentDeployments = data;
    } catch (dbError) {
      console.warn('[Deploy Status] Failed to fetch recent deployments:', dbError);
    }

    return NextResponse.json({
      success: true,
      data: {
        canDeploy,
        remainingSeconds: remainingTime,
        lastDeployment: lastDeploymentTime > 0 ? new Date(lastDeploymentTime).toISOString() : null,
        cooldownMinutes: deploymentCooldown / 60000,
        recentDeployments,
      },
    });

  } catch (error) {
    console.error('[Deploy Status] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get deployment status',
      },
      { status: 500 }
    );
  }
}
