import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';

const execAsync = promisify(exec);

interface Automation {
  id: string;
  name: string;
  description: string;
  category: string;
  schedule: string;
  status: 'active' | 'broken';
  lastRun?: string;
  nextRun?: string;
  logFile?: string;
  statusDetail?: string;
}

// ─── Helper: run shell command safely ────────────────────────────────────────

async function run(cmd: string): Promise<string> {
  try {
    const { stdout } = await execAsync(cmd, { timeout: 10000 });
    return stdout.trim();
  } catch {
    return '';
  }
}

// ─── Helper: check if cron job exists ────────────────────────────────────────

async function cronJobExists(pattern: string): Promise<boolean> {
  const crontab = await run('crontab -l');
  return crontab.includes(pattern);
}

// ─── Helper: get last modified time of a file ────────────────────────────────

async function fileModifiedTime(path: string): Promise<Date | null> {
  try {
    const stats = await fs.stat(path);
    return stats.mtime;
  } catch {
    return null;
  }
}

// ─── Helper: parse a log file for last run info ──────────────────────────────

async function getLogTail(logPath: string, lines = 50): Promise<string> {
  try {
    const content = await fs.readFile(logPath, 'utf-8');
    const allLines = content.trim().split('\n');
    return allLines.slice(-lines).join('\n');
  } catch {
    return '';
  }
}

// ─── Helper: calculate next cron run ─────────────────────────────────────────

function nextDailyRun(hour: number, minute = 0): string {
  const now = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.toISOString();
}

function nextWeeklyRun(dayOfWeek: number, hour: number): string {
  const now = new Date();
  const next = new Date();
  next.setHours(hour, 0, 0, 0);
  const daysUntil = (dayOfWeek - now.getDay() + 7) % 7 || 7;
  next.setDate(now.getDate() + daysUntil);
  if (now.getDay() === dayOfWeek && now.getHours() < hour) {
    next.setDate(now.getDate());
  }
  return next.toISOString();
}

// ─── Check: Auto-Update System ───────────────────────────────────────────────

async function checkAutoUpdate(): Promise<Automation> {
  const cronExists = await cronJobExists('auto-update.sh');
  const today = new Date().toISOString().split('T')[0];
  const logPath = `/var/log/auto-updates/update-${today}.log`;
  const cronLogPath = '/var/log/auto-updates/cron.log';

  let status: 'active' | 'broken' = 'broken';
  let lastRun: string | undefined;
  let statusDetail: string | undefined;

  // Check today's log file
  const todayMod = await fileModifiedTime(logPath);
  if (todayMod) {
    lastRun = todayMod.toISOString();
    const tail = await getLogTail(logPath, 20);
    if (tail.includes('Auto-Update Process Complete')) {
      status = 'active';
    } else {
      status = 'active'; // Still running or completed
      statusDetail = 'Running or partially completed today';
    }
  } else {
    // Check yesterday's log
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayPath = `/var/log/auto-updates/update-${yesterday.toISOString().split('T')[0]}.log`;
    const yesterdayMod = await fileModifiedTime(yesterdayPath);
    if (yesterdayMod) {
      lastRun = yesterdayMod.toISOString();
      status = 'active';
    }
  }

  if (!cronExists) {
    status = 'broken';
    statusDetail = 'Cron job not found';
  }

  return {
    id: 'auto-update-system',
    name: 'Auto-Update System',
    description: 'Updates system packages, npm, WordPress, and global tools daily',
    category: 'Cron Jobs',
    schedule: 'Daily at 4:00 AM',
    status,
    lastRun,
    nextRun: cronExists ? nextDailyRun(4) : undefined,
    logFile: 'auto-updates/cron.log',
    statusDetail,
  };
}

// ─── Check: Dependency Update Check ──────────────────────────────────────────

