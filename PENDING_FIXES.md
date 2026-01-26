# Pending UI Fixes

## FIX-1: Profile/Menu Section Scroll Issue on Desktop
**Status:** Attempted (Agent Attraction still needs investigation)
**Issue:** The profile and main menu section on desktop is getting hung up on the Get Support page instead of scrolling up with the rest of the page content. Same issue on Agent Attraction tab.
**Attempts:**
- Attempt 1: Added 'support' to the list of sections that disable sticky sidebar at line 2581. Support tab now fixed.
- Note: Agent Attraction ('agent-attraction') was already in the list, but user says it still has issue. Need to investigate further.

---

## FIX-2: My eXp App Card Layout
**Status:** Attempted
**Issue:** Move the my eXp App card into the line with the other support card items and equalize the row total widths.
**Attempts:**
- Attempt 1: Moved My eXp App card inside the support cards grid (removed the closing `</div>` before it, added it back after). Card should now be part of the fluid auto-fit grid with minmax(300px, 1fr).

---

## FIX-3: QR Code Button Text and Icon
**Status:** Completed
**Issue:** Change "Download QR Code" text in the "Page Actions" section of the link page to just "QR Code" and change the icon to a QR code icon.
**Attempts:**
- Attempt 1: Changed "DOWNLOAD QR CODE" to "QR CODE" at line 12180. Changed download icon to QR code icon. CONFIRMED FIXED.

---

## FIX-4: Elite Courses Card Grid Layout
**Status:** Attempted
**Issue:** Cards in elite courses need equalized row widths. Need fluid columns that fill horizontal space with min-width so cards get pushed to next row when necessary. Same approach needed for support cards in Get Support.
**Attempts:**
- Attempt 1: Changed Elite Courses grid from fixed `grid-cols-2 sm:grid-cols-2 lg:grid-cols-3` to fluid `repeat(auto-fit, minmax(250px, 1fr))`.
- Note: Support cards already had fluid grid with minmax(300px, 1fr).

---

## FIX-5: Download Mobile App Button Visibility
**Status:** Completed
**Issue:** The download mobile app button in main dashboard UI is visible before mobile menu appears. Should only appear on screen sizes under 950px.
**Attempts:**
- Attempt 1: Changed from `min-[1200px]:hidden` to `min-[950px]:hidden` at line 5503. CONFIRMED FIXED.

---

## FIX-6: Preview Section Consistency (1550px-950px)
**Status:** Attempted
**Issue:** The preview section in the 2-column link page UI for screens between 1550px and 950px needs to be the exact same as the one used for larger screens. It appears to have been rebuilt differently.
**Attempts:**
- Attempt 1: Removed sticky positioning from tablet preview column.
- Note: Tablet uses iframe approach (loads actual page URL) while desktop uses inline phone mockup (live rendered from settings). These are architecturally different. Full unification would require major refactor.

---

## FIX-7: Pixel Question Button Position at 1200px
**Status:** Attempted (All tabs)
**Issue:** The pixel question button on the link page moves upwards at screen sizes just under 1200px when making the screen smaller. It should stay in the corner like it does for larger screens (since on mobile it moves to header anyway). Same issue present on: Support tab, Elite Courses tab, New Agents tab, Templates tab, Team Calls tab, Agent Attraction tab.
**Attempts:**
- Attempt 1: Removed `max-[1199px]:bottom-20` class from pixel-help-button at line 13261.
- Attempt 2: Removed `max-[1199px]:bottom-20` from PixelHelpButton component default className at line 13668.
- All tabs now use the fixed default positioning without the 1200px breakpoint shift.

---

## Link Page Tablet Sticky Issue
**Status:** Attempted
**Issue:** Profile section getting hung up on scroll for screens between 1550px and 950px on link page.
**Attempts:**
- Attempt 1: Removed `sticky top-24` from tablet preview column. Preview should now scroll with content.

---

## Completed Fixes
(Fixes will be moved here and then removed entirely once confirmed)
