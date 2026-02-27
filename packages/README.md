# SAA Monorepo Packages

**Project**: Smart Agent Alliance (SAA) Platform
**Structure**: npm workspaces monorepo
**Node Version**: 20.x
**Package Manager**: npm 10.x

## 📦 Package Structure

This monorepo contains 3 packages:

```
packages/
├── shared/           # @saa/shared - Shared utilities & components
├── public-site/      # @saa/public-site - Public-facing static site
└── admin-dashboard/  # @saa/admin-dashboard - Admin dashboard app
```

## 🎯 Package Overview

### @saa/shared
**Type**: Library package
**Purpose**: Shared code used by both public-site and admin-dashboard

**Contents**:
- Common components
- Utility functions
- Type definitions
- Shared constants

**Import Example**:
```typescript
import { Button } from '@saa/shared/components';
import { formatDate } from '@saa/shared/utils';
```

**Build**: Not independently built (imported by other packages)

---

### @saa/public-site
**Type**: Next.js 16 application (static export)
**Purpose**: Public-facing website deployed to Cloudflare Pages

**Features**:
- ✅ Static HTML export (`output: 'export'`)
- ✅ Master Controller CSS pre-generation
- ✅ WordPress blog integration (ISR)
- ✅ Global CDN deployment (300+ locations)
- ✅ 20-50ms TTFB worldwide

**Technologies**:
- Next.js 16 (App Router + Turbopack)
- Tailwind CSS v4
- TypeScript 5
- React 19

**Build Commands**:
```bash
# Development mode
npm run dev --workspace=@saa/public-site

# Generate Master Controller CSS
npm run generate:css --workspace=@saa/public-site

# Production build (static export)
npm run build --workspace=@saa/public-site

# Preview production build
npm run start --workspace=@saa/public-site
```

**Deployment**:
- **Platform**: Cloudflare Pages
- **URL**: https://saabuildingblocks.pages.dev
- **Trigger**: GitHub Actions workflow (`.github/workflows/deploy-cloudflare.yml`)
- **Build Output**: `packages/public-site/out/`

**Key Files**:
- `next.config.ts` - Dynamic config (for development/VPS)
- `next.config.static.ts` - Static export config (for Cloudflare)
- `public/static-master-controller.css` - Generated from Supabase settings

---

### @saa/admin-dashboard
**Type**: Next.js 16 application (dynamic)
**Purpose**: Admin dashboard with Master Controller and role management

**Features**:
- ✅ Master Controller UI (typography, colors, spacing, components)
- ✅ Agent Portal (role-based access control)
- ✅ Authentication system (login/signup/invitations)
- ✅ 43 API routes (database operations, webhooks)
- ✅ Real-time features
- ✅ Supabase integration

**Technologies**:
- Next.js 16 (App Router + Turbopack)
- Tailwind CSS v4
- TypeScript 5
- React 19
- Supabase (PostgreSQL + Auth)

**Build Commands**:
```bash
# Development mode
npm run dev --workspace=@saa/admin-dashboard

# Production build (dynamic)
npm run build --workspace=@saa/admin-dashboard

# Start production server
npm run start --workspace=@saa/admin-dashboard
```

**Deployment**:
- **Platform**: VPS (PM2 process manager)
- **URL**: https://saabuildingblocks.com
- **Process**: Manual deployment (automated workflow TBD)
- **Build Output**: `packages/admin-dashboard/.next/`

**Key Files**:
- `next.config.ts` - Dynamic config with API routes
- `app/api/` - 43 API route handlers
- `app/master-controller/` - Master Controller UI
- `app/agent-portal/` - Agent Portal UI

---

## 🚀 Quick Start

### Initial Setup

```bash
# Clone repository
git clone [repo-url]
cd [repo-name]

# Install all dependencies (monorepo + all packages)
npm install

# Verify installation
npm run build --workspaces
```

### Development Workflow

**Run both packages in development**:
```bash
# Terminal 1: Public-site (port 3000)
npm run dev --workspace=@saa/public-site

# Terminal 2: Admin-dashboard (port 3001)
npm run dev --workspace=@saa/admin-dashboard
```

