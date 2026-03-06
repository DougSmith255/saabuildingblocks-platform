# 404 Triage Process

> Standard procedure for reviewing and resolving 404 paths detected by the 404 Watch system.
> Follow every step — do not guess redirect targets. Verify before deploying.

---

## Overview

When visitors hit a 404 on saabuildingblocks.com, the Cloudflare Worker logs the path to the `http_404_paths` table in Supabase. The 404 Watch tab in Master Controller shows these. Your job is to determine whether each path is:

- **Redirect** — A real page that moved, has a typo, or uses an old URL structure. Deploy a 301 redirect to Cloudflare KV so the edge resolves it instantly (~60s propagation).
- **Junk** — Bot probes, vulnerability scanners, or nonsense paths with no real content behind them.

---

## CRITICAL: Blog URL Structure

**You MUST understand this before triaging any 404.** Getting this wrong is the #1 cause of real blog posts being incorrectly classified as junk.

The site has 308+ blog posts organized by category. Two categories use a **short URL** (no `/blog/` prefix), while all others use a **long URL** (with `/blog/` prefix):

### Short URL categories (NO `/blog/` prefix):
| Category | Live URL Pattern | Example |
|---|---|---|
| `about-exp-realty/` | `/about-exp-realty/{slug}/` | `/about-exp-realty/fees/` |
| `exp-realty-sponsor/` | `/exp-realty-sponsor/{slug}/` | `/exp-realty-sponsor/agent-attraction/` |

### Long URL categories (WITH `/blog/` prefix):
| Category | Live URL Pattern | Example |
|---|---|---|
| `agent-career-info/` | `/blog/agent-career-info/{slug}/` | `/blog/agent-career-info/expenses/` |
| `become-an-agent/` | `/blog/become-an-agent/{slug}/` | `/blog/become-an-agent/license/` |
| `brokerage-comparison/` | `/blog/brokerage-comparison/{slug}/` | `/blog/brokerage-comparison/revenue-share/` |
| `fun-for-agents/` | `/blog/fun-for-agents/{slug}/` | `/blog/fun-for-agents/best-cars/` |
| `industry-trends/` | `/blog/industry-trends/{slug}/` | `/blog/industry-trends/market-trends/` |
| `marketing-mastery/` | `/blog/marketing-mastery/{slug}/` | `/blog/marketing-mastery/golden-principle/` |
| `real-estate-schools/` | `/blog/real-estate-schools/{slug}/` | `/blog/real-estate-schools/schools/` |
| `winning-clients/` | `/blog/winning-clients/{slug}/` | `/blog/winning-clients/referrals/` |

### What this means for 404 triage:

A 404 like `/blog/about-exp-realty/fees/` is **NOT junk** — it's a real blog post at the wrong URL. The correct URL is `/about-exp-realty/fees/` (no `/blog/` prefix). Deploy a redirect.

A 404 like `/about-exp-realty/some-slug/` could also be a real post — search the blog database before marking as junk.

A 404 like `/agent-career-info/expenses/` (missing `/blog/` prefix) is also likely a real post — the correct URL would be `/blog/agent-career-info/expenses/`.

---

## Step 1: Query Unreviewed Paths

```bash
curl -s "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/http_404_paths?status=eq.unreviewed&order=hit_count.desc" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" | python3 -m json.tool
```

Environment variables are in `/home/ubuntu/saabuildingblocks-platform/packages/admin-dashboard/.env.local`.

---

## Step 2: Classify Each Path

For every unreviewed path, determine its category:

### Check if the Page Actually Works Now (before classifying)

Before marking ANY path as redirect or junk, **verify the URL returns 404 right now**:

```bash
curl -sIL "https://smartagentalliance.com/THE_PATH" 2>&1 | grep -E "^(HTTP|location)"
```

If it returns **200**, the 404 was transient - likely logged during development, testing, deploys, or while a feature was being built. Mark as **junk** with a note like "Returns 200 now; transient 404 during testing". No redirect needed.

This is especially common for:
- Agent attraction pages (`/{slug}`) and link pages (`/{slug}-links`) that were being set up
- Pages that temporarily 404'd during a deploy or build cycle
- Test URLs tried from the Agent Portal during development
- Paths that a Cloudflare Function serves dynamically (the function may have been updated since the 404 was logged)

### Immediate Junk (no research needed)

Mark as **junk** without further investigation if the path matches any of these:

- PHP probes: `.php`, `.PhP7`, `.php5`, `.asp`, `.aspx`, `.cgi`
- Vulnerability scanners: `wp-admin`, `wp-login`, `xmlrpc`, `.env`, `/.git/`, `/config`, `/.aws/`, `/_debugbar`, `/debug/`, `/actuator/`, `/swagger`, `/telescope`
- API probes: `/v2/api-docs`, `/v3/api-docs`, `/api/config`, `/api/settings`, `/api/stripe/`
- JS file probes: `/bundle.js`, `/vendor.js`, `/main.js`, `/app.js`, `/index.js`, `/constants.js`, `/env.js`, `/__env.js`, `/config.js`, `/stripe.js`, `/checkout.js`, `/payment.js`
- Random strings: UUIDs, hex strings, base64-looking paths with no semantic meaning
- Known bot patterns: `/feed/`, `/?p=`, `/trackback/`, `/comment-page-`
- File extension probes: `.zip`, `.sql`, `.bak`, `.tar.gz`, `.rar`, `.wmv`, `.mov` (with hex filenames)
- E-commerce probes: `/checkout`, `/my-account/`, `/cart`
- Encoded URL garbage: paths containing `%22%22`, full URLs embedded in paths, article text embedded in URLs

