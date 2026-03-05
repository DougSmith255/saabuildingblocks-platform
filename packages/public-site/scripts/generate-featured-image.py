#!/usr/bin/env python3
"""
Generate branded SAA blog featured images with Pexels backgrounds.

Usage:
  # Generate for a single post (by WordPress post ID)
  python3 generate-featured-image.py --post-id 3700 --title "eXp New Homes Division" --short-title "EXP NEW HOMES DIVISION" --category "About eXp Realty" --query "new home construction luxury"

  # Generate for a single post with auto-upload to WordPress
  python3 generate-featured-image.py --post-id 3700 --title "eXp New Homes Division" --short-title "EXP NEW HOMES DIVISION" --category "About eXp Realty" --query "new home construction luxury" --upload

  # Batch mode: generate for all posts from a JSON file
  python3 generate-featured-image.py --batch posts.json

  # Preview only (don't upload)
  python3 generate-featured-image.py --post-id 3700 --title "Test" --short-title "TEST" --category "About eXp Realty" --query "real estate" --preview

Output: 1000x570px PNG with category tag, title, Doug & Karrie, SAA logo, Pexels background.

Requires: pip install pillow fonttools
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os
import io
import json
import hashlib
import subprocess
import time
import sys
import argparse
import random
from pathlib import Path

# ── Paths (relative to this script) ──
SCRIPT_DIR = Path(__file__).parent
ASSETS_DIR = SCRIPT_DIR / "assets"
PUBLIC_DIR = SCRIPT_DIR.parent / "public"
OUTPUT_DIR = Path("/home/ubuntu/tmp/featured-images")

# ── Config ──
W, H = 1000, 570
GOLD = (255, 215, 0)
GOLD_DIM = (180, 155, 0)
WHITE = (229, 228, 221)
GRAY = (120, 120, 115)
FALLBACK_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

# ── Pexels API Key ──
# Loaded from env var or admin-dashboard/.env.local
PEXELS_API_KEY = os.environ.get("PEXELS_API_KEY", "")
if not PEXELS_API_KEY:
    for env_path in [SCRIPT_DIR.parent / ".env.local", SCRIPT_DIR.parent.parent / "admin-dashboard" / ".env.local"]:
        if env_path.exists():
            for line in env_path.read_text().splitlines():
                if line.startswith("PEXELS_API_KEY="):
                    PEXELS_API_KEY = line.split("=", 1)[1].strip()
                    break
            if PEXELS_API_KEY:
                break

# ── Fonts ──
TASKOR_PATH = str(ASSETS_DIR / "taskor-regular.ttf")
AMULYA_PATH = str(ASSETS_DIR / "amulya-variable.ttf")


def load_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.truetype(FALLBACK_BOLD, size)


# ── Category color tints ──
CATEGORY_TINTS = {
    'eXp Realty Sponsor':     (40, 30, 0),
    'About eXp Realty':       (0, 15, 35),
    'Brokerage Comparison':   (35, 20, 0),
    'Marketing Mastery':      (0, 25, 15),
    'Agent Career Info':      (20, 10, 30),
    'Winning Clients':        (30, 10, 10),
    'Become an Agent':        (10, 25, 20),
    'Real Estate Schools':    (30, 25, 5),
    'Fun for Agents':         (30, 15, 25),
    'Industry Trends':        (10, 20, 30),
    'Uncategorized':          (25, 25, 10),
    'Everything Real Estate': (20, 20, 15),
}

# ── Pexels photo cache ──
photo_cache = {}


def search_pexels(query, per_page=5):
    if query in photo_cache:
        return photo_cache[query]

    if not PEXELS_API_KEY:
        print("  WARNING: No PEXELS_API_KEY found. Set env var or check admin-dashboard/.env.local")
        return []

    from urllib.parse import quote
    encoded = quote(query)
    url = f"https://api.pexels.com/v1/search?query={encoded}&per_page={per_page}&orientation=landscape&size=medium"
    result = subprocess.run(
        ["curl", "-s", "-H", f"Authorization: {PEXELS_API_KEY}", url],
        capture_output=True, text=True
    )
    try:
        data = json.loads(result.stdout)
        photos = data.get("photos", [])
        photo_cache[query] = photos
        return photos
    except Exception:
        print(f"    API error for query '{query}': {result.stdout[:200]}")
        return []


def download_image(url):
    result = subprocess.run(["curl", "-sL", url], capture_output=True)
    return Image.open(io.BytesIO(result.stdout))


def create_background(photo_url, category, w, h):
    """Create darkened, tinted, vignetted background from Pexels photo."""
    img = download_image(photo_url)

    # Crop to target aspect ratio
    target_ratio = w / h
    img_ratio = img.width / img.height
    if img_ratio > target_ratio:
        new_w = int(img.height * target_ratio)
        left = (img.width - new_w) // 2
        img = img.crop((left, 0, left + new_w, img.height))
    else:
        new_h = int(img.width / target_ratio)
        top = (img.height - new_h) // 2
        img = img.crop((0, top, img.width, top + new_h))

    img = img.resize((w, h), Image.LANCZOS)

    # Darken significantly
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(0.25)

    # Desaturate
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(0.4)

    # Category-specific color tint
    tint = CATEGORY_TINTS.get(category, (30, 25, 0))
    tint_layer = Image.new("RGB", (w, h), tint)
    img = Image.blend(img, tint_layer, 0.3)

    # Vignette effect
    vignette = Image.new("L", (w, h), 255)
    v_draw = ImageDraw.Draw(vignette)
    for i in range(80):
        alpha = int(255 * (1 - i / 80) * 0.5)
        v_draw.rectangle([i, i, w - i, h - i], outline=alpha)
    vignette = vignette.filter(ImageFilter.GaussianBlur(radius=40))
    img = Image.composite(img, Image.new("RGB", (w, h), (8, 8, 8)), vignette)

    # Subtle noise for texture
    rng = random.Random(42)
    pixels = img.load()
    for _ in range(5000):
        x = rng.randint(0, w - 1)
        y = rng.randint(0, h - 1)
        r, g, b = pixels[x, y]
        noise = rng.randint(-8, 8)
        pixels[x, y] = (
            max(0, min(255, r + noise)),
            max(0, min(255, g + noise)),
            max(0, min(255, b + noise)),
        )

    return img


def generate_featured_image(title, short_title, category, search_query, output_path,
                            font_title, font_category, font_url, doug_karrie, saa_logo):
    """Generate a single featured image."""
    # Search Pexels for background
    photos = search_pexels(search_query)
    if not photos:
        broader = search_query.split()[0]
        photos = search_pexels(broader)
    if not photos:
        photos = search_pexels("real estate office")
    if not photos:
        print("    ERROR: No photos found")
        return None

    # Deterministic photo selection based on title hash
    idx = int(hashlib.md5(title.encode()).hexdigest(), 16) % len(photos)
    photo = photos[idx]
    photo_url = photo["src"]["large2x"]

    # Create background
    img = create_background(photo_url, category, W, H)
    draw = ImageDraw.Draw(img)

    # Gold accent line at top
    draw.rectangle([0, 0, W, 4], fill=GOLD)

    # Category badge (top-left)
    cat_text = category.upper()
    cat_bbox = draw.textbbox((0, 0), cat_text, font=font_category)
    cat_w = cat_bbox[2] - cat_bbox[0]
    badge_x, badge_y = 50, 35
    badge_pad_x = 14
    badge_h = 36
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + cat_w + badge_pad_x * 2, badge_y + badge_h],
        radius=6, fill=(14, 14, 14, 200), outline=GOLD_DIM
    )
    ascent, descent = font_category.getmetrics()
    text_h = ascent + descent
    text_y = badge_y + (badge_h - text_h) // 2
    draw.text((badge_x + badge_pad_x, text_y), cat_text, fill=GOLD, font=font_category)

    # Title text (large, bold, white, left-aligned with word-wrap)
    display_title = short_title or title
    words = display_title.split()
    lines = []
    current = ""
    for word in words:
        test = f"{current} {word}".strip()
        bbox = draw.textbbox((0, 0), test, font=font_title)
        if bbox[2] - bbox[0] > W - 320:
            if current:
                lines.append(current)
            current = word
        else:
            current = test
    if current:
        lines.append(current)

    title_y = 105
    line_spacing = 85
    for i, line in enumerate(lines):
        y = title_y + i * line_spacing
        # Text shadow
        for ox, oy in [(2, 2), (3, 3), (1, 1)]:
            draw.text((50 + ox, y + oy), line, fill=(0, 0, 0), font=font_title)
        draw.text((50, y), line, fill=WHITE, font=font_title)

    # Doug & Karrie (bottom-right)
    if doug_karrie:
        photo_x = W - doug_karrie.width + 40
        photo_y = H - doug_karrie.height + 20
        img.paste(doug_karrie, (photo_x, photo_y), doug_karrie.split()[3])
        draw = ImageDraw.Draw(img)

    # SAA Logo (bottom-left)
    if saa_logo:
        logo_x, logo_y = 50, H - 55
        img.paste(saa_logo, (logo_x, logo_y), saa_logo.split()[3])
        draw = ImageDraw.Draw(img)

    # URL text
    draw.text((142, H - 48), "smartagentalliance.com", fill=GRAY, font=font_url)

    # Bottom gold border
    draw.rectangle([0, H - 3, W, H], fill=GOLD_DIM)

    img.save(output_path, "PNG", optimize=True)
    return output_path


def upload_to_wordpress(image_path, post_id, wp_base="https://wp.saabuildingblocks.com"):
    """Upload image to WordPress and set as featured image."""
    filename = os.path.basename(image_path)

    # Upload via WP REST API
    result = subprocess.run([
        "curl", "-s",
        "-X", "POST",
        f"{wp_base}/wp-json/wp/v2/media",
        "-u", "dougsmart1:OuHo XIDe 3QPD 8uAO oFLJ Ufq0",
        "-H", f"Content-Disposition: attachment; filename={filename}",
        "-H", "Content-Type: image/png",
        "--data-binary", f"@{image_path}",
    ], capture_output=True, text=True)

    try:
        media = json.loads(result.stdout)
        media_id = media.get("id")
        if not media_id:
            print(f"    Upload error: {result.stdout[:300]}")
            return None

        # Set as featured image
        result2 = subprocess.run([
            "curl", "-s",
            "-X", "POST",
            f"{wp_base}/wp-json/wp/v2/posts/{post_id}",
            "-u", "dougsmart1:OuHo XIDe 3QPD 8uAO oFLJ Ufq0",
            "-H", "Content-Type: application/json",
            "-d", json.dumps({"featured_media": media_id}),
        ], capture_output=True, text=True)

        print(f"    Uploaded media ID {media_id}, set as featured for post {post_id}")
        return media_id
    except Exception as e:
        print(f"    Upload error: {e}")
        return None


def main():
    parser = argparse.ArgumentParser(description="Generate SAA blog featured images")
    parser.add_argument("--post-id", type=int, help="WordPress post ID")
    parser.add_argument("--title", help="Full blog title")
    parser.add_argument("--short-title", help="Shortened title for display (2-5 words)")
    parser.add_argument("--category", help="Blog category name")
    parser.add_argument("--query", help="Pexels search query for background")
    parser.add_argument("--upload", action="store_true", help="Upload to WordPress and set as featured")
    parser.add_argument("--preview", action="store_true", help="Open image after generation")
    parser.add_argument("--batch", help="Path to JSON file with post data for batch generation")
    parser.add_argument("--output", help="Custom output path (default: ~/tmp/featured-images/)")
    args = parser.parse_args()

    # Validate
    if not args.batch and not (args.title and args.short_title and args.category and args.query):
        parser.error("Provide --title, --short-title, --category, --query (or --batch for batch mode)")

    # Load assets
    print("Loading assets...")
    font_title = load_font(TASKOR_PATH, 72)
    font_category = load_font(TASKOR_PATH, 22)
    font_url_text = load_font(AMULYA_PATH, 18)

    doug_karrie = None
    dk_path = ASSETS_DIR / "doug-karrie.webp"
    if dk_path.exists():
        doug_karrie = Image.open(dk_path).convert("RGBA")
        ph = 340
        pw = int(doug_karrie.width * (ph / doug_karrie.height))
        doug_karrie = doug_karrie.resize((pw, ph), Image.LANCZOS)
        print(f"  Doug & Karrie: {pw}x{ph}")

    saa_logo = None
    logo_path = PUBLIC_DIR / "infographics" / "saa-logo-gold.png"
    if logo_path.exists():
        saa_logo = Image.open(logo_path).convert("RGBA")
        logo_h = 32
        logo_w = int(saa_logo.width * (logo_h / saa_logo.height))
        saa_logo = saa_logo.resize((logo_w, logo_h), Image.LANCZOS)
        print(f"  SAA Logo: {logo_w}x{logo_h}")

    out_dir = Path(args.output) if args.output else OUTPUT_DIR
    out_dir.mkdir(parents=True, exist_ok=True)

    if args.batch:
        # Batch mode
        with open(args.batch) as f:
            posts = json.load(f)
        print(f"\nBatch generating {len(posts)} images...")
        success = 0
        for i, post in enumerate(posts):
            pid = str(post.get("id", i))
            output_path = out_dir / f"featured-post-{pid}.png"
            if output_path.exists():
                print(f"  [{i+1}/{len(posts)}] SKIP (exists): {post.get('short_title', '')}")
                continue
            print(f"  [{i+1}/{len(posts)}] {post.get('category', 'Unknown')}: {post.get('short_title', '')}")
            try:
                result = generate_featured_image(
                    post["title"], post.get("short_title", post["title"]),
                    post.get("category", "Uncategorized"), post.get("query", "real estate"),
                    str(output_path), font_title, font_category, font_url_text, doug_karrie, saa_logo
                )
                if result:
                    size = os.path.getsize(output_path)
                    print(f"           OK ({size // 1024}KB)")
                    success += 1
                    if args.upload and post.get("id"):
                        upload_to_wordpress(str(output_path), post["id"])
            except Exception as e:
                print(f"           ERROR: {e}")
            if (i + 1) % 10 == 0:
                time.sleep(1)
        print(f"\nDone! Generated {success} images in {out_dir}/")
    else:
        # Single image mode
        output_path = out_dir / f"featured-post-{args.post_id or 'preview'}.png"
        if args.output:
            output_path = Path(args.output)
        print(f"\nGenerating: {args.short_title}")
        result = generate_featured_image(
            args.title, args.short_title, args.category, args.query,
            str(output_path), font_title, font_category, font_url_text, doug_karrie, saa_logo
        )
        if result:
            size = os.path.getsize(output_path)
            print(f"  OK: {output_path} ({size // 1024}KB)")
            if args.upload and args.post_id:
                upload_to_wordpress(str(output_path), args.post_id)
        else:
            print("  FAILED")
            sys.exit(1)


if __name__ == "__main__":
    main()
