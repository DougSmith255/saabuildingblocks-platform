# Debug Tracking: Scroll Animations & Header Scroll-Down

## Issue 1: Scroll Animations Not Working

### Problem
- Hero section push-back/fade animation not visible
- Section transition animations completely missing
- Both desktop and mobile affected

### Root Cause Analysis
**CONFIRMED via live HTML inspection (2024-12-13):**
- DOM had NESTED `<main>` elements which broke CSS selectors
- ALSO: `ScrollPerformanceOptimizer.tsx` was pausing ALL animations during scroll via `body.is-scrolling * { animation-play-state: paused !important; }`
- This broke scroll-driven animations because they MUST run during scroll

### What Was Tried
1. ❌ Added CSS selectors for `main > main > section` - DID NOT WORK
2. ❌ Added CSS selectors for `main#main-content > section` - DID NOT WORK
3. ❌ Added CSS selectors for `main > main > section:first-child` - DID NOT WORK
4. ✅ Fixed LayoutWrapper.tsx to use `<div>` instead of `<main>` - FIXED nested main issue
5. ✅ Updated globals.css to target `main#main-content > section` - CSS now applies correctly
6. ✅ Removed blanket `body.is-scrolling * { animation-play-state: paused }` - FIXED scroll animations being paused

### Fix Applied (2024-12-13)
Changed mobile scroll optimization in globals.css from pausing ALL animations to only pausing specific decorative animations:
- Star background animations
- CTA button light bars
- Cyber card gold frames

This allows scroll-driven section animations to run during scroll as intended.

### Verification (Playwright Test)
- `mainCount: 1` - Only one main element (correct)
- `firstSectionAnimationName: 'hero-scroll-out'` - Animation assigned
- `secondSectionAnimationName: 'section-scroll-in'` - Animation assigned
- `animationTimeline: 'view()'` - Scroll timeline set
- `animationPlayState: 'running'` - No longer paused!

### Current Status: FIXED (needs visual verification in browser)

---

## Issue 2: Header Scroll-Down on Navigation

### Problem
- When clicking internal links, header resets/scrolls down after navigation
- Affects: About eXp menu, Home link, SAA logo, "Get Started Now", "Watch Free Webinar"
- Does NOT affect: "Get Started" button (header), "Join the Alliance", "Learn More" (home page top)

### Root Cause Analysis
- Working buttons use Next.js `<Link>` component (client-side navigation)
- Broken buttons use `<a href>` tags (full page reload triggers header reset)
- The header entrance animation runs on every page load, including internal navigation

### What Was Tried
1. ❌ Updated SecondaryButton.tsx to use Next.js Link - MADE IT WORSE (broke button rendering)
2. ❌ Updated Footer.tsx to use Next.js Link - DID NOT TEST

### Why Previous Fixes Failed
- The pattern matching which buttons work vs don't work needs more investigation
- CTAButton (header "Get Started") works - it uses Link
- CTAButton (bottom "Get Started Now") does NOT work - WHY?

### Key Observation
Both "Get Started" (header) and "Get Started Now" (bottom) likely use CTAButton component.
If one works and one doesn't, the difference must be:
1. Different component entirely
2. Something in the parent context
3. A bug in my Link implementation (conditional logic)

### ACTUAL FIX NEEDED
1. Investigate which components are using `<a href>` vs `<Link>`
2. Ensure all internal links use Next.js `<Link>` for client-side navigation
3. May need to add logic to header to skip entrance animation on client-side navigation

### Current Status: NOT FIXED

---

## Files Modified (Need Review)
1. `/home/claude-flow/packages/shared/components/saa/buttons/SecondaryButton.tsx` - Added Link (may have broken it)
2. `/home/claude-flow/packages/public-site/components/shared/Footer.tsx` - Added Link
3. `/home/claude-flow/packages/public-site/app/terms-of-use/page.tsx` - Added Link
4. `/home/claude-flow/packages/public-site/app/globals.css` - Updated CSS selectors, fixed scroll pause
5. `/home/claude-flow/packages/public-site/app/components/LayoutWrapper.tsx` - Changed from `<main>` to `<div>`

---

## Next Steps
1. ✅ DONE: Fix scroll animations
2. IN PROGRESS: Fix header scroll by ensuring all internal links use Next.js Link
3. Test each fix individually before deploying
