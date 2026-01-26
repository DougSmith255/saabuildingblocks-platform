# Link Page UI Fixes Required

**Reference Image:** https://wp.saabuildingblocks.com/wp-content/uploads/2026/01/Screenshot-2026-01-23-092043.png

---

## Detailed Reference Analysis

### 1. Profile Card
- Profile image is LARGER (~60-70px diameter)
- "Upload Photo" button is gold/yellow rounded
- B&W / Color toggle buttons

### 2. Style Card
- Purple sparkle icon with "Style" header
- Icon Style: "Light" | "Dark" (Dark selected = gold background)
- Button Weight: "Bold" | "Regular" (Bold selected = gold background)
- Font: "Synonym" | "Taskor" (Synonym selected = gold background)
- **All selector buttons should be BOLD SYNONYM font**

### 3. Contact Card
- Purple envelope icon with "Contact" header
- Show Call Button / Show Text Button - gold checkmarks

### 4. Preview / Button Links Card (Phone)
- Phone is TALLER - proper iPhone proportions
- Profile photo has GOLD BORDER (changes with accent color)
- **"YOUR NAME" uses:**
  - Taskor font with ALT GLYPHS (stylized characters)
  - H1 GLOW EFFECT (gold glow)
  - Centered properly
- Buttons have: up/down arrows | icon | label | edit icon
- **"+ Add Button" should use Synonym font**
- **SAA LOGO is actual styled logo image, NOT just text**
- "Powered by Smart Agent Alliance" below logo
- Phone internals need better centering

### 5. Social Links Card
- **Icon should be PEOPLE/CHAIN icon, NOT Facebook icon**
- "0/6 max" counter
- Custom 1 and Custom 2 have "+" buttons (not overflowing)

### 6. Page Actions Card
- **MISSING BUTTONS - should have 4:**
  1. "ACTIVATE YOUR PAGE" (gold, sparkle icon)
  2. "VIEW PAGE" (dark, eye icon)
  3. "COPY URL" (dark, copy icon)
  4. "DOWNLOAD QR CODE" (dark, download icon)

### 7. Card Styling
- Cards have subtle borders/backgrounds
- Section headers need slight PREMIUM GLOW effect on icons/text

---

## Fixes Checklist

| # | Fix | Status | Priority |
|---|-----|--------|----------|
| 1 | Profile image size - make larger (~60-70px) | DONE | High |
| 2 | Page Actions - add VIEW PAGE and COPY URL buttons | DONE | High |
| 3 | Social Links icon - change to people/chain icon | DONE | High |
| 4 | Phone proportions - make taller (iPhone ratio) | DONE | High |
| 5 | Phone centering - center all internal elements | DONE | High |
| 6 | Name styling - Taskor font + alt glyphs + H1 glow | DONE | High |
| 7 | Profile border in phone - use accent color | DONE | Medium |
| 8 | SAA logo - use actual logo SVG, not text | DONE | Medium |
| 9 | Add Button text - use Synonym font | DONE | Medium |
| 10 | Selector buttons - bold Synonym font | DONE | Medium |
| 11 | Custom links overflow - fix spacing | DONE | Medium |
| 12 | Section header glow - add premium glow to icons/titles | DONE | Low |
| 13 | Card borders/styling - subtle premium borders | DONE | Low |

---

## Implementation Notes

### For Name H1 Glow Effect
```css
text-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3);
```

### For Section Header Glow
```css
filter: drop-shadow(0 0 4px currentColor);
```

### Phone Proportions (iPhone ratio)
- Width: ~180px
- Height: ~380px (ratio ~2.1:1)