### MANDATORY: Search Before Marking Junk

**If a path contains English words that could be a blog topic, you MUST search the blog database before marking it as junk.** This is non-negotiable. The following patterns should ALWAYS trigger a blog search:

- Any path containing category-like segments: `about-exp-realty`, `exp-realty-sponsor`, `agent-career-info`, `marketing-mastery`, `become-an-agent`, `real-estate-schools`, `fun-for-agents`, `brokerage-comparison`, `industry-trends`, `winning-clients`
- Any path that reads like a blog title: `top-10-...`, `how-to-...`, `best-...`, `guide-to-...`
- Any path with real-estate keywords: `agent`, `realty`, `brokerage`, `commission`, `revenue-share`, `leads`, `license`, `marketing`
- Any path with the `/blog/` prefix — this is ALWAYS a blog post attempt

**Common traps that look like junk but are real blog posts:**
- `/blog/about-exp-realty/some-slug/` → Real post, just needs `/blog/` stripped
- `/some-old-wordpress-slug` → Could match a blog post by its WordPress slug field
- `/category/slug` where category is wrong → Search by slug alone, post may exist under different category
- Truncated or misspelled slugs → Search by partial keyword match

---

## Step 3: Find the Correct Target (DO NOT GUESS)

### 3a. Search the Blog Post Database

All 308+ blog posts are stored in JSON chunk files. Search by keyword, slug, or partial path:

```bash
for f in /home/ubuntu/saabuildingblocks-platform/packages/public-site/public/blog-posts-chunk-*.json; do
  python3 -c "
import json
with open('$f') as fh:
    data = json.load(fh)
for p in data:
    uri = p.get('customUri','')
    slug = p.get('slug','')
    title = p.get('title','')
    # Replace KEYWORD with your search term (lowercase)
    if 'KEYWORD' in uri.lower() or 'KEYWORD' in slug.lower() or 'KEYWORD' in title.lower():
        print(f'customUri: {uri}')
        print(f'slug: {slug}')
        print(f'title: {title}')
        print('---')
" 2>/dev/null
done
```

**Blog post categories (customUri prefixes):**
- `about-exp-realty/` — eXp Realty explainers **(NO /blog/ prefix in live URL)**
- `exp-realty-sponsor/` — Sponsorship and revenue share **(NO /blog/ prefix in live URL)**
- `agent-career-info/` — Career advice (uses /blog/ prefix)
- `become-an-agent/` — Getting started guides (uses /blog/ prefix)
- `brokerage-comparison/` — Brokerage comparisons (uses /blog/ prefix)
- `fun-for-agents/` — Entertainment/lifestyle (uses /blog/ prefix)
- `industry-trends/` — Market trends (uses /blog/ prefix)
- `marketing-mastery/` — Marketing tips (uses /blog/ prefix)
- `real-estate-schools/` — Education (uses /blog/ prefix)
- `winning-clients/` — Client acquisition (uses /blog/ prefix)

### 3b. Build the Correct URL from the customUri

Once you find a matching blog post, build the correct live URL:

```
If customUri starts with "about-exp-realty/" or "exp-realty-sponsor/":
  → Live URL = /{customUri}/

If customUri starts with anything else:
  → Live URL = /blog/{customUri}/
```

**Common mismatch patterns:**
- 404 has `/blog/about-exp-realty/X/` → Redirect to `/about-exp-realty/X/` (strip `/blog/`)
- 404 has `/blog/exp-realty-sponsor/X/` → Redirect to `/exp-realty-sponsor/X/` (strip `/blog/`)
- 404 has `/agent-career-info/X/` → Redirect to `/blog/agent-career-info/X/` (add `/blog/`)
- 404 has `/blog/uncategorized/X/` → Search for post, it was recategorized (e.g., `uncategorized/expenses` → `agent-career-info/expenses`)
- Path says `about-exp-realty/` but actual customUri is `exp-realty-sponsor/` (or vice versa)
- Old WordPress slug differs from current customUri (search by slug field, not just customUri)
- Dated slugs like `revenue-share-2024` map to undated articles like `revenue-share`
- Truncated URLs (e.g., `revenos` should be `revenos-leads`)
- Misspellings (e.g., `aliance` should be `alliance`, `revenous` should be `revenos`)

### 3c. Check Static Pages

These are the top-level routes on the public site:

