# Debug Log: Secondary Button Light Bars Issue

## Problem
The right-side light bar on secondary buttons (Commission Calculator, RevShare Visualizer, Book a Call) is not appearing on the right side of the button - it appears to be stuck in the center or missing entirely.

## Screenshots
- `/tmp/buttons-screenshot3.png` - Shows buttons with LEFT light bar visible but RIGHT light bar missing

## Attempts Made

### Attempt 1 (Failed)
- Changed `left: 0; transform: translate(-50%, -50%)` to `left: -5px; transform: translateY(-50%)`
- Changed `right: 0; transform: translate(50%, -50%)` to `right: -5px; transform: translateY(-50%)`
- Added `z-index: 5` to light bars
- Added `z-index: 10` to button face
- **Result:** Left bar works, right bar still not visible on right side

## Current HTML Structure (in [slug].js)
```html
<div class="group" style="position: relative; display: inline-block;">
  <a href="..." style="...z-index: 10;">
    <span>...</span>
    Button Text
  </a>
  <div class="cta-light-bar..." style="position: absolute; top: 50%; left: -5px; transform: translateY(-50%); ...z-index: 5;"></div>
  <div class="cta-light-bar..." style="position: absolute; top: 50%; right: -5px; transform: translateY(-50%); ...z-index: 5;"></div>
</div>
```

## Working React Component (SecondaryButton.tsx)
Uses:
- Left bar: `left: '-5px'`, `transform: 'translateY(-50%)'`
- Right bar: `right: '-5px'`, `transform: 'translateY(-50%)'`
- Light bars: `zIndex: 5`
- Button face: `zIndex: 10`

## ROOT CAUSE FOUND (Attempt 2)
The `.cta-light-bar` CSS class (line 732-742 in [slug].js) has:
```css
.cta-light-bar {
  left: 50%;
  transform: translateX(-50%);
}
```

This `left: 50%` was overriding the inline `right: -5px` on the right light bar because when both `left` and `right` are set, `left` takes precedence.

Computed styles showed:
- Left bar: `left: -5px` ✓
- Right bar: `left: 232.109px` (computed from 50% of wrapper width) ✗

## FIX APPLIED
Added `left: auto;` to the right light bar's inline styles to reset the CSS class's `left: 50%`:
```html
<div style="... left: auto; right: -5px; ..."></div>
```

This allows `right: -5px` to take effect properly.

## Files Modified
- `/home/claude-flow/packages/public-site/functions/[slug].js`
  - Line ~3124: Commission Calculator button right light bar
  - Line ~3145: RevShare Visualizer button right light bar
  - Line ~3400: Book a Call button right light bar
