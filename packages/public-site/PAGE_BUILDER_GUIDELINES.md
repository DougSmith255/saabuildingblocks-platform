# Page Builder Guidelines

## Overview
Guidelines for building pages on the SAA public site using Master Controller components and consistent design patterns.

---

## Icons

### Library
- **Use Lucide React** (`lucide-react`) - already in codebase
- Import icons individually: `import { IconName } from 'lucide-react'`

### Style Rules
- **Plain, solid icons only** - no 3D, no gradients
- **Single color per icon** - use brand colors or text colors
- **Consistent sizing** - use `size` prop or className for width/height

### Colors for Icons
- **Gold (primary accent):** `#ffd700` or `text-[#ffd700]`
- **White (on dark backgrounds):** `#ffffff` or `text-white`
- **Body text color:** `#e5e4dd` or `text-[#e5e4dd]`
- **Neon green (success/CTA):** `#00ff88` or `text-[#00ff88]`

### Example Usage
```tsx
import { DollarSign, Users, TrendingUp } from 'lucide-react';

// Gold icon
<DollarSign className="w-6 h-6 text-[#ffd700]" />

// White icon with custom size
<Users size={24} className="text-white" />
```

---

## Master Controller Components

### Always Import From
```tsx
import { H1, H2, Tagline, CTAButton, SecondaryButton, GenericButton } from '@saa/shared/components/saa';
```

### Component Usage

#### Headings
- `<H1>` - Main page titles, hero headlines
- `<H2>` - Section headings
- `<Tagline>` - Subheadings, supporting text under headlines

#### Buttons
- `<CTAButton>` - Primary actions (Join, Apply, Get Started)
- `<SecondaryButton>` - Secondary actions
- `<GenericButton>` - Path selectors, toggles, neutral actions

---

## Section Structure

### Standard Section Wrapper
```tsx
<section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
  <div className="max-w-6xl mx-auto">
    {/* Section content */}
  </div>
</section>
```

### Section Spacing
- Vertical padding: `py-16 md:py-24`
- Horizontal padding: `px-4 sm:px-8 md:px-12`
- Max content width: `max-w-6xl mx-auto`

---

## Images

### Approach
1. Build sections text/icon first
2. Add images after structure is approved
3. Use existing images from smartagentalliance.com for existing pages
4. New pages (like homepage) - specify where images are needed

### Image Optimization
- Use `<OptimizedImage>` component for Cloudflare Images
- Use Next.js `<Image>` for external URLs with known dimensions
- Always include `alt` text for accessibility

---

## Color Palette Reference

| Purpose | Hex | Tailwind |
|---------|-----|----------|
| Background | `#0a0a0a` | `bg-[#0a0a0a]` |
| Text (headings) | `#e5e4dd` | `text-[#e5e4dd]` |
| Text (body) | `#dcdbd5` | `text-[#dcdbd5]` |
| Accent Gold | `#ffd700` | `text-[#ffd700]` |
| Neon Green | `#00ff88` | `text-[#00ff88]` |

---

## Responsive Design

### Breakpoints (Tailwind defaults)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach
Always write mobile styles first, then add responsive modifiers:
```tsx
<div className="text-sm md:text-base lg:text-lg">
```

---

## Performance

- Lazy load below-fold content with `dynamic()` imports
- Use CSS animations over JavaScript where possible
- Minimize client components - prefer Server Components
- Use `'use client'` only when interactivity is required
