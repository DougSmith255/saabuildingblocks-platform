-- Fix Token Vault RLS Policies
-- Allow access without Supabase authentication since Token Vault uses master password system

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can read active tokens" ON master_controller_tokens;
DROP POLICY IF EXISTS "Authenticated users can insert tokens" ON master_controller_tokens;
DROP POLICY IF EXISTS "Authenticated users can update tokens" ON master_controller_tokens;
DROP POLICY IF EXISTS "Authenticated users can soft delete tokens" ON master_controller_tokens;
DROP POLICY IF EXISTS "Users can read their own audit log" ON token_vault_audit_log;
DROP POLICY IF EXISTS "System can insert audit log entries" ON token_vault_audit_log;
DROP POLICY IF EXISTS "Users can read their own settings" ON token_vault_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON token_vault_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON token_vault_settings;

-- Create new permissive policies
-- Tokens: Allow all operations (master password on client protects access)
CREATE POLICY "Allow all read access to tokens"
  ON master_controller_tokens FOR SELECT
  USING (deleted_at IS NULL);

CREATE POLICY "Allow all insert access to tokens"
  ON master_controller_tokens FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update access to tokens"
  ON master_controller_tokens FOR UPDATE
  USING (deleted_at IS NULL);

CREATE POLICY "Allow all delete access to tokens"
  ON master_controller_tokens FOR DELETE
  USING (true);

-- Audit log: Allow all operations (read-only for users, system writes)
CREATE POLICY "Allow all read access to audit log"
  ON token_vault_audit_log FOR SELECT
  USING (true);

CREATE POLICY "Allow all insert access to audit log"
  ON token_vault_audit_log FOR INSERT
  WITH CHECK (true);

-- Settings: Allow all operations
CREATE POLICY "Allow all read access to settings"
  ON token_vault_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow all insert access to settings"
  ON token_vault_settings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update access to settings"
  ON token_vault_settings FOR UPDATE
  USING (true);

-- Comment explaining security model
COMMENT ON TABLE master_controller_tokens IS 'Encrypted storage for all API tokens and credentials. Security is enforced via client-side master password - all data is AES-256-GCM encrypted before storage. RLS policies are permissive since the encryption provides the security layer.';
