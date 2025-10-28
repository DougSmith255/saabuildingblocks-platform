# Font Fallback Configuration

## Overview
This document defines font fallback strategies for SAA components when custom fonts are unavailable.

## Font Stack Definitions

### Primary Font (Amulya)
```css
font-family: 'Amulya', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

**Fallback Chain:**
1. **Amulya** - Custom brand font (if loaded)
2. **system-ui** - Native system UI font (macOS San Francisco, Windows Segoe UI, etc.)
3. **-apple-system** - Apple system font (iOS/macOS)
4. **BlinkMacSystemFont** - Chrome on macOS
5. **Segoe UI** - Windows
6. **Roboto** - Android
7. **Oxygen** - KDE
8. **Ubuntu** - Ubuntu
9. **Cantarell** - GNOME
10. **Fira Sans** - Firefox OS
11. **Droid Sans** - Older Android
12. **Helvetica Neue** - macOS fallback
13. **sans-serif** - Generic sans-serif

### Secondary Font (Synonym)
```css
font-family: 'Synonym', Georgia, 'Times New Roman', Times, serif;
```

**Fallback Chain:**
1. **Synonym** - Custom serif font (if loaded)
2. **Georgia** - High-quality serif (cross-platform)
3. **Times New Roman** - Standard serif
4. **Times** - Generic Times
5. **serif** - Generic serif

### Monospace Font
```css
font-family: 'Monaco', 'Courier New', Courier, monospace;
```

**Fallback Chain:**
1. **Monaco** - macOS monospace
2. **Courier New** - Standard monospace
3. **Courier** - Generic Courier
4. **monospace** - Generic monospace

## CSS Variable Usage

### In saa-variables.css
```css
:root {
  --font-primary: 'Amulya', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-secondary: 'Synonym', Georgia, 'Times New Roman', serif;
  --font-mono: 'Monaco', 'Courier New', monospace;
}
```

### In Component Styles
```css
.component-title {
  font-family: var(--font-primary);
}

.component-description {
  font-family: var(--font-secondary);
}

.code-block {
  font-family: var(--font-mono);
}
```

## Font Loading Strategy

### Optional: Font Loading with @font-face
If custom fonts are available, add to global CSS:

```css
@font-face {
  font-family: 'Amulya';
  src: url('/fonts/Amulya-Regular.woff2') format('woff2'),
       url('/fonts/Amulya-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Prevents FOIT, shows fallback immediately */
}

@font-face {
  font-family: 'Amulya';
  src: url('/fonts/Amulya-Bold.woff2') format('woff2'),
       url('/fonts/Amulya-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Synonym';
  src: url('/fonts/Synonym-Regular.woff2') format('woff2'),
       url('/fonts/Synonym-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### Font Display Strategy
- **font-display: swap** - Show fallback font immediately, swap to custom font when loaded
- Prevents Flash of Invisible Text (FOIT)
- Improves perceived performance

## Testing Fallbacks

### Disable Custom Fonts in Browser
1. Open DevTools
2. Go to Network tab
3. Block font file URLs
4. Verify fallback fonts render correctly

### Test on Different OS
- **macOS** - Should use system-ui (San Francisco)
- **Windows** - Should use Segoe UI
- **Linux** - Should use system default (Ubuntu, Oxygen, etc.)
- **Android** - Should use Roboto
- **iOS** - Should use -apple-system

## Performance Considerations

### Benefits of System Fonts
- **Zero network requests** - No font files to download
- **Instant rendering** - No font loading delay
- **Optimized for OS** - Best readability on each platform
- **Native look and feel** - Matches OS design language

### When to Use Custom Fonts
- **Strong brand identity** - Custom fonts critical to design
- **Specific typography** - Unique character shapes needed
- **Marketing pages** - Where visual impact is priority

### When to Use System Fonts
- **Performance-critical** - Fast page loads essential
- **Content-heavy** - Readability over branding
- **Progressive web apps** - Native app feel desired

## Accessibility

### Ensure Readable Fallbacks
- All fallback fonts must meet WCAG contrast requirements
- Test readability at different sizes
- Verify line-height and letter-spacing work with fallbacks

### Font Size Adjustments
Some fallback fonts may render differently sized:
```css
/* Adjust size if fallback is significantly different */
@supports not (font-family: 'Amulya') {
  body {
    font-size: 1.05em; /* Slightly increase if system font is smaller */
  }
}
```

## Migration Path

### Current State
- Components use CSS variables for fonts
- Fallbacks ensure graceful degradation
- No external font files required initially

### Future Enhancement
1. Add @font-face rules when fonts available
2. Use font-display: swap for performance
3. Consider font subsetting for smaller file sizes
4. Implement preload for critical fonts:
   ```html
   <link rel="preload" href="/fonts/Amulya-Regular.woff2" as="font" type="font/woff2" crossorigin>
   ```

## References

- [System Font Stack](https://systemfontstack.com/)
- [Modern Font Stacks](https://modernfontstacks.com/)
- [font-display: swap](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
- [WCAG Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
