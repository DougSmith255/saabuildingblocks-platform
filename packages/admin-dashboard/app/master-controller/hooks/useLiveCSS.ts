/**
 * useLiveCSS Hook
 * Master Controller - Live CSS Injection System
 *
 * Injects and updates CSS dynamically as stores change
 * Includes performance metrics and debouncing
 */

'use client';

import { useEffect, useRef } from 'react';
import { useTypographyStore } from '../stores/typographyStore';
import { useBrandColorsStore } from '../stores/brandColorsStore';
import { useSpacingStore } from '../stores/spacingStore';
import { generateMasterControllerCSS } from '../lib/cssGenerator';

const STYLE_TAG_ID = 'master-controller-live-css';
const DEBOUNCE_DELAY = 150; // ms

export interface CSSMetrics {
  totalUpdates: number;
  lastUpdateTime: number;
  cssLength: number;
}

/**
 * Live CSS injection hook
 * Automatically updates styles when any store changes
 */
export function useLiveCSS() {
  const typographySettings = useTypographyStore((state) => state.settings);
  const brandColorsSettings = useBrandColorsStore((state) => state.settings);
  const spacingSettings = useSpacingStore((state) => state.settings);

  const metricsRef = useRef<CSSMetrics>({
    totalUpdates: 0,
    lastUpdateTime: 0,
    cssLength: 0,
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Inject or update CSS in the document
   */
  const updateCSS = () => {
    const startTime = performance.now();

    try {
      // Generate CSS from current settings
      const css = generateMasterControllerCSS({
        typography: typographySettings,
        brandColors: brandColorsSettings,
        spacing: spacingSettings,
      });

      // Find or create style tag
      let styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;

      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = STYLE_TAG_ID;
        document.head.appendChild(styleTag);
      }

      // Update CSS content
      styleTag.textContent = css;

      // Update metrics
      const endTime = performance.now();
      metricsRef.current = {
        totalUpdates: metricsRef.current.totalUpdates + 1,
        lastUpdateTime: endTime - startTime,
        cssLength: css.length,
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('🎨 CSS updated', {
          updateTime: `${(endTime - startTime).toFixed(2)}ms`,
          cssSize: `${Math.round(css.length / 1024)}KB`,
          totalUpdates: metricsRef.current.totalUpdates,
        });
      }
    } catch (err) {
      console.error('❌ CSS generation failed:', err);
    }
  };

  /**
   * Debounced CSS update
   */
  const scheduleUpdate = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      updateCSS();
    }, DEBOUNCE_DELAY);
  };

  /**
   * Effect: Update CSS when settings change
   */
  useEffect(() => {
    scheduleUpdate();

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [typographySettings, brandColorsSettings, spacingSettings]);

  /**
   * Get performance metrics
   */
  const getMetrics = (): CSSMetrics => {
    return { ...metricsRef.current };
  };

  return {
    getMetrics,
  };
}
