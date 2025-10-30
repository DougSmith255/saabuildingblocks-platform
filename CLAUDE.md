# Claude Code Configuration - SPARC Development Environment

## 🔄 SESSION INITIALIZATION (UPDATED)

**⚠️ ALWAYS RUN BEFORE STARTING WORK:**

```bash
# Comprehensive initialization (RECOMMENDED)
bash /home/claude-flow/scripts/init-session.sh

# Quick health check only
bash /home/claude-flow/scripts/quick-health-check.sh
```

**What init-session.sh does:**
1. ✅ Checks production site health
2. ✅ Verifies WordPress API connectivity
3. ✅ Loads project context and credentials
4. ✅ Shows recent git commits
5. ✅ Displays PM2 process status
6. ✅ Lists available documentation
7. ✅ Reports any issues found

**Manual initialization (if script unavailable):**
```bash
# 1. Check production status
curl -I https://saabuildingblocks.com
pm2 status nextjs-saa

# 2. Check WordPress API
curl -I https://wp.saabuildingblocks.com/wp-json/wp/v2/posts

# 3. Load project context
cat /home/claude-flow/config/project-registry.json | jq '.credentials'
cd /home/claude-flow/nextjs-frontend && git log --oneline -10

# 4. Check recent logs
pm2 logs nextjs-saa --lines 20 --nostream
```

**Key Files:**
1. **🏗️ DUAL DEPLOYMENT**: `/home/claude-flow/docs/DUAL-DEPLOYMENT-ARCHITECTURE.md` 🌍 **CRITICAL - VPS + Cloudflare Architecture**
2. **🚨 PRODUCTION SAFETY**: `/home/claude-flow/docs/PRODUCTION-SAFETY-RULES.md` ⚠️ **READ BEFORE ANY PRODUCTION CHANGES!**
3. **Page Building Protocol**: `/home/claude-flow/docs/AI-AGENT-PAGE-BUILDING-PROTOCOL.md` ⚡ **READ THIS FIRST!**
4. **Safe Export Guide**: `/home/claude-flow/docs/SAFE-EXPORT-GUIDE.md` 🔒 **Correct way to export without breaking production**
5. Architecture: `/home/claude-flow/docs/NEXTJS-MIGRATION-ARCHITECTURE.md`
6. Credentials: `/home/claude-flow/config/project-registry.json`
7. Standards: `/home/claude-flow/docs/CODING-STANDARDS.md`
8. Protocols: `/home/claude-flow/docs/SWARM-PROTOCOLS.md`

**Services:** Cloudflare, Cloudflare R2, WordPress, Supabase, n8n, GoHighLevel, SSL Certificates

---

## 📚 ALWAYS USE LATEST DOCUMENTATION (CRITICAL!)

**⚠️ BEFORE WRITING ANY CODE - CHECK LATEST DOCS WITH mcp__context7**

You have access to **mcp__context7** - a TIER 1 UNLIMITED documentation server providing the latest official docs for all libraries/frameworks. Your training data is from 2023, but this project uses cutting-edge versions.

**Mandatory Process:**
1. **Before writing Tailwind CSS:** Check latest Tailwind v4 syntax
2. **Before writing Next.js code:** Verify Next.js 16 App Router APIs
3. **Before writing React code:** Check React 19 features and patterns
4. **Before using any library:** Verify current API and available features

**Quick Commands:**
```bash
# Resolve library documentation
mcp__context7__resolve-library-id { "libraryName": "nextjs" }
mcp__context7__resolve-library-id { "libraryName": "react" }
mcp__context7__resolve-library-id { "libraryName": "tailwindcss" }

# Get specific documentation
mcp__context7__get-library-docs { "libraryId": "...", "query": "..." }
```

**Tech Stack Versions (Verify APIs):**
- Next.js 16 (App Router, Server Components, Server Actions)
- React 19 (use(), Server Actions, Suspense patterns)
- Tailwind CSS v4 (new @import syntax, CSS-first config)
- TypeScript 5.x
- Supabase (Auth, Database, Storage, Realtime)

**Why This Matters:**
- Avoid deprecated APIs from 2023
- Use newest performance optimizations
- Leverage latest framework features
- Prevent syntax errors from outdated patterns

**Pre-Task Checklist Hook:** (automated reminder system coming soon)

---

## 📁 UNIFIED ARCHIVE

**Location:** `/home/claude-flow/.archive/` (1.3GB, 2,859 files)

**Quick Access:**
```bash
# Search archived files
grep -r "keyword" /home/claude-flow/.archive/

# View structure
ls -lh /home/claude-flow/.archive/
```

**📚 Complete Details:** `/home/claude-flow/ARCHIVE_CONSOLIDATION_COMPLETE.md`

---

## 🚨 PRODUCTION SAFETY (CRITICAL!)

**⚠️ BEFORE ANY PRODUCTION CHANGE, REMEMBER THESE RULES:**

### ⛔ NEVER DO THESE

1. **NEVER move Master Controller files during builds**
   - VPS and export share same codebase
   - Moving files = breaking production
   - Use Next.js natural exclusion instead

2. **NEVER run build scripts without permission**
   - Scripts can modify production
   - Always read script first
   - Ask user before running

3. **NEVER deploy without verification**
   - `curl -I https://saabuildingblocks.com` must return HTTP 200
   - Check Master Controller: `curl https://saabuildingblocks.com/master-controller`
   - Review logs: `pm2 logs nextjs-saa --lines 50`

