# Link Page UI Fixes Plan

## Overview
A series of targeted fixes to the Link Page UI before finalizing the constraint-based framework.

---

## Fix List

### 1. Live Preview - Replace with Old Preview
**Status:** [x] Complete
**Issue:** The new preview doesn't match the old one. Buttons layout/design wrong, email/text/phone icons wrong styling, social links not populating.
**Solution:** Delete the new preview component and move the "old" preview into the same location. Wire up existing functions.

---

### 2. Name Styling in Preview
**Status:** [x] Complete
**Issue:** Font and weight settings are affecting the name when only accent color should.
**Solution:** Remove font and nameWeight styling from the preview name - only keep accentColor.

---

### 3. Icon Style & Font Choice Labels
**Status:** [x] Complete
**Issue:** Using Taskor font makes options overflow/cut off (e.g., "TASKOR" gets cut).
**Solution:** Change to body font for these option labels to allow more space.

---

### 4. Social Links Input Min-Width
**Status:** [x] Complete
**Issue:** Inputs are tiny (~20px visible), especially custom link inputs.
**Solution:** Add min-width of at least 100px to all social link input fields.

---

### 5. Activate Button Placement
**Status:** [x] Complete
**Issue:** For laptop/desktop, Activate button should be under Live Preview with QR code.
**Solution:** Move Activate button inside preview container, make it and QR code full-width within that container.

---

### 6. Preview Size & Border
**Status:** [x] Complete
**Issue:** Preview is almost square instead of standard iPhone size. Border is 17px wide.
**Solution:** Make preview standard iPhone aspect ratio. Reduce border to 8-12px.

---

### 7. Button Links Layout
**Status:** [x] Complete
**Issue:** Buttons are side by side instead of stacked vertically.
**Solution:** Change button links to vertical stack layout.

---

### 8. Button Reordering in Preview
**Status:** [x] Complete
**Issue:** Moving buttons in settings doesn't update preview correctly.
**Solution:** Ensure preview respects linkOrder state when rendering buttons.

---

### 9. Draft Indicator & Save Button Logic
**Status:** [x] Complete
**Issue:**
- "Draft" indicator is redundant (Activate button already indicates this)
- Save button showing before activation
**Solution:**
- Remove "Draft" indicator
- Hide Save button before activation
- After activation: confetti animation, button transforms to Save Changes

---

### 10. QR Code Button Height
**Status:** [x] Complete
**Issue:** Download QR Code button was shorter than Activate button.
**Solution:** Changed from `py-2` to `py-2.5` and added `font-bold` to match Activate button styling.

---

### 11. Name Neon Glow Effect
**Status:** [x] Complete
**Issue:** Name in preview was missing the glowing/neon styling from the old preview.
**Solution:** Added textShadow and filter effects using accent color for neon glow effect.

---

### 12. Button Weight Label Rename
**Status:** [x] Complete
**Issue:** "Name Weight" setting was affecting button links but label was misleading.
**Solution:** Renamed label to "Button Weight" and ensured fontWeight applies to button links in preview.

---

### 13. Social/Button Links Text Sizes
**Status:** [x] Complete
**Issue:** Text sizes in Social Links and Button Links sections were tiny (8-9px).
**Solution:** Increased all text sizes to match other sections (10px labels, sm for inputs).

---

### 14. Combine Button Links with Preview
**Status:** [x] Complete
**Issue:** Button Links section was separate from preview, making it hard to visualize changes.
**Solution:**
- Renamed "Live Preview" to "Your Page"
- Moved QR Code + Activate buttons to where Button Links section was (new "Page Actions" section)
- Added button management (add/edit/reorder/delete) directly into the preview column
- Simplified overall layout

---

### 15. Custom Social Link Input Heights
**Status:** [x] Complete
**Issue:** Custom social link inputs had smaller padding than standard social link inputs.
**Solution:** Changed from `py-1` and `text-[10px]` to `py-1.5` and `text-sm`, matching other inputs.

---

### 16. Stack Page Actions Buttons
**Status:** [x] Complete
**Issue:** QR Code and Activate buttons were side by side.
**Solution:** Changed from `flex flex-wrap` to `flex flex-col` and all buttons to `w-full` for vertical stacking.

---

### 17. Larger Preview Phone Size
**Status:** [x] Complete
**Issue:** Preview phone was too small (180px), text not legible.
**Solution:**
- Increased phone width from 180px to 280px
- Used proper iPhone aspect ratio (9:19.5)
- Minimum height of 540px
- Larger profile photo (w-20 h-20)
- Larger name text (text-xl)
- Larger social icons (w-7 h-7)
- Larger contact buttons (py-2, text-xs)
- Larger button links (py-2.5, text-sm)