**Run specific package**:
```bash
# Start public-site only
npm run dev -w @saa/public-site

# Start admin-dashboard only
npm run dev -w @saa/admin-dashboard
```

**Lint all packages**:
```bash
npm run lint --workspaces
```

**Build all packages**:
```bash
npm run build --workspaces
```

### Environment Variables

**Root `.env` file** (shared by all packages):
```bash
# Supabase (shared)
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# WordPress (public-site only)
WORDPRESS_API_URL=https://wp.saabuildingblocks.com/wp-json
NEXT_PUBLIC_WORDPRESS_API_URL=https://wp.saabuildingblocks.com/wp-json
WORDPRESS_USER=[username]
WORDPRESS_APP_PASSWORD=[app-password]

# n8n (optional)
N8N_WEBHOOK_URL=https://n8n.saabuildingblocks.com/webhook/...
```

**Package-specific** `.env.local` files (optional):
- `packages/public-site/.env.local`
- `packages/admin-dashboard/.env.local`

---

## 📋 Common Commands

### Workspace Commands

```bash
# List all workspaces
npm ls --workspaces

# Run command in specific workspace
npm run [script] --workspace=@saa/[package-name]
# OR shorthand:
npm run [script] -w @saa/[package-name]

# Run command in all workspaces
npm run [script] --workspaces

# Add dependency to specific workspace
npm install [package] --workspace=@saa/[package-name]

# Add dependency to root (shared by all)
npm install [package] -w root
```

### Build Commands

```bash
# Build public-site (static export)
npm run build -w @saa/public-site

# Build admin-dashboard (dynamic)
npm run build -w @saa/admin-dashboard

# Build all packages
npm run build --workspaces

# Clean build artifacts
npm run clean --workspaces
```

### Lint & Type Check

```bash
# Lint specific package
npm run lint -w @saa/public-site

# Lint all packages
npm run lint --workspaces

# Type check specific package
npm run typecheck -w @saa/admin-dashboard

# Type check all packages
npm run typecheck --workspaces
```

---

## 🚀 Deployment

### Public-Site → Cloudflare Pages

**Automated via GitHub Actions**:
1. Push to `main` branch
2. Workflow triggers: `.github/workflows/deploy-cloudflare.yml`
3. Builds static export
4. Deploys to Cloudflare Pages
5. Live at: https://saabuildingblocks.pages.dev

**Manual Deployment**:
```bash
cd packages/public-site

# Generate CSS from Supabase
npm run generate:css

# Build static export
npm run build

# Deploy to Cloudflare
npx wrangler pages deploy out --project-name=saabuildingblocks --branch=main
```

### Admin-Dashboard → VPS

**Manual Deployment** (automated workflow coming):
```bash
# SSH into VPS
ssh user@saabuildingblocks.com

# Navigate to admin-dashboard
cd /home/ubuntu/saabuildingblocks-platform/packages/admin-dashboard

# Pull latest changes
git pull

# Install dependencies (if package.json changed)
npm ci

# Build production
npm run build

# Restart PM2 process
pm2 restart admin-dashboard

# Verify
pm2 status
curl -I https://saabuildingblocks.com
```

**PM2 Configuration**:
```json
{
  "name": "admin-dashboard",
  "script": "npm",
  "args": "start",
  "cwd": "/home/ubuntu/saabuildingblocks-platform/packages/admin-dashboard",
  "env": {
    "NODE_ENV": "production",
    "PORT": "3000"
  }
}
```

---

## 🏗️ Architecture

### Monorepo Structure

