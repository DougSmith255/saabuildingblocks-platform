# SAA Flip Card Component

## Overview
A sophisticated flip card with sliding animation effects, adapted for the SmartAgentAlliance brand aesthetic. Features smooth sliding transitions and SAA color scheme integration.

## Files
- `flip-card.html` - Component structure
- `flip-card.css` - Styling and animations

## Features
- ✅ **Sliding Animation**: Cards slide in from top/bottom on hover
- ✅ **SAA Brand Colors**: Uses gold color scheme (#FFD700, #FFA500)
- ✅ **SAA Typography**: Amulya for titles, Synonym for body text
- ✅ **Glass Morphism**: Translucent background with blur effects
- ✅ **Responsive Design**: Mobile-optimized breakpoints
- ✅ **FontAwesome Icons**: Supports icon integration
- ✅ **Smooth Transitions**: 0.4s ease-in-out animations
- ✅ **Layout Safe**: Built-in padding prevents layout conflicts with content below

## Key Adaptations Made
1. **Replaced**: Original bright neon colors with SAA gold scheme
2. **Updated**: Typography to use SAA font hierarchy
3. **Modified**: Background to match SAA glass morphism aesthetic
4. **Improved**: Button styling to match SAA design language
5. **Added**: Proper responsive breakpoints

## Usage
```html
<!-- Include CSS -->
<link rel="stylesheet" href="design-system/components/cards/flip-card.css">

<!-- Use Component -->
<div class="saa-flip-card-container">
    <div class="saa-flip-card">
        <div class="flip-face flip-face1">
            <div class="flip-content">
                <i class="fas fa-rocket"></i>
                <h3>Smart Systems</h3>
            </div>
        </div>
        <div class="flip-face flip-face2">
            <div class="flip-content">
                <p>Your description text here...</p>
                <a href="#contact" type="button">Learn More</a>
            </div>
        </div>
    </div>
</div>
```

## Customization
- **Icon**: Change the FontAwesome icon class (fas fa-rocket)
- **Title**: Edit the h3 content in flip-face1
- **Description**: Modify the p content in flip-face2
- **Button Link**: Update the href attribute in the anchor tag
- **Colors**: Uses CSS custom properties for brand consistency

## Animation Details
- **Front Face**: Slides down from translateY(100px) to 0 on hover
- **Back Face**: Slides up from translateY(-100px) to 0 on hover
- **Glow Effects**: Golden glow with multiple inset shadows on hover
- **Opacity**: Front content fades from 0.3 to 1.0 on hover
- **Performance**: All animations use GPU acceleration

## Brand Consistency
Integrates seamlessly with SAA design system:
- Gold primary color scheme (#FFD700)
- Orange secondary accents (#FFA500)
- Amulya font for headings
- Synonym font for body text
- Glass morphism aesthetic
- Proper spacing and responsive approach

## Dependencies
- FontAwesome (for icons)
- SAA custom fonts (Amulya, Synonym)