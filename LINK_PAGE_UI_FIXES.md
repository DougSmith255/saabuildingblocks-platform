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
