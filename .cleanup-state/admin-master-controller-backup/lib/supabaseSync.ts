/**
 * Supabase Sync Service
 * Master Controller - Phase 9: Supabase Integration
 */

import { getSupabaseClient } from './supabaseClient';
import type { TypographySettings, BrandColorsSettings, SpacingSettings } from '../types';

// Database types
export interface MasterControllerSettings {
  id: string;
  user_id: string;
  typography_settings: TypographySettings;
  brand_colors_settings: BrandColorsSettings;
  spacing_settings: SpacingSettings;
  updated_at: string;
  created_at: string;
}

export interface SyncResult {
  success: boolean;
  data?: MasterControllerSettings;
  error?: string;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSynced: Date | null;
  error: string | null;
}

/**
 * Save all settings to Supabase cloud
 */
export async function saveToCloud(
  userId: string,
  settings: {
    typography: TypographySettings;
    brandColors: BrandColorsSettings;
    spacing: SpacingSettings;
  }
): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('master_controller_settings')
      .upsert({
        user_id: userId,
        typography_settings: settings.typography,
        brand_colors_settings: settings.brandColors,
        spacing_settings: settings.spacing,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving to cloud:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as MasterControllerSettings };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to save to cloud:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Load settings from Supabase cloud
 */
export async function loadFromCloud(userId: string): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('master_controller_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // No data found is not necessarily an error
      if (error.code === 'PGRST116') {
        return { success: true, data: undefined };
      }
      console.error('Error loading from cloud:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as MasterControllerSettings };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to load from cloud:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete settings from Supabase cloud
 */
export async function deleteFromCloud(userId: string): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('master_controller_settings')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting from cloud:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to delete from cloud:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Bi-directional sync: merge localStorage and cloud data
 * Returns the most recent version based on timestamps
 */
export async function syncSettings(
  userId: string,
  localSettings: {
    typography: TypographySettings;
    brandColors: BrandColorsSettings;
    spacing: SpacingSettings;
  },
  localUpdatedAt?: Date
): Promise<SyncResult & { shouldUpdateLocal?: boolean; shouldUpdateCloud?: boolean }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Load from cloud
    const cloudResult = await loadFromCloud(userId);

    if (!cloudResult.success) {
      return cloudResult;
    }

    // No cloud data exists, save local to cloud
    if (!cloudResult.data) {
      const saveResult = await saveToCloud(userId, localSettings);
      return { ...saveResult, shouldUpdateLocal: false, shouldUpdateCloud: false };
    }

    // Compare timestamps to determine which is newer
    const cloudUpdatedAt = new Date(cloudResult.data.updated_at);
    const localUpdated = localUpdatedAt || new Date(0); // Default to very old if not provided

    // Cloud is newer
    if (cloudUpdatedAt > localUpdated) {
      return {
        success: true,
        data: cloudResult.data,
        shouldUpdateLocal: true,
        shouldUpdateCloud: false,
      };
    }

    // Local is newer
    if (localUpdated > cloudUpdatedAt) {
      const saveResult = await saveToCloud(userId, localSettings);
      return {
        ...saveResult,
        shouldUpdateLocal: false,
        shouldUpdateCloud: false,
      };
    }

    // Same timestamp, no sync needed
    return {
      success: true,
      data: cloudResult.data,
      shouldUpdateLocal: false,
      shouldUpdateCloud: false,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to sync settings:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Get sync status for a user
 */
export async function getSyncStatus(userId: string): Promise<{
  hasCloudData: boolean;
  lastSynced: Date | null;
  error: string | null;
}> {
  try {
    const result = await loadFromCloud(userId);

    return {
      hasCloudData: Boolean(result.data),
      lastSynced: result.data ? new Date(result.data.updated_at) : null,
      error: result.error || null,
    };
  } catch (error) {
    return {
      hasCloudData: false,
      lastSynced: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
