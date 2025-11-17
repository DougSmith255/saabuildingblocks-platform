# 📖 SAA Page Building Guide

> **Last Updated:** 2025-11-09
> **Status:** Active Development Guidelines
> **Importance:** 🔴 **CRITICAL** - Read before ANY page work

---

## 🚨 ATTENTION: Claude Code & All Task Agents

**This document is MANDATORY READING before:**
- ✅ Creating any new page
- ✅ Adding any components
- ✅ Modifying page layouts
- ✅ Spawning Task agents for page building

**If you haven't read [🔴 PROJECT CONTEXT](./🔴-PROJECT-CONTEXT.md) yet, read that first!**

---

## 🎯 Core Philosophy

**Only use Master Controller components to build pages.**

Every visual element on the website should come from the shared component library (`@saa/shared/components/saa`). This ensures:

- ✅ **Global consistency** - Update once, changes everywhere
- ✅ **Maintainability** - All styling lives in one place
- ✅ **Quality control** - Every component is production-ready
- ✅ **Performance** - Optimized animations and rendering

---

## 🚫 When to Add New Components

**Be VERY selective.** Only add new components when:

1. **Spectacle Factor** - The component adds significant visual impact to the website
2. **Absolute Necessity** - Required functionality that doesn't exist (e.g., scrolling gallery, video player)
3. **Reusability** - Will be used in multiple locations across the site

### ❌ DO NOT add components for:
- One-off layouts (use existing layout components)
- Minor style variations (use className or style props)
- Single-use elements (inline JSX is fine)

---

## 📦 Available Master Controller Components

### Typography
- **`<H1>`** - Main headlines with 3D neon effect and optional hero animation
- **`<H2>`** - Section headers with neon glow
- **`<Tagline>`** - Subtitle text with optional hero animation
- **`<CyberText3D>`** - Futuristic 3D text effects

### Buttons
- **`<CTAButton>`** - Primary call-to-action with pulsing light bars and optional hero animation
- **`<SecondaryButton>`** - Secondary actions

### Cards
- **`<CyberCardHolographic>`** - Holographic card with rainbow glow
- **`<CyberCardPrismaticGlass>`** - Glass morphism card with prismatic effects

### Interactive
- Various interactive components (check `/packages/shared/components/saa/interactive/`)

### Layouts
- Layout components for structure (check `/packages/shared/components/saa/layouts/`)

---

## 🎬 2025 Hybrid Animation System

### Hero Animations (Above the Fold)

Use the `heroAnimate` prop for critical above-the-fold content:

```tsx
// H1 with entrance animation
<H1 heroAnimate animationDelay="0.6s">
  SMART AGENT ALLIANCE
</H1>

// Tagline with staggered entrance
<Tagline heroAnimate animationDelay="0.8s">
  For Agents Who Want More
</Tagline>

// CTA Buttons with sequential entrance
<CTAButton href="/join/" heroAnimate animationDelay="1.0s">
  JOIN NOW
</CTAButton>
<CTAButton href="/learn/" heroAnimate animationDelay="1.2s">
  LEARN MORE
</CTAButton>
```

**Key Features:**
- ✅ GPU-accelerated (`translate3d`, `opacity` only)
- ✅ Apple's signature easing curve: `cubic-bezier(0.16, 1, 0.3, 1)`
- ✅ Staggered delays for cascade effect (0.2s increments)
- ✅ Longer initial delays (0.6s+) ensure visibility after SSR hydration
- ✅ Respects `prefers-reduced-motion`

### Image Loading

**All images automatically fade in smoothly** - no manual work required!

```tsx
// Content images - automatic fade-in via CSS
<img src="/path/to/image.jpg" alt="Description" />

// Next.js Image component - also gets automatic fade
<Image src="/path/to/image.jpg" alt="Description" width={800} height={600} />
```

The universal image fade-in is applied via `globals.css` using:
- 0.6s duration
- Apple's easing curve
- GPU-accelerated opacity transition
- Respects user motion preferences

---

