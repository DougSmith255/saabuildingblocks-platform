# Blog Image Components - Relationship Diagram

```
WordPress REST API
   ↓
   ↓ (fetches featured images)
   ↓
lib/wordpress/api.ts
   ↓
   ↓ (returns BlogPost with featuredImage)
   ↓
   ├─────────────────────────────────────────────────────┐
   ↓                                                      ↓
BlogFeaturedImage                                  BlogThumbnail
   ↓                                                      ↓
   ├─ Next.js Image (16:9)                              ├─ Next.js Image (16:9, 4:3, 1/1)
   ├─ Priority loading option                           ├─ Three size presets
   ├─ Blur placeholder                                  ├─ Lazy loading
   ├─ FeaturedImageSkeleton                            ├─ Hover scale effect
   └─ Gradient fallback                                 └─ Gradient fallback
   ↓                                                      ↓
   ↓ (used in)                                          ↓ (used in)
   ↓                                                      ↓
Blog Post Detail Page                            Blog Listing Pages
   - Hero image                                         - Grid layouts
   - Large, above fold                                  - List layouts
   - High priority                                      - Sidebars
                                                        - Carousels


BlogContentImage (standalone)
   ↓
   ├─ Next.js Image (custom size)
   ├─ Caption support
   ├─ Lightbox functionality
   ├─ Error handling
   └─ Lazy loading
   ↓
   ↓ (used in)
   ↓
Blog Post Content
   - Article body
   - Custom images
   - Captioned images
```

---

## Use Case Matrix

| Component | Detail Page | Listing Page | Sidebar | Content | Loading |
|-----------|-------------|--------------|---------|---------|---------|
| **BlogFeaturedImage** | ✅ Hero | ❌ No | ❌ No | ❌ No | ✅ Skeleton |
| **BlogThumbnail** | ❌ No | ✅ Cards | ✅ Recent | ❌ No | ❌ No |
| **BlogContentImage** | ✅ Article | ❌ No | ❌ No | ✅ Body | ❌ No |

---

## Size Comparison

```
┌─────────────────────────────────────────────────────────────┐
│ BlogFeaturedImage (Hero)                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                           │ │
│ │              1200px × 675px (16:9)                        │ │
│ │                                                           │ │
│ │         "The Future of Real Estate Technology"           │ │
│ │                                                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Priority: true | Sizes: (max-width: 640px) 100vw, 1200px   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ BlogThumbnail       │  │ BlogThumbnail       │  │ BlogThumbnail       │
│ (Medium)            │  │ (Medium)            │  │ (Medium)            │
│ ┌─────────────────┐ │  │ ┌─────────────────┐ │  │ ┌─────────────────┐ │
│ │                 │ │  │ │                 │ │  │ │                 │ │
│ │   400×225 (16:9)│ │  │ │   400×225 (16:9)│ │  │ │   400×225 (16:9)│ │
│ │                 │ │  │ │                 │ │  │ │                 │ │
│ └─────────────────┘ │  │ └─────────────────┘ │  │ └─────────────────┘ │
│ "Post Title Here"   │  │ "Another Post"      │  │ "Third Post"        │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
       Lazy: true              Lazy: true              Lazy: true

┌─────────────────────────────────────────────────────────────┐
│ BlogContentImage (In Article)                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                           │ │
│ │              900px × 600px (custom)                       │ │
│ │                                                           │ │
│ │              [Click to expand]                            │ │
│ │                                                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Caption: "Real estate market trends for 2024"              │
│ Lightbox: enabled | Lazy: true                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Aspect Ratio Options

```
16:9 (Default - Widescreen)
┌──────────────────────┐
│                      │
│                      │
└──────────────────────┘

4:3 (Traditional)
┌────────────────┐
│                │
│                │
│                │
└────────────────┘

1:1 (Square)
┌──────────┐
│          │
│          │
│          │
│          │
└──────────┘
```

---

## Fallback Behavior

```
WordPress API
   ↓
featuredImage: undefined
   ↓
   ├─ BlogFeaturedImage → Gradient + Geometric Pattern + Title Overlay
   └─ BlogThumbnail → Gradient (Indigo→Purple→Pink) + Icon

featuredImage: { url: "invalid-url" }
   ↓
Image Load Error
   ↓
BlogContentImage → Error Icon + "Image failed to load" message
```

---

## Loading States

```
INITIAL LOAD (BlogFeaturedImage):
┌─────────────────────────────────────┐
│ FeaturedImageSkeleton               │
│ ┌─────────────────────────────────┐ │
│ │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│ │  ░░░░░░░ Loading ░░░░░░░░░░░░░░ │ │
│ │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│ └─────────────────────────────────┘ │
│ Pulsing animation                   │
└─────────────────────────────────────┘
   ↓
