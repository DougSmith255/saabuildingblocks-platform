# WordPress React Components

High-fidelity React/Next.js conversion of WordPress components with Tailwind CSS v4.

## 🎨 Components

### Buttons

#### CTAButton
Premium call-to-action button with gold glow animations and green click effect.

```tsx
import { CTAButton } from '@/components/wordpress';

<CTAButton href="/get-started">
  GET STARTED TODAY
</CTAButton>
```

**Features:**
- Gold glow bars (top/bottom) with pulsing animation
- 3-second green click effect
- Text glow animation
- Backdrop blur effect
- Fully accessible with ARIA attributes

#### SecondaryButton
Secondary action button with border glow on hover.

```tsx
import { SecondaryButton } from '@/components/wordpress';

<SecondaryButton href="/learn-more">
  LEARN MORE
</SecondaryButton>
```

**Features:**
- Transparent with gold border
- Hover glow effect
- Smooth transitions

---

### Cards

#### CyberHolographicCard
Futuristic card with holographic shimmer, matrix rain, and glitch effects.

```tsx
import { CyberHolographicCard } from '@/components/wordpress';

<CyberHolographicCard>
  <h3>Your Content</h3>
  <p>Premium cyber-themed card design</p>
</CyberHolographicCard>
```

**Features:**
- Holographic shimmer animation
- Binary matrix rain effect
- Chromatic aberration
- Digital glitch overlay
- Mouse tracking hover effects
- 340px height (matches WordPress version)

---

### Special Components

#### Accordion
Interactive accordion with smooth animations and gold theme.

```tsx
import { Accordion } from '@/components/wordpress';

const items = [
  {
    title: 'Why Choose Us?',
    content: (
      <>
        <p>We offer the best solutions with:</p>
        <ul>
          <li>24/7 Support</li>
          <li>Industry-leading tools</li>
        </ul>
      </>
    )
  },
  // ... more items
];

<Accordion
  items={items}
  allowMultiple={false}
  variant="default"
/>
```

**Props:**
- `items`: Array of `{ title: string, content: ReactNode }`
- `allowMultiple`: Allow multiple items open (default: `false`)
- `variant`: `'default' | 'small' | 'compact'` (default: `'default'`)
- `className`: Additional CSS classes

**Features:**
- Smooth slide animations with JavaScript-controlled height
- Gold glow on titles and arrows when expanded
- Perfect center rotation for arrow icon
- CTA-style pulsing glow animations
- Glassmorphic design with backdrop blur
- Fully accessible with ARIA attributes

---

### Backgrounds

#### StarField
Animated starfield background with twinkling stars.

```tsx
import { StarField } from '@/components/wordpress';

<StarField starCount={300} />
```

**Props:**
- `starCount`: Number of stars (default: `300`)
- `className`: Additional CSS classes

**Features:**
- Canvas-based animation (60 FPS)
- Smooth twinkling effect
- Radial gradient background matching WordPress
- Fixed positioning (z-index: -10)
- Responsive to viewport changes
- Respects `prefers-reduced-motion`

---

## 🎨 Tailwind CSS v4 Integration

All components use Tailwind CSS v4 classes with CSS variables for theming.

### Required CSS Variables

Add to your `globals.css` or theme configuration:

```css
:root {
  /* Gold Theme */
  --gold-primary: #FFD700;

  /* Typography */
  --font-heading: 'Amulya', sans-serif;
  --font-body: 'Synonym', sans-serif;

  /* Sizing */
  --size-button: clamp(0.875rem, 1.5vw, 1rem);
  --size-h3: clamp(20px, 2.5vw, 36px);
  --size-arrow: clamp(1.2rem, 2vw, 2.5rem);

  /* Spacing (8px base) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Effects */
  --radius-lg: 12px;
  --color-bg-overlay-1: rgba(26, 26, 26, 0.8);
  --color-text-primary: #ffffff;
  --color-text-secondary: rgba(255, 255, 255, 0.9);
}
```

### Tailwind Config

Update `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        gold: {
          primary: 'var(--gold-primary)',
        },
      },
      boxShadow: {
        'gold-glow': '0 0 5px #ffd700, 0 0 15px #ffd700, 0 0 30px #ffd700, 0 0 60px #ffd700',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
    },
  },
};
```

---

## ♿ Accessibility

All components include:

