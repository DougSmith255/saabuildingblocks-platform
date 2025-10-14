/**
 * Typography Provider
 * Applies master controller typography settings globally
 *
 * @module components/TypographyProvider
 */

'use client';

import React, { useEffect } from 'react';
import { useTypography, useTypographyUpdate } from '@/lib/typography/hooks';

interface TypographyProviderProps {
  children: React.ReactNode;
}

/**
 * Typography Provider Component
 * Syncs master controller settings with CSS variables
 */
export function TypographyProvider({ children }: TypographyProviderProps) {
  const { settings, isLoading } = useTypography();

  useEffect(() => {
    if (isLoading) return;

    // Apply typography settings to root element
    const root = document.documentElement;

    // Font families
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

    // Base size and scale
    if (settings.baseSize) {
      root.style.setProperty('--font-size-base', `${settings.baseSize}px`);
    }

    if (settings.scaleRatio) {
      root.style.setProperty('--font-scale-ratio', String(settings.scaleRatio));
    }

    // Line heights
    if (settings.lineHeight) {
      Object.entries(settings.lineHeight).forEach(([key, value]) => {
        root.style.setProperty(`--line-height-${key}`, String(value));
      });
    }

    // Letter spacing
    if (settings.letterSpacing) {
      Object.entries(settings.letterSpacing).forEach(([key, value]) => {
        root.style.setProperty(`--letter-spacing-${key}`, value);
      });
    }
  }, [settings, isLoading]);

  return <>{children}</>;
}

export default TypographyProvider;
