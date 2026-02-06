# Profile Image Not Loading - Troubleshooting Log

**Issue:** Profile image not loading in "My Profile" section of agent portal app
**Reported:** 2026-02-06
**Status:** INVESTIGATING

---

## Problem Description
- Profile image shows in Link Page UI (works)
- Profile image does NOT show in "My Profile" section (broken)
- User has refreshed the app, issue persists

---

## Investigation Steps

### Step 1: Identify data sources
The profile section checks these sources in order:
1. `user?.profilePictureUrl` - from user profile API
2. `preloadedAgentPageData?.page?.profile_image_color_url` - from agent page API
3. `preloadedAgentPageData?.page?.profile_image_url` - from agent page API

**Question:** Which of these has data, and which is null?

### Step 2: Check API responses
- `/api/users/profile` - returns `profile_picture_url`
- `/api/agent-pages/{userId}` - returns `profile_image_url` and `profile_image_color_url`

### Step 3: Check localStorage cache
- `agent_portal_user` - cached user data
- `agent_portal_page_data` - cached agent page data

---

## Attempts Made

### Attempt 1 (2026-02-06)
**What I did:** Added fallback to agent page images in sidebar and edit profile sections
**Code changed:** `packages/public-site/app/agent-portal/page.tsx` lines 3681-3722 and 4011-4052
**Result:** FAILED - user reports image still not loading

**Possible reasons for failure:**
- [ ] `preloadedAgentPageData` might be null when the profile section renders
- [ ] The fallback logic might not be executing (need to verify with console logs)
- [ ] There might be a race condition between data loading and rendering
- [ ] The `profileImageError` state might be true, blocking the image display

---

### Attempt 2 (2026-02-06)
**What I did:** Added debug logging to both sidebar and My Profile sections
**Deployed:** Debug version with console.log statements

**User feedback:**
- Console logs showed login page and doug-smart page, NOT agent portal (user was testing wrong page)
- **KEY FINDING:** Profile image WORKS in Firefox browser, but NOT in PWA app
- This proves the issue is **PWA cache** not code logic

---

### Attempt 3 (2026-02-06) - ROOT CAUSE FOUND
**Root Cause:** PWA service worker cache was serving old JavaScript without the fallback logic
**Solution:** Bumped service worker cache version from `saa-cache-v2` to `saa-cache-v3`

**What this does:**
1. When PWA loads, service worker detects new cache version
2. Old cache is deleted (`saa-cache-v2`)
3. New assets are cached (`saa-cache-v3`)
4. App now runs the new code with profile image fallback

**Files changed:**
- `public/sw.js` - Updated CACHE_NAME to 'saa-cache-v3'

**User action required:**
1. Open the PWA app
2. The service worker should auto-update (may take a few seconds)
3. If still not working, close and reopen the app
4. Last resort: delete app and reinstall

---

## Status: FIXED (pending user verification)
