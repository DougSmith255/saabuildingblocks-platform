# WordPress Component Styles

This directory contains all CSS and JavaScript files copied from the WordPress theme design system.

## Directory Structure

```
wordpress/
├── animations/       # Animation effects
├── buttons/          # Button styles
├── cards/            # Card component styles
├── gallery/          # Gallery components
├── icons/            # Icon libraries
├── navigation/       # Navigation components
├── special/          # Special components (accordion, etc.)
├── team/             # Team carousel
├── text/             # Text effects
└── style.css         # Main WordPress stylesheet with CSS variables
```

## Components Included

### Cards (5 CSS + 1 JS)
- `cyber-card-holographic.css` - Holographic card effect
- `cyber-card-neural-network.css` - Neural network visual card
- `cyber-card-prismatic-glass.css` - Prismatic glass effect
- `cyber-card-radar-interface.css` - Radar interface card
- `strategic-trust-builder.css` - Strategic trust builder card
- `stacked-animation-cards.js` - Stacked animation JavaScript

### Buttons (2 CSS)
- `cta-button.css` - Primary CTA button styles
- `secondary-button.css` - Secondary button styles

### Icons (2 CSS)
- `icon-library.css` - Icon library styles
- `icon-library-sprite.css` - Icon sprite styles

### Animations (1 CSS)
- `stacked-animation.css` - Stacked animation effects

### Text (1 CSS + 1 JS)
- `text-scramble.css` - Text scramble effect styles
- `text-scramble.js` - Text scramble JavaScript

### Team (1 CSS + 1 JS)
- `team-carousel.css` - Team carousel styles
- `team-carousel.js` - Team carousel JavaScript

### Gallery (1 CSS)
- `scroll-gallery.css` - Scroll gallery styles

### Special (1 CSS + 1 JS)
- `accordion.css` - Accordion component styles
- `accordion.js` - Accordion JavaScript

### Navigation (1 CSS + 1 JS)
- `scrollport.css` - Scrollport navigation styles
- `scrollport.js` - Scrollport JavaScript

## CSS Variables Used

The components rely on the following CSS custom properties (defined in `style.css`):

### Colors
- `--color-bg-primary` - Primary background color
- `--color-bg-surface` - Surface background color
- `--color-border-primary` - Primary border color
- `--color-brand-primary` - Primary brand color
- `--color-brand-secondary` - Secondary brand color
- `--color-text-primary` - Primary text color
- `--color-text-secondary` - Secondary text color
- `--gold-primary` - Primary gold color (#FFD700)

### Typography
- `--font-heading` - Heading font family ('Amulya')
- `--font-body` - Body font family ('Synonym')
- `--font-size-sm` - Small font size (0.875rem)
- `--font-size-base` - Base font size (1rem)
- `--font-size-lg` - Large font size (1.125rem)
- `--font-size-xl` - Extra large font size (1.25rem)
- `--font-weight-bold` - Bold font weight (700)
- `--letter-spacing-wide` - Wide letter spacing
- `--line-height-normal` - Normal line height (1.5)
- `--line-height-relaxed` - Relaxed line height (1.6)

### Spacing
- `--space-1` to `--space-20` - Spacing scale
- `--saa-card-padding` - Card padding
- `--saa-card-margin` - Card margin
- `--saa-card-top-offset` - Card top offset

### Border Radius
- `--radius-md` - Medium border radius
- `--radius-lg` - Large border radius (12px)

### Icons
- `--icon-size-small` - Small icon size
- `--icon-size-medium` - Medium icon size
- `--icon-size-large` - Large icon size
- `--icon-size-xl` - Extra large icon size

## Integration with Next.js

To use these styles in Next.js:

1. Import the main stylesheet in your layout:
   ```tsx
   import '@/app/styles/wordpress/style.css';
   ```

2. Import specific component styles as needed:
   ```tsx
   import '@/app/styles/wordpress/cards/cyber-card-holographic.css';
   import '@/app/styles/wordpress/text/text-scramble.css';
   ```

3. For JavaScript functionality, convert to React components or use client-side scripts:
   ```tsx
   'use client';
   import { useEffect } from 'react';

   // Import and initialize WordPress JavaScript
   ```

## File Sizes

- Total CSS files: 14
- Total JS files: 6
- Main stylesheet: style.css (includes all CSS variables and global styles)

## Dependencies

All components depend on:
- CSS custom properties defined in `style.css`
- Font families: 'Amulya' (headings), 'Synonym' (body)
- Modern CSS features (Grid, Flexbox, Custom Properties, Animations)

## Browser Compatibility

Components include Firefox-specific fixes and fallbacks for:
- Backdrop blur effects
- Transform animations
- Visibility and opacity
- Hardware acceleration

## Notes

- All animations use `transform` and `opacity` for performance
- Components include accessibility considerations
- Responsive breakpoints are handled via CSS custom properties
- Dark mode support through CSS variables
