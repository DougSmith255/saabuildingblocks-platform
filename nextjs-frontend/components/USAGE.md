# StarBackground Component Usage

## Overview

The `StarBackground` component is a high-performance React/Canvas implementation of an animated starfield background with 3-layer parallax scrolling, smooth twinkling effects, and mobile optimization.

## Features

- ✨ **3-Layer Parallax System**: Stars move at different speeds (0.05, 0.1, 0.2) for depth
- 🎨 **Radial Gradient Background**: #262626 (center) → #0a0a0a (edges)
- 📱 **Mobile Optimized**: 24 stars on mobile, 38 on desktop
- 💫 **Smooth Twinkling**: Math.sin() animation for realistic star twinkle
- ⚡ **60fps Performance**: requestAnimationFrame for smooth animation
- 📐 **Responsive**: Automatic resize handling with debouncing
- 🔍 **TypeScript**: Fully typed for safety and IDE support

## Installation

### 1. Add to Root Layout

```tsx
// app/layout.tsx
import StarBackground from '@/components/StarBackground';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StarBackground />
        {children}
      </body>
    </html>
  );
}
```

### 2. Add to Specific Pages

```tsx
// app/page.tsx
import StarBackground from '@/components/StarBackground';

export default function Home() {
  return (
    <>
      <StarBackground />
      <main>
        {/* Your page content */}
      </main>
    </>
  );
}
```

## Configuration

### Debug Mode

Debug logging is enabled in development mode by default. To customize:

```tsx
// Edit StarBackground.tsx
const DEBUG_CONFIG: DebugConfig = {
  enabled: true, // Force enable debug mode
  logLevel: 'info', // 'info' | 'warn' | 'error'
};
```

### Star Configuration

Adjust star behavior by modifying constants:

```tsx
const LAYER_COUNT = 3; // Number of parallax layers
const SPEEDS = [0.05, 0.1, 0.2]; // Speed for each layer
const BASE_STAR_COUNT = isMobile ? 24 : 38; // Stars per viewport
```

### Performance Tuning

For lower-end devices, reduce star count:

```tsx
const BASE_STAR_COUNT = isMobile ? 16 : 30;
```

For better quality, increase star count:

```tsx
const BASE_STAR_COUNT = isMobile ? 32 : 50;
```

## Styling

### Using CSS Module (Recommended)

The component uses `StarBackground.module.css` for styles:

```css
.starfieldCanvas {
  z-index: -10; /* Behind all content */
  position: fixed;
  /* ... other styles */
}
```

### Customizing z-index

To change stacking order, edit the CSS:

```css
.starfieldCanvas {
  z-index: -5; /* Closer to content */
}
```

Or override inline:

```tsx
<canvas
  className={styles.starfieldCanvas}
  style={{ zIndex: -5 }}
/>
```

## Browser Compatibility

- ✅ Chrome/Edge (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 90+)

## Performance

- **GPU Accelerated**: Uses `transform: translateZ(0)` for hardware acceleration
- **Debounced Resize**: 150ms debounce prevents resize thrashing
- **Error Recovery**: Automatically recovers from animation errors (max 5 retries)
- **Frame Monitoring**: Logs slow frames (<30fps) in debug mode

## Mobile Optimization

- Reduced star count (24 vs 38)
- Orientation change handling with 500ms delay
- iOS viewport height fixes (`-webkit-fill-available`)
- Passive event listeners for scroll performance

## Accessibility

The canvas includes `aria-hidden="true"` since it's purely decorative and doesn't convey information.

## Troubleshooting

### Stars not appearing

1. Check z-index conflicts
2. Verify canvas is rendering: inspect element for `<canvas id="starfield">`
3. Check browser console for errors (debug mode enabled)

### Performance issues

1. Reduce BASE_STAR_COUNT
2. Increase debounce timeout (resize handler)
3. Simplify twinkling: reduce twinkleSpeed variance

### Mobile viewport issues

The component handles most mobile quirks automatically, but you can adjust:

```css
@media screen and (max-width: 768px) {
  .starfieldCanvas {
    min-height: -webkit-fill-available;
  }
}
```

## Technical Details

### Animation Loop

```typescript
updateStars() → drawStars() → requestAnimationFrame()
```

### Star Movement

- **Vertical**: `star.y -= star.speed` (upward drift)
- **Wrapping**: When `star.y < -star.size`, reset to `canvas.height`
- **Horizontal Jitter**: ±10px randomization prevents visible patterns

### Twinkling Algorithm

```typescript
star.opacity = star.baseOpacity + Math.sin(now * star.twinkleSpeed) * 0.3;
```

- Base opacity: 0.5-1.0 (random)
- Twinkling range: ±0.3
- Speed: 0.0005-0.0015 (random per star)

## Migration from WordPress

This component is a direct port of the WordPress implementation with these improvements:

1. **React Hooks**: Cleaner state management
2. **TypeScript**: Type safety
3. **CSS Modules**: Scoped styling
4. **Modern Build**: Next.js optimization
5. **Accessibility**: ARIA attributes

All animation logic, parallax speeds, and visual effects match the original WordPress implementation.
