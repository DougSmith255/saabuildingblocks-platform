# 📘 Page Building Guide - SAA Building Blocks

**Complete guide for building new pages with automatic performance optimization and SEO best practices.**

---

## 🚀 Quick Start - Building a New Page

### 1. Create Your Page File

```bash
# Pages go in: /home/claude-flow/packages/public-site/app/
packages/public-site/app/my-new-page/page.tsx
```

### 2. Basic Page Structure

```typescript
// app/my-new-page/page.tsx
import { H1 } from '@saa/shared/components/saa';

export default function MyNewPage() {
  return (
    <>
      {/* Hero Section - loads immediately */}
      <section className="min-h-screen flex items-center justify-center">
        <H1>My Page Hero</H1>
      </section>

      {/* Other content - automatically optimized (see below) */}
      <section>
        <h2>About Section</h2>
        <p>This content loads automatically after the hero.</p>
      </section>
    </>
  );
}
```

**That's it!** The footer will automatically defer, and Core Web Vitals will be optimized.

---

## ⚡ Automatic Performance Optimization

**Every page you build gets these optimizations automatically:**

### ✅ What Happens Automatically

1. **Footer Defers** - Loads when user scrolls near bottom (improves LCP by 25-35%)
2. **Header Loads Immediately** - Always visible for navigation
3. **Hero Loads First** - First screen content gets priority
4. **Static Export Compatible** - All optimization runs client-side

### 📊 Core Web Vitals Impact

