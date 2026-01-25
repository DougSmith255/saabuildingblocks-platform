# Pixel Button Question Mark Centering - Troubleshooting Log

**Created:** 2026-01-25
**Issue:** Question mark inside mobile pixel help buttons is not centering properly within the square container

---

## Current State

**File:** `/packages/public-site/app/agent-portal/page.tsx`
**CSS Location:** Lines ~12520-12530 (`.pixel-help-mobile > span:nth-child(4)::after`)

**Current CSS:**
```css
.pixel-help-mobile > span:nth-child(4)::after {
  width: 0.3rem !important;
  height: 0.3rem !important;
  transform: scale(0.58);
  transform-origin: center center;
  top: 0.45rem !important;
  left: 0.55rem !important;
}
```

---

## Attempt History

### Attempt 1 (Initial)
- **Change:** `transform: scale(0.625)` with `transform-origin: top left`
- **Result:** ❌ Not centered

### Attempt 2
- **Change:** `transform: scale(0.625) translate(-10%, 5%)` with `transform-origin: center center`
- **Result:** ❌ Not centered

### Attempt 3
- **Change:** Increased pixel size to 0.3rem, scale to 0.68, translate to `translate(-8%, 3%)`
- **Result:** ❌ Not centered

### Attempt 4 (Current - 2026-01-25)
- **Change:**
  - `transform: scale(0.58)` (no translate)
  - `transform-origin: center center`
  - `top: 0.45rem !important`
  - `left: 0.55rem !important`
- **Result:** ❌ Still not centered (user confirmed)

---

## Analysis

The question mark is created using CSS box-shadow from a single small element. The positioning is complex because:
1. The base element has `position: absolute` with `top` and `left` values
2. The question mark shape is built from multiple box-shadows offset from that base
3. Scaling affects the entire shape including the shadow offsets
4. The mobile button is 2.5rem × 2.5rem (40px × 40px)

### Desktop Values (for reference)
```css
/* Desktop (4rem = 64px button) */
span:nth-child(4)::after {
  width: 0.25rem;
  height: 0.25rem;
  top: 0.875rem;    /* 14px */
  left: 1rem;       /* 16px */
  /* No transform/scale */
}
```

### Mobile Button Size
- Button: 2.5rem = 40px
- Ratio: 40/64 = 0.625

---

### Attempt 5 (2026-01-25) - Font-size scaling approach

**Key Insight:** The box-shadows use `em` units which are relative to font-size, NOT affected by CSS transform scale.

**Strategy:** Set a smaller `font-size` on the parent span so the em-based box-shadows scale down proportionally.

**Changes:**
```css
.pixel-help-mobile > span:nth-child(4) {
  font-size: 10px !important;
}
.pixel-help-mobile > span:nth-child(4)::after {
  width: 0.25rem !important;
  height: 0.25rem !important;
  top: 6px !important;
  left: 8px !important;
  transform: none !important;
}
```

**Calculation:**
- Mobile button: 40px × 40px, center at 20px, 20px
- Question mark with 10px font-size spans ~17.5px wide, ~22.5px tall
- Position: top: 6px, left: 8px to center

**Result:** ⏳ Pending verification

---

## Mobile Header S Icon Issue

**Also reported:** S icon in mobile header still appears wrong

**Current code (line 2297):**
```tsx
src="/icons/s-logo-1000.png"
```

**SAA Support section (line 6259):**
```tsx
src="/icons/s-logo-1000.png"
```

Both use the SAME file path. If they look different, possible causes:
1. Deployment not complete yet
2. Browser caching old version
3. Different styling (size, object-fit, etc.)

**To check:**
- Verify the image file exists at `/public/icons/s-logo-1000.png`
- Compare styling between the two usages
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

---

## Notes

- User has reported this issue 4 times
- Need to get this right on next attempt
