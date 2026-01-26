# Pending UI Fixes

## FIX-1: Pill text centering ("Safari" text not centered)
The text "Safari" inside the Download App pill is not centered - more space on right than left.
- **ATTEMPT 1 (FAILED)**: Changed `text-center` to `flex items-center justify-center` - Made it WORSE
- **ATTEMPT 2 (REVERTED)**: Reverted all pill buttons back to `text-center` - Still not centered
- **ATTEMPT 3 (FAILED)**: Using `inline-flex items-center justify-center leading-none` - Still not centered
- **ATTEMPT 4 (FAILED)**: Using `grid place-items-center` - Still not centered
- **ATTEMPT 5 (FAILED)**: Absolute positioned span with `inset-0 flex items-center justify-center` - Still not centered
- **ATTEMPT 6 (CURRENT)**: Fixed pill INDICATOR position - was at `calc(100% - 136px)` = 145px, but Safari button starts at 136px. Changed to `139px` (136px + 3px gap)
- **ROOT CAUSE FOUND**: The animated pill indicator was positioned 9px too far right for Safari

## FIX-2: Download App H1 title - TEXT TOO LARGE
Title has effects but text is way too big.
- **ATTEMPT 1 (FAILED)**: Manual textShadow styles - Not the same as H1 component
- **ATTEMPT 2 (FAILED)**: Used H1 component with `disableCloseGlow={true} noAnimation={true}` - No visible change
- **ATTEMPT 3 (PARTIAL)**: Added perspective wrapper + H1 component - Effects work but text is massive
- **ATTEMPT 4 (CURRENT)**: Added inline `style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)' }}` to override H1's `text-h1` class

## FIX-3: SlidePanel independent transitions - CLICK ISSUES PERSIST
Panels not transitioning independently - one should slide out while other slides in underneath.

### What Has Been Tried:
1. **Attempt 1**: Added `prevIsOpenRef` to detect parent-triggered close - FAILED
2. **Attempt 2**: Added `hideBackdrop` and `zIndexOffset` props - FAILED
3. **Attempt 3**: Added `isTransitioning` state with 150ms delay - FAILED
4. **Attempt 4**: Separate `showCategoryPanel`/`showDocumentPanel` states - FAILED
5. **Attempt 5**: Single `activePanel` state + swapped z-index - FAILED
6. **Attempt 6**: Fixed race condition with `isClosingTransition` check - PARTIALLY WORKING
7. **Attempt 7 (FAILED)**: Added `pointerEvents: 'none'` during closing + 500px width - Still can't click

### Current Issues:
- ✅ Animations work
- ❌ Cannot click exit button on document panel (second panel)
- ❌ Cannot click "Back to [category]" button
- ❌ Back button should close document panel and reveal category panel sliding in from behind

### Next Steps:
- Use Playwright to debug click issues
- Check z-index stacking during transitions
- May need different approach for panel stacking
