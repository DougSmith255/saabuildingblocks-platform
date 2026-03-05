/**
 * Automation Health Check Cron Endpoint
 * POST /api/automations/health-check
 *
 * Called every 15 minutes by crontab. Compares current automation statuses
 * against stored state in `automation_health_state`. Only sends alert emails
 * when automations transition between active and broken states.
 *
 * Auth: AUTOMATION_SECRET header (same pattern as notification cron)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import React from 'react';
import { sendEmail } from '@/lib/email/client';
import { AutomationAlertEmail } from '@/lib/email/templates/AutomationAlertEmail';

export const dynamic = 'force-dynamic';

const execAsync = promisify(exec);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Automation {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'broken';
  statusDetail?: string;
}

interface HealthState {
  automation_id: string;
  status: string;
  last_checked_at: string;
  broke_at: string | null;
  alert_sent_at: string | null;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

function verifyAuth(request: NextRequest): boolean {
  const secret = request.headers.get('x-automation-secret');
  return !!(secret && secret === process.env.AUTOMATION_SECRET);
}

// ─── Supabase ─────────────────────────────────────────────────────────────────

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

// ─── Lightweight status checks (subset of the full status route) ──────────────
// We check only key automations to keep this fast (< 10 seconds)

async function run(cmd: string): Promise<string> {
  try {
    const { stdout } = await execAsync(cmd, { timeout: 10000 });
    return stdout.trim();
  } catch {
    return '';
  }
}

async function cronJobExists(pattern: string): Promise<boolean> {
  const crontab = await run('crontab -l');
  return crontab.includes(pattern);
}

async function checkPM2(): Promise<Automation> {
  const jlist = await run('pm2 jlist');
  try {
    const processes = JSON.parse(jlist || '[]');
    const saa = processes.find((p: { name: string }) => p.name === 'nextjs-saa');
    if (saa?.pm2_env?.status === 'online') {
      return { id: 'pm2-admin-dashboard', name: 'Admin Dashboard (PM2)', description: 'Next.js admin dashboard', category: 'Infrastructure', status: 'active' };
    }
  } catch { /* ignore */ }
  return { id: 'pm2-admin-dashboard', name: 'Admin Dashboard (PM2)', description: 'Next.js admin dashboard', category: 'Infrastructure', status: 'broken', statusDetail: 'PM2 process not online' };
}

async function checkCloudflared(): Promise<Automation> {
  const isActive = await run('systemctl is-active cloudflared');
  return {
    id: 'cloudflare-tunnel', name: 'Cloudflare Tunnel', description: 'Routes web traffic to VPS', category: 'Infrastructure',
    status: isActive === 'active' ? 'active' : 'broken',
    statusDetail: isActive !== 'active' ? `Service is ${isActive || 'not found'}` : undefined,
  };
}

async function checkPlausible(): Promise<Automation> {
  const curl = await run('curl -so /dev/null -w "%{http_code}" http://127.0.0.1:8000 2>/dev/null');
  return {
    id: 'plausible-analytics', name: 'Plausible Analytics', description: 'Self-hosted analytics', category: 'Infrastructure',
    status: curl === '200' ? 'active' : 'broken',
    statusDetail: curl !== '200' ? `HTTP ${curl || 'no response'}` : undefined,
  };
}

async function checkEndpoint(id: string, name: string, description: string, path: string): Promise<Automation> {
  const curl = await run(`curl -so /dev/null -w "%{http_code}" http://127.0.0.1:3002${path} 2>/dev/null`);
  const reachable = ['200', '401', '405', '400'].includes(curl);
  return { id, name, description, category: 'Endpoints', status: reachable ? 'active' : 'broken', statusDetail: !reachable ? `HTTP ${curl}` : undefined };
}

async function checkCronJob(pattern: string, id: string, name: string, description: string): Promise<Automation> {
  const exists = await cronJobExists(pattern);
  return { id, name, description, category: 'Cron Jobs', status: exists ? 'active' : 'broken', statusDetail: !exists ? 'Cron job not found' : undefined };
}

async function checkSystemdTimer(unitName: string, id: string, name: string, description: string): Promise<Automation> {
  const isActive = await run(`systemctl is-active ${unitName}.timer`);
  return { id, name, description, category: 'Systemd Timers', status: isActive === 'active' ? 'active' : 'broken', statusDetail: isActive !== 'active' ? `Timer is ${isActive || 'not found'}` : undefined };
}

async function checkGitHubWorkflow(workflowFile: string, id: string, name: string, description: string): Promise<Automation> {
  const result = await run(`cd /home/ubuntu/saabuildingblocks-platform && gh run list --workflow=${workflowFile} --limit 1 --json conclusion 2>/dev/null`);
  try {
    const runs = JSON.parse(result || '[]');
    if (runs[0]?.conclusion === 'failure') {
      return { id, name, description, category: 'GitHub Actions', status: 'broken', statusDetail: 'Last run failed' };
    }
    return { id, name, description, category: 'GitHub Actions', status: 'active' };
  } catch {
    return { id, name, description, category: 'GitHub Actions', status: 'active' };
  }
}

// ─── Main check ───────────────────────────────────────────────────────────────

