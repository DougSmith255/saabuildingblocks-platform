# Grainy Glow Pattern - SAA Component Library

## Overview

The **Grainy Glow Pattern** uses SVG filters with turbulence noise to create organic, non-digital glow effects across SAA components. This pattern replaces flat CSS box-shadows with textured, natural-looking glows that add depth and visual interest.

## What It Is

A reusable SVG filter that combines:
- **feTurbulence** - Generates Perlin noise for organic texture
- **feColorMatrix** - Adjusts color channels for glow tinting
- **feGaussianBlur** - Creates soft, diffused edges
- **feComposite** - Blends the grainy texture with glow colors

The result is a glow that appears more natural and less "computery" - like light diffusing through atmosphere rather than a digital shadow effect.

## When to Use

Apply grainy glow to **ALL glow effects** across SAA components:

### Primary Use Cases
- ✅ **Button glow bars** (CTAButton, SecondaryButton)
- ✅ **Card edge glows** (CyberCard variants)
- ✅ **Text glows** (TextScramble, LightningText)
- ✅ **Icon glows** (IconLibrary animated states)
- ✅ **Interactive element highlights** (Accordion, navigation)
- ✅ **Status indicators** (badges, notifications)

### When NOT to Use
- ❌ **Solid backgrounds** - Use regular backgrounds
- ❌ **Sharp borders** - Use border properties
- ❌ **Text shadows** - Use text-shadow for readability
- ❌ **Performance-critical animations** - Use CSS transforms instead

## Visual Examples

### Before (Flat CSS box-shadow)
```
┌────────────────┐
│  BUTTON TEXT   │ ← Flat, uniform glow
└────────────────┘
     ═══════     ← Digital-looking
```

### After (Grainy texture filter)
```
┌────────────────┐
│  BUTTON TEXT   │ ← Textured, organic glow
└────────────────┘
     ≈≈≈≈≈≈≈     ← Natural, atmospheric
```

## Implementation Guide

### Step 1: Add SVG Filter Definition

Include the grainy glow filter in your component or global layout:

```tsx
// In layout.tsx or at component root
<svg width="0" height="0" style={{ position: 'absolute' }}>
  <defs>
    <filter id="grainy-glow">
      {/* Generate organic noise texture */}
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.65"
        numOctaves="3"
        seed="2"
        result="noise"
      />

      {/* Color the noise for glow tint */}
      <feColorMatrix
        in="noise"
        type="matrix"
        values="0 0 0 0 1
                0 0 0 0 0.84
                0 0 0 0 0
                0 0 0 0.8 0"
        result="coloredNoise"
      />

      {/* Blur for soft edges */}
      <feGaussianBlur
        in="coloredNoise"
        stdDeviation="4"
        result="blurredNoise"
      />

      {/* Blend with original element */}
      <feComposite
        in="blurredNoise"
        in2="SourceGraphic"
        operator="atop"
        result="composite"
      />

      {/* Add extra blur for glow diffusion */}
      <feGaussianBlur
        in="composite"
        stdDeviation="8"
        result="finalGlow"
      />

      {/* Merge glow with original */}
      <feBlend
        in="finalGlow"
        in2="SourceGraphic"
        mode="screen"
      />
    </filter>
  </defs>
</svg>
```

### Step 2: Apply Filter to Elements

Replace CSS box-shadow with SVG filter:

```tsx
// BEFORE: Flat box-shadow
<div className="glow-element" style={{
  boxShadow: '0 0 5px #ffd700, 0 0 15px #ffd700, 0 0 30px #ffd700'
}} />

// AFTER: Grainy glow filter
<div className="glow-element" style={{
  filter: 'url(#grainy-glow)'
}} />
```

### Step 3: Customize Filter Parameters

Adjust parameters for different glow intensities:

#### Subtle Glow (Navigation, UI Elements)
```tsx
<feTurbulence baseFrequency="0.5" numOctaves="2" />
<feGaussianBlur stdDeviation="3" />
```

#### Medium Glow (Buttons, Cards)
```tsx
<feTurbulence baseFrequency="0.65" numOctaves="3" />
<feGaussianBlur stdDeviation="6" />
```

#### Strong Glow (Hero Elements, CTAs)
```tsx
<feTurbulence baseFrequency="0.8" numOctaves="4" />
<feGaussianBlur stdDeviation="10" />
```

