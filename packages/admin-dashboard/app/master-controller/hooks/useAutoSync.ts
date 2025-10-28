/**
 * useAutoSync Hook
 * Master Controller - Supabase Cloud Sync System
 *
 * Automatically syncs settings to Supabase cloud storage
 * Includes authentication check and error handling
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTypographyStore } from '../stores/typographyStore';
import { useBrandColorsStore } from '../stores/brandColorsStore';
import { useSpacingStore } from '../stores/spacingStore';
import { saveToCloud, loadFromCloud } from '../lib/supabaseSync';
import { getCurrentUser } from '../lib/supabaseClient';

type SyncState = 'idle' | 'syncing' | 'synced' | 'error';

const AUTO_SYNC_DEBOUNCE = 2000; // 2 seconds
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface AutoSyncStatus {
  state: SyncState;
  lastSynced: Date | null;
  error: string | null;
  isAuthenticated: boolean;
  isConfigured: boolean;
}

/**
 * Auto-sync hook for cloud storage
 * Automatically saves to Supabase when settings change
 */
export function useAutoSync() {
  const [state, setState] = useState<SyncState>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConfigured] = useState(Boolean(SUPABASE_URL && SUPABASE_ANON_KEY));

  const typographySettings = useTypographyStore((state) => state.settings);
  const brandColorsSettings = useBrandColorsStore((state) => state.settings);
  const spacingSettings = useSpacingStore((state) => state.settings);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncedSettingsRef = useRef<string>('');

  /**
   * Check authentication status
   */
  useEffect(() => {
    const checkAuth = async () => {
      if (!isConfigured) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const user = await getCurrentUser();
        setIsAuthenticated(Boolean(user));
      } catch (err) {
        setIsAuthenticated(false);
        console.error('Auth check failed:', err);
      }
    };

    checkAuth();
  }, [isConfigured]);

  /**
   * Perform cloud sync
   */
  const performSync = useCallback(async () => {
    if (!isAuthenticated || !isConfigured) {
      return;
    }

    // Serialize current settings for comparison
    const currentSettings = JSON.stringify({
      typography: typographySettings,
      brandColors: brandColorsSettings,
      spacing: spacingSettings,
    });

    // Skip if settings haven't changed
    if (currentSettings === lastSyncedSettingsRef.current) {
      return;
    }

    setState('syncing');
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const result = await saveToCloud(user.id, {
        typography: typographySettings,
        brandColors: brandColorsSettings,
        spacing: spacingSettings,
      });

      if (result.success) {
        setState('synced');
        setLastSynced(new Date());
        setError(null);
        lastSyncedSettingsRef.current = currentSettings;

        if (process.env.NODE_ENV === 'development') {
          console.log('☁️ Cloud sync successful');
        }

        // Reset to idle after 2 seconds
        setTimeout(() => {
          setState('idle');
        }, 2000);
      } else {
        throw new Error(result.error || 'Sync failed');
      }
    } catch (err) {
      setState('error');
      const errorMessage = err instanceof Error ? err.message : 'Unknown sync error';
      setError(errorMessage);
      console.error('❌ Cloud sync failed:', errorMessage);

      // Reset to idle after 5 seconds
      setTimeout(() => {
        setState('idle');
      }, 5000);
    }
  }, [
    isAuthenticated,
    isConfigured,
    typographySettings,
    brandColorsSettings,
    spacingSettings,
  ]);

  /**
   * Schedule debounced sync
   */
  useEffect(() => {
    if (!isAuthenticated || !isConfigured) {
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Schedule new sync
    debounceTimerRef.current = setTimeout(() => {
      performSync();
    }, AUTO_SYNC_DEBOUNCE);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    typographySettings,
    brandColorsSettings,
    spacingSettings,
    isAuthenticated,
    isConfigured,
    performSync,
  ]);

  /**
   * Manual sync trigger
   */
  const manualSync = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    performSync();
  }, [performSync]);

  return {
    state,
    lastSynced,
    error,
    isAuthenticated,
    isConfigured,
    manualSync,
  };
}
