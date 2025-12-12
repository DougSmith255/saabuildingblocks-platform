# Performance Optimization TODO

Based on code review analysis - December 12, 2025

## CRITICAL PRIORITY

### 1. CSS Bundle: 204KB
- [x] **INVESTIGATED** - CSS code-splitting doesn't work with `output: 'export'`
- `globals.css` has 4,047 lines
- 82 instances of expensive `backdrop-filter`, `box-shadow`, `filter`
- Blog styles (~2000 lines) load on ALL pages
- **Finding:** Next.js static export bundles all CSS together regardless of imports
- **Possible actions:**
  - Reduce unused CSS with PurgeCSS/Tailwind config
  - Remove duplicate animation keyframes (see item #8)
  - Consolidate `@apply` directives
- **Expected:** -30-50KB through CSS cleanup (not code-splitting)

### 2. JavaScript Chunk Analysis (COMPLETED)
- [x] **ANALYZED** - Ran `ANALYZE=true npm run build -- --webpack`
- Total client bundle: 1,318KB (parsed)
- **Breakdown of largest modules:**
  - react-dom: 364KB (unavoidable - framework)
  - LayoutWrapper + children: 48KB (Header 15KB, Footer 16KB, MobileMenu 8KB)
  - Page components: agent-portal 25KB, test-category-badge 24KB, online brokerage 22KB
  - BlogPageClient: 21KB
  - Lenis smooth scroll: 16KB
  - router.js: 22KB (Next.js internals)
- **@saa/shared is NOT a problem** - only 56KB total, well tree-shaken
  - Largest: CyberFrame 6KB, ShareButtons 5KB, IconLibrary 4KB
- **Third-party libs minimal:** Lenis 16KB, styled-jsx 8KB, scheduler 3KB
- **No action needed** - bundle is well-optimized, React/Next.js core is the bulk

### 3. StarBackground: 200 DOM nodes
- Each star is a `<div>` with inline styles
- We recently increased star count (+25 mobile, +50 desktop)
- **Action:** Consider reducing to 50-75 stars or Canvas implementation
- **Expected:** -150 DOM nodes, smoother scrolling

---

## HIGH PRIORITY

### 4. Header scroll handler runs every frame
- [x] **DONE** - Throttle/debounce scroll handler
- Added requestAnimationFrame throttling to scroll handler
- Now only updates once per frame instead of on every scroll event
- **File:** `/components/shared/Header.tsx`

### 5. Backdrop-filter overuse
- [x] **FALSE POSITIVE** - Code review incorrectly reported 28px blur
- Actual blur values are reasonable: 12px for glass, 4-6px for glows
- No action needed

### 6. Font `display: 'block'` on Taskor
- [x] **SKIP** - User decided to keep `display: 'block'`
- Taskor is the centerpiece font, tried swap before with no improvement
- Font is preloaded so block period is minimal anyway

### 7. BlogCard IntersectionObserver
- [x] **DONE** - Created shared IntersectionObserver hook
- Previously: Each card created its own observer (20+ instances)
- Now: Single shared observer for all blog cards
- **Files:**
  - `/components/blog/useSharedVisibility.ts` (new hook)
  - `/components/blog/BlogCard.tsx` (updated to use hook)

---

## MEDIUM PRIORITY

### 8. Excessive animation keyframes
- [x] **DONE** - Cleaned up unused/duplicate animations
- Removed: `hero-fade-in`, `hero-fade-in-up`, `fadeInUp2025` (2 copies), duplicate `fadeInUp`
- Removed dead CSS: `.hero-title-container`, `.hero-title`, `.section-title`

### 9. Heavy blog content CSS not code-split
- [x] **SKIP** - CSS code-splitting doesn't work with `output: 'export'`
- Next.js static export bundles all CSS together regardless of imports

### 10. Multiple client components could be server components
- 20+ files marked `'use client'`
- Some may not need client-side interactivity
- **Action:** Review each for necessity

---

## LOW PRIORITY / NICE-TO-HAVE

### 11. Reduce @apply usage (30 instances)
- Tailwind v4 discourages `@apply`
- Each generates duplicate CSS

### 12. Consolidate color variables
- Multiple systems: `--color-gold-*`, oklch, hex
- Some duplication

### 13. Image optimization opportunities
- Ensure all images go through Cloudflare loader
- Add `decoding="async"` to below-fold images

---

## ALREADY OPTIMIZED (No action needed)

- React Compiler enabled
- Lazy loading with skeletons
- Scroll animation pausing (globals.css:1302-1342)
- Cloudflare image optimization
- Font preloading
- Memoized BlogCard
- SessionStorage caching for stars
- Passive scroll listeners
- Console removal in production
- View Transitions API enabled
