import type { TypographySettings, ClampConfig } from '../types';
import { DEFAULT_TYPOGRAPHY_CLAMPS } from './clampCalculator';

export type TypographyPresetName = 'modern' | 'compact' | 'editorial' | 'saa-default';

export interface TypographyPreset {
  name: string;
  description: string;
  settings: TypographySettings;
}

// Helper to scale clamp values
const scaleClamp = (clamp: ClampConfig, scale: number): ClampConfig => ({
  ...clamp,
  min: Math.round(clamp.min * scale),
  max: Math.round(clamp.max * scale),
});

// Helper to scale line height
const scaleLineHeight = (lineHeight: number, scale: number): number =>
  Math.round((lineHeight * scale) * 10) / 10;

// Modern preset (current defaults)
const modernPreset: TypographySettings = {
  h1: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['h1'] as ClampConfig,
    lineHeight: 1.2,
    letterSpacing: -0.02,
    fontWeight: 700,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  h2: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['h2'] as ClampConfig,
    lineHeight: 1.3,
    letterSpacing: -0.01,
    fontWeight: 700,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  h3: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['h3'] as ClampConfig,
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  h4: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['h4'] as ClampConfig,
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  h5: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['h5'] as ClampConfig,
    lineHeight: 1.5,
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  h6: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['h6'] as ClampConfig,
    lineHeight: 1.5,
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  body: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['body'] as ClampConfig,
    lineHeight: 1.6,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-taskor)',
    color: 'bodyText',
  },
  quote: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['quote'] as ClampConfig,
    lineHeight: 1.5,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-amulya)',
    fontStyle: 'italic',
    color: 'bodyText',
  },
  link: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['link'] as ClampConfig,
    lineHeight: 1.6,
    letterSpacing: 0,
    fontWeight: 500,
    fontFamily: 'var(--font-taskor)',
    color: 'accentGreen',
  },
  button: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['button'] as ClampConfig,
    lineHeight: 1,
    letterSpacing: 0.01,
    fontWeight: 500,
    fontFamily: 'var(--font-taskor)',
    color: 'accentGreen',
  },
};

// Compact preset (20% smaller)
const compactPreset: TypographySettings = {
  h1: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['h1'] as ClampConfig, 0.8),
    lineHeight: 1.1,
    letterSpacing: -0.015,
    fontWeight: 700,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  h2: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['h2'] as ClampConfig, 0.8),
    lineHeight: 1.2,
    letterSpacing: -0.01,
    fontWeight: 700,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  h3: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['h3'] as ClampConfig, 0.8),
    lineHeight: 1.3,
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  h4: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['h4'] as ClampConfig, 0.8),
    lineHeight: 1.3,
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  h5: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['h5'] as ClampConfig, 0.8),
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  h6: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['h6'] as ClampConfig, 0.8),
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  body: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['body'] as ClampConfig, 0.8),
    lineHeight: 1.5,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-taskor)',
    color: 'bodyText',
  },
  quote: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['quote'] as ClampConfig, 0.8),
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-amulya)',
    fontStyle: 'italic',
    color: 'bodyText',
  },
  link: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['link'] as ClampConfig, 0.8),
    lineHeight: 1.5,
    letterSpacing: 0,
    fontWeight: 500,
    fontFamily: 'var(--font-taskor)',
    color: 'accentGreen',
  },
  button: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['button'] as ClampConfig, 0.8),
    lineHeight: 1,
    letterSpacing: 0.01,
    fontWeight: 500,
    fontFamily: 'var(--font-taskor)',
    color: 'accentGreen',
  },
};

// Editorial preset (larger body text, taller line heights)
const editorialPreset: TypographySettings = {
  h1: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['h1'] as ClampConfig,
    lineHeight: scaleLineHeight(1.2, 1.1),
    letterSpacing: -0.02,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h2: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['h2'] as ClampConfig,
    lineHeight: scaleLineHeight(1.3, 1.1),
    letterSpacing: -0.01,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h3: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['h3'] as ClampConfig,
    lineHeight: scaleLineHeight(1.4, 1.1),
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h4: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['h4'] as ClampConfig,
    lineHeight: scaleLineHeight(1.4, 1.1),
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h5: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['h5'] as ClampConfig,
    lineHeight: scaleLineHeight(1.5, 1.1),
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h6: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['h6'] as ClampConfig,
    lineHeight: scaleLineHeight(1.5, 1.1),
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  body: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['body'] as ClampConfig, 1.1),
    lineHeight: scaleLineHeight(1.6, 1.1),
    letterSpacing: 0.005,
    fontWeight: 400,
    fontFamily: 'var(--font-synonym)',
    color: 'bodyText',
  },
  quote: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['quote'] as ClampConfig, 1.1),
    lineHeight: scaleLineHeight(1.5, 1.1),
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-amulya)',
    fontStyle: 'italic',
    color: 'bodyText',
  },
  link: {
    size: scaleClamp(DEFAULT_TYPOGRAPHY_CLAMPS['link'] as ClampConfig, 1.1),
    lineHeight: scaleLineHeight(1.6, 1.1),
    letterSpacing: 0,
    fontWeight: 500,
    fontFamily: 'var(--font-synonym)',
    color: 'accentGreen',
  },
  button: {
    size: DEFAULT_TYPOGRAPHY_CLAMPS['button'] as ClampConfig,
    lineHeight: 1.1,
    letterSpacing: 0.01,
    fontWeight: 500,
    fontFamily: 'var(--font-taskor)',
    color: 'accentGreen',
  },
};

// SAA Default preset (Original Smart Agent Alliance defaults from HTML master controller)
const saaDefaultPreset: TypographySettings = {
  h1: {
    size: { min: 48, max: 120, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.2,
    letterSpacing: -0.02,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h2: {
    size: { min: 40, max: 96, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.2,
    letterSpacing: -0.01,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h3: {
    size: { min: 32, max: 72, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.3,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h4: {
    size: { min: 26, max: 56, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.3,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h5: {
    size: { min: 22, max: 44, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h6: {
    size: { min: 18, max: 32, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  body: {
    size: { min: 16, max: 28, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.6,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-synonym)',
    color: 'bodyText',
  },
  quote: {
    size: { min: 18, max: 32, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.5,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-amulya)',
    fontStyle: 'italic',
    color: 'bodyText',
  },
  link: {
    size: { min: 16, max: 28, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.6,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-synonym)',
    color: 'accentGreen',
  },
  button: {
    size: { min: 14, max: 20, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1,
    letterSpacing: 0.01,
    fontWeight: 600,
    fontFamily: 'var(--font-amulya)',
    color: 'accentGreen',
  },
};

export const TYPOGRAPHY_PRESETS: Record<TypographyPresetName, TypographyPreset> = {
  'saa-default': {
    name: 'SAA Default',
    description: 'Original Smart Agent Alliance typography settings',
    settings: saaDefaultPreset,
  },
  modern: {
    name: 'Modern',
    description: 'Large headings with moderate body text',
    settings: modernPreset,
  },
  compact: {
    name: 'Compact',
    description: 'Smaller sizes across the board (-20%)',
    settings: compactPreset,
  },
  editorial: {
    name: 'Editorial',
    description: 'Larger body text with taller line heights (+10%)',
    settings: editorialPreset,
  },
};
