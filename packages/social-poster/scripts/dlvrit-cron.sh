#!/bin/bash
# dlvr.it Social Poster - Monthly Cron Job
# Refills the dlvr.it queue with 45 days of scheduled blog posts.
# Logs output for monitoring via the Automations tab.
#
# Crontab entry (1st of each month at 6 AM):
#   0 6 1 * * /home/ubuntu/saabuildingblocks-platform/packages/social-poster/scripts/dlvrit-cron.sh

LOG_DIR="/var/log/dlvrit-social-poster"
LOG_FILE="$LOG_DIR/cron-$(date +%Y-%m-%d).log"
SCRIPT_DIR="/home/ubuntu/saabuildingblocks-platform/packages/social-poster"

mkdir -p "$LOG_DIR"

echo "[$(date -Iseconds)] Starting dlvr.it queue refill..." >> "$LOG_FILE"

cd "$SCRIPT_DIR" || {
  echo "[$(date -Iseconds)] ERROR: Could not cd to $SCRIPT_DIR" >> "$LOG_FILE"
  exit 1
}

# Run the queue script with --execute
npx tsx scripts/dlvrit-queue-posts.ts --execute --days 45 >> "$LOG_FILE" 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "[$(date -Iseconds)] Queue refill completed successfully." >> "$LOG_FILE"
else
  echo "[$(date -Iseconds)] ERROR: Queue refill failed with exit code $EXIT_CODE" >> "$LOG_FILE"
fi

# Update symlink for log viewer
ln -sf "$LOG_FILE" "$LOG_DIR/latest.log"

# Trim old log files (keep last 6 months)
find "$LOG_DIR" -name "cron-*.log" -mtime +180 -delete 2>/dev/null

exit $EXIT_CODE
