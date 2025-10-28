/**
 * Typography Hooks
 * React hooks for dynamic typography integration with master controller
 *
 * @module lib/typography/hooks
 */

'use client';

import { useEffect, useState } from 'react';
import { typographyRoles, type TypographyRole } from './config';

/**
 * Master Controller Typography Settings
 */
export interface MasterControllerTypography {
  primaryFont: string;
  secondaryFont: string;
  monoFont: string;
  baseSize: number; // px
  scaleRatio: number; // 1.2 = minor third, 1.25 = major third, etc.
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

/**
 * Default typography settings
 */
const DEFAULT_TYPOGRAPHY: MasterControllerTypography = {
  primaryFont: 'Taskor, system-ui, sans-serif',
  secondaryFont: 'Amulya, Georgia, serif',
  monoFont: 'Synonym, monospace',
  baseSize: 16,
  scaleRatio: 1.25,
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.05em',
  },
};

/**
 * Hook to get typography settings from master controller
 */
export function useTypography() {
  const [settings, setSettings] = useState<MasterControllerTypography>(DEFAULT_TYPOGRAPHY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load typography settings from master controller
    const loadSettings = async () => {
      try {
        // Check if master controller settings exist in localStorage
        const stored = localStorage.getItem('masterController:typography');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({ ...DEFAULT_TYPOGRAPHY, ...parsed });
        }
      } catch (error) {
        console.error('Failed to load typography settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();

    // Listen for typography updates from master controller
    const handleUpdate = (event: CustomEvent<Partial<MasterControllerTypography>>) => {
      setSettings((prev) => ({ ...prev, ...event.detail }));
    };

    window.addEventListener('typography:update' as any, handleUpdate);
    return () => {
      window.removeEventListener('typography:update' as any, handleUpdate);
    };
  }, []);

  return { settings, isLoading };
}

/**
 * Hook to update typography settings (for master controller)
 */
export function useTypographyUpdate() {
  const updateSettings = (updates: Partial<MasterControllerTypography>) => {
    try {
      // Save to localStorage
      const current = localStorage.getItem('masterController:typography');
      const parsed = current ? JSON.parse(current) : {};
      const updated = { ...parsed, ...updates };
      localStorage.setItem('masterController:typography', JSON.stringify(updated));

      // Dispatch event to notify all components
      window.dispatchEvent(
        new CustomEvent('typography:update', {
          detail: updates,
        })
      );

      // Apply CSS variables
      applyTypographyCSS(updated);
    } catch (error) {
      console.error('Failed to update typography settings:', error);
    }
  };

  return { updateSettings };
}

/**
 * Apply typography settings as CSS variables
 */
function applyTypographyCSS(settings: Partial<MasterControllerTypography>) {
  const root = document.documentElement;

  if (settings.primaryFont) {
    root.style.setProperty('--font-taskor', settings.primaryFont);
    root.style.setProperty('--font-sans', settings.primaryFont);
  }

  if (settings.secondaryFont) {
    root.style.setProperty('--font-amulya', settings.secondaryFont);
    root.style.setProperty('--font-serif', settings.secondaryFont);
  }

  if (settings.monoFont) {
    root.style.setProperty('--font-synonym', settings.monoFont);
    root.style.setProperty('--font-mono', settings.monoFont);
  }

  if (settings.baseSize) {
    root.style.setProperty('--font-size-base', `${settings.baseSize}px`);
  }

  if (settings.lineHeight) {
    Object.entries(settings.lineHeight).forEach(([key, value]) => {
      root.style.setProperty(`--line-height-${key}`, String(value));
    });
  }

  if (settings.letterSpacing) {
    Object.entries(settings.letterSpacing).forEach(([key, value]) => {
      root.style.setProperty(`--letter-spacing-${key}`, value);
    });
  }
}

/**
 * Hook to get typography for a specific role
 */
export function useTypographyRole(role: TypographyRole) {
  const { settings } = useTypography();
  const config = typographyRoles[role];

  return {
    ...config,
    settings,
  };
}

/**
 * Hook to compute responsive font size
 */
export function useResponsiveFontSize(baseSize: number, minSize: number, maxSize: number) {
  const [fontSize, setFontSize] = useState(baseSize);

  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth / 100;
      const computed = Math.min(Math.max(minSize, baseSize + vw * 0.5), maxSize);
      setFontSize(computed);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [baseSize, minSize, maxSize]);

  return fontSize;
}
