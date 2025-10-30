-- Role-Based Access Control (RBAC) Migration
-- Created: 2025-10-29
-- Purpose: Add two-tier role system (admin/team_member) to existing auth system

-- ========================================
-- STEP 1: Add role column to users table (if not exists)
-- ========================================

-- Check if users table exists, if not create it
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'team_member' CHECK (role IN ('admin', 'team_member')),
  permissions TEXT[] DEFAULT '{}'::TEXT[],
  email_verified BOOLEAN DEFAULT false,
  email_verification_pending BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add role column if it doesn't exist (for existing users table)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'team_member' CHECK (role IN ('admin', 'team_member'));
  END IF;
END $$;

-- Ensure role has proper constraint
DO $$
BEGIN
  ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
  ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'team_member'));
END $$;

-- ========================================
-- STEP 2: Create role management helper functions
-- ========================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = required_role
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM users
  WHERE id = auth.uid()
  AND is_active = true;

  RETURN COALESCE(user_role, 'team_member');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STEP 3: Update Token Vault RLS policies for admin-only access
-- ========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can read active tokens" ON master_controller_tokens;
DROP POLICY IF EXISTS "Authenticated users can insert tokens" ON master_controller_tokens;
DROP POLICY IF EXISTS "Authenticated users can update tokens" ON master_controller_tokens;
DROP POLICY IF EXISTS "Authenticated users can soft delete tokens" ON master_controller_tokens;

-- NEW: Admin-only policies for tokens
CREATE POLICY "Only admins can read tokens"
  ON master_controller_tokens FOR SELECT
  USING (is_admin() AND deleted_at IS NULL);

CREATE POLICY "Only admins can insert tokens"
  ON master_controller_tokens FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update tokens"
  ON master_controller_tokens FOR UPDATE
  USING (is_admin() AND deleted_at IS NULL);

CREATE POLICY "Only admins can delete tokens"
  ON master_controller_tokens FOR DELETE
  USING (is_admin());

-- ========================================
-- STEP 4: Update Token Vault Settings policies
-- ========================================

DROP POLICY IF EXISTS "Users can read their own settings" ON token_vault_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON token_vault_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON token_vault_settings;

-- NEW: Admin-only settings access
CREATE POLICY "Only admins can read token vault settings"
  ON token_vault_settings FOR SELECT
  USING (is_admin() AND auth.uid() = user_id);

CREATE POLICY "Only admins can insert token vault settings"
  ON token_vault_settings FOR INSERT
  WITH CHECK (is_admin() AND auth.uid() = user_id);

CREATE POLICY "Only admins can update token vault settings"
  ON token_vault_settings FOR UPDATE
  USING (is_admin() AND auth.uid() = user_id);

-- ========================================
-- STEP 5: Update Audit Log policies
-- ========================================

DROP POLICY IF EXISTS "Users can read their own audit log" ON token_vault_audit_log;
DROP POLICY IF EXISTS "System can insert audit log entries" ON token_vault_audit_log;

-- NEW: Admin can read all audit logs, team members can't access
CREATE POLICY "Only admins can read audit logs"
  ON token_vault_audit_log FOR SELECT
  USING (is_admin());

CREATE POLICY "System can insert audit log entries"
  ON token_vault_audit_log FOR INSERT
  WITH CHECK (true);

-- ========================================
-- STEP 6: Create Master Controller Settings RLS
-- ========================================

-- Assuming master_controller_settings table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'master_controller_settings') THEN
    -- Enable RLS
    ALTER TABLE master_controller_settings ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if any
    DROP POLICY IF EXISTS "Authenticated users can read settings" ON master_controller_settings;
    DROP POLICY IF EXISTS "Authenticated users can update settings" ON master_controller_settings;

    -- Admin: full access, Team members: read-only
    EXECUTE 'CREATE POLICY "Admins have full access to settings"
      ON master_controller_settings FOR ALL
      USING (is_admin())';

    EXECUTE 'CREATE POLICY "Team members can read settings"
      ON master_controller_settings FOR SELECT
      USING (has_role(''team_member''))';
  END IF;
END $$;

-- ========================================
-- STEP 7: Create role management table for audit
-- ========================================

CREATE TABLE IF NOT EXISTS role_changes_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  old_role TEXT,
  new_role TEXT NOT NULL CHECK (new_role IN ('admin', 'team_member')),
  changed_by UUID REFERENCES auth.users(id),
  reason TEXT,
  ip_address INET,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- RLS for role changes log