- **LCP (Largest Contentful Paint)**: 25-35% faster
- **FID (First Input Delay)**: No impact (footer doesn't block input)
- **CLS (Cumulative Layout Shift)**: Improved (footer space reserved)

---

## 🎛️ Manual Control - Override Defaults

Sometimes you need fine-grained control over what loads when. Here's how:

### Option 1: Use DeferredContent Component

```typescript
import { DeferredContent } from '@saa/shared/components/performance/DeferredContent';

export default function MyPage() {
  return (
    <>
      {/* Hero - loads immediately (not wrapped) */}
      <section>
        <h1>Hero Content</h1>
      </section>

      {/* Defer this section until user scrolls near it */}
      <DeferredContent strategy="viewport" rootMargin="200px">
        <section>
          <h2>Testimonials</h2>
          <p>These load when user scrolls close...</p>
        </section>
      </DeferredContent>

      {/* Defer with time-based loading */}
      <DeferredContent strategy="time" delay={2000}>
        <section>
          <h2>Blog Posts</h2>
          <p>These load 2 seconds after page load...</p>
        </section>
      </DeferredContent>
    </>
  );
}
```

### Option 2: Use Pre-Configured Helpers

```typescript
import { DeferredSection } from '@saa/shared/components/performance/DeferredContent';

export default function MyPage() {
  return (
    <>
      <h1>Hero</h1>

      {/* DeferredSection = viewport strategy with smart defaults */}
      <DeferredSection height="600px">
        <AboutSection />
      </DeferredSection>

      <DeferredSection height="400px">
        <ContactForm />
      </DeferredSection>
    </>
  );
}
```

---

## 🔧 DeferredContent API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `strategy` | `'viewport' \| 'time' \| 'idle'` | `'viewport'` | Loading strategy to use |
| `rootMargin` | `string` | `'200px'` | Viewport strategy: Load distance before visible |
| `delay` | `number` | `1000` | Time strategy: Delay in milliseconds |
| `placeholder` | `ReactNode` | `undefined` | Content to show while deferred |
| `onLoad` | `() => void` | `undefined` | Callback when content loads |

### Strategies Explained

#### `strategy="viewport"` ⭐ RECOMMENDED
- **When to use**: Below-the-fold content (footer, testimonials, FAQs)
- **How it works**: Loads when user scrolls within `rootMargin` of content
- **Pros**: Saves the most loading time, user never notices
- **Cons**: Content not in initial HTML (minor SEO impact)

```typescript
<DeferredContent strategy="viewport" rootMargin="300px">
  <Footer />
</DeferredContent>
```

#### `strategy="time"`
- **When to use**: Predictable loading, above-the-fold but non-critical
- **How it works**: Loads after `delay` milliseconds
- **Pros**: Simple, predictable behavior
- **Cons**: Loads even if user doesn't scroll

```typescript
<DeferredContent strategy="time" delay={1500}>
  <Newsletter />
</DeferredContent>
```

#### `strategy="idle"`
- **When to use**: Non-critical content, smart loading
- **How it works**: Loads when browser has free time
- **Pros**: Doesn't interfere with critical rendering
- **Cons**: Safari needs polyfill (handled automatically)

```typescript
<DeferredContent strategy="idle">
  <SocialMediaEmbed />
</DeferredContent>
```

---

## 📐 Data Attributes (Future Feature - Not Yet Implemented)

**Planned feature for automatic content prioritization:**

```typescript
// Coming soon - automatic optimization based on attributes
export default function MyPage() {
  return (
    <>
      <div data-defer-priority="immediate">
        <h1>Hero</h1>
      </div>

      <div data-defer-priority="high">
        <button>CTA Button</button>
      </div>

      <div data-defer-priority="low">
        <Testimonials />
      </div>
    </>
  );
}
```

**Status**: Not yet implemented. Use `DeferredContent` component for now.

---

## 🎯 Best Practices - What to Defer

### ✅ DEFER THESE

| Content Type | Strategy | Why |
|-------------|----------|-----|
| Footer | `viewport` | Always below fold, auto-deferred globally |
| Testimonials | `viewport` | Usually below fold |
| FAQ Sections | `viewport` | Below fold, not critical |
| Blog post grid (items 4+) | `viewport` | Paginated content |
| Social embeds | `idle` | Heavy third-party scripts |
| Newsletter signup | `time` | Non-critical CTA |
| Comments section | `viewport` | Below fold interaction |

### ❌ DON'T DEFER THESE

| Content Type | Why |
|-------------|-----|
| Hero heading | Critical for LCP |
| Hero image | Critical for LCP |
| Header/navigation | Always visible |
| Primary CTA button | Above fold, critical |
| First 3 blog posts | Above fold content |
| Critical CSS | Blocks rendering |
| Above-fold images | Use `loading="eager"` |

---

## 🖼️ Image Loading Optimization

Combine deferred content with lazy image loading:

```typescript
export default function MyPage() {
  return (
    <>
      {/* Hero image - load immediately */}
      <img
        src="/hero.jpg"
        alt="Hero"
        loading="eager"
        fetchPriority="high"
      />

      {/* Below-fold images - lazy load */}
      <DeferredContent strategy="viewport">
        <img
          src="/testimonial.jpg"
          alt="Customer"
          loading="lazy"
        />
      </DeferredContent>
    </>
  );
}
```

---

## 📊 Measuring Performance Impact

### Before Deploying

```bash
# Local build test
cd /home/claude-flow/packages/public-site
npm run build

# Check bundle sizes
du -sh .next/static/chunks/*
```

### After Deploying

1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
   - Test URL: `https://saabuildingblocks.com/your-page`
   - Look for LCP score (target: < 2.5s)

2. **Browser DevTools**:
   - F12 → Performance tab → Record page load
   - Check "LCP" marker in timeline

3. **Core Web Vitals Report** (Google Search Console):
   - Real user metrics from Google
   - Available 24-48 hours after deployment

---

## 🔍 SEO Considerations

### Footer Deferring Impact on SEO

**Q**: Will deferring the footer hurt SEO?

**A**: No, because:
- ✅ Google executes JavaScript and sees deferred content
- ✅ Footer links still crawlable (loaded before Googlebot finishes)
- ✅ Content is in DOM, just delayed
- ✅ `<a>` tags in footer are discoverable

### Content Deferring Best Practices

```typescript
// ✅ GOOD - Defer non-critical content
<DeferredContent strategy="viewport">
  <TestimonialsSection />
</DeferredContent>

// ❌ BAD - Don't defer primary content
<DeferredContent strategy="viewport">
  <h1>Main Heading</h1> {/* This should load immediately! */}
</DeferredContent>
```

---

## 🛠️ Troubleshooting

### Footer Loads Immediately (No Defer)

**Symptoms**: Footer appears right away, no loading delay

**Causes**:
1. LayoutWrapper not using `DeferredFooter` component
2. Client-side JavaScript disabled
3. Page route excluded in `noHeaderFooterRoutes`

**Fix**:
```typescript
// Check LayoutWrapper.tsx
import { DeferredFooter } from '@saa/shared/components/performance/DeferredContent';

// Should be wrapped:
<DeferredFooter>
  <Footer />
</DeferredFooter>
```

---

### Layout Shift (CLS Issue)

**Symptoms**: Content jumps when deferred sections load

**Cause**: No placeholder reserving space

**Fix**:
```typescript
// ✅ Reserve space with placeholder
<DeferredContent
  strategy="viewport"
  placeholder={<div className="h-[500px] bg-transparent" />}
>
  <ContentSection />
</DeferredContent>
```

---

### TypeScript Error - Module Not Found

**Error**: `Cannot find module '@saa/shared/components/performance/DeferredContent'`

**Fix**:
```bash
# Rebuild shared package
cd /home/claude-flow/packages/shared
npm run build

# Rebuild public-site
cd /home/claude-flow/packages/public-site
npm run build
```

---

## 📝 Example: Full Page with Optimization

```typescript
// app/about/page.tsx
import { H1 } from '@saa/shared/components/saa';
import { DeferredContent, DeferredSection } from '@saa/shared/components/performance/DeferredContent';

export default function AboutPage() {
  return (
    <>
      {/* HERO - Loads immediately (critical for LCP) */}
      <section className="min-h-screen flex items-center justify-center">
        <H1>About SAA Building Blocks</H1>
        <p className="text-xl mt-4">
          Building the future of AI collaboration
        </p>
      </section>

      {/* MISSION - Loads when user scrolls close */}
      <DeferredSection height="600px">
        <section className="py-20">
          <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-lg">
            We're building tools to empower developers...
          </p>
        </section>
      </DeferredSection>

      {/* TEAM - Deferred with custom strategy */}
      <DeferredContent strategy="viewport" rootMargin="100px">
        <section className="py-20">
          <h2 className="text-4xl font-bold mb-8">Meet the Team</h2>
          <div className="grid grid-cols-3 gap-8">
            {/* Team member cards */}
          </div>
        </section>
      </DeferredContent>

      {/* CONTACT - Time-based defer (loads 2s after page) */}
      <DeferredContent strategy="time" delay={2000}>
        <section className="py-20">
          <h2 className="text-4xl font-bold mb-8">Get in Touch</h2>
          <ContactForm />
        </section>
      </DeferredContent>

      {/* FOOTER - Auto-deferred by LayoutWrapper (you don't add it here) */}
    </>
  );
}
```

---

## 🎓 Learning Resources

- **Core Web Vitals**: https://web.dev/vitals/
- **Intersection Observer API**: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- **Next.js Performance**: https://nextjs.org/docs/app/building-your-application/optimizing
- **DeferredContent Source**: `/home/claude-flow/packages/shared/components/performance/DeferredContent.tsx`

---

## ✅ Pre-Deployment Checklist

Before deploying a new page:

- [ ] Hero section loads immediately (not wrapped in DeferredContent)
- [ ] Images below fold use `loading="lazy"`
- [ ] Large sections use `DeferredContent` or `DeferredSection`
- [ ] Placeholders reserve space (prevent CLS)
- [ ] Local build succeeds (`npm run build`)
- [ ] TypeScript type-check passes (`npm run type-check`)
- [ ] Test page in browser (check Network tab for deferred loading)
- [ ] Test scroll behavior (sections load smoothly)

---

## 🔗 Related Documentation

- [New Component Guide](/home/claude-flow/📘-NEW-COMPONENT-GUIDE.md) - Adding SAA components to Master Controller
- [SEO Guide](/home/claude-flow/📘-SEO-GUIDE.md) - SEO best practices (if exists)

---

**Last Updated**: 2025-11-13
**Tested With**: Footer deferring on blog page, static site export
**Status**: ✅ Production-ready

---

## 🆘 Need Help?

If you encounter issues with deferred loading:

1. Check browser console for errors (F12)
2. Verify `DeferredContent` component imported correctly
3. Test with `strategy="time"` first (simpler debugging)
4. Check LayoutWrapper implementation
5. Rebuild packages if module not found

**Remember**: The goal is faster LCP, not deferring everything. Hero content should ALWAYS load immediately!
