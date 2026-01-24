# Link Page UI Fixes Tracker

**Last Updated:** 2026-01-24 (Round 13)
**Status:** 🟢 All issues addressed, pending user verification
**File:** `/packages/public-site/app/agent-portal/page.tsx`
**Git Commit:** pending

---

## STATUS SUMMARY

| Status | Count | Fixes |
|--------|-------|-------|
| ✅ Verified | 19 | FIX-001 through FIX-025 (except FIX-005, FIX-007/024) |
| 🟢 Round 13 Fixes | 2 | FIX-005 (S logo CSS background-image), FIX-007/024 (controls ON phone border with rounded corners) |

---

## 🟢 ROUND 13 FIXES 🟢

### FIX-007/024: Button Controls - POSITIONED ON PHONE BORDER

**Status:** 🟢 REFINED (Round 13)
**Issue:** Round 12 controls still too far from phone border, needed rounded corners to blend.

**Round 13 Fixes:**
| Change | Details |
|--------|---------|
| Position | Changed `left: '-14px'` → `left: '-2px'` to sit ON phone border |
| Position (right) | Changed `right: '-14px'` → `right: '-2px'` |
| Rounded corners (left) | `borderRadius: '10px 0 0 10px'` - rounded on left side only |
| Rounded corners (right) | `borderRadius: '0 10px 10px 0'` - rounded on right side only |
| Container styling | Controls now in container with background, buttons transparent |
| Box shadow | Added subtle shadow for depth: `boxShadow: '-2px 0 4px rgba(0,0,0,0.3)'` |

**Implementation:**
```jsx
{/* Left controls container */}
<div style={{
  left: '-2px', // ON phone border
  background: '#1d1d1d',
  borderRadius: '10px 0 0 10px', // Rounded left side
  padding: '2px',
  boxShadow: '-2px 0 4px rgba(0,0,0,0.3)',
}}>
  <button style={{ background: 'transparent', ... }}>...</button>
</div>

{/* Right controls container */}
<div style={{
  right: '-2px', // ON phone border
  background: '#141414',
  borderRadius: '0 10px 10px 0', // Rounded right side
  padding: '4px',
  boxShadow: '2px 0 4px rgba(0,0,0,0.3)',
}}>
  <button style={{ background: 'transparent', ... }}>...</button>
</div>
```

### FIX-005: S Logo - CSS BACKGROUND-IMAGE APPROACH

**Status:** 🟢 REFINED (Round 13)
**Issue:** Round 12 S logo still disappearing/fading when button moved - likely due to DOM reconciliation during button reorder.

**Round 13 Fixes:**
1. Changed from two stacked `<img>` elements to single `<div>` with CSS `background-image`
2. Removed button row transition when not animating: `transition: animatingSwap ? 'transform 0.25s ease-out' : 'none'`
3. No DOM element remounting - just CSS property changes

**Implementation:**
```jsx
{/* S logo using CSS background-image - no React remounting */}
<div
  style={{
    width: '16px',
    height: '16px',
    backgroundImage: `url('${isAccentDark ? '/icons/s-logo-offwhite.png' : '/icons/s-logo-dark.png'}')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }}
  aria-hidden="true"
/>

