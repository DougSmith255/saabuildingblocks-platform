# Pending UI Fixes

## FIX-1: Profile/Menu Section Scroll Issue on Desktop
**Status:** Attempted
**Issue:** The profile and main menu section on desktop is getting hung up on the Get Support page instead of scrolling up with the rest of the page content. Same issue on Agent Attraction tab.
**Attempts:**
- Attempt 1: Added 'support' to the list of sections that disable sticky sidebar at line 2581. Changed from `['onboarding', 'linkpage', 'templates', 'agent-attraction', 'production', 'download']` to include `'support'`.

---

## FIX-2: My eXp App Card Layout
**Status:** Pending
**Issue:** Move the my eXp App card into the line with the other support card items and equalize the row total widths.
**Attempts:**
- (none yet)

---

## FIX-3: QR Code Button Text and Icon
**Status:** Attempted
**Issue:** Change "Download QR Code" text in the "Page Actions" section of the link page to just "QR Code" and change the icon to a QR code icon.
**Attempts:**
- Attempt 1: Changed "DOWNLOAD QR CODE" to "QR CODE" at line 12180. Changed download icon to QR code icon. (Note: Two other instances already had "QR Code" text and QR icon.)

---

## FIX-4: Elite Courses Card Grid Layout
**Status:** Pending
**Issue:** Cards in elite courses need equalized row widths. Need fluid columns that fill horizontal space with min-width so cards get pushed to next row when necessary. Same approach needed for support cards in Get Support.
**Attempts:**
- (none yet)

---

## FIX-5: Download Mobile App Button Visibility
**Status:** Attempted
**Issue:** The download mobile app button in main dashboard UI is visible before mobile menu appears. Should only appear on screen sizes under 950px.
**Attempts:**
- Attempt 1: Changed from `min-[1200px]:hidden` to `min-[950px]:hidden` at line 5503.

---

## FIX-6: Preview Section Consistency (1550px-950px)
**Status:** Pending
**Issue:** The preview section in the 2-column link page UI for screens between 1550px and 950px needs to be the exact same as the one used for larger screens. It appears to have been rebuilt differently.
**Attempts:**
- (none yet)

---

## FIX-7: Pixel Question Button Position at 1200px
**Status:** Attempted (Link Page only)
**Issue:** The pixel question button on the link page moves upwards at screen sizes just under 1200px when making the screen smaller. It should stay in the corner like it does for larger screens (since on mobile it moves to header anyway). Same issue present on: Support tab, Elite Courses tab, New Agents tab, Templates tab, Team Calls tab, Agent Attraction tab.
**Note:** Fix one first (link page), confirm it works, then apply to other tabs.
**Attempts:**
- Attempt 1: Removed `max-[1199px]:bottom-20` class from pixel-help-button at line 13261.
- Attempt 2: Removed `max-[1199px]:bottom-20` from PixelHelpButton component default className at line 13668.

---

## Completed Fixes
(Fixes will be moved here and then removed entirely once confirmed)
