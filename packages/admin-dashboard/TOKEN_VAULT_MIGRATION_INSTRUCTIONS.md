# Token Vault Database Migration Instructions

## Quick Summary
The Token Vault tab is now live and visible at https://saabuildingblocks.com/master-controller. To make it functional, you need to apply the database migration to create the required tables.

## Migration File Location
`/home/claude-flow/packages/admin-dashboard/supabase/migrations/20251029000000_create_token_vault.sql`

Also available at: `/tmp/apply_migration.sql`

## How to Apply Migration

### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/edpsaqcsoeccioapglhi
   - Or: https://supabase.com → Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy Migration SQL**
   ```bash
   cat /tmp/apply_migration.sql
   ```
   Or view the file at:
   `/home/claude-flow/packages/admin-dashboard/supabase/migrations/20251029000000_create_token_vault.sql`

4. **Paste and Execute**
   - Paste the SQL into the query editor
   - Click "Run" button
   - Verify success (should show "Success. No rows returned")

### Option 2: Supabase CLI (If configured)

```bash
cd /home/claude-flow/packages/admin-dashboard
npx supabase link --project-ref edpsaqcsoeccioapglhi
npx supabase db push
```

## What the Migration Creates

### Tables
1. **master_controller_tokens** - Main encrypted token storage
   - Stores encrypted values with metadata
   - Service name, type, status, priority
   - Expiration tracking
   - Soft delete support

2. **token_vault_audit_log** - Access history
   - Who accessed which token
   - Action type (view, decrypt, create, update, delete)
   - Timestamp and success/failure

3. **token_vault_settings** - Per-user preferences
   - Auto-lock timeout (default 15 minutes)
   - Clipboard clear timeout (default 30 seconds)
   - Theme preference

### Security Features
- Row Level Security (RLS) enabled on all tables
- Only authenticated users can access
- Audit logging for all operations
- Soft delete (tokens can be recovered)

### Functions
- `log_token_access()` - Logs access to audit trail
- `soft_delete_token()` - Soft deletes a token
- `get_expiring_tokens()` - Returns tokens expiring soon

### Indexes
- Fast search by service name
- Fast filtering by status and priority
- Optimized for tag searches
- Audit log indexed for performance

## Verification

After applying the migration, verify it worked:

1. **Check tables exist:**
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_name IN (
     'master_controller_tokens',
     'token_vault_audit_log',
     'token_vault_settings'
   );
   ```

2. **Verify RLS policies:**
   ```sql
   SELECT schemaname, tablename, policyname
   FROM pg_policies
   WHERE tablename LIKE '%token%';
   ```

3. **Test Token Vault tab:**
   - Navigate to https://saabuildingblocks.com/master-controller
   - Click "Token Vault" tab
   - You should see the master password setup screen
   - Try creating a master password

## What's Next

Once migration is applied:
- Token Vault tab will be fully functional
- You can set up a master password
- You can start adding encrypted credentials
- All tokens will be encrypted client-side with AES-256-GCM

## Current Status

✅ Token Vault tab integrated and visible
✅ Encryption library implemented
✅ UI components built and tested
✅ Password validation updated (10 char minimum)
✅ Migration SQL prepared and ready
⏳ **PENDING:** Apply migration via Supabase dashboard
⏳ **PENDING:** Test end-to-end functionality

## Need Help?

If you encounter any errors during migration:
1. Check Supabase dashboard for error messages
2. Verify you're logged into the correct project
3. Ensure you have admin/owner permissions
4. The migration uses `IF NOT EXISTS` clauses, so it's safe to run multiple times