4. **NEVER undermine user requirements**
   - Cloudflare Pages ≠ Cloudflare CDN caching
   - User needs 300+ edge locations, not just cache
   - Ask if unsure, don't dismiss

### ✅ SAFE EXPORT PROCESS

**The Right Way (NO file movement):**
```bash
# 1. Generate CSS from Supabase
npm run generate:css

# 2. Build with static config (Next.js excludes API automatically)
NEXT_CONFIG_FILE=next.config.static.ts next build

# 3. Verify VPS still works
curl -I https://saabuildingblocks.com

# 4. Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name=saabuildingblocks
```

### 📋 Pre-Change Checklist

Before ANY production action:
- [ ] Read entire script before running
- [ ] Check if it moves/deletes files
- [ ] Did user explicitly request this?
- [ ] Is VPS currently healthy?
- [ ] Do I have a rollback plan?

📚 **Complete Safety Guide:** [PRODUCTION-SAFETY-RULES.md](/home/claude-flow/docs/PRODUCTION-SAFETY-RULES.md)
📚 **Safe Export Guide:** [SAFE-EXPORT-GUIDE.md](/home/claude-flow/docs/SAFE-EXPORT-GUIDE.md)
📚 **Lessons Learned:** [AI-AGENT-LESSONS-LEARNED.md](/home/claude-flow/docs/AI-AGENT-LESSONS-LEARNED.md)

---

## 🎯 AI AGENT DEVELOPMENT PHILOSOPHY

**Build Systems That Run Themselves | Ship Pragmatically | Analyze Comprehensively**

### Three Core Principles

**1. Automation-First Mindset**
Build systems that maintain themselves, not systems requiring constant attention.
- Design self-healing capabilities (auto-detect, diagnose, fix)
- Implement autonomous monitoring (health checks, error recovery)
- Minimize manual intervention (automate routine, reserve humans for strategy)

**Example**: Health endpoints with automatic restart policies vs. manual service restarts.

**2. Best Option Within Reason**
Ship pragmatic solutions that balance quality with velocity.
- **Perfect is the enemy of shipped**: Good software today beats perfect software never
- **Intentional technical debt is strategic**: Conscious trade-offs for speed are acceptable when documented
- **Know when to stop optimizing**: Diminishing returns exist

**When to optimize**: Performance bottlenecks, security issues, frequently modified code
**When to ship**: Meets criteria, tests pass, debt documented, trade-offs conscious

**3. Comprehensive Analysis Before Action**
One thorough investigation beats ten incremental patches.
- **Identify root causes, not symptoms**: Treat the disease, not the fever
- **Plan systematically**: Checklists, flowcharts, document steps
- **Prevent recurrence**: Modify core processes, not just patch bugs

**Measure Twice, Cut Once**: Research → Analyze → Design → Implement → Verify

### Decision Framework

**Use Automation-First when**: Building CI/CD, monitoring, deployments, error recovery
**Use Best Within Reason when**: Tight deadlines, evaluating optimization, managing debt
**Use Comprehensive Analysis when**: Recurring bugs, major changes, performance issues, refactoring

### Agent Execution Pattern

```
✅ GOOD: Comprehensive Approach
1. Research: Analyze thoroughly, identify patterns
2. Plan: Design solution addressing root cause
3. Code: Implement with automation and health checks
4. Test: Verify end-to-end including failures

❌ BAD: Incremental Whack-A-Mole
1. Fix immediate bug
2. Test that bug
3. Bug reappears in different form
4. Repeat indefinitely
```

### Status Distinctions (Critical!)

- **Built**: Code written, compiles, not tested
- **Deployed**: Live in production, not verified
- **Working**: End-to-end tested in production
- **Verified**: User confirmed or automated test passed

**Never claim "working" without verification.**

### Success Metrics

- **Good automation**: ↓ on-call pages, ↑ deployment frequency, ↓ MTTR
- **Good pragmatism**: Consistent shipping, debt <25%, maintained velocity
- **Good analysis**: ↓ recurring bugs, ↓ "fix the fix" cycles, ↑ first-time-right

📚 **Full Philosophy**: `/home/claude-flow/nextjs-frontend/docs/AI-AGENT-DEVELOPMENT-PHILOSOPHY.md`

---

## 🚀 DEPLOYMENT STATUS

**Status:** ✅ **PRODUCTION LIVE** - Hybrid Architecture Operational
**Last Deployed:** October 13, 2025
**Deployment System:** Fully Automated (97% Complete)

### Production URLs
- **Primary Site:** https://saabuildingblocks.com (PM2 + Cloudflare CDN)
- **CDN Direct:** https://saabuildingblocks.pages.dev (Cloudflare Pages)
- **WordPress:** https://wp.saabuildingblocks.com
- **n8n Dashboard:** https://n8n.saabuildingblocks.com

### Performance Metrics
- **Global TTFB:** 20-50ms (10x faster than before)
- **Cache Hit Ratio:** 95%+ (Cloudflare CDN)
- **Server Load:** 90% reduction (CDN offload)
- **Deployment Time:** 3-5 minutes (fully automated)
- **Uptime:** 99.99% (hybrid redundancy)

### Automation Status
- ✅ WordPress webhook integration (100%)
- ⚠️ n8n workflow ready (needs activation - 5 min task)
- ✅ GitHub Actions CI/CD (100%)
- ✅ Cloudflare Pages deployment (100%)
- ✅ Email notifications (100%)
- ✅ Audit logging (100%)

