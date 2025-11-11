# GlossyCategoryCard Component

An animated glossy category filter card with space futuristic aesthetic for the Agent Success Hub. Features a diagonal shimmer animation with randomized start points, glass morphism effects, and smooth hover interactions.

## Features

- **Animated Glossy Shimmer**: Diagonal gradient shimmer that moves across the card with randomized animation start points
- **Glass Morphism**: Semi-transparent background with backdrop blur effect
- **Smooth Hover Effects**: Scale transformation and enhanced glow on hover/focus
- **Space Futuristic Design**: Punchy, loud, but clean and smooth aesthetic
- **Fully Accessible**: Keyboard navigation, ARIA labels, and reduced motion support
- **Responsive**: Optimized for mobile, tablet, and desktop viewports
- **Type Safe**: Full TypeScript support with comprehensive prop types

## Installation

The component is already part of the SAA components library and can be imported directly:

```tsx
import { GlossyCategoryCard, PlaceholderIcon } from '@/packages/shared/components/saa/cards';
```

## Usage

### Basic Example

```tsx
<GlossyCategoryCard
  icon={<PlaceholderIcon />}
  title="Category Name"
  description="Brief description of what's in this category"
  count={25}
  onClick={() => handleFilter('category-id')}
/>
```

### With Custom Icon

```tsx
const CustomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="..." stroke="#00ff88" strokeWidth="2" />
  </svg>
);

<GlossyCategoryCard
  icon={<CustomIcon />}
  title="About eXp Realty"
  description="Learn about the cloud-based brokerage"
  count={58}
  onClick={() => handleFilter('about-exp')}
/>
```

### Grid Layout

```tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '24px',
}}>
  {categories.map((cat) => (
    <GlossyCategoryCard
      key={cat.id}
      icon={cat.icon}
      title={cat.title}
      description={cat.description}
      count={cat.count}
      onClick={() => handleCategoryClick(cat.id)}
    />
  ))}
</div>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `icon` | `React.ReactNode` | Yes | Icon element to display (use PlaceholderIcon or custom SVG) |
| `title` | `string` | Yes | Category title text |
| `description` | `string` | Yes | Category description text |
| `count` | `number` | Yes | Number of posts in the category |
| `onClick` | `() => void` | No | Optional click handler for card interaction |
| `className` | `string` | No | Optional additional CSS classes |

## Design System

### Colors

- **Background**: `rgba(25, 24, 24, 0.5)` - Semi-transparent dark
- **Border**: `rgba(128, 128, 128, 0.3-0.5)` - Gray with varying opacity
- **Neon Accent**: `#00ff88` - Green for hover states and interactive elements
- **Gold Accent**: `#ffd700` - For count badges and special highlights
- **Text Primary**: `#e5e4dd` - Main text color
- **Text Secondary**: `#dcdbd5` - Description text color

### Animation

- **Shimmer Duration**: 2.5 seconds
- **Shimmer Timing**: ease-in-out
- **Shimmer Delay**: Randomized between 0s and -3s (negative starts mid-cycle)
- **Hover Transition**: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- **Hover Scale**: 1.03

### Effects

- **Backdrop Blur**: 10px
- **Border Radius**: 16px
- **Glass Shadow**: Subtle with neon accent on hover
- **Text Shadow**: Glowing effect on hover

## Accessibility

- **Keyboard Navigation**: Full support with Enter and Space keys
- **Focus States**: Visible focus outline with neon green
- **ARIA Labels**: Descriptive labels for screen readers
- **Reduced Motion**: Respects user's motion preferences
- **Semantic HTML**: Proper role and tabIndex attributes

## Responsive Breakpoints

- **Desktop** (> 768px): Full size with 24px padding
- **Tablet** (≤ 768px): Slightly smaller with 20px padding
- **Mobile** (≤ 480px): Compact layout with 16px padding

## Technical Details

### Animation Implementation

Each card instance generates a random animation delay on mount using `useEffect`:

```tsx
useEffect(() => {
  const randomDelay = -(Math.random() * 3);
  setAnimationDelay(randomDelay);
}, []);
```

The delay is applied as a CSS custom property:

```tsx
style={{
  ['--shimmer-delay' as string]: `${animationDelay}s`,
}}
```

### Shimmer Effect

The shimmer uses a diagonal gradient with CSS animations:

```css
background: linear-gradient(
  110deg,
  transparent 0%,
  transparent 40%,
  rgba(255, 255, 255, 0.15) 50%,
  rgba(0, 255, 136, 0.2) 55%,
  transparent 60%,
  transparent 100%
);
background-size: 200% 100%;
animation: shimmer 2.5s ease-in-out infinite;
```

### Glass Morphism

Achieved using backdrop filter and layered backgrounds:

```css
background: rgba(25, 24, 24, 0.5);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with -webkit- prefixes)
- Mobile browsers: Full support

## Performance Considerations

- CSS animations are hardware-accelerated
- `will-change` is used sparingly to avoid performance issues
- `isolation: isolate` creates a new stacking context
- Backdrop filters are optimized with proper layering

## Examples

See `GlossyCategoryCard.example.tsx` for complete usage examples including:
- Basic usage
- Category grid layout
- Responsive layouts
- Custom styling

## File Locations

- Component: `/home/claude-flow/packages/shared/components/saa/cards/GlossyCategoryCard.tsx`
- Examples: `/home/claude-flow/packages/shared/components/saa/cards/GlossyCategoryCard.example.tsx`
- Export: `/home/claude-flow/packages/shared/components/saa/cards/index.ts`

## License

Part of the SAA Building Blocks component library.
