'use client';

/**
 * CategoryBackButton Component
 * Navigation button to return to blog hub
 * Uses SAA CTAButton component
 * Phase 7.3 - Category Template System
 */

import React from 'react';
import { CTAButton } from '@/components/saa';
import type { BrandColorsSettings } from '../types/filters';

interface CategoryBackButtonProps {
  href: string;
  label: string;
  colors: BrandColorsSettings;
}

export function CategoryBackButton({ href, label }: CategoryBackButtonProps) {
  return (
    <CTAButton
      href={href}
    >
      {label}
    </CTAButton>
  );
}
