# smartagentalliance.com Migration Checklist

> Migrating from old WordPress site to new Next.js static site on Cloudflare Pages
> Old site: smartagentalliance.com (WordPress.com, proxied through Cloudflare)
> New site: saabuildingblocks.pages.dev (Cloudflare Pages)
> Created: 2026-02-18

---

## Status Key
- [ ] Not started
- [x] Complete

---

## Phase 1: Code & Config Changes (before build)

- [x] Blog posts synced — 306 posts, titles verified against old site
- [x] Authors assigned — Doug (94 posts: Real Estate Schools, Brokerage Comparison, Become an Agent), Karrie (214 posts: all others)
- [x] Custom URIs integrated into build system (generate-blog-posts-json.ts, page.tsx, types.ts)
- [x] Redirect map built — 1,213 rules (929 page/blog + 284 featured images)
- [x] GSC cross-referenced — all 579 URLs Google knows about are covered
- [x] Update `robots.txt` — changed `Disallow: /` to `Allow: /`, kept AI scraper blocks, added sitemap
- [x] Update `NEXT_PUBLIC_SITE_URL` to `https://smartagentalliance.com` in:
  - `packages/public-site/.env.local` (line 8)
  - `packages/public-site/next.config.ts` (line 82, fallback value)
  - `packages/public-site/lib/api-config.ts` (line 23, fallback value)
- [x] Verify `next-sitemap.config.js` siteUrl is `https://smartagentalliance.com` (already correct)
- [ ] Commit all code changes to git and push to GitHub
  - Uncommitted: blog post JSONs, types.ts, page.tsx, generate-blog-posts-json.ts, and many other files

---

## Phase 2: Fix Redirect Files

The redirect CSV at `/tmp/all-redirects-combined.csv` needs fixes before Cloudflare upload:

- [x] Remove header row (Cloudflare CSV must have NO headers)
- [x] Remove wildcard entries (8 entries with `*` — wildcards NOT supported in Bulk Redirects)
- [x] Fix target URLs — 933 targets were relative paths, now all absolute URLs
- [x] No self-redirects found (0 removed)
- [x] Saved corrected CSV to `/tmp/cloudflare-bulk-redirects-final.csv` (1,205 rules)

Wildcard catch-all rules (set up as Cloudflare Single Redirect Rules, NOT bulk):
- `/wp-content/uploads/*` → `https://smartagentalliance.com/` (homepage)
- `/wp-admin/*` → `https://smartagentalliance.com/`
- `/wp-login.php` → `https://smartagentalliance.com/`
- `/feed/*` → `https://smartagentalliance.com/blog/`

**IMPORTANT: Single Redirect Rules execute BEFORE Bulk Redirects.** This means the `/wp-content/uploads/*` catch-all will intercept the 284 featured image redirects before they reach Bulk Redirects. Two options:
  - Option A: Put featured image redirects in the `_redirects` file (up to 2,000 rules supported)
  - Option B: Skip the `/wp-content/uploads/*` catch-all and let unmatched images 404

---

## Phase 3: Build & Test

- [ ] Run fresh build: `cd packages/public-site && npm run build`
- [ ] Deploy to staging: `npx wrangler pages deploy out --project-name=saabuildingblocks`
- [ ] Verify on saabuildingblocks.pages.dev:
  - [ ] Homepage loads correctly
  - [ ] Blog listing page works (`/blog/`)
  - [ ] Sample blog posts load (check 5-10 across different categories)
  - [ ] Sitemap accessible at `/sitemap.xml` with smartagentalliance.com URLs
  - [ ] robots.txt allows crawling
  - [ ] All page sections working (calculators, team page, etc.)

---

## Phase 4: Cloudflare Redirect Setup (before DNS change)

- [ ] Check Cloudflare plan's Bulk Redirect quota
  - Free plan may be limited to 20 redirects (known bug — many free accounts stuck at old limit)
  - If limited, either upgrade to Pro ($20/mo) OR use `_redirects` file (supports 2,000 static rules)
- [ ] Upload Bulk Redirect CSV to Cloudflare:
  - Dashboard → Account Home → Bulk Redirects → Create list
  - Name: `saa-migration-redirects`
  - Upload corrected CSV (no headers, full URLs, no wildcards)
- [ ] Create Bulk Redirect Rule:
  - Rule name: `SAA WordPress Migration Redirects`
  - Expression: `http.request.full_uri in $saa-migration-redirects`
- [ ] Create Single Redirect Rules for wildcards:
  - Dashboard → smartagentalliance.com zone → Rules → Redirect Rules
  - `/wp-content/uploads/*` → homepage (301)
  - `/wp-admin/*` → homepage (301)
  - `/wp-login.php` → homepage (301)
  - `/feed/*` → `/blog/` (301)

---

## Phase 5: DNS & Domain Switch

