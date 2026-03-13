#!/usr/bin/env node

/**
 * Dependency Update Checker & Email Notifier
 *
 * Checks for outdated packages across:
 * - Monorepo npm packages (Next.js, React, Tailwind, etc.)
 * - Global npm packages (wrangler, tsx, etc.)
 * - WordPress core, plugins, and themes
 *
 * Sends a summary email via Resend if any updates are available.
 * Runs weekly via cron (Mondays at 9 AM UTC).
 *
 * Log file: /var/log/dependency-updates.log
 */

const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');

const LOG_FILE = '/var/log/dependency-updates.log';
const PROJECT_ROOT = '/home/ubuntu/saabuildingblocks-platform';
const WORDPRESS_DIR = '/var/www/wordpress';

// Email config
const RESEND_API_KEY = 're_FLyQXVvX_P2fH3ckyXTdGKUKVNuSUgTZo';
const EMAIL_TO = 'doug@smartagentalliance.com';
const EMAIL_FROM = 'Smart Agent Alliance <team@smartagentalliance.com>';

// Critical packages to highlight
const CRITICAL_PACKAGES = [
  'next',
  'react',
  'react-dom',
  'typescript',
  'wrangler',
  'tailwindcss',
  '@tailwindcss/postcss',
  'framer-motion',
  'playwright',
  '@playwright/test',
  'eslint'
];

