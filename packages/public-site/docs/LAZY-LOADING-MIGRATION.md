# Lazy Loading Migration Guide

## Overview

This document tracks the migration to section-level lazy loading with `LazySection` and `LazyImage` components.

## New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `SectionSkeleton` | `components/shared/SectionSkeleton.tsx` | Shimmer loading placeholder for lazy sections |
| `LazyImage` | `components/shared/LazyImage.tsx` | Deferred image loading with IntersectionObserver |
| `LazyImg` | `components/shared/LazyImage.tsx` | Same as LazyImage but for native `<img>` elements |

## Redundant Optimizations to Remove

After implementing lazy loading, these optimizations become redundant or conflicting:

### 1. BlogCard IntersectionObserver ❌ REMOVE
- **File**: `components/blog/BlogCard.tsx`
- **What**: Custom IntersectionObserver for image loading
- **Why remove**: `LazyImage` handles this globally
- **Action**: Replace with `LazyImage` component or keep if BlogCard needs specific behavior

### 2. `loading="lazy"` on below-fold images ❌ REMOVE
- **Files**: Various components using `next/image` or `<img>`
- **What**: Native lazy loading hint
- **Why remove**: `LazyImage` uses IntersectionObserver which is stricter - the image element isn't even rendered until near viewport
- **Action**: Use `LazyImage` instead, which sets `loading="eager"` internally

### 3. `content-visibility: auto` ❌ ALREADY REMOVED
- **File**: `app/components/StaticCounter.css` (was removed)
- **What**: CSS containment for off-screen content
- **Why removed**: Caused LCP render delay - browser skipped rendering, then had to re-render
- **Status**: Already removed in previous commit

### 4. Individual `dynamic()` imports for animations ✅ KEEP
- **File**: `app/page.tsx`
- **What**: `CounterAnimation`, `HomepageClient`, `DynamicH1Container`
- **Why keep**: These are JavaScript enhancements, not sections. They hydrate after initial paint.

### 5. `HeroSection` opacity wrapper ✅ KEEP
- **File**: `components/shared/HeroSection.tsx`
- **What**: Fade-in animation for hero content
- **Why keep**: This is for above-fold content smoothness, not lazy loading

### 6. `YouTubeFacade` ✅ KEEP
- **File**: `@saa/shared/components/saa/media/YouTubeFacade.tsx`
- **What**: Click-to-load YouTube embeds
- **Why keep**: Different purpose - loads iframe on user interaction, not viewport

## Migration Checklist

### Homepage (`app/page.tsx`)
- [ ] Convert static section imports to `dynamic()` with `SectionSkeleton`
- [ ] Sections to convert: `ValueStack`, `SocialProof`, `WhyExpRealty`, `WhoWeAre`, `PathSelectorWithContent`

### Blog Pages
- [ ] Update `BlogCard.tsx` to use `LazyImage` or simplify existing IntersectionObserver
- [ ] Update `BlogPostCard.tsx` - replace `loading="lazy"` with `LazyImage`
- [ ] Update `BlogFeaturedImage.tsx` - keep `priority` prop for hero images

### Other Pages (Future)
- [ ] Apply same pattern to other pages with below-fold sections
- [ ] Consider creating central registry if pattern repeats often

## Section Heights for Skeletons

Approximate heights for skeleton placeholders:

| Section | Desktop Height | Mobile Height |
|---------|---------------|---------------|
| ValueStack | 600px | 800px |
| SocialProof | 400px | 500px |
| WhyExpRealty | 700px | 900px |
| WhoWeAre | 500px | 600px |
| PathSelectorWithContent | 800px | 1000px |

Note: These are estimates. Use browser DevTools to measure actual heights.

## Performance Expectations

Before:
- All section JS loaded immediately
- All images start loading on page load
- Higher initial bundle size

After:
- Section JS loads when 200px from viewport
- Images only load when container is near viewport
- Smaller initial bundle, faster LCP
