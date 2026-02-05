# Scroll Lock When Overlays Are Open — Status Tracker

## Problem
When popup panels (slide panels) or the mobile menu are open, the mouse wheel scrolls the page behind the overlay instead of scrolling the overlay content.

## Root Cause
Lenis smooth scroll library intercepts all wheel events at the window level. When an overlay opens, `overflow: hidden` is set on body/html to prevent native scrolling, but Lenis bypasses this since it manages scrolling independently.

## Components Affected
| Component | File | Overlay Type |
|-----------|------|-------------|
| Mobile Menu | `packages/public-site/components/shared/MobileMenu.tsx` | Full-screen menu overlay |
| SlidePanel (public) | `packages/public-site/components/shared/SlidePanel.tsx` | Side panel (Inside Look, Join Alliance, Freebies) |
| SlidePanel (shared) | `packages/shared/components/saa/interactive/SlidePanel.tsx` | Side panel (used by various forms) |
| Agent Attraction Panels | `packages/public-site/functions/[slug].js` | Inlined calculator/revshare panels (Cloudflare Function, NO Lenis) |

## What Has Been Tried

### Attempt 1: `lenis.stop()` via MutationObserver (PARTIALLY WORKED)
**File:** `packages/public-site/components/SmoothScroll.tsx`
**Approach:** Added a MutationObserver watching `<html>` and `<body>` for `overflow: hidden`. When detected, called `lenis.stop()`. When cleared, called `lenis.start()`.
**Result:** Stopped the page from scrolling behind the mobile menu, BUT also prevented the mouse wheel from scrolling the menu itself. Users had to use the scrollbar. Lenis likely still calls `preventDefault()` on wheel events even when stopped.
**Status:** REVERTED

### Attempt 2: `data-lenis-prevent` attribute (CURRENT)
**File:** All overlay components listed above
**Approach:** Added `data-lenis-prevent` attribute to the outermost overlay div in MobileMenu and both SlidePanel components. This is Lenis's official API for telling it to skip wheel event processing on specific elements, allowing native scroll to work.
**Result:** TESTING
**Status:** Deployed, awaiting feedback

## What Has NOT Been Tried Yet
- `data-lenis-prevent-wheel` (more specific than `data-lenis-prevent`)
- Combining `data-lenis-prevent` with `lenis.stop()` (prevent on overlay + stop background)
- Custom wheel event handler on overlays that calls `event.stopPropagation()`
- Lenis `prevent` callback option (function-based prevention)
- Completely destroying and recreating Lenis when overlays open/close

## Agent Attraction Page (`[slug].js`) — Separate Issue
The `[slug].js` Cloudflare Function does NOT use Lenis (it's standalone, no Next.js layout). Scroll-through on its panels is a different issue — likely missing `overflow: hidden` on body or missing `overscroll-behavior: contain` on the panel. This needs separate investigation.

## Current Scroll Lock Methods Per Component
| Component | overflow:hidden on body | overflow:hidden on html | CSS class | overscroll-behavior | data-lenis-prevent |
|-----------|------------------------|------------------------|-----------|--------------------|--------------------|
| MobileMenu | Yes | Yes | No | contain (overlay) | Yes (added) |
| SlidePanel (public) | Yes | Yes (via class) | `slide-panel-body-lock` | contain (panel) | Yes (added) |
| SlidePanel (shared) | Yes | Yes (via class + style) | `slide-panel-open` | contain (panel) | Yes (added) |

## Questions to Resolve
1. Does `data-lenis-prevent` fix the wheel scroll issue on all overlays?
2. If not, does the page still scroll behind? Or can the overlay not scroll?
3. For `[slug].js` panels — what specific panels have the scroll-through issue?