BLUR PLACEHOLDER:
┌─────────────────────────────────────┐
│ Blurred SVG Placeholder             │
│ ┌─────────────────────────────────┐ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ │
│ │ ▓▓▓▓▓▓▓ Fading in ▓▓▓▓▓▓▓▓▓▓▓ │ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ │
│ └─────────────────────────────────┘ │
│ Smooth transition                   │
└─────────────────────────────────────┘
   ↓
FULL IMAGE:
┌─────────────────────────────────────┐
│ High Resolution Image               │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │    Fully Loaded Image           │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ Ready for interaction               │
└─────────────────────────────────────┘
```

---

## Responsive Behavior

```
Mobile (< 640px):
┌──────────────────┐
│ BlogFeaturedImage│
│ ┌──────────────┐ │
│ │              │ │
│ │   100vw      │ │
│ │              │ │
│ └──────────────┘ │
│ Full width       │
└──────────────────┘

Tablet (640px - 1024px):
┌────────────────────────────┐
│ BlogFeaturedImage          │
│ ┌────────────────────────┐ │
│ │                        │ │
│ │        90vw            │ │
│ │                        │ │
│ └────────────────────────┘ │
│ Margins on sides           │
└────────────────────────────┘

Desktop (> 1024px):
┌────────────────────────────────────────┐
│ BlogFeaturedImage                      │
│ ┌────────────────────────────────────┐ │
│ │                                    │ │
│ │          1200px max                │ │
│ │                                    │ │
│ └────────────────────────────────────┘ │
│ Centered with max-width                │
└────────────────────────────────────────┘
```

---

## Lightbox Flow (BlogContentImage)

```
CLOSED STATE:
┌─────────────────────────────────┐
│ BlogContentImage                │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │   Click to expand →         │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│ Caption: "Image caption here"   │
└─────────────────────────────────┘
   ↓ (click)
   ↓
OPEN STATE (Lightbox):
┌─────────────────────────────────────────────────────────────┐
│ Full Screen Overlay (black/90)                        × Close│
│                                                               │
│     ┌─────────────────────────────────────────────┐         │
│     │                                             │         │
│     │                                             │         │
│     │        High Resolution Image                │         │
│     │        (Object-contain, centered)           │         │
│     │                                             │         │
│     │                                             │         │
│     └─────────────────────────────────────────────┘         │
│                                                               │
│ Click anywhere or press ESC to close                         │
└─────────────────────────────────────────────────────────────┘
   ↓ (click or ESC)
   ↓
CLOSED STATE (back to normal)
```

---

## Performance Timeline

```
Time:  0ms                  500ms              1000ms             2000ms
       │                    │                  │                  │
       ├─ Skeleton visible  │                  │                  │
       │                    │                  │                  │
       ├─ Blur placeholder  ├─ Image loading   │                  │
       │    appears          │                  │                  │
       │                    │                  ├─ Image rendered  │
       │                    │                  │   (fade in)      │
       │                    │                  │                  ├─ Fully loaded
       │                    │                  │                  │   (interactive)
       └────────────────────┴──────────────────┴──────────────────┘

LCP (Largest Contentful Paint):
- Without priority: ~2500ms
- With priority:    ~1200ms ✅

CLS (Cumulative Layout Shift):
- With aspect ratio: 0.000 ✅
- Without:          0.250 ❌
```

---

## Integration Flow

```
1. WordPress Content Entry
   ↓
2. Upload featured image in WordPress
   ↓
3. Publish post
   ↓
4. WordPress REST API (_embedded)
   ↓
5. Next.js fetchAllPosts()
   ↓
6. Transform to BlogPost type
   ↓
7. Pass to components:
   ├─ BlogFeaturedImage (detail page)
   ├─ BlogThumbnail (listing pages)
   └─ BlogContentImage (article content)
   ↓
8. Next.js Image optimizes
   ↓
9. Render with fallbacks
   ↓
10. User sees optimized images ✅
```

---

## Quick Reference

| Need | Component | Size | Lazy | Priority |
|------|-----------|------|------|----------|
| Hero image | `BlogFeaturedImage` | 1200px | No | Yes |
| Card image | `BlogThumbnail` | 400px | Yes | No |
| Article image | `BlogContentImage` | 900px | Yes | No |
| Sidebar image | `BlogThumbnail` | 300px | Yes | No |
| Gallery image | `BlogContentImage` | Custom | Yes | No |
