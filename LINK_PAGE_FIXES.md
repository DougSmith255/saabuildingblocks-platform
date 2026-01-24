# Link Page UI Fixes Tracker

**Last Updated:** 2026-01-24 (Round 9)
**Status:** 🔴 2 persistent issues, 4 new issues, 14 verified
**File:** `/packages/public-site/app/agent-portal/page.tsx`
**Git Commit:** `acebeee0`

---

## STATUS SUMMARY

| Status | Count | Fixes |
|--------|-------|-------|
| ✅ Verified | 14 | FIX-001, FIX-002, FIX-003, FIX-004, FIX-006, FIX-008, FIX-009, FIX-010, FIX-011, FIX-013, FIX-014, FIX-015, FIX-016, FIX-017, FIX-018, FIX-019/020 |
| 🔴 PERSISTENT (Multiple Failed Attempts) | 2 | FIX-005, FIX-007 |
| ❌ NEW Issues | 4 | FIX-021, FIX-022, FIX-023, FIX-024 |

---

## 🔴 PERSISTENT ISSUES (NEED INVESTIGATION)

### FIX-005: S Logo Disappearing/Reappearing on Downward Move

**Status:** 🔴 PERSISTENT - Multiple fix attempts failed
**Issue:** When the "About my Team" button (which has the S logo) is moved DOWN, the S logo disappears momentarily and then reappears.

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Changed from conditional rendering to opacity switching | Still happening |
| 2 | 2026-01-24 | Added `transform: translateZ(0)` for GPU layer | Still happening |
| 3 | 2026-01-24 | Added `loading="eager"` and `decoding="sync"` | Still happening |
| 4 | 2026-01-24 | Changed to keep both logo variants in DOM at all times | Still happening |

**Current Implementation (lines ~9083-9113):**
```jsx
<div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ zIndex: 1 }}>
  {/* Light version */}
  <img src="/icons/s-logo-offwhite.png" style={{ opacity: isAccentDark ? 1 : 0 }} ... />
  {/* Dark version */}
  <img src="/icons/s-logo-dark.png" style={{ opacity: isAccentDark ? 0 : 1 }} ... />
</div>
```

**Suspected Root Causes:**
1. React re-renders the entire button row when order changes, causing image reload
2. The `key={linkId}` on parent div forces remount on reorder
3. Animation transform (`translateY`) might be interfering with image rendering
4. Parent container has `overflow: hidden` somewhere cutting off during animation

**Additional User Report (Round 9):**
- White S icon appears BUT grey version does NOT disappear - causing visual overlap
- This suggests both opacity values might be getting set incorrectly during state transition

**Investigation Needed:**
1. Check if `isAccentDark` is being recalculated during reorder (it shouldn't be)
2. Add console.log to track opacity values during reorder
3. Consider using CSS classes instead of inline style opacity
4. Consider using a single image with CSS filter for color switching
5. Check if React key is causing full remount - try stable key approach

---

### FIX-007: Button Controls Hiding Behind Phone Border

**Status:** 🔴 PERSISTENT - Multiple fix attempts failed
**Issue:** The up/down move controls and edit button are hidden behind the phone's thick metal border frame.

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Set `zIndex: 99999` | Still hidden |
| 2 | 2026-01-24 | Set parent containers to `overflow: visible` | Still hidden |
| 3 | 2026-01-24 | Moved position from `-32px` to `-28px` | Still hidden |
| 4 | 2026-01-24 | Added hover-only visibility | User hates hover behavior |

**Current Implementation (lines ~9125-9170):**
```jsx
<div
  className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100"
  style={{ left: '-28px', zIndex: 99999 }}
>
```

**User Feedback (Round 9):**
- "Just move them forward on the z axis"
- "They are still hiding behind the phone's border (the thick border, the metal frame)"
- "Hover to see controls is stupid - make them always visible"
- z-index alone is NOT solving the issue

**Suspected Root Causes:**
1. z-index doesn't work without proper stacking context
2. Parent element might have `transform` which creates new stacking context
3. The phone border element might have its own stacking context with higher z-index
4. `overflow: hidden` on an ancestor is clipping the controls

**Investigation Needed:**
1. Find the phone border element and check its z-index/stacking context
2. Add `transform: translateZ(100px)` to force 3D stacking
3. Move controls OUTSIDE the phone container entirely
4. Use `position: fixed` instead of `absolute` as last resort
5. Remove ALL hover behavior - always visible

---

## ❌ NEW ISSUES (Round 9)

### FIX-021: New Button Label Input Not Matching Font Weight

**Status:** ❌ NOT FIXED
**Issue:** When adding a new button and typing the label, the input text is not bold even when Bold weight is selected. It only becomes bold after clicking the checkmark to confirm.

**Expected:** Input text should match `linksSettings.nameWeight` styling in real-time
**Location:** New link input around line ~9334

---

### FIX-022: Social Link Icons Too Dark with Dark Accent

**Status:** ❌ NOT FIXED
**Issue:** When accent color is very dark (e.g., navy blue), the social link icons in the circles also become very dark and nearly invisible.

**Expected:** Icon color should be a lighter version of the accent color, or use a contrasting color
**Suggestion:** Calculate a lighter tint of the accent color for icons when accent is dark

---

### FIX-023: S Logo - Both Versions Showing (Opacity Issue)

**Status:** ❌ NOT FIXED
**Issue:** When switching to light style (dark accent), the white S logo appears BUT the grey/dark S logo does NOT disappear. Both are visible, causing visual overlap.

**Root Cause:** Likely same as FIX-005 - opacity values not updating correctly during state changes

---

### FIX-024: Remove Hover Behavior from Button Controls

**Status:** ❌ NOT FIXED
**Issue:** User explicitly requested that button controls (up/down/edit) should ALWAYS be visible, not just on hover.

**Current:** `opacity-0 group-hover:opacity-100`
**Requested:** Remove opacity classes, always show controls

---

## VERIFIED FIXES ✅

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

---

## NEXT STEPS (Priority Order)

1. **FIX-024** - Remove hover behavior (quick fix)
2. **FIX-007** - Move controls outside phone container OR use fixed positioning
3. **FIX-021** - Add fontWeight to new button input
4. **FIX-022** - Calculate lighter icon color for dark accents
5. **FIX-005/023** - Deep investigation into S logo opacity issue

---

## TECHNICAL NOTES

### Phone Mockup Structure (for FIX-007)
```
Preview Card (overflow-visible, row-span-2)
└── Phone Container (p-4, overflow-visible)
    └── Phone Frame (max-w-[300px], rounded-[2.5rem], p-[6px])  ← THICK BORDER
        └── Phone Inner (rounded-[2.25rem], overflowX: visible, overflowY: hidden)
            └── Button Links Container (overflow: visible)
                └── Button Row (group, relative)
                    └── Button (relative)
                    └── Controls (absolute, left: -28px)  ← GETTING CLIPPED
```

**The phone frame at `p-[6px]` creates the thick metal border. Controls at `-28px` are within this padding area and may be getting clipped by the frame's visual styling, not overflow.**

### Possible Solutions for FIX-007:
1. Move controls to be siblings of the phone frame, not descendants
2. Use CSS `isolation: isolate` on controls
3. Use `position: fixed` with calculated coordinates
4. Render controls in a React Portal outside the phone DOM tree
