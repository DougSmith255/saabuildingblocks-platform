# Automations System Documentation

## Overview
The Automations tab in the Master Controller provides real-time monitoring of system automations (cron jobs, background tasks, scheduled scripts).

## Architecture

### Components
1. **AutomationsTab** (`app/master-controller/components/tabs/AutomationsTab.tsx`)
   - Frontend component that displays automation tiles
   - Fetches status from API endpoint
   - Shows green "Active" or red "Broken" badges

2. **API Endpoint** (`app/api/automations/status/route.ts`)
   - Returns status for all configured automations
   - Checks cron job existence
   - Parses log files to determine health
   - Calculates next run times

## Adding New Automations

### Step 1: Create Your Automation Script
Create a standalone Node.js script (or any executable) that:
- Logs start/completion clearly (for status detection)
- Logs errors with `[ERROR]` prefix
- Outputs to a log file in `/var/log/`

Example log pattern:
```javascript
console.log(`[${new Date().toISOString()}] [INFO] === Starting My Automation ===`);
// ... do work ...
console.log(`[${new Date().toISOString()}] [INFO] Automation Complete`);
```

### Step 2: Add Cron Job
```bash
crontab -e
```

Add your schedule (use https://crontab.guru for help):
```bash
# Example: Run daily at 2 AM
0 2 * * * /usr/bin/node /path/to/your-script.js >> /var/log/your-automation.log 2>&1
```

### Step 3: Update API Endpoint

Edit `/home/claude-flow/packages/admin-dashboard/app/api/automations/status/route.ts`

Add your automation to the `GET()` function:

```typescript
export async function GET() {
  try {
    const automations: Automation[] = [];

    // EXISTING: EverWebinar to GoHighLevel sync
    const scriptPath1 = '/home/claude-flow/sync-everwebinar-to-ghl.js';
    const logPath1 = '/var/log/everwebinar-sync.log';
    const cronExists1 = await checkCronJob(scriptPath1);
    const { lastRun: lastRun1, status: status1 } = await parseLogFile(logPath1);

    automations.push({
      id: 'everwebinar-ghl-sync',
      name: 'EverWebinar to GoHighLevel Sync',
      description: 'Automatically syncs new EverWebinar registrants to GoHighLevel with geolocation enrichment',
      schedule: 'Daily at 6:00 PM EST',
      status: cronExists1 ? status1 : 'broken',
      lastRun: lastRun1,
      nextRun: cronExists1 ? calculateNextRun() : undefined,
      logFile: 'everwebinar-sync.log'
    });

    // NEW: Add your automation here
    const scriptPath2 = '/path/to/your-script.js';
    const logPath2 = '/var/log/your-automation.log';
    const cronExists2 = await checkCronJob(scriptPath2);
    const { lastRun: lastRun2, status: status2 } = await parseLogFile(logPath2);

    automations.push({
      id: 'your-automation-id',  // Unique ID (kebab-case)
      name: 'Your Automation Name',  // Display name
      description: 'What this automation does',  // Brief description
      schedule: 'Daily at 2:00 AM EST',  // Human-readable schedule
      status: cronExists2 ? status2 : 'broken',
      lastRun: lastRun2,
      nextRun: cronExists2 ? calculateNextRunYourSchedule() : undefined,  // You may need to create a custom calculator
      logFile: 'your-automation.log'  // Just the filename, not full path
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
```

### Step 4: Custom Next Run Calculator (if needed)

If your cron schedule is different from daily 6 PM, add a custom calculator:

```typescript
/**
 * Calculate next run time for your specific cron schedule
 * Example: Daily at 2 AM (0 2 * * *)
 */
function calculateNextRunYourSchedule(): string {
  const now = new Date();
  const nextRun = new Date();

  // Set to 2 AM today
  nextRun.setHours(2, 0, 0, 0);

  // If 2 AM today has already passed, schedule for tomorrow
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  return nextRun.toISOString();
}
```

For complex schedules (weekly, monthly), use a library like `cron-parser`:
```bash
npm install cron-parser
```

```typescript
import parser from 'cron-parser';

function calculateNextRunComplex(cronExpression: string): string {
  const interval = parser.parseExpression(cronExpression);
  return interval.next().toISOString();
}
```

### Step 5: Restart Application
```bash
pm2 restart admin-dashboard
```

### Step 6: Verify
1. Visit: `http://localhost:3002/master-controller?tab=automations`
2. Check that your new automation tile appears
3. Verify status badge (green Active or red Broken)
4. Click "View Logs" to see execution history

## Status Detection Logic

The `parseLogFile()` function determines automation health:

### Active Status
- Cron job exists in crontab
- Log file shows recent "Starting..." entry
- No `[ERROR]` or "Fatal error" after the start
- Last run was within 24 hours

### Broken Status
- Cron job missing from crontab
- Log file doesn't exist
- Log file shows errors after start
- No recent runs (>24 hours for daily jobs)
- Log file not modified in >2 days

## Customizing Status Detection

If your automation has different logging patterns, modify `parseLogFile()`:

```typescript
async function parseLogFile(logPath: string, startPattern?: string, completePattern?: string): Promise<{
  lastRun?: string;
  status: 'active' | 'broken';
}> {
  // Use custom patterns if provided
  const startRegex = startPattern || 'Starting.*Sync';
  const completeRegex = completePattern || 'Sync Complete';

  // ... rest of logic ...
}
```

## Log File Best Practices

1. **Use ISO timestamps**: `[${new Date().toISOString()}]`
2. **Log levels**: `[INFO]`, `[ERROR]`, `[WARN]`
3. **Clear start marker**: Include "Starting" in your first log
4. **Clear completion marker**: Include "Complete" or "Done"
5. **Log rotation**: Use `logrotate` to prevent huge log files

Example `/etc/logrotate.d/automations`:
```
/var/log/*-automation.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
```

## Testing Your Automation

1. **Manual run**:
   ```bash
   node /path/to/your-script.js
   ```

2. **Check logs**:
   ```bash
   tail -f /var/log/your-automation.log
   ```

3. **Verify cron**:
   ```bash
   crontab -l | grep your-script
   ```

4. **Test API endpoint**:
   ```bash
   curl http://localhost:3002/api/automations/status
   ```

## Troubleshooting

### Automation shows as "Broken"
1. Check if cron job exists: `crontab -l`
2. Check if script is executable: `ls -la /path/to/script.js`
3. Check log file exists: `ls -la /var/log/your-automation.log`
4. Check for errors in logs: `grep ERROR /var/log/your-automation.log`
5. Run script manually to test: `node /path/to/script.js`

### Logs not appearing
1. Verify log path in cron job matches API endpoint
2. Check file permissions: `ls -la /var/log/`
3. Ensure script outputs to stdout (console.log, not file writes)

### Next run time incorrect
1. Verify cron expression: https://crontab.guru
2. Check timezone: `date` and `timedatectl`
3. Update `calculateNextRun()` function for your schedule

## Current Automations

### 1. EverWebinar to GoHighLevel Sync
- **ID**: `everwebinar-ghl-sync`
- **Script**: `/home/claude-flow/sync-everwebinar-to-ghl.js`
- **Schedule**: Daily at 6:00 PM EST (`0 18 * * *`)
- **Log**: `/var/log/everwebinar-sync.log`
- **Purpose**: Syncs new EverWebinar registrants to GoHighLevel with geolocation

## Future Enhancements

Possible features to add:
- [ ] Manual trigger buttons for each automation
- [ ] Email alerts when automations break
- [ ] Execution history/analytics
- [ ] Configuration editor (edit cron schedules from UI)
- [ ] Automation templates/presets
- [ ] Success/failure rate statistics
- [ ] Integration with PM2 for process-based automations

## Questions?

When adding automations, ensure:
1. ✅ Script logs clearly with timestamps
2. ✅ Cron job is configured
3. ✅ Log file path is accessible
4. ✅ Added to API endpoint
5. ✅ Application restarted
6. ✅ Tested in Master Controller UI
