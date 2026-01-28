# L-Frame Shadow Troubleshooting

## L-Frame Geometry Analysis

### The 3 Structural Pieces

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      HEADER                                 │
│               (full width, 85px tall)                       │
│                                                       ╮     │  ← Header's bottom-right corner (24px radius)
├──────────────┬──────────────────────────────────────────────┤
│              │╲
│              │ ╲ ← Inner Corner (concave 24px curve)
│   SIDEBAR    │  ╲
│  (280px wide)│   Content Area
│              │
│              │
│              │
│            ╭─┘  ← Sidebar's bottom-right corner (24px radius)
└──────────────┘
```

### Exact Coordinates

**Header:**
- Position: `top: 0, left: 0, right: 0, height: 85px`
- `border-bottom-right-radius: 24px`
- Bottom-right corner center: `(viewport_width - 24, 85 - 24)` → curves to `(viewport_width, 85)`

**Sidebar:**
- Position: `top: 85px, left: 0, width: 280px, bottom: 0`
- `border-bottom-right-radius: 24px`
- Bottom-right corner center: `(280 - 24, viewport_height - 24)` = `(256, vh - 24)`

**Inner Corner (junction filler):**
- Position: `top: 85px, left: 280px, width: 24px, height: 24px`
- `radial-gradient(circle at 100% 100%, transparent 24px, solid 24px)`
- Curve center: `(280 + 24, 85 + 24)` = `(304, 109)`
- This creates a CONCAVE (inward) curve into the content area

---

## Shadow Requirements

Shadows should appear on the CONTENT-FACING edges of the L-frame, creating a subtle 3D "lifted" effect.

### Shadow Locations Needed:

1. **Header Bottom Edge** (straight line)
   - From: `x = 304` (after inner corner ends)
   - To: `x = viewport_width - 24` (before header's bottom-right corner)
   - At: `y = 85`

2. **Header Bottom-Right Corner** (convex curve, curves DOWN and RIGHT)
   - 24px radius quarter-circle
   - Center at: `(viewport_width - 24, 85)`
   - Shadow wraps around the outside of this curve

3. **Inner Corner** (concave curve, curves INTO content)
   - 24px radius quarter-circle
   - Center at: `(304, 109)`
   - Shadow follows the inside of this concave curve

4. **Sidebar Right Edge** (straight line)
   - From: `y = 109` (after inner corner ends)
   - To: `y = viewport_height - 24` (before sidebar's bottom-right corner)
   - At: `x = 280`

5. **Sidebar Bottom-Right Corner** (convex curve, curves DOWN and RIGHT)
   - 24px radius quarter-circle
   - Center at: `(256, viewport_height - 24)`
   - Shadow wraps around the outside of this curve

---

## Current Shadow Code Analysis

### What's There:

1. ✅ Header bottom edge shadow (lines 2801-2812)
   - Starts at `left: 304px` ✓
   - But doesn't account for stopping before header corner

2. ❓ Inner corner shadow (lines 2814-2826)
   - Positioned at `top: 77px, left: 272px` with center at 100% 100%
   - Should place center at (304, 109)
   - Math: box at (272, 77) + 32px = center at (304, 109) ✓
   - BUT: Uses `transparent 24px` which might not be visible enough

3. ✅ Sidebar right edge shadow (lines 2828-2839)
   - Starts at `top: 109px` ✓
   - Ends at `bottom: 24px` ✓

4. ❓ Sidebar bottom-right corner shadow (lines 2841-2853)
   - Uses `bottom: -8px, left: 248px`
   - Uses `radial-gradient(circle at 80% 0%, ...)`
   - This positioning seems off

5. ❌ Header bottom-right corner shadow
   - **MISSING** - No shadow for the header's corner at the right edge

---

## Issues Identified

### Issue 1: Header's Bottom-Right Corner Has No Shadow
The header extends full width and has a 24px rounded corner at the far right. There's no shadow element for this corner.

### Issue 2: Inner Corner Shadow May Be Too Subtle
The radial gradient may not be creating visible shadow. Need to verify the gradient is correct.

### Issue 3: Sidebar Bottom Corner Shadow Positioning
The positioning with `bottom: -8px` and `left: 248px` with `circle at 80% 0%` is confusing and likely wrong.

---

## Correct Shadow Implementation

### Shadow Visual Guide:

```
Shadow appears OUTSIDE the L-frame edges, casting into the content area:

                                                    ░░░
Header ─────────────────────────────────────────╮░░░
                                                │░
        ╔════════════════════════════════════╗░░│░  ← Shadow wraps corner
        ║                                    ║ ░│
     ░░░║                                    ║  │
    ░░╲ ║      CONTENT AREA                  ║  │
   ░░  ╲║                                    ║  │
  ░░    ║                                    ║  │
Sidebar ║                                    ║  │
  ░░    ║                                    ║  │
   ░░╭──╜                                    ║  │
    ░░  ← Shadow wraps sidebar corner        ║  │
     ░░                                      ║  │
```

### Radial Gradient Math for Corners:

**For a CONVEX corner (like header's bottom-right or sidebar's bottom-right):**
- Shadow appears OUTSIDE the curve
- Gradient: solid inside curve radius → transparent outside

**For a CONCAVE corner (like inner corner):**
- Shadow appears on the INSIDE of the curve (in content area)
- Gradient: transparent inside curve radius → solid outside → transparent further out

---

## Test Plan

1. Add debug colors to each shadow element
2. Verify positioning matches L-frame edges
3. Ensure gradients face correct direction
4. Check z-index layering

---

## Fix Attempt Log

### Attempt 1: 2026-01-28
**Changes made:**
1. Rewrote all 5 shadow elements with corrected positioning
2. Added header bottom-right corner shadow (was missing)
3. Fixed inner corner shadow math - box at (274, 79) so center lands at (304, 109)
4. Fixed sidebar bottom corner - positioned at (256, bottom) with circle at 0% 0%
5. Used consistent shadow colors: rgba(0,0,0,0.2) → rgba(0,0,0,0.1) → transparent
6. Reduced shadow width from 8px to 6px for subtler effect

**Shadow positioning logic:**
- For CONVEX corners (header BR, sidebar BR): `circle at 0% 0%` with box positioned so top-left = corner center
- For CONCAVE corner (inner): `circle at 100% 100%` with box positioned so bottom-right = curve center (304, 109)
- For straight edges: simple linear gradients

**Result:** [TESTING]
**Issues remaining:** [TO BE DETERMINED]