---

### 18. Rename Preview Section
**Status:** [x] Complete
**Issue:** "Your Page" didn't clearly indicate it's also the button editor.
**Solution:** Renamed to "Preview / Button Links" to clarify dual purpose.

---

### 19. Interactive Button Editing in Preview
**Status:** [x] Complete
**Issue:** Button editing was in a separate section below preview.
**Solution:**
- Added "Add Button" dashed button at bottom of button links in preview
- Clicking reveals inline form with icon picker, label input, URL input
- Checkmark button to confirm addition
- Delete and Cancel buttons for editing mode
- Edit button appears on hover for custom buttons (pencil icon)
- Move up/down arrows appear on hover for all buttons

---

### 20. Move Buttons in Preview
**Status:** [x] Complete
**Issue:** No way to reorder buttons directly in preview.
**Solution:** Added up/down arrow buttons that appear on hover (-left-6 position) for each button.

---

### 21. Edit/Delete Button Interface
**Status:** [x] Complete
**Issue:** Needed edit functionality for custom buttons with delete option.
**Solution:**
- Edit button (pencil icon) appears on hover for custom links (-right-6 position)
- Clicking edit populates the add form with existing values
- Delete button shown inside edit form (red styling)
- Cancel button to exit edit mode

---

### 22. Page Actions Single Column
**Status:** [x] Complete
**Issue:** Page Actions section was spanning multiple columns instead of just one.
**Solution:** Removed `link-section-wide` class from Page Actions section.

---

### 23. Preview Container Overflow Fix
**Status:** [x] Complete
**Issue:** Move buttons (up/down arrows) and edit buttons were cut off on sides of preview.
**Solution:**
- Changed preview container from `overflow-hidden` to `overflow-visible`
- Added `minWidth: '340px'` to preview container
- Added `px-8` padding to phone container for external button controls

---

### 24. Phone Mockup Sizing Fix
**Status:** [x] Complete
**Issue:** Phone screen was overflowing the phone case border.
**Solution:** Reduced phone mockup width from 280px to 260px so screen fits within case.

---

### 25. Add Button Form Greyscale
**Status:** [x] Complete
**Issue:** Add button form and inputs were styled with orange accent color.
**Solution:**
- Changed form border from `border-orange-400/30` to `border-white/30`
- Changed input focus state from `focus:border-orange-400` to `focus:border-white/50`
- Changed Add Button hover from orange to `hover:border-white/50 hover:text-white/80`

---

### 26. Name Styling Match Other Preview
**Status:** [x] Complete
**Issue:** Name in preview was missing alternate characters and 3D perspective effect from other preview.
**Solution:**
- Added `fontFeatureSettings: '"ss01" 1'` for alternate character styling
- Added `transform: 'perspective(800px) rotateX(12deg)'` for 3D perspective
- Adjusted text shadow values: `0 0 1px`, `0 0 4px`, `0 0 8px` to match other preview

---

### 27. Remove Outer Container Wrapper
**Status:** [x] Complete
**Issue:** Outer container with visible border/background was taking up space and not needed since each section has its own container.
**Solution:**
- Removed `rounded-2xl border border-white/10 bg-white/[0.02]` from outer container
- Kept `p-4` padding for spacing from edges
- Increased maxWidth from 1800px to 2200px for ultra-wide screens

---

### 28. Grid Columns Thinner, Preview Wider
**Status:** [x] Complete
**Issue:** Settings columns too wide, preview column pushed off screen on 25" displays.
**Solution:**
- Preview column width increased: `clamp(320px, 25vw, 400px)`
- Settings columns minmax reduced: 260px → 220px for more columns
- Added 1800px+ breakpoint: preview 420px wide
- Changed `align-items: start` to `align-items: stretch` for equal heights

---

### 29. Button Overflow Clipping Fix
**Status:** [x] Complete
**Issue:** Move/edit buttons at -left-6 and -right-6 were clipped by overflow:hidden on phone-screen.
**Solution:**
- Changed `.phone-screen` CSS from `overflow: hidden` to `overflow: visible`
- Added `.phone-screen-content` class for inner content that needs clipping
- Wrapped star background in overflow-hidden container
- All containers (phone-mockup, phone-screen, content) now have `overflow: visible`

---

## Execution Order

