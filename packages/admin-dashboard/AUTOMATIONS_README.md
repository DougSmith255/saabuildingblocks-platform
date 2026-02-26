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

### Step 2: Add Cron Job (if scheduled)
```bash
crontab -e
```

Add your schedule (use https://crontab.guru for help):
```bash
# Example: Run daily at 2 AM
0 2 * * * /usr/bin/node /path/to/your-script.js >> /var/log/your-automation.log 2>&1
```

### Step 3: Update API Endpoint

Edit `packages/admin-dashboard/app/api/automations/status/route.ts`

Add a checker function and include it in the `Promise.all()` call in the `GET()` handler. See the existing checker functions (e.g., `checkAutoUpdate`, `checkDependencyUpdates`) for patterns.

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

See the Automations tab in Master Controller for the full live list (27 automations across 9 categories).

### Key Cron Jobs
1. **Auto-Update System** — Daily at 4 AM (`0 4 * * *`) — `/var/log/auto-updates/cron.log`
2. **Dependency Update Check** — Weekly Monday 8 AM (`0 8 * * 1`) — `/var/log/dependency-updates.log`

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