async function checkDependencyUpdates(): Promise<Automation> {
  const logPath = '/var/log/dependency-updates.log';
  const cronExists = await cronJobExists('check-dependency-updates.js');
  const tail = await getLogTail(logPath, 50);

  let status: 'active' | 'broken' = 'broken';
  let lastRun: string | undefined;
  let statusDetail: string | undefined;

  const completeLines = tail.split('\n').filter(l => l.includes('Dependency Update Check Complete'));
  if (completeLines.length > 0) {
    const match = completeLines[completeLines.length - 1].match(/\[(.*?)\]/);
    if (match) lastRun = match[1];

    // Check for critical counts
    const criticalMatch = tail.match(/(\d+) CRITICAL package/);
    const outdatedMatch = tail.match(/Found (\d+) outdated/);
    if (criticalMatch) {
      statusDetail = `${criticalMatch[1]} critical, ${outdatedMatch?.[1] || '?'} total outdated`;
    }
    status = 'active';
  }

  if (!cronExists) {
    status = 'broken';
    statusDetail = 'Cron job not found';
  }

  return {
    id: 'dependency-update-check',
    name: 'Dependency Update Check',
    description: `Checks for outdated packages across the monorepo${statusDetail ? ` — ${statusDetail}` : ''}`,
    category: 'Cron Jobs',
    schedule: 'Weekly on Monday at 8:00 AM',
    status,
    lastRun,
    nextRun: cronExists ? nextWeeklyRun(1, 8) : undefined,
    logFile: 'dependency-updates.log',
    statusDetail,
  };
}

// ─── Check: Systemd Timers ───────────────────────────────────────────────────

async function checkSystemdTimer(
  unitName: string,
  id: string,
  name: string,
  description: string,
  schedule: string
): Promise<Automation> {
  const isActive = await run(`systemctl is-active ${unitName}.timer`);
  const timerShow = await run(`systemctl show ${unitName}.timer --property=LastTriggerUSec,NextElapseUSecRealtime --no-pager`);

  let lastRun: string | undefined;
  let nextRun: string | undefined;

  const lastMatch = timerShow.match(/LastTriggerUSec=(.*)/);
  if (lastMatch && lastMatch[1] !== 'n/a') {
    try {
      const d = new Date(lastMatch[1]);
      if (!isNaN(d.getTime())) lastRun = d.toISOString();
    } catch { /* ignore */ }
  }

  const nextMatch = timerShow.match(/NextElapseUSecRealtime=(.*)/);
  if (nextMatch && nextMatch[1] !== 'n/a') {
    try {
      const d = new Date(nextMatch[1]);
      if (!isNaN(d.getTime())) nextRun = d.toISOString();
    } catch { /* ignore */ }
  }

  return {
    id,
    name,
    description,
    category: 'Systemd Timers',
    schedule,
    status: isActive === 'active' ? 'active' : 'broken',
    lastRun,
    nextRun,
    statusDetail: isActive !== 'active' ? `Timer is ${isActive || 'not found'}` : undefined,
  };
}

// ─── Check: GitHub Actions Workflows ─────────────────────────────────────────

