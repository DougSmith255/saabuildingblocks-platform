# Token Vault Systematic Fix Plan

## Current Problems (Verified)

1. **Infinite XHR Loop** - Token fetch repeating every ~200ms
2. **Caching Issues** - Changes not visible across browsers
3. **Color Inconsistency** - Chrome shows yellow, Firefox shows correct colors
4. **Build vs Reality Mismatch** - Fixed code not being served

---

## ROOT CAUSE: CACHING

Everything stems from aggressive caching at multiple layers:
- Next.js production build cache
- Browser cache (HTML, CSS, JS)
- Cloudflare CDN cache (for Master Controller pages)

**SOLUTION:** Disable ALL caching for Master Controller admin routes

---

## Phase 1: Fix Caching (CRITICAL - DO THIS FIRST)

### Task 1.1: Add No-Cache Headers to Next.js Config
**File:** `next.config.ts`

Add headers configuration:
```typescript
async headers() {
  return [
    {
      // Master Controller - NO CACHE EVER
      source: '/master-controller/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        { key: 'Pragma', value: 'no-cache' },
        { key: 'Expires', value: '0' },
        { key: 'Surrogate-Control', value: 'no-store' },
        { key: 'CDN-Cache-Control', value: 'no-store' }
      ]
    },
    {
      // All API routes - NO CACHE
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }
      ]
    },
    {
      // JavaScript chunks for admin - NO CACHE
      source: '/_next/static/chunks/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
      ]
    }
  ]
}
```

### Task 1.2: Update Cloudflare Page Rules
**Action:** Set Cloudflare to bypass cache for `/master-controller/*`

Via Cloudflare Dashboard:
1. Go to Rules → Page Rules
2. Add rule: `saabuildingblocks.com/master-controller*`
3. Settings: Cache Level = Bypass

### Task 1.3: Force Clear All Caches
```bash
# 1. Delete Next.js cache
rm -rf .next

# 2. Rebuild completely
npm run build

# 3. Restart PM2 with --update-env
pm2 restart nextjs-saa --update-env

# 4. Clear browser caches (instructions for user)
# Chrome: DevTools → Network → Disable cache (keep open)
# Firefox: about:preferences#privacy → Clear Data
```

---

## Phase 2: Inspect Real Running Code (Use Browser DevTools)

### Task 2.1: Verify What JavaScript is Actually Running
**Tools:** Chrome DevTools → Sources tab

1. Open DevTools
2. Go to Sources → Page → saabuildingblocks.com → _next → static → chunks
3. Find the Token Vault chunk (search for "fetchTokens")
4. Verify the useEffect has empty dependency array `[]`
5. If not, caching is still active

### Task 2.2: Network Waterfall Analysis
**Tools:** Chrome DevTools → Network tab

1. Clear Network log
2. Navigate to Token Vault
3. Enter password and unlock
4. Watch Network tab for repeating XHR requests
5. Note:
   - Which request repeats?
   - What's the interval?
   - What triggers it? (Initiator column)

### Task 2.3: React DevTools Component Inspection
**Tools:** React DevTools → Components tab

1. Select TokenVaultTab component
2. Watch props and state
3. See what's triggering re-renders
4. Check if store subscriptions are causing loops

---

## Phase 3: Fix Infinite Loop (After Cache is Confirmed Fixed)

### Task 3.1: Identify Loop Source from Browser Inspection
Based on Network tab initiator, fix the actual source:

**Possible sources:**
1. useEffect with wrong dependencies
2. Zustand store subscription triggering re-renders
3. Component state update causing re-fetch
4. Parent component re-rendering child

### Task 3.2: Apply Fix and Verify
1. Make code changes
2. Build
3. Restart PM2
4. Hard refresh browser (Ctrl+Shift+R)
5. Verify in Network tab that XHR requests stop

---

## Phase 4: Fix Color Consistency

### Task 4.1: Inspect CSS Load Order
**Tools:** Chrome DevTools → Elements → Computed Styles

1. Inspect heading element
2. Check which CSS rule is applying the yellow color
3. Compare with Firefox
4. Check CSS load order in Network tab

### Task 4.2: Fix CSS Specificity or Load Order
Based on findings, either:
- Fix CSS specificity
- Ensure Master Controller CSS loads after other styles
- Remove conflicting yellow color rule

---

## Phase 5: Test Everything

### Task 5.1: Test in Clean Browsers
1. Chrome Incognito
2. Firefox Private Window
3. Verify:
   - No infinite XHR loop
   - Colors consistent
   - Password unlocks vault
   - Token list shows (empty state)

---

## Success Criteria

- ✅ Master Controller changes visible immediately (no cache)
- ✅ No infinite XHR requests after unlock
- ✅ Colors identical in Chrome and Firefox
- ✅ Token Vault unlocks with password "Dstv666666."
- ✅ Empty token list displays after unlock

---

## Agents Assignment

**Agent 1 (Backend-Dev):** Phase 1 - Fix caching configuration
**Agent 2 (Coder):** Phase 2 - Browser DevTools inspection
**Agent 3 (Analyst):** Phase 3 - Identify and fix infinite loop
**Agent 4 (Tester):** Phase 5 - Test in clean browsers

---

**CRITICAL RULE:** After Phase 1 (caching fix), ALL subsequent work must be verified in browser DevTools, NOT just by reading build files.
