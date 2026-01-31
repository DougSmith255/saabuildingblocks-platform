# Controls Z-Index Troubleshooting — Phone Preview Edit/Reorder Buttons

## Problem
The up/down reorder arrows (left side) and edit pencil buttons (right side) on the phone preview are reported as "behind the phone's thick border." The user can see the phone mockup but the controls appear hidden or obscured by the phone bezel gradient.

## DOM Structure

```
<div class="p-4 flex flex-col items-center overflow-visible">          ← Outer wrapper
  <div class="max-w-[300px] rounded-[2.5rem] p-[6px] relative"        ← Phone bezel (gradient border)
       style="overflow:visible; isolation:isolate;
              background: linear-gradient(145deg, #2a2a2a..#0f0f0f);
              boxShadow: multiple shadows">

    <div class="rounded-[2.25rem] relative"                            ← Inner bezel (z-index: 0)
         style="height:580px; overflow:hidden; z-index:0">
      <div class="absolute inset-0">Star field BG</div>               ← Star field
      <div class="absolute" style="z-index:10">Notch</div>            ← Notch
      <div ref={phoneInnerRef} class="absolute inset-0"               ← Phone inner scroll
           style="overflow-y:auto">
        ...profile, name, bio, buttons (with buttonRowRefs)...
      </div>
    </div>

    <!-- CONTROLS rendered here — siblings of inner bezel, inside phone bezel -->
    <div class="absolute" style="left:-14px; z-index:100">            ← Left controls (up/down)
    <div class="absolute" style="right:-14px; z-index:100">           ← Right controls (edit)
  </div>
</div>
```

## What's Been Tried

| Attempt | z-index | left/right offset | Border/styling | Result |
|---------|---------|-------------------|----------------|--------|
| Original | 10 | -2px | none | Behind border |
| Attempt 2 | 20 | -8px | none | Behind border |
| Attempt 3 | 50 | -12px | gold border + shadow | Behind border (user also disliked gold border) |
| Attempt 4 (current) | 100 | -14px | shadow only, isolation:isolate | **Testing** |

## Current Fix (Attempt 4)

Three-pronged approach:
1. **Phone bezel**: Added `isolation: isolate` to create a new stacking context
2. **Inner bezel**: Added explicit `z-index: 0` to place it below controls
3. **Controls**: `z-index: 100` with `isolation: isolate` on each control wrapper

### Why this should work
- `isolation: isolate` on the phone bezel forces a new stacking context
- Within that context, inner bezel (z:0) and controls (z:100) are compared directly
- Controls at z:100 definitively stack above inner bezel at z:0
- Previously, the inner bezel had `z-index: auto` which can behave differently in some browser rendering engines

## If Still Not Working — Next Steps to Investigate

### 1. Check if portal container clips controls
The mobile portal container at the portal rendering site has `overflow-y: auto`:
```tsx
<div className="min-[1024px]:hidden overflow-y-auto" style={{ height: '...' }}>
  {renderPreviewButtonLinksCard(false, true, true)}
</div>
```
When `overflow-y` is non-visible, browsers compute `overflow-x` as `auto` too (CSS spec). This could clip controls that extend beyond the container's bounds. The controls at `left: -14px` position OUTSIDE the phone bezel, but are still INSIDE the portal container's bounds (phone is centered with ~20px margin from container edge), so this shouldn't clip.

**Fix if needed:** Add `overflow: visible` to the portal container, or move controls further inward.

### 2. Check if controls render at all
Add a temporary bright red background to controls:
```tsx
background: 'red',
```
If still not visible, the issue isn't z-index — the controls aren't rendering (check `buttonPositions` state).

### 3. Check buttonPositions state
The controls guard at the IIFE:
```tsx
if (!attachRefs || Object.keys(buttonPositions).length === 0) return null;
```
If `buttonPositions` is empty, controls don't render at all. This happens when:
- No custom buttons exist (default "About My eXp Team" is excluded from controls)
- `phoneInnerRef.current` is null when useLayoutEffect runs
- `buttonRowRefs` aren't populated

**Debug:** Add `console.log('buttonPositions:', buttonPositions)` inside the IIFE.

### 4. Move controls OUTSIDE the phone bezel entirely
If all z-index approaches fail, restructure DOM:
```tsx
<div className="relative"> {/* New wrapper */}
  <div className="phone-bezel">
    <div className="inner-bezel">...phone content...</div>
  </div>
  {/* Controls as siblings of bezel, not children */}
  <div className="absolute" style="left: bezelOffset - 14px; z-index: 100">
    ...controls...
  </div>
</div>
```
This removes any stacking context issues since controls would be at the same DOM level as the bezel.

### 5. Check for CSS that creates unexpected stacking contexts
Properties that create stacking contexts:
- `transform` (any value)
- `filter` (any value including drop-shadow)
- `opacity` < 1
- `backdrop-filter`
- `will-change` (certain values)
- `contain: paint` or `contain: layout`

Check if any ancestor between the controls and the viewport has one of these.

## File Locations
- Phone bezel + controls: `packages/public-site/app/agent-portal/page.tsx` ~line 12324
- Controls IIFE: ~line 12990
- Button position calculation: ~line 10120 (useLayoutEffect)
- Mobile portal: ~line 13340 (createPortal into #mobile-link-preview-slot)
