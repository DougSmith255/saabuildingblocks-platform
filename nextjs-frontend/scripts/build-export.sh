#!/bin/bash

# Static Export Build Script (GitHub Actions ONLY)
# Builds ONLY blog content for Cloudflare Pages
# EXCLUDES: Master Controller, API routes, auth routes

set -e

echo "🚀 Building static export for Cloudflare Pages..."
echo "   This build EXCLUDES Master Controller and API routes"
echo ""

# Move excluded routes temporarily
EXCLUDED_DIRS=(
  "app/master-controller"
  "app/api"
  "app/_auth"
  "app/agent-portal"
  "app/accept-invitation"
)

BACKUP_DIR=".excluded-routes-backup"

echo "📦 Temporarily moving excluded routes..."
mkdir -p "$BACKUP_DIR"

for dir in "${EXCLUDED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "  Moving: $dir"
    # Create parent directory structure in backup
    parent_dir=$(dirname "$dir")
    mkdir -p "$BACKUP_DIR/$parent_dir"
    mv "$dir" "$BACKUP_DIR/$dir"
  fi
done

echo ""
echo "🎨 Generating static CSS from Master Controller..."
npm run generate:css || {
  echo "⚠️  CSS generation failed, using default styles"
}

echo ""
echo "🏗️  Building static export (blog content only)..."
NEXT_CONFIG_FILE=next.config.export.ts next build

echo ""
echo "✅ Static export complete!"

echo ""
echo "📦 Restoring excluded routes..."
for dir in "${EXCLUDED_DIRS[@]}"; do
  if [ -d "$BACKUP_DIR/$dir" ]; then
    echo "  Restoring: $dir"
    parent_dir=$(dirname "$dir")
    mkdir -p "$parent_dir"
    mv "$BACKUP_DIR/$dir" "$dir"
  fi
done

# Cleanup backup directory
rm -rf "$BACKUP_DIR"

echo ""
echo "📊 Export verification:"
echo "  Files exported: $(find out -type f 2>/dev/null | wc -l)"
echo "  Total size: $(du -sh out/ 2>/dev/null | cut -f1 || echo 'N/A')"
echo ""
echo "  Directory structure:"
ls -lah out/ 2>/dev/null | head -20 || echo "No output directory found"
echo ""
echo "✅ Build complete - ready for Cloudflare Pages deployment"
