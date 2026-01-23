#!/usr/bin/env node

/**
 * Server/Tools Dependency Update Checker
 *
 * Checks for outdated packages in the monorepo and logs results.
 * Run via cron or on-demand from master controller.
 *
 * Log file: /var/log/dependency-updates.log
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_FILE = '/var/log/dependency-updates.log';
const PROJECT_ROOT = '/home/ubuntu/saabuildingblocks-platform';

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

  try {
    versions.node = execSync('node --version', { encoding: 'utf-8' }).trim();
  } catch {
    versions.node = 'unknown';
  }

  try {
    versions.npm = execSync('npm --version', { encoding: 'utf-8' }).trim();
  } catch {
    versions.npm = 'unknown';
  }

  try {
    versions.wrangler = execSync('wrangler --version', { encoding: 'utf-8' }).trim().split(' ')[1] || 'unknown';
  } catch {
    versions.wrangler = 'not installed';
  }

  return versions;
}

function checkOutdated(workspace) {
  try {
    const cmd = workspace
      ? `npm outdated --json --workspace=${workspace}`
      : 'npm outdated --json';

    const result = execSync(cmd, {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    return JSON.parse(result || '{}');
  } catch (error) {
    // npm outdated exits with code 1 if there are outdated packages
    // We need to parse the stdout anyway
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout);
      } catch {
        return {};
      }
    }
    return {};
  }
}

function checkGlobalOutdated() {
  try {
    const result = execSync('npm outdated -g --json', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return JSON.parse(result || '{}');
  } catch (error) {
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout);
      } catch {
        return {};
      }
    }
    return {};
  }
}

async function main() {
  log('[INFO] === Starting Server/Tools Dependency Update Check ===');

  // Get global tool versions
  const globalVersions = getGlobalVersions();
  log(`[INFO] Node.js: ${globalVersions.node}`);
  log(`[INFO] npm: ${globalVersions.npm}`);
  log(`[INFO] Wrangler: ${globalVersions.wrangler}`);

  // Check for outdated packages in each workspace
  const workspaces = ['@saa/public-site', '@saa/admin-dashboard'];
  let totalOutdated = 0;
  let criticalOutdated = 0;
  const outdatedList = [];

  for (const workspace of workspaces) {
    log(`[INFO] Checking ${workspace}...`);
    const outdated = checkOutdated(workspace);

    for (const [pkg, info] of Object.entries(outdated)) {
      totalOutdated++;
      const isCritical = CRITICAL_PACKAGES.includes(pkg);
      if (isCritical) criticalOutdated++;

      const status = isCritical ? '[CRITICAL]' : '[INFO]';
      log(`${status} ${pkg}: ${info.current} → ${info.latest} (wanted: ${info.wanted})`);

      outdatedList.push({
        package: pkg,
        current: info.current,
        wanted: info.wanted,
        latest: info.latest,
        workspace,
        critical: isCritical
      });
    }
  }

  // Check global packages
  log('[INFO] Checking global packages...');
  const globalOutdated = checkGlobalOutdated();

  for (const [pkg, info] of Object.entries(globalOutdated)) {
    const isCritical = CRITICAL_PACKAGES.includes(pkg);
    if (isCritical) criticalOutdated++;
    totalOutdated++;

    const status = isCritical ? '[CRITICAL]' : '[INFO]';
    log(`${status} (global) ${pkg}: ${info.current} → ${info.latest}`);

    outdatedList.push({
      package: pkg,
      current: info.current,
      wanted: info.wanted || info.current,
      latest: info.latest,
      workspace: 'global',
      critical: isCritical
    });
  }

  // Summary
  log('[INFO] ----------------------------------------');
  if (totalOutdated === 0) {
    log('[INFO] ✅ All packages are up to date!');
  } else {
    log(`[INFO] Found ${totalOutdated} outdated package(s)`);
    if (criticalOutdated > 0) {
      log(`[WARN] ⚠️ ${criticalOutdated} CRITICAL package(s) need updating!`);
    }
  }

  log('[INFO] === Dependency Update Check Complete ===');

  // Write summary JSON for API consumption
  const summaryPath = '/var/log/dependency-updates-summary.json';
  const summary = {
    timestamp: new Date().toISOString(),
    totalOutdated,
    criticalOutdated,
    globalVersions,
    outdatedPackages: outdatedList
  };

  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  log(`[INFO] Summary written to ${summaryPath}`);

  return { totalOutdated, criticalOutdated };
}

main().catch(error => {
  log(`[ERROR] Fatal error: ${error.message}`);
  process.exit(1);
});
