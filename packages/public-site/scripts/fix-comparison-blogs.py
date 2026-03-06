#!/usr/bin/env python3
"""
Fix brokerage comparison blog posts in WordPress.

Targets only head-to-head comparison posts (name-name pattern).
Excludes: commissions, new-agents, fees, reviews, revenue-share, profits.

Fixes applied:
1. H3 section headings → H2 (Commission Splits, Income Opportunities, etc.)
2. Remove existing Rank Math TOC block (let Rank Math auto-generate with H2s only)
3. Remove "Join our FREE Team at eXp Realty" section and everything after it
4. Remove stray Corcoran comparison image at top of post
5. Clean up Divi comments and empty paragraphs
"""

import json
import re
import subprocess
import sys
import tempfile
import time

EXCLUDE_SLUGS = {'commissions', 'new-agents', 'fees', 'reviews', 'revenue-share', 'profits'}

DRY_RUN = '--dry-run' in sys.argv
VERBOSE = '--verbose' in sys.argv or '-v' in sys.argv
SINGLE = None
for arg in sys.argv[1:]:
    if not arg.startswith('-'):
        SINGLE = arg  # Run on a single slug only


def load_comparison_posts():
    """Load all brokerage comparison posts from the JSON chunks."""
    base = '/home/ubuntu/saabuildingblocks-platform/packages/public-site/public'
    with open(f'{base}/blog-posts-index.json') as f:
        index = json.load(f)

    posts = []
    for i in range(1, index['totalChunks'] + 1):
        with open(f'{base}/blog-posts-chunk-{i}.json') as f:
            chunk = json.load(f)
        for post in chunk:
            if 'Brokerage Comparison' not in post.get('categories', []):
                continue
            uri = post.get('customUri', '')
            slug_part = uri.split('/')[-1] if '/' in uri else uri
            if slug_part in EXCLUDE_SLUGS or '-' not in slug_part:
                continue
            if SINGLE and slug_part != SINGLE:
                continue
            posts.append({
                'id': post['id'],
                'slug': slug_part,
                'title': post['title'],
                'content': post['content'],
                'customUri': uri,
            })

    return sorted(posts, key=lambda p: p['slug'])