function log(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function getGlobalVersions() {
  const versions = {};
  try { versions.node = execSync('node --version', { encoding: 'utf-8' }).trim(); } catch { versions.node = 'unknown'; }
  try { versions.npm = execSync('npm --version', { encoding: 'utf-8' }).trim(); } catch { versions.npm = 'unknown'; }
  try { versions.wrangler = execSync('wrangler --version', { encoding: 'utf-8' }).trim().split(' ')[1] || 'unknown'; } catch { versions.wrangler = 'not installed'; }
  return versions;
}

function checkOutdated(workspace) {
  try {
    const cmd = workspace
      ? `npm outdated --json --workspace=${workspace}`
      : 'npm outdated --json';
    const result = execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    return JSON.parse(result || '{}');
  } catch (error) {
    if (error.stdout) {
      try { return JSON.parse(error.stdout); } catch { return {}; }
    }
    return {};
  }
}

function checkGlobalOutdated() {
  try {
    const result = execSync('npm outdated -g --json', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    return JSON.parse(result || '{}');
  } catch (error) {
    if (error.stdout) {
      try { return JSON.parse(error.stdout); } catch { return {}; }
    }
    return {};
  }
}

function checkWordPress() {
  const wp = { core: null, plugins: [], themes: [] };

  try {
    // Current version
    const currentVersion = execSync(
      `sudo -u www-data wp core version --path=${WORDPRESS_DIR}`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    wp.currentVersion = currentVersion;

    // Check for core update
    const coreCheck = execSync(
      `sudo -u www-data wp core check-update --format=json --path=${WORDPRESS_DIR}`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    const coreUpdates = JSON.parse(coreCheck || '[]');
    if (coreUpdates.length > 0) {
      wp.core = { current: currentVersion, latest: coreUpdates[0].version };
    }
  } catch {
    // No core update available or parse error
  }

  try {
    // Check plugin updates
    const pluginCheck = execSync(
      `sudo -u www-data wp plugin list --update=available --format=json --path=${WORDPRESS_DIR}`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    wp.plugins = JSON.parse(pluginCheck || '[]');
  } catch { /* no updates */ }

  try {
    // Check theme updates
    const themeCheck = execSync(
      `sudo -u www-data wp theme list --update=available --format=json --path=${WORDPRESS_DIR}`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    wp.themes = JSON.parse(themeCheck || '[]');
  } catch { /* no updates */ }

  return wp;
}

function sendEmail(subject, htmlBody) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      from: EMAIL_FROM,
      to: [EMAIL_TO],
      subject,
      html: htmlBody
    });

    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`Resend API error ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function buildEmailHtml(npmOutdated, globalOutdated, wp, globalVersions) {
  const totalNpm = npmOutdated.length;
  const totalWp = (wp.core ? 1 : 0) + wp.plugins.length + wp.themes.length;
  const total = totalNpm + globalOutdated.length + totalWp;

  const criticalNpm = npmOutdated.filter(p => p.critical);
  const otherNpm = npmOutdated.filter(p => !p.critical);

  let html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <h2 style="color: #1a1a1a; border-bottom: 2px solid #00ff88; padding-bottom: 8px;">
    SAA Weekly Update Report
  </h2>
  <p style="color: #666; font-size: 14px;">
    ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    - ${total} update${total !== 1 ? 's' : ''} available
  </p>
  <p style="color: #666; font-size: 13px;">
    Node ${globalVersions.node} - npm ${globalVersions.npm} - WordPress ${wp.currentVersion || 'unknown'}
  </p>`;

  // Critical npm packages
  if (criticalNpm.length > 0) {
    html += `
  <h3 style="color: #d32f2f; margin-top: 24px;">Critical Packages (${criticalNpm.length})</h3>
  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
    <tr style="background: #fce4ec;">
      <th style="text-align: left; padding: 6px 8px;">Package</th>
      <th style="text-align: left; padding: 6px 8px;">Current</th>
      <th style="text-align: left; padding: 6px 8px;">Latest</th>
      <th style="text-align: left; padding: 6px 8px;">Workspace</th>
    </tr>`;
    for (const pkg of criticalNpm) {
      const ws = pkg.workspace.replace('@saa/', '');
      html += `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 6px 8px; font-weight: bold;">${pkg.package}</td>
      <td style="padding: 6px 8px;">${pkg.current}</td>
      <td style="padding: 6px 8px; color: #d32f2f;">${pkg.latest}</td>
      <td style="padding: 6px 8px; color: #666;">${ws}</td>
    </tr>`;
    }
    html += '</table>';
  }

  // Other npm packages
  if (otherNpm.length > 0) {
    html += `
  <h3 style="color: #1a1a1a; margin-top: 24px;">Other npm Packages (${otherNpm.length})</h3>
  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
    <tr style="background: #f5f5f5;">
      <th style="text-align: left; padding: 6px 8px;">Package</th>
      <th style="text-align: left; padding: 6px 8px;">Current</th>
      <th style="text-align: left; padding: 6px 8px;">Latest</th>
      <th style="text-align: left; padding: 6px 8px;">Workspace</th>
    </tr>`;
    for (const pkg of otherNpm) {
      const ws = pkg.workspace.replace('@saa/', '');
      html += `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 6px 8px;">${pkg.package}</td>
      <td style="padding: 6px 8px;">${pkg.current}</td>
      <td style="padding: 6px 8px;">${pkg.latest}</td>
      <td style="padding: 6px 8px; color: #666;">${ws}</td>
    </tr>`;
    }
    html += '</table>';
  }

  // Global npm packages
  if (globalOutdated.length > 0) {
    html += `
  <h3 style="color: #1a1a1a; margin-top: 24px;">Global npm Packages (${globalOutdated.length})</h3>
  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
    <tr style="background: #f5f5f5;">
      <th style="text-align: left; padding: 6px 8px;">Package</th>
      <th style="text-align: left; padding: 6px 8px;">Current</th>
      <th style="text-align: left; padding: 6px 8px;">Latest</th>
    </tr>`;
    for (const pkg of globalOutdated) {
      html += `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 6px 8px;">${pkg.package}</td>
      <td style="padding: 6px 8px;">${pkg.current}</td>
      <td style="padding: 6px 8px;">${pkg.latest}</td>
    </tr>`;
    }
    html += '</table>';
  }

  // WordPress
  if (totalWp > 0) {
    html += `
  <h3 style="color: #1a1a1a; margin-top: 24px;">WordPress (${totalWp})</h3>
  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
    <tr style="background: #f5f5f5;">
      <th style="text-align: left; padding: 6px 8px;">Component</th>
      <th style="text-align: left; padding: 6px 8px;">Current</th>
      <th style="text-align: left; padding: 6px 8px;">Available</th>
    </tr>`;
    if (wp.core) {
      html += `
    <tr style="border-bottom: 1px solid #eee; background: #fff3e0;">
      <td style="padding: 6px 8px; font-weight: bold;">WordPress Core (PINNED - do not update)</td>
      <td style="padding: 6px 8px;">${wp.core.current}</td>
      <td style="padding: 6px 8px;">${wp.core.latest}</td>
    </tr>`;
    }
    for (const plugin of wp.plugins) {
      html += `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 6px 8px;">Plugin: ${plugin.name}</td>
      <td style="padding: 6px 8px;">${plugin.version}</td>
      <td style="padding: 6px 8px;">${plugin.update_version}</td>
    </tr>`;
    }
    for (const theme of wp.themes) {
      html += `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 6px 8px;">Theme: ${theme.name}</td>
      <td style="padding: 6px 8px;">${theme.version}</td>
      <td style="padding: 6px 8px;">${theme.update_version}</td>
    </tr>`;
    }
    html += '</table>';
  }

  // No updates
  if (total === 0) {
    html += '<p style="color: #4caf50; font-size: 16px; margin-top: 24px;">Everything is up to date.</p>';
  }

  html += `
  <hr style="margin-top: 32px; border: none; border-top: 1px solid #eee;">
  <p style="color: #999; font-size: 12px;">
    Auto-updates are disabled. Review this report and ask Claude to apply updates as needed.
    <br>Log: /var/log/dependency-updates.log
  </p>
</div>`;

  return html;
}

async function main() {
  log('[INFO] === Starting Dependency Update Check ===');

  const globalVersions = getGlobalVersions();
  log(`[INFO] Node.js: ${globalVersions.node}`);
  log(`[INFO] npm: ${globalVersions.npm}`);
  log(`[INFO] Wrangler: ${globalVersions.wrangler}`);

  // Check npm packages
  const workspaces = ['@saa/public-site', '@saa/admin-dashboard'];
  const npmOutdated = [];

  for (const workspace of workspaces) {
    log(`[INFO] Checking ${workspace}...`);
    const outdated = checkOutdated(workspace);
    for (const [pkg, info] of Object.entries(outdated)) {
      // Skip packages with missing version info (peer deps, resolution issues)
      if (!info.current || !info.latest || info.current === 'undefined' || info.latest === 'undefined') continue;
      // Skip if already on latest
      if (info.current === info.latest) continue;
      const isCritical = CRITICAL_PACKAGES.includes(pkg);
      const status = isCritical ? '[CRITICAL]' : '[INFO]';
      log(`${status} ${pkg}: ${info.current} -> ${info.latest} (wanted: ${info.wanted})`);
      npmOutdated.push({ package: pkg, current: info.current, wanted: info.wanted, latest: info.latest, workspace, critical: isCritical });
    }
  }

  // Check global packages
  log('[INFO] Checking global packages...');
  const globalOutdatedRaw = checkGlobalOutdated();
  const globalOutdated = [];
  for (const [pkg, info] of Object.entries(globalOutdatedRaw)) {
    if (!info.current || !info.latest || info.current === info.latest) continue;
    const isCritical = CRITICAL_PACKAGES.includes(pkg);
    const status = isCritical ? '[CRITICAL]' : '[INFO]';
    log(`${status} (global) ${pkg}: ${info.current} -> ${info.latest}`);
    globalOutdated.push({ package: pkg, current: info.current, latest: info.latest, critical: isCritical });
  }

  // Check WordPress
  log('[INFO] Checking WordPress...');
  const wp = checkWordPress();
  if (wp.core) log(`[INFO] WordPress core: ${wp.core.current} -> ${wp.core.latest} (PINNED)`);
  for (const p of wp.plugins) log(`[INFO] Plugin ${p.name}: ${p.version} -> ${p.update_version}`);
  for (const t of wp.themes) log(`[INFO] Theme ${t.name}: ${t.version} -> ${t.update_version}`);

  // Summary
  const totalNpm = npmOutdated.length;
  const criticalCount = npmOutdated.filter(p => p.critical).length;
  const totalWp = (wp.core ? 1 : 0) + wp.plugins.length + wp.themes.length;
  const total = totalNpm + globalOutdated.length + totalWp;

  log('[INFO] ----------------------------------------');
  log(`[INFO] Total updates available: ${total}`);
  log(`[INFO]   npm packages: ${totalNpm} (${criticalCount} critical)`);
  log(`[INFO]   Global packages: ${globalOutdated.length}`);
  log(`[INFO]   WordPress: ${totalWp}`);

  // Write summary JSON
  const summaryPath = '/var/log/dependency-updates-summary.json';
  const summary = {
    timestamp: new Date().toISOString(),
    totalOutdated: total,
    criticalOutdated: criticalCount,
    globalVersions,
    npmPackages: npmOutdated,
    globalPackages: globalOutdated,
    wordpress: wp
  };
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  log(`[INFO] Summary written to ${summaryPath}`);

  // Send email
  try {
    const subject = total > 0
      ? `SAA Update Report: ${total} update${total !== 1 ? 's' : ''} available${criticalCount > 0 ? ` (${criticalCount} critical)` : ''}`
      : 'SAA Update Report: Everything is up to date';

    const html = buildEmailHtml(npmOutdated, globalOutdated, wp, globalVersions);
    await sendEmail(subject, html);
    log('[INFO] Email sent to ' + EMAIL_TO);
  } catch (error) {
    log(`[ERROR] Failed to send email: ${error.message}`);
  }

  log('[INFO] === Dependency Update Check Complete ===');
  return { total, criticalCount };
}

main().catch(error => {
  log(`[ERROR] Fatal error: ${error.message}`);
  process.exit(1);
});
