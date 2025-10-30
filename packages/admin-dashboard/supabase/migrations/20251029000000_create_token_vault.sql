-- Token Vault: Encrypted Credential Storage System
-- Created: 2025-10-29
-- Purpose: Centralized, encrypted storage for all API tokens and credentials

-- Main tokens table
CREATE TABLE IF NOT EXISTS master_controller_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  token_type TEXT NOT NULL,
  encrypted_value TEXT NOT NULL,
  encryption_key_hint TEXT, -- Last 4 chars for verification
  regeneration_url TEXT,
  regeneration_instructions TEXT,
  expiration_date TIMESTAMPTZ,
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT CHECK (status IN ('active', 'expired', 'revoked', 'testing')) DEFAULT 'active',
  usage_notes TEXT,
  priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
  tags TEXT[] DEFAULT '{}'::TEXT[],

  -- Metadata
  used_by TEXT[], -- Array of services/files that use this token
  last_accessed TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,

  -- Soft delete support
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Audit log table
CREATE TABLE IF NOT EXISTS token_vault_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES master_controller_tokens(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('view', 'decrypt', 'create', 'update', 'delete', 'export')),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT now(),
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

-- Token vault settings table (per-user preferences)
CREATE TABLE IF NOT EXISTS token_vault_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_lock_minutes INTEGER DEFAULT 15 CHECK (auto_lock_minutes > 0 AND auto_lock_minutes <= 120),
  clipboard_clear_seconds INTEGER DEFAULT 30 CHECK (clipboard_clear_seconds > 0 AND clipboard_clear_seconds <= 300),
  require_2fa BOOLEAN DEFAULT false,
  theme TEXT DEFAULT 'cyber' CHECK (theme IN ('cyber', 'dark', 'light')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_tokens_service ON master_controller_tokens(service_name) WHERE deleted_at IS NULL;
CREATE INDEX idx_tokens_status ON master_controller_tokens(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tokens_priority ON master_controller_tokens(priority) WHERE deleted_at IS NULL;
CREATE INDEX idx_tokens_expiration ON master_controller_tokens(expiration_date) WHERE expiration_date IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_tokens_tags ON master_controller_tokens USING GIN(tags) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_token ON token_vault_audit_log(token_id, timestamp DESC);
CREATE INDEX idx_audit_user ON token_vault_audit_log(user_id, timestamp DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE master_controller_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_vault_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_vault_settings ENABLE ROW LEVEL SECURITY;

-- Tokens: Only authenticated users can access
CREATE POLICY "Authenticated users can read active tokens"
  ON master_controller_tokens FOR SELECT
  USING (auth.role() = 'authenticated' AND deleted_at IS NULL);

CREATE POLICY "Authenticated users can insert tokens"
  ON master_controller_tokens FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tokens"
  ON master_controller_tokens FOR UPDATE
  USING (auth.role() = 'authenticated' AND deleted_at IS NULL);

CREATE POLICY "Authenticated users can soft delete tokens"
  ON master_controller_tokens FOR UPDATE
  USING (auth.role() = 'authenticated' AND deleted_at IS NULL);

-- Audit log: Users can read their own audit entries
CREATE POLICY "Users can read their own audit log"
  ON token_vault_audit_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit log entries"
  ON token_vault_audit_log FOR INSERT
  WITH CHECK (true);

-- Settings: Users can manage their own settings
CREATE POLICY "Users can read their own settings"
  ON token_vault_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON token_vault_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON token_vault_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_token_last_accessed()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed = now();
  NEW.access_count = OLD.access_count + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER token_access_trigger
  BEFORE UPDATE OF encrypted_value ON master_controller_tokens
  FOR EACH ROW
  WHEN (OLD.encrypted_value IS DISTINCT FROM NEW.encrypted_value)
  EXECUTE FUNCTION update_token_last_accessed();

-- Function to log token access
CREATE OR REPLACE FUNCTION log_token_access(
  p_token_id UUID,
  p_action TEXT,
  p_success BOOLEAN DEFAULT true,
  p_error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO token_vault_audit_log (
    token_id,
    action,
    user_id,
    success,
    error_message
  ) VALUES (
    p_token_id,
    p_action,
    auth.uid(),
    p_success,
    p_error_message
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to soft delete tokens
CREATE OR REPLACE FUNCTION soft_delete_token(p_token_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE master_controller_tokens
  SET deleted_at = now(),
      deleted_by = auth.uid()
  WHERE id = p_token_id
    AND deleted_at IS NULL;

  PERFORM log_token_access(p_token_id, 'delete', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check expiring tokens
CREATE OR REPLACE FUNCTION get_expiring_tokens(days_threshold INTEGER DEFAULT 30)
RETURNS TABLE (
  id UUID,
  service_name TEXT,
  token_type TEXT,
  expiration_date TIMESTAMPTZ,
  days_until_expiration INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.service_name,
    t.token_type,
    t.expiration_date,
    EXTRACT(DAY FROM (t.expiration_date - now()))::INTEGER as days_until_expiration
  FROM master_controller_tokens t
  WHERE t.expiration_date IS NOT NULL
    AND t.expiration_date > now()
    AND t.expiration_date <= (now() + INTERVAL '1 day' * days_threshold)
    AND t.deleted_at IS NULL
    AND t.status = 'active'
  ORDER BY t.expiration_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default settings for first user
INSERT INTO token_vault_settings (user_id, auto_lock_minutes, clipboard_clear_seconds)
SELECT id, 15, 30
FROM auth.users
WHERE id = (SELECT id FROM auth.users LIMIT 1)
ON CONFLICT (user_id) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE master_controller_tokens IS 'Encrypted storage for all API tokens and credentials';
COMMENT ON TABLE token_vault_audit_log IS 'Audit trail of all token vault access and modifications';
COMMENT ON TABLE token_vault_settings IS 'Per-user preferences for Token Vault behavior';
COMMENT ON COLUMN master_controller_tokens.encrypted_value IS 'AES-256-GCM encrypted token value';
COMMENT ON COLUMN master_controller_tokens.encryption_key_hint IS 'Last 4 characters for verification';
COMMENT ON COLUMN master_controller_tokens.priority IS 'critical=production blocking, high=security sensitive, medium=development, low=optional';
COMMENT ON FUNCTION log_token_access IS 'Logs token access to audit trail';
COMMENT ON FUNCTION soft_delete_token IS 'Soft deletes a token (can be restored)';
COMMENT ON FUNCTION get_expiring_tokens IS 'Returns tokens expiring within threshold days';