ALTER TABLE role_changes_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read role changes"
  ON role_changes_log FOR SELECT
  USING (is_admin());

CREATE POLICY "Only admins can insert role changes"
  ON role_changes_log FOR INSERT
  WITH CHECK (is_admin());

-- Index for performance
CREATE INDEX idx_role_changes_user ON role_changes_log(user_id, timestamp DESC);
CREATE INDEX idx_role_changes_changed_by ON role_changes_log(changed_by, timestamp DESC);

-- ========================================
-- STEP 8: Create trigger to log role changes
-- ========================================

CREATE OR REPLACE FUNCTION log_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO role_changes_log (user_id, old_role, new_role, changed_by, reason)
    VALUES (NEW.id, OLD.role, NEW.role, auth.uid(), 'Role updated via admin action');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS role_change_trigger ON users;
CREATE TRIGGER role_change_trigger
  AFTER UPDATE OF role ON users
  FOR EACH ROW
  EXECUTE FUNCTION log_role_change();

-- ========================================
-- STEP 9: Create function to change user role (admin only)
-- ========================================

CREATE OR REPLACE FUNCTION change_user_role(
  p_user_id UUID,
  p_new_role TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_old_role TEXT;
  v_result JSONB;
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'PERMISSION_DENIED',
      'message', 'Only admins can change user roles'
    );
  END IF;

  -- Validate new role
  IF p_new_role NOT IN ('admin', 'team_member') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'INVALID_ROLE',
      'message', 'Role must be either admin or team_member'
    );
  END IF;

  -- Get current role
  SELECT role INTO v_old_role
  FROM users
  WHERE id = p_user_id;

  IF v_old_role IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'USER_NOT_FOUND',
      'message', 'User not found'
    );
  END IF;

  -- Update role
  UPDATE users
  SET role = p_new_role,
      updated_at = now()
  WHERE id = p_user_id;

  -- Log the change
  INSERT INTO role_changes_log (user_id, old_role, new_role, changed_by, reason)
  VALUES (p_user_id, v_old_role, p_new_role, auth.uid(), p_reason);

  RETURN jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'user_id', p_user_id,
      'old_role', v_old_role,
      'new_role', p_new_role
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STEP 10: Create default admin user
-- ========================================

-- Set first user as admin (if exists)
DO $$
DECLARE
  first_user_id UUID;
BEGIN
  SELECT id INTO first_user_id
  FROM users
  ORDER BY created_at ASC
  LIMIT 1;

  IF first_user_id IS NOT NULL THEN
    UPDATE users
    SET role = 'admin'
    WHERE id = first_user_id;

    RAISE NOTICE 'Set first user (%) as admin', first_user_id;
  END IF;
END $$;

-- ========================================
-- STEP 11: Create indexes for performance
-- ========================================

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE is_active = true;

-- ========================================
-- STEP 12: Add comments for documentation
-- ========================================

COMMENT ON COLUMN users.role IS 'User role: admin (full access) or team_member (limited access)';
COMMENT ON FUNCTION is_admin() IS 'Returns true if current user is an active admin';
COMMENT ON FUNCTION has_role(TEXT) IS 'Returns true if current user has the specified role';
COMMENT ON FUNCTION get_user_role() IS 'Returns the current user role';
COMMENT ON FUNCTION change_user_role(UUID, TEXT, TEXT) IS 'Changes a user role (admin only)';
COMMENT ON TABLE role_changes_log IS 'Audit log of all role changes';

-- ========================================
-- STEP 13: Grant necessary permissions
-- ========================================

-- Grant execute on functions to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION has_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION change_user_role(UUID, TEXT, TEXT) TO authenticated;

-- ========================================
-- Migration Complete
-- ========================================

-- Verify setup
DO $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count
  FROM users
  WHERE role = 'admin' AND is_active = true;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'RBAC Migration Complete';
  RAISE NOTICE 'Active Admins: %', admin_count;
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Available Roles: admin, team_member';
  RAISE NOTICE 'Admin Permissions: Full access to Token Vault, Master Controller, all settings';
  RAISE NOTICE 'Team Member Permissions: Read-only access to Master Controller, NO Token Vault access';
  RAISE NOTICE '========================================';
END $$;
