# Layout Components

Reusable layout wrapper components for building full-width pages in the Smart Agent Alliance public site.

## FullWidthLayout

A flexible, full-width layout component for non-blog-post pages. Provides edge-to-edge design with optional centered content areas.

### Features

- **Full Viewport Width**: No max-width constraints by default
- **Optional Centered Content**: Add max-width containers where needed for readability
- **Flexible Spacing**: Configurable vertical and horizontal padding with responsive presets
- **Semantic HTML**: Choose from `section`, `article`, `main`, or `div` elements
- **TypeScript Support**: Fully typed props for better DX
- **Accessibility**: Built-in ARIA support
- **Custom Styling**: Accepts className and inline styles

### Installation

```tsx
import { FullWidthLayout } from '@/components/layouts';
// or
import FullWidthLayout from '@/components/layouts/FullWidthLayout';
```

### Basic Usage

#### 1. Hero Section (Full-Width)

```tsx
<FullWidthLayout
  verticalPadding="xl"
  horizontalPadding="responsive"
  ariaLabel="Hero section"
  className="min-h-screen flex items-center"
>
  <div className="text-center">
    <H1>Your Amazing Title</H1>
    <Tagline>Compelling tagline</Tagline>
  </div>
</FullWidthLayout>
```

#### 2. Centered Content Section

```tsx
<FullWidthLayout
  centered
  maxWidth="1200px"
  verticalPadding="lg"
  horizontalPadding="responsive"
>
  <article>
    <h2>Section Title</h2>
    <p>Your content here with proper max-width for readability.</p>
  </article>
</FullWidthLayout>
```

#### 3. Edge-to-Edge Background

```tsx
<FullWidthLayout
  horizontalPadding="none"
  verticalPadding="none"
  className="bg-cover bg-center"
  style={{ backgroundImage: 'url(/hero.jpg)' }}
>
  <ContentWithOwnSpacing />
</FullWidthLayout>
```

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Content to render inside the layout |
| `className` | `string` | `''` | Additional CSS classes |
| `backgroundColor` | `string` | `'transparent'` | Background color (any valid CSS color) |
| `centered` | `boolean` | `false` | Add centered content container with max-width |
| `maxWidth` | `string` | `'1400px'` | Max width when `centered` is true |
| `verticalPadding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'custom'` | `'lg'` | Vertical padding preset |
| `customVerticalPadding` | `string` | - | Custom padding value (use with `verticalPadding="custom"`) |
| `horizontalPadding` | `'none' \| 'responsive' \| 'custom'` | `'responsive'` | Horizontal padding preset |
| `customHorizontalPadding` | `string` | - | Custom padding value (use with `horizontalPadding="custom"`) |
| `ariaLabel` | `string` | - | ARIA label for accessibility |
| `id` | `string` | - | HTML id attribute (useful for anchor links) |
| `as` | `'div' \| 'section' \| 'article' \| 'main'` | `'section'` | Semantic HTML element to render |

### Padding Presets

#### Vertical Padding

- `none`: No vertical padding
- `sm`: `py-8` (2rem)
- `md`: `py-12` (3rem)
- `lg`: `py-16` (4rem) - Default
- `xl`: `py-24` (6rem)
- `custom`: Use `customVerticalPadding` prop

#### Horizontal Padding

- `none`: No horizontal padding (true edge-to-edge)
- `responsive`: Responsive padding that adapts to screen size
  - Mobile: `px-6` (1.5rem / 24px)
  - Tablet: `px-12` (3rem / 48px)
  - Desktop: `px-20` (5rem / 80px)
- `custom`: Use `customHorizontalPadding` prop

### Advanced Examples

#### Custom Fluid Spacing

```tsx
<FullWidthLayout
  verticalPadding="custom"
  customVerticalPadding="clamp(3rem, 10vh, 10rem)"
  horizontalPadding="custom"
  customHorizontalPadding="clamp(1rem, 5vw, 5rem)"
>
  <FluidContent />
</FullWidthLayout>
```

#### Multiple Sections

