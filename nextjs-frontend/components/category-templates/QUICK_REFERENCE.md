# Category Template Components - Quick Reference Card

## 🚀 Import

```tsx
import {
  TemplateSection,
  TemplateHero,
  TemplateFeatureGrid,
  TemplateCTA
} from '@/components/category-templates';
```

---

## 📦 Components

### TemplateSection

**Purpose:** Wrapper for all sections

```tsx
<TemplateSection variant="default" | "dark" | "accent">
  {children}
</TemplateSection>
```

**Props:**
- `children` - Content
- `variant?` - Background style
- `className?` - Additional classes
- `disableAnimation?` - Disable scroll animation

---

### TemplateHero

**Purpose:** Hero section with title, subtitle, CTA

```tsx
<TemplateHero
  title="Your Title"
  subtitle="Your subtitle"
  ctaText="Get Started"      // optional
  ctaLink="/contact"         // optional
  backgroundImage="/bg.jpg"  // optional
/>
```

**Typography:**
- Title: H1, Taskor font (auto), `#e5e4dd`
- Subtitle: Body, Amulya font, `#dcdbd5`

---

### TemplateFeatureGrid

**Purpose:** Grid of feature cards

```tsx
<TemplateFeatureGrid
  features={[
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Feature Title",
      description: "Feature description"
    }
  ]}
  columns={3}  // 2, 3, or 4
/>
```

**Grid:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 2-4 columns (based on prop)

---

### TemplateCTA

**Purpose:** Call-to-action section

```tsx
<TemplateCTA
  heading="Ready to Start?"
  description="Join thousands of users"
  ctaText="Start Free Trial"
  ctaLink="/sign-up"
  variant="gradient"  // "default" | "gradient" | "minimal"
/>
```

**Variants:**
- `default` - Dark gradient
- `gradient` - Accent gradient with glow
- `minimal` - Transparent

---

## 🎨 Brand Colors

```tsx
// Headings
text-[#e5e4dd]

// Body text
text-[#dcdbd5]

// Accent (links, highlights)
text-[#00ff88]
border-[#00ff88]/20

// Backgrounds
bg-[#0a0a0a]
bg-[#111]
```

---

## 📝 Typography

```tsx
// H1 (hero title) - Taskor auto-applied
<h1>Title</h1>

// H2 (section title) - Taskor auto-applied
<h2>Section Title</h2>

// H3 (feature title) - Taskor explicit
<h3 className="font-[var(--font-taskor)]">Feature</h3>

// Body text - Amulya explicit
<p className="font-[var(--font-amulya)]">Body text</p>

// Fluid sizing
text-[clamp(2rem, 5vw, 3.5rem)]
```

---

## 🎬 Animations

All components use scroll-triggered animations:

```tsx
// Automatic via whileInView
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={fadeInUp}
>
```

**Variants:**
- `fadeInUp` - Fade in with upward motion
- `scaleIn` - Scale in with fade
- `staggerContainer` - Stagger children

---

## 📱 Responsive

**Breakpoints:**
- Mobile: `320px - 767px`
- Tablet: `768px - 1023px`
- Desktop: `1024px+`

**Padding:**
```tsx
py-12 px-4 md:py-20 md:px-6 lg:py-24
```

**Grid:**
```tsx
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## 🧩 Complete Page Template

```tsx
'use client';

import {
  TemplateSection,
  TemplateHero,
  TemplateFeatureGrid,
  TemplateCTA
} from '@/components/category-templates';
import { Sparkles, Target, Zap } from 'lucide-react';

export default function CategoryPage() {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Feature One",
      description: "Description of feature one"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Feature Two",
      description: "Description of feature two"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Feature Three",
      description: "Description of feature three"
    }
  ];

  return (
    <>
      {/* Hero */}
      <TemplateSection>
        <TemplateHero
          title="Page Title"
          subtitle="Page subtitle"
          ctaText="Get Started"
          ctaLink="/contact"
        />
      </TemplateSection>

      {/* Features */}
      <TemplateSection variant="dark">
        <h2 className="mb-12 text-center text-4xl font-bold">
          Section Title
        </h2>
        <TemplateFeatureGrid features={features} columns={3} />
      </TemplateSection>

      {/* CTA */}
      <TemplateSection>
        <TemplateCTA
          heading="Ready to Start?"
          description="Join thousands of users"
          ctaText="Start Free Trial"
          ctaLink="/sign-up"
          variant="gradient"
        />
      </TemplateSection>
    </>
  );
}
```

---

## ✅ Checklist

Before deploying:

- [ ] All text uses brand colors
- [ ] H1/H2 auto-apply Taskor (no class needed)
- [ ] Body text uses Amulya font
- [ ] CTA buttons use SAA CTAButton
- [ ] Test at 375px, 768px, 1024px, 1920px
- [ ] Scroll animations trigger correctly
- [ ] No arbitrary colors (gray-300, #aaa, etc.)
- [ ] Feature grid adapts to screen size
- [ ] All links work correctly

---

## 🔗 Files

**Components:**
- `/components/category-templates/TemplateSection.tsx`
- `/components/category-templates/TemplateHero.tsx`
- `/components/category-templates/TemplateFeatureGrid.tsx`
- `/components/category-templates/TemplateCTA.tsx`
- `/components/category-templates/index.ts`

**Types:**
- `/types/category-templates.ts`

**Docs:**
- `/components/category-templates/README.md` (full docs)
- `/components/category-templates/COMPONENT_ARCHITECTURE.md` (diagrams)
- `/components/category-templates/QUICK_REFERENCE.md` (this file)

---

## 🚨 Common Mistakes

❌ **DON'T:**
```tsx
// Arbitrary colors
<div className="text-gray-300">

// Missing font classes
<h3>Title</h3>

// Nesting sections
<TemplateSection>
  <TemplateSection>...</TemplateSection>
</TemplateSection>
```

✅ **DO:**
```tsx
// Brand colors
<div className="text-[#dcdbd5]">

// Explicit font classes (H3+)
<h3 className="font-[var(--font-taskor)]">Title</h3>

// Flat section structure
<TemplateSection>...</TemplateSection>
<TemplateSection>...</TemplateSection>
```

---

**Need help? Check README.md for full documentation.**