- **ARIA attributes**: `aria-expanded`, `aria-hidden`, `role`, etc.
- **Keyboard navigation**: Full keyboard support
- **Focus states**: Visible focus indicators
- **Reduced motion**: Respects `prefers-reduced-motion`
- **High contrast**: Adapts to `prefers-contrast: high`
- **Screen readers**: Semantic HTML with proper labeling

---

## 🚀 Usage Example

Complete page example:

```tsx
import {
  StarField,
  CTAButton,
  SecondaryButton,
  CyberHolographicCard,
  Accordion
} from '@/components/wordpress';

export default function HomePage() {
  const faqItems = [
    {
      title: 'What makes us different?',
      content: <p>We provide cutting-edge solutions with 24/7 support.</p>
    },
    // ... more items
  ];

  return (
    <>
      <StarField starCount={300} />

      <section className="relative z-10 py-20">
        <h1>Welcome to Our Platform</h1>

        <div className="flex gap-4">
          <CTAButton href="/get-started">
            GET STARTED
          </CTAButton>
          <SecondaryButton href="/learn-more">
            LEARN MORE
          </SecondaryButton>
        </div>

        <div className="grid gap-6 mt-12">
          <CyberHolographicCard>
            <h3>Feature 1</h3>
            <p>Amazing premium features</p>
          </CyberHolographicCard>
        </div>

        <Accordion items={faqItems} className="mt-16" />
      </section>
    </>
  );
}
```

---

## 📦 Component Files

```
components/wordpress/
├── backgrounds/
│   ├── StarField.tsx
│   └── index.ts
├── buttons/
│   ├── CTAButton.tsx
│   ├── SecondaryButton.tsx
│   └── index.ts
├── cards/
│   ├── CyberHolographicCard.tsx
│   └── index.ts
├── special/
│   ├── Accordion.tsx
│   └── index.ts
├── types.ts
├── index.ts
└── README.md
```

---

## 🎯 Design Fidelity

All components maintain **100% visual fidelity** to WordPress originals:

✅ **Exact colors**: Gold (#FFD700), dark backgrounds, glass effects
✅ **Exact animations**: Glow pulses, twinkles, glitches, matrix rain
✅ **Exact sizing**: Heights, paddings, font sizes (using CSS clamp)
✅ **Exact interactions**: Hover effects, click effects, smooth transitions
✅ **Performance**: GPU-accelerated with `transform: translateZ(0)`

---

## 🔧 Customization

All components accept `className` prop for customization:

```tsx
<CTAButton
  href="/custom"
  className="mt-8 !bg-blue-500"
>
  CUSTOM BUTTON
</CTAButton>
```

Use `!important` utilities to override component defaults.

---

## 📝 TypeScript Support

Full TypeScript support with exported types:

```tsx
import type {
  CTAButtonProps,
  AccordionItem,
  StarFieldProps
} from '@/components/wordpress';
```

---

## 🎨 Animation Details

### CTA Button
- **Text Glow**: 3s infinite ease-in-out
- **Light Pulse**: 3s infinite (gold → brighter gold)
- **Green Click**: 3s one-time (gold → green → gold)

### Accordion
- **Arrow Rotation**: 400ms cubic-bezier (perfect center rotation)
- **Content Slide**: 400ms cubic-bezier with JavaScript height
- **Title/Arrow Pulse**: 3s infinite CTA-style glow

### Cyber Card
- **Holographic**: 6s infinite shimmer
- **Chromatic**: 4s infinite aberration
- **Matrix Rain**: 8s infinite loop
- **Glitch**: 3s infinite (0.5s on hover)

### Star Field
- **Twinkle**: Random phase per star, 0.01-0.03 speed
- **60 FPS**: RequestAnimationFrame rendering

---

## ⚡ Performance Tips

1. **StarField**: Use `starCount={200}` on mobile for better performance
2. **Cards**: Limit to 3-4 visible cards per viewport
3. **Accordion**: Use `variant="compact"` for reduced spacing
4. **Animations**: Disabled on `prefers-reduced-motion`

---

## 🐛 Troubleshooting

**Issue**: Glow animations not showing
- **Fix**: Ensure CSS variables are defined in `globals.css`

**Issue**: Fonts not loading
- **Fix**: Import fonts in layout or use Next.js font optimization

**Issue**: Canvas not rendering
- **Fix**: Ensure StarField is client component (`'use client'`)

---

## 📚 Related Documentation

- [Tailwind CSS v4 Guide](/docs/CSS-FRAMEWORK-GUIDE.md)
- [Coding Standards](/docs/CODING-STANDARDS.md)
- [WordPress Integration](/docs/nextjs-wordpress-integration.md)