### Quick Actions
```bash
# Health check
pm2 status nextjs-saa && curl -I https://saabuildingblocks.com

# Restart services
pm2 restart nextjs-saa && docker restart claude-flow-n8n-1

# Deploy to Cloudflare
cd /home/claude-flow/nextjs-frontend && npm run export:clean && wrangler pages deploy out --project-name=saabuildingblocks

# View deployment docs
cat /home/claude-flow/deployment-execution/MASTER_DEPLOYMENT_REPORT.md
```

📚 **Complete Documentation:** `/home/claude-flow/deployment-execution/`

---

## 🌐 DUAL DEPLOYMENT ARCHITECTURE

**⚠️ CRITICAL CONCEPT: TWO DEPLOYMENTS OF THE SAME CODEBASE**

This project uses a **DUAL DEPLOYMENT STRATEGY** for optimal performance and functionality:

### 🖥️ VPS Deployment (Admin Interface)

**URL:** https://saabuildingblocks.com
**Purpose:** Full dynamic Next.js site with admin capabilities
**Technology:** Next.js (dynamic mode) + PM2 process manager

**What's Included:**
- ✅ Master Controller UI (typography/colors/spacing editor)
- ✅ Agent Portal (role management)
- ✅ Authentication system (login/signup/invitations)
- ✅ All 43 API routes
- ✅ Real-time features
- ✅ Supabase database connections

**Key URLs:**
- Master Controller: https://saabuildingblocks.com/master-controller
- Agent Portal: https://saabuildingblocks.com/agent-portal
- Login: https://saabuildingblocks.com/login

**Deployment:**
```bash
cd /home/claude-flow/nextjs-frontend
git pull && npm ci && npm run build && pm2 restart nextjs-saa
```

---

### 🌍 Cloudflare Pages Deployment (Global CDN)

**URL:** https://saabuildingblocks.pages.dev
**Purpose:** Public-facing static site (300+ edge locations worldwide)
**Technology:** Static HTML export + Cloudflare's global CDN

**What's Included:**
- ✅ Public content pages (homepage, about, blog, etc.)
- ✅ Master Controller CSS baked into static files
- ✅ Lightning-fast delivery (20-50ms TTFB globally)
- ❌ NO Master Controller UI (admin stays on VPS)
- ❌ NO API routes (pure static content)
- ❌ NO authentication

**Deployment:**
```bash
cd /home/claude-flow/nextjs-frontend
npm run generate:css      # Reads Supabase → creates static CSS
npm run export:clean       # Builds out/ directory
wrangler pages deploy out --project-name=saabuildingblocks
```

---

### 🔄 Master Controller CSS Workflow

**How admin settings apply to static export:**

```
1. Admin configures typography/colors/spacing on VPS
   ↓
2. Settings save to Supabase database
   ↓
3. npm run generate:css reads Supabase
   ↓
4. Creates public/static-master-controller.css
   ↓
5. Static export includes CSS
   ↓
6. Deploy to Cloudflare → 300+ edge locations
```

---

### 🎯 When to Deploy to Which

**VPS Only:**
- Adding/modifying Master Controller features
- API route changes
- Authentication system updates
- Agent Portal modifications

**Cloudflare Only:**
- Public content updates (homepage, about, blog)
- After Master Controller settings changed

**Both Deployments:**
- Shared component updates (Header, Footer, CTAButton)
- Typography system changes
- Brand color updates

---

### 💡 Why This Architecture?

**Global Business Needs:**
- User runs AI automation agency with worldwide clients
- VPS = Single location → 150-300ms latency internationally
- Cloudflare = 300+ locations → 20-50ms latency globally (10x faster)
- Cost: VPS $50-100/mo + Cloudflare Pages $0/mo (free tier)

**Communication Rules:**
- ✅ Clarify which deployment: VPS or Cloudflare
- ✅ Master Controller changes require BOTH deployments
- ✅ Use production URLs only, NEVER localhost
- ❌ Never mention internal ports to user

📚 **CRITICAL GUIDE:** [Dual Deployment Architecture](/home/claude-flow/docs/DUAL-DEPLOYMENT-ARCHITECTURE.md) ⚡ **READ THIS TO UNDERSTAND ARCHITECTURE**

---

## 🤖 AUTOMATED DEPLOYMENT PIPELINE

🔄 **UPDATED 2025-10-13**

**Status:** ✅ **FULLY OPERATIONAL**

### Pipeline Overview

```
WordPress (Content Management)
    ↓ [Webhook on publish/update]
GitHub Actions (CI/CD)
    ↓ [Automated build]
Next.js Build with ISR
    ↓ [Pre-render + cache]
Cloudflare Pages (Global CDN)
    ↓ [Edge deployment]
Production Site Live
```

### Components

**1. WordPress Plugin (saa-auto-rebuild)**
- Location: wp.saabuildingblocks.com
- Version: 2.0.0
- Function: Fires webhook to GitHub on post publish/update
- Webhook: Triggers GitHub Actions workflow

**2. GitHub Actions Workflow**
- File: `.github/workflows/wordpress-content-update.yml`
- Trigger: Webhook from WordPress plugin
- Actions:
  - Checkout repository
  - Install dependencies
  - Build Next.js with ISR
  - Deploy to Cloudflare Pages
  - Invalidate CDN cache

**3. Next.js ISR (Incremental Static Regeneration)**
- Renders blog posts on-demand
- Caches for 60 seconds
- Regenerates on webhook trigger
- Pre-renders critical pages at build time

**4. Cloudflare Pages**
- Global CDN deployment
- Edge caching
- Automatic SSL
- Build time: ~2-3 minutes

