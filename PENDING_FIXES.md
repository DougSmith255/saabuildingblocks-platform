# Pending UI Fixes

## FIX-1: Menu item selection should scroll to top
When a menu item is selected, the page should automatically scroll to the top. Currently if user scrolls down on one menu item then navigates to another, they remain scrolled down which is jarring.

## FIX-2: Download App tab improvements
1. **Smooth layout shift** - When switching between Chrome/Safari, the parent container (logo to instructions) has a large layout shift. Make the expand/contract smooth with a transition.
2. **Title styling** - Change "SAA Portal App" text to Taskor font with H1 styling
3. **Remove subtitle** - Remove the "Smart Agent Alliance" text from below the title
4. **Two-column layout for >1200px**:
   - Left column: App icon, title, info, and "Important" note
   - Right column: Pill selector and instructions
   - Below 1200px: Keep single column layout

## FIX-3: New Agents SlidePanel transition improvements
1. **No flash on panel switch** - Currently when clicking another file, the open panel disappears abruptly instead of sliding off smoothly
2. **Backdrop flash** - The gradient backdrop also flashes gone and comes back with the next panel
3. **Stacked slide transition** - When opening a new panel while one is open, the new panel should slide from underneath the one sliding out
4. **Single backdrop** - Only keep one gradient background at a time (don't layer multiple)
