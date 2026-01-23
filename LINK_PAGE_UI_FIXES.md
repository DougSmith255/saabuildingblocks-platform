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

Starting fixes one at a time...