```
/about-doug-smart      /about-karrie-hill     /awards
/best-real-estate-brokerage  /blog            /book-a-call
/cookie-policy         /disclaimer            /doug-linktree
/download              /exp-commission-calculator
/exp-realty-revenue-share-calculator
/exp-realty-sponsor    /freebies              /karrie-linktree
/locations             /our-exp-team          /privacy-policy
/terms-of-use
```

Watch for `-desktop` or `-mobile` suffixed paths — these are often old ad landing page variants that should redirect to the main page (e.g., `/exp-realty-revenue-share-calculator-desktop` → `/exp-realty-revenue-share-calculator/`).

### 3d. Check Freebies

Freebie assets are referenced in:
```
/home/ubuntu/saabuildingblocks-platform/packages/public-site/app/freebies/page.tsx
```

### 3e. Check WordPress Media (for asset 404s like PDFs, images)

```bash
wp db query "SELECT guid FROM wp_posts WHERE post_type='attachment' AND guid LIKE '%KEYWORD%'" --path=/var/www/wordpress/
```

### 3f. Verify the Target URL Actually Works

**ALWAYS verify before deploying a redirect:**

```bash
curl -sIL "https://saabuildingblocks.com/TARGET_PATH" 2>&1 | grep -E "^(HTTP|location)"
```

The final response MUST be `HTTP/2 200`. If it's a 404, your target is wrong — keep searching.

---

## Step 4: Deploy Redirects to Cloudflare KV

For each confirmed redirect, write to KV for both with and without trailing slash:

```bash
ACCOUNT_ID="(from .env.local: CLOUDFLARE_ACCOUNT_ID)"
NAMESPACE_ID="(from .env.local: REDIRECT_OVERRIDES_KV_NAMESPACE_ID)"
API_TOKEN="(from .env.local: CLOUDFLARE_API_TOKEN)"

# Deploy both slash variants
for kvPath in "/source-path" "/source-path/"; do
  curl -s -X PUT \
    "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/$(python3 -c "import urllib.parse; print(urllib.parse.quote('$kvPath', safe=''))")" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -H "Content-Type: text/plain" \
    --data "/target-path"
done
```

---

## Step 5: Update Supabase Status

After deploying (or marking as junk), update the database:

```bash
curl -s -X PATCH \
  "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/http_404_paths?id=eq.ID" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{
    "status": "redirect",
    "redirect_target": "/target-path",
    "reviewed_at": "ISO_TIMESTAMP",
    "reviewed_by": "admin"
  }'
```

For junk entries, use `"status": "junk"` and include a `"notes"` field explaining why (e.g., "PHP vulnerability probe", "Bot appending random suffix to valid page").

---

## Step 6: Verify Clean

Confirm zero unreviewed entries remain:

```bash
curl -s "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/http_404_paths?status=eq.unreviewed&select=id,path" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
```

Should return `[]`.

---

## When You're Not Sure

If a path looks like it could be real content but you can't find a matching page:

1. **Ask the user** — describe the path and what you found (or didn't find)
2. **Check the referrer** — if it came from `smartagentalliance.com` or `saabuildingblocks.com`, someone clicked a real link
3. **Check the user agent** — bots (Amazonbot, Googlebot, SERankingBot, etc.) often crawl stale links; real users have Chrome/Safari/Firefox UAs
4. **Check hit count** — high hit count with real user agents = real broken link that needs fixing

Never deploy a redirect unless you've verified the target returns HTTP 200.

---

## Quick Reference: User Agent Patterns

| User Agent Contains | Type |
|---|---|
| `Googlebot`, `Bingbot`, `Amazonbot` | Search engine crawler |
| `SERankingBot`, `AhrefsBot`, `SemrushBot` | SEO tool |
| `meta-externalagent`, `facebookexternalhit` | Social media crawler |
| `RSiteAuditor`, `DotBot`, `MJ12bot` | SEO audit bot |
| `ChatGPT-User`, `OAI-SearchBot` | OpenAI crawler |
| `GoogleOther` | Google secondary crawler |
| `l9scan`, `leakix.net` | Vulnerability scanner |
| No user agent at all | Usually vulnerability scanner |
| Chrome/Safari/Firefox (normal version) | Real user |
| Chrome with very old version (e.g., 103, 107, 108, 109, 110, 111) | Often a bot spoofing |
| Firefox 3.6, Firefox 47 | Ancient browser = definitely a bot |
| `curl/` | Manual testing or bot |

---

## Triage Checklist (Quick Reference)

Before marking ANY 404 as junk, confirm ALL of these:

- [ ] Path does NOT contain recognizable English words related to real estate, agents, or eXp Realty
- [ ] Path does NOT start with `/blog/`, `/about-exp-realty/`, or `/exp-realty-sponsor/`
- [ ] Path does NOT match any blog post slug (searched the blog database)
- [ ] Path does NOT match any static page or a `-desktop`/`-mobile` variant of one
- [ ] Path matches a known junk pattern (scanner probe, file extension probe, random string, etc.)

If you cannot confirm all five, **investigate further before marking as junk.**
