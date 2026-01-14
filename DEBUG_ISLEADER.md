# DEBUG LOG: isLeader Not Working

## Problem
Doug has is_leader=true in admin dashboard, but Leaders call doesn't show in Team Calls tab.

## What Works
- California broker support card shows (uses `user?.state`)
- Both use same pattern of passing user prop to component

## Pipeline
1. Admin Dashboard toggles is_leader → calls PUT /api/users/[id] with {is_leader: true}
2. API updates Supabase users table
3. Public site calls GET /api/auth/me → returns {data: {is_leader: true/false}}
4. PreloadService fetches and caches to localStorage
5. Agent portal reads from localStorage/preload
6. TeamCallsSection receives isLeader prop

## Verified
- [x] Database has is_leader=true for Doug (verified via direct Supabase query)
- [x] state=CA works correctly (broker card shows)

## Attempted Fixes
1. Added `isLeader: result.userData.is_leader === true` mapping - FAILED
2. Added normalization in getInitialUser() for is_leader→isLeader - FAILED
3. **FIX 3**: Handle BOTH is_leader (from API) AND isLeader (from cache fallback)
   - Problem: If API fails, fallback uses cached data which has `isLeader` (camelCase)
   - But code was checking `result.userData.is_leader` which would be undefined from cache
   - Solution: `const rawIsLeader = result.userData.is_leader ?? result.userData.isLeader;`

## Root Cause Analysis
The getCachedUserDataForFallback() returns cached data wrapped in {success: true, data: userData}.
The cached userData has camelCase keys (isLeader), but the transform code expected snake_case (is_leader).
When API failed and fell back to cache, is_leader was undefined, so isLeader became false.
