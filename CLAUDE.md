# Smart Agent Alliance - Project Configuration

> **Single source of truth for infrastructure, architecture, and development.**
> Last verified: 2026-02-27

## Project Overview

Smart Agent Alliance (SAA) is a real estate technology platform for eXp Realty agents. It uses a dual-deployment architecture from a single monorepo:

- **Master Controller** - Admin dashboard for site management (typography, colors, users, analytics)
- **Agent Portal** - User-facing app where agents access tools, templates, courses, and manage their pages
- **Public Site** - Static marketing site deployed to Cloudflare Pages

**Repository:** `https://github.com/DougSmith255/saabuildingblocks-platform.git`
**Branch:** `main`
**Monorepo root:** `/home/ubuntu/saabuildingblocks-platform`

---

## Three Main Applications

### 1. Master Controller (admin-only)
**URL:** `https://saabuildingblocks.com/master-controller`
**Package:** `packages/admin-dashboard/app/master-controller/`
**Purpose:** Admin tool for managing the platform

**6 Tabs** (URL-based: `?tab=<TabId>`):
| Tab | TabId | Purpose |
|-----|-------|---------|
| Web Settings | `web-settings` | Typography, colors, spacing, templates, components |
| Automations | `automations` | Email automation schedules, templates, triggers |
| Users | `users` | User management, role assignments, activation |
| Analytics | `analytics` | Video analytics, Cloudflare Stream views, metrics |
| 404 Watch | `triage` | 404 error tracking, redirect management |
| Suggestions | `suggestions` | User feedback and suggestions |

### 2. Agent Portal (user-facing)
**URL:** `https://saabuildingblocks.com/agent-portal` (served from VPS via Apache proxy)
**Package:** `packages/public-site/app/agent-portal/page.tsx` (~813KB single-page app)
**Purpose:** The app agents use daily - tools, templates, team calls, link pages, courses

**Architecture:** Single large page.tsx with React state toggling sections (NOT separate routes).

**Sections** (SectionId type):
`'onboarding' | 'dashboard' | 'market-stats' | 'calls' | 'templates' | 'courses' | 'production' | 'new-agents' | 'agent-page' | 'linktree' | 'support' | 'profile' | 'download'`

**Nav menu (in order):** Onboarding, Analytics, Get Support, Link Page, Agent Attraction, Team Calls, Templates, Elite Courses, Landing Pages, New Agents, Download App

**Related pages (also in public-site):**
- `/agent-portal/activate/page.tsx` - Account activation for new agents
- `/agent-portal/login/page.tsx` - Agent login

### 3. Admin RBAC Portal (do NOT confuse with Agent Portal)
**URL:** `https://saabuildingblocks.com/agent-portal` (same URL, different package)
**Package:** `packages/admin-dashboard/app/agent-portal/`
**Purpose:** Admin role/user management (RBAC) - NOT the portal agents use

This is the admin-dashboard's agent-portal route. It has its own pages for roles, users, and activity logs. It exists at the same URL path as the public-site agent portal, so Apache routing determines which one serves.

---

## Tech Stack

| Technology | Version | Notes |
|---|---|---|
| Node.js | 20.20.0 | Required >=20.0.0 |
| Next.js | 16.1.6 | App Router, React Compiler enabled |
| React | 19.2.4 | Server Components, Server Actions |
| Tailwind CSS | 4.1.x | CSS-first config, `@import` syntax |
| TypeScript | 5.9.3 | Strict mode |
| Supabase | Latest | Auth, Database, Storage, Realtime (see SQL access below) |
| WordPress | 6.9.1 | Blog CMS at wp.saabuildingblocks.com |

**Before writing code, check latest docs:**
```
mcp__context7__resolve-library-id { "libraryName": "nextjs" }
mcp__context7__query-docs { "libraryId": "...", "query": "..." }
```

---

## Supabase SQL Access (Migrations & Queries)

**Management API token** (`SUPABASE_ACCESS_TOKEN`) is stored in `packages/admin-dashboard/.env.local`. This is a personal access token (PAT) that never expires.

To run SQL migrations or ad-hoc queries against the Supabase database:

```bash
cd /home/ubuntu/saabuildingblocks-platform/packages/admin-dashboard
SUPABASE_ACCESS_TOKEN=$(grep '^SUPABASE_ACCESS_TOKEN=' .env.local | cut -d= -f2)

# Execute SQL via Management API
curl -s -X POST "https://api.supabase.com/v1/projects/edpsaqcsoeccioapglhi/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT 1 AS test;"}'
```