## 🛠️ Page Building Workflow

### Step 1: Plan Your Layout
Before writing code, answer:
1. What sections does this page need?
2. Which Master Controller components fit each section?
3. Do I need ANY new components, or can I use what exists?

### Step 2: Import Components
```tsx
import { H1, H2, Tagline, CTAButton, CyberCardHolographic } from '@saa/shared/components/saa';
```

### Step 3: Build with Props
Components are flexible via props - use them instead of creating variations:

```tsx
// Use className for layout
<H1 className="mb-8">My Heading</H1>

// Use style for one-off adjustments
<Tagline style={{ fontSize: '1.2rem' }}>Custom size</Tagline>

// Use heroAnimate for entrance effects
<CTAButton heroAnimate animationDelay="1.0s">Click Me</CTAButton>
```

### Step 4: Test Responsively
All Master Controller components are responsive by default. Test:
- Mobile (375px)
- Tablet (768px)
- Desktop (1440px)
- Ultra-wide (2560px)

---

## 🎨 Styling Guidelines

### Page Width Standards
**All pages must support wide screens up to 2500px:**

```tsx
// ✅ CORRECT - Use max-w-[2500px] for all page containers
<div className="max-w-[2500px] mx-auto px-4 sm:px-8 md:px-12">
  <H1>Content Here</H1>
</div>

// ❌ WRONG - Don't use max-w-7xl (1280px limit)
<div className="max-w-7xl mx-auto">
  <H1>Content Here</H1>
</div>
```

**Why 2500px?**
- Ensures content utilizes ultra-wide monitors effectively
- Prevents awkward whitespace on large displays
- Maintains readability with appropriate padding

### Hero Section Layout Standards

**Hero sections must account for the fixed header:**

```tsx
// ✅ CORRECT - Hero takes full viewport height, content centered vertically
<section
  className="relative px-4 sm:px-8 md:px-12 flex items-center justify-center"
  style={{ minHeight: '100vh' }}
>
  <div className="max-w-[2500px] mx-auto w-full text-center">
    <H1>Your Heading</H1>
    <Tagline>Your tagline</Tagline>
  </div>
</section>

// ❌ WRONG - Without flex centering, content won't be vertically centered
<section className="min-h-screen">
  <div className="max-w-[2500px] mx-auto w-full text-center">
    <H1>Your Heading</H1>
  </div>
</section>
```

**Key Points:**
- Use `minHeight: '100vh'` for full viewport height (header floats over it)
- Add `flex items-center justify-center` to section for vertical centering
- The fixed header overlays the hero, so hero should use full viewport height
- Content will be perfectly centered in the visible area below the header

### SEO & Accessibility (Built-In)

**You don't need to do anything special** - the Master Controller components already handle SEO optimization:

- **H1 Component**: Automatically includes hidden screen-reader text (`.sr-only`) that search engines read, while displaying custom Taskor font ligatures visually
  - Bots read: "SMART AGENT ALLIANCE" ✅
  - Users see: "SȺRT ȺGɆNT ȺLLIȺNCɆ" (stylized glyphs)
  - No extra code needed - just use `<H1>` normally

