'use client';

/**
 * CategoryBackButton Component
 * Navigation button to return to blog hub
 * Uses SAA CTAButton component
 * Phase 7.3 - Category Template System
 */

import React from 'react';
import { CTAButton } from '@/components/saa';
import type { BrandColorsSettings } from '../types';

interface CategoryBackButtonProps {
  href: string;
  label: string;
  colors: BrandColorsSettings;
}

export function CategoryBackButton({ href, label }: CategoryBackButtonProps) {
  return (
    <CTAButton
      href={href}
      variant="secondary"
      style={{
        fontSize: 'clamp(14px, 1vw, 17px)',
        padding: '12px 24px',
        borderRadius: '6px',
      }}
    >
      {label}
    </CTAButton>
  );
}
