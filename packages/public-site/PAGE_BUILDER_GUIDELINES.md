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
  <div className="max-w-[1900px] mx-auto">
    {/* Section content */}
  </div>
</section>
```

### Section Spacing
- Vertical padding: `py-16 md:py-24`
- Horizontal padding: `px-4 sm:px-8 md:px-12`
- **Max content width: `max-w-[1900px] mx-auto`** - All pages must scale up to 1900px to utilize large screen space

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

---

## Hero Sections

### Structure (No Wrapper Component)
Hero sections are plain `<section>` elements - **no wrapper component needed**.

```tsx
<section className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
  <div className="max-w-[1400px] mx-auto w-full text-center">
    <H1>Page Title</H1>
    <Tagline className="mt-4">Supporting tagline text</Tagline>
  </div>
</section>
```

### Hero with Background Image
When adding a background image to a hero section, use an actual `<img>` tag - **NEVER use CSS `backgroundImage`**.

```tsx
<section className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
  {/* Background Image - MUST use <img> tag */}
  <img
    src="https://imagedelivery.net/..."
    srcSet="...mobile 640w, ...tablet 1024w, ...desktop 2000w"
    sizes="100vw"
    alt=""
    aria-hidden="true"
    fetchPriority="high"
    loading="eager"
    decoding="async"
    className="absolute inset-0 w-full h-full object-cover -z-10 hero-bg"
    style={{
      objectPosition: 'center 55%',
      // Optional gradient mask
      maskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, transparent 85%)',
      WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, transparent 85%)',
    }}
  />

  {/* Content */}
  <div className="relative z-10 max-w-[1400px] mx-auto w-full text-center">
    <H1>Page Title</H1>
    <Tagline className="mt-4">Supporting tagline text</Tagline>
  </div>
</section>
```

### Critical Rules

1. **NO fade-in animations on hero** - Content must be visible immediately
2. **NO `opacity: 0` start state** - Chrome ignores these for performance metrics
3. **Use `<img>` for background images** - Not CSS `backgroundImage`
4. **Required image attributes:**
   - `fetchPriority="high"`
   - `loading="eager"`
   - `decoding="async"`
5. **Add `hero-bg` class** - Exempts hero images from global fade-in animation
6. **Decorative animations are fine** - Button glows, counters load after content is visible
7. **Scroll-triggered animations are fine** - Below-fold content can use opacity animations

### Image Classes for LCP

| Class | Purpose |
|-------|---------|
| `hero-bg` | Hero background images - no fade animation |
| `profile-image` | Profile photos in hero - no fade animation |
| `no-fade` | Any image that should not fade in |