### Step 4: Color Variations

Change glow colors by adjusting feColorMatrix values:

#### Gold Glow (Primary)
```tsx
<feColorMatrix
  values="0 0 0 0 1      // Red channel = 1 (255)
          0 0 0 0 0.84   // Green channel = 0.84 (215)
          0 0 0 0 0      // Blue channel = 0 (0)
          0 0 0 0.8 0"   // Alpha = 0.8 (opacity)
/>
```

#### Green Glow (Success)
```tsx
<feColorMatrix
  values="0 0 0 0 0      // Red = 0
          0 0 0 0 1      // Green = 1 (255)
          0 0 0 0 0.53   // Blue = 0.53 (136)
          0 0 0 0.8 0"   // Alpha = 0.8
/>
```

#### Blue Glow (Info)
```tsx
<feColorMatrix
  values="0 0 0 0 0      // Red = 0
          0 0 0 0 0.5    // Green = 0.5 (128)
          0 0 0 0 1      // Blue = 1 (255)
          0 0 0 0.8 0"   // Alpha = 0.8
/>
```

## Components Using Grainy Glow

### ✅ Already Implemented
- None (new pattern)

### 🔄 Needs Implementation (Priority Order)

#### High Priority (Visible on All Pages)
1. **CTAButton** - Primary action glow bars (top/bottom)
2. **SecondaryButton** - Side glow bars (left/right)
3. **CyberCardHolographic** - Edge glow effects

#### Medium Priority (Feature Pages)
4. **CyberCardPrismaticGlass** - Prismatic edge glow
5. **CyberCardStackedAnimation** - Layer edge glow
6. **LightningText** - Text glow effects
7. **TextScramble** - Character glow during scramble

#### Low Priority (Interactive States)
8. **IconLibrary** - Icon hover glow
9. **Accordion** - Active section glow
10. **ScrollGallery** - Active item indicator
11. **Scrollport** - Active navigation glow
12. **TeamCarousel** - Active member glow

## Code Examples

### Complete Button Example

```tsx
'use client';

import React, { useState } from 'react';

export function CTAButton({ children }: { children: React.ReactNode }) {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <>
      {/* SVG Filter Definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="grainy-glow-gold">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              seed="2"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 0.84
                      0 0 0 0 0
                      0 0 0 0.8 0"
            />
            <feGaussianBlur stdDeviation="6" />
            <feBlend mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* Button with Grainy Glow */}
      <div className="group relative inline-flex">
        <a
          href="#"
          onClick={() => setIsClicked(!isClicked)}
          className="relative flex justify-center items-center
                     h-[46px] px-5 py-2 bg-[rgb(45,45,45)]
                     rounded-xl border-t border-b border-white/10
                     font-heading font-semibold text-white uppercase"
        >
          {children}
        </a>

        {/* Bottom glow bar with grainy texture */}
        <div
          className={`
            absolute left-1/2 -translate-x-1/2 bottom-[-5px]
            w-[30px] h-[10px] rounded-md
            bg-gold-primary
            transition-all duration-500
            group-hover:w-4/5
            ${isClicked ? 'bg-green-primary' : ''}
          `}
          style={{ filter: 'url(#grainy-glow-gold)' }}
        />

        {/* Top glow bar with grainy texture */}
        <div
          className={`
            absolute left-1/2 -translate-x-1/2 top-[-5px]
            w-[30px] h-[10px] rounded-md
            bg-gold-primary
            transition-all duration-500
            group-hover:w-4/5
            ${isClicked ? 'bg-green-primary' : ''}
          `}
          style={{ filter: 'url(#grainy-glow-gold)' }}
        />
      </div>
    </>
  );
}
```

### Animated Glow Intensity

