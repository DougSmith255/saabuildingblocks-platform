#!/bin/bash
# dlvr.it YouTube Rotation - Monthly Cron Job
# Refills the 45-day queue of YouTube video reshares.
#
# Crontab entry (1st of each month at 7 AM, 1 hour after blog poster):
#   0 7 1 * * /home/ubuntu/saabuildingblocks-platform/packages/social-poster/scripts/dlvrit-youtube-rotation-cron.sh

LOG_DIR="/var/log/dlvrit-social-poster"
LOG_FILE="$LOG_DIR/youtube-rotation-$(date +%Y-%m-%d).log"
SCRIPT_DIR="/home/ubuntu/saabuildingblocks-platform/packages/social-poster"

mkdir -p "$LOG_DIR"

echo "[$(date -Iseconds)] Starting YouTube rotation queue refill..." >> "$LOG_FILE"

cd "$SCRIPT_DIR" || {
  echo "[$(date -Iseconds)] ERROR: Could not cd to $SCRIPT_DIR" >> "$LOG_FILE"
  exit 1
}

npx tsx scripts/dlvrit-youtube-rotation.ts --execute --days 45 >> "$LOG_FILE" 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "[$(date -Iseconds)] YouTube rotation refill completed successfully." >> "$LOG_FILE"
else
  echo "[$(date -Iseconds)] ERROR: YouTube rotation refill failed with exit code $EXIT_CODE" >> "$LOG_FILE"
fi

ln -sf "$LOG_FILE" "$LOG_DIR/youtube-rotation-latest.log"

find "$LOG_DIR" -name "youtube-rotation-*.log" -not -name "youtube-rotation-latest.log" -mtime +180 -delete 2>/dev/null

exit $EXIT_CODE
