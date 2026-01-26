# Pending UI Fixes

## FIX-1/8: Profile/Menu Section Scroll Issue
**Status:** Fixed
**Issue:** The profile and main menu section on desktop gets hung up during scroll on Agent Attraction, Link Page (under 1550px), and other tabs.
**Solution:**
- Added 'support', 'agent-attraction', 'linkpage', 'templates', 'production', 'download' to the list of sections that disable sticky sidebar at line 2581.
- Added `self-start` class to sidebar aside element to prevent flex stretching which can cause scroll hang-up.
- Changed desktop link page layout to show at 950px instead of 1550px.
- Hid the separate tablet layout entirely (was causing different scroll behavior).

---

## FIX-2: My eXp App Card Layout
**Status:** Fixed
**Issue:** Move the my eXp App card into the line with the other support card items and equalize the row total widths.
**Solution:**
- Changed support cards from CSS Grid to flexbox with `flex-1` and `minWidth: 350px` on each card.
- Cards now stretch to fill available horizontal space in each row.
- Updated My eXp App card text: "Production Stats" → "Stats", "Revenue Share" → "RevShare", "Contact Info" → "Upline".
- Moved My eXp App card inside the flexbox container with other support cards.

---

## FIX-4: Elite Courses Card Grid Layout
**Status:** Fixed
**Issue:** Cards in elite courses need equalized row widths with min-width 350px, cards stretch to fill rows.
**Solution:**
- Changed Elite Courses from CSS Grid to flexbox with `flex-1` and `minWidth: 350px` on each card link.
- Cards now stretch to fill available horizontal space in each row.

---

## FIX-6: Preview Section Consistency (950px+)
**Status:** Fixed
**Issue:** The preview section for screens between 1550px and 950px needed to match the desktop preview.
**Solution:**
- Changed desktop link page layout from `min-[1550px]:grid` to `min-[950px]:grid`.
- Hid the tablet layout entirely by changing its class to `hidden` (was `min-[950px]:block min-[1550px]:hidden`).
- Now all screens >= 950px use the same desktop 4-column layout with live preview.

---

## Completed & Removed
- FIX-3: QR Code Button - CONFIRMED FIXED (removed from list)
- FIX-5: Download Mobile App Button - CONFIRMED FIXED (removed from list)
- FIX-7: Pixel Question Button Position - CONFIRMED FIXED (removed from list)