```tsx
// Pulse animation with grainy glow
<style jsx>{`
  @keyframes grainyGlowPulse {
    0%, 100% {
      filter: url(#grainy-glow-gold) brightness(1);
    }
    50% {
      filter: url(#grainy-glow-gold) brightness(1.5);
    }
  }

  .pulsing-glow {
    animation: grainyGlowPulse 3s ease-in-out infinite;
  }
`}</style>

<div
  className="pulsing-glow"
  style={{ filter: 'url(#grainy-glow-gold)' }}
>
  Pulsing grainy glow
</div>
```

## Performance Considerations

### Optimization Tips

1. **Reuse Filter Definitions**
   - Define filters once in root layout
   - Reference via `url(#filter-id)` across components
   - Reduces DOM overhead

2. **Limit Filter Complexity**
   - Use 2-3 octaves for turbulence (not 5+)
   - Keep blur stdDeviation under 10px
   - Avoid chaining multiple filters

3. **Browser Compatibility**
   - SVG filters supported in all modern browsers
   - Fallback to CSS box-shadow for older browsers
   - Use CSS `@supports` for graceful degradation

4. **Animation Performance**
   - Animate `brightness()` and `opacity` (GPU-accelerated)
   - Avoid animating filter parameters directly
   - Use CSS transforms for movement

### Fallback Strategy

```tsx
// Graceful degradation for older browsers
<div
  className="glow-element"
  style={{
    filter: 'url(#grainy-glow-gold)',
    // Fallback for browsers without SVG filter support
    boxShadow: '0 0 5px #ffd700, 0 0 15px #ffd700'
  }}
/>
```

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Hardware accelerated |
| Firefox 88+ | ✅ Full | Hardware accelerated |
| Safari 14+ | ✅ Full | May have slight performance difference |
| Edge 90+ | ✅ Full | Hardware accelerated |
| Chrome Android | ✅ Full | Optimize octaves for mobile |
| Safari iOS | ✅ Full | Optimize octaves for mobile |

## Troubleshooting

### Issue: Glow appears blocky or pixelated
**Solution:** Increase `baseFrequency` and reduce `stdDeviation`:
```tsx
<feTurbulence baseFrequency="0.8" /> {/* Higher = finer grain */}
<feGaussianBlur stdDeviation="4" />   {/* Lower = sharper */}
```

### Issue: Glow is too intense or bright
**Solution:** Adjust alpha channel in feColorMatrix:
```tsx
<feColorMatrix
  values="0 0 0 0 1
          0 0 0 0 0.84
          0 0 0 0 0
          0 0 0 0.5 0"  {/* Reduced from 0.8 to 0.5 */}
/>
```

### Issue: Performance lag on mobile
**Solution:** Reduce octaves and blur for mobile:
```tsx
// Desktop
<feTurbulence baseFrequency="0.65" numOctaves="3" />
<feGaussianBlur stdDeviation="6" />

// Mobile (use media query or JS detection)
<feTurbulence baseFrequency="0.65" numOctaves="2" />
<feGaussianBlur stdDeviation="4" />
```

### Issue: Filter not applying
**Solution:** Ensure SVG is in DOM and ID matches:
```tsx
// 1. Check SVG is rendered
<svg width="0" height="0" style={{ position: 'absolute' }}>
  <defs>
    <filter id="grainy-glow"> {/* ID here */}

// 2. Reference exact ID in filter
<div style={{ filter: 'url(#grainy-glow)' }}> {/* Must match */}
```

## Migration Checklist

Use this checklist when adding grainy glow to components:

- [ ] **Add SVG filter definition** to component or layout
- [ ] **Replace box-shadow** with `filter: url(#grainy-glow)`
- [ ] **Test glow visibility** on dark and light backgrounds
- [ ] **Verify animation performance** (60fps target)
- [ ] **Test on mobile devices** (iOS Safari, Chrome Android)
- [ ] **Add fallback box-shadow** for older browsers
- [ ] **Update component documentation** with grainy glow example
- [ ] **Update Storybook stories** (if applicable)

## Related Documentation

- [SAA Component Library Guide](/home/claude-flow/docs/SAA-COMPONENT-LIBRARY-GUIDE.md)
- [SAA Component API Reference](/home/claude-flow/docs/SAA-COMPONENT-API-REFERENCE.md)
- [Coding Standards - Visual Effects](/home/claude-flow/docs/CODING-STANDARDS.md#visual-effects)
- [CSS Framework Guide - Animations](/home/claude-flow/docs/CSS-FRAMEWORK-GUIDE.md#animations)

---

**Pattern Version:** 1.0.0
**Last Updated:** October 7, 2025
**Maintained by:** SAA Development Team
**Status:** Ready for Implementation
