# Category Template Components

Reusable React components for building consistent, animated category template pages across the SAA platform.

## 📋 Overview

This component library provides 4 core building blocks for category templates:

1. **TemplateSection** - Base wrapper with animation orchestration
2. **TemplateHero** - Hero section with title, subtitle, and CTA
3. **TemplateFeatureGrid** - Responsive grid of features with icons
4. **TemplateCTA** - Call-to-action section with button

All components are:
- ✅ **Mobile-first responsive** (320px → 1920px+)
- ✅ **Scroll-triggered animations** (Framer Motion)
- ✅ **Typography-aware** (Master Controller integration)
- ✅ **Brand color compliant** (no arbitrary colors)
- ✅ **TypeScript strict mode** (full type safety)

---

## 🚀 Quick Start

### Installation

Components are already installed in your project. Import from:

```tsx
import {
  TemplateSection,
  TemplateHero,
  TemplateFeatureGrid,
  TemplateCTA
} from '@/components/category-templates';
```

### Basic Page Template

```tsx
// app/(category)/marketing/page.tsx
'use client';

import {
  TemplateSection,
  TemplateHero,
  TemplateFeatureGrid,
  TemplateCTA
} from '@/components/category-templates';
import { Sparkles, Target, Zap } from 'lucide-react';

export default function MarketingPage() {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI-Powered Automation",
      description: "Smart tools that learn from your workflow and optimize campaigns automatically"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Precision Targeting",
      description: "Reach the right audience at the right time with advanced segmentation"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-Time Analytics",
      description: "Track performance with live dashboards and actionable insights"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <TemplateSection>
        <TemplateHero
          title="Marketing Solutions That Drive Results"
          subtitle="AI-powered tools for modern marketers who demand performance"
          ctaText="Get Started"
          ctaLink="/contact"
        />
      </TemplateSection>

      {/* Features Section */}
      <TemplateSection variant="dark">
        <h2 className="mb-12 text-center text-4xl font-bold">
          Why Choose Our Platform?
        </h2>
        <TemplateFeatureGrid
          features={features}
          columns={3}
        />
      </TemplateSection>

      {/* CTA Section */}
      <TemplateSection>
        <TemplateCTA
          heading="Ready to Transform Your Marketing?"
          description="Join thousands of teams already using our platform to achieve better results"
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

## 📦 Component API

### TemplateSection

Base wrapper component that provides consistent spacing and animation orchestration.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Section content |
| `variant` | `'default' \| 'dark' \| 'accent'` | `'default'` | Background style variant |
| `className` | `string` | `''` | Additional CSS classes |
| `disableAnimation` | `boolean` | `false` | Disable scroll animation |

**Variants:**
- `default` - Transparent background
- `dark` - Dark solid background (#0a0a0a)
- `accent` - Gradient with accent color tint

**Example:**

```tsx
<TemplateSection variant="dark" className="py-32">
  <div>Your content here</div>
</TemplateSection>
```

---

### TemplateHero

Hero section with large title, subtitle, optional background image, and CTA button.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Main heading (H1) |
| `subtitle` | `string` | required | Subtitle/description text |
| `backgroundImage` | `string` | `undefined` | Background image URL |
| `ctaText` | `string` | `undefined` | CTA button text |
| `ctaLink` | `string` | `undefined` | CTA button link |
| `className` | `string` | `''` | Additional CSS classes |

**Features:**
- H1 auto-applies Taskor display font
- Fluid typography: `clamp(2rem, 5vw, 3.5rem)`
- Optional background image with gradient overlay
- Integrated SAA CTAButton component
- Text shadow for readability

**Example:**

```tsx
<TemplateHero
  title="Marketing Solutions"
  subtitle="AI-powered tools for modern marketers"
  backgroundImage="/images/hero-bg.jpg"
  ctaText="Get Started"
  ctaLink="/contact"
/>
```

---

### TemplateFeatureGrid

Responsive grid of feature cards with icons, titles, and descriptions.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `features` | `TemplateFeature[]` | required | Array of features |
| `columns` | `2 \| 3 \| 4` | `3` | Grid columns on desktop |
| `className` | `string` | `''` | Additional CSS classes |

**TemplateFeature Interface:**

```tsx
interface TemplateFeature {
  icon: ReactNode;     // Icon component or emoji
  title: string;       // Feature title
  description: string; // Feature description
}
```

**Grid Behavior:**
- Mobile: 1 column (320px+)
- Tablet: 2 columns (768px+)
- Desktop: 2-4 columns (1024px+)

**Example:**

```tsx
const features = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "AI-Powered",
    description: "Smart automation that learns from your workflow"
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Precision Targeting",
    description: "Reach the right audience at the right time"
  }
];