### Before the switch — save current DNS records:
```
Current A records: 104.26.4.92, 104.26.5.92, 172.67.73.96
MX: smartagentalliance-com.mail.protection.outlook.com (priority 0)
TXT: v=spf1 include:spf.protection.outlook.com include:_spf.mlsend.com ~all
TXT: MS=ms55665405
TXT: brevo-code:7aa20c73069dd2468bb4e2c05f15b718
TXT: openai-domain-verification=dv-oHKFPd656Dnd6UFAb6ZuHPNz
```

### The switch:
- [ ] Add `smartagentalliance.com` as custom domain in Cloudflare Pages dashboard
  - Workers & Pages → saabuildingblocks → Custom domains → Set up a domain
  - Do NOT manually create CNAME first — go through Pages dashboard
- [ ] Add `www.smartagentalliance.com` as custom domain too
- [ ] Wait for SSL certificate provisioning (1-15 minutes)
- [ ] Set up www → apex redirect (Redirect Rule in Cloudflare)
- [ ] Purge Cloudflare cache: Dashboard → Caching → Configuration → Purge Everything

---

## Phase 6: Post-Switch Verification

- [ ] Verify site loads: `curl -sI https://smartagentalliance.com`
- [ ] Verify HTTPS works
- [ ] Verify www redirects to apex: `curl -sI https://www.smartagentalliance.com`
- [ ] Verify email MX records intact: `dig smartagentalliance.com MX +short`
- [ ] Send test email to/from @smartagentalliance.com
- [ ] Test 50+ redirects from the CSV (sample old URLs)
- [ ] Verify blog posts load
- [ ] Verify sitemap at `https://smartagentalliance.com/sitemap.xml`
- [ ] Verify Plausible analytics script loads on pages

---

## Phase 7: Google Search Console

- [ ] Submit new sitemap: GSC → Sitemaps → `https://smartagentalliance.com/sitemap.xml`
- [ ] Request indexing for top 10 pages via URL Inspection tool
- [ ] Do NOT use "Change of Address" tool (same domain, not needed)
- [ ] Do NOT click "Validate" on existing issues yet — wait for Google to recrawl
- [ ] Monitor Coverage report daily for 2 weeks

---

## Phase 8: Ongoing Monitoring (weeks 1-4)

- [ ] Daily: Check GSC Coverage for new 404s
- [ ] Daily: Check Cloudflare Analytics for 404 patterns
- [ ] Weekly: Compare search performance to pre-migration baseline
- [ ] Weekly: Check Core Web Vitals in GSC
- [ ] After 30 days: Review if old WordPress.com subscription can be cancelled
- [ ] Keep old WordPress.com site alive for 30-90 days as backup (it won't receive traffic)

---

## Email Records — DO NOT TOUCH

These DNS records must be preserved during migration. Adding a Pages custom domain only changes the A/CNAME record, NOT these:

| Type | Name | Value |
|------|------|-------|
| MX | @ | smartagentalliance-com.mail.protection.outlook.com |
| TXT | @ | SPF record for Outlook + Mailsend |
| TXT | @ | MS=ms55665405 (Microsoft verification) |
| TXT | @ | brevo-code verification |
| TXT | @ | openai-domain-verification |
| CNAME | selector1._domainkey | Microsoft DKIM (verify exists) |
| CNAME | selector2._domainkey | Microsoft DKIM (verify exists) |

---

## Rollback Plan

If something goes critically wrong:
1. Remove `smartagentalliance.com` from Pages custom domains
2. Re-add old A records: `104.26.4.92`, `104.26.5.92`, `172.67.73.96`
3. DNS changes are near-instant since domain is already on Cloudflare nameservers

---

## Key Files

| File | Location | Purpose |
|------|----------|---------|
| Page/blog redirects | `/tmp/cloudflare-redirects-final.json` | 961 page/blog redirect rules |
| GSC extra redirects | `/tmp/gsc-extra-redirects.json` | 65 additional redirects from GSC analysis |
| Featured image redirects | `/tmp/featured-image-redirects.json` | 272 featured image redirect rules |
| Combined redirects | `/tmp/all-redirects-combined.json` | All 1,213 redirects merged |
| Combined CSV | `/tmp/all-redirects-combined.csv` | CSV format (NEEDS FIXES — see Phase 2) |
| Old featured image mapping | `/tmp/slug-to-old-featured-image.json` | Post slug → old WP image URL |
| Old site export | `/tmp/old-site-export.csv` | 276 posts with Rank Math data |
| GSC data | `/tmp/gsc-all/` | All Google Search Console CSV exports |

---

## Notes

- The domain is already on Cloudflare nameservers (garret.ns.cloudflare.com, deborah.ns.cloudflare.com) so DNS changes are instant
- Plausible analytics already tracks smartagentalliance.com — no change needed
- wp.saabuildingblocks.com (headless CMS) must continue running — it is NOT the old site
- The user mentioned having "a few other changes to deal with" before final migration
