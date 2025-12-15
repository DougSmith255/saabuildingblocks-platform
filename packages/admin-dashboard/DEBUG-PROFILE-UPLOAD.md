# Profile Picture Upload Debug Log

## Current Error (2024-12-15)
```
"exp" claim timestamp check failed
```

This is a **JWT token expiration error**, NOT an R2/S3 error. The access token being sent has expired.

---

## ROOT CAUSE IDENTIFIED

**The access token expires in 15 minutes (`ACCESS_TOKEN_EXPIRY = '15m'` in `/lib/auth/jwt.ts`), and the frontend NEVER refreshes the token before making requests.**

The refresh endpoint exists (`/api/auth/refresh`) but:
1. It expects refresh token in a **cookie** (not localStorage)
2. The frontend **never calls it**
3. The frontend only stores access token in localStorage

---

## Error History

### Error 1: "request signature we calculated does not match"
- **Cause**: R2 credentials issue
- **Fix Attempted**: Refactored S3 client to create fresh instance per request
- **Status**: May be fixed, but can't verify due to JWT error

### Error 2: "exp claim timestamp check failed" (CURRENT)
- **Cause**: JWT access token has expired after 15 minutes
- **Location**: `/lib/auth/jwt.ts` - `verifyAccessToken()` function
- **Root Cause**: Frontend never refreshes expired tokens

---

## Files Involved

### Backend (Admin Dashboard)
- `/app/api/users/profile-picture/route.ts` - Upload endpoint
- `/app/api/auth/refresh/route.ts` - Token refresh endpoint (expects cookie)
- `/lib/auth/jwt.ts` - Token verification (15 min expiry)

### Frontend (Public Site)
- `/app/agent-portal/page.tsx` - Profile page with upload UI (NO token refresh)
- `/app/agent-portal/login/page.tsx` - Login (stores token in localStorage only)

---

## Things Tried

1. **2024-12-15**: Changed file input accept attribute for cross-platform compatibility
2. **2024-12-15**: Added console logging for debugging
3. **2024-12-15**: Added old image deletion logic
4. **2024-12-15**: Refactored R2 client to create fresh instance per request
5. **2024-12-15**: Added R2 config debug logging
6. **2024-12-15**: Investigated JWT flow - found 15min expiry with no refresh

---

## SOLUTION OPTIONS

### Option A: Increase access token expiry (Quick fix)
Change `ACCESS_TOKEN_EXPIRY = '15m'` to `'24h'` or `'7d'`
- Pros: Simple, works immediately
- Cons: Less secure

### Option B: Add token refresh before upload (Proper fix)
Add a `refreshAccessToken()` function to frontend that:
1. Calls `/api/auth/refresh`
2. Updates localStorage with new token
- Pros: Proper security
- Cons: More complex, requires refresh token in cookie

### Option C: Re-login silently when token expires
Detect expired token error, prompt re-login or use stored credentials
- Pros: Works without backend changes
- Cons: Poor UX

---

## IMPLEMENTING: Option A (Quick fix - increase token expiry)

Location: `/home/claude-flow/packages/admin-dashboard/lib/auth/jwt.ts`
Change: `ACCESS_TOKEN_EXPIRY = '15m'` → `ACCESS_TOKEN_EXPIRY = '7d'`

This allows users to stay logged in for 7 days without needing refresh logic.

---

## Test Checklist

- [ ] Login fresh and immediately try upload
- [ ] Wait 15+ minutes and try upload (test expiry)
- [ ] Check browser console for token-related errors
- [ ] Verify token expiration time in JWT payload
