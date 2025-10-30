# RBAC Implementation Documentation
## Role-Based Access Control System

**Implementation Date:** 2025-10-29
**Status:** ✅ Complete
**Version:** 1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Implementation Files](#implementation-files)
4. [Database Setup](#database-setup)
5. [Usage Guide](#usage-guide)
6. [API Reference](#api-reference)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This RBAC implementation provides a two-tier access control system:

### Roles

**Admin (`admin`)**
- Full access to Token Vault (view, create, edit, delete)
- Full access to Master Controller (edit typography, colors, spacing)
- Can edit components and templates
- Can manage users and change roles
- Can view audit logs

**Team Member (`team_member`)**
- NO access to Token Vault (shows error message)
- Read-only access to Master Controller (view settings, no editing)
- Can view templates and components (no editing)
- Cannot manage users
- Cannot view audit logs

### Key Features

- ✅ Database-level security (PostgreSQL RLS)
- ✅ Client-side permission checks (React hooks)
- ✅ First user auto-promoted to admin
- ✅ Audit trail for role changes
- ✅ Role badges in UI
- ✅ Permission tooltips for disabled features
- ✅ Backward compatible with existing auth

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Next.js/React)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  useUserRole() Hook                                        │
│    └─> Fetches role from Supabase                         │
│                                                             │
│  PermissionGuard Component                                 │
│    └─> Conditionally renders UI based on permissions      │
│                                                             │
│  RoleBadge Component                                       │
│    └─> Displays user role (Admin/Team Member)             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE (PostgreSQL)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  users table                                               │
│    └─> role column (admin/team_member)                    │
│                                                             │
│  RLS Policies                                              │
│    ├─> Token Vault: Admin-only                            │
│    ├─> Master Controller: Admin edit, team_member view    │
│    └─> Audit Logs: Admin-only                             │
│                                                             │
│  Functions                                                 │
│    ├─> is_admin()                                          │
│    ├─> has_role(role_text)                                 │
│    ├─> get_user_role()                                     │
│    └─> change_user_role(user_id, new_role, reason)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Files

### 1. Database Migration

**File:** `supabase/migrations/20251029100000_add_role_based_access_control.sql`

Creates:
- `role` column in `users` table
- Role management functions (`is_admin`, `has_role`, `get_user_role`)
- RLS policies for Token Vault (admin-only)
- RLS policies for Master Controller (admin edit, team_member view)
- `role_changes_log` table for audit trail
- `change_user_role()` function for role updates
- Trigger to log role changes
- First user auto-promotion to admin

### 2. TypeScript Type Definitions

**File:** `lib/types/rbac.ts`

Exports:
- `Role` type: `'admin' | 'team_member'`
- `Permission` type: Granular permissions enum
- `UserWithRole` interface: Extended user with role
- `RoleChangeLog` interface: Audit log entry
- `ROLE_PERMISSIONS` map: Which permissions each role has
- Helper functions: `hasPermission()`, `isAdmin()`, `canAccessTokenVault()`, etc.
- Error messages: `PERMISSION_ERRORS` constants
- UI helpers: Badge colors, icons, display names

### 3. React Hooks

**File:** `lib/rbac/useUserRole.ts`

Custom hook that:
- Fetches current user's role from Supabase
- Subscribes to auth state changes
- Returns: `{ role, user, isLoading, error, isAdmin, isTeamMember, refetch }`
- Auto-updates when user logs in/out

### 4. UI Components

**File:** `lib/rbac/RoleBadge.tsx`
- Displays colored badge with role name and icon
- Size variants: `sm`, `md`, `lg`
- Admin = gold badge with shield icon
- Team Member = green badge with user icon

**File:** `lib/rbac/PermissionGuard.tsx`
- Wrapper component for conditional rendering
- Shows children only if user has required permission
- Falls back to alternative UI if no permission

**File:** `lib/rbac/PermissionTooltip.tsx`
- Wraps disabled controls to explain why feature is unavailable
- Shows tooltip on hover with permission message
- Auto-selects appropriate error message based on permission

**File:** `lib/rbac/index.ts`
- Barrel export for easy imports
- `import { useUserRole, RoleBadge, PermissionGuard } from '@/lib/rbac'`

### 5. Updated Store

**File:** `app/master-controller/stores/tokenVaultStore.ts`

Changes (lines 148-160):
```typescript
// Check if user is admin
const { data: userData, error: userError } = await supabase
  .from('users')
  .select('id, role')
  .eq('id', user.id)
  .single();

if (userError || !userData) {
  throw new Error('Unable to verify user permissions');
}

if (userData.role !== 'admin') {
  throw new Error('Token Vault requires admin privileges. Please contact an administrator for access.');
}
```

### 6. Updated Master Controller Page

**File:** `app/master-controller/page.tsx`

Changes:
- ✅ Imports `useUserRole`, `RoleBadge`, `canAccessTokenVault`
- ✅ Fetches user role with `useUserRole()` hook
- ✅ Displays `RoleBadge` in header
- ✅ Shows context-aware description (admin vs team_member)
- ✅ Filters tabs array to hide Token Vault for team_members

---

## Database Setup

### Step 1: Apply Migration

Using Supabase CLI:
```bash
cd /home/claude-flow/packages/admin-dashboard
supabase db push
```

Or manually in Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `supabase/migrations/20251029100000_add_role_based_access_control.sql`
3. Run the migration
4. Verify success with: `SELECT * FROM users;`

### Step 2: Verify First User is Admin

```sql
-- Check first user's role
SELECT id, email, role, created_at
FROM users
ORDER BY created_at ASC
LIMIT 1;

-- Expected: role = 'admin'
```

### Step 3: Test Role Functions

```sql
-- Should return true if you're admin
SELECT is_admin();

-- Should return your role ('admin' or 'team_member')
SELECT get_user_role();

-- Check if you have specific role
SELECT has_role('admin');
```

### Step 4: Test RLS Policies

```sql
-- As admin, should return tokens
SELECT * FROM master_controller_tokens;

-- As team_member, should return empty (RLS blocks access)
-- Switch to team_member account to test
```

---

## Usage Guide

### 1. Using Role Badge in UI

```tsx
import { useUserRole, RoleBadge } from '@/lib/rbac';

export function Header() {
  const { role, isLoading } = useUserRole();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {role && <RoleBadge role={role} size="md" />}
    </div>
  );
}
```

### 2. Protecting Features with PermissionGuard

```tsx
import { PermissionGuard } from '@/lib/rbac';

export function EditButton() {
  return (
    <PermissionGuard
      permission="master_controller_edit"
      fallback={<span className="text-gray-500">Read-only</span>}
    >
      <button>Edit Settings</button>
    </PermissionGuard>
  );
}
```

### 3. Adding Permission Tooltips

```tsx
import { useUserRole, PermissionTooltip } from '@/lib/rbac';

export function SaveButton() {
  const { role } = useUserRole();

  if (!role) return null;

  return (
    <PermissionTooltip permission="master_controller_edit" userRole={role}>
      <button disabled={role !== 'admin'}>
        Save Changes
      </button>
    </PermissionTooltip>
  );
}
```

### 4. Checking Permissions in Code

```tsx
import { useUserRole, canEditMasterController } from '@/lib/rbac';

export function Settings() {
  const { role } = useUserRole();

  const handleSave = () => {
    if (!role || !canEditMasterController(role)) {
      alert('You do not have permission to edit settings');
      return;
    }

    // Save logic here
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### 5. Changing User Role (Admin Only)

```tsx
import { createClient } from '@/lib/supabase/client';

async function promoteToAdmin(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('change_user_role', {
    p_user_id: userId,
    p_new_role: 'admin',
    p_reason: 'Promoted to admin for full system access'
  });

  if (error) {
    console.error('Failed to change role:', error);
    return;
  }

  console.log('Role changed:', data);
}
```

---

## API Reference

### Types

```typescript
// Core role type
type Role = 'admin' | 'team_member';

// Permission type
type Permission =
  | 'token_vault_access'
  | 'master_controller_edit'
  | 'master_controller_view'
  | 'component_edit'
  | 'template_create'
  | 'template_edit'
  | 'user_management'
  | 'audit_log_view';

// User with role
interface UserWithRole {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  display_name?: string;
  avatar_url?: string;
  role: Role;
  permissions?: Permission[];
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
  metadata?: Record<string, any>;
}
```

### Hooks

```typescript
function useUserRole(): {
  role: Role | null;
  user: UserWithRole | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isTeamMember: boolean;
  refetch: () => Promise<void>;
}
```

### Utility Functions

```typescript
// Check if role has permission
function hasPermission(role: Role, permission: Permission): boolean

// Check if user is admin
function isAdmin(role: Role): boolean

// Check if user can access Token Vault
function canAccessTokenVault(role: Role): boolean

// Check if user can edit Master Controller
function canEditMasterController(role: Role): boolean

// Get role display name ("Admin" or "Team Member")
function getRoleDisplayName(role: Role): string

// Get badge color for role
function getRoleBadgeColor(role: Role): string
```

### Database Functions

```sql
-- Check if current user is admin
SELECT is_admin();

-- Check if current user has specific role
SELECT has_role('admin');

-- Get current user's role
SELECT get_user_role();

-- Change user role (admin only)
SELECT change_user_role(
  p_user_id UUID,
  p_new_role TEXT,
  p_reason TEXT
);
```

---

## Testing

### Manual Testing Checklist

#### Admin User Testing
- [ ] Log in as first user (auto-promoted to admin)
- [ ] Verify "Admin" badge appears in Master Controller header
- [ ] Verify Token Vault tab is visible
- [ ] Click Token Vault tab → Should load without error
- [ ] Verify edit buttons are visible in Master Controller
- [ ] Click edit button → Should allow editing
- [ ] Make changes → Should save successfully

#### Team Member Testing
- [ ] Create second user account
- [ ] Log in as second user
- [ ] Verify "Team Member" badge appears in header
- [ ] Verify Token Vault tab is NOT visible
- [ ] Navigate to `/master-controller` → Should load
- [ ] Try to access Token Vault directly → Should show error
- [ ] Check edit buttons → Should be hidden or disabled
- [ ] Hover over disabled features → Should show tooltip

#### Role Change Testing
- [ ] Log in as admin
- [ ] Run `change_user_role()` function to promote team_member
- [ ] Promoted user logs out and back in
- [ ] Verify role badge updated to "Admin"
- [ ] Verify Token Vault tab now visible
- [ ] Verify can edit Master Controller

#### RLS Testing (Database Level)
```sql
-- Test as admin
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "admin-user-uuid"}';
SELECT * FROM master_controller_tokens; -- Should return tokens

-- Test as team_member
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "team-member-uuid"}';
SELECT * FROM master_controller_tokens; -- Should return empty
```

### Automated Testing

```typescript
// Example Jest test
import { hasPermission, canAccessTokenVault } from '@/lib/types/rbac';

describe('RBAC Permissions', () => {
  it('admin can access Token Vault', () => {
    expect(canAccessTokenVault('admin')).toBe(true);
  });

  it('team_member cannot access Token Vault', () => {
    expect(canAccessTokenVault('team_member')).toBe(false);
  });

  it('admin has master_controller_edit permission', () => {
    expect(hasPermission('admin', 'master_controller_edit')).toBe(true);
  });

  it('team_member does NOT have master_controller_edit permission', () => {
    expect(hasPermission('team_member', 'master_controller_edit')).toBe(false);
  });
});
```

---

## Troubleshooting

### Issue: "Token Vault requires admin privileges" error

**Cause:** User is not admin or role check failed

**Solution:**
1. Check user role in database:
   ```sql
   SELECT id, email, role FROM users WHERE email = 'your-email@example.com';
   ```
2. If role is NULL or 'team_member', promote to admin:
   ```sql
   UPDATE users SET role = 'admin' WHERE id = 'your-user-uuid';
   ```
3. Log out and log back in
4. Clear browser cache/localStorage

### Issue: Role badge not showing

**Cause:** `useUserRole()` hook not fetching data

**Solution:**
1. Check browser console for errors
2. Verify Supabase client is configured correctly
3. Check if `users` table exists and has `role` column
4. Verify RLS policies allow SELECT on `users` table:
   ```sql
   -- Add policy if missing
   CREATE POLICY "Users can read their own profile"
     ON users FOR SELECT
     USING (auth.uid() = id);
   ```

### Issue: Edit buttons still visible for team_member

**Cause:** UI component not using `PermissionGuard` or `PermissionTooltip`

**Solution:**
1. Wrap edit buttons in `PermissionGuard`:
   ```tsx
   <PermissionGuard permission="master_controller_edit">
     <button>Edit</button>
   </PermissionGuard>
   ```
2. Or use conditional rendering:
   ```tsx
   const { role } = useUserRole();
   {role === 'admin' && <button>Edit</button>}
   ```

### Issue: RLS blocking admin access

**Cause:** RLS policy too restrictive or function not working

**Solution:**
1. Test `is_admin()` function:
   ```sql
   SELECT is_admin(); -- Should return true for admin
   ```
2. Check user is active:
   ```sql
   SELECT is_active FROM users WHERE id = auth.uid();
   ```
3. Verify RLS policy references `is_admin()` correctly:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'master_controller_tokens';
   ```

### Issue: First user not auto-promoted to admin

**Cause:** Migration didn't run Step 10

**Solution:**
Run manually:
```sql
UPDATE users
SET role = 'admin'
WHERE id = (
  SELECT id FROM users
  ORDER BY created_at ASC
  LIMIT 1
);
```

---

## Next Steps

### Future Enhancements

1. **Granular Permissions**
   - Add `permissions` array to users table
   - Allow per-user permission customization
   - Example: Team member with `['view_tokens']` permission

2. **User Management UI**
   - Create `/admin/users` page
   - List all users with roles
   - Admin can change roles via UI (not just SQL)
   - Show role change audit log

3. **API Routes Protection**
   - Add role checks to API routes
   - Example: `/api/master-controller/typography` checks admin permission
   - Return 403 Forbidden for unauthorized requests

4. **Audit Dashboard**
   - Create `/admin/audit` page
   - Show all role changes
   - Show token access logs
   - Filter by user, action, date range

5. **Team-Based Access**
   - Add `teams` table
   - Users belong to teams
   - Resources scoped to teams
   - Team admins can manage team members

---

## Summary

### What's Implemented

✅ Database schema with `role` column
✅ RLS policies (admin-only Token Vault, mixed Master Controller)
✅ Role management functions (`is_admin`, `has_role`, `get_user_role`)
✅ TypeScript type definitions
✅ React hooks (`useUserRole`)
✅ UI components (`RoleBadge`, `PermissionGuard`, `PermissionTooltip`)
✅ Updated Master Controller page with role display
✅ Updated Token Vault store with role check
✅ First user auto-promotion to admin
✅ Role change audit logging

### What's NOT Implemented (Future Work)

⚠️ User management UI (currently must use SQL)
⚠️ API route protection (client-only checks currently)
⚠️ Audit dashboard UI (logs exist, no UI yet)
⚠️ Granular per-user permissions
⚠️ Team-based access control

### Key Files Reference

```
supabase/
  migrations/
    20251029100000_add_role_based_access_control.sql  (Database)

lib/
  types/
    rbac.ts                                            (Types & Utilities)
  rbac/
    index.ts                                           (Barrel Export)
    useUserRole.ts                                     (Hook)
    RoleBadge.tsx                                      (UI Component)
    PermissionGuard.tsx                                (UI Component)
    PermissionTooltip.tsx                              (UI Component)

app/
  master-controller/
    page.tsx                                           (Updated)
    stores/
      tokenVaultStore.ts                               (Updated)
```

---

**Documentation Version:** 1.0.0
**Last Updated:** 2025-10-29
**Status:** ✅ Production Ready