async function checkGitHubWorkflows(): Promise<Automation[]> {
  const automations: Automation[] = [];

  const workflows = [
    {
      id: 'gh-deploy-cloudflare',
      name: 'Deploy to Cloudflare Pages',
      workflowFile: 'deploy-cloudflare.yml',
      description: 'Builds static site and deploys to Cloudflare Pages CDN, purges cache, pings Google',
      schedule: 'On push to main + manual + WordPress webhook',
    },
    {
      id: 'gh-ci-pipeline',
      name: 'CI Pipeline',
      workflowFile: 'ci.yml',
      description: 'TypeScript type-checking across public-site and admin-dashboard',
      schedule: 'On push to main/develop + PRs',
    },
    {
      id: 'gh-codeql-security',
      name: 'CodeQL Security Scan',
      workflowFile: 'codeql.yml',
      description: 'Static analysis security testing (SAST) for JavaScript/TypeScript',
      schedule: 'Weekly Monday 8 AM UTC + push + PRs',
    },
    {
      id: 'gh-dependabot-automerge',
      name: 'Dependabot Auto-Merge',
      workflowFile: 'dependabot-auto-merge.yml',
      description: 'Auto-approves and merges minor/patch dependency updates',
      schedule: 'On Dependabot PRs',
    },
  ];

  // Query each workflow individually to avoid one workflow's volume hiding others
  const results = await Promise.all(
    workflows.map(wf =>
      run(
        `cd /home/ubuntu/saabuildingblocks-platform && gh run list --workflow=${wf.workflowFile} --limit 1 --json status,conclusion,updatedAt 2>/dev/null`
      )
    )
  );

  for (let i = 0; i < workflows.length; i++) {
    const wf = workflows[i];
    let latestRun: { status: string; conclusion: string; updatedAt: string } | undefined;

    try {
      const parsed = JSON.parse(results[i] || '[]');
      if (parsed.length > 0) latestRun = parsed[0];
    } catch { /* ignore */ }

    let status: 'active' | 'broken' = 'active';
    let statusDetail: string | undefined;

    if (latestRun) {
      if (latestRun.conclusion === 'failure') {
        status = 'broken';
        statusDetail = 'Last run failed';
      } else if (latestRun.status === 'in_progress') {
        statusDetail = 'Currently running';
      }
    } else {
      // No runs found — could be fine for dependabot
      if (wf.id !== 'gh-dependabot-automerge') {
        status = 'broken';
        statusDetail = 'No recent runs found';
      }
    }

    automations.push({
      id: wf.id,
      name: wf.name,
      description: wf.description,
      category: 'GitHub Actions',
      schedule: wf.schedule,
      status,
      lastRun: latestRun?.updatedAt,
      statusDetail,
    });
  }

  return automations;
}

// ─── Check: Infrastructure Services ──────────────────────────────────────────

async function checkPM2(): Promise<Automation> {
  const jlist = await run('pm2 jlist');
  let status: 'active' | 'broken' = 'broken';
  let statusDetail: string | undefined;
  let lastRun: string | undefined;

  try {
    const processes = JSON.parse(jlist || '[]');
    const saa = processes.find((p: { name: string }) => p.name === 'nextjs-saa');
    if (saa) {
      if (saa.pm2_env?.status === 'online') {
        status = 'active';
        const uptime = saa.pm2_env?.pm_uptime;
        if (uptime) lastRun = new Date(uptime).toISOString();
        const restarts = saa.pm2_env?.restart_time || 0;
        if (restarts > 100) {
          statusDetail = `${restarts} restarts (high)`;
        }
      } else {
        statusDetail = `Process status: ${saa.pm2_env?.status}`;
      }
    } else {
      statusDetail = 'Process not found in PM2';
    }
  } catch {
    statusDetail = 'Could not parse PM2 output';
  }

  return {
    id: 'pm2-admin-dashboard',
    name: 'Admin Dashboard (PM2)',
    description: 'Next.js admin dashboard serving API routes, Master Controller, Agent Portal',
    category: 'Infrastructure',
    schedule: 'Always running (port 3002)',
    status,
    lastRun,
    statusDetail,
  };
}

async function checkCloudflared(): Promise<Automation> {
  const isActive = await run('systemctl is-active cloudflared');
  const statusOutput = await run('systemctl show cloudflared --property=ActiveEnterTimestamp --no-pager');

  let lastRun: string | undefined;
  const match = statusOutput.match(/ActiveEnterTimestamp=(.*)/);
  if (match) {
    try {
      const d = new Date(match[1]);
      if (!isNaN(d.getTime())) lastRun = d.toISOString();
    } catch { /* ignore */ }
  }

  return {
    id: 'cloudflare-tunnel',
    name: 'Cloudflare Tunnel',
    description: 'Routes all web traffic to VPS through encrypted tunnel (saa-vps)',
    category: 'Infrastructure',
    schedule: 'Always running (systemd)',
    status: isActive === 'active' ? 'active' : 'broken',
    lastRun,
    statusDetail: isActive !== 'active' ? `Service is ${isActive || 'not found'}` : undefined,
  };
}

