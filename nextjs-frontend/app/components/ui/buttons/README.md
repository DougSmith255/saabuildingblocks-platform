# CTA Button Component

A premium call-to-action button component with animated gold glow effects that turn green on click. Converted from WordPress CSS to React + Tailwind CSS v4.

## Features

✨ **Visual Effects**
- Animated gold glow on top and bottom edges
- Pulsing light animation (3s infinite)
- Green glow on click that persists
- Smooth hover animations with expanding glow lines
- Text glow animation with color variations
- Backdrop blur effect for premium look

🎯 **Functionality**
- Works as both link (`href`) and action button (`onClick`)
- Next.js Link integration for navigation
- Persistent green glow state until navigation
- Automatic reset for action buttons (2s delay)

♿ **Accessibility**
- Full keyboard support (Enter/Space keys)
- ARIA labels (auto-generated or custom)
- Focus ring indicators
- Screen reader friendly

📱 **Responsive**
- Fluid sizing and spacing
- Mobile-friendly touch targets
- Consistent across viewports

## Installation

The component is located at:
```
/app/components/ui/buttons/cta-button.tsx
```

Import from the barrel export:
```tsx
import { CTAButton } from '@/components/ui/buttons';
```

Or directly:
```tsx
import { CTAButton } from '@/components/ui/buttons/cta-button';
```

## Usage

### Basic Link Button
```tsx
<CTAButton href="/signup">
  Get Started
</CTAButton>
```

### Action Button
```tsx
<CTAButton onClick={() => handleAction()}>
  Learn More
</CTAButton>
```

### With Custom Styling
```tsx
<CTAButton
  href="/contact"
  className="mx-auto"
  ariaLabel="Contact our team"
>
  Contact Us
</CTAButton>
```

### Button Group
```tsx
<div className="flex gap-4 justify-center">
  <CTAButton href="/pricing">View Pricing</CTAButton>
  <CTAButton onClick={handleDemo}>Try Demo</CTAButton>
</div>
```

## Props API

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | Yes | Button content (text or elements) |
| `href` | `string` | No | Link URL (uses Next.js Link) |
| `onClick` | `() => void` | No | Click handler for action buttons |
| `className` | `string` | No | Additional CSS classes |
| `ariaLabel` | `string` | No | Accessibility label (defaults to children text) |

## Styling Details

### Colors
- **Default Glow**: Gold (`#FFD700`)
- **Active Glow**: Green (`#00FF88`)
- **Background**: `rgb(45, 45, 45)`
- **Text**: White (`#ffffff`)

### Animations
1. **lightPulse** (3s infinite)
   - Pulsing box-shadow effect
   - Gold glow intensity variation

2. **textGlow** (3s infinite)
   - Text shadow animation
   - Color shifts between gold variants

3. **Hover State**
   - Glow lines expand from 30px to 80% width
   - Scale transform (1.05)
   - Shine effect slides across

4. **Active/Clicked State**
   - Gold instantly switches to green
   - Green glow persists until navigation or timeout

### Typography
- **Font**: Amulya (heading font)
- **Weight**: 600 (semibold)
- **Size**: 1rem (16px base)
- **Transform**: Uppercase
- **Letter Spacing**: 0.1em (wide)

## Technical Implementation

### State Management
```tsx
const [isClicked, setIsClicked] = useState(false);
```

The `isClicked` state controls the glow color:
- `false` → Gold glow with pulse animation
- `true` → Green glow (static)

### Click Behavior

**For Link Buttons** (`href` provided):
```tsx
// Green glow persists until navigation
onClick={() => setIsClicked(true)}
```

**For Action Buttons** (`onClick` provided):
```tsx
// Green glow persists for 2 seconds
onClick={() => {
  setIsClicked(true);
  setTimeout(() => setIsClicked(false), 2000);
}}
```

### Keyboard Support
```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    // Same behavior as click
  }
}}
```

## CSS Classes (Tailwind v4)

### Base Container
```css
relative inline-flex h-[46px] items-center justify-center
```

### Button/Link Element
```css
relative flex h-[46px] items-center justify-center
rounded-xl bg-[rgb(45,45,45)] px-5 py-2
border-t border-b border-white/10
shadow-[0_15px_15px_rgba(0,0,0,0.3)]
backdrop-blur-[15px]
font-heading font-semibold text-base uppercase tracking-[0.1em]
text-text-primary
overflow-hidden
transition-all duration-500
```

### Glow Lines (Pseudo-elements)

**Bottom Glow** (`::before`):
```css
before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2
before:bottom-[-5px] before:w-[30px] before:h-[10px]
before:rounded-md before:transition-all before:duration-500
before:bg-gold before:shadow-[0_0_5px_#ffd700,...]
hover:before:w-[80%]
```

**Top Glow** (`::after`):
```css
after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2
after:top-[-5px] after:w-[30px] after:h-[10px]
after:rounded-md after:transition-all after:duration-500
after:bg-gold after:shadow-[0_0_5px_#ffd700,...]
hover:after:w-[80%]
```

### Clicked State Override
```tsx
${isClicked
  ? 'before:bg-green before:shadow-[0_0_5px_#00ff88,...]'
  : 'before:bg-gold before:shadow-[0_0_5px_#ffd700,...]'
}
```

## Performance Considerations

1. **GPU Acceleration**: Uses `transform` and `opacity` for animations
2. **Will-change**: Implicitly applied by browser for animated properties
3. **Reduced Motion**: Respects `prefers-reduced-motion` media query (via Tailwind)
4. **Lazy State Updates**: Click state uses `useCallback` for optimization
5. **No Layout Thrashing**: All animations use compositor-only properties

## Accessibility Checklist

✅ Semantic HTML (button/link)
✅ Keyboard navigation (Enter/Space)
✅ Focus indicators (ring on focus-visible)
✅ ARIA labels (auto or custom)
✅ Screen reader support
✅ Touch target size (46px height)
✅ Color contrast (WCAG AAA compliant)

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile

**Note**: Requires CSS `backdrop-filter` support for blur effect.

## Migration from WordPress

Original WordPress structure:
```html
<div class="cta-button">
  <a href="#">BUTTON TEXT</a>
</div>
```

React equivalent:
```tsx
<CTAButton href="#">Button Text</CTAButton>
```

### Key Changes
1. **No wrapper div needed** - Component handles structure internally
2. **TypeScript props** - Type-safe API with IntelliSense
3. **Next.js Link** - Automatic client-side navigation
4. **State management** - React hooks instead of CSS classes
5. **Tailwind utilities** - CSS-in-JS approach with Tailwind

## Troubleshooting

### Glow not visible
- Check that `globals.css` includes the animation keyframes
- Verify Tailwind config has custom colors defined
- Ensure component is rendered in proper z-index context

### Green state not persisting
- For links: This is expected (green until navigation)
- For actions: Should reset after 2s (configurable in component)

### Font not rendering correctly
- Verify Amulya font is loaded in `layout.tsx`
- Check `font-heading` is defined in Tailwind config
- Ensure `--font-amulya` CSS variable is set

### Animations stuttering
- Check for layout shifts during animation
- Verify GPU acceleration is enabled
- Consider reducing animation complexity on low-end devices

## Related Components

- **Primary Button** (coming soon)
- **Secondary Button** (coming soon)
- **Icon Button** (coming soon)

## Examples

See `cta-button.example.tsx` for comprehensive usage examples.

## License

Part of Smart Agent Alliance project. See main LICENSE file.
