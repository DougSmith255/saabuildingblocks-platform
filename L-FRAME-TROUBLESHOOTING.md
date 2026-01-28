# L-Frame Inner Corner Troubleshooting

## The Goal
Create an L-shaped frame (header + sidebar) with a smooth rounded inner corner at the junction point (280px, 85px).

## Failed Attempts

### Attempt 1: Single overlay with radial-gradient cutout
- **What I did:** Added element at junction with `radial-gradient(circle at 0 0, transparent, solid)`
- **Result:** Created a CUTOUT (concave) instead of adding material
- **Why it failed:** Misunderstood the requirement - user wanted convex curve, not concave

### Attempt 2: Two overlay elements with border-radius
- **What I did:** Red element with border-bottom-right-radius, orange element with border-top-right-radius
- **Result:** Curves pointed OUTWARD into content area from the overlay elements
- **Why it failed:** The overlays were in the wrong position and curved the wrong direction

### Attempt 3: CSS mask to create concave cutout
- **What I did:** Applied mask-image with radial-gradient to header and sidebar to cut out circles
- **Result:** Created holes/cutouts in the L-frame
- **Why it failed:** User wanted to ADD material (convex), not REMOVE material (concave)

### Attempt 4: Split header with border-radius + sidebar border-radius
- **What I did:**
  - Header left (0-280px) with border-bottom-right-radius
  - Header right (280px+) with border-bottom-right-radius
  - Sidebar with border-top-right-radius
- **Result:** GAP at the junction - rounded corners don't meet, leaving dark space
- **Why it failed:** Two elements with border-radius at a corner create a gap, not a seamless connection

## The Actual Problem (as of Attempt 4)

When header-left ends at x=280 with a rounded corner, and sidebar starts at y=85 with a rounded corner, the curves don't fill the junction - they leave a triangular/curved GAP.

```
Header-left ────╮
                 ╲  <- GAP HERE (dark content showing through)
Sidebar ─────────╯
```

## The Solution Needed

Add a CORNER FILLER element that fills the gap between the two rounded corners. This element should:
1. Be positioned at the junction (around 280px, 85px)
2. Be the same color as the L-frame
3. Fill the curved gap left by the two border-radius corners

Options:
A) A small square element at the corner (simple but might show edges)
B) A quarter-circle element that exactly fills the gap
C) Overlap the header and sidebar slightly so there's no gap
D) Use a single SVG path for the entire L-frame shape

## Current State
- Header split into left/right parts
- Sidebar has border-radius on top-right and bottom-right
- GAP exists at inner junction
- Debug colors: purple (header), blue (sidebar)
