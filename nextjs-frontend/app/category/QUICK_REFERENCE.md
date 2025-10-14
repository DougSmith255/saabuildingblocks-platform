# Category Template System - Quick Reference

**1-Minute Guide for Developers**

---

## Import Everything You Need

```typescript
// Components
import { CategoryTemplate } from '@/app/category/components';

// Types
import type { CategoryConfig, WordPressPost } from '@/app/category/types';

// Config utilities
import { getCategoryConfig, getAllCategorySlugs } from '@/app/category/configs/category-configs';

// API utilities
import { fetchPostsByCategory } from '@/app/category/lib/wordpress-api';
```

---

## Get Category Data

```typescript
// Get single category config
const config = getCategoryConfig('agent-career-info');

// Get all slugs (for generateStaticParams)
const slugs = getAllCategorySlugs();

// Fetch WordPress posts
const posts = await fetchPostsByCategory(1641, {
  per_page: 200,
  _embed: true
});
```

---

## Use the Component

```typescript
<CategoryTemplate
  config={config}
  initialPosts={posts}
/>
```

That's it! The component handles:
- Master Controller integration (typography, colors, spacing)
- WordPress API refresh (React Query)
- Animations (Framer Motion)
- Loading/error/empty states
- Responsive layout

---

## Master Controller Settings Applied

| Setting | Component | Element |
|---------|-----------|---------|
| `typography.h1.size` | CategoryHero | Title |
| `typography.h3.size` | BlogCard | Card title |
| `typography.body.size` | BlogCard | Excerpt |
| `colors.headingText` | All | All headings |
| `colors.bodyText` | All | All body text |
| `colors.accentGreen` | BlogCard | "Read More" + glow |
| `spacing.sectionPadding` | Hero + Grid | Vertical padding |
| `spacing.cardGap` | Grid | Card spacing |

---

## 12 Categories

```typescript
'agent-career-info'           // ID: 1641
'become-a-real-estate-agent'  // ID: 1643
'brokerage-comparison'        // ID: 1644
'best-real-estate-brokerage'  // ID: 1645
'industry-trends'             // ID: 1646
'marketing-mastery'           // ID: 1647
'winning-clients'             // ID: 1648
'fun-for-agents'              // ID: 1649
'exp-realty-sponsor'          // ID: 1650
'about-exp-realty'            // ID: 1651
'case-studies'                // ID: 1652
'resources'                   // ID: 1653
```

---

## File Locations

```
app/category/
├── [slug]/page.tsx              ← Use this for routing
├── components/CategoryTemplate  ← Use this in your pages
├── configs/category-configs     ← Edit this to add categories
├── lib/wordpress-api            ← API utilities
└── types/index                  ← TypeScript types
```

---

## Common Tasks

### Add New Category

1. Edit `configs/category-configs.ts`
2. Add new object to `CATEGORY_CONFIGS`
3. Include WordPress ID, slug, title, tagline, background, SEO
4. Run `npm run build`

### Update Background Image

1. Upload image to Cloudflare R2
2. Edit category config `background.image` URL
3. Run `npm run build`

### Change Typography

1. Go to Master Controller (https://saabuildingblocks.com/master-controller)
2. Typography tab → adjust settings → save
3. Visit category page → changes apply instantly (no rebuild)

### Change Colors

1. Go to Master Controller
2. Brand Colors tab → adjust colors → save
3. Visit category page → changes apply instantly (no rebuild)

---

## URLs

```
/category/[slug]

Examples:
/category/agent-career-info
/category/marketing-mastery
/category/resources
```

---

## Troubleshooting

**TypeScript errors?**
```bash
npm run typecheck
```

**Build errors?**
```bash
npm run build
```

**API not working?**
Check `.env.local`:
```
NEXT_PUBLIC_WORDPRESS_API_URL=https://saabuildingblocks.com/wp-json/wp/v2
```

**Master Controller not updating?**
Check browser localStorage in DevTools

---

## Documentation

- **Full Architecture:** `/docs/PHASE7.3_COMPONENT_ARCHITECTURE.md`
- **Implementation:** `/docs/PHASE7.4_IMPLEMENTATION_COMPLETE.md`
- **Executive Summary:** `/docs/PHASE7.4_EXECUTIVE_SUMMARY.md`
- **Developer Guide:** `/app/category/README.md`

---

**Phase 7.4:** ✅ COMPLETE
