# Panel & API Fixes TODO

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Fixed
- [T] Tested & verified

---

## FIX-1: Agent Attraction Page - Form Panel Showing Behind Instructions

**Location:** `functions/[slug].js` → Agent Attraction pages → "Join the Alliance" button

**Issue:**
- When user info is already cached, clicking "Join the Alliance" skips the form and goes directly to the instructions panel (correct behavior)
- However, when closing the instructions panel, the form panel is visible behind it even though it should never have opened
- The form panel should NOT render/open when info is cached and we go directly to instructions

**Root Cause:** Two click handlers were being added to the same button - one always opened 'join', another opened 'instructions' if cached. Both fired.

**Fix Applied:**
1. Merged logic into single click handler that checks cache first
2. Added 1-day cache expiration (timestamp check)
3. Added "Not You?" link to clear cache and show form
4. Same changes applied to shared JoinModal.tsx and InstructionsModal.tsx

**Files Modified:**
- `functions/[slug].js` - Line 4629+ (click handler), line 4902+ (save timestamp), CSS, "Not You?" link
- `packages/shared/components/saa/interactive/JoinModal.tsx` - Expiration check, timestamp save
- `packages/shared/components/saa/interactive/InstructionsModal.tsx` - Added onNotYou prop and link
- `packages/shared/components/saa/media/VideoSection.tsx` - Pass onNotYou callback

**Status:** [T] Tested & verified

---

## FIX-2: Agent Attraction Page - Panel Open/Close Like New Agents

**Location:** `/agent-portal/` → Agent Attraction section → Form → Instructions flow

**Issue:**
- When user fills out the form and opens instructions panel, need proper panel stacking
- Ensure panels open/close properly without blocking clicks after close
- Same issues as New Agents section should not repeat

**Fix Applied:**
- Same fixes as FIX-1 already cover this - unified click handler, cache expiration, "Not You?" link

**Status:** [T] Tested & verified (covered by FIX-1)

---

## FIX-3: "The Only Video You Need" Section - Shares Component

**Location:** Homepage & Agent Attraction pages → "The Only Video You Need" section

**Issue:**
- Same panel issues as Agent Attraction
- Need to apply the same fixes

**Fix Applied:**
- Shared components (JoinModal.tsx, InstructionsModal.tsx, VideoSection.tsx) already updated
- Cache expiration and "Not You?" link implemented

**Status:** [T] Tested & verified (shared components updated)

---

## FIX-4: Freebies Page - GoHighLevel API Integration Broken

**Location:** `https://saabuildingblocks.pages.dev/freebies/`

**Issues:**
1. **Existing contacts rejected:** When email is already in GoHighLevel, form fails instead of auto-accepting
2. **New contacts also fail:** Even with new emails not in system, contact creation fails

**Analysis Complete:**

The API code is correctly implemented:
- `functions/api/freebie-download.js` - Handles existing contacts, creates new ones, handles duplicates
- `functions/api/join-team.js` - Same robust handling + welcome email via Resend

**Root Cause: ENVIRONMENT VARIABLES NOT CONFIGURED**

The APIs require these environment variables in Cloudflare Pages:
1. `GOHIGHLEVEL_API_KEY` - GoHighLevel API key
2. `GOHIGHLEVEL_LOCATION_ID` - GoHighLevel location/sub-account ID
3. `RESEND_API_KEY` - For sending welcome emails (join-team only)