1. **Fix #1** - Replace preview (biggest change, foundation for other fixes)
2. **Fix #2** - Name styling (quick fix after preview swap)
3. **Fix #3** - Font labels (quick CSS fix)
4. **Fix #4** - Social links min-width (quick CSS fix)
5. **Fix #6** - Preview size & border (part of preview area)
6. **Fix #5** - Activate button placement (depends on preview area)
7. **Fix #7** - Button links layout (UI adjustment)
8. **Fix #8** - Button reordering (logic fix)
9. **Fix #9** - Draft/Save logic (final polish)

---

## Progress Log

### Session 1: 2026-01-22

- [x] Fix #1-9 completed (preview replacement, styling, button links, etc.)

### Session 2: 2026-01-22

- [x] Fix #10 - QR Code button height matched to Activate button
- [x] Fix #11 - Name neon glow effect added to preview
- [x] Fix #12 - "Name Weight" renamed to "Button Weight", applies to button links
- [x] Fix #13 - Social/Button Links text sizes increased to match other sections
- [x] Fix #14 - Button Links combined with Preview:
  - Renamed "Live Preview" to "Your Page"
  - Created new "Page Actions" section with QR/Activate/Open/Save buttons
  - Added button management UI directly into preview column
- [x] Fix #15 - Custom social link input heights fixed to match standard inputs

### Session 3: 2026-01-22

- [x] Fix #16 - Page Actions buttons stacked vertically
- [x] Fix #17 - Larger preview phone (280px, iPhone 9:19.5 ratio)
  - Profile photo: w-14 h-14 → w-20 h-20
  - Name text: text-base → text-xl
  - Social icons: w-4 h-4 → w-7 h-7
  - Contact buttons: py-1 text-[9px] → py-2 text-xs
  - Button links: py-1 text-[9px] → py-2.5 text-sm
- [x] Fix #18 - Renamed to "Preview / Button Links"
- [x] Fix #19 - Interactive button editing in preview with Add Button
- [x] Fix #20 - Move buttons with up/down arrows on hover
- [x] Fix #21 - Edit/delete interface for custom buttons

### Session 4: 2026-01-22

- [x] Fix #22 - Page Actions single column
  - Removed `link-section-wide` class from Page Actions section
  - Now spans only 1 column like other settings sections
- [x] Fix #23 - Preview container overflow fix
  - Changed preview container from `overflow-hidden` to `overflow-visible`
  - Added `minWidth: '340px'` to accommodate external controls
  - Added `px-8` padding to phone container for move/edit buttons
- [x] Fix #24 - Phone mockup sizing fix
  - Reduced phone width from 280px to 260px
  - Screen no longer overflows the phone case border
- [x] Fix #25 - Add button form greyscale
  - Changed form background from orange to greyscale styling
  - Border: `border-white/30` instead of `border-orange-400/30`
  - Input focus: `focus:border-white/50` instead of `focus:border-orange-400`
  - Add Button hover: `hover:border-white/50 hover:text-white/80`
- [x] Fix #26 - Name styling to match other preview
  - Added `fontFeatureSettings: '"ss01" 1'` for alternate characters
  - Added `transform: 'perspective(800px) rotateX(12deg)'` for 3D perspective
  - Adjusted text shadow values to match: `0 0 1px`, `0 0 4px`, `0 0 8px`

### Deployed: 2026-01-22 (Session 4)
- All 26 fixes complete and deployed to Cloudflare Pages
- Deployment URL: https://323e06d0.saabuildingblocks.pages.dev

### Session 5: 2026-01-22

- [x] Fix #27 - Remove outer container wrapper
  - Removed visible container styling (border, background, rounded-2xl)
  - Changed from `rounded-2xl border border-white/10 bg-white/[0.02] p-4 mx-auto` to just `p-4`
  - Removed `maxWidth: '1800px'` cap, increased to `maxWidth: '2200px'`
  - Sections now only have spacing from edges, not enclosed in visible box
- [x] Fix #28 - Grid columns thinner, preview wider
  - Preview column: increased from `clamp(200px, 20vw, 280px)` to `clamp(320px, 25vw, 400px)`
  - Settings columns: reduced minmax from 260px to 220px for more columns
  - Added 1800px+ breakpoint: preview 420px, settings minmax 240px
  - Changed `align-items: start` to `align-items: stretch` for equal heights
- [x] Fix #29 - Button overflow clipping fix
  - Changed phone-screen CSS from `overflow: hidden` to `overflow: visible`
  - Added `.phone-screen-content` class for inner content clipping
  - Wrapped star background in overflow-hidden container
  - Move/edit buttons now visible outside phone screen bounds

### Deployed: 2026-01-22 (Session 5)
- All 29 fixes complete and deployed to Cloudflare Pages
- Deployment URL: https://87a3198e.saabuildingblocks.pages.dev

