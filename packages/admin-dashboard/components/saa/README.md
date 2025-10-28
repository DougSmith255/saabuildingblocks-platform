# SAA React Components

React/TypeScript components converted from HTML SAA Building Blocks.

## Components

### Navigation Components

#### Scrollport
**Location:** `/components/saa/navigation/Scrollport.tsx`

A scroll-based navigation indicator with arrow controls and smooth animations.

**Features:**
- ✅ Scroll-synced active state using IntersectionObserver
- ✅ Keyboard navigation (arrow keys)
- ✅ Auto-advance carousel mode
- ✅ Smooth scroll animations
- ✅ Accessible with ARIA labels
- ✅ Responsive design
- ✅ Optional section scrolling

**Usage:**
```tsx
import { Scrollport } from '@/components/saa/navigation';

<Scrollport
  items={[
    {
      id: '1',
      title: 'Revenue Sharing',
      description: 'Build passive income streams',
      sectionId: 'revenue-section'
    },
    {
      id: '2',
      title: 'Team Building',
      description: 'Scale your business',
      sectionId: 'team-section'
    },
    {
      id: '3',
      title: 'Training',
      description: 'World-class resources',
      sectionId: 'training-section'
    }
  ]}
  showArrows
  enableScrollToSection
  onActiveChange={(index, item) => console.log('Active:', item)}
/>
```

**Props:**
- `items: ScrollportItem[]` - Navigation items to display
- `initialActiveIndex?: number` - Initially active item index (default: 0)
- `onActiveChange?: (index, item) => void` - Callback when active item changes
- `enableScrollToSection?: boolean` - Enable smooth scroll to sections (default: true)
- `showArrows?: boolean` - Show navigation arrows (default: true)
- `fullWidth?: boolean` - Full width variant (default: false)
- `autoAdvanceInterval?: number` - Auto-advance interval in ms (0 to disable)
- `enableKeyboardNav?: boolean` - Enable keyboard navigation (default: true)

**Scroll Behavior:**
The component automatically detects when sections come into view using IntersectionObserver and updates the active state. It uses a threshold of 50% and rootMargin to trigger when sections are centered.

**Performance Optimizations:**
- Uses passive event listeners for scroll
- Implements smooth scroll with native CSS
- Cleans up observers on unmount
- Debounces scroll events

---

### Gallery Components

#### ScrollGallery
**Location:** `/components/saa/gallery/ScrollGallery.tsx`

A horizontal scrolling gallery with smooth animations and optional parallax effect.

**Features:**
- ✅ Smooth horizontal scrolling
- ✅ Touch-friendly on mobile
- ✅ Arrow navigation controls
- ✅ Scroll indicators/pagination
- ✅ Auto-scroll carousel mode
- ✅ Scroll-synced parallax movement
- ✅ Glass morphism design
- ✅ Accessible with ARIA roles
- ✅ Responsive (hides arrows on mobile)

**Usage:**
```tsx
import { ScrollGallery } from '@/components/saa/gallery';

<ScrollGallery
  items={[
    {
      id: '1',
      title: 'Premium Services',
      description: 'Comprehensive real estate solutions with personalized attention',
      link: '/services'
    },
    {
      id: '2',
      title: 'Market Analysis',
      description: 'In-depth market research and competitive pricing strategies'
    },
    {
      id: '3',
      title: 'Lead Generation',
      description: 'Advanced marketing systems to attract qualified buyers'
    },
    {
      id: '4',
      title: 'Team Support',
      description: 'Dedicated team members to support your success'
    }
  ]}
  showArrows
  showIndicators
  enableParallax
  autoScrollInterval={5000}
  onItemClick={(item, index) => console.log('Clicked:', item)}
/>
```

**Props:**
- `items: GalleryItem[]` - Gallery items to display
- `showArrows?: boolean` - Show navigation arrows (default: true)
- `showIndicators?: boolean` - Show scroll indicators (default: true)
- `autoScrollInterval?: number` - Auto-scroll interval in ms (0 to disable)
- `scrollAmount?: number` - Number of items to scroll at once (default: 1)
- `enableParallax?: boolean` - Enable scroll-synced parallax movement (default: false)
- `itemWidth?: number` - Item width in pixels (default: 300)
- `gap?: number` - Gap between items in rem (default: 1.5)
- `onItemClick?: (item, index) => void` - Callback when item is clicked

**Parallax Effect:**
When `enableParallax` is enabled, the gallery moves vertically based on page scroll position, creating a dynamic parallax effect. Maximum movement is 20px.

**Auto-Scroll Behavior:**
Auto-scroll pauses on hover and resumes on mouse leave. When reaching the end, it wraps back to the beginning.

**Performance Optimizations:**
- Uses passive event listeners for scroll
- Implements backface-visibility for GPU acceleration
- Respects prefers-reduced-motion for accessibility
- Smooth scroll with native CSS
- Efficient scroll position tracking

---

## CSS Integration

Both components use the original CSS files:
- `/public/saa-components/navigation/scrollport.css`
- `/public/saa-components/gallery/scroll-gallery.css`

**Import in your global CSS:**
```css
@import '../public/saa-components/navigation/scrollport.css';
@import '../public/saa-components/gallery/scroll-gallery.css';
```

Or import in your Next.js layout:
```tsx
import '@/public/saa-components/navigation/scrollport.css';
import '@/public/saa-components/gallery/scroll-gallery.css';
```

---

## TypeScript Types