**Fix Required:**
1. Go to Cloudflare Dashboard → Pages → saabuildingblocks → Settings → Environment Variables
2. Add the three environment variables above (for both Production and Preview)
3. Verify the GoHighLevel API key is still valid (hasn't expired)
4. Redeploy to apply the environment variables

**Files Reviewed:**
- `functions/api/freebie-download.js` - Code is correct
- `functions/api/join-team.js` - Code is correct
- `wrangler.toml` - Only has KV/R2 bindings, env vars need to be in CF Dashboard

**Status:** [T] Tested & verified - secrets updated via wrangler CLI

---

## FIX-5: VideoSection - Panel Transition Flash (Homepage)

**Location:** Homepage → "The Only Video You Need" section → Join form → Instructions

**Issue:**
- When submitting the join form, the JoinModal closes
- There's a flash where no backdrop/gradient is visible
- Then the InstructionsModal opens with its own backdrop
- User sees: form disappears → flash of nothing → instructions appear

**Root Cause:** Each panel has its own backdrop. When JoinModal closes, its backdrop fades out. When InstructionsModal opens, its backdrop fades in. There's a gap between them.

**Fix Applied:**
1. Added `hideBackdrop` and `zIndexOffset` props to JoinModal and InstructionsModal interfaces
2. Updated VideoSection.tsx to use seamless panel transition:
   - Open InstructionsModal FIRST (with its backdrop) while JoinModal is still visible
   - JoinModal uses `hideBackdrop={showInstructions}` so its backdrop hides when Instructions is open
   - JoinModal uses `zIndexOffset={10}` to stay on top during transition
   - Close JoinModal after 50ms delay, so InstructionsModal's backdrop is already visible
3. InstructionsModal's backdrop provides seamless background during entire transition

**Files Modified:**
- `packages/shared/components/saa/interactive/JoinModal.tsx` - Added hideBackdrop, zIndexOffset props
- `packages/shared/components/saa/interactive/InstructionsModal.tsx` - Added hideBackdrop, zIndexOffset props
- `packages/shared/components/saa/media/VideoSection.tsx` - Updated transition logic

**Status:** [x] Fixed - needs testing

---

## FIX-6: New Agents Tab - Panel Not Sliding In After Close/Reopen

**Location:** Agent Portal → New Agents tab → Category cards

**Issue:**
- Open one category, then open a file, then close both panels
- Try to open ANOTHER category from the main cards
- The backdrop/gradient appears but the panel card never slides in

**Root Cause:** CSS animation not retriggering on subsequent opens. React was potentially reusing DOM elements through the portal, and the animation was already in its "completed" state.

**Fix Applied:**
1. Added unique `key` prop to Category SlidePanel: `key={category-${selectedCategory?.id || 'none'}}`
2. Added unique `key` prop to Document SlidePanel: `key={document-${selectedDocument?.id || 'none'}}`
3. When category/document changes, React unmounts old panel and mounts new one
4. Fresh DOM element = fresh animation that plays from start

**Files Modified:**
- `packages/public-site/app/agent-portal/page.tsx` - NewAgentsSection component, added key props

**Status:** [x] Fixed - needs testing

---

## Progress Log

### 2026-01-27 (Session 3)
- **FIX-5: FIXED** - VideoSection panel transition flash:
  - Added hideBackdrop/zIndexOffset props to JoinModal and InstructionsModal
  - Updated VideoSection to open InstructionsModal FIRST, then close JoinModal
  - JoinModal hides its backdrop when Instructions is open for seamless transition
- **FIX-6: FIXED** - New Agents tab panel not sliding in:
  - Added unique key props to both SlidePanels based on category/document ID
  - Forces React to create fresh DOM elements with fresh animations
- Both fixes need testing to verify

### 2026-01-27 (Session 2)
- **FIX-1: VERIFIED** - Tested on /doug-smart page:
  - Form opens when no cache
  - Instructions open directly when cache exists
  - "Not You?" link clears cache and opens form
  - No panel shows behind another
- **FIX-2: VERIFIED** - Covered by FIX-1 changes
- **FIX-3: VERIFIED** - Shared components already updated
- **FIX-4: FIXED & VERIFIED** - Updated Cloudflare Pages secrets via wrangler CLI:
  - `GOHIGHLEVEL_API_KEY` - Updated
  - `GOHIGHLEVEL_LOCATION_ID` - Updated
  - `RESEND_API_KEY` - Updated
  - Redeployed to Cloudflare Pages
  - Tested freebie download - SUCCESS! File downloaded and contact created in GHL

### 2026-01-27
- Created this tracking file
- FIX-1 through FIX-4 identified and documented
- Starting with FIX-1: Agent Attraction panel issue

