# Lazy Loading Migration Guide

## Overview

This document tracks the migration to section-level lazy loading with `SectionSkeleton` and `LazyImage` components.

## New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `SectionSkeleton` | `components/shared/SectionSkeleton.tsx` | Shimmer loading placeholder for lazy sections |
| `LazyImage` | `components/shared/LazyImage.tsx` | Deferred image loading with IntersectionObserver |
| `LazyImg` | `components/shared/LazyImage.tsx` | Same as LazyImage but for native `<img>` elements |

## Strategy: Section-Level vs Image-Level

### Section-Level Lazy Loading (Primary)
When a section is lazy-loaded with `dynamic()`, everything inside it (JS, HTML, images) loads together when the section enters the viewport. This handles most optimization needs.

### Image-Level Lazy Loading (Supplementary)
`LazyImage` is still useful for:
- **Blog post body content** - Images scattered throughout article (no section wrapper)
- **Very long sections** - Where you want images to load progressively within the section
- **Blog card grids** - Many image cards that shouldn't all load at once

## What to Keep vs Remove

### ✅ KEEP

| Optimization | File | Reason |
|--------------|------|--------|
| `BlogCard` IntersectionObserver | `components/blog/BlogCard.tsx` | Blog listing pages have many cards - need per-card deferral |
| `dynamic()` for animations | `app/page.tsx` | JS enhancements, not sections |
| `HeroSection` opacity wrapper | `components/shared/HeroSection.tsx` | Above-fold smoothness |
| `YouTubeFacade` | `@saa/shared/.../YouTubeFacade.tsx` | Click-to-load, different purpose |

### ❌ REMOVE (after global implementation)

| Optimization | Files | Reason |
|--------------|-------|--------|
| `loading="lazy"` on section images | Various | Redundant - section lazy loading handles this |
| `content-visibility: auto` | CSS files | Caused LCP issues, already removed |

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