async function checkPlausible(): Promise<Automation> {
  const dockerPs = await run('sudo docker compose -f /opt/plausible/compose.yml -f /opt/plausible/compose.override.yml ps --format json 2>/dev/null');

  let status: 'active' | 'broken' = 'broken';
  let statusDetail: string | undefined;
  let lastRun: string | undefined;

  try {
    // docker compose ps --format json returns one JSON object per line
    const lines = dockerPs.split('\n').filter(l => l.trim());
    const containers = lines.map(l => JSON.parse(l));
    const plausibleApp = containers.find((c: { Service: string }) => c.Service === 'plausible');

    if (plausibleApp) {
      const isRunning = plausibleApp.State === 'running';
      status = isRunning ? 'active' : 'broken';
      if (!isRunning) statusDetail = `Container state: ${plausibleApp.State}`;
    }

    const allRunning = containers.every((c: { State: string }) => c.State === 'running');
    const runningCount = containers.filter((c: { State: string }) => c.State === 'running').length;
    if (!allRunning) {
      statusDetail = `${runningCount}/${containers.length} containers running`;
    }
  } catch {
    // Fallback: simple curl check
    const curl = await run('curl -so /dev/null -w "%{http_code}" http://127.0.0.1:8000 2>/dev/null');
    status = curl === '200' ? 'active' : 'broken';
    if (status === 'broken') statusDetail = 'Cannot reach Plausible on port 8000';
  }

  return {
    id: 'plausible-analytics',
    name: 'Plausible Analytics',
    description: 'Self-hosted website analytics (Plausible CE v3.2.0 + PostgreSQL + ClickHouse)',
    category: 'Infrastructure',
    schedule: 'Always running (Docker)',
    status,
    lastRun,
    statusDetail,
  };
}

// ─── Check: Webhook Handlers ─────────────────────────────────────────────────

async function checkWebhookEndpoint(
  id: string,
  name: string,
  description: string,
  path: string
): Promise<Automation> {
  // Check if the endpoint is reachable via the admin dashboard
  const curl = await run(`curl -so /dev/null -w "%{http_code}" http://127.0.0.1:3002${path} 2>/dev/null`);
  const reachable = curl === '200' || curl === '405' || curl === '401' || curl === '400';

  return {
    id,
    name,
    description,
    category: 'Webhooks',
    schedule: 'On incoming webhook',
    status: reachable ? 'active' : 'broken',
    statusDetail: !reachable ? `Endpoint returned ${curl || 'no response'}` : undefined,
  };
}

// ─── Check: Cloudflare Functions ─────────────────────────────────────────────

async function checkCloudflareFunctions(): Promise<Automation[]> {
  // We can't directly check Cloudflare Functions from the VPS,
  // but we can verify the deployment exists by checking last deploy
  const lastDeploy = await run(
    'cd /home/ubuntu/saabuildingblocks-platform && gh run list --workflow=deploy-cloudflare.yml --limit 1 --json conclusion,updatedAt 2>/dev/null'
  );

  let deployStatus: 'active' | 'broken' = 'active';
  let lastDeployTime: string | undefined;

  try {
    const runs = JSON.parse(lastDeploy || '[]');
    if (runs[0]) {
      deployStatus = runs[0].conclusion === 'success' ? 'active' : 'broken';
      lastDeployTime = runs[0].updatedAt;
    }
  } catch { /* ignore */ }

  return [
    {
      id: 'cf-func-slug',
      name: 'Agent Attraction Pages',
      description: 'Dynamic agent pages via [slug].js Cloudflare Function (325KB+ inlined)',
      category: 'Cloudflare Functions',
      schedule: 'Serverless (on request)',
      status: deployStatus,
      lastRun: lastDeployTime,
      statusDetail: deployStatus === 'broken' ? 'Last Cloudflare deployment failed' : undefined,
    },
    {
      id: 'cf-func-booking-slots',
      name: 'Booking Slots API',
      description: 'Proxies GHL calendar free-slots endpoint for booking widget',
      category: 'Cloudflare Functions',
      schedule: 'Serverless (on request)',
      status: deployStatus,
      lastRun: lastDeployTime,
    },
    {
      id: 'cf-func-booking-submit',
      name: 'Booking Submit API',
      description: 'Creates GHL contacts and appointments from booking widget',
      category: 'Cloudflare Functions',
      schedule: 'Serverless (on request)',
      status: deployStatus,
      lastRun: lastDeployTime,
    },
    {
      id: 'cf-func-middleware',
      name: '404 Tracking Middleware',
      description: 'Logs 404 paths to Supabase for triage via _middleware.js',
      category: 'Cloudflare Functions',
      schedule: 'Serverless (on every request)',
      status: deployStatus,
      lastRun: lastDeployTime,
    },
  ];
}