async function getAllStatuses(): Promise<Automation[]> {
  const results = await Promise.all([
    checkPM2(),
    checkCloudflared(),
    checkPlausible(),
    checkEndpoint('webhook-ghl-general', 'GHL Webhook', 'GoHighLevel webhook handler', '/api/webhooks/gohighlevel'),
    checkEndpoint('webhook-ghl-downline', 'GHL Active Downline', 'Active downline webhook', '/api/webhooks/ghl-active-downline'),
    checkEndpoint('webhook-booking-updates', 'Booking Webhook', 'Booking status changes', '/api/bookings/ghl-webhook'),
    checkEndpoint('analytics-video-beacons', 'Video Analytics', 'Video analytics endpoint', '/api/video/events'),
    checkCronJob('auto-update.sh', 'auto-update-system', 'Auto-Update System', 'Daily system updates'),
    checkCronJob('notifications/cron', 'notification-cron', 'Notification Cron', 'Account activation reminders'),
    checkSystemdTimer('cloudflared-update', 'timer-cloudflared-update', 'Cloudflared Auto-Update', 'Keeps cloudflared up to date'),
    checkSystemdTimer('playwright-chrome-cleanup', 'timer-playwright-cleanup', 'Playwright Cleanup', 'Kills orphaned Chrome processes'),
    checkGitHubWorkflow('deploy-cloudflare.yml', 'gh-deploy-cloudflare', 'Deploy to Cloudflare', 'Static site deployment'),
    checkGitHubWorkflow('ci.yml', 'gh-ci-pipeline', 'CI Pipeline', 'TypeScript type-checking'),
  ]);
  return results;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  const now = new Date().toISOString();

  // 1. Get current statuses
  const currentStatuses = await getAllStatuses();

  // 2. Load stored states
  const { data: storedStates } = await supabase
    .from('automation_health_state')
    .select('*');

  const stateMap = new Map<string, HealthState>();
  (storedStates || []).forEach(s => stateMap.set(s.automation_id, s));

  // 3. Compare: find newly broken and newly recovered
  const newlyBroken: Automation[] = [];
  const newlyRecovered: Automation[] = [];

  for (const auto of currentStatuses) {
    const stored = stateMap.get(auto.id);
    const previousStatus = stored?.status || 'active';

    if (auto.status === 'broken' && previousStatus === 'active') {
      newlyBroken.push(auto);
    } else if (auto.status === 'active' && previousStatus === 'broken') {
      newlyRecovered.push(auto);
    }
  }

  // 4. Upsert all states
  for (const auto of currentStatuses) {
    const existing = stateMap.get(auto.id);

    if (existing) {
      const updates: Record<string, unknown> = {
        status: auto.status,
        last_checked_at: now,
      };
      if (auto.status === 'broken' && existing.status === 'active') {
        updates.broke_at = now;
      }
      if (auto.status === 'active') {
        updates.broke_at = null;
        updates.alert_sent_at = null;
      }

      await supabase
        .from('automation_health_state')
        .update(updates)
        .eq('automation_id', auto.id);
    } else {
      await supabase
        .from('automation_health_state')
        .insert({
          automation_id: auto.id,
          status: auto.status,
          last_checked_at: now,
          broke_at: auto.status === 'broken' ? now : null,
        });
    }
  }

  // 5. Send alert email if there are state changes
  let emailSent = false;
  if (newlyBroken.length > 0 || newlyRecovered.length > 0) {
    const activeCount = currentStatuses.filter(a => a.status === 'active').length;
    const brokenCount = currentStatuses.filter(a => a.status === 'broken').length;
    const allRecovered = newlyBroken.length === 0 && newlyRecovered.length > 0;

    const subject = allRecovered
      ? `[SAA] All automations recovered`
      : `[SAA Alert] ${newlyBroken.length} automation(s) broken`;

    try {
      await sendEmail({
        to: 'doug@smartagentalliance.com',
        subject,
        react: React.createElement(AutomationAlertEmail, {
          newlyBroken: newlyBroken.map(a => ({
            id: a.id,
            name: a.name,
            category: a.category,
            description: a.description,
            statusDetail: a.statusDetail,
          })),
          newlyRecovered: newlyRecovered.map(a => ({
            id: a.id,
            name: a.name,
            category: a.category,
            description: a.description,
          })),
          totalActive: activeCount,
          totalBroken: brokenCount,
          totalAutomations: currentStatuses.length,
          timestamp: now,
        }),
        tags: [{ name: 'category', value: 'automation_alert' }],
      });
      emailSent = true;

      // Update alert_sent_at for newly broken
      for (const auto of newlyBroken) {
        await supabase
          .from('automation_health_state')
          .update({ alert_sent_at: now })
          .eq('automation_id', auto.id);
      }
    } catch (err) {
      console.error('[health-check] Failed to send alert email:', err);
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: now,
    checked: currentStatuses.length,
    active: currentStatuses.filter(a => a.status === 'active').length,
    broken: currentStatuses.filter(a => a.status === 'broken').length,
    newly_broken: newlyBroken.map(a => a.id),
    newly_recovered: newlyRecovered.map(a => a.id),
    email_sent: emailSent,
  });
}
