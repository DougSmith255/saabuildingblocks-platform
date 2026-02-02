# Smart Agent Alliance - Project Configuration

> **Single source of truth for infrastructure, architecture, and development.**
> Every path, command, and claim in this file has been verified against the actual system.
> Last verified: 2026-02-02

## Project Overview

Smart Agent Alliance (SAA) is a real estate technology platform for eXp Realty agents. It uses a dual-deployment architecture: a dynamic admin dashboard on VPS and a static public site on Cloudflare Pages, both from the same monorepo.

**Repository:** `https://github.com/DougSmith255/saabuildingblocks-platform.git`
**Branch:** `main`
**Monorepo root:** `/home/ubuntu/saabuildingblocks-platform`

---

## Tech Stack

| Technology | Version | Notes |
|---|---|---|
| Node.js | 20.20.0 | |
| Next.js | 16.1.6 | App Router, React Compiler enabled |
| React | 19.2.4 | Server Components, Server Actions |
| Tailwind CSS | 4.1.x | CSS-first config, `@import` syntax |
| TypeScript | 5.9.3 | Strict mode |
| Supabase | Latest | Auth, Database, Storage, Realtime |
| WordPress | 6.9 | Blog CMS at wp.saabuildingblocks.com |

**Before writing code, check latest docs:**
```
mcp__context7__resolve-library-id { "libraryName": "nextjs" }
mcp__context7__query-docs { "libraryId": "...", "query": "..." }
```

---

## Monorepo Structure

```
/home/ubuntu/saabuildingblocks-platform/
├── packages/
│   ├── public-site/        # Static site → Cloudflare Pages
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # Page-specific components
│   │   ├── functions/      # Cloudflare Functions (NOT Next.js)
│   │   ├── out/            # Static export output (~568MB, ~3180 files)
│   │   ├── lib/            # Utilities, WordPress API, auth
│   │   ├── scripts/        # Build scripts (generate-css, sync-images, etc.)
│   │   └── public/         # Static assets, static-master-controller.css
│   │
│   ├── admin-dashboard/    # Dynamic site → VPS PM2 (port 3002)
│   │   ├── app/
│   │   │   ├── api/        # 83 API route files
│   │   │   ├── master-controller/
│   │   │   ├── agent-portal/
│   │   │   └── login/
│   │   ├── components/
│   │   ├── lib/
│   │   └── supabase/       # Migrations and types
│   │
│   ├── shared/             # Shared components and utilities
│   │   ├── components/
│   │   │   ├── saa/        # SAA component library (buttons, cards, forms, etc.)
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
| 22 | SSH | Running | Remote access |
| 80 | Apache | Running | HTTP → HTTPS redirect |
| 443 | Apache | Running | SSL termination + reverse proxy |
| 3002 | admin-dashboard | Running | PM2: `nextjs-saa`, proxied via Apache |
| 3306 | MariaDB | Running | MySQL database (WordPress) |
| 8000 | Plausible CE | Running | Docker, analytics dashboard |

**Not running (remove if seen elsewhere):** Redis (6379), Vault (8200), Listmonk, n8n

**Firewall (UFW):** Only ports 22, 80, 443 are open. Port 3002 is explicitly denied from external access.

---

## PM2 Process Management

PM2 runs under the `ubuntu` user. There is no `claude-flow` user on this system.

```bash
# Check status
pm2 list

# Restart admin dashboard
pm2 restart nextjs-saa