// ─── Check: Analytics Pipelines ──────────────────────────────────────────────

async function checkAnalyticsPipelines(): Promise<Automation[]> {
  // Check if video events endpoint is reachable
  const videoCurl = await run('curl -so /dev/null -w "%{http_code}" http://127.0.0.1:3002/api/video/events 2>/dev/null');
  const trackingCurl = await run('curl -so /dev/null -w "%{http_code}" http://127.0.0.1:3002/api/tracking/events 2>/dev/null');
  const plausibleCurl = await run('curl -so /dev/null -w "%{http_code}" http://127.0.0.1:8000/js/script.file-downloads.pageview-props.tagged-events.js 2>/dev/null');

  return [
    {
      id: 'analytics-video-beacons',
      name: 'Video Analytics Beacons',
      description: 'Tracks play/heartbeat/ended events from video players → Supabase',
      category: 'Analytics',
      schedule: 'On video interaction (sendBeacon)',
      status: (videoCurl === '200' || videoCurl === '405') ? 'active' : 'broken',
      statusDetail: videoCurl !== '200' && videoCurl !== '405' ? `Endpoint returned ${videoCurl}` : undefined,
    },
    {
      id: 'analytics-page-tracking',
      name: 'Page View Tracking',
      description: 'Tracks page views and clicks on agent attraction pages → Supabase',
      category: 'Analytics',
      schedule: 'On page visit (sendBeacon)',
      status: (trackingCurl === '200' || trackingCurl === '405') ? 'active' : 'broken',
      statusDetail: trackingCurl !== '200' && trackingCurl !== '405' ? `Endpoint returned ${trackingCurl}` : undefined,
    },
    {
      id: 'analytics-plausible-script',
      name: 'Plausible Tracking Script',
      description: 'Website analytics tracking via plausible.saabuildingblocks.com',
      category: 'Analytics',
      schedule: 'On every page load',
      status: plausibleCurl === '200' ? 'active' : 'broken',
      statusDetail: plausibleCurl !== '200' ? `Script returned ${plausibleCurl}` : undefined,
    },
  ];
}

// ─── Check: Email System ─────────────────────────────────────────────────────

async function checkEmailSystem(): Promise<Automation[]> {
  // Check if Resend API key is configured
  const hasResendKey = !!process.env.RESEND_API_KEY;

  // Check if email automation script exists
  const scriptExists = await fileModifiedTime(
    '/home/ubuntu/saabuildingblocks-platform/packages/admin-dashboard/scripts/email-automation.ts'
  );

  return [
    {
      id: 'email-transactional',
      name: 'Transactional Emails (Resend)',
      description: 'Welcome, activation, password reset, booking confirmation emails',
      category: 'Email',
      schedule: 'On-demand (triggered by user actions)',
      status: hasResendKey ? 'active' : 'broken',
      statusDetail: !hasResendKey ? 'RESEND_API_KEY not configured' : undefined,
    },
    {
      id: 'email-holiday-campaigns',
      name: 'Holiday Email Campaigns',
      description: 'Scheduled holiday-themed emails to downline with timezone-aware delivery',
      category: 'Email',
      schedule: 'Holiday schedule (Supabase config)',
      status: scriptExists ? 'active' : 'broken',
      statusDetail: !scriptExists ? 'Automation script not found' : 'Configured but requires cron/manual trigger',
    },
  ];
}

// ─── Check: Build Pipelines ──────────────────────────────────────────────────

