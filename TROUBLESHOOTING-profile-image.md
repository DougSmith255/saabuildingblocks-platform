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

### Attempt 3 (2026-02-06) - PARTIAL FIX
**Initial Theory:** PWA service worker cache was serving old JavaScript
**Action:** Bumped service worker cache version from `saa-cache-v2` to `saa-cache-v3`
**Result:** Still not working - user confirmed Link Page works but My Profile doesn't

---

### Attempt 4 (2026-02-06) - ACTUAL ROOT CAUSE FOUND

**Root Cause:** Data flow issue between components

The `AgentPagesSection` component (which renders both Link Page and Agent Page sections):
1. Takes `preloadedPageData` as a prop from parent
2. Creates its own internal `pageData` state
3. Fetches FRESH data from API: `fetch(\`${API_URL}/api/agent-pages/${user.id}\`)`
4. Updates its internal state: `setPageData(data.page)`
5. Saves to localStorage
6. **BUT** never updates the parent's `preloadedAgentPageData` state

The "My Profile" section reads from `preloadedAgentPageData` (parent state), which:
- Starts as null
- Only gets populated from localStorage cache during initial load
- Never gets updated when AgentPagesSection fetches fresh data

This explains why:
- Link Page works: It uses its own internal `pageData` state (fresh data)
- My Profile doesn't work: It uses parent's `preloadedAgentPageData` (stale/null)

**Solution:** Added callback to propagate fresh data from child to parent

```tsx
// In AgentPagesSectionProps interface:
onPageDataUpdate?: (data: any) => void;

// When fresh data is fetched:
onPageDataUpdate?.(data);

// Parent passes setter:
<AgentPagesSection
  ...
  onPageDataUpdate={setPreloadedAgentPageData}
/>
```

**Files changed:**
- `app/agent-portal/page.tsx` - Added callback prop and wired it up

---

## Status: FIXED

**Deployed:** 2026-02-06 21:53 UTC
**Commit:** 74966af3