### SAA Logo
- Should be the actual SAA logo SVG/image
- Gold color (#ffd700)
- Stylized "SAA" letters

---

## Current Progress

Phase 1: Completed (13 fixes)
Phase 2: Completed (8 fixes)
Phase 3: Completed (9 fixes - UI Polish)
Phase 4: Completed (9 fixes - Final Polish)
Phase 5: Completed (7 fixes - Final UI Refinements)
Phase 6: In Progress (11 fixes - Layout & Functionality)

---

## Phase 2 Fixes (New Issues)

| # | Fix | Status | Details |
|---|-----|--------|---------|
| 1 | Bold/Regular is for LINK BUTTONS not H1 | DONE | nameWeight now controls button font-weight, H1 always bold |
| 2 | Name H1 styling - copy from old link page | DONE | Added 3D transform, white outline, gold glow, drop-shadow from slug.js |
| 3 | SAA logo gradient changes with accent color | DONE | Logo gradient dynamically creates lighter/darker variants from accent |
| 4 | Profile image border - hard line outline | DONE | Changed from border-white/20 to solid border-white |
| 5 | Preview buttons - same width, centered | DONE | Fixed container widths for arrows and edit button placeholders |
| 6 | Edit/position buttons always visible | DONE | Removed opacity-0 group-hover:opacity-100 classes |
| 7 | Add/Edit UI redesign | DONE | Both UIs now use styled button with inline label input, URL + action row below |
| 8 | Phone screen star background | DONE | Added CSS radial gradient star pattern background |

### Fix #7 Detailed Requirements

**Add Button UI:**
- The button itself becomes the input field
- Label input centered inside the button (like active buttons look)
- "+" icon on the left where normal icons go
- URL input appears BELOW the button in a popup area
- Accept, Delete, Cancel buttons in same row as URL input (to the right)

**Edit Button UI:**
- Same concept as Add Button UI
- Existing label shows in button, becomes editable
- Current icon shows, can be changed
- URL input below with same accept/delete/cancel row

**Both UIs should have identical styling for the popup area**

---

## Phase 3 Fixes (UI Polish)

| # | Fix | Status | Details |
|---|-----|--------|---------|
| 1 | Move controls to phone border | DONE | Up/down arrows and edit button moved outside phone screen area using absolute positioning (-left-8, -right-8) |
| 2 | Icon picker opens on click | DONE | Changed showIconPicker from boolean to string (linkId or 'new-link') to track which picker is open |
| 3 | Social links populate in preview | DONE | Added dynamic social link circles and Call/Text/Email contact buttons to preview |
| 4 | Pill settings animated slide | DONE | Added absolute positioned sliding indicator with CSS transform transitions |
| 5 | Button reorder physical animation | DONE | Added animatingSwap state tracking, buttons now physically animate positions when reordered |
| 6 | Label input centered in button | DONE | Icon positioned absolutely, input uses w-full text-center |
| 7 | Remove cancel button from edit UI | DONE | Removed unnecessary cancel button |
| 8 | Download QR Code disabled until active | DONE | Added disabled state with opacity-40 and cursor-not-allowed |
| 9 | Profile border uses accent color | DONE | Changed from border-white to dynamic borderColor: linksSettings.accentColor |

---

## Phase 4 Fixes (Completed)

| # | Fix | Status | Details |
|---|-----|--------|---------|
| 1 | Button swap animation flash | DONE | Used double requestAnimationFrame to delay clearing animatingSwap state until after React re-render |
| 2 | Custom social link + icons open icon library | DONE | Added onClick handlers to Custom 1/2 buttons with icon picker dropdown |
| 3 | B&W filter only affects image, not border | DONE | Separated profile image into inner div with grayscale filter, border stays on parent |
| 4 | Color image missing for profile | DONE | Added profile_image_color_url to PageData, updated getProfileImageUrl to use stored color URL, added event listener for color image updates |
| 5 | Profile uploader works in all 4 locations | DONE | Fixed handleProfilePictureClick to trigger fileInputRef.current.click() |
| 6 | Up/down and edit buttons z-index | DONE | Added z-20 class and shadow-lg to control buttons |
| 7 | Contact buttons full width with icon-only mode | DONE | Added showIconsOnly = buttonCount > 1 logic, icons centered when 2-3 buttons |
| 8 | S logo white/black versions | DONE | Used existing /icons/s-logo-offwhite.png and /icons/s-logo-dark.png based on iconStyle |
| 9 | Change "Learn About eXp" to "About my Team" | DONE | Updated button text using replace_all |

---

## Phase 5 Fixes (Completed)

| # | Fix | Status | Details |
|---|-----|--------|---------|
| 1 | Button swap animation - both flash | DONE | Fixed by clearing animation BEFORE updating order so React batches state updates |
| 2 | Up/down and edit buttons z-index | DONE | Changed to z-50, phone bezel overflowX: 'visible' |
| 3 | Add Button + icon plain symbol | DONE | Replaced circle+icon with simple `<span>+</span>` |
| 4 | Icon library overlay | DONE | Changed z-index to z-[100], removed overflow-hidden from card |
| 5 | Contact buttons full width | DONE | Moved contact buttons outside centered flex container |
| 6 | Phone settings checkmarks functional | DONE | Changed rendering to use formData.show_call_button instead of linksSettings |
| 7 | Help button pixel-art redesign | DONE | Implemented exact pixel-art CSS with style jsx, premium glass popup |

### Fix #7 - Help Button HTML & CSS (COPY EXACTLY)

**HTML Structure:**
```html
<div class="button">
  <button name="checkbox" type="button"></button>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>
```

**CSS (copy character for character):**
```css
.button {
  --stone-50: #fafaf9;
  --stone-800: #292524;
  --yellow-300: #fde047;
  --yellow-400: #facc15;
  --yellow-500: #eab308;
  --black-25: rgba(0, 0, 0, 0.25);

  position: relative;
  display: block;
  width: 4rem;
  height: 4rem;
  cursor: pointer;

  & > button {
    cursor: pointer;
    display: inline-block;
    height: 100%;
    width: 100%;
    appearance: none;
    border: 2px solid var(--stone-800);
    border-radius: 0.25rem;
    background-color: var(--yellow-400);
    outline: 2px solid transparent;
    outline-offset: 2px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--yellow-300);
    }

    &:checked {
      background-color: var(--stone-800);
      border-color: var(--stone-800);

      &:hover {
        background-color: #44403c;
      }
    }

    &:active {
      outline-color: var(--stone-800);
    }

    &:focus-visible {
      outline-color: var(--stone-800);
      outline-style: dashed;
    }
  }

  & > span:nth-child(2) {
    position: absolute;
    inset: 3px;
    pointer-events: none;
    background-color: var(--yellow-400);
    border-bottom: 2px solid var(--black-25);
    transition: transform 75ms;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: radial-gradient(
          rgb(255 255 255 / 80%) 20%,
          transparent 20%
        ),
        radial-gradient(rgb(255 255 255 / 100%) 20%, transparent 20%);
      background-position:
        0 0,
        4px 4px;
      background-size: 8px 8px;
      mix-blend-mode: hard-light;
      opacity: 0.5;
      animation: dots 0.5s infinite linear;
    }
  }

  & > span:nth-child(3) {
    position: absolute;
    pointer-events: none;
    inset: 0;

    &::before {
      content: "";
      width: 0.375rem;
      height: 0.375rem;
      position: absolute;
      top: 0.25rem;
      left: 0.25rem;
      background-color: var(--stone-800);
      border-radius: 0.125rem;
      box-shadow:
        3.125em 0 var(--stone-800),
        0 3.125em var(--stone-800),
        3.125em 3.125em var(--stone-800);
    }
  }

  & > span:nth-child(4) {
    position: absolute;
    pointer-events: none;
    inset: 0;
    filter: drop-shadow(0.25em 0.25em 0 rgba(0, 0, 0, 0.2));
    transition: all 75ms;

    &::after {
      content: "";
      width: 0.25rem;
      height: 0.25rem;
      position: absolute;
      top: 0.875rem;
      left: 1rem;
      border-radius: 0.0625px;
      background-color: var(--stone-800);
      box-shadow:
        0.75em 2em var(--stone-800),
        1em 2em var(--stone-800),
        0.75em 1.75em var(--stone-800),
        1em 1.75em var(--stone-800),
        0.75em 1.25em var(--stone-800),
        1em 1.25em var(--stone-800),
        0.75em 1em var(--stone-800),
        1em 1em var(--stone-800),
        1em 0.75em var(--stone-800),
        1.5em 0.75em var(--stone-800),
        1.25em 0.75em var(--stone-800),
        1.25em -0.25em var(--stone-800),
        1.5em 0em var(--stone-800),
        1.25em 0.5em var(--stone-800),
        1.5em 0.5em var(--stone-800),
        1.25em 0.25em var(--stone-800),
        1.5em 0.25em var(--stone-800),
        1.25em 0 var(--stone-800),
        1em -0.25em var(--stone-800),
        0.75em -0.25em var(--stone-800),
        0.5em -0.25em var(--stone-800),
        0.25em -0.25em var(--stone-800),
        0.25em 0 var(--stone-800),
        0 0.25em var(--stone-800),
        0 0.5em var(--stone-800),
        0.25em 0.25em var(--stone-800),
        0.25em 0.5em var(--stone-800);
    }
  }

  & > span:nth-child(5) {
    position: absolute;
    background-color: var(--yellow-400);
    border: 2px solid var(--stone-800);
    border-radius: 0.75rem;
    pointer-events: none;
    z-index: -1;
    inset: 0.5rem 1.5rem;
    box-shadow:
      7px 0 0 0 var(--stone-800),
      inset 0 2px 0 0 var(--yellow-300),
      inset 0 -2px 0 0 var(--yellow-500);
    transition: all 0ms cubic-bezier(0, 0.5, 0.4, 1);
  }

  & button:active ~ span:nth-child(5) {
    transform: translateY(-200%);
    transition-duration: 200ms;
    opacity: 0;
  }

  & button:hover ~ span:nth-child(4) {
    filter: drop-shadow(0.125em 0.125em 0 rgba(0, 0, 0, 0.2));
  }
}

@keyframes dots {
  0% {
    background-position:
      0 0,
      4px 4px;
  }
  100% {
    background-position:
      8px 0,
      12px 4px;
  }
}

@media (prefers-color-scheme: dark) {
  .button {
    & button:active,
    & button:focus-visible {
      outline-color: var(--yellow-400);
    }
  }
}
```

**Popup Redesign Notes:**
- Redesign to match premium glass with yellow highlights style
- Use existing glass styling patterns from the site

---

## Phase 6 Fixes (Current)

**Reference Image:** https://wp.saabuildingblocks.com/wp-content/uploads/2026/01/Screenshot-2026-01-23-140203.png

| # | Fix | Status | Details |
|---|-----|--------|---------|
| 1 | Question mark positioning | DONE | Already correctly positioned with `fixed bottom-20 right-4` |
| 2 | Custom social link fields not working | DONE | Added customSocialLinks to socialIcons array in preview |
| 3 | Activate Your Page button not working | DONE | Removed hasUnsavedChanges from disabled check, renamed to "ACTIVATE MY PAGE" |
| 4 | Button controls z-index (AGAIN) | DONE | Changed z-50 to z-[200], added overflow:visible to phone outer container |
| 5 | Contact button spacing | DONE | Changed `gap-1.5 mt-3 mb-1.5` to `gap-1 mt-1.5 mb-1` |
| 6 | Button swap animation glitch | DONE | Changed timeout to 280ms, update order before clearing animation with double RAF |
| 7 | S icon disappearing | DONE | Animation timing fix with proper RAF sequencing |
| 8 | Profile upload notification | PENDING | Remove "cutting out background" notification - just show spinner inside profile image area |
| 9 | Color profile image not hooked up | PENDING | Needs API investigation - color image may not be returning from backend |
| 10 | Profile border always accent color | DONE | Separated image div from border div - filter only affects inner image |
| 11 | Top section layout/spacing analysis | DONE | Removed gap-2 from container, added individual margins: name mt-1.5 mb-2, social mt-1, bio mt-1.5 mb-1 |

---

### Fix #11 - Screenshot Analysis

**Current Layout (top to bottom):**
1. Profile image (with gold border)
2. Name "DOUG SMART" (stylized)
3. Social icons row (Facebook, YouTube, LinkedIn)
4. Bio text (centered, gray)
5. Contact buttons row (Call, Text, Email)
6. Link buttons (Join my Team, About my Team)
7. "+ Add Button"
8. SAA Logo + "Powered by" text

**Observed Issues:**
1. **Large gap between contact buttons and "Join my Team"** - This gap is noticeably larger than the gap between "Join my Team" and "About my Team"
2. **Contact buttons have wide gaps between them** - The Call/Text/Email buttons have significant spacing between each other
3. **Inconsistent vertical rhythm** - Items ABOVE bio (H1, social links) are spread far apart, but bio is SUPER CLOSE to items below (contact buttons)
4. **No minimum spacing when elements removed** - When no social links, bio, or contact buttons exist, the H1 almost touches the main link buttons directly

**Recommended Spacing Fixes:**
- Reduce `gap` between contact buttons (currently looks like gap-1.5, should be gap-1 or smaller)
- Reduce `mt-3 mb-1.5` on contact buttons container - should match button spacing below
- **Tighten spacing above bio** - Reduce gaps between H1 → social icons → bio
- **Add spacing below bio** - Bio needs more breathing room before contact buttons
- **Add minimum margin below name** - When no intermediate elements, ensure H1 has adequate space before link buttons
- Create consistent vertical rhythm throughout the preview section

---

## Phase 7 Fixes (Current)

| # | Fix | Status | Details |
|---|-----|--------|---------|
| 1 | Dashboard profile container border | PENDING | Has glow but NO hard visible border line - see TROUBLESHOOTING section below |
| 2 | Edit Profile SlidePanel 2-column layout | PENDING | Desktop has scrollbar but shouldn't need to scroll - use 2 columns |
| 3 | Tab scrollable space excess | PENDING | All tab UIs fit above fold but page still scrolls to empty space |
| 4 | Star gradient direction | PENDING | Should go from selected color to LIGHTER variant (not darker) |
| 5 | Down arrow switch disabled state | PENDING | Still not working on page load - see TROUBLESHOOTING section in code |
| 6 | Default button inner color transparency | PENDING | Make slightly more transparent (currently 85% opacity) |
| 7 | Social links and bio missing from preview | PENDING | Shows on actual link page but not in preview section |
| 8 | Color switch threshold unification | PENDING | Button text, S icon, contact icons all switch at different luminance thresholds |

---

## TROUBLESHOOTING: Dashboard Profile Image Container Border (Issue #1)

**ISSUE (Reported 6+ times):**
The profile image CONTAINER in the main dashboard sidebar is missing a hard visible border line.
Currently only shows a subtle glow but no actual border.

**LOCATIONS:**

1. **Desktop Sidebar Profile Container** - `page.tsx` line ~2564-2569:
```tsx
<div
  className="rounded-xl p-4"
  style={{
    border: `1px solid ${dashboardAccentColor}30`,  // <-- 30% opacity = barely visible
    boxShadow: `0 0 20px ${dashboardAccentColor}10, inset 0 1px 0 rgba(255,255,255,0.03)`,
  }}
>
```

2. **Desktop Sidebar Profile IMAGE** - `page.tsx` line ~2575-2579:
```tsx
<button
  className="relative group w-[130px] h-[130px] rounded-full overflow-hidden border-[3px] transition-colors mb-3 bg-white/5"
  style={{
    borderColor: dashboardAccentColor,  // <-- THIS has hard border (3px)
    boxShadow: `0 0 16px ${dashboardAccentColor}40`,
  }}
>
```

3. **Mobile Profile Section** - Need to locate similar pattern

**CURRENT STATE:**
- Profile IMAGE button (line 2575): Has `border-[3px]` with `borderColor: dashboardAccentColor` ✓ CORRECT
- Profile CONTAINER div (line 2564): Has `border: 1px solid ${dashboardAccentColor}30` ✗ TOO SUBTLE

**THE PROBLEM:**
The CONTAINER has `30` appended to the hex color which means 30% opacity (actually hex 30 = 48/255 = 18.8% opacity).
This makes the border nearly invisible on dark backgrounds.

**PROPOSED FIX:**
Change the container border from 30% to higher opacity (60-80%):
```tsx
// BEFORE (barely visible):
border: `1px solid ${dashboardAccentColor}30`

// AFTER (visible hard border):
border: `1px solid ${dashboardAccentColor}80`  // or 60 for softer
```

**WHY THIS KEEPS GETTING MISSED:**
1. The profile IMAGE has a proper border, so it looks "fixed" at first glance
2. The CONTAINER border is so subtle it's easy to miss
3. The glow effect creates an illusion of a border
4. Code search for "border" returns many results, easy to fix wrong one

**VERIFICATION:**
After fix, the outer rounded container should have a clearly visible border line (not just glow).

---

## TROUBLESHOOTING: Star Background Gradient Direction (Issue #4)

**CURRENT CODE** (`page.tsx` lines 9385-9390):
```tsx
const bgRgb = hexToRgb(linksSettings.backgroundColor || '#ffd700');
// Very dark version for top of gradient (15% of the color)
const bgGradientTop = `rgb(${Math.round(bgRgb.r * 0.15)}, ${Math.round(bgRgb.g * 0.15)}, ${Math.round(bgRgb.b * 0.15)})`;
// Very dark version for bottom (5% of the color, almost black but with hue)
const bgGradientBottom = `rgb(${Math.round(bgRgb.r * 0.05)}, ${Math.round(bgRgb.g * 0.05)}, ${Math.round(bgRgb.b * 0.05)})`;
```

**APPLIED AT** (`page.tsx` line ~11063):
```tsx
radial-gradient(at center bottom, ${bgGradientTop} 0%, ${bgGradientBottom} 100%)
```

**CURRENT BEHAVIOR:**
- Top: 15% of selected color (very dark)
- Bottom: 5% of selected color (almost black)
- Result: Dark to darker gradient

**USER WANTS:**
- One end: The selected background color itself
- Other end: A LIGHTER version of the selected color
- Result: Color to lighter-color gradient (NOT darker)

**PROPOSED FIX:**
```tsx
// Lighten color by mixing with white
const lightenColor = (r: number, g: number, b: number, amount: number) => ({
  r: Math.round(r + (255 - r) * amount),
  g: Math.round(g + (255 - g) * amount),
  b: Math.round(b + (255 - b) * amount),
});

const bgRgb = hexToRgb(linksSettings.backgroundColor || '#ffd700');
const lighterBg = lightenColor(bgRgb.r, bgRgb.g, bgRgb.b, 0.4); // 40% lighter

// Selected color at bottom, lighter version at top
const bgGradientTop = `rgb(${lighterBg.r}, ${lighterBg.g}, ${lighterBg.b})`;
const bgGradientBottom = `rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})`;
```