**Copy/Paste Protection (Site-Wide)**:
- Text selection is disabled across the entire site via `user-select: none` in `globals.css`
- Form inputs remain selectable for usability
- This protects visual design without affecting SEO (bots don't copy/paste)

### Use Tailwind Classes
```tsx
<div className="flex flex-col gap-4 items-center justify-center min-h-screen">
  <H1 heroAnimate>Welcome</H1>
  <Tagline heroAnimate animationDelay="0.8s">To the future</Tagline>
</div>
```

### Avoid Inline Styles Unless Necessary
```tsx
// ❌ Avoid
<H1 style={{ marginTop: '2rem', textAlign: 'center' }}>Heading</H1>

// ✅ Better
<H1 className="mt-8 text-center">Heading</H1>
```

### Never Override Master Controller Styles
```tsx
// ❌ NEVER DO THIS
<H1 style={{ color: 'red', fontSize: '12px' }}>Bad</H1>

// ✅ If you need different styling, propose a new component or variant
```

---

## 🚀 Adding New Components (Rare)

If you absolutely must add a new component:

### 1. Add to Master Controller First
```bash
# Create in shared components
/packages/shared/components/saa/[category]/[ComponentName].tsx
```

### 2. Follow Component Template
```tsx
'use client';

import React from 'react';

export interface MyComponentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  heroAnimate?: boolean;
  animationDelay?: string;
}

export default function MyComponent({
  children,
  className = '',
  style = {},
  heroAnimate = false,
  animationDelay = '0.6s'
}: MyComponentProps) {
  return (
    <div
      className={`my-component ${heroAnimate ? 'hero-entrance-animate' : ''} ${className}`}
      style={{
        // Base styles here
        ...(heroAnimate ? {
          opacity: 0,
          animation: `fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${animationDelay} both`,
          willChange: 'opacity, transform',
        } : {}),
        ...style
      }}
    >
      {children}

      <style jsx>{`
        /* 2025 Hero Entrance Animation */
        @keyframes fadeInUp2025 {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        /* Component-specific styles */
        .my-component {
          /* Styles here */
        }
      `}</style>
    </div>
  );
}
```

### 3. Export from Index
```tsx
// packages/shared/components/saa/[category]/index.ts
export { default as MyComponent } from './MyComponent';
```

### 4. Document Usage
Add to this guide with examples.

---

## ✅ Quality Checklist

Before considering a page "done":

- [ ] Uses only Master Controller components
- [ ] No inline styles (except truly one-off cases)
- [ ] Hero animations applied with correct stagger timing
- [ ] Responsive on all breakpoints
- [ ] Passes accessibility checks (keyboard nav, screen readers)
- [ ] Respects `prefers-reduced-motion`
- [ ] Images have proper `alt` attributes
- [ ] No console errors or warnings
- [ ] Tested in Chrome, Firefox, Safari

---

## 📚 Component Reference

For detailed component APIs and props, see:
```bash
/packages/shared/components/saa/[category]/[ComponentName].tsx
```

Each component file contains:
- TypeScript interface with all props
- Usage examples in JSDoc comments
- Implementation details

---

## 🆘 Common Patterns

### Hero Section
```tsx
<section className="min-h-screen flex items-center justify-center">
  <div className="space-y-8 text-center">
    <H1 heroAnimate animationDelay="0.6s">
      Main Headline
    </H1>
    <Tagline heroAnimate animationDelay="0.8s">
      Supporting tagline text
    </Tagline>
    <div className="flex gap-4 justify-center">
      <CTAButton href="/action" heroAnimate animationDelay="1.0s">
        Primary Action
      </CTAButton>
      <CTAButton href="/learn" heroAnimate animationDelay="1.2s">
        Learn More
      </CTAButton>
    </div>
  </div>
</section>
```

### Content Section
```tsx
<section className="py-20 px-8">
  <H2 className="text-center mb-12">Section Title</H2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <CyberCardHolographic>
      Card content here
    </CyberCardHolographic>
    {/* Repeat cards */}
  </div>
</section>
```

### Call-to-Action Section
```tsx
<section className="py-16 text-center">
  <Tagline className="mb-8">Ready to get started?</Tagline>
  <CTAButton href="/signup">
    Join Now
  </CTAButton>
</section>
```

---

## 🔄 Maintenance

When updating components:

1. **Edit the Master Controller component** in `/packages/shared/`
2. **Never edit page-level implementations** - changes cascade automatically
3. **Test in multiple contexts** - the component is used everywhere
4. **Document breaking changes** - update this guide if prop APIs change

---

## 📞 Questions?

If you need guidance on:
- Which component to use
- Whether to create a new component
- How to achieve a specific effect

**Refer to this guide first**, then check existing component implementations.

---

**Remember:** Every component added increases maintenance burden. Be ruthlessly selective. The best code is no code. 🚀
