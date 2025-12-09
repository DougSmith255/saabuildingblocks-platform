# Performance Improvements Tracker

**Current Scores (Dec 2024):**
- Desktop: 99
- Mobile: 98-99 (was 73)

---

## High Priority (Easy Wins)

### 1. Doug & Karrie Image Optimization
**Savings: ~70 KiB**
**Status:** DONE (Dec 2024)

~~The hero image is 107KB but displays at 639x355 on mobile. Currently serving 900x500.~~

**Fixed:** Switched to Cloudflare Images with responsive variants (mobile/tablet/desktop).
The image now uses srcset with 375w, 768w, and 1280w variants.

**File:** `packages/public-site/app/page.tsx` (line ~96)

---

### 2. Non-Composited Animations (box-shadow)
**Impact:** Smoother animations, reduced jank
**Status:** DONE (Dec 2024)

~~The `ctaLightPulse` and `cyberCardGoldPulse` animations use `box-shadow` which cannot be GPU-accelerated. Browser must repaint on every frame.~~

**Fixed:** Replaced box-shadow animation with opacity animation on pseudo-elements.
- Base glow is a static box-shadow (no animation overhead)
- Intensified glow layer uses `::after` pseudo-element with `opacity` animation
- GPU-accelerated via `will-change: opacity`

**Files changed:**
- `packages/public-site/app/globals.css` (ctaLightPulseOpacity keyframes)
- `packages/shared/components/saa/cards/CyberCardGold.tsx` (cyberCardGoldPulseOpacity)

---

### 3. Cloudflare Image Cache TTL
**Savings: Faster repeat visits (no re-downloads for 30 days)**
**Status:** DONE (Dec 2024)

~~Wolf pack image from imagedelivery.net has 2-day cache. Should be longer for static assets.~~

**Fixed:** Set browser_ttl to 2592000 (30 days) via Cloudflare Images API.
All images from imagedelivery.net now have `cache-control: public, max-age=2592000`.

---

## Medium Priority

### 4. Legacy JavaScript Polyfills
**Savings: ~14 KiB**
**Status:** ALREADY DONE

This was already configured! The `.browserslistrc` file targets modern browsers only:
- Chrome/Edge/Firefox >= 111
- Safari >= 16.4
- No IE11, no Opera Mini

**File:** `packages/public-site/.browserslistrc`

---

### 5. Unused JavaScript / Bundle Bloat
**Savings: ~549 KiB**
**Status:** DONE (Dec 2024)

~~The chunk with image mapping data was 765KB - the entire cloudflare-images-mapping.json was bundled into the client.~~

**Fixed:** Removed the JSON import from `lib/cloudflare-image-loader.ts`. The WordPress→Cloudflare URL transformation happens at build time (via sync-cloudflare-images.ts), so the mapping file is not needed at runtime. The loader now only handles variant selection (mobile/tablet/desktop).

**Result:** Largest chunk reduced from 765KB to 216KB. TBT reduced from 210-350ms to 0ms. Mobile score improved from 73 to 98-99.

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
