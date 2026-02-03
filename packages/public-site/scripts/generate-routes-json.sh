#!/bin/bash
# Generate _routes.json for Cloudflare Pages
#
# Excludes ALL static pages from Functions routing so that only
# unknown slugs (dynamic agent pages) hit [slug].js.
# Static pages are served directly from the CDN without going
# through the Functions Worker pipeline.

OUT_DIR="out"

# Start with asset excludes
EXCLUDES='"/fonts/*","/_next/*","/*.ico","/*.txt","/*.xml","/*.json","/*.png","/*.jpg","/*.webp","/*.css","/*.svg"'

# Exclude root index (homepage)
EXCLUDES="$EXCLUDES,\"/\""

# Exclude every top-level static page directory that has an index.html
for dir in "$OUT_DIR"/*/; do
  dirname=$(basename "$dir")
  # Skip special directories already covered or not real pages
  case "$dirname" in
    _next|fonts|images|404|_not-found) continue ;;
  esac
  # Only if it has an index.html (it's a real page)
  if [ -f "$dir/index.html" ]; then
    EXCLUDES="$EXCLUDES,\"/${dirname}\",\"/${dirname}/*\""
  fi
done

# Write _routes.json
echo "{\"version\":1,\"include\":[\"/*\"],\"exclude\":[$EXCLUDES]}" > "$OUT_DIR/_routes.json"
chmod 644 "$OUT_DIR/_routes.json"

echo "Generated _routes.json with static page exclusions"
