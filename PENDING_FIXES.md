# Pending UI Fixes

## FIX-1: Pill text centering ("Safari" text not centered)
The text "Safari" inside the Download App pill is not centered, while "Chrome" is.
- **ATTEMPT 1 (FAILED)**: Changed `text-center` to `flex items-center justify-center` - Made it WORSE
- **ATTEMPT 2 (REVERTED)**: Reverted all pill buttons back to `text-center` - Still not centered
- **ATTEMPT 3 (FAILED)**: Using `inline-flex items-center justify-center leading-none` - Still not centered
- **ATTEMPT 4 (FAILED)**: Using `grid place-items-center` - Still not centered
- **ATTEMPT 5 (CURRENT)**: Absolute positioned span with `inset-0 flex items-center justify-center` + fixed button height

## FIX-2: Download App H1 title ✅ FIXED (needs sizing revert)
Title missing proper H1 effects.
- **ATTEMPT 1 (FAILED)**: Manual textShadow styles - Not the same as H1 component
- **ATTEMPT 2 (FAILED)**: Used H1 component with `disableCloseGlow={true} noAnimation={true}` - No visible change
- **ATTEMPT 3 (FIXED)**: Added perspective wrapper div like home page + removed `noAnimation` prop
- **ISSUE**: H1 component applied its own text sizing - need to revert to original `text-2xl sm:text-3xl`

## FIX-3: SlidePanel independent transitions ✅ PARTIALLY FIXED
Panels not transitioning independently - one should slide out while other slides in underneath.

### What Has Been Tried:
1. **Attempt 1**: Added `prevIsOpenRef` to detect parent-triggered close - FAILED
2. **Attempt 2**: Added `hideBackdrop` and `zIndexOffset` props - FAILED
3. **Attempt 3**: Added `isTransitioning` state with 150ms delay - FAILED
4. **Attempt 4**: Separate `showCategoryPanel`/`showDocumentPanel` states - FAILED
5. **Attempt 5**: Single `activePanel` state + swapped z-index - FAILED
6. **Attempt 6 (CURRENT)**: Fixed race condition with `isClosingTransition` check - PARTIALLY WORKING

### Current Issues (Attempt 6):
- ✅ Animations now work (panel slides out while other slides in)
- ❌ Cannot click exit button on second panel
- ❌ Cannot click backdrop to close second panel
- ❌ Panel width changed from 500px - need to revert

### Fixes Applied:
- ✅ Reverted panel width back to 500px for all sizes
- ✅ Added `pointerEvents: 'none'` during closing animation so panel underneath can receive clicks