### Key Features

**Fully Automated:**
- ✅ No manual deployment required
- ✅ WordPress publish → Auto-deploy
- ✅ Post updates → Auto-rebuild
- ✅ CDN cache invalidation

**Performance Optimized:**
- ✅ ISR for dynamic content
- ✅ Edge caching via Cloudflare
- ✅ Pre-rendered critical pages
- ✅ Incremental builds (fast)

**SEO Ready:**
- ✅ Pre-rendered HTML for crawlers
- ✅ Meta tags from WordPress
- ✅ Sitemap auto-generation
- ✅ Schema markup included

### Monitoring & Control

**Check Pipeline Status:**
```bash
# GitHub Actions status
gh workflow list

# Cloudflare Pages deployments
npx wrangler pages deployment list

# WordPress plugin status
wp plugin status saa-auto-rebuild --path=/var/www/html
```

**Manual Trigger (if needed):**
```bash
# Trigger GitHub Actions manually
gh workflow run wordpress-content-update.yml

# Force rebuild all blog posts
npm run blog:rebuild
```

**Logs & Debugging:**
```bash
# GitHub Actions logs
gh run list --workflow=wordpress-content-update.yml

# Cloudflare Pages logs
npx wrangler pages deployment tail

# WordPress webhook logs
wp db query "SELECT * FROM wp_saa_rebuild_logs ORDER BY timestamp DESC LIMIT 10" --path=/var/www/html
```

### 🚫 DEPRECATED: Old Deployment Methods

**n8n SSH Execution** (DEPRECATED)
- ❌ Status: Removed 2025-10-13
- ❌ Reason: Complex, hard to debug, requires VPS access
- ✅ Replacement: GitHub Actions (simpler, cloud-native)

**File Movement Build Approach** (DEPRECATED - DANGEROUS!)
- ❌ Status: Never use - breaks production
- ❌ Reason: Moves Master Controller files during build, fails to restore on error
- ✅ Replacement: Next.js natural exclusion (output: 'export' config)

📚 **Complete Guides:**
- [WordPress Automation Guide](/home/claude-flow/docs/WORDPRESS_AUTOMATION_GUIDE.md)
- [GitHub Actions Setup Guide](/home/claude-flow/docs/GITHUB_ACTIONS_SETUP_GUIDE.md)
- [Incremental Deployment Guide](/home/claude-flow/docs/INCREMENTAL_DEPLOYMENT_GUIDE.md)

---

## 📦 BLOG & DEPLOYMENT STRATEGY

🔄 **UPDATED 2025-10-13**

**Current Strategy:** Optimize existing blog with automated pipeline, build new pages incrementally

### Blog Optimization (PHASE 1 - CURRENT PRIORITY)

**Status:** 🚀 **AUTOMATED PIPELINE READY**

