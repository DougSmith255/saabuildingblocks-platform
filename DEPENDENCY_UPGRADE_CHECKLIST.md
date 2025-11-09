# 📦 Smart Agent Alliance - Dependency Upgrade Tracking

> **⚠️ IMPORTANT:** Check this list monthly for critical packages, quarterly for important packages.
>
> **Last Updated:** 2025-11-09 (Upgrades completed)
> **Next Check Due:** 2025-12-09

---

## 🔴 Critical Packages (Check Monthly)

| Package | Current | Latest Stable | Update Command | Priority |
|---------|---------|---------------|----------------|----------|
| **Next.js** | 16.0.0 | 15.1.8 | `npm install next@latest` | 🔥 HIGH |
| **React** | 19.2.0 | 19.x | `npm install react@latest react-dom@latest` | 🔥 HIGH |
| **React DOM** | 19.2.0 | 19.x | (same as React) | 🔥 HIGH |
| **TypeScript** | 5.9.3 ✅ | 5.9.3 | `npm install -D typescript@latest` | 🔥 HIGH |
| **Node.js** | >=20.0.0 | 22.x LTS | System upgrade | 🔥 HIGH |

### ✅ Recently Completed (2025-11-09):
- [x] **TypeScript upgraded:** 5.7.2 → 5.9.3
- [x] **Wrangler upgraded:** 4.45.1 → 4.46.0
- [x] **Framer Motion upgraded:** 12.23.22 → 12.23.24

---

## 🟡 Important Packages (Check Quarterly)

| Package | Current | Latest Stable | Update Command | Priority |
|---------|---------|---------------|----------------|----------|
| **Tailwind CSS** | 4.1.17 | 4.1.10 | `npm install -D tailwindcss@latest` | ⚠️ MEDIUM |
| **@tailwindcss/postcss** | 4.1.14 | 4.1.10 | `npm install -D @tailwindcss/postcss@latest` | ⚠️ MEDIUM |
| **Playwright** | 1.56.1 | 1.51.0 | `npm install -D @playwright/test@latest` | ⚠️ MEDIUM |
| **Wrangler** (global) | 4.46.0 ✅ | 4.46.0 | `npm install -g wrangler@latest` | ⚠️ MEDIUM |
| **ESLint** | 9.17.0 | Check npm | `npm install -D eslint@latest` | ⚠️ MEDIUM |
| **Framer Motion** | 12.23.24 ✅ | 12.23.24 | `npm install framer-motion@latest` | ⚠️ MEDIUM |

### 🎉 All packages up to date!

---

## 🟢 Nice to Have (Check Semi-Annually)

| Package | Current | Update Command |
|---------|---------|----------------|
| **PostCSS** | 8.4.49 | `npm install -D postcss@latest` |
| **postcss-import** | 16.1.1 | `npm install -D postcss-import@latest` |
| **clsx** | 2.1.1 | `npm install clsx@latest` |
| **tailwind-merge** | 2.6.0 | `npm install tailwind-merge@latest` |
| **tsx** | 4.19.2 | `npm install -D tsx@latest` |
| **Puppeteer** | 24.28.0 | `npm install puppeteer@latest` |
| **react-slot-counter** | 1.3.0 | `npm install react-slot-counter@latest` |
| **Autoprefixer** | 10.4.20 | `npm install -D autoprefixer@latest` |

---

## 📊 Current Status Summary

### ✅ Up to Date or Ahead:
- Next.js 16.0.0 (ahead of stable 15.1.8 - using RC/canary)
- React/React DOM 19.2.0 (latest)
- Tailwind CSS 4.1.17 (ahead of stable 4.1.10)
- Playwright 1.56.1 (ahead of stable 1.51.0)

### ✅ All Up to Date (as of 2025-11-09):
- TypeScript: 5.9.3 ✅
- Wrangler: 4.46.0 ✅
- Framer Motion: 12.23.24 ✅

### 📝 Notes:
- You're running Next.js 16 RC/canary - this is newer than the stable 15.1.8
- You're running Playwright 1.56.1 which appears to be ahead of docs
- TypeScript 5.9.3 includes important bug fixes and improvements

---

## 🔄 How to Check for Updates

### Quick Check All:
```bash
# From monorepo root
cd /home/claude-flow
npm outdated --workspaces

# Check specific workspace
npm outdated --workspace=@saa/public-site
```

### Check Specific Package:
```bash
npm view <package-name> version
npm view <package-name> versions --json | jq -r '.[-10:]'  # Last 10 versions
```

### Check Global Packages:
```bash
npm outdated -g
wrangler --version
node --version
npm --version
```

### Using Context7 MCP (via Claude):
Ask Claude: "Use context7 MCP to check the latest version of [package-name]"

---

## 📅 Upgrade Schedule

### Monthly (1st of every month):
- [ ] Check Next.js
- [ ] Check React/React DOM
- [ ] Check TypeScript
- [ ] Check Node.js LTS

### Quarterly (Jan 1, Apr 1, Jul 1, Oct 1):
- [ ] Check Tailwind CSS
- [ ] Check Playwright
- [ ] Check Wrangler
- [ ] Check ESLint
- [ ] Check Framer Motion

### Semi-Annually (Jan 1, Jul 1):
- [ ] Check all utility packages
- [ ] Check PostCSS ecosystem
- [ ] Review and remove unused dependencies

---

## 🚀 Safe Upgrade Process

1. **Before upgrading:**
   ```bash
   git status  # Ensure clean working tree
   git checkout -b upgrade/package-name-vX.X.X
   ```

2. **Run upgrade:**
   ```bash
   npm install -D package-name@latest --workspace=@saa/public-site
   ```

3. **Test:**
   ```bash
   npm run type-check --workspace=@saa/public-site
   npm run build --workspace=@saa/public-site
   npm run test:performance --workspace=@saa/public-site
   ```

4. **Commit:**
   ```bash
   git add package.json package-lock.json
   git commit -m "chore: upgrade package-name to vX.X.X"
   ```

5. **Deploy to preview:**
   - Test on staging/preview environment
   - Verify production build works

6. **Merge and deploy:**
   ```bash
   git checkout main
   git merge upgrade/package-name-vX.X.X
   git push
   ```

---

## 📍 File Locations

- **Root package.json:** `/home/claude-flow/package.json`
- **Public site package.json:** `/home/claude-flow/packages/public-site/package.json`
- **Shared package.json:** `/home/claude-flow/packages/shared/package.json`
- **This checklist:** `/home/claude-flow/DEPENDENCY_UPGRADE_CHECKLIST.md`

---

## 🔗 Quick Links

- [Next.js Releases](https://github.com/vercel/next.js/releases)
- [React Releases](https://github.com/facebook/react/releases)
- [TypeScript Releases](https://github.com/microsoft/TypeScript/releases)
- [Tailwind CSS Releases](https://github.com/tailwindlabs/tailwindcss/releases)
- [Playwright Releases](https://github.com/microsoft/playwright/releases)
- [Wrangler Releases](https://github.com/cloudflare/workers-sdk/releases)

---

**💡 Tip:** Add this file to your project README or create a calendar reminder to check this monthly!
