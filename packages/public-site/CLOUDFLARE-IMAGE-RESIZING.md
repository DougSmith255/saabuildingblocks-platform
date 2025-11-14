# Cloudflare Image Resizing Setup Guide

## Overview

This project uses Cloudflare Image Resizing to automatically optimize images for different devices and screen sizes. The integration provides:

- **Automatic responsive images** - Desktop gets full quality, mobile gets optimized smaller sizes
- **Modern format conversion** - WebP/AVIF for browsers that support it
- **Lazy loading** - Images load only when needed
- **CDN caching** - Resized images cached at Cloudflare's edge
- **Static export compatible** - Works with Next.js `output: 'export'`

## Cost

Cloudflare Image Resizing costs **$5/month** for unlimited image transformations.

## Enabling Cloudflare Image Resizing

### Step 1: Enable in Cloudflare Dashboard

1. Go to your Cloudflare dashboard
2. Select your domain: `saabuildingblocks.com`
3. Navigate to **Speed** → **Optimization** → **Image Resizing**
4. Click **Enable Image Resizing**
5. Confirm the $5/month subscription

### Step 2: Verify Configuration

The Next.js configuration is already set up in `next.config.ts`:

```typescript
images: {
  loader: 'custom',
  loaderFile: './lib/cloudflare-image-loader.ts',
}
```

This tells Next.js to use our custom Cloudflare loader for all images.

## Using OptimizedImage Component

### Basic Usage

```tsx
import { OptimizedImage } from '@/components';

export default function MyPage() {
  return (
    <OptimizedImage
      src="/images/hero.jpg"
      alt="Hero image"
      width={1200}
      height={800}
    />
  );
}
```

### With Custom Quality

```tsx
<OptimizedImage
  src="/images/product.jpg"
  alt="Product photo"
  width={800}
  height={600}
  quality={90}  // Higher quality (default is 85)
/>
```

### Priority Loading (Above-the-Fold Images)

```tsx
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority={true}  // Load immediately, no lazy loading
/>
```

### Custom Sizes Attribute

```tsx
<OptimizedImage
  src="/images/sidebar.jpg"
  alt="Sidebar image"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
/>
```

### With Custom CSS Classes

```tsx
<OptimizedImage
  src="/images/avatar.jpg"
  alt="User avatar"
  width={200}
  height={200}
  className="rounded-full shadow-lg"
/>
```

## How It Works

### URL Transformation

The `cloudflare-image-loader.ts` transforms image URLs automatically:

**Original:**
```
/images/hero.jpg
```

**Cloudflare Resizing URL:**
```
/cdn-cgi/image/width=1200,quality=85,format=auto/images/hero.jpg
```

### Responsive srcset

The `OptimizedImage` component generates multiple sizes for responsive images:

```html
<img
  src="/cdn-cgi/image/width=1200,quality=85,format=auto/images/hero.jpg"
  srcset="
    /cdn-cgi/image/width=640,quality=85,format=auto/images/hero.jpg 640w,
    /cdn-cgi/image/width=750,quality=85,format=auto/images/hero.jpg 750w,
    /cdn-cgi/image/width=828,quality=85,format=auto/images/hero.jpg 828w,
    /cdn-cgi/image/width=1080,quality=85,format=auto/images/hero.jpg 1080w,
    /cdn-cgi/image/width=1200,quality=85,format=auto/images/hero.jpg 1200w
  "
  sizes="100vw"
/>
```

The browser automatically selects the appropriate size based on:
- Screen resolution
- Device pixel ratio
- Viewport width

### Format Conversion

The `format=auto` parameter tells Cloudflare to:
- Serve **WebP** to Chrome, Edge, Firefox, Opera
- Serve **AVIF** to browsers that support it
- Serve **JPEG/PNG** to older browsers (Safari < 14)

This happens automatically without any code changes.

## Performance Benefits

### Before Cloudflare Image Resizing

- Mobile users download full 2000x1500px images
- No format conversion (JPEG/PNG only)
- Larger file sizes
- Slower page loads on mobile

### After Cloudflare Image Resizing

- Mobile users get optimized 750x563px images
- WebP/AVIF format (30-50% smaller file size)
- Edge caching for instant delivery
- Faster page loads across all devices

## Example: Real-World Impact

**Desktop (1920x1080):**
- Gets: 1920w image, WebP format
- Quality: 85
- File size: ~200KB

**Tablet (768px):**
- Gets: 828w image, WebP format
- Quality: 85
- File size: ~80KB

**Mobile (375px):**
- Gets: 640w image, WebP format
- Quality: 85
- File size: ~40KB

## Testing

### Local Testing

Cloudflare Image Resizing only works in production (on Cloudflare Pages). In local development:

```bash
npm run dev
```

Images will load from `/images/` directory without transformation.

### Production Testing

After deploying to Cloudflare Pages:

1. Open DevTools → Network tab
2. Load a page with images
3. Check image requests - they should use `/cdn-cgi/image/` URLs
4. Verify `Content-Type` header shows `image/webp` or `image/avif`

## Migration Guide

### Converting Existing Images

**Before:**
```tsx
<img src="/images/hero.jpg" alt="Hero" />
```

**After:**
```tsx
import { OptimizedImage } from '@/components';

<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={800}
/>
```

### Converting Next.js Image Components

**Before:**
```tsx
import Image from 'next/image';

<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={800}
/>
```

**After:**
```tsx
import { OptimizedImage } from '@/components';

<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={800}
/>
```

## Troubleshooting

### Images Not Loading

1. **Check Cloudflare Image Resizing is enabled** in dashboard
2. **Verify deployment** - changes only work in production
3. **Check image path** - must be relative (e.g., `/images/hero.jpg`)

### External Images Not Working

External images (https://example.com/image.jpg) bypass Cloudflare Image Resizing by design. Download and host them locally for optimization.

### Quality Issues

Adjust the `quality` prop:

```tsx
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={800}
  quality={95}  // Higher quality (larger file size)
/>
```

### Images Too Large on Mobile

Adjust the `sizes` prop to better match your layout:

```tsx
<OptimizedImage
  src="/images/sidebar.jpg"
  alt="Sidebar"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
/>
```

## Additional Resources

- [Cloudflare Image Resizing Docs](https://developers.cloudflare.com/images/image-resizing/)
- [Next.js Custom Image Loader](https://nextjs.org/docs/app/api-reference/components/image#loader)
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

## Support

For issues with Cloudflare Image Resizing:
1. Check Cloudflare dashboard for service status
2. Review browser DevTools Network tab
3. Test in production (not local development)
4. Contact Cloudflare support if service is down
