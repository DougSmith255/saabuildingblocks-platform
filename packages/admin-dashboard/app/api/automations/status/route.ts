import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

interface Automation {
  id: string;
  name: string;
  description: string;
  schedule: string;
  status: 'active' | 'broken';
  lastRun?: string;
  nextRun?: string;
  logFile?: string;
}

/**
 * Check if cron job exists and is properly configured
 */
async function checkCronJob(scriptPath: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync('crontab -l');
    return stdout.includes(scriptPath);
  } catch (error) {
    return false;
  }
}

/**
 * Parse log file to find last run and determine status
 */
async function parseLogFile(logPath: string): Promise<{
  lastRun?: string;
  status: 'active' | 'broken';
}> {
  try {
    const logContent = await fs.readFile(logPath, 'utf-8');
    const lines = logContent.trim().split('\n');

    // Find the most recent sync session
    let lastRunTime: string | undefined;
    let lastStatus: 'active' | 'broken' = 'broken';

    // Look for "Starting EverWebinar to GoHighLevel Sync" entries (most recent)
    const startEntries = lines.filter(line => line.includes('Starting EverWebinar to GoHighLevel Sync'));

    if (startEntries.length > 0) {
      const lastStartLine = startEntries[startEntries.length - 1];
      const timeMatch = lastStartLine.match(/\[(.*?)\]/);

      if (timeMatch) {
        lastRunTime = timeMatch[1];

        // Check if the sync completed successfully by looking for "Sync Complete" after this timestamp
        const syncCompleteEntries = lines.filter(line =>
          line.includes('Sync Complete') && line > lastStartLine
        );

        // Only check for FATAL errors - not duplicate contact errors which are expected
        // Duplicate contact errors happen when someone registers multiple times
        const fatalErrorEntries = lines.filter(line =>
          line.includes('Fatal error') && line > lastStartLine
        );

        if (syncCompleteEntries.length > 0 && fatalErrorEntries.length === 0) {
          lastStatus = 'active';
        } else if (fatalErrorEntries.length > 0) {
          lastStatus = 'broken';
        } else {
          // If we have a start but no completion or error, check how recent it is
          const lastRunDate = new Date(lastRunTime);
          const now = new Date();
          const hoursSinceLastRun = (now.getTime() - lastRunDate.getTime()) / (1000 * 60 * 60);

          // If the last run was within 24 hours and no errors, consider it active
          // Otherwise, it might be stuck
          lastStatus = hoursSinceLastRun < 24 ? 'active' : 'broken';
        }
      }
    } else {
      // No runs found in log - check if log file is recent
      const stats = await fs.stat(logPath);
      const daysSinceModified = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

      // If log file exists but hasn't been modified in over 2 days, automation is broken
      lastStatus = daysSinceModified > 2 ? 'broken' : 'active';
    }

    return { lastRun: lastRunTime, status: lastStatus };
  } catch (error) {
    // Log file doesn't exist or can't be read - automation is broken
    return { status: 'broken' };
  }
}

/**
 * Calculate next run time for a daily 6 PM cron job (0 18 * * *)
 */
function calculateNextRun(): string {
  const now = new Date();
  const nextRun = new Date();

  // Set to 6 PM today
  nextRun.setHours(18, 0, 0, 0);

  // If 6 PM today has already passed, schedule for tomorrow
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  return nextRun.toISOString();
}

export async function GET() {
  try {
    const automations: Automation[] = [];

    // Check EverWebinar to GoHighLevel sync automation
    const scriptPath = '/home/claude-flow/sync-everwebinar-to-ghl.js';
    const logPath = '/var/log/everwebinar-sync.log';

    const cronExists = await checkCronJob(scriptPath);
    const { lastRun, status } = await parseLogFile(logPath);

    automations.push({
      id: 'everwebinar-ghl-sync',
      name: 'EverWebinar to GoHighLevel Sync',
      description: 'Automatically syncs new EverWebinar registrants to GoHighLevel with geolocation enrichment',
      schedule: 'Daily at 6:00 PM EST',
      status: cronExists ? status : 'broken',
      lastRun: lastRun,
      nextRun: cronExists ? calculateNextRun() : undefined,
      logFile: 'everwebinar-sync.log'
    });

    return NextResponse.json({
      automations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching automation status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch automation status' },
      { status: 500 }
    );
  }
}