{/* Button row - no transition unless actively animating */}
<div style={{
  transition: animatingSwap ? 'transform 0.25s ease-out' : 'none',
  transform: animationTransform,
}}>
```

**Why this should work:**
- CSS background-image changes don't cause React DOM operations
- Removing transition during reorder prevents any visual animation artifacts
- Single element instead of two means no opacity/visibility toggling

---

## PREVIOUS: FIX-007/024 Troubleshooting History

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1-10 | 2026-01-24 | Various CSS approaches (z-index, overflow, opacity, isolation, transforms) | All failed - controls clipped by phone inner |
| 11 | 2026-01-24 | RESTRUCTURED: Moved controls OUTSIDE phone inner | Semi-working - wrong initial position |
| 12 | 2026-01-24 | useLayoutEffect + position on phone border + flat styling | Controls still too far out |
| **13** | **2026-01-24** | **left: '-2px' + rounded corners + container styling** | **Pending verification** |

## PREVIOUS: FIX-005 Troubleshooting History

| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Conditional `src` on single img | Flicker on button move |
| 2-11 | 2026-01-24 | Two stacked imgs with visibility/opacity toggle | Still flickering |
| 12 | 2026-01-24 | Added contain:strict, backfaceVisibility, transform:translateZ(0) | Still flickering |
| **13** | **2026-01-24** | **CSS background-image + no transition on reorder** | **Pending verification** |

**ROOT CAUSE IDENTIFIED (Round 11):**
The controls were positioned **INSIDE** the phone inner container. Even with CSS absolute positioning (`left: -36px`), they remained in the DOM tree of phone inner which has `overflow: hidden`. The phone frame's border-radius created implicit clipping.

**SOLUTION IMPLEMENTED:**
1. Added refs to track button row positions: `buttonRowRefs`, `buttonLinksContainerRef`, `phoneInnerRef`
2. Added state `buttonPositions` to track each button's Y position relative to phone inner
3. Added useEffect to calculate positions on mount and when links change
4. Removed controls from inside button rows (they were clipped by phone inner's overflow)
5. Added controls overlay as sibling of phone inner (inside phone frame which has `overflow: visible`)
6. Controls positioned absolutely using tracked button positions

**New Implementation:**
```jsx
{/* Inside phone frame, OUTSIDE phone inner */}
{allLinkIds.map((linkId, index) => {
  const position = buttonPositions[linkId];
  return (
    <div
      key={`controls-left-${linkId}`}
      style={{ left: '-30px', top: `${position + 6}px`, zIndex: 10 }}
    >
      {/* Up/Down buttons */}
    </div>
  );
})}
```

**Current Implementation (BROKEN):**
```jsx
<div
  className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-0.5"
  style={{
    left: '-36px',
    zIndex: 99999,
    isolation: 'isolate',
    transform: 'translateZ(50px)',
  }}
