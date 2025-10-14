# Stacked Animation Cards Component

## Overview
Advanced scroll-based card stacking animation that creates a dynamic "deck shrinking" effect. Cards scale down and stack as the user scrolls, providing an engaging and space-efficient way to display multiple related items.

## Usage Rules
- **Use when**: Section has **5 or more cards** specifically
- **Don't use for**: 1-4 cards (use regular grid or simple stacked layout)
- **Best for**: Benefits lists, feature showcases, service portfolios, step-by-step processes

## Component Structure

### HTML Structure
```html
<div class="saa-stacked-animation-wrapper">
  <ul class="saa-stacked-animation-cards saa-cards-5" id="unique-container-id">
    
    <li class="saa-stacked-animation-card">
      <div class="saa-stacked-card-content">
        <div class="saa-stacked-card-text">
          <h3 class="saa-stacked-card-title">Card Title</h3>
          <p class="saa-stacked-card-description">Description text...</p>
          <a href="#" class="saa-stacked-card-btn">Call to Action</a>
        </div>
        <figure class="saa-stacked-card-figure">
          <img src="image.jpg" alt="Description" class="saa-stacked-card-image">
          <!-- OR use placeholder -->
          <div class="saa-stacked-card-placeholder">Icon/Text</div>
        </figure>
      </div>
    </li>
    
    <!-- Repeat for 5+ cards total -->
  </ul>
</div>
```

### CSS Classes
- `.saa-stacked-animation-wrapper` - Main container with responsive width
- `.saa-stacked-animation-cards` - Cards container with grid layout
- `.saa-cards-X` - Utility class for X number of cards (5, 6, 7, 8, 9, 10)
- `.saa-stacked-animation-card` - Individual card with sticky positioning
- `.saa-stacked-card-content` - Card content container with grid layout
- `.saa-stacked-card-text` - Text content area
- `.saa-stacked-card-title` - Card title styling
- `.saa-stacked-card-description` - Card description text
- `.saa-stacked-card-btn` - Call-to-action button
- `.saa-stacked-card-figure` - Image container
- `.saa-stacked-card-image` - Image styling with hover effects
- `.saa-stacked-card-placeholder` - Image placeholder styling

## Features

### Animation Effects
- **Scroll-based scaling**: Cards shrink as they stack up
- **Smooth transitions**: GPU-accelerated transforms
- **Responsive stacking**: Adapts to different screen sizes
- **Hover interactions**: Cards lift and images zoom slightly
- **Performance optimized**: Uses Motion One library for efficient animations

### Visual Design
- **Glass morphism**: Semi-transparent cards with backdrop blur
- **SAA branding**: Gold gradients and brand colors
- **Typography**: Amulya and Synonym font integration
- **Shadows**: Dynamic shadow effects that respond to hover

### Responsive Behavior
- **Desktop**: Side-by-side text/image layout with full animations
- **Mobile**: Stacked text-over-image layout, simplified animations
- **Scaling**: Fluid typography and spacing using clamp() functions

### Accessibility Features
- **Reduced motion**: Respects user's motion preferences
- **High contrast**: Enhanced borders and colors
- **Keyboard navigation**: Focus states and logical tab order
- **Screen readers**: Proper semantic HTML structure

## Technical Implementation

### Dependencies
- **Motion One**: Required for scroll animations (auto-loads with CDN fallbacks)
  - Primary: `https://cdn.skypack.dev/motion@10.13.1`
  - Fallback 1: `https://unpkg.com/motion@10.16.2`
  - Fallback 2: `https://cdn.jsdelivr.net/npm/motion@10.16.2/dist/motion.js`
- **Modern browsers**: Uses CSS Grid, custom properties, and backdrop-filter

### JavaScript Integration
```javascript
// Automatic initialization
// Script loads and initializes automatically

// Manual control
window.SAAStackedCards.refresh(); // Refresh animations
window.SAAStackedCards.init();    // Reinitialize
```

### Performance Optimizations
- **Lazy loading**: Motion One loads only when needed
- **GPU acceleration**: Proper use of transform and will-change
- **Efficient animations**: Hardware-accelerated scaling only
- **Fallback handling**: Graceful degradation without JavaScript

