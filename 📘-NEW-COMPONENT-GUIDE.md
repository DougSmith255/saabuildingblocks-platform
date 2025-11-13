# 📘 New Component Setup Guide

**CRITICAL: Follow this checklist EXACTLY when adding new SAA components to the Master Controller**

This guide documents the complete process for adding a new component to the SAA Design System and Master Controller, including all common pitfalls and fixes discovered during the Generic Button implementation.

---

## ⚠️ Pre-Deployment Checklist

**BEFORE clicking "Commit & Push" in the Master Controller deployment tab:**

1. ✅ All files created/modified are staged in git
2. ✅ All utility dependencies are committed (see [Common Failures](#common-deployment-failures))
3. ✅ Component works in local preview
4. ✅ No TypeScript errors (`npm run type-check`)
5. ✅ Build succeeds locally (`npm run build`)

---

## Step-by-Step Component Creation

### 1. File Naming & Location

**CRITICAL: File naming affects imports and git tracking**

```bash
# ✅ CORRECT: PascalCase, no spaces
packages/shared/components/saa/buttons/GenericButton.tsx

# ❌ WRONG: Spaces in filename cause import issues
packages/shared/components/saa/buttons/Generic Button.tsx
```

**Monorepo Structure:**
```
/home/claude-flow/packages/
├── shared/               # Shared components (preferred location)
│   └── components/saa/
│       ├── buttons/
│       ├── cards/
│       ├── headings/
│       └── ...
├── public-site/         # Public site package
└── admin-dashboard/     # Master Controller package
```

---

### 2. Create the Component File

Example structure for a button component:

```typescript
// packages/shared/components/saa/buttons/GenericButton.tsx
'use client';

import React from 'react';

export interface GenericButtonProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
}

export function GenericButton({
  children,
  selected = false,
  onClick,
  className = '',
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
}: GenericButtonProps) {
  return (
    <>
      <button
        onClick={onClick}
        className={`filter-button ${className}`}
        data-selected={selected}
        aria-pressed={ariaPressed ?? selected}
        aria-label={ariaLabel}
      >
        {children}
      </button>
      <style jsx>{`
        /* Component styles */
      `}</style>
    </>
  );
}
```

---

### 3. Update Barrel Export (index.ts)

**Location:** Same directory as component

```typescript
// packages/shared/components/saa/buttons/index.ts

// ✅ CORRECT: Matches actual filename
export { GenericButton } from './GenericButton';

// ❌ WRONG: Spaces or mismatched name
export { GenericButton } from './Generic Button';
```

---

### 4. Add to Component Registry

**File:** `/home/claude-flow/packages/admin-dashboard/data/saa-component-registry.ts`

**CRITICAL PATH RULES:**
- ✅ Use relative paths: `../shared/components/...`
- ❌ Never use package aliases: `@saa/shared/...` (won't work with filesystem API)

```typescript
export const saaComponentRegistry: SAAComponent[] = [
  // ... existing components

  {
    id: 'generic-button',  // Unique kebab-case ID
    name: 'Generic Button',  // Display name
    category: 'buttons',  // Category for filtering
    description: 'Reusable filter/toggle button with active/inactive states',
    reactPath: '../shared/components/saa/buttons/GenericButton.tsx',  // ✅ Relative path
    converted: true,
    source: 'custom',  // or 'wordpress'
    tags: ['button', 'filter', 'toggle', 'generic'],  // Searchable tags
  },
];
```

---

### 5. Add Preview Mapping to ComponentEditor

**File:** `/home/claude-flow/packages/admin-dashboard/app/master-controller/components/ComponentEditor.tsx`

**Find the switch statement** (around line 219) and add your component case:

```typescript
switch (id) {
  // Buttons
  case 'cta-button':
    return lazy(() => import('@/components/saa/buttons/CTAButton').then(m => ({
      default: () => <m.CTAButton>Get Started</m.CTAButton>
    })));

  // ✅ ADD YOUR COMPONENT HERE
  case 'generic-button':
    return lazy(() => import('@saa/shared/components/saa/buttons/GenericButton').then(m => ({
      default: () => <m.GenericButton>Filter Option</m.GenericButton>
    })));

  // ... other cases
}
```

**Note:** This uses package alias `@saa/shared/...` (works for imports, not filesystem)

---

### 6. Check for Utility Dependencies

**CRITICAL: Missing utilities are the #1 cause of deployment failures**

**Common utilities that need to be committed:**

#### For Heading Components (H1, H2, Tagline):
```typescript
// If your component imports this:
import { extractPlainText } from '../../../utils/extractPlainText';

// You MUST ensure this file exists:
packages/shared/utils/extractPlainText.ts
packages/public-site/utils/extractPlainText.ts  // If used in public-site too
```

#### Check Before Committing:
```bash
# Find all untracked files
git status

# Look for untracked utils directories
Untracked files:
  packages/shared/utils/           # ⚠️ MUST COMMIT THIS
  packages/public-site/utils/      # ⚠️ MUST COMMIT THIS
```

---

### 7. Clear Cache & Rebuild

**Why:** Next.js caches component registry and imports

```bash
# Navigate to admin-dashboard
cd /home/claude-flow/packages/admin-dashboard

# Clear cache and rebuild
rm -rf .next && npm run build

# Restart PM2 service
su - claude-flow -c "cd /home/claude-flow && pm2 restart admin-dashboard"
```

---

### 8. Test Locally BEFORE Deployment

**Master Controller Tests:**

1. **Component appears in library:**
   - Go to https://saabuildingblocks.com/master-controller?tab=components
   - Filter by category or search for component name
   - Should appear in the grid

2. **Code tab loads:**
   - Click component → "Edit" button
   - Code tab should show component source
   - Check browser console for errors (F12)

3. **Preview tab works:**
   - Switch to Preview tab
   - Component should render with example props
   - No "Component not found" placeholder

**Console Debugging:**
```javascript
// Check browser console for these logs:
[ComponentEditor] Loading component: Generic Button
[ComponentEditor] Response status: 200
[ComponentEditor] Loaded code length: 3113 chars
```

---

### 9. Pre-Deployment File Check

**Run this BEFORE committing:**

```bash
cd /home/claude-flow

# Check what's uncommitted
git status

# Review EVERY modified/untracked file
# Common missed files:
# - packages/shared/utils/
# - packages/public-site/utils/
# - packages/public-site/lib/
# - Any new helper functions
```

---

### 10. Commit & Push

**Staging Strategy:**

```bash
# Stage component files
git add packages/shared/components/saa/buttons/GenericButton.tsx
git add packages/shared/components/saa/buttons/index.ts

# Stage registry changes
git add packages/admin-dashboard/data/saa-component-registry.ts
git add packages/admin-dashboard/app/master-controller/components/ComponentEditor.tsx

# ⚠️ CRITICAL: Stage ALL utility dependencies
git add packages/shared/utils/extractPlainText.ts
git add packages/public-site/utils/extractPlainText.ts

# Stage config changes (if any)
git add packages/admin-dashboard/package.json
git add ecosystem.config.js

# Commit with descriptive message
git commit -m "Add Generic Button component to Master Controller

- Created GenericButton.tsx with active/inactive states
- Added to component registry with correct relative path
- Added preview mapping to ComponentEditor
- Included all utility dependencies

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to trigger deployment
git push
```

---

## Common Deployment Failures

### ❌ Failure 1: Module Not Found - extractPlainText

**Error in CI/CD:**
```
Module not found: Can't resolve '../../../utils/extractPlainText'
./packages/shared/components/saa/headings/H1.tsx:4:1
```

**Cause:** Utility file not committed to git

**Fix:**
```bash
# Add the missing utility
git add packages/shared/utils/extractPlainText.ts

# If used in public-site too
git add packages/public-site/utils/extractPlainText.ts

git commit -m "Add missing extractPlainText utility"
git push
```

---

### ❌ Failure 2: Module Not Found - Blog API

**Error in CI/CD:**
```
Cannot find module '@/lib/wordpress/blog-api'
./app/real-estate-agent-job/page.tsx:24:32
```

**Cause:** New lib files not committed

**Fix:**
```bash
git add packages/public-site/lib/wordpress/blog-api.ts
git add packages/public-site/public/blog-posts.json
git add packages/public-site/scripts/generate-blog-posts-json.ts
git commit -m "Add missing WordPress blog integration files"
git push
```

---

### ❌ Failure 3: 403 Invalid File Path

**Error in Browser Console:**
```
[ComponentEditor] Response status: 403
[ComponentEditor] API error: { error: "Invalid file path" }
```

**Cause:** API security check blocking `../` path traversal

**File:** `/home/claude-flow/packages/admin-dashboard/app/api/master-controller/components/read/route.ts`

**Fix:**
```typescript
// BEFORE (blocks sibling packages)
const projectRoot = process.cwd();
if (!absolutePath.startsWith(projectRoot)) {
  return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
}

// AFTER (allows monorepo access)
const projectRoot = process.cwd();
const monorepoRoot = path.resolve(projectRoot, '..');
if (!absolutePath.startsWith(monorepoRoot)) {
  return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
}
```

---

### ❌ Failure 4: Preview Shows Placeholder

**Symptom:** Preview tab shows "Live Preview" placeholder instead of component

**Cause:** Component ID not added to ComponentEditor switch statement

**Fix:**
1. Open `/home/claude-flow/packages/admin-dashboard/app/master-controller/components/ComponentEditor.tsx`
2. Find the switch statement (line ~219)
3. Add case for your component ID
4. Rebuild: `rm -rf .next && npm run build`
5. Restart: `pm2 restart admin-dashboard`

---

### ❌ Failure 5: Code Tab Empty

**Symptom:** Clicking component shows empty code tab

**Causes & Fixes:**

1. **Wrong path in registry:**
   ```typescript
   // ❌ WRONG: Package alias
   reactPath: '@saa/shared/components/saa/buttons/GenericButton.tsx'

   // ✅ CORRECT: Relative path
   reactPath: '../shared/components/saa/buttons/GenericButton.tsx'
   ```

2. **Stale build cache:**
   ```bash
   cd packages/admin-dashboard
   rm -rf .next
   npm run build
   pm2 restart admin-dashboard
   ```

---

## GitHub Actions Workflow Status

**After pushing, monitor deployment:**

```bash
# Check workflow status
gh run list --limit 5

# View failed workflow logs
gh run view <run-id> --log-failed

# Re-trigger Cloudflare deployment after fixes
gh workflow run "Deploy to Cloudflare Pages"
```

**Expected Success Output:**
```
completed  success  Deploy to Cloudflare Pages
completed  success  CI Pipeline
completed  success  CodeQL Security Scan
```

---

## Quick Reference Checklist

**Before opening PR or deploying:**

- [ ] Component file created with PascalCase naming (no spaces)
- [ ] Barrel export updated in index.ts
- [ ] Component added to saa-component-registry.ts with **relative path**
- [ ] Preview case added to ComponentEditor.tsx switch statement
- [ ] All utility dependencies identified and staged
- [ ] Local build succeeds (`npm run build`)
- [ ] Local type-check passes (`npm run type-check`)
- [ ] Component appears in Master Controller locally
- [ ] Code tab loads component source
- [ ] Preview tab renders component correctly
- [ ] Git status shows NO untracked utils/ directories
- [ ] All changes committed and pushed
- [ ] CI/CD pipeline passes (GitHub Actions green)
- [ ] Cloudflare deployment succeeds
- [ ] Component works end-to-end in production

---

## File Locations Quick Reference

```
Master Controller Registry:
/home/claude-flow/packages/admin-dashboard/data/saa-component-registry.ts

Preview Mapping:
/home/claude-flow/packages/admin-dashboard/app/master-controller/components/ComponentEditor.tsx

API Security Check:
/home/claude-flow/packages/admin-dashboard/app/api/master-controller/components/read/route.ts

Shared Components:
/home/claude-flow/packages/shared/components/saa/

Component Utilities:
/home/claude-flow/packages/shared/utils/
/home/claude-flow/packages/public-site/utils/  (if needed)

PM2 Config:
/home/claude-flow/ecosystem.config.js
```

---

## When Things Go Wrong

**Deployment failed? Follow this debug process:**

1. **Check GitHub Actions logs:**
   ```bash
   gh run list --limit 5
   gh run view <failed-run-id> --log-failed
   ```

2. **Identify the error type:**
   - "Module not found" → Missing utility file
   - "Type error" → Missing types or incorrect import
   - "403 Invalid file path" → API security issue
   - Build fails locally → Clear cache, check dependencies

3. **Fix the issue:**
   - Add missing files to git
   - Update paths in registry
   - Clear .next cache
   - Commit and push fix

4. **Re-trigger deployment:**
   ```bash
   git add <missing-files>
   git commit -m "Fix: Add missing dependencies"
   git push
   gh workflow run "Deploy to Cloudflare Pages"
   ```

5. **Verify success:**
   - CI pipeline green
   - Cloudflare deployment green
   - Test component at https://saabuildingblocks.pages.dev

---

## Remember: The 2-Minute Rule

**If you can't find the component in the Master Controller within 2 minutes of committing, something went wrong.**

✅ **Good signs:**
- Component appears in filtered list
- Code tab loads instantly
- Preview renders without errors
- No console errors (F12)

❌ **Bad signs:**
- Component missing from library
- Empty code tab
- Preview shows placeholder
- 403 errors in console
- "Module not found" in CI logs

**When in doubt, check `git status` before committing!**

---

**Last Updated:** 2025-11-13
**Tested With:** Generic Button implementation (including all failure modes and fixes)
