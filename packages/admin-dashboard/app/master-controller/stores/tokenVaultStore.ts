/**
 * Token Vault Zustand Store
 *
 * Manages state for the encrypted credential vault including:
 * - Token list (encrypted in Supabase, decrypted client-side)
 * - Lock/unlock status with auto-lock
 * - Master password management (never stored, only hashed)
 * - Settings (auto-lock timeout, clipboard timeout, 2FA)
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  encryptToken,
  decryptToken,
  hashMasterPassword,
  shouldAutoLock,
  type TokenVaultEncryptedToken
} from '@/lib/encryption/tokenVault';
import { createClient } from '@/lib/supabase/client';

// Types
export interface TokenLocation {
  type: 'env' | 'github';
  file?: string; // For env type: .env.local, .env.production, etc.
  variable?: string; // For env type: CLOUDFLARE_API_TOKEN, etc.
  path?: string; // For env type: Full file path
  repo?: string; // For github type: Repository name
  owner?: string; // For github type: Repository owner
  secret?: string; // For github type: GitHub secret name
  description?: string; // Human-readable description of usage
}

export interface Token {
  id: string;
  serviceName: string;
  tokenType: string;
  encryptedValue: string;
  iv: string;
  salt: string;
  keyHint?: string; // Optional - extracted from encrypted data if needed
  regenerationUrl?: string;
  regenerationInstructions?: string;
  expirationDate?: string;
  lastUpdated: string;
  createdAt: string;
  status: 'active' | 'expired' | 'revoked' | 'testing';
  usageNotes?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];
  usedBy?: string[];
  lastAccessed?: string;
  accessCount: number;
  locations?: TokenLocation[]; // WHERE this token is used (env files, GitHub secrets, etc.)
}

export interface TokenVaultSettings {
  autoLockMinutes: number;
  clipboardClearSeconds: number;
  require2FA: boolean;
  theme: 'cyber' | 'dark' | 'light';
}

export interface AuditLogEntry {
  id: string;
  tokenId: string;
  action: 'view' | 'decrypt' | 'create' | 'update' | 'delete' | 'export';
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

interface TokenVaultState {
  // State
  tokens: Token[];
  isLocked: boolean;
  lastUnlockTime: number;
  masterPasswordHash: string | null;
  settings: TokenVaultSettings;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filterStatus: 'all' | 'active' | 'expired' | 'revoked' | 'testing';
  filterPriority: 'all' | 'critical' | 'high' | 'medium' | 'low';
  sortBy: 'serviceName' | 'priority' | 'status' | 'lastUpdated' | 'expirationDate';
  sortOrder: 'asc' | 'desc';
  fetchRetryCount: number;

  // Actions
  initialize: () => Promise<void>;
  unlock: (masterPassword: string) => Promise<boolean>;
  lock: () => void;
  checkAutoLock: () => void;

  // Token CRUD
  fetchTokens: () => Promise<void>;
  addToken: (token: Omit<Token, 'id' | 'createdAt' | 'lastUpdated' | 'accessCount'>, masterPassword: string) => Promise<void>;
  updateToken: (id: string, updates: Partial<Token>, masterPassword?: string) => Promise<void>;
  deleteToken: (id: string) => Promise<void>;
  decryptTokenValue: (id: string, masterPassword: string) => Promise<string>;

  // Settings
  updateSettings: (settings: Partial<TokenVaultSettings>) => Promise<void>;

  // Filters & Search
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: TokenVaultState['filterStatus']) => void;
  setFilterPriority: (priority: TokenVaultState['filterPriority']) => void;
  setSortBy: (sortBy: TokenVaultState['sortBy']) => void;
  setSortOrder: (order: TokenVaultState['sortOrder']) => void;

  // Audit Log
  logTokenAccess: (tokenId: string, action: AuditLogEntry['action'], success: boolean, errorMessage?: string) => Promise<void>;

  // Utility
  getFilteredTokens: () => Token[];
  getExpiringTokens: (daysThreshold: number) => Token[];
  clearError: () => void;
}

// Create store
export const useTokenVaultStore = create<TokenVaultState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        tokens: [],
        isLocked: false, // ALWAYS UNLOCKED - Password authentication disabled
        lastUnlockTime: Date.now(),
        masterPasswordHash: null, // Not used - password disabled
        settings: {
          autoLockMinutes: 999999, // Effectively disabled
          clipboardClearSeconds: 30,
          require2FA: false,
          theme: 'cyber'
        },
        isLoading: false,
        error: null,
        searchQuery: '',
        filterStatus: 'all',
        filterPriority: 'all',
        sortBy: 'serviceName',
        sortOrder: 'asc',
        fetchRetryCount: 0,

        // Initialize: Load settings and fetch tokens (no password required)
        initialize: async () => {
          try {
            // Token Vault initialization - password authentication disabled
            // Vault is always unlocked and ready to use

            // Optionally try to load user settings if Supabase is available
            // This is graceful - failure won't block vault access
            try {
              const supabase = createClient();
              const { data: { user } } = await supabase.auth.getUser();

              if (user) {
                // Load user settings if authenticated (optional)
                const { data: settings, error } = await supabase
                  .from('token_vault_settings')
                  .select('*')
                  .eq('user_id', user.id)
                  .single();

                if (!error && settings) {
                  set({
                    settings: {
                      autoLockMinutes: settings.auto_lock_minutes,
                      clipboardClearSeconds: settings.clipboard_clear_seconds,
                      require2FA: settings.require_2fa,
                      theme: settings.theme
                    }
                  });
                }
              }
            } catch (settingsError) {
              // Silently fail - settings are optional
              console.log('Settings load optional, skipped:', settingsError);
            }

            // Vault is ready and unlocked
            // TokenList component will handle fetching tokens
            set({ error: null });
          } catch (error) {
            console.error('Failed to initialize Token Vault:', error);
            set({ error: error instanceof Error ? error.message : 'Initialization failed' });
          }
        },

        // Unlock vault with master password
        unlock: async (masterPassword: string) => {
          try {
            set({ isLoading: true, error: null });

            // Hash the provided password
            const passwordHash = await hashMasterPassword(masterPassword);

            // Check if this is the first time (no stored hash)
            const storedHash = get().masterPasswordHash;
            if (!storedHash) {
              // First-time setup: store the hash
              set({
                isLocked: false,
                lastUnlockTime: Date.now(),
                masterPasswordHash: passwordHash,
                isLoading: false
              });
              return true;
            }

            // Verify password matches stored hash
            if (passwordHash !== storedHash) {
              set({ error: 'Incorrect master password', isLoading: false });
              return false;
            }

            // Unlock successful
            set({
              isLocked: false,
              lastUnlockTime: Date.now(),
              error: null,
              isLoading: false
            });

            // Fetch tokens after unlock
            await get().fetchTokens();

            return true;
          } catch (error) {
            console.error('Unlock error:', error);
            set({
              error: error instanceof Error ? error.message : 'Failed to unlock',
              isLoading: false
            });
            return false;
          }
        },

        // Lock vault
        lock: () => {
          set({
            isLocked: true,
            lastUnlockTime: 0,
            tokens: [] // Clear tokens from memory
          });
        },

        // Check if vault should auto-lock (DISABLED - vault always unlocked)
        checkAutoLock: () => {
          // No-op: Auto-lock is disabled, vault remains unlocked
          return;
        },

        // Fetch all tokens from database
        fetchTokens: async () => {
          // Only run on client side
          if (typeof window === 'undefined') {
            console.log('[Token Vault] Skipping fetchTokens on server side');
            return;
          }

          const MAX_RETRIES = 1; // Reduced from 3 to fail faster
          const RETRY_DELAY_MS = 500; // Reduced from 1000ms

          try {
            set({ isLoading: true, error: null });

            // Check retry count to prevent infinite loops
            const currentRetryCount = get().fetchRetryCount;
            if (currentRetryCount >= MAX_RETRIES) {
              throw new Error(
                'Failed to connect to database. Please refresh the page.'
              );
            }

            const supabase = createClient();
            const { data, error } = await supabase
              .from('master_controller_tokens')
              .select('*')
              .is('deleted_at', null)
              .order('service_name', { ascending: true });

            if (error) {
              // Check if it's a "table does not exist" error
              if (error.code === '42P01' || error.message.includes('does not exist')) {
                throw new Error(
                  'Token Vault database tables have not been created yet. Please apply the migration by following the instructions in TOKEN_VAULT_MIGRATION_INSTRUCTIONS.md'
                );
              }
              throw error;
            }

            // Transform database format to store format
            const tokens: Token[] = (data || []).map((row: any) => ({
              id: row.id,
              serviceName: row.service_name,
              tokenType: row.token_type,
              encryptedValue: row.encrypted_value,
              iv: row.encrypted_value, // Extract from encrypted_value JSON
              salt: row.encrypted_value, // Extract from encrypted_value JSON
              keyHint: row.encryption_key_hint || '',
              regenerationUrl: row.regeneration_url,
              regenerationInstructions: row.regeneration_instructions,
              expirationDate: row.expiration_date,
              lastUpdated: row.last_updated,
              createdAt: row.created_at,
              status: row.status,
              usageNotes: row.usage_notes,
              priority: row.priority,
              tags: row.tags || [],
              usedBy: row.used_by || [],
              lastAccessed: row.last_accessed,
              accessCount: row.access_count || 0,
              locations: row.locations || [] // Location mapping metadata
            }));

            set({ tokens, isLoading: false, fetchRetryCount: 0 });
          } catch (error) {
            console.error('Failed to fetch tokens:', error);

            const currentRetryCount = get().fetchRetryCount;
            const shouldRetry = currentRetryCount < MAX_RETRIES &&
                               !(error instanceof Error && error.message.includes('Maximum retry attempts'));

            if (shouldRetry) {
              // Increment retry count and retry after delay
              set({ fetchRetryCount: currentRetryCount + 1 });

              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (currentRetryCount + 1)));
              return get().fetchTokens();
            }

            set({
              error: error instanceof Error ? error.message : 'Failed to fetch tokens',
              isLoading: false,
              fetchRetryCount: 0
            });
          }
        },

        // Add new token
        addToken: async (token, masterPassword) => {
          try {
            set({ isLoading: true, error: null });

            // Encrypt the token value
            const encryptedToken = await encryptToken(token.encryptedValue, masterPassword);

            // Store encrypted token JSON
            const encryptedData = JSON.stringify(encryptedToken);

            const supabase = createClient();
            const { data, error } = await supabase
              .from('master_controller_tokens')
              .insert({
                service_name: token.serviceName,
                token_type: token.tokenType,
                encrypted_value: encryptedData,
                // encryption_key_hint will be extracted from encryptedData JSON when needed
                regeneration_url: token.regenerationUrl,
                regeneration_instructions: token.regenerationInstructions,
                expiration_date: token.expirationDate,
                status: token.status,
                usage_notes: token.usageNotes,
                priority: token.priority,
                tags: token.tags,
                used_by: token.usedBy,
                locations: token.locations || []
              })
              .select()
              .single();

            if (error) throw error;

            // Add to local state
            const newToken: Token = {
              id: data.id,
              serviceName: data.service_name,
              tokenType: data.token_type,
              encryptedValue: data.encrypted_value,
              iv: encryptedToken.iv,
              salt: encryptedToken.salt,
              // keyHint will be extracted from encryptedData if needed
              regenerationUrl: data.regeneration_url,
              regenerationInstructions: data.regeneration_instructions,
              expirationDate: data.expiration_date,
              lastUpdated: data.last_updated,
              createdAt: data.created_at,
              status: data.status,
              usageNotes: data.usage_notes,
              priority: data.priority,
              tags: data.tags || [],
              usedBy: data.used_by || [],
              accessCount: 0,
              locations: data.locations || []
            };

            set((state) => ({
              tokens: [...state.tokens, newToken],
              isLoading: false
            }));

            // Log access
            await get().logTokenAccess(newToken.id, 'create', true);
          } catch (error) {
            console.error('Failed to add token:', error);
            set({
              error: error instanceof Error ? error.message : 'Failed to add token',
              isLoading: false
            });
            throw error;
          }
        },

        // Update existing token
        updateToken: async (id, updates, masterPassword) => {
          try {
            set({ isLoading: true, error: null });

            const updateData: any = {};

            // If updating token value, re-encrypt
            if (updates.encryptedValue && masterPassword) {
              const encryptedToken = await encryptToken(updates.encryptedValue, masterPassword);
              updateData.encrypted_value = JSON.stringify(encryptedToken);
              // encryption_key_hint will be extracted from encryptedToken JSON if needed
            }

            // Map other fields
            if (updates.serviceName) updateData.service_name = updates.serviceName;
            if (updates.tokenType) updateData.token_type = updates.tokenType;
            if (updates.regenerationUrl !== undefined) updateData.regeneration_url = updates.regenerationUrl;
            if (updates.regenerationInstructions !== undefined) updateData.regeneration_instructions = updates.regenerationInstructions;
            if (updates.expirationDate !== undefined) updateData.expiration_date = updates.expirationDate;
            if (updates.status) updateData.status = updates.status;
            if (updates.usageNotes !== undefined) updateData.usage_notes = updates.usageNotes;
            if (updates.priority) updateData.priority = updates.priority;
            if (updates.tags) updateData.tags = updates.tags;
            if (updates.usedBy) updateData.used_by = updates.usedBy;
            if (updates.locations !== undefined) updateData.locations = updates.locations;

            const supabase = createClient();
            const { error } = await supabase
              .from('master_controller_tokens')
              .update(updateData)
              .eq('id', id);

            if (error) throw error;

            // Update local state
            set((state) => ({
              tokens: state.tokens.map((token) =>
                token.id === id ? { ...token, ...updates, lastUpdated: new Date().toISOString() } : token
              ),
              isLoading: false
            }));

            // Log access
            await get().logTokenAccess(id, 'update', true);
          } catch (error) {
            console.error('Failed to update token:', error);
            set({
              error: error instanceof Error ? error.message : 'Failed to update token',
              isLoading: false
            });
            throw error;
          }
        },

        // Delete token (soft delete)
        deleteToken: async (id) => {
          try {
            set({ isLoading: true, error: null });

            const supabase = createClient();
            const { error } = await supabase.rpc('soft_delete_token', { p_token_id: id });

            if (error) throw error;

            // Remove from local state
            set((state) => ({
              tokens: state.tokens.filter((token) => token.id !== id),
              isLoading: false
            }));
          } catch (error) {
            console.error('Failed to delete token:', error);
            set({
              error: error instanceof Error ? error.message : 'Failed to delete token',
              isLoading: false
            });
            throw error;
          }
        },

        // Decrypt token value
        decryptTokenValue: async (id, masterPassword) => {
          try {
            const token = get().tokens.find((t) => t.id === id);
            if (!token) throw new Error('Token not found');

            // Parse encrypted data from JSON
            const encryptedData: TokenVaultEncryptedToken = JSON.parse(token.encryptedValue);

            // Decrypt
            const decryptedValue = await decryptToken(encryptedData, masterPassword);

            // Log access
            await get().logTokenAccess(id, 'decrypt', true);

            return decryptedValue;
          } catch (error) {
            console.error('Failed to decrypt token:', error);
            await get().logTokenAccess(id, 'decrypt', false, error instanceof Error ? error.message : 'Decryption failed');
            throw error;
          }
        },

        // Update settings
        updateSettings: async (settings) => {
          try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const updateData: any = {};
            if (settings.autoLockMinutes !== undefined) updateData.auto_lock_minutes = settings.autoLockMinutes;
            if (settings.clipboardClearSeconds !== undefined) updateData.clipboard_clear_seconds = settings.clipboardClearSeconds;
            if (settings.require2FA !== undefined) updateData.require_2fa = settings.require2FA;
            if (settings.theme) updateData.theme = settings.theme;

            const { error } = await supabase
              .from('token_vault_settings')
              .upsert({
                user_id: user.id,
                ...updateData
              });

            if (error) throw error;

            set((state) => ({
              settings: { ...state.settings, ...settings }
            }));
          } catch (error) {
            console.error('Failed to update settings:', error);
            set({ error: error instanceof Error ? error.message : 'Failed to update settings' });
            throw error;
          }
        },

        // Search & Filter
        setSearchQuery: (query) => set({ searchQuery: query }),
        setFilterStatus: (status) => set({ filterStatus: status }),
        setFilterPriority: (priority) => set({ filterPriority: priority }),
        setSortBy: (sortBy) => set({ sortBy }),
        setSortOrder: (order) => set({ sortOrder: order }),

        // Get filtered tokens
        getFilteredTokens: () => {
          const { tokens, searchQuery, filterStatus, filterPriority, sortBy, sortOrder } = get();

          let filtered = tokens;

          // Search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
              (token) =>
                token.serviceName.toLowerCase().includes(query) ||
                token.tokenType.toLowerCase().includes(query) ||
                token.usageNotes?.toLowerCase().includes(query) ||
                token.tags.some((tag) => tag.toLowerCase().includes(query))
            );
          }

          // Status filter
          if (filterStatus !== 'all') {
            filtered = filtered.filter((token) => token.status === filterStatus);
          }

          // Priority filter
          if (filterPriority !== 'all') {
            filtered = filtered.filter((token) => token.priority === filterPriority);
          }

          // Sort
          filtered.sort((a, b) => {
            let aValue: any = a[sortBy];
            let bValue: any = b[sortBy];

            // Handle dates
            if (sortBy === 'lastUpdated' || sortBy === 'expirationDate') {
              aValue = aValue ? new Date(aValue).getTime() : 0;
              bValue = bValue ? new Date(bValue).getTime() : 0;
            }

            // Handle strings
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return sortOrder === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }

            // Handle numbers
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
          });

          return filtered;
        },

        // Get expiring tokens
        getExpiringTokens: (daysThreshold = 30) => {
          const now = Date.now();
          const thresholdMs = daysThreshold * 24 * 60 * 60 * 1000;

          return get().tokens.filter((token) => {
            if (!token.expirationDate || token.status !== 'active') return false;
            const expirationTime = new Date(token.expirationDate).getTime();
            const timeUntilExpiration = expirationTime - now;
            return timeUntilExpiration > 0 && timeUntilExpiration <= thresholdMs;
          });
        },

        // Log token access
        logTokenAccess: async (tokenId, action, success, errorMessage) => {
          try {
            const supabase = createClient();
            await supabase.rpc('log_token_access', {
              p_token_id: tokenId,
              p_action: action,
              p_success: success,
              p_error_message: errorMessage || null
            });
          } catch (error) {
            console.error('Failed to log token access:', error);
            // Don't throw - logging failure shouldn't break operations
          }
        },

        // Clear error
        clearError: () => set({ error: null })
      }),
      {
        name: 'token-vault-storage',
        // Only persist these fields (NOT tokens or masterPasswordHash for security)
        partialize: (state) => ({
          settings: state.settings,
          searchQuery: state.searchQuery,
          filterStatus: state.filterStatus,
          filterPriority: state.filterPriority,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder
        })
      }
    ),
    { name: 'TokenVaultStore' }
  )
);

// Auto-lock check interval (run every minute)
if (typeof window !== 'undefined') {
  setInterval(() => {
    useTokenVaultStore.getState().checkAutoLock();
  }, 60000);
}