def fix_content(content, slug):
    """Apply all fixes to post content. Returns (new_content, changes_list)."""
    changes = []
    original = content

    # === FIX 1: Remove stray Corcoran image at top ===
    corcoran_img = re.search(
        r'<figure[^>]*>.*?Corcoran-Image\.webp.*?</figure>\s*',
        content[:800], re.DOTALL
    )
    if corcoran_img:
        content = content[:corcoran_img.start()] + content[corcoran_img.end():]
        changes.append("Removed stray Corcoran comparison image")

    # === FIX 2: Remove existing Rank Math TOC block ===
    # Pattern 1: With divi comment wrapper
    toc_pattern1 = re.compile(
        r'(?:<p>)?<!-- divi:rank-math/toc-block.*?<!-- /divi:rank-math/toc-block -->\s*(?:</p>)?\s*',
        re.DOTALL
    )
    # Pattern 2: Just the rendered TOC div
    toc_pattern2 = re.compile(
        r'<div class="wp-block-rank-math-toc-block"[^>]*>.*?</div>\s*</nav>\s*</div>\s*',
        re.DOTALL
    )

    if toc_pattern1.search(content):
        content = toc_pattern1.sub('', content)
        changes.append("Removed Rank Math TOC block (with divi wrapper)")
    if toc_pattern2.search(content):
        content = toc_pattern2.sub('', content)
        changes.append("Removed Rank Math TOC block (rendered div)")

    # === FIX 3: Convert H3 section headings to H2 ===
    # These are the main content section headings that should be H2
    # Match h3 tags with optional attributes and convert to h2
    h3_to_h2_count = 0

    def replace_h3_to_h2(match):
        nonlocal h3_to_h2_count
        full = match.group(0)
        # Also update the divi comment if present (level 3 -> level not specified or remove)
        h3_to_h2_count += 1
        # Replace opening and closing tags
        result = re.sub(r'<h3(\s[^>]*)?>',  r'<h2\1>', full)
        result = re.sub(r'</h3>', '</h2>', result)
        return result

    # Only convert h3s that are main section headings (not FAQ sub-items etc.)
    # These h3s appear as standalone headings between content paragraphs
    # Pattern: optional divi comment, then h3 tag
    section_h3_pattern = re.compile(
        r'(?:(?:<p>)?<!-- divi:heading \{"level":3\} -->\s*(?:</p>)?\s*)?'
        r'<h3\b[^>]*>(.*?)</h3>'
        r'(?:\s*(?:<p>)?<!-- /divi:heading -->\s*(?:</p>)?)?',
        re.DOTALL
    )

    content = section_h3_pattern.sub(
        lambda m: replace_h3_to_h2(m),
        content
    )

    if h3_to_h2_count > 0:
        changes.append(f"Converted {h3_to_h2_count} H3 section headings to H2")

    # Also fix divi heading comments that still say level:3
    content = re.sub(
        r'<!-- divi:heading \{"level":3\} -->',
        '<!-- divi:heading -->',
        content
    )

    # === FIX 4: Remove "Join our FREE Team at eXp Realty" section ===
    # This section starts with an h2 or h3 "Join our FREE Team" and goes to the end
    # The heading text may be wrapped in <strong> tags
    join_patterns = [
        # Pattern: divi comment + h2/h3 heading followed by content to end
        re.compile(
            r'(?:<p>)?<!-- divi:heading[^>]*-->\s*(?:</p>)?\s*'
            r'<h[23][^>]*>(?:<strong>)?\s*Join our FREE Team.*$',
            re.DOTALL
        ),
        # Pattern: h2/h3 without divi comment
        re.compile(
            r'<h[23][^>]*>(?:<strong>)?\s*Join our FREE Team.*$',
            re.DOTALL
        ),
    ]

    for pattern in join_patterns:
        if pattern.search(content):
            content = pattern.sub('', content)
            changes.append("Removed 'Join our FREE Team at eXp Realty' section")
            break

    # === FIX 5: Clean up artifacts ===
    # Remove empty divi spacer blocks
    content = re.sub(
        r'(?:<p>)?<!-- divi:spacer.*?<!-- /divi:spacer -->\s*(?:</p>)?\s*'
        r'(?:<div[^>]*class="wp-block-spacer"[^>]*></div>\s*)?',
        '', content
    )

    # Remove consecutive empty paragraphs
    content = re.sub(r'(<p>\s*</p>\s*){2,}', '', content)

    # Remove trailing whitespace
    content = content.rstrip()

    if content != original and not changes:
        changes.append("Minor cleanup")

    return content, changes


WP_PATH = '/var/www/wordpress/'


def update_wordpress_post(post_id, new_content):
    """Update a WordPress post via WP-CLI."""
    import os
    with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False) as f:
        f.write(new_content)
        tmp_path = f.name

    try:
        php = (
            f"$c = file_get_contents('{tmp_path}');"
            f"$r = wp_update_post(['ID' => {post_id}, 'post_content' => $c]);"
            f"echo is_wp_error($r) ? 'Error: '.$r->get_error_message() : 'OK';"
        )
        result = subprocess.run(
            ['wp', 'eval', php, f'--path={WP_PATH}'],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode != 0 or 'Error' in result.stdout:
            raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    finally:
        os.unlink(tmp_path)


def main():
    posts = load_comparison_posts()
    print(f"Loaded {len(posts)} comparison posts")
    if DRY_RUN:
        print("*** DRY RUN - no changes will be made ***\n")

    total_changes = 0
    posts_changed = 0
    posts_skipped = 0

    for post in posts:
        new_content, changes = fix_content(post['content'], post['slug'])

        if not changes:
            posts_skipped += 1
            if VERBOSE:
                print(f"  SKIP {post['slug']} - no changes needed")
            continue

        posts_changed += 1
        total_changes += len(changes)
        print(f"\n{'='*60}")
        print(f"  {post['slug']} (ID: {post['id']})")
        print(f"  {post['title']}")
        for c in changes:
            print(f"    - {c}")

        if VERBOSE:
            old_len = len(post['content'])
            new_len = len(new_content)
            print(f"    Content: {old_len} -> {new_len} chars ({new_len - old_len:+d})")

        if not DRY_RUN:
            try:
                update_wordpress_post(post['id'], new_content)
                print(f"    UPDATED in WordPress")
            except Exception as e:
                print(f"    ERROR: {e}")

    print(f"\n{'='*60}")
    print(f"Summary: {posts_changed} posts changed, {posts_skipped} skipped, {total_changes} total fixes")
    if DRY_RUN:
        print("*** DRY RUN - no changes were made ***")


if __name__ == '__main__':
    main()
