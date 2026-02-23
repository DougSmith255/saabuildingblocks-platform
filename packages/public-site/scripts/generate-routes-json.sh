#!/bin/bash
# Generate _routes.json for Cloudflare Pages
#
# Excludes static assets and top-level page paths from Functions routing
# so that only unknown slugs (dynamic agent pages) hit [slug].js.
#
# IMPORTANT: We only exclude the exact top-level page path, NOT sub-paths
# (no "/*" wildcard). This ensures the _middleware.js still runs for
# sub-paths, allowing KV redirect lookups to work for old URLs that
# live under existing page directories (e.g. /about-exp-realty/locations/*).
# The performance cost is minimal (~10ms for Function invocation + KV read).

OUT_DIR="out"

# Start with asset excludes (wildcards are fine here - these are truly static)
EXCLUDES='"/fonts/*","/_next/*","/*.ico","/*.txt","/*.xml","/*.json","/*.png","/*.jpg","/*.webp","/*.css","/*.svg"'

# Exclude root index (homepage)
EXCLUDES="$EXCLUDES,\"/\""

# Exclude every top-level static page directory that has an index.html
# Only exclude the exact path, not sub-paths, so middleware can handle
# KV redirects for old URLs under these directories
for dir in "$OUT_DIR"/*/; do
  dirname=$(basename "$dir")
  # Skip special directories already covered or not real pages
  case "$dirname" in
    _next|fonts|images|404|_not-found) continue ;;
  esac
  # Only if it has an index.html (it's a real page)
  if [ -f "$dir/index.html" ]; then
    EXCLUDES="$EXCLUDES,\"/${dirname}\""
  fi
done

# Write _routes.json
echo "{\"version\":1,\"include\":[\"/*\"],\"exclude\":[$EXCLUDES]}" > "$OUT_DIR/_routes.json"
chmod 644 "$OUT_DIR/_routes.json"

echo "Generated _routes.json with static page exclusions"
