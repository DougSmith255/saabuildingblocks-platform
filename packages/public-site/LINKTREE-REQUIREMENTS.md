# SAA Linktree UI Requirements

## 0. Linktree Preview - Social Icons
- Add social icons to the Linktree preview (currently missing)
- Should display the same social links as configured in Agent Attraction page

## 1. Bio Section Font
- Bio text should ALWAYS use Synonym font (not affected by font choice setting)
- Font choice setting should only affect button text

## 2. Button Icon Positioning
- Icon should be on the LEFT side of the button
- Button title/text should be CENTERED in the button
- Need to adjust flexbox layout for this

## 3. Profile Image Auto-Sync
- When user uploads/changes profile image in Agent Portal, it should automatically sync to Linktree preview
- Currently: Profile image and Linktree preview may be out of sync
- Need to ensure they use the same image source

## 4. Black & White Effect Toggle
- Add option in Linktree UI for user to REMOVE the B&W effect on their profile image
- Default: B&W effect ON (current behavior)
- Toggle: Allow full color profile image for Linktree

## 5. Linktree Profile Image Sizing
- Automatically resize profile image to 150x150px for Linktree
- Question: Create a separate image variant stored in Cloudflare R2?
- Or: Use CSS/img attributes to resize on display?
- Or: Use Cloudflare Image Resizing?

## 6. Color Picker Enhancement
- Replace current color picker with full color wheel/rectangle picker
- User should be able to choose ANY color (not just preset colors)
- Color applies to:
  - Buttons
  - Profile frame/border
  - Agent name glow

## 7. Agent Name H1 Styling with Dynamic Glow
- Agent name should use the neon sign H1 styling
- Glow color should change based on user's selected accent color
- May need to duplicate/modify the H1 component from master-controller
- Check if we already have a configurable version

## 8. Edit Styles Button (UI Reorganization)
- REMOVE these from the main UI:
  - Color choice picker
  - Bio input
  - Icon style/button text color toggle
  - Button font style selector
- KEEP in main UI:
  - Linktree preview only
  - "Edit Styles" button
- "Edit Styles" opens a modal/panel with all the styling options

---

# Decisions Made

## Q1: Profile Image Variants
**Answer: A** - Store a separate 150x150 variant in R2
- Will create `profiles/{userId}-linktree.{ext}` alongside existing `profiles/{userId}.{ext}`
- Better performance, dedicated sizing for Linktree

## Q2: B&W Toggle Scope
**Answer: A** - Only affects Linktree page
- Agent Attraction page keeps B&W effect
- Linktree can have full color if user chooses

## Q3: Color Picker Library
**Answer: B** - Use react-color (full-featured)
- More options for users
- Well-maintained library

## Q4: Edit Styles Modal
**Answer: B** - Centered modal overlay (like Edit Profile)
- Consistent with existing UI patterns

## Q5: H1 Component
**Answer:** Create a new duplicate of the Master Controller H1 styling
- Will be configurable for dynamic glow colors based on user's accent color choice

---

# Agent Portal UI Improvements (My SAA Pages Section)

## 9. Notification Text Fix
- Change "Your page is not yet active" to "Your pages are not yet active"

## 10. Section Title Change
- Remove "Agent Attraction Page" H2
- Replace with "Agent Pages Setup" (or better alternative TBD)

## 11. Setting Labels with Badges
- Add badges to each setting indicating which page(s) it affects:
  - **Agent Attraction + Linktree**: Profile Image, Display Name, Phone Settings, Social Links
  - **Linktree Only**: Bio, Color picker, Icon style, Button font, etc.

## 12. Page URLs Section
- Change "Your Page URL" to "Your Page URLs"
- Display BOTH URLs:
  - Agent Attraction page URL
  - Linktree page URL

---

# Implementation Status

All requirements have been implemented:

| # | Requirement | Status |
|---|-------------|--------|
| 0 | Social icons in preview | ✅ Complete |
| 1 | Bio font always Synonym | ✅ Complete |
| 2 | Button icon LEFT, text centered | ✅ Complete |
| 3 | Profile image auto-sync | ✅ Complete |
| 4 | B&W effect toggle | ✅ Complete |
| 5 | 150x150 R2 variant | ✅ Complete |
| 6 | Full color picker | ✅ Complete (react-color) |
| 7 | Dynamic glow H1 | ✅ Complete |
| 8 | Edit Styles modal | ✅ Complete |
| 9 | Plural notification text | ✅ Complete |
| 10 | Remove H2 titles | ✅ Complete |
| 11 | Page badges | ✅ Complete |
| 12 | Both page URLs | ✅ Complete |

---

# Discussion: UI/UX Optimization

**Goal**: Keep "My SAA Pages" section as compact as possible while remaining user-friendly and frictionless (avoid excessive popups).

**Open Question**: After implementing all changes above, should we re-evaluate the overall layout and information architecture?

