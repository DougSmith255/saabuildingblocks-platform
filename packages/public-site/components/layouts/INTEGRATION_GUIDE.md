# FullWidthLayout Integration Guide

This guide shows how to integrate the FullWidthLayout component into your Next.js pages.

## Quick Start

### 1. Import the Component

```tsx
import { FullWidthLayout } from '@/components/layouts';
```

### 2. Use in Your Page

```tsx
export default function MyPage() {
  return (
    <main id="main-content">
      <FullWidthLayout verticalPadding="xl" horizontalPadding="responsive">
        <h1>My Page</h1>
        <p>Content goes here</p>
      </FullWidthLayout>
    </main>
  );
}
```

## Integration with Existing Pages

### Converting Existing Pages

#### Before (Manual Layout)

```tsx
export default function OldPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <section className="relative px-6 sm:px-12 md:px-16 lg:px-20 pt-32 pb-16">
        <div className="w-full text-center">
          <H1>Title</H1>
          <Tagline>Subtitle</Tagline>
        </div>
      </section>
    </main>
  );
}
```

#### After (Using FullWidthLayout)

```tsx
import { FullWidthLayout } from '@/components/layouts';

export default function NewPage() {
  return (
    <main id="main-content">
      <FullWidthLayout
        verticalPadding="custom"
        customVerticalPadding="8rem 4rem"
        horizontalPadding="responsive"
        className="min-h-screen"
      >
        <div className="w-full text-center">
          <H1>Title</H1>
          <Tagline>Subtitle</Tagline>
        </div>
      </FullWidthLayout>
    </main>
  );
}
```

## Real-World Examples

### Example 1: Homepage-Style Layout

Similar to `/app/page.tsx`:

```tsx
import { FullWidthLayout } from '@/components/layouts';
import { H1, Tagline, CTAButton } from '@saa/shared/components/saa';

export default function HomePage() {
  return (
    <main id="main-content">
      {/* Hero Section */}
      <FullWidthLayout
        verticalPadding="xl"
        horizontalPadding="responsive"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        ariaLabel="Hero section"
      >
        {/* Background Image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'url(/images/hero-bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          <H1>SMART AGENT ALLIANCE</H1>
          <Tagline>For Agents Who Want More</Tagline>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CTAButton href="/join">JOIN THE ALLIANCE</CTAButton>
            <CTAButton href="/learn-more">LEARN MORE</CTAButton>
          </div>
        </div>
      </FullWidthLayout>
    </main>
  );
}
```

### Example 2: Blog-Style Layout

Similar to `/app/real-estate-agent-job/page.tsx`:

```tsx
import { FullWidthLayout } from '@/components/layouts';
import { H1, Tagline } from '@saa/shared/components/saa';

export default function BlogPage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <FullWidthLayout
        verticalPadding="custom"
        customVerticalPadding="8rem 4rem"
        horizontalPadding="responsive"
        ariaLabel="Page header"
      >
        <div className="w-full text-center">
          <H1 id="blog-heading">Agent Success Hub</H1>
          <Tagline>Expert Insights, Career Guidance, and Industry Trends</Tagline>
        </div>
      </FullWidthLayout>

      {/* Content Section */}
      <FullWidthLayout
        centered
        maxWidth="1400px"
        verticalPadding="lg"
        horizontalPadding="responsive"
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Blog cards */}
        </div>
      </FullWidthLayout>
    </main>
  );
}
```

### Example 3: Multi-Section Landing Page

```tsx
import { FullWidthLayout } from '@/components/layouts';
import { H1, Tagline, CTAButton } from '@saa/shared/components/saa';

export default function LandingPage() {
  return (
    <main id="main-content">
      {/* Hero - Full-width background */}
      <FullWidthLayout
        verticalPadding="xl"
        className="min-h-screen flex items-center bg-gradient-to-b from-[#2d2d2d] to-[#0c0c0c]"
      >
        <div className="text-center w-full">
          <H1>Transform Your Career</H1>
          <Tagline>Join thousands of successful agents</Tagline>
          <div className="mt-8">
            <CTAButton href="/get-started">Get Started</CTAButton>
          </div>
        </div>
      </FullWidthLayout>

      {/* Features - Centered content */}
      <FullWidthLayout
        centered
        maxWidth="1200px"
        verticalPadding="lg"
        id="features"
        ariaLabel="Features section"
      >
        <h2 className="text-3xl font-bold text-[#e5e4dd] mb-8 text-center">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature cards */}
        </div>
      </FullWidthLayout>

      {/* Testimonials - Full-width with background */}
      <FullWidthLayout
        verticalPadding="xl"
        backgroundColor="rgba(255, 215, 0, 0.05)"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#e5e4dd] mb-8">
            What Agents Say
          </h2>
          {/* Testimonials */}
        </div>
      </FullWidthLayout>

      {/* CTA - Full-width with gradient */}
      <FullWidthLayout
        verticalPadding="xl"
        className="bg-gradient-to-r from-[#ffd700]/20 to-[#00ff88]/20"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#ffd700] mb-6">
            Ready to Get Started?
          </h2>
          <CTAButton href="/sign-up">Join Now</CTAButton>
        </div>
      </FullWidthLayout>
    </main>
  );
}
```

