#!/bin/bash
# dlvr.it YouTube Video Resharer - Cron Job
# Checks for new YouTube videos every 4 hours and queues them
# to social platforms via dlvr.it with coordinated timing.
#
# Crontab entry (every 4 hours):
#   0 */4 * * * /home/ubuntu/saabuildingblocks-platform/packages/social-poster/scripts/dlvrit-youtube-cron.sh

LOG_DIR="/var/log/dlvrit-social-poster"
LOG_FILE="$LOG_DIR/youtube-$(date +%Y-%m-%d).log"
SCRIPT_DIR="/home/ubuntu/saabuildingblocks-platform/packages/social-poster"

mkdir -p "$LOG_DIR"

echo "[$(date -Iseconds)] Checking for new YouTube videos..." >> "$LOG_FILE"

cd "$SCRIPT_DIR" || {
  echo "[$(date -Iseconds)] ERROR: Could not cd to $SCRIPT_DIR" >> "$LOG_FILE"
  exit 1
}

# Run the YouTube share script with --execute
npx tsx scripts/dlvrit-youtube-share.ts --execute >> "$LOG_FILE" 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "[$(date -Iseconds)] YouTube check completed successfully." >> "$LOG_FILE"
else
  echo "[$(date -Iseconds)] ERROR: YouTube check failed with exit code $EXIT_CODE" >> "$LOG_FILE"
fi

# Update symlink for log viewer
ln -sf "$LOG_FILE" "$LOG_DIR/youtube-latest.log"

# Trim old log files (keep last 6 months)
find "$LOG_DIR" -name "youtube-*.log" -not -name "youtube-latest.log" -mtime +180 -delete 2>/dev/null

exit $EXIT_CODE
