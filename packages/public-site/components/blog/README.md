# Blog Components

This directory contains all blog-related React components for the SAA Building Blocks blog system.

## Components

### BlogCard

**Purpose**: Displays a blog post card with featured image, title, excerpt, metadata, and categories.

**Import**:
```tsx
import { BlogCard } from '@/components/blog';
import type { BlogCardProps } from '@/components/blog';
```

**Usage**:
```tsx
import { BlogCard } from '@/components/blog';
import type { BlogPost } from '@/lib/wordpress/types';

const posts: BlogPost[] = await fetchAllPosts();

<div className="grid gap-8">
  {posts.map((post) => (
    <BlogCard key={post.id} post={post} />
  ))}
</div>
```

**Props**:
- `post: BlogPost` - Blog post data from WordPress API
- `className?: string` - Optional additional classes

**Features**:
- ✅ Featured image with hover scale effect
- ✅ H2 title (auto-applies display font from Master Controller)
- ✅ Excerpt with 3-line clamp
- ✅ Author name and avatar
- ✅ Publication date with semantic `<time>` element
- ✅ Category badges with gold accent
- ✅ Estimated read time calculation
- ✅ Hover effects (border glow, text color change)
- ✅ Fully accessible with ARIA labels
- ✅ Responsive with fluid typography

**Typography Standards**:
- **Title**: H2 with display font (Taskor) - auto-applied
- **Excerpt**: Amulya body font via CSS variable
- **Metadata**: Amulya font, smaller size
- **Categories**: Taskor display font

**Color Palette**:
- **Heading**: `#e5e4dd` (hover: `#00ff88`)
- **Body text**: `#dcdbd5`
- **Metadata**: `#dcdbd5` at 70% opacity
- **Accent (categories)**: `#ffd700` (gold)
- **Border**: `#e5e4dd` at 20% (hover: `#00ff88` at 50%)

**Accessibility**:
- Semantic HTML (`<article>`, `<h2>`, `<time>`)
- ARIA label on link with full article title
- Alt text on images
- WCAG AA compliant color contrast
- Keyboard navigable

**Responsive Design**:
- Fluid typography using `clamp()`
- Responsive image with Next.js Image component
- Mobile-friendly spacing and touch targets

## Protocol Adherence

This component follows the **AI Agent Page Building Protocol** (`/docs/AI-AGENT-PAGE-BUILDING-PROTOCOL.md`):

✅ Typography integration (CSS variables, display font, Amulya body)
✅ Brand color palette only (no arbitrary colors)
✅ Fluid typography (clamp() for all sizes)
✅ Semantic HTML and ARIA labels
✅ Master Controller compatibility
✅ Component single-source-of-truth pattern

## Testing

**Manual Test**:
1. Navigate to `/blog` page
2. Verify cards display correctly
3. Hover over cards (border glow, title color change, image scale)
4. Click card to navigate to full post
5. Resize browser (300px → 2000px) to test fluid typography
6. Open Master Controller and switch typography presets
7. Verify typography updates

**TypeScript**:
```bash
npm run typecheck
```

**Linting**:
```bash
npm run lint
```

## Future Enhancements

Potential additions:
- [ ] Loading skeleton state
- [ ] Favorite/bookmark functionality
- [ ] Share buttons
- [ ] Reading progress indicator
- [ ] Tag filtering
- [ ] Search highlighting
