#!/bin/bash
#
# 🛡️ EMERGENCY RESTORE SCRIPT
#
# This script restores your codebase to the SAFE checkpoint
# created before CSS render blocking optimization.
#
# Usage: bash RESTORE-SAFE-POINT.sh
#

set -e

echo "🛡️ EMERGENCY RESTORE TO SAFE CHECKPOINT"
echo "========================================"
echo ""
echo "This will restore to: SAFE-CHECKPOINT-20251113-203622"
echo "Current commit: $(git log --oneline -1)"
echo ""
echo "⚠️  WARNING: This will discard ALL changes after the checkpoint!"
echo ""
read -p "Are you sure? Type 'YES' to continue: " confirm

if [ "$confirm" != "YES" ]; then
  echo "❌ Restore cancelled"
  exit 1
fi

echo ""
echo "🔄 Restoring to safe checkpoint..."
echo ""

# Reset to safe checkpoint
git reset --hard SAFE-CHECKPOINT-20251113-203622

# Clean any untracked files
git clean -fd

# Rebuild
echo "🔨 Rebuilding..."
cd packages/public-site
npm run build

# Restart PM2
echo "🔄 Restarting preview server..."
su - claude-flow -c "cd /home/claude-flow && pm2 restart nextjs-saa"

echo ""
echo "✅ RESTORE COMPLETE!"
echo ""
echo "Your codebase is now back to the safe checkpoint."
echo "All components should be working exactly as before."
echo ""
echo "Current commit: $(git log --oneline -1)"
