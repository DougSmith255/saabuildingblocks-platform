# Hero Effect Fade Issue - Debug Tracking

## Problem Statement
On mobile, animation effects (RevealMaskEffect, AsteroidBeltEffect, etc.) and gradient backgrounds are **compressing/scaling** along with the rest of the hero content instead of **only fading**.

The expected behavior:
- Hero CONTENT (text, images, buttons): should shrink, blur, and fade
- Hero EFFECTS (animation, gradient): should ONLY FADE - no scale, no blur, no transform

## Affected Pages
- Home page (RevealMaskEffect)
- All pages using AsteroidBeltEffect
- All pages using grid effects (LaserGridEffect, GreenLaserGridEffect)

## Root Cause Analysis

### Finding 1: CSS Scroll-Timeline Animation
Located in `/app/globals.css` lines 109-116:

```css
@supports (animation-timeline: scroll()) {
  body:not([data-no-section-transitions]) .fixed-hero-wrapper section {
    animation: hero-scroll-out ease-out both;
    animation-timeline: scroll(root);
    animation-range: 0px 100vh;
  }
}
```

The `hero-scroll-out` keyframes (lines 96-105):
```css
@keyframes hero-scroll-out {
  0% { transform: scale(1) translateY(0); filter: blur(0) brightness(1); opacity: 1; }
  100% { transform: scale(0.6) translateY(-15px); filter: blur(8px) brightness(0.2); opacity: 0; }
}
```

**Problem**: This CSS animation applies `scale()`, `translateY()`, `blur()`, and `brightness()` to the **entire section**, including child effect layers that should only fade.

### Finding 2: JavaScript Wrappers
Both `FixedHeroWrapper.tsx` and `StickyHeroWrapper.tsx` have JavaScript that:
1. Queries for `.hero-effect-layer` elements
2. Sets only `opacity` and `visibility` on those elements

However, the CSS scroll-timeline animation applies transforms to the parent `<section>`, which affects all children regardless of JavaScript settings.

## Attempted Fixes

### Attempt 1: Timing Fix (REVERTED)
**Date**: Previous session
**Hypothesis**: Dynamic imports load after initial `handleScroll()` call, so effects aren't found
**Change**: Added setTimeout delays (100ms, 300ms, 600ms) to re-run handleScroll
**File**: `StickyHeroWrapper.tsx`
**Result**: Did not fix the issue
**Status**: REVERTED

### Attempt 2: Remove CSS scroll-timeline, use JS only (TESTING)
**Date**: 2024-12-14
**Hypothesis**: CSS scroll-timeline applies transforms to entire section, overriding JS control of effect layers
**Change**: Removed `hero-scroll-out` keyframes and `@supports (animation-timeline: scroll())` block for hero
**File**: `globals.css` (lines 88-142 replaced with comment and z-index rules only)
**Rationale**:
- CSS scroll-timeline only works in Chrome/Edge, not Firefox/Safari
- JS already handles all browsers and has fine-grained control
- Two competing animation systems were causing the bug
- JS can treat `.hero-effect-layer` differently from content (opacity only vs scale/blur/fade)
**Result**: TESTING
**Status**: IN PROGRESS

---

## Proposed Solutions (Not Yet Tried)

### Solution A: Exclude Effect Layers from CSS Animation
Add CSS to override the transform for effect layers:

```css
@supports (animation-timeline: scroll()) {
  .fixed-hero-wrapper .hero-effect-layer {
    animation: none !important;
    transform: none !important;
    filter: none !important;
    /* Let JavaScript handle opacity only */
  }
}
```

**Pros**: Simple CSS fix, doesn't change JS logic
**Cons**: May create visual inconsistency if CSS and JS get out of sync

### Solution B: Remove CSS Scroll-Timeline Entirely
Remove or disable the CSS scroll animation and rely solely on JavaScript.

**Pros**: Single source of truth (JavaScript)
**Cons**: May affect browsers where CSS scroll-timeline performs better

### Solution C: Move Effects Outside Section
Restructure the DOM so effect layers are siblings of the section, not children.

**Pros**: Clean separation
**Cons**: Requires significant refactoring of multiple components

### Solution D: Use CSS Custom Properties
Have JavaScript set CSS custom properties that the CSS animation uses, with different values for content vs effects.

**Pros**: Single animation system
**Cons**: More complex implementation

---

## Technical Details

### Element Structure (Home Page)
```
FixedHeroWrapper
  └── div.fixed-hero-wrapper (position: fixed)
        └── section
              ├── RevealMaskEffect (.hero-effect-layer) <- Should only fade
              ├── .hero-content-wrapper <- Should shrink/blur/fade
              │     ├── Image
              │     ├── H1
              │     ├── Tagline
              │     └── Buttons
              └── CounterAnimation
```

### CSS Specificity
- `hero-scroll-out` on section: applies to ALL children via CSS inheritance for transform
- JavaScript on `.hero-effect-layer`: applies inline styles

CSS transforms on parent elements affect the rendering of child elements, even if those children have different inline styles.

---

## Next Steps
1. Test Solution A first (least invasive)
2. If that fails, try Solution B
3. Document results for each attempt

---

## Notes
- CSS `animation-timeline: scroll()` is only supported in Chrome/Edge (not Firefox/Safari)
- The JavaScript scroll handlers are the fallback for unsupported browsers
- Mobile browsers that support scroll-timeline will use CSS; others use JS
