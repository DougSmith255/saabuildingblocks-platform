# Blog Image Components - Quick Reference Card

---

## Import

```typescript
import {
  BlogFeaturedImage,
  BlogContentImage,
  BlogThumbnail,
  FeaturedImageSkeleton,
  SIZE_CONFIG
} from '@/components/blog';
```

---

## BlogFeaturedImage (Hero)

```typescript
<BlogFeaturedImage
  post={post}           // Required: BlogPost
  priority={true}       // Optional: default false
  className="rounded"   // Optional
/>
```

**Use for:** Hero images on detail pages
**Size:** 1200px max
**Aspect Ratio:** 16:9
**Loading:** Priority (LCP optimization)

---

## BlogThumbnail (Cards)

```typescript
<BlogThumbnail
  post={post}              // Required: BlogPost
  size="medium"            // small | medium | large
  aspectRatio="16/9"       // 16/9 | 4/3 | 1/1
  className="rounded"      // Optional
/>
```

**Use for:** Listing pages, sidebars, carousels
**Sizes:** 300px / 400px / 600px
**Loading:** Lazy

---

## BlogContentImage (Articles)

```typescript
<BlogContentImage
  src={imageUrl}           // Required: string
  alt="Description"        // Required: string
  width={1200}             // Optional: number
  height={800}             // Optional: number
  caption="Caption text"   // Optional: string
  enableLightbox={true}    // Optional: default false
  className="my-8"         // Optional
/>
```

**Use for:** Images within article content
**Size:** 900px max
**Loading:** Lazy
**Features:** Lightbox, captions

---

## Loading State

```typescript
<Suspense fallback={<FeaturedImageSkeleton />}>
  <BlogFeaturedImage post={post} priority={true} />
</Suspense>
```

---

## Size Presets

```typescript
SIZE_CONFIG.small   // 300px @ 75% quality
SIZE_CONFIG.medium  // 400px @ 80% quality
SIZE_CONFIG.large   // 600px @ 85% quality
```

---

## Common Patterns

### Detail Page Hero
```typescript
<BlogFeaturedImage post={post} priority={true} />
```

### Grid Card
```typescript
<BlogThumbnail post={post} size="medium" aspectRatio="16/9" />
```

### Sidebar Item
```typescript
<BlogThumbnail post={post} size="small" aspectRatio="1/1" />
```

### Article Image
```typescript
<BlogContentImage
  src={src}
  alt={alt}
  caption="Caption"
  enableLightbox={true}
/>
```

---

## File Paths

```
/home/claude-flow/nextjs-frontend/components/blog/
├── BlogFeaturedImage.tsx
├── BlogContentImage.tsx
├── BlogThumbnail.tsx
└── index.ts
```

---

## Documentation

- **README.md** - Full API reference
- **USAGE_EXAMPLES.tsx** - 10 examples
- **INTEGRATION-GUIDE.md** - Quick start
- **COMPONENT-RELATIONSHIPS.md** - Diagrams

---

## Performance Tips

✅ Use `priority={true}` for above-the-fold images
✅ Choose appropriate size preset for thumbnails
✅ Enable lightbox only when needed
✅ Let lazy loading work (default)

---

## Accessibility

✅ Alt text auto-pulled from WordPress
✅ Keyboard navigation (ESC closes lightbox)
✅ Semantic HTML (`<figure>`, `<figcaption>`)
✅ WCAG 2.1 AA compliant

---

**Worker 4** | WordPress Image Components | 2025-10-10
