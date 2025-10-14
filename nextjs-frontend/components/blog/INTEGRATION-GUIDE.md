# Image Components - Integration Guide for Workers

Quick reference guide for integrating WordPress image components.

---

## For Worker 1: BlogCard

Your BlogCard already has image implementation. **Optional upgrade:**

```typescript
import { BlogThumbnail } from '@/components/blog';

// Replace your current image code with:
<BlogThumbnail
  post={post}
  size="medium"
  aspectRatio="16/9"
  className="rounded-lg"
/>
```

**Benefits:**
- Optimized sizes for thumbnails
- Built-in fallback handling
- Hover scale effect
- Consistent with other components

**Current implementation works fine too!** Only upgrade if you want consistency.

---

## For Worker 2: Blog Template (Listing Page)

Use `BlogThumbnail` for grid/list layouts:

```typescript
import { BlogThumbnail } from '@/components/blog';

// Grid Layout
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {posts.map(post => (
    <article key={post.id}>
      <BlogThumbnail
        post={post}
        size="medium"
        aspectRatio="16/9"
      />
      <h3>{post.title}</h3>
    </article>
  ))}
</div>

// List Layout
<div className="space-y-6">
  {posts.map(post => (
    <article key={post.id} className="flex gap-4">
      <BlogThumbnail
        post={post}
        size="small"
        aspectRatio="1/1"
        className="w-24"
      />
      <div>
        <h3>{post.title}</h3>
      </div>
    </article>
  ))}
</div>
```

**See USAGE_EXAMPLES.tsx** for:
- Example 2: Grid layout
- Example 3: List layout
- Example 4: Carousel
- Example 6: Sidebar

---

## For Worker 3: Article Template (Detail Page)

Use `BlogFeaturedImage` for hero and `BlogContentImage` for article content:

```typescript
import {
  BlogFeaturedImage,
  BlogContentImage,
  FeaturedImageSkeleton
} from '@/components/blog';

// Hero Image (above the fold)
<BlogFeaturedImage
  post={post}
  priority={true}  // Important for LCP!
  className="rounded-lg mb-8"
/>

// Loading State
<Suspense fallback={<FeaturedImageSkeleton />}>
  <BlogFeaturedImage post={post} priority={true} />
</Suspense>

// WordPress Content (auto-handles images in HTML)
<div dangerouslySetInnerHTML={{ __html: post.content }} />

// OR: Custom Images with Captions
<BlogContentImage
  src="https://wp.saabuildingblocks.com/wp-content/uploads/2024/01/image.jpg"
  alt="Description"
  width={1200}
  height={800}
  caption="Image caption text"
  enableLightbox={true}  // Click to expand
/>
```

**See USAGE_EXAMPLES.tsx** for:
- Example 1: Full blog post layout
- Example 5: Loading states
- Example 8: Custom content with multiple images

---

## Quick Reference Table

| Need | Component | Size | Aspect Ratio | Priority | Lazy |
|------|-----------|------|--------------|----------|------|
| Hero image | `BlogFeaturedImage` | 1200px | 16:9 | Yes | No |
| Card image | `BlogThumbnail` | 400px | 16:9 | No | Yes |
| List image | `BlogThumbnail` | 300px | 1:1 | No | Yes |
| Article image | `BlogContentImage` | 900px | Custom | No | Yes |
| Sidebar image | `BlogThumbnail` | 300px | 1:1 | No | Yes |

---

## Common Props

### BlogFeaturedImage
```typescript
{
  post: BlogPost;        // Required
  priority?: boolean;    // Default: false
  className?: string;    // Optional
}
```

### BlogThumbnail
```typescript
{
  post: BlogPost;                      // Required
  size?: 'small' | 'medium' | 'large'; // Default: 'medium'
  aspectRatio?: '16/9' | '4/3' | '1/1'; // Default: '16/9'
  className?: string;                  // Optional
}
```

### BlogContentImage
```typescript
{
  src: string;              // Required
  alt: string;              // Required
  width?: number;           // Optional (for aspect ratio)
  height?: number;          // Optional (for aspect ratio)
  caption?: string;         // Optional
  enableLightbox?: boolean; // Default: false
  className?: string;       // Optional
}
```

---

## Size Presets

```typescript
import { SIZE_CONFIG } from '@/components/blog';

SIZE_CONFIG.small:  300px @ 75% quality
SIZE_CONFIG.medium: 400px @ 80% quality
SIZE_CONFIG.large:  600px @ 85% quality
```

