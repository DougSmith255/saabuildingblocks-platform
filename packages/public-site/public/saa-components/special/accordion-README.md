# Accordion Component

A fully accessible, responsive accordion component that follows SAA design system patterns.

## Features

- **Glass morphism styling** using existing `glass-card` system
- **Unicode arrow icons** from SAA arrow system (🢗/🢕)
- **Content-driven sizing** - no fixed dimensions
- **Full accessibility support** with ARIA attributes and keyboard navigation
- **Smooth animations** with GPU acceleration
- **Responsive design** with mobile-first approach
- **Multiple variants** (small, compact)
- **Configurable behavior** (single vs multiple open items)

## Files

- `accordion.css` - Component styles
- `accordion.js` - Interactive functionality
- `accordion.html` - Usage examples
- `accordion-README.md` - This documentation

## Basic Usage

### HTML Structure

```html
<div class="accordion" id="my-accordion">
    <div class="accordion-item">
        <button class="accordion-header">
            <h3 class="accordion-title">Your Question Here</h3>
            <span class="accordion-arrow" aria-hidden="true"></span>
        </button>
        <div class="accordion-content">
            <div class="accordion-content-inner">
                <p>Your answer content here...</p>
            </div>
        </div>
    </div>

    <!-- Add more accordion-item elements as needed -->
</div>
```

### Include Files

```html
<!-- CSS -->
<link rel="stylesheet" href="path/to/accordion.css">

<!-- JavaScript -->
<script src="path/to/accordion.js"></script>
```

## Variants

### Small Accordion
```html
<div class="accordion small">
    <!-- Smaller text and spacing -->
</div>
```

### Compact Accordion
```html
<div class="accordion compact">
    <!-- Reduced gap between items -->
</div>
```

### Allow Multiple Open Items
```html
<div class="accordion" data-allow-multiple>
    <!-- Users can open multiple items simultaneously -->
</div>
```

## JavaScript API

### Global Methods

```javascript
// Expand all items in an accordion
AccordionManager.expandAll('accordion-id');

// Collapse all items in an accordion
AccordionManager.collapseAll('accordion-id');

// Get accordion element by ID
const accordion = AccordionManager.get('accordion-id');
```

### Custom Events

```javascript
// Listen for accordion expansion
document.addEventListener('accordion:expanded', function(e) {
    console.log('Expanded:', e.detail.item);
});

// Listen for accordion collapse
document.addEventListener('accordion:collapsed', function(e) {
    console.log('Collapsed:', e.detail.item);
});
```

## Accessibility Features

- **ARIA attributes** for screen readers
- **Keyboard navigation** (Enter, Space, Arrow keys, Home, End)
- **Focus management** with visible focus indicators
- **Semantic HTML** with proper heading structure
- **Screen reader friendly** with role and state announcements

### Keyboard Shortcuts

- `Enter` or `Space` - Toggle accordion item
- `Arrow Down/Right` - Focus next item
- `Arrow Up/Left` - Focus previous item
- `Home` - Focus first item
- `End` - Focus last item

## Design System Integration

### Uses Existing Components

- **Arrow system**: Unicode arrows with `var(--size-arrow)` sizing
- **Glass cards**: `var(--color-bg-overlay-1)` and backdrop-filter
- **Typography**: Amulya for headers, Synonym for content
- **Spacing**: SAA spacing variables (`--space-*`)
- **Colors**: Gold primary (`--gold-primary`) for interactive elements

### CSS Variables Used

```css
/* Spacing */
--space-1 through --space-8

/* Typography */
--font-size-sm, --font-size-base, --font-size-lg, --font-size-xl
--font-weight-bold
--line-height-normal, --line-height-relaxed

/* Colors */
--color-bg-overlay-1
--color-text-primary, --color-text-secondary
--gold-primary

/* Layout */
--radius-lg

/* Icons */
--size-arrow
--saa-icon-small, --saa-icon-large
```

## Performance Features

- **GPU acceleration** with `transform: translateZ(0)`
- **Will-change optimization** for animations
- **Efficient animations** using transforms and opacity
- **No reflow/repaint** during interactions
- **Mutation observer** for dynamic content
- **Reduced motion support** for accessibility

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Fallbacks for older browsers without backdrop-filter
- Graceful degradation for reduced motion preferences
- High contrast mode support

## WordPress Integration

To use in WordPress, enqueue the files in your theme:

```php
// In your functions.php or theme file
wp_enqueue_style('accordion-css', get_stylesheet_directory_uri() . '/design-system/components/special/accordion.css');
wp_enqueue_script('accordion-js', get_stylesheet_directory_uri() . '/design-system/components/special/accordion.js', array(), '1.0.0', true);
```

## Customization

The component uses CSS custom properties, making it easy to customize:

```css
:root {
    /* Override colors */
    --gold-primary: #your-color;

    /* Override spacing */
    --space-4: your-spacing;

    /* Override typography */
    --font-size-lg: your-size;
}
```

## Examples

See `accordion.html` for complete working examples including:
- Basic accordion with eXp Realty content
- Small variant for FAQs
- Multiple open items configuration
- JavaScript control buttons