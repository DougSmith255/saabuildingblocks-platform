# GlassPanel Backdrop Blur Issue

## Status: OPEN
Created: 2026-02-05

---

## Problem Summary

On **both the home page and the about-exp page**, the `backdrop-filter: blur(2px)` on GlassPanel sections behaves inconsistently. Some sections show the star background blurred through the glass (correct), while others appear as flat dark panels with no visible blur effect.

---

## What the User Sees

### Home Page (`/`)
- **Bottom 3 glass sections** — blur works correctly (stars visible through glass)
- **Top glass sections** — no visible blur, appear as solid dark backgrounds

### About eXp Page (`/about-exp-realty`)
- **StatsBar** (GlassPanel champagne) — no visible blur
- **Income & Ownership** (GlassPanel expBlueCrosshatch) — blur only appears when scrolled to the Revenue Share section at the bottom of the card, but NOT at the top of the same card. This makes no sense since it's one GlassPanel wrapping the entire section.

---

## Technical Investigation

### How the Blur Works

The star background canvas (`StarBackgroundCanvas.tsx`) renders:
- `.star-gradient` div at `z-index: -2` (position: fixed) — radial gradient
- `.star-canvas` canvas at `z-index: -1` (position: fixed) — animated star particles

The GlassPanel component applies:
```css
backdrop-filter: blur(2px);
background: linear-gradient(...very low opacity, ~0.04-0.06...);
```

The `backdrop-filter` should blur whatever is visually behind the element — in this case, the fixed star canvas. This should be uniform across the entire panel.

### Root Cause Analysis

**Two separate issues are at play:**

#### Issue A: Opaque Internal Layers Blocking Stars (Home Page)

Some sections add opaque background layers INSIDE the GlassPanel that sit on top of the glass background, hiding the blurred stars entirely:

| Section | GlassPanel Variant | Internal Layer | Opacity | Stars Visible? |
|---|---|---|---|---|
| ValuePillarsTab | champagne | `rgba(22,22,22,0.94)` to `rgba(15,15,15,0.97)` gradient | **94-97%** | NO — fully blocked |
| ProvenAtScale | champagne | Wolf pack background image (object-cover, masked to ~75% center) | ~60-75% center | PARTIAL — mostly blocked |
| WhyOnlyAtExp | inline (not GlassPanel) | No extra layer, but `rgba(255,190,0,0.032)` glass bg | 3.2% | YES — should work |
| MeetTheFounders | marigoldCrosshatch | No extra opaque layer | 4% | YES — works correctly |
| BuiltForFuture | no GlassPanel | Cards have dark gradient overlays | Varies | Varies |
| WatchAndDecide | champagne (via page.tsx) | No extra opaque layer | 5% | YES — works correctly |

**Conclusion:** ValuePillarsTab is the worst offender — it wraps content in GlassPanel champagne for the glass texture/border, then immediately covers it with a 94-97% opaque dark gradient, defeating the entire purpose of the backdrop blur.

#### Issue B: Partial Blur Within Single GlassPanel (About-Exp Page)

The Income & Ownership section is one `<GlassPanel variant="expBlueCrosshatch">` wrapping the entire section. The backdrop-filter should apply uniformly to the whole panel. But the user sees blur only on the bottom half (Revenue Share area).

**Possible causes:**
1. **Browser rendering optimization** — Chrome is known to only rasterize backdrop-filter for the visible viewport portion of large elements. As you scroll, the filter re-renders for the currently visible area. This could cause the top portion to appear un-blurred if it was rendered before stars populated that area.
2. **Content inside the panel** — The three income stream CyberCards and the "1 vs 3" comparison cards all have their own dark backgrounds (`rgba(35,35,35,0.85)`, CyberCard default backgrounds) that locally hide the stars, while the Revenue Share spotlight has a more transparent `rgba(0,40,80,0.3)` background + its own RisingParticles canvas that adds visual depth.
3. **Star density** — Stars at the top of the viewport vs bottom may have different visual density due to the parallax animation, making blur more or less noticeable.

---

## Affected Files

| File | Role |
|---|---|
| `packages/shared/components/saa/backgrounds/GlassPanel.tsx` | GlassPanel component — `backdrop-filter: blur(2px)` |
| `packages/public-site/components/shared/StarBackgroundCanvas.tsx` | Star canvas at z-index: -1 (fixed) |
| `packages/public-site/app/components/sections/ValuePillarsTab.tsx` | Lines 91-97: opaque overlay `rgba(22,22,22,0.94-0.97)` |
| `packages/public-site/app/components/sections/ProvenAtScale.tsx` | Lines 64-82: wolf pack image cover |
| `packages/public-site/app/components/sections/WhyOnlyAtExp.tsx` | Lines 38-53: inline GLASS_STYLES with `blur(2px)` |
| `packages/public-site/app/about-exp-realty/page.tsx` | Line 1238: `GlassPanel variant="expBlueCrosshatch"` |

---

## Fix Strategy

### Fix A: Remove Opaque Internal Layers

**ValuePillarsTab** (primary offender):
- Remove the extra opaque gradient overlay at lines 91-97
- The GlassPanel champagne background is already designed to be the section background
- If more darkness is needed, increase the GlassPanel's `opacity` prop instead of adding an opaque layer on top

**ProvenAtScale**:
- The wolf pack image is decorative — could reduce its coverage or add transparency
- Or accept that this section intentionally features the image over the glass effect

### Fix B: Investigate Partial Blur (About-Exp Page)

Options to test:
1. **Increase blur value** — Try `blur(4px)` or `blur(6px)` to make the effect more visible everywhere
2. **Add `will-change: backdrop-filter`** to GlassPanel to hint the browser to pre-render
3. **Split tall GlassPanels** — If the Income & Ownership section is too tall for Chrome's backdrop-filter rendering, consider splitting into smaller wrapped sections
4. **Test in multiple browsers** — Confirm if this is Chrome-specific rendering behavior

---

## Previous Fix History

- Breathing animation removed from `expBlueCrosshatch` (only `expBlue` gets it now)
- `backdropFilter` standardized to `blur(2px)` across all GlassPanel variants
- Star particles no longer disappear behind GlassPanel (was caused by excessive blur values)