For applying migration files:
```bash
SQL=$(cat supabase/migrations/FILENAME.sql)
curl -s -X POST "https://api.supabase.com/v1/projects/edpsaqcsoeccioapglhi/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SQL" | jq -Rs .)}"
```

---

## Monorepo Structure

```
/home/ubuntu/saabuildingblocks-platform/
├── packages/
│   ├── public-site/        # Static site + Agent Portal → Cloudflare Pages
│   │   ├── app/            # Next.js App Router (30 pages)
│   │   │   └── agent-portal/  # User-facing agent portal
│   │   ├── components/     # Page-specific components
│   │   ├── functions/      # Cloudflare Functions (NOT Next.js)
│   │   ├── out/            # Static export output (~696MB)
│   │   ├── lib/            # Utilities, WordPress API, auth
│   │   ├── scripts/        # Build scripts (generate-css, sync-images, etc.)
│   │   └── public/         # Static assets, static-master-controller.css
│   │
│   ├── admin-dashboard/    # Dynamic site → VPS PM2 (port 3002)
│   │   ├── app/
│   │   │   ├── api/        # 114 API route files
│   │   │   ├── master-controller/  # Admin dashboard (6 tabs)
│   │   │   ├── agent-portal/       # Admin RBAC (users/roles)
│   │   │   └── login/
│   │   ├── components/
│   │   ├── lib/
│   │   └── supabase/       # Migrations and types
│   │
│   ├── shared/             # Shared components and utilities
│   │   ├── components/
│   │   │   ├── saa/        # SAA component library (19 categories, 60+ files)
│   │   │   └── ui/         # Radix UI primitives
│   │   ├── lib/            # Supabase client, typography, utils
│   │   └── types/          # Shared TypeScript types
│   │
│   └── social-poster/      # Social media automation (in development)
│
├── .github/workflows/      # CI/CD pipelines
├── ecosystem.config.js     # PM2 configuration
└── CLAUDE.md               # This file
```

---

## Services & Ports

| Port | Service | Status | Description |
|------|---------|--------|-------------|
| 22 | SSH | Running | Remote access (only externally open port via UFW) |
| 80 | Apache | Running | HTTP (behind Cloudflare Tunnel) |
| 443 | Apache | Running | HTTPS + reverse proxy (behind Cloudflare Tunnel) |
| 3002 | admin-dashboard | Running | PM2: `nextjs-saa` (2 cluster workers), proxied via Apache |
| 3306 | MariaDB | Running | MySQL database (WordPress) |
| 7000 | rembg | Running | Docker, AI background removal |
| 8000 | Plausible CE | Running | Docker, analytics dashboard |

**Firewall (UFW):** Only port 22 (SSH) is open. Ports 80/443 are NOT in UFW - all HTTP/HTTPS traffic flows through Cloudflare Tunnel. Port 3002 is explicitly denied.

### Cloudflare Tunnel

All web traffic to the VPS is routed through Cloudflare Tunnel (`saa-vps`), eliminating direct exposure of ports 80/443.

| Hostname | Tunnel Target | Service |
|---|---|---|
| `saabuildingblocks.com` | `https://localhost:443` | Apache - admin dashboard / Cloudflare Pages |
| `plausible.saabuildingblocks.com` | `http://localhost:8000` | Plausible CE analytics |
| `wp.saabuildingblocks.com` | `https://localhost:443` | Apache - WordPress |

**Tunnel details:**
- **Name:** `saa-vps`
- **ID:** `bd3a0ed0-0bac-45fe-8a06-c8db9dc41cf7`
- **Service:** `cloudflared.service` (systemd, auto-starts on boot)
- **Config:** Remotely managed via Cloudflare dashboard/API (not local config file)
- **Cloudflare account email:** `doug@smartagentalliance.com`

```bash
# Check tunnel status
sudo systemctl status cloudflared

# View tunnel logs
sudo journalctl -u cloudflared --since "5 minutes ago"

# Restart tunnel
sudo systemctl restart cloudflared
```

---

## PM2 Process Management

PM2 runs under the `ubuntu` user.

**Note:** The running process is named `nextjs-saa` (not `admin-dashboard` as ecosystem.config.js defines). Use `nextjs-saa` for all pm2 commands.

