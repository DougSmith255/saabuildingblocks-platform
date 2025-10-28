'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useTypographyStore } from '../master-controller/stores/typographyStore';
import { useBrandColorsStore } from '../master-controller/stores/brandColorsStore';
import { useSpacingStore } from '../master-controller/stores/spacingStore';
import { CSSGenerator } from '../master-controller/lib/cssGenerator';
import { optimizeCSS } from '../master-controller/lib/cssOptimizer';
import { performanceMonitor } from '../master-controller/lib/performanceMonitor';

const DEBOUNCE_DELAY = 150; // ms
const STYLE_ELEMENT_ID = 'master-controller-vars'; // Match CSSProvider ID

/**
 * Global Master Controller CSS Provider
 *
 * Injects Master Controller CSS variables globally so they're available on all pages.
 * This ensures typography settings (like H1 color) are available outside the Master Controller.
 *
 * Architecture:
 * - Reads from Zustand stores (persisted to localStorage)
 * - Waits for hydration before first injection
 * - Watches store changes and re-injects CSS reactively
 * - Uses 150ms debouncing to prevent excessive injections
 * - Applies CSS optimization (minification, deduplication)
 * - Tracks performance metrics
 * - Injects <style> element into document head
 *
 * Usage: Wrap root layout or place at top level
 */
export function MasterControllerProvider({ children }: { children: React.ReactNode }) {
  const typographySettings = useTypographyStore((state) => state.settings);
  const batchUpdateTypography = useTypographyStore((state) => state.batchUpdate);
  const brandColorsSettings = useBrandColorsStore((state) => state.settings);
  const spacingSettings = useSpacingStore((state) => state.settings);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasInjectedOnce = useRef(false);

  // Wait for hydration on mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load typography settings from database on mount
  useEffect(() => {
    if (!isHydrated) return;

    const loadTypographySettings = async () => {
      try {
        const response = await fetch('/api/master-controller/typography');
        if (response.ok) {
          const { data } = await response.json();
          if (data) {
            // Database already contains correct Zustand format (no transformation needed)
            // The transformDatabaseToStore() was removed because it was corrupting data
            // by expecting old format (size_min/size_max) instead of new format (size.min/size.max)
            batchUpdateTypography(data);
            console.log('✅ Typography settings loaded from database');
          }
        }
      } catch (error) {
        console.error('Failed to load typography settings:', error);
        // Fallback to localStorage/defaults if DB fetch fails
      }
    };

    loadTypographySettings();
  }, [isHydrated, batchUpdateTypography]);

  /**
   * Memoized CSS injection function
   * Generates, optimizes, and injects CSS into document head
   */
  const injectCSS = useCallback(() => {
    try {
      const startTime = performance.now();

      // Generate CSS from all settings
      const rawCSS = CSSGenerator.generateComplete(
        brandColorsSettings,
        typographySettings,
        spacingSettings
      );

      // Optimize CSS (minify, deduplicate, validate)
      const { optimized, errors, originalSize, optimizedSize, compressionRatio } =
        optimizeCSS(rawCSS);

      // Log validation errors (non-blocking)
      if (errors.length > 0) {
        console.warn('CSS validation warnings:', errors);
      }

      // Remove old style element if it exists
      const oldStyle = document.getElementById(STYLE_ELEMENT_ID);
      if (oldStyle) {
        oldStyle.remove();
      }

      // Inject new style element
      const styleElement = document.createElement('style');
      styleElement.id = STYLE_ELEMENT_ID;
      styleElement.textContent = optimized;
      document.head.appendChild(styleElement);

      const endTime = performance.now();
      const generationTime = endTime - startTime;

      // Record performance metrics
      performanceMonitor.recordInjection(generationTime, optimizedSize);

      // Log performance data
      console.log('✅ Master Controller CSS injected globally', {
        generationTime: `${generationTime.toFixed(2)}ms`,
        originalSize: `${(originalSize / 1024).toFixed(2)}KB`,
        optimizedSize: `${(optimizedSize / 1024).toFixed(2)}KB`,
        compressionRatio: `${(compressionRatio * 100).toFixed(1)}%`,
        totalInjections: performanceMonitor.getPerformanceMetrics().totalInjections,
      });

      // Warn if performance is degraded
      const warnings = performanceMonitor.getWarnings();
      if (warnings.length > 0) {
        console.warn('⚠️ Performance warnings:', warnings);
      }
    } catch (error) {
      console.error('❌ Failed to inject CSS:', error);
      // Don't throw - we don't want to break the app
      // Old CSS will remain in place
    }
  }, [typographySettings, brandColorsSettings, spacingSettings]);

  /**
   * Debounced effect that injects CSS
   * - Injects immediately on first hydration (no delay)
   * - Delays subsequent injections by 150ms to batch rapid updates (e.g., slider drags)
   * - Re-injects when any store changes
   */
  useEffect(() => {
    // Don't inject until hydrated (prevents SSR/hydration mismatch)
    if (!isHydrated) {
      return;
    }

    // First injection: immediate (no FOUC)
    if (!hasInjectedOnce.current) {
      hasInjectedOnce.current = true;
      injectCSS();
      return;
    }

    // Subsequent injections: debounced
    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      injectCSS();
    }, DEBOUNCE_DELAY);

    // Cleanup on unmount or dependency change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [injectCSS, isHydrated]);

  return <>{children}</>;
}
