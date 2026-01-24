# Link Page UI Fixes Tracker

**Last Updated:** 2026-01-24 (Round 10)
**Status:** 🔴 2 persistent issues (12+ attempts each), 2 partial fixes needed
**File:** `/packages/public-site/app/agent-portal/page.tsx`
**Git Commit:** `b08a79ed`

---

## STATUS SUMMARY

| Status | Count | Fixes |
|--------|-------|-------|
| ✅ Verified | 16 | FIX-001 through FIX-020 (except 005, 007, 021, 024) |
| 🔴 PERSISTENT (12+ attempts) | 2 | FIX-007/024 (controls visibility) |
| 🟡 Partial Fix Needed | 2 | FIX-021 (input font), FIX-005 (preload) |

---

## 🔴🔴🔴 CRITICAL PERSISTENT ISSUE: BUTTON CONTROLS NOT VISIBLE 🔴🔴🔴

### FIX-007/024: Button Controls Completely Invisible

**Status:** 🔴🔴 CRITICAL - 12+ fix attempts, still broken
**Issue:** The up/down move controls and edit button are NOT VISIBLE AT ALL.

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Set `zIndex: 99999` | Still hidden |
| 2 | 2026-01-24 | Set parent containers to `overflow: visible` | Still hidden |
| 3 | 2026-01-24 | Moved position from `-32px` to `-28px` | Still hidden |
| 4 | 2026-01-24 | Added hover-only visibility (`opacity-0 group-hover:opacity-100`) | User hates hover, but at least visible on hover |
| 5 | 2026-01-24 | Removed hover classes, made always visible | **NOW COMPLETELY INVISIBLE** |
| 6 | 2026-01-24 | Added `isolation: isolate` to controls | Still invisible |
| 7 | 2026-01-24 | Added `transform: translateZ(50px)` | Still invisible |
| 8 | 2026-01-24 | Moved to `-36px` from button edge | Still invisible |

**User Feedback (Round 10):**
- "now i just dont see them at all"
- "again, we are going in circles"
- "have you been reading what we have tried in the troubleshooting section?"
- "we have gone in circles like 12 times now on this issue specifically"

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

## 🟡 PARTIAL FIXES NEEDED

### FIX-021: New Button Label Input Not Matching Font Weight

**Status:** 🟡 PARTIAL - Works after toggle, not on initial click
**Issue:** When first clicking to add a button, the input text is NOT bold even when Bold is selected. Only after clicking Regular→Bold does it update.

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Added `fontWeight: linksSettings.nameWeight === 'bold' ? 700 : 400` to input style | Still not bold on first click |

**User Feedback (Round 10):**
- "when i first click to add a button the text in the label still does not match"
- "unless i click regular then back to bold, then it changes"

**Root Cause Analysis:**
- `linksSettings.nameWeight` might be `undefined` on first render
- The null check `linksSettings?.nameWeight || 'bold'` should default to 'bold'
- But the comparison `linksSettings.nameWeight === 'bold'` returns false when undefined

**FIX NEEDED:**
Change from:
```jsx
fontWeight: linksSettings.nameWeight === 'bold' ? 700 : 400
```
To:
```jsx
fontWeight: (linksSettings?.nameWeight || 'bold') === 'bold' ? 700 : 400
```

---

### FIX-005: S Logo Preload Needed

**Status:** 🟡 PARTIAL - Works but shows loading flash
**Issue:** S logo now correctly switches between light/dark, BUT on first load of alternate version, there's a visible loading delay.

**User Feedback (Round 10):**
- "works well, but both versions need to be loaded in the agent portal loading screen"
- "so that i dont see the first load of the alternate icon have to load"

**FIX NEEDED:**
Add preload for both S logo versions at component mount or in document head:
```jsx
<link rel="preload" href="/icons/s-logo-offwhite.png" as="image" />
<link rel="preload" href="/icons/s-logo-dark.png" as="image" />
```
Or load both images in a hidden div on component mount.

---

## ✅ VERIFIED FIXES (Round 10)

### FIX-022: Social Link Icons - Lightened Color ✅
**Status:** ✅ VERIFIED - User said "amazing" and "perfect"
**What Works:** `getVisibleSocialIconColor()` lightens dark accent colors for icon visibility

**Additional Request (Round 10):**
User wants same treatment applied to:
1. Social icon circle **border color**
2. Social icon circle **background gradient**

Quote: "can you do the same for the border color and the gradient to a certain degree? Because the background is dark and i think they would look better with the gradient and border always seen"

### FIX-005/023: S Logo Switching ✅
**Status:** ✅ VERIFIED - User said "yes, works well"
**What Works:** Single `<img>` with conditional `src` based on `isAccentDark`

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

1. **FIX-007/024** - CRITICAL: Make controls visible (try explicit `opacity: 1`)
2. **FIX-022 extension** - Apply lightened color to social icon border and background
3. **FIX-021** - Fix null check for fontWeight in new button input
4. **FIX-005** - Add preload for both S logo versions

---

## TECHNICAL NOTES

### Phone Mockup DOM Structure
```
Preview Card (overflow-visible, row-span-2)
└── Phone Container (p-4, overflow-visible)
    └── Phone Frame (max-w-[300px], rounded-[2.5rem], p-[6px])  ← THICK BORDER
        └── Phone Inner (rounded-[2.25rem], overflowX: visible, overflowY: hidden)
            └── Button Links Container (overflow: visible)
                └── Button Row (group, relative)
                    └── Button (relative)
                    └── Controls (absolute, left: -36px)  ← NOT VISIBLE
```

### Why Controls Might Be Invisible:
1. **Missing explicit opacity** - Tailwind's `group-hover:opacity-100` was setting opacity to 1 on hover. Without it, opacity might be defaulting to 0 from some other CSS rule.
2. **Stacking context** - Phone frame might have its own stacking context that puts it above everything inside.
3. **Clipping** - Despite `overflow: visible`, the rounded corners with `border-radius` can create implicit clipping.
4. **Transform context** - The `transform` on controls creates new stacking context, might need corresponding transform on phone frame.

### Solutions to Try:
1. **Explicit opacity**: Add `style={{ opacity: 1 }}` or `className="opacity-100"`
2. **Position fixed**: Calculate absolute screen coordinates
3. **React Portal**: Render controls in `document.body` outside phone DOM
4. **Sibling positioning**: Move controls to be siblings of phone frame, not descendants