### ScrollportItem
```typescript
interface ScrollportItem {
  id: string;
  title: string;
  description: string;
  sectionId?: string;  // For scroll-to-section feature
}
```

### GalleryItem
```typescript
interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;   // Future support for images
  link?: string;       // Optional navigation link
}
```

---

## Accessibility Features

Both components follow WCAG 2.1 guidelines:

**Keyboard Navigation:**
- Scrollport: Arrow keys to navigate between items
- ScrollGallery: Tab to focus items, Enter/Space to activate

**Screen Readers:**
- Proper ARIA labels and roles
- Live region updates for active state
- Hidden visual-only elements
- Descriptive button labels

**Motion Sensitivity:**
- Respects `prefers-reduced-motion`
- Disables animations when requested
- Smooth scroll can be disabled

**High Contrast Mode:**
- Increased border visibility
- Enhanced focus indicators
- Stronger color contrasts

---

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (with webkit prefixes)
- Mobile browsers: ✅ Touch-optimized

**Required APIs:**
- IntersectionObserver (for Scrollport section tracking)
- Smooth scroll behavior
- CSS backdrop-filter (for glass morphism)

---

## Performance Considerations

**Optimizations Applied:**
1. Passive event listeners for scroll events
2. RequestAnimationFrame for smooth animations
3. GPU acceleration with transforms
4. Efficient DOM queries with refs
5. Cleanup of event listeners and timers
6. Memoized callback functions

**Best Practices:**
- Keep item count reasonable (<20 items)
- Optimize images if using imageUrl
- Use lazy loading for images
- Minimize re-renders with React.memo if needed

---

## Migration from HTML

**Original HTML locations:**
- `/public/saa-components/navigation/scrollport.html`
- `/public/saa-components/gallery/scroll-gallery.html`

**Changes:**
1. ✅ Converted to TypeScript React components
2. ✅ Added proper TypeScript interfaces
3. ✅ Implemented React hooks for state management
4. ✅ Enhanced with IntersectionObserver for scroll tracking
5. ✅ Added keyboard navigation support
6. ✅ Improved accessibility with ARIA
7. ✅ Added auto-advance carousel mode
8. ✅ Preserved all original CSS animations
9. ✅ Added parallax effect option
10. ✅ Made touch-friendly for mobile

**Preserved Features:**
- ✅ All scroll interactions and animations
- ✅ Navigation indicators
- ✅ Gallery item transitions
- ✅ Smooth scrolling behavior
- ✅ Glass morphism styling
- ✅ Responsive design
- ✅ Arrow navigation

---

## Examples

### Example 1: Simple Scrollport
```tsx
import { Scrollport } from '@/components/saa';

export function MyPage() {
  return (
    <Scrollport
      items={[
        { id: '1', title: 'Section 1', description: 'First section' },
        { id: '2', title: 'Section 2', description: 'Second section' },
        { id: '3', title: 'Section 3', description: 'Third section' }
      ]}
    />
  );
}
```

### Example 2: Auto-Scrolling Gallery
```tsx
import { ScrollGallery } from '@/components/saa';

export function FeaturesGallery() {
  return (
    <ScrollGallery
      items={features}
      autoScrollInterval={5000}
      enableParallax
      onItemClick={(item) => router.push(item.link)}
    />
  );
}
```

### Example 3: Section Navigation
```tsx
import { Scrollport } from '@/components/saa';

export function PageWithSections() {
  return (
    <>
      <Scrollport
        items={[
          { id: '1', title: 'Intro', description: 'Introduction', sectionId: 'intro' },
          { id: '2', title: 'Features', description: 'Our features', sectionId: 'features' },
          { id: '3', title: 'Pricing', description: 'Plans', sectionId: 'pricing' }
        ]}
        enableScrollToSection
      />

      <section id="intro">...</section>
      <section id="features">...</section>
      <section id="pricing">...</section>
    </>
  );
}
```

---

## Testing

**Manual Testing Checklist:**
- [ ] Scrollport indicators update on section scroll
- [ ] Arrow buttons navigate correctly
- [ ] Keyboard navigation works (arrow keys)
- [ ] Gallery scrolls smoothly
- [ ] Touch gestures work on mobile
- [ ] Auto-scroll pauses on hover
- [ ] Parallax effect animates smoothly
- [ ] Screen reader announces active item
- [ ] Focus indicators are visible
- [ ] Respects prefers-reduced-motion

**Unit Testing (Jest/React Testing Library):**
```tsx
import { render, fireEvent } from '@testing-library/react';
import { Scrollport } from './Scrollport';

test('navigates to next item on arrow click', () => {
  const { getByLabelText } = render(
    <Scrollport items={mockItems} />
  );

  const nextButton = getByLabelText('Next item');
  fireEvent.click(nextButton);

  expect(/* active index changed */).toBeTruthy();
});
```

---

## Future Enhancements

**Potential Features:**
- [ ] Image support for gallery items
- [ ] Video embed support
- [ ] Lazy loading for items
- [ ] Virtualization for large lists
- [ ] Swipe gestures on mobile
- [ ] Thumbnail preview mode
- [ ] Lightbox integration
- [ ] Analytics tracking
- [ ] A/B testing support

---

## Support

**Documentation:**
- Original HTML: `/public/saa-components/`
- Component source: `/components/saa/`
- CSS files: `/public/saa-components/*/*.css`

**Issues:**
Report component issues to the development team.

**Contributing:**
Follow the coding standards in `/docs/CODING-STANDARDS.md`.