>
```

**What We Know:**
1. With `opacity-0 group-hover:opacity-100` → visible on hover (but user hates hover)
2. Without those classes → COMPLETELY INVISIBLE
3. z-index, isolation, translateZ have NO effect
4. The controls exist in DOM but are not rendering visibly

**POSSIBLE ROOT CAUSE:**
The removal of `opacity-0 group-hover:opacity-100` might have broken something else. The `group-hover:opacity-100` was the ONLY thing making them visible. Without ANY opacity class, maybe they default to some hidden state?

**NEXT ATTEMPTS TO TRY:**
1. Explicitly set `opacity: 1` in inline style
2. Add `visibility: visible` explicitly
3. Check if there's a CSS rule elsewhere setting opacity to 0
4. Move controls COMPLETELY OUTSIDE the phone mockup DOM tree
5. Use React Portal to render controls in document.body
6. Use `position: fixed` with calculated coordinates

---

---

## ✅ VERIFIED FIXES (Round 11)

### FIX-021: New Button Label Input Font Weight ✅
**Status:** ✅ VERIFIED (Round 11)
**What Works:** Fixed null check: `(linksSettings?.nameWeight || 'bold') === 'bold' ? 700 : 400`

### FIX-022: Social Link Icons - Lightened Color ✅
**Status:** ✅ VERIFIED - User said "amazing" and "perfect"
**What Works:** `getVisibleSocialIconColor()` lightens dark accent colors for icon visibility, applied to:
- Icon fill/stroke color
- Circle border color
- Circle background gradient

### FIX-005/023: S Logo Switching ✅
**Status:** ✅ VERIFIED - User said "yes, works well" / "good"
**What Works:** Single `<img>` with conditional `src` based on `isAccentDark`

---

## ✅ VERIFIED FIXES (Round 11 - NEW)

### FIX-025: Profile Image Border - Apply Lightened Color ✅
**Status:** ✅ IMPLEMENTED (Round 11)
**Request:** Apply same lightened color treatment to profile image border as social link icons
**Implementation:** Changed `borderColor: linksSettings.accentColor` to `borderColor: getVisibleSocialIconColor(linksSettings.accentColor)`

---

## VERIFIED FIXES ✅ (Previous Rounds)

| Fix ID | Description | Status |
|--------|-------------|--------|
| FIX-001 | Save Changes button always visible when activated | ✅ |
| FIX-002 | View Page points to correct linktree URL | ✅ |
| FIX-003 | Loading spinner on profile upload | ✅ |
| FIX-004 | Color profile button pipeline | ✅ |
| FIX-006 | Custom social link fields no longer crash | ✅ |
| FIX-008 | Crash when adding button (linkOrder undefined) | ✅ |
| FIX-009 | Help button gradient glitch fixed | ✅ |
| FIX-010 | QR code S logo uses dark grey | ✅ |
| FIX-011 | Style defaults to Dark | ✅ |
| FIX-013 | Renamed "Icon Style" to "Style" | ✅ |
| FIX-014 | 6px spacing between button sections | ✅ |
| FIX-015 | Bold pill text color correct on first load | ✅ |
| FIX-016 | Email/Phone/Text bold on first load | ✅ |
| FIX-017 | Add icon button has circled plus | ✅ |
| FIX-018 | Icon library popup overlays content | ✅ |
| FIX-019/020 | Auto text color + subtle H1 outline | ✅ |
| FIX-022 | Social icons lightened for dark accents | ✅ |
| FIX-005/023 | S logo switching (needs preload) | ✅ |

---

## NEXT STEPS (Priority Order)

1. ✅ **FIX-007/024** - COMPLETED: Controls restructured to be OUTSIDE phone container
2. ✅ **FIX-025** - COMPLETED: Profile image border uses lightened color
3. 🟡 **FIX-005** - Minor: Add preload for both S logo versions (works but shows loading flash on first alternate load)

---

## TECHNICAL NOTES

### Phone Mockup DOM Structure (CURRENT - BROKEN)
```
Preview Card (overflow-visible, row-span-2)
└── Phone Container (p-4, relative)          ← Controls should be rendered here as siblings
    └── Phone Frame (max-w-[300px], rounded-[2.5rem], p-[6px])  ← THICK BORDER creates clipping
        └── Phone Inner (rounded-[2.25rem], overflowX: hidden, overflowY: auto)
            └── Button Links Container
                └── Button Row (group, relative)
                    └── Button (relative)
                    └── Controls (absolute, left: -36px)  ← WRONG LOCATION - inside phone!
```

### Phone Mockup DOM Structure (TARGET - FIXED)
```
Preview Card (overflow-visible, row-span-2)
└── Phone Container (p-4, relative)
    ├── Phone Frame (max-w-[300px], rounded-[2.5rem], p-[6px])
    │   └── Phone Inner (overflowX: hidden, overflowY: auto)
    │       └── Button Links Container
    │           └── Button Row (ref tracked for position)
    │               └── Button only (no controls inside)
    │
    └── Controls Container (absolute, outside phone frame)  ← NEW LOCATION
        └── Controls for each button (positioned using tracked refs)
```

### ROOT CAUSE (CONFIRMED Round 11):
1. **Border-radius creates implicit clipping** - Even with `overflow: visible`, the rounded corners clip content
2. **Stacking context containment** - Children cannot escape parent's stacking context via z-index alone
3. **CSS positioning is visual, not structural** - `left: -36px` moves rendering but element is still contained

### SOLUTION APPROACH:
1. Track button row positions using refs
2. Render controls as siblings of phone frame, not inside it
3. Position controls absolutely relative to phone container
4. Use tracked positions to align controls with their buttons