```
/
├── .github/
│   └── workflows/
│       ├── deploy-cloudflare.yml    # Deploy public-site to Cloudflare
│       └── ci.yml                   # Lint, typecheck, build all packages
│
├── packages/
│   ├── shared/                      # @saa/shared
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── public-site/                 # @saa/public-site
│   │   ├── app/                     # Next.js App Router
│   │   ├── components/              # React components
│   │   ├── public/                  # Static assets
│   │   ├── next.config.ts           # Dynamic config
│   │   ├── next.config.static.ts    # Static export config
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── admin-dashboard/             # @saa/admin-dashboard
│       ├── app/                     # Next.js App Router
│       │   ├── api/                 # API routes (43 total)
│       │   ├── master-controller/   # Master Controller UI
│       │   └── agent-portal/        # Agent Portal
│       ├── components/              # React components
│       ├── lib/                     # Utilities & helpers
│       ├── next.config.ts           # Dynamic config
│       ├── package.json
│       └── tsconfig.json
│
├── package.json                     # Root workspace config
├── package-lock.json                # Lockfile for entire monorepo
└── tsconfig.json                    # Root TypeScript config

```

### Deployment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Git Repository                         │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────────┐
│ Public-Site   │         │ Admin-Dashboard  │
│ (Static)      │         │ (Dynamic)        │
└───────┬───────┘         └────────┬─────────┘
        │                          │
        │ GitHub Actions           │ Manual PM2
        │ (automated)              │ (manual)
        ▼                          ▼
┌────────────────────┐    ┌──────────────────┐
│ Cloudflare Pages   │    │ VPS Server       │
│ 300+ locations     │    │ Single location  │
│ 20-50ms TTFB       │    │ 150-300ms TTFB   │
│ Static content     │    │ Master Controller│
└────────────────────┘    └──────────────────┘
```

### Shared Dependencies

Both packages share:
- Next.js 16
- React 19
- Tailwind CSS v4
- TypeScript 5
- Supabase client libraries

Managed via root `package.json` with workspaces.

---

## 🔧 Troubleshooting

### Issue: "Cannot find module '@saa/shared'"

**Cause**: Workspace dependencies not linked

**Solution**:
```bash
# Re-install from root
npm install

# Or rebuild workspace links
npm run postinstall
```

### Issue: Build fails with Supabase error

**Cause**: Environment variables not set or Supabase initialized at module level

**Solution**:
```bash
# Check .env file exists
ls -la .env

# Verify Supabase environment variables
grep SUPABASE .env

# Ensure API routes use lazy initialization (not module level)
```

### Issue: TypeScript errors in one package

**Solution**:
```bash
# Type check specific package
npm run typecheck -w @saa/[package-name]

# Build TypeScript declarations
npm run build -w @saa/shared
```

### Issue: Port already in use

**Solution**:
```bash
# Kill process on port 3000
npx kill-port 3000

# Or run on different port
PORT=3001 npm run dev -w @saa/public-site
```

---

## 📚 Additional Documentation

- **Dual Deployment Architecture**: `/home/ubuntu/saabuildingblocks-platform/docs/DUAL-DEPLOYMENT-ARCHITECTURE.md`
- **Production Safety Rules**: `/home/ubuntu/saabuildingblocks-platform/docs/PRODUCTION-SAFETY-RULES.md`
- **GitHub Actions Update**: `/home/ubuntu/saabuildingblocks-platform/GITHUB-ACTIONS-MONOREPO-UPDATE.md`
- **Cloudflare Test Plan**: `/home/ubuntu/saabuildingblocks-platform/CLOUDFLARE-DEPLOYMENT-TEST-PLAN.md`
- **Coding Standards**: `/home/ubuntu/saabuildingblocks-platform/docs/CODING-STANDARDS.md`

---

## 🎯 Success Metrics

**Monorepo Migration Goals**:
- ✅ Separate concerns (public vs admin)
- ✅ Shared code reusability
- ✅ Independent deployment pipelines
- ✅ Type safety across packages
- ✅ Simplified dependency management

**Performance Targets**:
- **Public-Site**: TTFB < 100ms globally (Cloudflare edge)
- **Admin-Dashboard**: TTFB < 200ms (VPS single location)
- **Build Time**: < 15s per package
- **CI Pipeline**: < 5 minutes total

---

## 📞 Support

- **Documentation**: See `/home/ubuntu/saabuildingblocks-platform/docs/` directory
- **Issues**: Check CLAUDE.md for session context
- **Build Errors**: Review package-specific README files

---

**Last Updated**: 2025-10-28
**Status**: ✅ **MONOREPO MIGRATION COMPLETE**