---

## Aspect Ratios

- **16:9** - Widescreen (default for most use cases)
- **4:3** - Traditional (good for photography)
- **1:1** - Square (perfect for sidebars, avatars)

---

## Import Statement

```typescript
// Import all at once
import {
  BlogFeaturedImage,
  BlogContentImage,
  BlogThumbnail,
  FeaturedImageSkeleton,
  SIZE_CONFIG
} from '@/components/blog';

// Or import individually
import BlogFeaturedImage from '@/components/blog/BlogFeaturedImage';
import BlogContentImage from '@/components/blog/BlogContentImage';
import BlogThumbnail from '@/components/blog/BlogThumbnail';
```

---

## WordPress Data Structure

All components expect this structure (already provided by `lib/wordpress/api.ts`):

```typescript
interface BlogPost {
  id: number;
  title: string;
  featuredImage?: {
    url: string;      // Full WordPress URL
    alt: string;      // Alt text from WordPress
    width: number;    // Original width
    height: number;   // Original height
  };
  // ... other fields
}
```

**If `featuredImage` is undefined**, components will show gradient fallbacks.

---

## Loading States

### With Skeleton (Recommended)
```typescript
import { Suspense } from 'react';
import { BlogFeaturedImage, FeaturedImageSkeleton } from '@/components/blog';

<Suspense fallback={<FeaturedImageSkeleton />}>
  <BlogFeaturedImage post={post} priority={true} />
</Suspense>
```

### Manual Loading State
```typescript
{isLoading ? (
  <FeaturedImageSkeleton />
) : (
  <BlogFeaturedImage post={post} />
)}
```

---

## Performance Tips

### 1. Use Priority for Above-the-Fold
```typescript
// First image on page (hero)
<BlogFeaturedImage post={post} priority={true} />

// All other images (lazy)
<BlogThumbnail post={post} />
```

### 2. Choose Right Size
```typescript
// Sidebar (small)
<BlogThumbnail post={post} size="small" />

// Grid cards (medium)
<BlogThumbnail post={post} size="medium" />

// Featured carousel (large)
<BlogThumbnail post={post} size="large" />
```

### 3. Enable Lightbox Sparingly
```typescript
// Only for important images
<BlogContentImage
  src={imageUrl}
  alt="Important diagram"
  enableLightbox={true}  // User can expand
/>
```

---

## Accessibility Checklist

When using these components:

- ✅ Alt text is automatically pulled from WordPress
- ✅ Semantic HTML is built-in
- ✅ Keyboard navigation works (ESC closes lightbox)
- ✅ ARIA labels are included
- ✅ Focus management is handled

**No additional work needed for accessibility!**

---

## Testing Checklist

After integration:

- [ ] Images load correctly on detail pages
- [ ] Thumbnails display in listing pages
- [ ] Fallbacks show when featuredImage is missing
- [ ] Lightbox opens/closes (if enabled)
- [ ] Loading skeleton displays
- [ ] Responsive sizing works (test on mobile)
- [ ] Hover effects work (scale, transitions)
- [ ] Keyboard navigation works (ESC key)

---

## Troubleshooting

### Images not loading
1. Check `next.config.ts` includes WordPress domain
2. Verify `featuredImage.url` is HTTPS
3. Check browser console for CORS errors

### TypeScript errors
1. Ensure `@/lib/wordpress/types` is imported
2. Check `BlogPost` interface includes `featuredImage`
3. Run `npm run typecheck`

### Layout shift
1. Ensure aspect ratio is set on thumbnails
2. Use container with defined width
3. Don't override height without width

---

## Examples Location

See full examples in:
```
/home/claude-flow/nextjs-frontend/components/blog/USAGE_EXAMPLES.tsx
```

10 complete examples:
1. Blog post detail page
2. Blog listing grid
3. Blog listing list
4. Featured carousel
5. Loading states
6. Sidebar recent posts
7. Category page
8. Custom content
9. Masonry grid
10. Size configuration

---

## Need Help?

**Documentation:**
- README.md - Component API reference
- USAGE_EXAMPLES.tsx - Real-world examples
- COMPONENT-RELATIONSHIPS.md - Visual diagrams
- WORKER-4-COMPLETION-REPORT.md - Technical details

**Questions?**
Contact Worker 4 or check the comprehensive README.

---

Happy coding! 🎨🖼️
