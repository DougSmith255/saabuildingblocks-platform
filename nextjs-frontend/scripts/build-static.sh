#!/bin/bash

# Build script for true static export
# Temporarily moves dynamic routes out of app/ directory

set -e

echo "🚀 Building static export..."

# Create temporary directory for dynamic routes
mkdir -p .dynamic-routes-backup

# Move dynamic routes out of app directory
echo "📦 Moving dynamic routes to backup..."
mv app/accept-invitation .dynamic-routes-backup/ 2>/dev/null || true
mv app/agent-portal .dynamic-routes-backup/ 2>/dev/null || true
mv app/_auth .dynamic-routes-backup/ 2>/dev/null || true
mv app/category .dynamic-routes-backup/ 2>/dev/null || true

# Run Next.js build
echo "🏗️  Building with Next.js..."
npm run build

# Restore dynamic routes
echo "📥 Restoring dynamic routes..."
mv .dynamic-routes-backup/accept-invitation app/ 2>/dev/null || true
mv .dynamic-routes-backup/agent-portal app/ 2>/dev/null || true
mv .dynamic-routes-backup/_auth app/ 2>/dev/null || true
mv .dynamic-routes-backup/category app/ 2>/dev/null || true

# Cleanup
rm -rf .dynamic-routes-backup

echo "✅ Static export complete!"
echo "📊 Static files in: out/"
ls -lh out/ | head -20