## Card Count Classes
- `.saa-cards-5` - For 5 cards
- `.saa-cards-6` - For 6 cards
- `.saa-cards-7` - For 7 cards
- `.saa-cards-8` - For 8 cards
- `.saa-cards-9` - For 9 cards
- `.saa-cards-10` - For 10 cards

## Implementation Examples

### eXp Benefits Section (5 Cards)
```html
<div class="saa-stacked-animation-wrapper">
  <ul class="saa-stacked-animation-cards saa-cards-5" id="exp-benefits">
    
    <li class="saa-stacked-animation-card">
      <div class="saa-stacked-card-content">
        <div class="saa-stacked-card-text">
          <h3 class="saa-stacked-card-title">Revenue Share System</h3>
          <p class="saa-stacked-card-description">Earn passive income from your network...</p>
          <a href="/revenue-share" class="saa-stacked-card-btn">Learn More</a>
        </div>
        <figure class="saa-stacked-card-figure">
          <div class="saa-stacked-card-placeholder">💰</div>
        </figure>
      </div>
    </li>
    
    <!-- 4 more cards -->
  </ul>
</div>
```

### Service Features (7 Cards)
```html
<div class="saa-stacked-animation-wrapper">
  <ul class="saa-stacked-animation-cards saa-cards-7" id="services">
    
    <li class="saa-stacked-animation-card">
      <div class="saa-stacked-card-content">
        <div class="saa-stacked-card-text">
          <h3 class="saa-stacked-card-title">Lead Generation</h3>
          <p class="saa-stacked-card-description">Proven systems that generate quality leads...</p>
          <a href="/leads" class="saa-stacked-card-btn">Get Started</a>
        </div>
        <figure class="saa-stacked-card-figure">
          <img src="/assets/leads.jpg" alt="Lead Generation" class="saa-stacked-card-image">
        </figure>
      </div>
    </li>
    
    <!-- 6 more cards -->
  </ul>
</div>
```

## WordPress Integration

### Enqueuing Assets
```php
// functions.php or component-specific file
function enqueue_saa_stacked_animation_cards() {
    wp_enqueue_style(
        'saa-stacked-animation-cards',
        get_stylesheet_directory_uri() . '/design-system/components/cards/stacked-animation-cards.css',
        array('design-system'),
        GP_CHILD_VERSION
    );
    
    wp_enqueue_script(
        'saa-stacked-animation-cards',
        get_stylesheet_directory_uri() . '/design-system/components/cards/stacked-animation-cards.js',
        array(),
        GP_CHILD_VERSION,
        true
    );
}

// Conditional loading
if (has_stacked_animation_cards()) {
    add_action('wp_enqueue_scripts', 'enqueue_saa_stacked_animation_cards');
}
```

### Shortcode Integration
```php
// Example shortcode implementation
function saa_stacked_cards_shortcode($atts, $content = null) {
    $args = shortcode_atts(array(
        'count' => 5,
        'id' => 'saa-cards-' . uniqid(),
    ), $atts);
    
    ob_start();
    echo '<div class="saa-stacked-animation-wrapper">';
    echo '<ul class="saa-stacked-animation-cards saa-cards-' . esc_attr($args['count']) . '" id="' . esc_attr($args['id']) . '">';
    echo do_shortcode($content);
    echo '</ul>';
    echo '</div>';
    return ob_get_clean();
}
add_shortcode('saa_stacked_cards', 'saa_stacked_cards_shortcode');
```

## Browser Support
- **Modern browsers**: Full support with animations
- **Fallback mode**: Basic stacking without animations for older browsers
- **Mobile**: Optimized touch interactions and responsive layout
- **Accessibility**: Full support for assistive technologies

## Debugging
- Add `saa-debug-mode` class to wrapper for visual debugging
- Check browser console for initialization messages
- Use `window.SAAStackedCards.refresh()` for dynamic content updates

## Maintenance Notes
- **Unique IDs**: Each container needs a unique ID for proper initialization
- **Card count classes**: Update class when adding/removing cards
- **Motion One**: Multi-CDN fallback system ensures reliable loading
- **CDN Resilience**: Automatically tries Skypack → unpkg → jsdelivr if one fails
- **Testing**: Verify animations work across different scroll speeds and devices