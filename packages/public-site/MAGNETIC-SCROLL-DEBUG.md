# Magnetic Scroll Effect - Debug Log

## Goal
Cards should smoothly gravitate toward their "snapped" position (centered for horizontal cards, straight for flipping cards) while scrolling, without the delayed "stop → wait → correct" behavior caused by GSAP snap.

## Current Architecture

### BuiltForFuture.tsx (Horizontal Scroll Cards)
- `rawPositionRef` - Updated by ScrollTrigger.onUpdate with the raw scroll-derived card position (0-4)
- `displayPositionRef` - The smoothed/magnetic position used for rendering
- `scrollPosition` state - Triggers re-render when displayPositionRef changes
- `animateMagnetic()` - RAF loop that interpolates displayPositionRef toward nearest snap point

### WhyOnlyAtExp.tsx (Flipping Cards)
- Same architecture with `rawProgressRef` and `displayProgressRef`
- Progress is 0-1, with card positions at 0, 0.5, 1 (for 3 cards)

---

## Debug Session 1: 2024-01-08

### Test 1: console.log statements
Added console.log to:
- useLayoutEffect mount
- animateMagnetic RAF loop (every 60 frames)
- ScrollTrigger onUpdate

**Result:** NO LOGS APPEARED IN CONSOLE
- Production build strips console.log statements (Next.js/Terser optimization)

### Test 2: console.warn statements
Changed all console.log to console.warn (usually not stripped)

**Result:** STILL NO LOGS APPEARING
- User console output shows only HTTP requests and third-party warnings
- No `[BuiltForFuture]` or `[WhyOnlyAtExp]` warnings visible

---

## Critical Finding

**The console.warn statements are NOT appearing at all**, which means one of:
1. The components are not mounting/rendering on the client
2. The useLayoutEffect is not running
3. Something is preventing the code from executing
4. The build is somehow not including the updated code

---

## Possible Root Causes

### Theory A: Component Not Client-Side Rendering
- The components have `'use client'` directive but maybe something is preventing hydration
- Check if the sections are wrapped in something that prevents client rendering

### Theory B: Build Cache Issue
- Old cached build files being served
- Need to verify the deployed code actually contains the console.warn statements

### Theory C: useLayoutEffect Not Running
- useLayoutEffect might be skipped in certain SSR scenarios
- Try using useEffect instead to test

### Theory D: GSAP/ScrollTrigger Initialization Issue
- Maybe GSAP isn't loading properly
- The sections DO animate (cards move with scroll), so GSAP is working
- But the magnetic RAF loop might not be starting

---

## Next Steps

1. **Verify build output** - Check if console.warn is in the compiled JS
2. **Try useEffect instead of useLayoutEffect** - Test if effect runs at all
3. **Add a visible debug indicator** - Instead of console, show debug info on screen
4. **Check if RAF loop starts** - Add a counter that displays on screen

---

## Alternative: On-Screen Debug Display

Instead of console, render debug values directly in the UI:
```tsx
{process.env.NODE_ENV === 'development' && (
  <div className="fixed top-0 left-0 bg-black text-white p-2 z-50">
    Raw: {rawPositionRef.current} | Display: {displayPositionRef.current}
  </div>
)}
```

But this won't work in production. Need a different approach.

---

## Alternative: Force Debug Mode

Add a URL parameter check:
```tsx
const isDebug = typeof window !== 'undefined' && window.location.search.includes('debug=1');
if (isDebug) {
  console.warn('[Debug]', data);
}
```

This might bypass production stripping since it's conditional.

---

## Debug Session 2: Velocity-Based Approach

### Problem Identified
The original magnetic effect wasn't working because:
1. Reading `scrollPosition` state inside RAF loop captures stale value (closure issue)
2. The magnetic pull was fighting with GSAP's scrub smoothing
3. No distinction between "actively scrolling" vs "stopped scrolling"

### New Implementation
Switched to **velocity-based magnetic snap**:

```tsx
// Track velocity
const instantVelocity = Math.abs(raw - lastRaw);
velocityRef.current = velocityRef.current * 0.9 + instantVelocity * 0.1;

// When velocity high: follow raw position (user is scrolling)
// When velocity low: snap to nearest card (user stopped)
const velocityFactor = Math.min(1, velocityRef.current * 50);
const targetPosition = clampedTarget * (1 - velocityFactor) + raw * velocityFactor;
```

### Key Changes
1. Use `displayPositionRef` (ref) instead of `scrollPosition` (state) for current position in RAF
2. Track velocity via delta between frames
3. Blend between snap target and raw based on velocity
4. Faster scrub (0.5 instead of 1) for more responsive feel

### Files Modified
- `/packages/public-site/app/components/sections/BuiltForFuture.tsx`
- `/packages/public-site/app/components/sections/WhyOnlyAtExp.tsx`

### Expected Behavior
- While scrolling: cards follow scroll smoothly
- When scroll slows/stops: cards snap to nearest position
- Transition should feel fluid, not jarring
