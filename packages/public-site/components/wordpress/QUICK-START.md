# WordPress Components - Quick Start

## 🚀 Installation

The components are already in your project at:
```
/nextjs-frontend/components/wordpress/
```

## ⚡ Quick Setup (3 Steps)

### 1. Add CSS Variables

Add to `/app/globals.css`:

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

### 2. Update Tailwind Config

Add to `tailwind.config.js`:

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

### 3. Use Components

```tsx
import {
  StarField,
  CTAButton,
  Accordion,
  CyberHolographicCard
} from '@/components/wordpress';

export default function Page() {
  return (
    <>
      <StarField />

      <section className="relative z-10">
        <CTAButton href="/start">GET STARTED</CTAButton>

        <CyberHolographicCard>
          <h3>Premium Feature</h3>
        </CyberHolographicCard>
      </section>
    </>
  );
}
```

## 📦 Components Available

- **StarField** - Animated star background
- **CTAButton** - Premium CTA with gold glow
- **SecondaryButton** - Secondary action button
- **CyberHolographicCard** - Futuristic card with effects
- **Accordion** - Interactive FAQ component

## 📚 Full Documentation

- **Usage Guide**: `/components/wordpress/README.md`
- **Examples**: `/components/wordpress/EXAMPLE-USAGE.tsx`
- **Summary**: `/components/wordpress/CONVERSION-SUMMARY.md`

## ✅ Done!

That's it! All components are ready to use with full TypeScript support and accessibility features.