**Blog Site:**
- URL: https://saabuildingblocks.com/blog
- Content: WordPress CMS (https://wp.saabuildingblocks.com)
- Rendering: Next.js 16 with ISR (Incremental Static Regeneration)
- Deployment: Automated via GitHub Actions + Cloudflare Pages

**Automated Pipeline:**
```
WordPress Post Publish/Update
    ↓
WordPress Plugin (saa-auto-rebuild) fires webhook
    ↓
GitHub Actions triggered
    ↓
Next.js build with ISR
    ↓
Deploy to Cloudflare Pages
    ↓
Blog live in ~2-3 minutes
```

**What's Automated:**
- ✅ WordPress → GitHub webhook on post publish
- ✅ Automatic Next.js build on content changes
- ✅ ISR regeneration for updated posts
- ✅ Cloudflare Pages deployment
- ✅ CDN cache invalidation

**Quick Commands:**
```bash
# Check WordPress plugin status
wp plugin list --path=/var/www/html

# Monitor GitHub Actions
gh workflow list --repo owner/repo

# Check Cloudflare Pages deployment
npx wrangler pages deployment list

# Manual trigger (if needed)
gh workflow run wordpress-content-update.yml
```

### Site Architecture

**Dynamic Site (PRIMARY):**
- URL: https://saabuildingblocks.com
- Master Controller (admin dashboard)
- Authentication system (login/signup/invitations)
- API routes (43 total)
- Agent Portal
- Real-time features

**Blog with ISR:**
- Integration: WordPress API → Next.js ISR → Cloudflare CDN
- Revalidation: On-demand (webhook) + Time-based (60s)
- Build time: ~2-3 minutes per deployment
- SEO: Pre-rendered HTML for all posts

### Incremental Page Building (PHASE 2 - AFTER BLOG OPTIMIZED)

**Strategy:** Build remaining pages one at a time using optimized blog as template

**Page Priority:**
1. About page
2. Services pages
3. Contact page
4. Team pages
5. Case studies

**Per-Page Workflow:**
1. Design → Review → Build
2. Test with Master Controller typography
3. Deploy incrementally (no full rebuild)
4. Verify SEO optimization
5. Move to next page

### Static Export to Cloudflare Pages

**Status:** ✅ **ACTIVE** (Part of Dual Deployment Architecture)

**How It Works:**
1. Next.js static export with `output: 'export'` config
2. Next.js **automatically excludes** API routes (no manual file movement!)
3. Master Controller CSS generated from Supabase and baked into static files
4. Deployed to Cloudflare Pages (300+ global edge locations)

**What Deploys to Cloudflare:**
- Public content pages (homepage, about, blog)
- Master Controller CSS (settings baked in)
- All public-facing components

**What Stays on VPS Only:**
- Master Controller UI (admin interface)
- API routes (authentication, database operations)
- Agent Portal (role management)
- Real-time features

**Why Cloudflare Pages:**
- 300+ global edge locations (vs VPS single location)
- 20-50ms TTFB worldwide (vs 150-300ms from VPS)
- Free tier (vs paid VPS)
- User runs global business, needs global speed

**📚 Complete Guide:** [WordPress Automation Guide](/home/claude-flow/docs/WORDPRESS_AUTOMATION_GUIDE.md)

---

## 🎛️ GLOBAL PREFERENCES

**One-time setup (persists forever):**
```bash
bash /home/claude-flow/scripts/setup-preferences.sh
```

**Manage preferences:**
```bash
npx claude-flow@alpha preferences show
npx claude-flow@alpha preferences set <key> <value>
npx claude-flow@alpha preferences reset
```

**What persists:**
- Tech stack (Next.js 16, React 19, Tailwind v4, WordPress, Supabase, Cloudflare, n8n)
- MCP preferences (always-check list, preferred order)
- Swarm defaults (topology, max agents, strategy)
- Auto-load settings (patterns, analytics, credentials)
- Notifications (summary, warnings, verbose)

📚 **Complete Guide:** [Preferences System Guide](/home/claude-flow/docs/preferences-system-guide.md)

---

## 🎨 DISPLAY TEXT SYSTEM

**Auto-applies to:**
- H1 hero headlines (< 100 chars)
- H2 section titles (< 100 chars)
- Navigation items (< 50 chars)
- Primary CTAs (< 50 chars)
- Badges (< 30 chars)

**Never applies to:**
- Body paragraphs
- Long content (> 100 chars)
- Form help text
- Article content

**Manual override:** `className="text-display"`

📚 **Complete Guide:** [Display Text System](/home/claude-flow/docs/display-text-system.md)

---

## 📋 PAGE BUILDING PROTOCOL (CRITICAL!)

**⚠️ BEFORE BUILDING ANY PAGE, READ THIS PROTOCOL**

**Location:** `/home/claude-flow/docs/AI-AGENT-PAGE-BUILDING-PROTOCOL.md`

This is THE definitive integration protocol that ensures:
- ✅ Typography settings from Master Controller apply correctly
- ✅ Component single-source-of-truth pattern is followed
- ✅ Brand colors are used (no arbitrary colors)
- ✅ All pages are testable and maintainable

**Protocol Covers:**
1. **Typography Integration** - How to classify text (H1, H2, body, button, etc.)
2. **Component Usage** - How to import/use SAA components (CTAButton, CyberCardHolographic, etc.)
3. **Color System** - How color values are resolved from Master Controller
4. **Testing Checklist** - Verify typography, colors, components update when settings change

**Quick Reference:**
```
TYPOGRAPHY RULES:
• H1/H2 → Auto-apply display font (no class needed)
• H3-H6 → font-[var(--font-taskor)]
• Body → font-[var(--font-amulya)]
• Quotes → font-amulya italic (ALWAYS)
• Code → font-synonym (ALWAYS)
• Buttons → Use <CTAButton> (auto-applies Taskor)
• Sizes → clamp(MIN, PREFERRED, MAX)

COMPONENT RULES:
• Import: import { X } from '@/components/saa'
• Types: import type { XProps } from '@/components/saa'
• Origin: React components are conversions of HTML
• Edit: Use ComponentEditor in Master Controller

COLOR RULES:
• Headings: #e5e4dd
• Body: #dcdbd5
• Links: #00ff88
• Gold: #ffd700
• NO arbitrary colors (gray-300, #aaa, etc.)
```

**This protocol is AS IMPORTANT as knowing the tech stack.**

📚 **Complete Protocol:** [AI Agent Page Building Protocol](/home/claude-flow/docs/AI-AGENT-PAGE-BUILDING-PROTOCOL.md)

---

## 🏗️ ARCHITECTURE

**You are using Claude Code** - Anthropic's AI development environment.

**Native Tools:**
- Task (spawn agents)
- Read/Write/Edit (files)
- Bash (terminal)
- TodoWrite (tracking)

**MCP Extensions (10 servers):**
- github (GitHub ops)
- playwright (browser automation)
- memory (persistent context)
- postgres (database queries)
- brave-search (web research)
- filesystem (advanced file ops)
- context7 (library docs)
- ruv-swarm (enhanced coordination)
- claude-flow (swarm & hive-mind coordination)

**MCPs are extensions, not separate systems.** Use what you need.

---

## 🎯 ORCHESTRATION TERMINOLOGY (CRITICAL!)

**⚠️ THREE DIFFERENT SYSTEMS - Know the Difference!**

When user says... | They mean... | You should use...
--- | --- | ---
**"Use a swarm"** | claude-flow swarm mode | `npx claude-flow@alpha swarm "task" --claude`
**"Spawn hive mind"** | claude-flow hive-mind | `npx claude-flow@alpha hive-mind spawn "task" --claude`
**"Use task tool"** | Claude Code Task() | `Task("desc", "details", "agent-type")`

### Quick Comparison:

| Feature | Swarm | Hive-Mind | Task Tool |
|---------|-------|-----------|----------|
| **Command** | `npx claude-flow@alpha swarm` | `npx claude-flow@alpha hive-mind` | `Task()` |
| **Memory** | Temporary | Persistent (SQLite) | None |
| **Use Case** | Quick tasks | Complex projects | Direct control |
| **Resumable** | No | Yes | No |

### Available Agent Types (ACTUAL - Not Aspirational!):

**Core Agents:**
`researcher`, `coder`, `analyst`, `tester`, `reviewer`, `planner`

**Architecture:**
`system-architect`, `architecture`, `specification`, `pseudocode`, `refinement`

**Specialized:**
`perf-analyzer`, `code-analyzer`, `backend-dev`, `mobile-dev`, `ml-developer`, `cicd-engineer`, `api-docs`

**Swarm Coordinators:**
`mesh-coordinator`, `hierarchical-coordinator`, `adaptive-coordinator`, `queen-coordinator`, `worker-specialist`

**❌ Agent Types That DO NOT Exist:**
- `architect` (use `architecture` or `system-architect`)
- `optimizer` (use `perf-analyzer`)
- `documenter` (use `coder`)

📚 **Complete Guide:** `/home/claude-flow/docs/SWARM-VS-HIVE-VS-TASK-TOOL.md`

---

## 🏥 MCP HEALTH STATUS

**Last Updated:** 2025-10-28 22:05 UTC (11 MCPs operational)
**Health Check:** `/home/claude-flow/MCP_ACTUAL_STATUS_2025-10-28.md`
**Configuration:** `/home/claude-flow/MCP_CONFIGURATION_COMPLETE.md`

### Quick Status Overview

| MCP | Status | Notes |
|-----|--------|-------|
| **mcp__memory** | ✅ Active | Knowledge graph operational |
| **mcp__filesystem** | ✅ Active | File operations functional |
| **mcp__brave-search** | ✅ Active | Web search operational |
| **mcp__playwright** | ✅ Active | Browser automation ready |
| **mcp__context7** | ✅ Active | Library docs working |
| **mcp__sentry** | ✅ Active | Error tracking operational (upgraded to latest) |
| **mcp__cloudflare-docs** | ✅ Active | Documentation search working |
| **mcp__claude-flow** | ✅ Active | Swarm coordination operational (101 MCP tools) |
| **mcp__ruv-swarm** | ✅ Active | Enhanced swarm coordination (30+ MCP tools) |
| **mcp__github** | ✅ Active | Repository operations working |
| **mcp__supabase** | ✅ Active | Full database stack - Database + Auth + Storage + Realtime |
| **mcp__cloudflare** | ✅ Active | Cloudflare API operations (KV, R2, D1, Workers, Pages) |

### Quick Diagnostic Commands

```bash
# Test all operational MCPs
mcp__memory__read_graph
mcp__brave-search__brave_web_search { "query": "test", "count": 1 }
mcp__playwright__browser_snapshot
mcp__context7__resolve-library-id { "libraryName": "react" }
mcp__sentry__find_organizations
mcp__github__search_repositories { "query": "test", "perPage": 1 }
mcp__ruv-swarm__swarm_init { "topology": "mesh", "maxAgents": 3 }
mcp__claude-flow__swarm_status
mcp__cloudflare-docs__search_cloudflare_documentation { "query": "Pages" }
```

### Health Check Script

```bash
# Run comprehensive MCP health check
cat /home/claude-flow/MCP_HEALTH_REPORT.md

# Quick status check
jq -r '.mcpRouting | to_entries[] | "\(.key): \(.value.status)"' \
  /home/claude-flow/.mcp-routing.json
```

**📊 Summary:** 11/11 MCPs operational (100%) 🎉

**🎉 Recent Fixes:**
- ✅ GitHub MCP - Token updated and verified
- ✅ Supabase MCP - HTTP server configured
- ✅ ruv-swarm MCP - FIXED with --protocol=stdio flag
- ✅ Sentry MCP - Upgraded to @latest version
- ✅ postgres MCP - Removed (use Supabase MCP for database operations)

---

## 🚨 CRITICAL LEARNINGS

**Key Principles:**
- Document ACTUAL state, not aspirational (Built → Deployed → Working → Verified)
- Test end-to-end before claiming "working"
- Next.js 16 static export blocked by API routes (use hybrid architecture)
- Distinguish plugin installation from webhook activation
- NEVER run build scripts without permission (see 2025-10-20 incident)

📚 **Full Lessons Learned:** `/home/claude-flow/docs/AI-AGENT-LESSONS-LEARNED.md`

---

## 🚨 CRITICAL RULES

### Concurrent Execution
1. ALL operations in ONE message
2. NEVER save files to root folder
3. Use appropriate subdirectories
4. Use Task tool for parallel agents

### File Organization
- `/src` - Source code
- `/tests` - Test files
- `/docs` - Documentation
- `/config` - Configuration
- `/scripts` - Utility scripts
- `/examples` - Example code

### Golden Rule: "1 MESSAGE = ALL OPERATIONS"
```javascript
// ✅ CORRECT: Single message
Task("Research", "...", "researcher")
Task("Coder", "...", "coder")
Task("Tester", "...", "tester")
TodoWrite { todos: [...8-10 todos...] }
Write "src/file1.ts"
Write "tests/file1.test.ts"
```

---

## 📋 MCP SELECTION CHECKLIST

**Check BEFORE every task:**
- GitHub operations? → `mcp__github` (repos, issues, PRs, code search)
- **Library/framework docs?** → `mcp__context7` **[TIER 1 - UNLIMITED]** (always prefer this for documentation)
- **Live web/news search?** → `mcp__brave-search` **[TIER 2 - LIMITED]** (1/sec, 2,000/month quota)
- Persistent memory? → `mcp__memory` (knowledge graph, entities, relations)
- Local file ops? → `mcp__filesystem` (read, write, search files)
- Database operations? → `mcp__supabase` (DB + auth + storage + realtime + RLS)
- Browser automation? → `mcp__playwright` (testing, scraping, UI automation)
- Cloudflare operations? → `mcp__cloudflare` (KV, R2, D1, Workers, Pages)
- Cloudflare docs? → `mcp__cloudflare-docs` (documentation search)
- Error tracking/logs? → `mcp__sentry` (errors, traces, performance)
- Swarm coordination? → `mcp__claude-flow` (101 tools) OR `mcp__ruv-swarm` (30+ tools)

### 🔍 SEARCH STRATEGY: Two-Tier System

**TIER 1: Documentation & Reference (UNLIMITED)**
- Tool: `mcp__context7`
- Use for: Library docs, API references, code examples, tutorials
- No rate limits, no quotas
- **ALWAYS prefer this for documentation searches**

**TIER 2: Live Web Data (LIMITED)**
- Tool: `mcp__brave-search`
- Use for: News, trends, breaking changes, competitive research, live web data
- Rate limit: 1 query/second (STRICT - must wait 1+ second between calls)
- Monthly quota: 2,000 searches
- **Reserve for high-value queries only**

**Decision Tree:**
```
Need information?
  ├─ Library/framework docs? → Context7 (Tier 1, unlimited)
  ├─ Code in this codebase? → Grep/Read (unlimited)
  ├─ Live web/news/trends? → Brave Search (Tier 2, limited)
  └─ General knowledge? → Use Claude's training data
```

📚 **Complete Guide:** `/home/claude-flow/docs/BRAVE-SEARCH-USAGE-GUIDE.md`

**Always use explicit MCP calls:**
```
✅ "Use mcp__github to search for 'auth' in owner/repo"
❌ "Search for auth" (missing MCP specification)
```

📚 **Complete MCP Guide:** [MCP Reference Section](#mcp-reference-section) below

---

## 🎯 MCP REFERENCE SECTION

### 1. GitHub MCP (`mcp__github`)
**When:** Issues, PRs, code search, workflows, CI/CD
**Tools:** Repository ops, issue/PR management, code search, branch management

### 2. Brave Search MCP (`mcp__brave-search`) **[TIER 2 - LIMITED]**
**When:** Live web data, news, trends, competitive research (NOT for documentation - use Context7)
**Tools:** `brave_web_search`, `brave_local_search`
**Limits:** 1 query/second (STRICT), 2,000/month quota
**Strategy:** Reserve for HIGH-VALUE queries only. Always use Context7 for documentation instead.

**Rate Limit Enforcement:**
- MUST wait 1+ second between Brave Search calls
- Track monthly usage (don't exceed 2,000)
- Prefer Context7 for any documentation/library reference queries

**Available via API (not MCP):** Image search, video search, news search, AI chat

### 3. Memory MCP (`mcp__memory`)
**When:** User context, profiles, decisions, relationships
**Data:** Entities, Relations, Observations

### 4. Filesystem MCP (`mcp__filesystem`)
**When:** Local file management, bulk ops, cross-directory
**Tools:** Read/write, create/list dirs, move/rename, search

### 5. Supabase MCP (`mcp__supabase`)
**When:** Full-stack database operations, authentication, storage, realtime features
**Tools:** Database queries (SQL + PostgREST), user auth, file storage, realtime subscriptions, RLS policies
**Capabilities:** Query tables, manage auth, upload files, subscribe to changes, manage RLS policies

### 6. Playwright MCP (`mcp__playwright`)
**When:** Browser testing, web scraping, UI automation
**Tools:** Navigate, click, type, screenshot, execute JS

### 7. Context7 MCP (`mcp__context7`) **[TIER 1 - UNLIMITED]**
**When:** Library docs, framework docs, API references, code examples, tutorials
**Tools:** `resolve-library-id`, `get-library-docs`
**Strategy:** ALWAYS prefer this over Brave Search for documentation queries
**Benefits:** No rate limits, no quotas, version-specific docs, comprehensive coverage

**Supported Libraries:** Next.js, React, Vue, Angular, TypeScript, Python frameworks, and 1000+ more

### 8. Cloudflare MCP (`mcp__cloudflare`)
**When:** Cloudflare API operations, deployments, storage management
**Tools:** KV operations, R2 storage, D1 database, Workers deployment, Pages deployment
**Use Cases:** Deploy to Cloudflare Pages, manage KV store, upload to R2 buckets, query D1 databases

### 9. Sentry MCP (`mcp__sentry`)
**When:** Error tracking, debugging production issues, performance monitoring
**Tools:** View errors, analyze stack traces, check logs, monitor performance metrics
**Use Cases:** Debug production errors, analyze crash reports, track performance issues, inspect traces

### 10. Supabase MCP (`mcp__supabase`)
**When:** Full-stack database operations, authentication, storage, realtime features
**Tools:** Database queries (SQL + PostgREST), user auth, file storage, realtime subscriptions, RLS policies
**Use Cases:**
- Query database tables with type safety
- Manage user authentication and sessions
- Upload/download files to storage buckets
- Subscribe to real-time database changes
- Manage Row Level Security policies
- Execute database migrations
**Note:** This replaces the deprecated postgres MCP with full-featured database access

### 11. ruv-swarm MCP (`mcp__ruv-swarm`)
**When:** Enhanced swarm coordination, distributed task processing, neural training
**Tools:** 30+ tools including swarm_init, agent_spawn, task_orchestrate, neural_train, performance monitoring
**Use Cases:**
- Initialize mesh/hierarchical/ring swarm topologies
- Spawn specialized agents (researcher, coder, analyst, optimizer)
- Orchestrate complex multi-agent tasks
- Train neural patterns for optimization
- Monitor swarm performance and metrics
- Distributed autonomous agent coordination

### 12. Cloudflare Docs MCP (`mcp__cloudflare-docs`)
**When:** Searching Cloudflare documentation and API references
**Tools:** Documentation search across Workers, Pages, R2, KV, D1, etc.
**Use Cases:** Quick reference for Cloudflare API documentation and feature guides

📚 **Full MCP Details:** Each MCP has extensive capabilities. See inline for quick reference, or check `/home/claude-flow/docs/self-learning/MCP-DECISION-TREE.md` for complete guide.

---

## 🚀 AGENT EXECUTION

**Spawn agents with Task tool:**
```javascript
Task("Research agent", "Analyze requirements. Use brave-search for latest practices.", "researcher")
Task("Coder agent", "Implement features. Use context7 for docs.", "coder")
Task("Tester agent", "Create tests. Use playwright for E2E.", "tester")
```

**When to use claude-flow MCP:**
- Swarm coordination (`swarm_init`)
- Task orchestration (`task_orchestrate`)
- Neural training (`neural_train`)
- Performance tracking (`swarm_monitor`)

**Optional for most tasks.** Task tool suffices.

📚 **Complete Guide:** [Agent Execution Guide](/home/claude-flow/docs/agent-execution-guide.md)

---

## 📚 SPARC METHODOLOGY

**Commands:**
- `npx claude-flow sparc modes` - List modes
- `npx claude-flow sparc run <mode> "<task>"` - Execute mode
- `npx claude-flow sparc tdd "<feature>"` - TDD workflow
- `npx claude-flow sparc batch <modes> "<task>"` - Parallel execution

**Workflow Phases:**
1. Specification - Requirements analysis
2. Pseudocode - Algorithm design
3. Architecture - System design
4. Refinement - TDD implementation
5. Completion - Integration

**Build Commands:**
- `npm run build` - Build project
- `npm run test` - Run tests
- `npm run lint` - Linting
- `npm run typecheck` - Type checking

---

## 📖 DOCUMENTATION INDEX

### Communication & Reference
- [COMMUNICATION-CHEAT-SHEET.md](/home/claude-flow/docs/COMMUNICATION-CHEAT-SHEET.md) - Complete terminology, commands, patterns
- [QUICK-REFERENCE-CARD.md](/home/claude-flow/docs/QUICK-REFERENCE-CARD.md) - One-page printable cheat sheet
- [SWARM-VS-HIVE-VS-TASK-TOOL.md](/home/claude-flow/docs/SWARM-VS-HIVE-VS-TASK-TOOL.md) - Orchestration methods explained

### Core Standards
- [CODING-STANDARDS.md](/home/claude-flow/docs/CODING-STANDARDS.md) - Comprehensive standards
- [CSS-FRAMEWORK-GUIDE.md](/home/claude-flow/docs/CSS-FRAMEWORK-GUIDE.md) - Tailwind v4 + ShadCN/UI
- [SWARM-PROTOCOLS.md](/home/claude-flow/docs/SWARM-PROTOCOLS.md) - Hive coordination

### SAA Component Library
- [SAA-COMPONENT-LIBRARY-GUIDE.md](/home/claude-flow/docs/SAA-COMPONENT-LIBRARY-GUIDE.md) - 20 React components
- [SAA-COMPONENT-API-REFERENCE.md](/home/claude-flow/docs/SAA-COMPONENT-API-REFERENCE.md) - TypeScript API
- [COMPONENT-EDITOR-GUIDE.md](/home/claude-flow/docs/COMPONENT-EDITOR-GUIDE.md) - ComponentEditor usage
- [SAA-QUICK-START.md](/home/claude-flow/docs/SAA-QUICK-START.md) - 5-minute start

**Quick Reference:**
- Import: `import { CTAButton } from '@/components/saa'`
- Edit: Master Controller → Components → Edit button
- Preview: ComponentEditor → Preview tab (transparent background)

### Self-Learning System
- [ARCHITECTURE.md](/home/claude-flow/docs/self-learning/ARCHITECTURE.md) - System architecture
- [MCP-DECISION-TREE.md](/home/claude-flow/docs/self-learning/MCP-DECISION-TREE.md) - Complete MCP guide

**How it works:**
1. Pattern Detection - Identifies mistakes and patterns
2. Persistent Memory - Uses `mcp__memory` for storage
3. Auto-Optimization - Updates CLAUDE.md automatically
4. MCP Analytics - Tracks usage patterns
5. Feedback Loops - Post-task analysis via hooks

---

## 🎯 QUICK CHECKLISTS

### Pre-Task
- [ ] Run session initialization
- [ ] Check MCP requirements
- [ ] Load project registry
- [ ] Review relevant docs

### During Task
- [ ] Use explicit MCP calls
- [ ] Batch operations in one message
- [ ] Follow file organization rules
- [ ] Store results in memory MCP

### Post-Task
- [ ] Deploy to production (if applicable)
- [ ] Verify with production URLs
- [ ] Update memory MCP
- [ ] Run hooks for learning

---

## 📞 SUPPORT

- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues
- Documentation: https://github.com/ruvnet/claude-flow

---

**Remember:** You're in Claude Code. MCPs are powerful extensions - use them!