---

## TROUBLESHOOTING: Color Switch Threshold Unification (Issue #8)

**CURRENT STATE - Multiple different thresholds:**

1. **isColorDark function** (line ~9355-9369):
   - Formula: `luminance = 0.299*r + 0.587*g + 0.114*b` (r,g,b are 0-255)
   - Threshold: `luminance < 140`
   - Used for: Button text color, general dark/light detection

2. **getButtonIconColor function** (line ~9393-9401):
   - Formula: Same but r,g,b normalized to 0-1 (divided by 255)
   - Threshold: `luminance < 0.6`
   - Used for: Button icons (S logo, link icons)

**THRESHOLD COMPARISON:**
- isColorDark: 140/255 = **0.549** (switches at ~55% luminance)
- getButtonIconColor: **0.6** (switches at 60% luminance)

**RESULT:**
Button text switches at 55% luminance, but icons switch at 60% luminance.
Colors between 55-60% luminance will have mismatched text/icon colors.

**PROPOSED FIX:**
Unify to single threshold. Use 0.55 (140/255) for all:
```tsx
const LUMINANCE_THRESHOLD = 0.55; // Single source of truth

const isColorDark = (hexColor: string): boolean => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < LUMINANCE_THRESHOLD;
};

// Remove getButtonIconColor, use isColorDark instead
const buttonIconColor = isColorDark(linksSettings.accentColor) ? '#ffffff' : '#1a1a1a';
```

---

## TROUBLESHOOTING: Down Arrow Disabled State (Issue #5)

**See existing troubleshooting section in code at line ~9235**

**SUMMARY:**
- Disabled condition exists at line ~11764: `disabled={allLinkIds[index + 1] === 'learn-about' || index === allLinkIds.length - 1}`
- BUT moveLink function (line ~11700) only checks: `currentIndex < allLinkIds.length - 1`
- Missing check: `allLinkIds[currentIndex + 1] !== 'learn-about'`

**FIX NEEDED in moveLink function:**
```tsx
// BEFORE (line ~11700):
} else if (direction === 'down' && currentIndex < allLinkIds.length - 1) {

// AFTER:
} else if (direction === 'down' && currentIndex < allLinkIds.length - 1 && allLinkIds[currentIndex + 1] !== 'learn-about') {
```

---

## Phase 6 Completed Fixes (Mark as DONE)

Based on user feedback, marking fixes that were not mentioned as issues:
- Fix #1-7: All marked DONE in table above
- Fix #8, #9: Still PENDING (profile upload notification, color image)
- Fix #10, #11: Marked DONE