## Best Practices

### 1. Semantic HTML

Always use the appropriate semantic element:

```tsx
// For main content area
<FullWidthLayout as="main" /* ... */>

// For article pages
<FullWidthLayout as="article" /* ... */>

// For distinct sections
<FullWidthLayout as="section" /* ... */>

// For generic containers
<FullWidthLayout as="div" /* ... */>
```

### 2. Accessibility

Always include ARIA labels for sections:

```tsx
<FullWidthLayout
  ariaLabel="Hero section"
  id="hero"
  as="section"
>
  <h1 id="hero-heading">Title</h1>
</FullWidthLayout>
```

### 3. Responsive Design

Use responsive padding for consistent spacing:

```tsx
// Good: Responsive padding
<FullWidthLayout horizontalPadding="responsive">

// Better: Custom fluid padding
<FullWidthLayout
  horizontalPadding="custom"
  customHorizontalPadding="clamp(1rem, 5vw, 5rem)"
>
```

### 4. Background Images

For full-bleed backgrounds, set horizontal padding to "none" and add padding to inner content:

```tsx
<FullWidthLayout
  horizontalPadding="none"
  verticalPadding="xl"
  className="bg-cover bg-center"
  style={{ backgroundImage: 'url(/hero.jpg)' }}
>
  {/* Dark overlay for text readability */}
  <div className="absolute inset-0 bg-black/50" />

  {/* Content with responsive padding */}
  <div className="relative z-10 px-6 sm:px-12 md:px-16 lg:px-20">
    <Content />
  </div>
</FullWidthLayout>
```

### 5. Centered Content

Use centered layout for text-heavy content:

```tsx
<FullWidthLayout
  centered
  maxWidth="800px"  // Optimal for reading
  verticalPadding="lg"
>
  <article className="prose prose-invert">
    <LongFormContent />
  </article>
</FullWidthLayout>
```

## Common Patterns

### Pattern: Alternating Sections

```tsx
<>
  {/* Full-width dark section */}
  <FullWidthLayout
    backgroundColor="rgb(25, 24, 24)"
    verticalPadding="lg"
  >
    <Section1 />
  </FullWidthLayout>

  {/* Centered light section */}
  <FullWidthLayout
    centered
    maxWidth="1200px"
    verticalPadding="lg"
  >
    <Section2 />
  </FullWidthLayout>

  {/* Full-width accent section */}
  <FullWidthLayout
    backgroundColor="rgba(255, 215, 0, 0.1)"
    verticalPadding="lg"
  >
    <Section3 />
  </FullWidthLayout>
</>
```

### Pattern: Hero + Content Grid

```tsx
<main id="main-content">
  {/* Hero */}
  <FullWidthLayout
    verticalPadding="xl"
    className="min-h-screen flex items-center"
  >
    <HeroContent />
  </FullWidthLayout>

  {/* Grid */}
  <FullWidthLayout
    verticalPadding="lg"
    horizontalPadding="responsive"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <GridItems />
    </div>
  </FullWidthLayout>
</main>
```

## TypeScript Support

The component is fully typed:

```tsx
import { FullWidthLayout, FullWidthLayoutProps } from '@/components/layouts';

// Type-safe props
const layoutProps: FullWidthLayoutProps = {
  centered: true,
  maxWidth: '1200px',
  verticalPadding: 'lg',
  horizontalPadding: 'responsive',
  ariaLabel: 'Main section',
};

<FullWidthLayout {...layoutProps}>
  <Content />
</FullWidthLayout>
```

## Migration Checklist

When migrating existing pages:

- [ ] Import FullWidthLayout component
- [ ] Replace manual section/div with FullWidthLayout
- [ ] Map existing padding classes to props
- [ ] Add semantic HTML element (`as` prop)
- [ ] Add ARIA label for accessibility
- [ ] Test responsive behavior
- [ ] Verify background images/colors work correctly
- [ ] Check centered content max-width

## Troubleshooting

### Issue: Content not centered

```tsx
// Add centered prop
<FullWidthLayout centered maxWidth="1200px">
```

### Issue: Too much padding

```tsx
// Use smaller preset or none
<FullWidthLayout verticalPadding="sm" horizontalPadding="none">
```

### Issue: Background not full-width

```tsx
// Remove horizontal padding
<FullWidthLayout horizontalPadding="none">
```

### Issue: Custom spacing not working

```tsx
// Use custom padding prop
<FullWidthLayout
  verticalPadding="custom"
  customVerticalPadding="5rem 2rem"
>
```