**Cluster mode:** Runs 2 workers via Next.js standalone output + PM2 cluster mode. `pm2 reload` does a rolling restart (zero downtime) - it starts new workers, waits for them to listen, then kills old ones. Always use `reload` instead of `restart`.

```bash
# Check status
pm2 list

# Zero-downtime reload (rolling restart)
pm2 reload nextjs-saa

# View logs
pm2 logs nextjs-saa --lines 50 --nostream
```

---

## Dual Deployment Architecture

### Public Site - Cloudflare Pages

**URL:** https://saabuildingblocks.pages.dev (CDN direct)
**Custom domain:** https://smartagentalliance.com (Cloudflare Pages custom domain, NOT routed through VPS)
**Also proxied via:** https://saabuildingblocks.com (Apache sends non-admin traffic to Cloudflare Pages)
**Config:** `next.config.ts` has `output: 'export'` (static HTML)

```bash
# Build and deploy public site
cd /home/ubuntu/saabuildingblocks-platform/packages/public-site
npm run build
npx wrangler pages deploy out --project-name=saabuildingblocks
```

**What deploys:** Homepage, about pages, blog, calculators, freebies, Agent Portal UI, link pages, Cloudflare Functions
**What does NOT deploy:** API routes, Master Controller UI, authentication backend, admin RBAC

**Redirects:** Three layers (evaluated in this order):
1. **Cloudflare Redirect Rules** (zone-level, runs first) - `wp-content/uploads`, `wp-admin`, `wp-login.php`, `feed`, `www→apex`. Managed via Cloudflare API with `CLOUDFLARE_TOKEN_MGMT` (Bulk Redirect Management token). The middleware does NOT run for paths that don't match a Function route, so these rules are the only option for redirecting static-asset-like paths (`.png`, `.js`, etc.).
2. **Middleware KV** (`REDIRECT_OVERRIDES`) - Dynamic redirects deployed from 404 Watch via `/api/404-paths/deploy-redirect`. Only works for paths without file extensions.
3. **Middleware static/wildcard maps** - Hardcoded in `functions/_middleware.js` (STATIC_REDIRECTS + WILDCARD_REDIRECTS).
Do NOT use a `_redirects` file.

### Admin Dashboard - VPS PM2

**URL:** https://saabuildingblocks.com (admin paths proxied by Apache to port 3002)
**Apache proxied paths:** `/api/`, `/master-controller/`, `/login/`, `/activate-account/`, `/reset-password/`, `/agent-portal/`, `/category/`, `/download/`

```bash
# Build and deploy admin dashboard (zero-downtime)
cd /home/ubuntu/saabuildingblocks-platform/packages/admin-dashboard
npm run build
pm2 reload nextjs-saa
```

**What runs here:** 114 API routes, Master Controller, admin RBAC portal, auth system, Supabase connections

### Request Flow

```
Browser - smartagentalliance.com - Cloudflare Pages (static + Cloudflare Functions)
  |- /agent-slug - [slug].js Cloudflare Function (agent attraction pages)
  |- /api/booking/* - Cloudflare Functions (slots.js, submit.js)
  |- /agent-portal - Static Agent Portal UI (fetches data from saabuildingblocks.com/api/*)
  +- everything else - static HTML from out/

Browser - saabuildingblocks.com - Cloudflare Edge - Tunnel - Apache :443
  |- /api/*, /master-controller, /login, /agent-portal - 127.0.0.1:3002 (admin-dashboard)
  +- everything else - saabuildingblocks.pages.dev (Cloudflare Pages)
```

**Important:** `smartagentalliance.com` is a Cloudflare Pages custom domain - traffic goes directly to Cloudflare edge, NOT through the VPS tunnel. Only `saabuildingblocks.com` routes through the tunnel to Apache. Cross-origin requests from `smartagentalliance.com` to `saabuildingblocks.com/api/*` must traverse: Cloudflare edge - Tunnel - Apache - port 3002.

### When to Deploy Where

- **Public site only:** Content changes, styling, new public pages, Agent Portal UI changes
- **Admin dashboard only:** API routes, Master Controller features, auth changes
- **Both:** Shared component updates, typography system, brand colors

---

## API Routes (114 total)

All in `packages/admin-dashboard/app/api/`. Major categories:

| Category | Count | Key Endpoints |
|----------|-------|---------------|
| Auth | 13 | login, logout, refresh, password-reset, email changes, activation |
| Users | 13 | CRUD, profile, onboarding, password reset |
| Email Automations | 13 | templates, categories, schedules, send-logs, rendering |
| Master Controller | 10 | analytics, brand-colors, typography, spacing, deploy, git-status |
| YouTube | 9 | auth, analytics, channel, videos, retention, schedule |
| Agent Pages | 7 | CRUD, activate/deactivate, slug lookup, image upload |
| Invitations | 5 | CRUD, batch, accept, validate |
| 404 Paths | 4 | CRUD, deploy-redirect, stats |
| Bookings | 4 | rsvp, referral, my-referrals, ghl-webhook |
| Automations | 3 | exp-guest-pass, logs, status |
| Webhooks | 3 | gohighlevel, ghl-active-downline, wordpress |
| Notifications | 3 | blast, cron, preview |
| Suggestions | 3 | CRUD, stats |
| GoHighLevel | 2 | contacts, sync |
| Roles | 2 | CRUD |
| Audit Logs | 2 | list, export |
| Other | ~18 | portal-heartbeat, tracking, video events, dino-high-scores, etc. |

---

## Cloudflare Functions

Located at `packages/public-site/functions/`. These are **Cloudflare Functions, NOT Next.js**.

| File | Purpose |
|---|---|
| `[slug].js` | Agent Attraction Page template (392KB, ALL CODE INLINED) |
| `calculator.js` | eXp commission calculator |
| `revshare.js` | Revenue share calculator |
| `api/join-team.js` | Team join form handler |
| `api/freebie-download.js` | Freebie download handler |
| `api/booking/slots.js` | GHL calendar free-slots proxy (public, no auth) |
| `api/booking/submit.js` | GHL contact upsert + appointment creation (uses `GOHIGHLEVEL_API_KEY` secret) |
| `freebies/[filename].js` | Dynamic freebie file serving |
| `_middleware.js` | Request middleware |

**Critical:** `[slug].js` has ALL code inlined - no imports, no external files. It fetches data from admin-dashboard API at runtime. Contains two custom video players (portal walkthrough + bottom player), a floating/mini-player system with FLIP animations, and page/video analytics beacons.

---

## Custom Booking Widget (Book a Call)

**Page:** `packages/public-site/app/book-a-call/components/CustomBookingWidget.tsx`
**API proxies:** `packages/public-site/functions/api/booking/slots.js` and `submit.js`

Replaces the GHL iframe embed with a fully custom React booking widget matching the SAA dark theme. Four-step flow: calendar - form - submitting - confirmation.

**GoHighLevel integration:**
- **Calendar ID:** `v5LFLy12isdGJiZmTxP7`
- **Location ID:** `wmYRsn57bNL8Z2tMlIZ7`
- **Slots endpoint (public, no auth):** `GET https://backend.leadconnectorhq.com/calendars/{calendarId}/free-slots`
- **Submit endpoint (private):** `POST https://services.leadconnectorhq.com/contacts/upsert` + `POST .../calendars/events/appointments`
- **API key:** `GOHIGHLEVEL_API_KEY` (set as Cloudflare Pages secret, accessed via `context.env`)

---

## Video Analytics Pipeline

Tracks video play events from Cloudflare Stream players across the site.

**Flow:** Browser `sendBeacon` - `POST /api/video/events` (admin-dashboard) - Supabase `upsert_video_view` RPC - `video_views` table

| Component | Location |
|---|---|
| Beacon sender (shared) | `packages/shared/components/saa/media/VideoPlayer.tsx` |
| Beacon sender (attraction pages) | `packages/public-site/functions/[slug].js` (inline, two players) |
| Beacon sender (team value page) | `packages/public-site/app/exp-realty-sponsor/page.tsx` |
| API receiver | `packages/admin-dashboard/app/api/video/events/route.ts` |
| Database migration | `packages/admin-dashboard/supabase/migrations/20260221000000_create_video_views.sql` |
| Dashboard display | `packages/admin-dashboard/app/master-controller/components/tabs/analytics/CloudflareStreamSection.tsx` |
| Dashboard API | `packages/admin-dashboard/app/api/master-controller/analytics/route.ts` |

**Tracked video IDs:**
- `14ba82ce03943a64ef90e3c9771a0d56` - Portal Walkthrough (team value page + attraction pages)
- `f8c3f1bd9c2db2409ed0e90f60fd4d5b` - The Inside Look (attraction pages bottom player)