async function checkBuildPipelines(): Promise<Automation[]> {
  const cssExists = await fileModifiedTime(
    '/home/ubuntu/saabuildingblocks-platform/packages/public-site/public/static-master-controller.css'
  );
  const blogJsonExists = await fileModifiedTime(
    '/home/ubuntu/saabuildingblocks-platform/packages/public-site/public/blog-posts-index.json'
  );

  return [
    {
      id: 'build-css-generation',
      name: 'Master Controller CSS',
      description: 'Generates static CSS from Supabase typography/color settings for Cloudflare edge',
      category: 'Build Pipelines',
      schedule: 'On deploy (prebuild hook)',
      status: cssExists ? 'active' : 'broken',
      lastRun: cssExists?.toISOString(),
      statusDetail: !cssExists ? 'CSS file not found' : undefined,
    },
    {
      id: 'build-blog-sync',
      name: 'WordPress Blog Sync',
      description: 'Fetches blog posts from WordPress REST API and generates static JSON',
      category: 'Build Pipelines',
      schedule: 'On deploy + WordPress publish webhook',
      status: blogJsonExists ? 'active' : 'broken',
      lastRun: blogJsonExists?.toISOString(),
      statusDetail: !blogJsonExists ? 'Blog JSON file not found' : undefined,
    },
  ];
}

// ─── Main API Handler ────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    // Run all checks in parallel for speed
    const [
      autoUpdate,
      depCheck,
      cloudflaredTimer,
      playwrightTimer,
      githubWorkflows,
      pm2,
      cloudflared,
      plausible,
      ghlWebhook,
      ghlDownline,
      bookingWebhook,
      wordpressWebhook,
      cloudflareFunctions,
      analytics,
      email,
      buildPipelines,
    ] = await Promise.all([
      checkAutoUpdate(),
      checkDependencyUpdates(),
      checkSystemdTimer(
        'cloudflared-update',
        'timer-cloudflared-update',
        'Cloudflare Tunnel Auto-Update',
        'Keeps cloudflared binary up to date',
        'Daily'
      ),
      checkSystemdTimer(
        'playwright-chrome-cleanup',
        'timer-playwright-cleanup',
        'Playwright Chrome Cleanup',
        'Kills orphaned Chrome processes from Playwright MCP every 30 minutes',
        'Every 30 minutes'
      ),
      checkGitHubWorkflows(),
      checkPM2(),
      checkCloudflared(),
      checkPlausible(),
      checkWebhookEndpoint(
        'webhook-ghl-general',
        'GHL General Webhook',
        'Receives ContactCreate, ContactUpdate, ContactTagUpdate events from GoHighLevel',
        '/api/webhooks/gohighlevel'
      ),
      checkWebhookEndpoint(
        'webhook-ghl-downline',
        'GHL Active Downline',
        'Creates user account + sends welcome email when "active downline" tag is added in GHL',
        '/api/webhooks/ghl-active-downline'
      ),
      checkWebhookEndpoint(
        'webhook-booking-updates',
        'GHL Booking Updates',
        'Processes booking status changes (booked, rescheduled, cancelled, no-show)',
        '/api/bookings/ghl-webhook'
      ),
      checkWebhookEndpoint(
        'webhook-wordpress',
        'WordPress → Deploy',
        'Triggers GitHub Actions Cloudflare deployment when blog post is published/updated',
        '/api/webhooks/wordpress'
      ),
      checkCloudflareFunctions(),
      checkAnalyticsPipelines(),
      checkEmailSystem(),
      checkBuildPipelines(),
    ]);

    const automations: Automation[] = [
      // Cron Jobs
      autoUpdate,
      depCheck,
      // Systemd Timers
      cloudflaredTimer,
      playwrightTimer,
      // GitHub Actions
      ...githubWorkflows,
      // Infrastructure
      pm2,
      cloudflared,
      plausible,
      // Webhooks
      ghlWebhook,
      ghlDownline,
      bookingWebhook,
      wordpressWebhook,
      // Cloudflare Functions
      ...cloudflareFunctions,
      // Analytics
      ...analytics,
      // Email
      ...email,
      // Build Pipelines
      ...buildPipelines,
    ];

    const activeCount = automations.filter(a => a.status === 'active').length;
    const brokenCount = automations.filter(a => a.status === 'broken').length;

    return NextResponse.json({
      automations,
      summary: {
        total: automations.length,
        active: activeCount,
        broken: brokenCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching automation status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch automation status' },
      { status: 500 }
    );
  }
}
