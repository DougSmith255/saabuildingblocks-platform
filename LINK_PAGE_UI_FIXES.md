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
