# Performance Improvements Tracker

**Current Scores (Dec 2024):**
- Desktop: 97
- Mobile: 73

---

## High Priority (Easy Wins)

### 1. Doug & Karrie Image Optimization
**Savings: ~70 KiB**
**Status:** TODO

The hero image is 107KB but displays at 639x355 on mobile. Currently serving 900x500.

**Fix Options:**
- A) Add smaller srcset sizes for mobile (recommended)
- B) Compress image more aggressively
- C) Use Cloudflare Image Resizing with fit=scale-down

**File:** `packages/public-site/app/page.tsx` (line ~96)

---

### 2. Non-Composited Animations (box-shadow)
**Impact:** Smoother animations, reduced jank
**Status:** TODO

The `ctaLightPulse` and `cyberCardGoldPulse` animations use `box-shadow` which cannot be GPU-accelerated. Browser must repaint on every frame.

**Affected Elements:**
- CTA button light bars (top/bottom glow pulse)
- CyberCardGold border pulse

**Fix Options:**
- A) Replace box-shadow animation with `filter: drop-shadow()` + opacity (partially composited)
- B) Use pseudo-element with background gradient + opacity animation (fully composited)
- C) Accept the tradeoff (visual effect worth the cost)

**Files:**
- `packages/public-site/app/globals.css` (ctaLightPulse keyframes)
- `packages/shared/components/saa/cards/CyberCardGold.tsx`

---

### 3. Cloudflare Image Cache TTL
**Savings: ~4 KiB on repeat visits**
**Status:** TODO (Cloudflare Dashboard)

Wolf pack image from imagedelivery.net has 2-day cache. Should be longer for static assets.

**Fix:** Configure in Cloudflare Dashboard:
1. Go to Cloudflare Dashboard → Images → Delivery Settings
2. Change "Browser TTL" from 2 days to 30 days (2592000 seconds)
3. This affects all images served via imagedelivery.net

Note: This cannot be configured via code - must be done in Cloudflare Dashboard.

---

## Medium Priority

### 4. Legacy JavaScript Polyfills
**Savings: ~14 KiB**
**Status:** Requires Next.js config change

Next.js includes polyfills for older browsers:
- Array.prototype.at
- Array.prototype.flat
- Array.prototype.flatMap
- Object.fromEntries
- Object.hasOwn
- String.prototype.trimStart/trimEnd

**Fix Options:**
- A) Set `browserslist` in package.json to target modern browsers only
- B) Add to next.config.js: `experimental: { legacyBrowsers: false }`
- C) Accept (14KB is small, ensures compatibility)

**File:** `packages/public-site/next.config.ts` or `package.json`

---

### 5. Unused JavaScript
**Savings: ~26 KiB**
**Status:** Investigate

The chunk `01bd51e4ce3f19a7.js` (68KB) has 26KB unused on homepage.

This is likely Next.js runtime + React that's needed for other pages but not fully used on homepage.

**Fix Options:**
- A) Audit dynamic imports - ensure components are properly code-split
- B) Check if any large libraries are imported but not used
- C) Accept (Next.js overhead, needed for navigation)

---

## Low Priority (Acceptable Tradeoffs)

### 6. LCP Element Render Delay (2,020ms mobile)
**Status:** Acceptable

LCP element is a text span (counter digit). The 2s delay is from:
- Font loading (Taskor)
- CSS parsing
- React hydration

Already optimized with:
- Static counter (server-rendered)
- Deferred star generation
- Font preloading

Further optimization would require removing visual features.

---

### 7. scrollbar-color Animation Warning
**Status:** Ignore

Lighthouse flags `scrollbar-color` as "non-composited animation" but this is a false positive - we're not animating scrollbar-color, it's just a CSS property being applied.

---

### 8. Long Main Thread Tasks (164ms, 65ms)
**Status:** Acceptable

Two tasks over 50ms threshold:
- 164ms: React hydration
- 65ms: Component initialization

These are within acceptable range and don't significantly impact interactivity.

---

### 9. 3rd Party Scripts
**Status:** Acceptable

Only Plausible Analytics (2KB, 4ms) - very lightweight and privacy-focused.
No action needed.

---

## Not Recommended

### 10. Remove Plausible Analytics
Would save 2KB but lose valuable analytics. Not worth it.

### 11. Remove smooth scroll (Lenis)
Would improve TBT slightly but significantly degrade UX.

### 12. Remove star background
Would improve performance but is core to brand identity.

---

## Implementation Notes

### Quick Wins to Implement First:
1. Image optimization (biggest savings: 70KB)
2. Box-shadow animation refactor (smoothness improvement)

### Requires Config Changes:
3. Cloudflare cache headers
4. Next.js browserslist config

### Accept As-Is:
5-12: Either minimal impact or would harm UX

---

## How to Test Changes

```bash
# Run Lighthouse locally
npx lighthouse https://saabuildingblocks.pages.dev/ --view

# Or use PageSpeed Insights
# https://pagespeed.web.dev/
```

---

*Last updated: December 2024*
