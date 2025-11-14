# OptimizedImage Component

Quick reference for using the OptimizedImage component with Cloudflare Image Resizing.

## Import

```tsx
import { OptimizedImage } from '@/components';
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `src` | string | ✅ | - | Image path (e.g., `/images/hero.jpg`) |
| `alt` | string | ✅ | - | Alternative text for accessibility |
| `width` | number | ✅ | - | Image width in pixels |
| `height` | number | ✅ | - | Image height in pixels |
| `quality` | number | ❌ | 85 | Image quality (1-100) |
| `className` | string | ❌ | '' | CSS classes |
| `priority` | boolean | ❌ | false | Load immediately (no lazy loading) |
| `sizes` | string | ❌ | '100vw' | Responsive sizes attribute |

## Examples

### Basic Usage

```tsx
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={800}
/>
```

### High Quality

```tsx
<OptimizedImage
  src="/images/product.jpg"
  alt="Product photo"
  width={800}
  height={600}
  quality={95}
/>
```

### Priority (Above-the-Fold)

```tsx
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority={true}
/>
```

### Responsive Sizes

```tsx
<OptimizedImage
  src="/images/sidebar.jpg"
  alt="Sidebar image"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
/>
```

### With Tailwind CSS

```tsx
<OptimizedImage
  src="/images/avatar.jpg"
  alt="User avatar"
  width={200}
  height={200}
  className="rounded-full shadow-lg hover:scale-105 transition-transform"
/>
```

## Generated srcset

The component automatically generates responsive srcset for standard breakpoints:

- 640w (mobile)
- 750w (mobile landscape)
- 828w (tablet)
- 1080w (tablet landscape)
- 1200w (desktop)
- 1920w (desktop HD)
- 2048w (desktop 2K)
- 3840w (desktop 4K)

Only widths ≤ your specified `width` prop are included.

## How It Works

1. **URL Transformation**: Converts `/images/hero.jpg` → `/cdn-cgi/image/width=1200,quality=85,format=auto/images/hero.jpg`
2. **Format Selection**: Cloudflare serves WebP/AVIF to modern browsers, JPEG/PNG to older browsers
3. **Responsive Loading**: Browser selects appropriate size based on screen size and pixel density
4. **Lazy Loading**: Images load when scrolled into view (unless `priority={true}`)

## Best Practices

### Use priority for above-the-fold images

```tsx
{/* Hero section - loads immediately */}
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority={true}
/>

{/* Below-the-fold - lazy loads */}
<OptimizedImage
  src="/images/feature-1.jpg"
  alt="Feature 1"
  width={800}
  height={600}
/>
```

### Set appropriate sizes

```tsx
{/* Full-width on mobile, 50% on desktop */}
<OptimizedImage
  src="/images/content.jpg"
  alt="Content"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, 50vw"
/>

{/* Sidebar - fixed 400px on desktop */}
<OptimizedImage
  src="/images/sidebar.jpg"
  alt="Sidebar"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
/>
```

### Use correct aspect ratios

```tsx
{/* Match actual image dimensions */}
<OptimizedImage
  src="/images/photo.jpg"  {/* 1600x1200 actual size */}
  alt="Photo"
  width={1600}
  height={1200}
/>
```

### Adjust quality based on content

```tsx
{/* Photographs - standard quality */}
<OptimizedImage src="/images/photo.jpg" alt="Photo" width={800} height={600} quality={85} />

{/* Graphics/text - higher quality */}
<OptimizedImage src="/images/diagram.png" alt="Diagram" width={800} height={600} quality={95} />

{/* Backgrounds - lower quality */}
<OptimizedImage src="/images/bg.jpg" alt="" width={1920} height={1080} quality={75} />
```

## Notes

- **External images** (https://...) bypass Cloudflare Image Resizing
- **Local development** shows original images (no transformation)
- **Production only** - Cloudflare Image Resizing works on deployed site
- **Caching** - Resized images are cached at Cloudflare edge for fast delivery