<TemplateFeatureGrid features={features} columns={3} />
```

---

### TemplateCTA

Call-to-action section with heading, description, and button.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | `string` | required | CTA heading |
| `description` | `string` | required | CTA description |
| `ctaText` | `string` | required | Button text |
| `ctaLink` | `string` | required | Button link |
| `variant` | `'default' \| 'gradient' \| 'minimal'` | `'default'` | Visual variant |
| `className` | `string` | `''` | Additional CSS classes |

**Variants:**
- `default` - Dark gradient background
- `gradient` - Accent gradient with glow effect
- `minimal` - Transparent background

**Example:**

```tsx
<TemplateCTA
  heading="Ready to Get Started?"
  description="Join thousands of teams already using our platform"
  ctaText="Start Free Trial"
  ctaLink="/sign-up"
  variant="gradient"
/>
```

---

## 🎨 Design System Integration

### Typography

All components use Master Controller typography settings:

- **H1 (Hero title)**: Auto-applies Taskor display font
- **H2 (Section titles)**: Auto-applies Taskor display font
- **H3 (Feature titles)**: Taskor via `font-[var(--font-taskor)]`
- **Body text**: Amulya via `font-[var(--font-amulya)]`
- **Button text**: Taskor via SAA CTAButton component

### Brand Colors

Components use only approved brand colors:

- **Headings**: `#e5e4dd`
- **Body text**: `#dcdbd5`
- **Accent**: `#00ff88`
- **Backgrounds**: `#0a0a0a`, `#111`

### Responsive Typography

All text uses fluid `clamp()` for smooth scaling:

```css
/* Example: Hero title */
font-size: clamp(2rem, 5vw, 3.5rem);

/* Example: Body text */
font-size: clamp(1rem, 2vw, 1.125rem);
```

---

## 🎬 Animation System

### Scroll-Triggered Animations

All components use Framer Motion with Intersection Observer for scroll-triggered animations:

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={fadeInUp}
>
  {/* Content */}
</motion.div>
```

### Animation Variants

Components use these animation variants from `/lib/animations.ts`:

- **fadeInUp** - Fade in with upward motion (used in TemplateSection, TemplateHero)
- **scaleIn** - Scale in with fade (used in TemplateCTA)
- **staggerContainer** - Stagger children animation (used in TemplateFeatureGrid)

### Performance

- `viewport={{ once: true }}` - Animations run once (no re-trigger on scroll)
- `amount: 0.2` - Trigger when 20% of element is visible
- GPU-accelerated transforms (translateY, scale, opacity)

---

## 📱 Mobile-First Responsive

All components are built mobile-first with these breakpoints:

```
Mobile:  320px - 767px   (1 column)
Tablet:  768px - 1023px  (2 columns)
Desktop: 1024px+         (2-4 columns)
```

### Responsive Padding

```tsx
// Mobile → Desktop
py-12 px-4 md:py-20 md:px-6 lg:py-24
```

### Responsive Grid

```tsx
// TemplateFeatureGrid with columns={3}
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## 🧪 Testing

### Visual Testing Checklist

Test each component at these breakpoints:

- [ ] **Mobile**: 375x667 (iPhone SE)
- [ ] **Mobile**: 390x844 (iPhone 12)
- [ ] **Tablet**: 768x1024 (iPad)
- [ ] **Desktop**: 1280x720
- [ ] **Desktop**: 1920x1080

### Functionality Testing

- [ ] Scroll animations trigger correctly
- [ ] CTA buttons link to correct URLs
- [ ] Feature grid adapts to column count
- [ ] Typography settings apply from Master Controller
- [ ] Brand colors are consistent (no arbitrary colors)
- [ ] Text remains readable at all sizes

### Accessibility Testing

- [ ] Semantic HTML (section, h1, h2, h3, p)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

---

## 📝 TypeScript Types

All types are exported from `/types/category-templates.ts`:

```tsx
import type {
  TemplateHeroProps,
  TemplateFeatureGridProps,
  TemplateCTAProps,
  TemplateSectionProps,
  TemplateFeature
} from '@/types/category-templates';
```

---

## 🚨 Best Practices

### DO ✅

- Use TemplateSection as the outer wrapper for each section
- Keep feature descriptions concise (< 150 characters)
- Use Lucide React icons for feature grid icons
- Test at multiple screen sizes before deploying
- Follow the page structure: Hero → Features → CTA

### DON'T ❌

- Don't nest TemplateSection components
- Don't use arbitrary colors (use brand colors only)
- Don't add custom animations (use provided variants)
- Don't override typography font families
- Don't use hover effects as primary interactions (mobile users)

---

## 🔗 Related Documentation

- [AI Agent Page Building Protocol](/home/claude-flow/docs/AI-AGENT-PAGE-BUILDING-PROTOCOL.md)
- [SAA Component Library Guide](/home/claude-flow/docs/SAA-COMPONENT-LIBRARY-GUIDE.md)
- [Display Text System](/home/claude-flow/docs/display-text-system.md)
- [CSS Framework Guide](/home/claude-flow/docs/CSS-FRAMEWORK-GUIDE.md)

---

## 📞 Support

For questions or issues with these components:

1. Check this README first
2. Review the [AI Agent Page Building Protocol](/home/claude-flow/docs/AI-AGENT-PAGE-BUILDING-PROTOCOL.md)
3. Check component source code for inline documentation
4. Contact the development team

---

**Built with ❤️ by the SAA Development Team**