---

## Master Controller CSS Workflow

```
1. Admin edits typography/colors/spacing at /master-controller
2. Settings save to Supabase
3. npm run generate:css reads Supabase - creates public/static-master-controller.css
4. npm run build bakes CSS into static export
5. wrangler pages deploy - Cloudflare 300+ edge locations
```

---

## npm Scripts

### Public Site (`packages/public-site`)

| Script | Command |
|---|---|
| `dev` | `next dev -p 3001` |
| `build` | `next build` (runs prebuild + postbuild hooks automatically) |
| `prebuild` | `npm run generate:blog-posts` (auto before build) |
| `postbuild` | `npm run sync-images && npm run generate:sitemap && npm run generate:routes` (auto after build) |
| `export` | Alias for `npm run build` |
| `generate:css` | `tsx scripts/generate-static-css.ts` (Supabase - CSS) |
| `generate:blog-posts` | `tsx scripts/generate-blog-posts-json.ts` |
| `generate:sitemap` | `next-sitemap` |
| `generate:routes` | `bash scripts/generate-routes-json.sh` |
| `sync-images` | `tsx scripts/sync-cloudflare-images.ts` |
| `lint` | `next lint` |
| `type-check` | `tsc --noEmit` |

### Admin Dashboard (`packages/admin-dashboard`)

| Script | Command |
|---|---|
| `dev` | `next dev -p 3002` |
| `build` | `next build` + copies `public/` and `.next/static/` into standalone dir |
| `start` | `next start -p 3002 --hostname 127.0.0.1` (dev only - production uses standalone via PM2) |
| `lint` | `next lint` |
| `type-check` | `tsc --noEmit` |

### Root Monorepo

| Script | Command |
|---|---|
| `build:public` | Build public-site workspace |
| `build:admin` | Build admin-dashboard workspace |
| `build:all` | Build all workspaces |
| `lint:all` | Lint all workspaces |
| `type-check:all` | Type-check all workspaces |
| `clean` | Remove node_modules, .next, out from all packages |

---

## GitHub Actions Workflows

| Workflow | File | Trigger |
|---|---|---|
| **Deploy Cloudflare** | `deploy-cloudflare.yml` | Push to main (public-site or shared changes), `repository_dispatch`, manual |
| **CI** | `ci.yml` | Push to main/develop, PRs to main |
| **CodeQL** | `codeql.yml` | Weekly + push/PR |
| **Dependabot auto-merge** | `dependabot-auto-merge.yml` | Dependabot PRs |

**Manual deploy trigger:**
```bash
gh workflow run deploy-cloudflare.yml
```

**VPS fallback deploy (when GitHub Actions is down):**
```bash
cd /home/ubuntu/saabuildingblocks-platform/packages/public-site
npm run build && npx wrangler pages deploy out --project-name=saabuildingblocks
```

---

## WordPress

- **URL:** https://wp.saabuildingblocks.com
- **Path:** `/var/www/wordpress/` (NOT `/var/www/html/`)
- **Version:** 6.9.1
- **Active plugins:** Advanced Custom Fields, Permalink Manager, Rank Math SEO
- **Must-use plugins:** allow-html-upload, expose-acf-rest, expose-permalink-uris-rest, expose-rankmath-rest, resend-smtp
- **Apache config:** `wp-saabuildingblocks-le-ssl.conf`

```bash
# WP-CLI commands
wp plugin list --path=/var/www/wordpress/
wp core version --path=/var/www/wordpress/
```

---

## Plausible CE (Analytics)

- **URL:** https://plausible.saabuildingblocks.com
- **Location:** `/opt/plausible/`
- **Containers:** Plausible CE v3.2.0 + PostgreSQL 16 + ClickHouse 24.12
- **Port:** 127.0.0.1:8000
- **Tracking domain:** smartagentalliance.com

```bash
# Check containers
sudo docker compose -f /opt/plausible/compose.yml -f /opt/plausible/compose.override.yml ps

# View logs
sudo docker logs plausible-plausible-1 --tail 50
```

---

## Playwright Chrome Cleanup

Orphaned Chrome processes from Playwright MCP are auto-cleaned every 30 minutes.

- **Script:** `/home/ubuntu/scripts/cleanup-playwright-chrome.sh`
- **Timer:** `playwright-chrome-cleanup.timer` (systemd, every 30 min + 2 min after boot)

