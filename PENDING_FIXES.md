# Pending UI Fixes

## FIX-1: Pill text centering ("Safari" text not centered)
The text "Safari" inside the Download App pill is not centered, while "Chrome" is.
- **ATTEMPT 1 (FAILED)**: Changed `text-center` to `flex items-center justify-center` - Made it WORSE
- **ATTEMPT 2 (REVERTED)**: Reverted all pill buttons back to `text-center` - Still not centered
- **ATTEMPT 3 (FAILED)**: Using `inline-flex items-center justify-center leading-none` - Still not centered
- **ATTEMPT 4 (CURRENT)**: Using `grid place-items-center` - Grid centering can be more reliable than flexbox

## FIX-2: Download App H1 title
Title missing proper H1 effects.
- **ATTEMPT 1 (FAILED)**: Manual textShadow styles - Not the same as H1 component
- **ATTEMPT 2 (FAILED)**: Used H1 component with `disableCloseGlow={true} noAnimation={true}` - No visible change
- **ATTEMPT 3 (CURRENT)**: Added perspective wrapper div like home page + removed `noAnimation` prop

## FIX-3: SlidePanel independent transitions
Panels not transitioning independently - one should slide out while other slides in underneath.

### What Has Been Tried (All Failed):
1. **Attempt 1**: Added `prevIsOpenRef` to detect parent-triggered close and play animation
   - Result: Still didn't work properly when switching panels

2. **Attempt 2**: Added `hideBackdrop` and `zIndexOffset` props, shared backdrop
   - Result: Reduced flash but panels still overwrite each other

3. **Attempt 3**: Added `isTransitioning` state with 150ms delay before opening new panel
   - Result: Category panel isOpen condition still became false immediately

4. **Attempt 4**: Separate `showCategoryPanel`/`showDocumentPanel` states with 100ms stagger
   - Result: Made it WORSE - backdrop flashes again, closing panel disappears instead of sliding

5. **Attempt 5 (FAILED)**: Single `activePanel` state + swapped z-index + use public-site SlidePanel
   - Changed to single `activePanel` state (`'category' | 'document' | null`)
   - Swapped z-index: category=1 (on top, slides out), document=0 (underneath, slides in)
   - Switched from shared SlidePanel to public-site SlidePanel (has `prevIsOpenRef` logic)
   - Removed timeout delay - both animations start simultaneously
   - Backdrop uses pointer-events instead of conditional rendering
   - **RESULT**: Still same issue - closing panel disappears instead of animating

6. **Attempt 6 (CURRENT)**: Fixed race condition in SlidePanel component
   - **ROOT CAUSE FOUND**: React render happens BEFORE useEffect can set `isClosing` state
   - When `isOpen` changes from true to false:
     1. Render runs first with `isOpen=false`, `isClosing=false`, `shouldRender=false`
     2. Component returns null before useEffect can set `isClosing=true`
     3. Panel disappears instantly instead of animating
   - **FIX**: Added `isClosingTransition` check in render: `prevIsOpenRef.current === true && !isOpen`
   - This catches the first render before useEffect runs
   - Also added to className logic so closing animation class is applied immediately

### Root Cause Analysis:
The fundamental issue was a React race condition:
1. State changes trigger a re-render BEFORE useEffects run
2. The render conditions checked `isClosing` which hadn't been set yet
3. Panel returned null before the closing animation could start

### Solution Applied:
- Added `isClosingTransition` variable that checks `prevIsOpenRef.current === true && !isOpen` during render
- This catches the "about to close" state before useEffect sets `isClosing`
- Applied `isClosingTransition` to both render conditions and className logic
