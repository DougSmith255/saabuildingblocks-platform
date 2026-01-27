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

## FIX-3: SlidePanel independent transitions - ✅ RESOLVED

### Solution:
Added `pointerEvents: (isClosing || isClosingTransition) ? 'none' : 'auto'` to the CONTAINER div (not just the panel).

### Root Cause:
The category panel's full-screen container div (`fixed inset-0`) was intercepting ALL pointer events, preventing clicks from reaching the document panel's buttons (Back, X).

### What Worked:
- **Attempt 8**: Added `pointerEvents` style to the container div in SlidePanel.tsx
- The fix disables pointer events on the entire container during closing transitions
- This allows clicks to pass through to panels underneath

### Verified via Playwright Testing (2026-01-26):
- ✅ Back button clicks successfully
- ✅ X button clicks successfully
- ✅ Panels close properly
- ✅ No more "intercepts pointer events" timeout errors