```bash
# Manual cleanup
pw-kill

# Check for orphaned processes
pw-status

# Timer status
systemctl status playwright-chrome-cleanup.timer
```

---

## Temporary Files Directory

All screenshots, debug images, and other throwaway files go in `~/tmp/`. Auto-cleaned every 24 hours (files older than 24h are deleted).

- **Directory:** `/home/ubuntu/tmp/`
- **Cleanup script:** `/home/ubuntu/scripts/cleanup-tmp.sh`
- **Timer:** `cleanup-tmp.timer` (systemd, every 24h + 5 min after boot)

**When generating screenshots or temp files** (Playwright, debug output, image processing), always save to `~/tmp/` - never to `~/`, the repo root, or `/tmp/`.

```bash
# Check timer status
systemctl status cleanup-tmp.timer

# Manual cleanup
/home/ubuntu/scripts/cleanup-tmp.sh
```

---

## SAA Component Library

Located at `packages/shared/components/saa/`. Import from the shared package:

```typescript
import { CTAButton, CyberCardHolographic } from '@saa/shared/components/saa';
```

**19 categories:** backgrounds, buttons, cards, effects, forms, gallery, headings, icons, interactive, layouts, loaders, media, navigation, patterns, scroll-animations, team, text

---

## Page Building Rules

### Typography
- H1/H2: Auto-apply display font
- H3-H6: `font-[var(--font-taskor)]`
- Body text: `font-[var(--font-amulya)]`
- Buttons: Use `<CTAButton>` (auto-applies Taskor)
- Sizes: Use `clamp(MIN, PREFERRED, MAX)` for responsive

### Colors
- Headings: `#e5e4dd`
- Body: `#dcdbd5`
- Links: `#00ff88`
- Gold accent: `#ffd700`
- No arbitrary colors (`gray-300`, `#aaa`, etc.)

### Display Text
Auto-applies to: H1 headlines (<100 chars), H2 titles (<100 chars), nav items (<50 chars), CTAs (<50 chars), badges (<30 chars).
Never applies to: body paragraphs, long content, form help text, article content.
Manual override: `className="text-display"`
**To override auto-display font:** Use inline `style={{ fontFamily: 'var(--font-amulya)' }}` - Tailwind classes like `font-[var(--font-amulya)]` get overridden by the Master Controller auto-display CSS specificity.

---

## Production Safety

1. **Never deploy without verification** - `curl -I https://saabuildingblocks.com` must return 200
2. **Never run build scripts without permission** - read the script first, ask user before running
3. **Never move files during builds** - Next.js `output: 'export'` naturally excludes API routes
4. **Always push to GitHub after VPS changes** - keep repo as single source of truth
5. **VPS builds and GitHub Actions must stay in sync** - push before deploying to avoid stale code overwrites
6. **Never expose dev server ports** - Only ports 22 are open via UFW. Never run `ufw allow 3002/3003`

### Deploy Verification Checklist
```bash
# After public site deploy
curl -I https://saabuildingblocks.com                    # Should be 200
curl -s https://saabuildingblocks.com/js/script.file-downloads.pageview-props.tagged-events.js | head -1  # Plausible script loads

# After admin dashboard deploy
curl -I https://saabuildingblocks.com/master-controller  # Should be 200/302
pm2 logs nextjs-saa --lines 20 --nostream                # No errors
```

---

## Quick Health Check

```bash
# All services
pm2 list
sudo docker ps --format "table {{.Names}}\t{{.Status}}"
ss -tlnp | grep -E '3002|8000|3306|443'
curl -sI https://saabuildingblocks.com | head -3

# Disk and memory
df -h /
free -h
```

---

## VPS Specifications

- **Provider:** Hostinger KVM 4
- **CPU:** 4 vCPUs (AMD EPYC 9354P)
- **RAM:** 16 GB
- **Disk:** 200 GB (34% used)
- **OS:** Ubuntu 24.04 LTS
- **Hostname:** srv910723.hstgr.cloud

---

## Writing Style

- **Never use em dashes.** Use a regular hyphen (-) instead. Em dashes are an AI writing tell.
- Keep copy concise. Don't over-explain when a short sentence will do.

## Key Principles

- **Document actual state, not aspirational** - Built / Deployed / Working / Verified are distinct statuses
- **Comprehensive analysis before action** - one thorough investigation beats ten incremental patches
- **Ship pragmatically** - good software today beats perfect software never
- **Never claim "working" without verification**
