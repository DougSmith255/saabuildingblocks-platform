/**
 * Sync Status Component
 * Master Controller - Phase 9: Supabase Integration
 * Shows cloud sync status and provides manual sync controls
 */

'use client';

import React from 'react';
import { useAutoSync } from '../hooks/useAutoSync';
import { loadFromCloud, saveToCloud } from '../lib/supabaseSync';
import { getCurrentUser } from '../lib/supabaseClient';
import { useTypographyStore } from '../stores/typographyStore';
import { useBrandColorsStore } from '../stores/brandColorsStore';
import { useSpacingStore } from '../stores/spacingStore';

export function SyncStatus() {
  const {
    state,
    lastSynced,
    error,
    isAuthenticated,
    isConfigured,
    manualSync,
  } = useAutoSync();

  const [isLoading, setIsLoading] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const typographyStore = useTypographyStore();
  const brandColorsStore = useBrandColorsStore();
  const spacingStore = useSpacingStore();

  /**
   * Handle manual save to cloud
   */
  const handleSaveToCloud = async () => {
    if (!isAuthenticated) {
      setActionError('Please login to save to cloud');
      return;
    }

    setIsLoading(true);
    setActionError(null);

    try {
      const user = await getCurrentUser();
      if (!user) {
        setActionError('User not found');
        return;
      }

      const settings = {
        typography: typographyStore.settings,
        brandColors: brandColorsStore.settings,
        spacing: spacingStore.settings,
      };

      const result = await saveToCloud(user.id, settings);

      if (result.success) {
        alert('Settings saved to cloud successfully!');
      } else {
        setActionError(result.error || 'Failed to save to cloud');
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle load from cloud
   */
  const handleLoadFromCloud = async () => {
    if (!isAuthenticated) {
      setActionError('Please login to load from cloud');
      return;
    }

    const confirmed = window.confirm(
      'This will overwrite your current local settings with cloud data. Continue?'
    );

    if (!confirmed) return;

    setIsLoading(true);
    setActionError(null);

    try {
      const user = await getCurrentUser();
      if (!user) {
        setActionError('User not found');
        return;
      }

      const result = await loadFromCloud(user.id);

      if (result.success && result.data) {
        // Update all stores using batchUpdate
        const { typography_settings, brand_colors_settings, spacing_settings } = result.data;

        typographyStore.batchUpdate(typography_settings);
        brandColorsStore.batchUpdate(brand_colors_settings);
        spacingStore.batchUpdate(spacing_settings);

        alert('Settings loaded from cloud successfully!');
      } else if (result.success && !result.data) {
        setActionError('No cloud data found');
      } else {
        setActionError(result.error || 'Failed to load from cloud');
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if not configured
  if (!isConfigured) {
    return (
      <div className="rounded-lg border border-yellow-600 bg-yellow-50 p-3 dark:bg-yellow-950">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Cloud sync not configured. Add Supabase credentials to .env.local
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border border-blue-600 bg-blue-50 p-3 dark:bg-blue-950">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Login required for cloud sync features
        </p>
      </div>
    );
  }

  // Get status icon and color
  const getStatusDisplay = () => {
    switch (state) {
      case 'syncing':
        return {
          icon: '🔄',
          text: 'Syncing...',
          color: 'text-blue-600 dark:text-blue-400',
        };
      case 'synced':
        return {
          icon: '✓',
          text: 'Synced',
          color: 'text-green-600 dark:text-green-400',
        };
      case 'error':
        return {
          icon: '✗',
          text: 'Error',
          color: 'text-red-600 dark:text-red-400',
        };
      default:
        return {
          icon: '☁',
          text: 'Ready',
          color: 'text-gray-600 dark:text-gray-400',
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="space-y-3 rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{status.icon}</span>
          <span className={`text-sm font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>
        <button
          onClick={manualSync}
          disabled={isLoading || state === 'syncing'}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sync Now
        </button>
      </div>

      {/* Last Synced Timestamp */}
      {lastSynced && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Last synced: {lastSynced.toLocaleString()}
        </p>
      )}

      {/* Error Message */}
      {(error || actionError) && (
        <div className="rounded bg-red-50 p-2 dark:bg-red-950">
          <p className="text-xs text-red-600 dark:text-red-400">
            {error || actionError}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSaveToCloud}
          disabled={isLoading || state === 'syncing'}
          className="flex-1 rounded border border-blue-600 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
        >
          Save to Cloud
        </button>
        <button
          onClick={handleLoadFromCloud}
          disabled={isLoading || state === 'syncing'}
          className="flex-1 rounded border border-green-600 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900"
        >
          Load from Cloud
        </button>
      </div>
    </div>
  );
}
