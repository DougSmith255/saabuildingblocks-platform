# Link Page UI Fixes Tracker

**Last Updated:** 2026-01-24
**Status:** 🔴 IN PROGRESS - 5 verified, 10 need fixes
**File:** `/packages/public-site/app/agent-portal/page.tsx`
**Git Commit:** `607e259c`

---

## STATUS SUMMARY

| Status | Count | Fixes |
|--------|-------|-------|
| ✅ Verified | 5 | FIX-002, FIX-006, FIX-010, FIX-013, FIX-014 |
| ❌ Not Fixed | 9 | FIX-001, FIX-003, FIX-004, FIX-007, FIX-008, FIX-009, FIX-011, FIX-015 |
| ⏸️ Blocked | 1 | FIX-005 (blocked by FIX-007) |

---

## VERIFIED FIXES ✅

| Fix ID | Description | Status |
|--------|-------------|--------|
| FIX-002 | View Page points to correct linktree URL | ✅ |
| FIX-006 | Custom social link fields no longer crash | ✅ |
| FIX-010 | QR code S logo uses dark grey | ✅ |
| FIX-013 | Renamed "Icon Style" to "Style" | ✅ |
| FIX-014 | 6px spacing between button sections | ✅ |

---

## FIXES REQUIRING MORE WORK

### FIX-001: Save Changes Button Visibility

**Status:** ❌ NOT FIXED
**Issue:** Button should ALWAYS be visible once page is activated, just greyed out until a change is made.

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Added button that appears when `pageData?.activated && hasUnsavedChanges` | Button only shows when changes exist, not always visible |

**Required Fix:** Change condition to show button when `pageData?.activated`, grey out when `!hasUnsavedChanges`

---

### FIX-003: Loading Spinner in Link Page UI Profile Photo

**Status:** ❌ NOT FIXED
**Issue:** No loading spinner visible in the profile photo area inside the Link Page UI section during upload.

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Added cache-busting to image URLs | This was about sync, not spinner. Spinner was never added. |

**Required Fix:** Add loading spinner overlay to the profile photo in phone mockup during upload

---

### FIX-004: Color Profile Button Not Clickable

**Status:** ❌ NOT FIXED
**Issue:** Color button is completely unresponsive. Either color image isn't saving during upload, or button logic is broken.

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Applied inline styles for consistent styling | Button still doesn't work |

**Investigation Needed:**
1. Check if color image upload actually saves to database
2. Check if `profile_image_color_url` is being set in pageData
3. Check if `hasColorImage` is evaluating to true after upload
4. Check button onClick handler

---

### FIX-007: Button Controls Not Visible

**Status:** ❌ NOT FIXED
**Issue:** Up/down reorder buttons are NOT visible AT ALL. User sees no controls for reordering buttons.

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Positioned controls at `-left-10` with `opacity-0 group-hover:opacity-100` | Controls not visible even on hover |

**Investigation Needed:**
1. Check if `overflow: visible` is properly set on all parent containers
2. Check if z-index is high enough
3. Check if the controls are actually rendering (inspect element)
4. Check if hover state is triggering

---

### FIX-008: Edit Button Not Visible

**Status:** ❌ NOT FIXED
**Issue:** Edit button for button links is NOT visible AT ALL.

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Added edit button at `-right-10` with hover visibility | Button not visible |

**Investigation Needed:** Same as FIX-007 - likely same root cause

---

### FIX-009: Help Button Gradient Glitch

**Status:** ❌ NOT FIXED
**Issue:** Help button gradient still glitches when modal opens with dark overlay.

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Added `isolation: 'isolate'` and increased z-index to z-[100] | Still glitching |

**Investigation Needed:**
1. Find the exact help button component
2. Check what CSS properties are affected by the overlay
3. May need to move help button outside the overlay's DOM tree

---

### FIX-011: Style Default Values

**Status:** ❌ NOT FIXED
**Issue:** Style should default to "Dark". Also Bold text is white on first load (same as FIX-015).

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Verified DEFAULT_LINKS_SETTINGS has correct values | User says style should default to Dark, and Bold text is white |

**Required Fix:**
1. Ensure `iconStyle` defaults to 'dark' in DEFAULT_LINKS_SETTINGS
2. Fix Bold text color on initial load (FIX-015)

---

### FIX-015: Bold Pill Text Color White on Initial Load

**Status:** ❌ NOT FIXED
**Issue:** Bold pill text is WHITE on first page load. Clicking Regular then Bold fixes it.

**Troubleshooting Log:**
| Attempt | Date | What Was Tried | Result |
|---------|------|----------------|--------|
| 1 | 2026-01-24 | Changed to inline styles: `color: linksSettings.nameWeight === 'bold' ? '#000000' : 'rgba(255,255,255,0.6)'` | Still white on first load |

**Investigation Needed:**
1. Check if `linksSettings.nameWeight` is undefined on first render
2. May need to check the DEFAULT_LINKS_SETTINGS value
3. May be a React hydration issue

---

### FIX-005: S Logo Disappearing on Downward Move

**Status:** ⏸️ BLOCKED
**Blocked By:** FIX-007 (can't test without button controls visible)

---

## FIX DETAILS (For Verified Fixes)

### FIX-002: View Page URL ✅
Changed onClick to use linktree URL: `${slug}-links`

### FIX-006: Custom Social Links Crash ✅
Fixed sparse array issue by checking `link && link.url`

### FIX-010: QR Code S Logo Color ✅
Changed from `/icons/s-logo-1000.png` to `/icons/s-logo-dark.png`

### FIX-013: Rename "Icon Style" ✅
Simple text replacement

### FIX-014: 6px Spacing ✅
Changed to inline style `marginBottom: '6px'`

---

## PRIORITY ORDER (Remaining Fixes)

1. **FIX-007** - Button controls not visible (blocking FIX-005 testing)
2. **FIX-008** - Edit button not visible (same root cause)
3. **FIX-015** - Bold text white on load
4. **FIX-011** - Style default to Dark
5. **FIX-004** - Color button not working
6. **FIX-001** - Save Changes always visible
7. **FIX-003** - Loading spinner in profile photo
8. **FIX-009** - Help button gradient glitch
9. **FIX-005** - S logo disappearing (after FIX-007 fixed)