```tsx
<>
  {/* Hero */}
  <FullWidthLayout
    verticalPadding="xl"
    className="min-h-screen bg-gradient-to-b from-[#2d2d2d] to-[#0c0c0c]"
  >
    <HeroContent />
  </FullWidthLayout>

  {/* Features */}
  <FullWidthLayout
    centered
    maxWidth="1200px"
    verticalPadding="lg"
  >
    <FeaturesGrid />
  </FullWidthLayout>

  {/* CTA */}
  <FullWidthLayout
    verticalPadding="xl"
    backgroundColor="rgba(255, 215, 0, 0.05)"
  >
    <CTASection />
  </FullWidthLayout>
</>
```

#### Article/Blog Layout

```tsx
<FullWidthLayout
  as="article"
  centered
  maxWidth="800px"
  verticalPadding="lg"
  className="blog-content"
>
  <BlogPostContent />
</FullWidthLayout>
```

### Design Patterns

#### Pattern 1: Hero + Content + CTA

Common pattern for landing pages:

```tsx
export default function LandingPage() {
  return (
    <main>
      {/* Full-width hero with background */}
      <FullWidthLayout
        verticalPadding="xl"
        horizontalPadding="responsive"
        className="min-h-screen flex items-center bg-gradient-to-b from-gray-900 to-black"
      >
        <HeroSection />
      </FullWidthLayout>

      {/* Centered content for readability */}
      <FullWidthLayout
        centered
        maxWidth="1200px"
        verticalPadding="lg"
      >
        <ContentSection />
      </FullWidthLayout>

      {/* Full-width CTA with colored background */}
      <FullWidthLayout
        verticalPadding="xl"
        backgroundColor="rgba(255, 215, 0, 0.1)"
      >
        <CTASection />
      </FullWidthLayout>
    </main>
  );
}
```

#### Pattern 2: Image Backgrounds

Full-bleed images with overlay content:

```tsx
<FullWidthLayout
  horizontalPadding="none"
  verticalPadding="xl"
  className="relative bg-cover bg-center"
  style={{ backgroundImage: 'url(/images/hero.jpg)' }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/60" />

  {/* Content */}
  <div className="relative z-10 px-6 sm:px-12 md:px-16 lg:px-20">
    <div className="max-w-4xl mx-auto text-white">
      <h1>Overlay Content</h1>
    </div>
  </div>
</FullWidthLayout>
```

#### Pattern 3: Grid Layouts

Full-width grids with responsive padding:

```tsx
<FullWidthLayout
  verticalPadding="lg"
  horizontalPadding="responsive"
>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {items.map(item => (
      <Card key={item.id} {...item} />
    ))}
  </div>
</FullWidthLayout>
```

### Comparison with Other Layouts

| Layout Type | Max Width | Padding | Use Case |
|-------------|-----------|---------|----------|
| **FullWidthLayout** | None (or optional centered) | Configurable | Non-blog pages, heroes, full-bleed sections |
| **Blog Layout** | Fixed max-width | Standard | Blog posts, long-form articles |
| **Container** | Fixed max-width | Standard | Traditional boxed layouts |

### Accessibility

The component supports standard ARIA attributes:

```tsx
<FullWidthLayout
  ariaLabel="Main features section"
  id="features"
  as="section"
>
  <h2 id="features-heading">Features</h2>
  {/* ... */}
</FullWidthLayout>
```

### Browser Support

Works in all modern browsers. Uses standard CSS properties:
- Flexbox for layout
- CSS custom properties for theming
- Responsive breakpoints via Tailwind CSS

### See Also

- **USAGE_EXAMPLES.tsx**: Comprehensive examples for all use cases
- **Homepage** (`/app/page.tsx`): Real-world hero section example
- **Blog Page** (`/app/real-estate-agent-job/page.tsx`): Content layout example
- **Global CSS** (`/app/globals.css`): Available utility classes

### Contributing

When adding new layout patterns:
1. Add example to USAGE_EXAMPLES.tsx
2. Document new props in this README
3. Ensure TypeScript types are updated
4. Test responsive behavior on mobile/tablet/desktop
