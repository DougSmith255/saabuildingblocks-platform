# Domain Migration: saabuildingblocks → smartagentalliance

Quick reference for switching domains. All instances found via codebase scan.

## Domains to Map

| Old | New | Purpose |
|-----|-----|---------|
| saabuildingblocks.com | smartagentalliance.com | Main/VPS |
| saabuildingblocks.pages.dev | smartagentalliance.pages.dev | Cloudflare Pages |
| wp.saabuildingblocks.com | wp.smartagentalliance.com | WordPress |
| cdn.saabuildingblocks.com | cdn.smartagentalliance.com | R2 cache worker |
| assets.saabuildingblocks.com | assets.smartagentalliance.com | R2 storage |
| r2.saabuildingblocks.com | r2.smartagentalliance.com | R2 direct (category images) |
| plausible.saabuildingblocks.com | plausible.smartagentalliance.com | Analytics |
| n8n.saabuildingblocks.com | n8n.smartagentalliance.com | Workflow automation |
| staging.saabuildingblocks.com | staging.smartagentalliance.com | Preconnect hint |
| noreply@saabuildingblocks.com | noreply@smartagentalliance.com | Email sender |

## Cloudflare Settings (manual)

- Cloudflare Pages project name: `saabuildingblocks` → create new or rename
- R2 bucket name: `saabuildingblocks-assets` → keep or create new + migrate objects
- KV namespace: `AGENT_PAGES` (ID: 9f886b7add144cc480d7fe0f4ef5eb5e) — no rename needed
- Pages env vars: `VPS_API_URL` → update to new VPS domain
- Workers routes: update zone_name and pattern in all wrangler.toml files
- DNS: set up all subdomains (wp, cdn, assets, r2, plausible, n8n) on new domain
- Custom domain: add smartagentalliance.com to Pages project

## Env Files (3 files)

- `packages/admin-dashboard/.env.local` — NEXT_PUBLIC_SITE_URL, NEXTAUTH_URL, NEXT_PUBLIC_APP_URL, WORDPRESS_URL, R2_PUBLIC_URL, R2_BUCKET_NAME
- `packages/admin-dashboard/.env.local.full` — same vars
- `packages/admin-dashboard/.env.example` — NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_API_URL, SMTP_USER
- Root `.env.local` — mirrors admin-dashboard

## Config Files

- `packages/public-site/next.config.ts` — wp hostname, fallback URLs (lines 49, 82-83)
- `packages/admin-dashboard/next.config.ts` — wp hostname, fallback URLs (lines 23, 31-32)
- `packages/public-site/next-sitemap.config.js` — siteUrl fallback
- `packages/public-site/wordpress-sites-config.json` — wp URL
- `packages/admin-dashboard/ecosystem.config.js` — GITHUB_REPO name

## Wrangler Configs (4 files)

- Root `wrangler.toml` — project name, bucket_name
- `packages/public-site/wrangler.toml` — project name (via deploy commands)
- `packages/admin-dashboard/workers/r2-cache/wrangler.toml` — bucket_name, route patterns, zone_name
- `packages/admin-dashboard/workers/background-removal/wrangler.toml` — ALLOWED_ORIGINS, route pattern, zone_name
- `workers/wrangler.toml` (image optimizer) — name, route patterns, zone_name

## GitHub Actions

- `.github/workflows/deploy-cloudflare.yml` — CLOUDFLARE_PROJECT_NAME, LIVE_URL verification, deploy command

## Code Files (critical)

- `packages/public-site/lib/api-config.ts` — API_URL, SITE_URL, CDN_URL, WP_API_URL fallbacks
- `packages/public-site/lib/wordpress/api.ts` — WORDPRESS_URL fallback
- `packages/public-site/lib/wordpress/pages-api.ts` — WORDPRESS_URL fallback
- `packages/public-site/lib/wordpress/blog-api.ts` — WORDPRESS_URL fallback
- `packages/public-site/components/blog/ShareButtons.tsx` — hardcoded share URL
- `packages/public-site/components/blog/Breadcrumbs.tsx` — schema.org markup URL
- `packages/public-site/app/layout.tsx` — Plausible analytics domain + script src
- `packages/public-site/app/page.tsx` — SecondaryButton href (pages.dev link)
- `packages/public-site/app/components/PerformanceHints.tsx` — preconnect hints
- `packages/admin-dashboard/lib/cloudflare-r2.ts` — bucket name, CDN URL
- `packages/admin-dashboard/lib/github-actions-client.ts` — repo name fallback
- `packages/admin-dashboard/components/Header.tsx` — nav links (lines 17-34, 217, 345, 514)
- `packages/admin-dashboard/components/Footer.tsx` — footer links
- `packages/admin-dashboard/app/agent-portal/page.tsx` — assets→cdn domain transform

## Cloudflare Functions (INLINED — no imports)

- `packages/public-site/functions/[slug].js` — Plausible analytics, font URLs, CSP headers, pages.dev refs
- `packages/public-site/functions/_middleware.js` — CSP frame-ancestors
- `packages/public-site/functions/api/join-team.js` — VPS_API_URL fallback

## Email Templates

- `packages/admin-dashboard/templates/base-email-template-external.html` — font URLs (assets.saabuildingblocks.com)
- `packages/admin-dashboard/templates/base-email-template-team.html` — font URLs
- `packages/admin-dashboard/lib/email/send.ts` — baseUrl fallback (6 places)
- `packages/admin-dashboard/lib/email/templates/components/Layout.tsx` — logo URL
- `packages/admin-dashboard/lib/email/templates/ApplyInstructionsEmail.tsx` — logo URL

## R2/Category Images

- `packages/admin-dashboard/app/category/configs/category-configs.ts` — 12 image URLs using r2.saabuildingblocks.com

## Supabase

- `packages/admin-dashboard/supabase/migrations/20251030100000_populate_token_vault.sql` — bucket name, assets URL in encrypted values
- Token vault entries may reference old domain — run UPDATE queries after migration

## Static Files

- `packages/public-site/public/robots.txt` — has comment "Remove this file when switching to smartagentalliance.com"

## Scripts (low priority — not runtime)

- 40+ test/perf scripts reference pages.dev URLs
- Migration scripts reference wp.saabuildingblocks.com
- Can batch-update with find/replace after critical files done

## Apache/VPS Config (outside repo)

- Apache vhost config — ServerName, ProxyPass rules
- SSL certificate — new cert for smartagentalliance.com
- PM2 ecosystem — verify NEXTAUTH_URL points to new domain
- WordPress wp-config.php — WP_HOME, WP_SITEURL

## DNS Records Needed

- A record: smartagentalliance.com → VPS IP
- CNAME: wp → VPS
- CNAME: cdn → R2 worker or custom domain
- CNAME: assets → R2 custom domain
- CNAME: r2 → R2 custom domain
- CNAME: plausible → plausible server
- CNAME: n8n → VPS
- Pages custom domain setup

## Migration Order

1. Set up DNS records on new domain
2. SSL certs (Cloudflare handles Pages, certbot for VPS)
3. Update env files
4. Find-replace in code files
5. Update Cloudflare Pages project (custom domain or new project)
6. Update wrangler configs + redeploy workers
7. Update Apache vhost
8. Update WordPress URLs
9. Deploy admin-dashboard (pm2 restart)
10. Deploy public-site (wrangler pages deploy)
11. Update GitHub Actions workflow
12. Test everything
13. Set up redirects from old domain → new domain
14. Remove robots.txt disallow (currently blocking indexing)