# View logs
pm2 logs nextjs-saa --lines 50 --nostream
```

**Never use `sudo -u claude-flow`** — that user does not exist.

---

## Dual Deployment Architecture

### Public Site → Cloudflare Pages

**URL:** https://saabuildingblocks.pages.dev (CDN direct)
**Proxied via:** https://saabuildingblocks.com (Apache sends non-admin traffic to Cloudflare)
**Config:** `next.config.ts` has `output: 'export'` (static HTML)

```bash
# Build and deploy public site
cd /home/ubuntu/saabuildingblocks-platform/packages/public-site
npm run build
npx wrangler pages deploy out --project-name=saabuildingblocks
```

**What deploys:** Homepage, about pages, blog, calculators, freebies, link pages, Cloudflare Functions
**What does NOT deploy:** API routes, Master Controller UI, authentication, agent portal

### Admin Dashboard → VPS PM2

**URL:** https://saabuildingblocks.com (admin paths proxied by Apache to port 3002)
**Apache proxied paths:** `/api/`, `/master-controller/`, `/login/`, `/activate-account/`, `/reset-password/`, `/agent-portal/`, `/category/`, `/download/`

```bash
# Build and restart admin dashboard
cd /home/ubuntu/saabuildingblocks-platform/packages/admin-dashboard
npm run build
pm2 restart nextjs-saa
```

**What runs here:** 83 API routes, Master Controller, Agent Portal, auth system, Supabase connections

### Request Flow

```
Browser → saabuildingblocks.com (Apache :443)
  ├─ /api/*, /master-controller, /login, /agent-portal → 127.0.0.1:3002 (admin-dashboard)
  └─ everything else → saabuildingblocks.pages.dev (Cloudflare Pages)
```

### When to Deploy Where

- **Public site only:** Content changes, styling, new public pages
- **Admin dashboard only:** API routes, Master Controller features, auth changes
- **Both:** Shared component updates, typography system, brand colors

---

## Cloudflare Functions

Located at `packages/public-site/functions/`. These are **Cloudflare Functions, NOT Next.js**.

| File | Purpose |
|---|---|
| `[slug].js` | Agent Attraction Page template (325KB, ALL CODE INLINED) |
| `calculator.js` | eXp commission calculator |
| `revshare.js` | Revenue share calculator |
| `api/join-team.js` | Team join form handler |
| `api/freebie-download.js` | Freebie download handler |
| `_middleware.js` | Request middleware |

**Critical:** `[slug].js` has ALL code inlined — no imports, no external files. It fetches data from admin-dashboard API at runtime.

---

## Master Controller CSS Workflow

```
1. Admin edits typography/colors/spacing at /master-controller
2. Settings save to Supabase
3. npm run generate:css reads Supabase → creates public/static-master-controller.css
4. npm run build bakes CSS into static export
5. wrangler pages deploy → Cloudflare 300+ edge locations
```

---

## npm Scripts

### Public Site (`packages/public-site`)

| Script | Command |
|---|---|
| `dev` | `next dev -p 3001` |
| `build` | `next build` (runs prebuild, postbuild hooks automatically) |
| `export` | Alias for `npm run build` |
| `generate:css` | `tsx scripts/generate-static-css.ts` (Supabase → CSS) |
| `generate:blog-posts` | `tsx scripts/generate-blog-posts-json.ts` |
| `sync-images` | `tsx scripts/sync-cloudflare-images.ts` |
| `lint` | `next lint` |
| `type-check` | `tsc --noEmit` |

### Admin Dashboard (`packages/admin-dashboard`)

| Script | Command |
|---|---|
| `dev` | `next dev -p 3002` |
| `build` | `next build` |
| `start` | `next start -p 3002 --hostname 127.0.0.1` |
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
- **Version:** 6.9
- **Active plugins:** Advanced Custom Fields, Permalink Manager, Rank Math SEO
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
- **Port:** 127.0.0.1:8000 (Apache reverse proxy handles SSL)
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

## SAA Component Library

Located at `packages/shared/components/saa/`. Import from the shared package:

```typescript
import { CTAButton, CyberCardHolographic } from '@saa/shared/components/saa';
```

**Categories:** backgrounds, buttons, cards, effects, forms, gallery, headings, icons, interactive, layouts, loaders, media, navigation, patterns, scroll-animations, team, text

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

---

## Production Safety

1. **Never deploy without verification** — `curl -I https://saabuildingblocks.com` must return 200
2. **Never run build scripts without permission** — read the script first, ask user before running
3. **Never move files during builds** — Next.js `output: 'export'` naturally excludes API routes
4. **Always push to GitHub after VPS changes** — keep repo as single source of truth
5. **VPS builds and GitHub Actions must stay in sync** — push before deploying to avoid stale code overwrites

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
- **Disk:** 200 GB (13% used)
- **OS:** Ubuntu 24.04 LTS
- **Hostname:** srv910723.hstgr.cloud

---

## Key Principles

- **Document actual state, not aspirational** — Built / Deployed / Working / Verified are distinct statuses
- **Comprehensive analysis before action** — one thorough investigation beats ten incremental patches
- **Ship pragmatically** — good software today beats perfect software never
- **Never claim "working" without verification**
