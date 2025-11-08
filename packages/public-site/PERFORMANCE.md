# Performance Testing & Monitoring

This document describes the performance testing and monitoring tools available for the Smart Agent Alliance public site.

## Overview

The project includes two main performance tools:

1. **Playwright Performance Test Script** - Automated performance testing against deployed sites
2. **FPS Monitor Component** - Real-time FPS monitoring during development

## Performance Test Script

### Location
`/home/claude-flow/packages/public-site/scripts/performance-test.js`

### Usage

```bash
# Test against default URL (saabuildingblocks.pages.dev)
npm run test:performance

# Test against custom URL
npm run test:performance https://your-domain.com
```

### What It Measures

- **Page Load Performance**
  - Total load time
  - DOM Content Loaded
  - Time to Interactive
  - First Byte (TTFB)

- **Core Web Vitals**
  - LCP (Largest Contentful Paint) - Target: < 2.5s
  - FID (First Input Delay) - Target: < 100ms
  - CLS (Cumulative Layout Shift) - Target: < 0.1
  - FCP (First Contentful Paint)

- **Animation Performance**
  - Average FPS during counter animation
  - Threshold: 30 FPS minimum

- **Scroll Performance**
  - Average FPS during smooth scrolling
  - Threshold: 30 FPS minimum

### Viewport Sizes Tested

- Desktop Small: 1024x768
- Desktop Medium: 1500x900
- Desktop Large: 1920x1080

### Performance Thresholds

```javascript
{
  minFPS: 30,
  maxPageLoad: 3000, // ms
  maxLCP: 2500,      // ms
  maxFID: 100,       // ms
  maxCLS: 0.1
}
```

## FPS Monitor Component

### Location
`/home/claude-flow/packages/public-site/app/components/FPSMonitor.tsx`

### Usage

The FPS Monitor only runs in development mode (`NODE_ENV !== 'production'`).

To use it, import and add to your layout:

```tsx
import { FPSMonitor } from '@/components/FPSMonitor';

export default function Layout({ children }) {
  return (
    <>
      <FPSMonitor />
      {children}
    </>
  );
}
```

### Features

- Real-time FPS display in top-left corner
- Shows both current and average FPS
- Visual warning when FPS drops below 30
- Automatically hidden in production builds
- Uses `requestAnimationFrame` for accurate measurements

## Latest Performance Test Results

**Test Date:** 2025-11-08
**Test URL:** https://saabuildingblocks.pages.dev/

### Desktop Small (1024x768)
- ✓ Page Load: 158ms
- ✓ TTFB: 14ms
- ⚠ CLS: 0.279 (exceeds threshold of 0.1)
- ⚠ Animation FPS: 22 FPS (below threshold of 30)
- ✓ Scroll FPS: 52 FPS

### Desktop Medium (1500x900)
- ✓ Page Load: 164ms
- ✓ TTFB: 16ms
- ✓ LCP: 520ms
- ✓ CLS: 0.001
- ⚠ Animation FPS: 14 FPS (below threshold of 30)
- ✓ Scroll FPS: 49 FPS

### Desktop Large (1920x1080)
- ✓ Page Load: 108ms
- ✓ TTFB: 16ms
- ✓ CLS: 0.000
- ⚠ Animation FPS: 13 FPS (below threshold of 30)
- ✓ Scroll FPS: 46 FPS

## Identified Performance Issues

### 1. Animation FPS Below Threshold
**Issue:** Counter animation runs at 14-22 FPS, below the 30 FPS threshold
**Current Implementation:** JavaScript-based interval animation at 30fps target
**Impact:** Animation may appear choppy, especially on larger viewports

**Recommendations:**
- Consider migrating to CSS animations for better performance
- Use `transform` and `opacity` properties which are GPU-accelerated
- Reduce animation complexity or duration
- Optimize the scramble algorithm

### 2. Cumulative Layout Shift (CLS)
**Issue:** Desktop Small viewport shows CLS of 0.279 (threshold: 0.1)
**Cause:** Likely from dynamic H1 positioning or counter animation initialization

**Recommendations:**
- Reserve space for counter component during SSR
- Set explicit dimensions for profile image
- Avoid dynamic positioning calculations that trigger layout shifts
- Use CSS transforms instead of margin/position changes

## Continuous Monitoring

### During Development
Use the FPS Monitor component to track real-time performance while developing:
1. Start dev server: `npm run dev`
2. Monitor FPS in top-left corner
3. Watch for red warning indicator (FPS < 30)

### Before Deployment
Run performance tests against your preview deployment:
```bash
npm run test:performance https://your-preview-url.pages.dev/
```

## Next Steps

1. Investigate CLS issue on Desktop Small viewport
2. Optimize counter animation performance
3. Consider CSS-based animation alternatives
4. Add performance budgets to CI/CD pipeline
5. Set up automated performance regression testing
