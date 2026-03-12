#!/bin/bash
# Update blog post titles and Rank Math meta titles from "2025" to "2026"
# Only touches post_title and rank_math_title meta - no content changes.

WP_PATH="/var/www/wordpress/"
DRY_RUN="${1:-}"

echo "=== Updating 2025 -> 2026 in post titles and meta titles ==="
echo ""

# --- Part 1: Update post_title ---
echo "--- POST TITLES ---"
TITLE_IDS=$(wp db query "SELECT ID FROM __wp_posts WHERE post_type='post' AND post_status='publish' AND post_title LIKE '%2025%';" --path="$WP_PATH" --skip-column-names 2>/dev/null)
TITLE_COUNT=$(echo "$TITLE_IDS" | grep -c '[0-9]')
echo "Found $TITLE_COUNT posts with '2025' in post_title"

if [ "$DRY_RUN" = "--dry-run" ]; then
  echo "[DRY RUN] Would update these post titles:"
  for ID in $TITLE_IDS; do
    OLD=$(wp db query "SELECT post_title FROM __wp_posts WHERE ID=$ID;" --path="$WP_PATH" --skip-column-names 2>/dev/null)
    NEW=$(echo "$OLD" | sed 's/2025/2026/g')
    echo "  [$ID] $OLD"
    echo "     -> $NEW"
  done
else
  UPDATED=0
  for ID in $TITLE_IDS; do
    OLD=$(wp db query "SELECT post_title FROM __wp_posts WHERE ID=$ID;" --path="$WP_PATH" --skip-column-names 2>/dev/null)
    NEW=$(echo "$OLD" | sed 's/2025/2026/g')
    wp db query "UPDATE __wp_posts SET post_title=REPLACE(post_title, '2025', '2026') WHERE ID=$ID;" --path="$WP_PATH" 2>/dev/null
    echo "  [$ID] $OLD -> $NEW"
    UPDATED=$((UPDATED + 1))
  done
  echo "Updated $UPDATED post titles"
fi

echo ""

# --- Part 2: Update rank_math_title meta ---
echo "--- RANK MATH META TITLES ---"
META_IDS=$(wp db query "SELECT post_id FROM __wp_postmeta WHERE meta_key='rank_math_title' AND meta_value LIKE '%2025%';" --path="$WP_PATH" --skip-column-names 2>/dev/null)
META_COUNT=$(echo "$META_IDS" | grep -c '[0-9]')
echo "Found $META_COUNT posts with '2025' in rank_math_title"

if [ "$DRY_RUN" = "--dry-run" ]; then
  echo "[DRY RUN] Would update these meta titles:"
  for ID in $META_IDS; do
    OLD=$(wp db query "SELECT meta_value FROM __wp_postmeta WHERE post_id=$ID AND meta_key='rank_math_title';" --path="$WP_PATH" --skip-column-names 2>/dev/null)
    NEW=$(echo "$OLD" | sed 's/2025/2026/g')
    echo "  [$ID] $OLD"
    echo "     -> $NEW"
  done
else
  UPDATED=0
  for ID in $META_IDS; do
    OLD=$(wp db query "SELECT meta_value FROM __wp_postmeta WHERE post_id=$ID AND meta_key='rank_math_title';" --path="$WP_PATH" --skip-column-names 2>/dev/null)
    NEW=$(echo "$OLD" | sed 's/2025/2026/g')
    wp db query "UPDATE __wp_postmeta SET meta_value=REPLACE(meta_value, '2025', '2026') WHERE post_id=$ID AND meta_key='rank_math_title';" --path="$WP_PATH" 2>/dev/null
    echo "  [$ID] $OLD -> $NEW"
    UPDATED=$((UPDATED + 1))
  done
  echo "Updated $UPDATED meta titles"
fi

echo ""
echo "=== Done ==="
if [ "$DRY_RUN" != "--dry-run" ]; then
  echo ""
  echo "Next steps:"
  echo "  1. Regenerate blog posts JSON: cd packages/public-site && npm run generate:blog-posts"
  echo "  2. Rebuild and deploy the site"
fi
