/**
 * Typography Configuration System
 * Centralized typography settings that integrate with master controller
 *
 * @module lib/typography/config
 */

/**
 * Typography Scale
 * Fluid responsive typography using clamp()
 */
export const typographyScale = {
  // Display sizes (hero headings)
  display: {
    xl: {
      size: 'clamp(3.5rem, 5vw + 1rem, 6rem)',
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
      fontWeight: '700',
    },
    lg: {
      size: 'clamp(3rem, 4vw + 1rem, 4.5rem)',
      lineHeight: '1.15',
      letterSpacing: '-0.015em',
      fontWeight: '700',
    },
    md: {
      size: 'clamp(2.5rem, 3vw + 1rem, 3.5rem)',
      lineHeight: '1.2',
      letterSpacing: '-0.01em',
      fontWeight: '700',
    },
    sm: {
      size: 'clamp(2rem, 2.5vw + 1rem, 2.5rem)',
      lineHeight: '1.25',
      letterSpacing: '-0.005em',
      fontWeight: '600',
    },
  },

  // Heading sizes
  heading: {
    xl: {
      size: 'clamp(2rem, 2.5vw + 0.5rem, 3rem)',
      lineHeight: '1.2',
      letterSpacing: '-0.01em',
      fontWeight: '600',
    },
    lg: {
      size: 'clamp(1.75rem, 2vw + 0.5rem, 2.25rem)',
      lineHeight: '1.25',
      letterSpacing: '-0.005em',
      fontWeight: '600',
    },
    md: {
      size: 'clamp(1.5rem, 1.5vw + 0.5rem, 1.875rem)',
      lineHeight: '1.3',
      letterSpacing: '0',
      fontWeight: '600',
    },
    sm: {
      size: 'clamp(1.25rem, 1vw + 0.5rem, 1.5rem)',
      lineHeight: '1.35',
      letterSpacing: '0',
      fontWeight: '600',
    },
  },

  // Body text sizes
  body: {
    xl: {
      size: 'clamp(1.125rem, 0.5vw + 0.875rem, 1.25rem)',
      lineHeight: '1.6',
      letterSpacing: '0',
      fontWeight: '400',
    },
    lg: {
      size: 'clamp(1rem, 0.5vw + 0.875rem, 1.125rem)',
      lineHeight: '1.65',
      letterSpacing: '0',
      fontWeight: '400',
    },
    md: {
      size: 'clamp(0.875rem, 0.25vw + 0.8125rem, 1rem)',
      lineHeight: '1.7',
      letterSpacing: '0',
      fontWeight: '400',
    },
    sm: {
      size: 'clamp(0.8125rem, 0.125vw + 0.75rem, 0.875rem)',
      lineHeight: '1.75',
      letterSpacing: '0',
      fontWeight: '400',
    },
    xs: {
      size: 'clamp(0.75rem, 0.125vw + 0.6875rem, 0.8125rem)',
      lineHeight: '1.8',
      letterSpacing: '0.01em',
      fontWeight: '400',
    },
  },

  // UI elements (buttons, labels, etc.)
  ui: {
    lg: {
      size: '1rem',
      lineHeight: '1.5',
      letterSpacing: '0.01em',
      fontWeight: '500',
    },
    md: {
      size: '0.875rem',
      lineHeight: '1.5',
      letterSpacing: '0.01em',
      fontWeight: '500',
    },
    sm: {
      size: '0.8125rem',
      lineHeight: '1.5',
      letterSpacing: '0.02em',
      fontWeight: '500',
    },
    xs: {
      size: '0.75rem',
      lineHeight: '1.5',
      letterSpacing: '0.02em',
      fontWeight: '500',
    },
  },
} as const;

/**
 * Font Families
 * Default font stacks for the application
 */
export const fontFamilies = {
  taskor: 'var(--font-taskor, Taskor, system-ui, sans-serif)',
  amulya: 'var(--font-amulya, Amulya, Georgia, serif)',
  synonym: 'var(--font-synonym, Synonym, monospace)',
  sans: 'var(--font-sans, Taskor, system-ui, sans-serif)',
  serif: 'var(--font-serif, Amulya, Georgia, serif)',
  mono: 'var(--font-mono, Synonym, monospace)',
} as const;

/**
 * Typography Roles
 * Semantic mapping of typography to UI elements
 */
export const typographyRoles = {
  // Hero section
  heroTitle: {
    family: fontFamilies.taskor,
    scale: typographyScale.display.xl,
    color: {
      light: '#ffd700', // Gold
      dark: '#ffd700',
    },
  },
  heroSubtitle: {
    family: fontFamilies.amulya,
    scale: typographyScale.heading.lg,
    color: {
      light: 'rgba(255, 255, 255, 0.9)',
      dark: 'rgba(255, 255, 255, 0.9)',
    },
  },
  heroTagline: {
    family: fontFamilies.amulya,
    scale: typographyScale.body.lg,
    color: {
      light: 'rgba(255, 255, 255, 0.7)',
      dark: 'rgba(255, 255, 255, 0.7)',
    },
  },

  // Section headings
  sectionTitle: {
    family: fontFamilies.synonym,
    scale: typographyScale.display.md,
    color: {
      light: '#ffffff',
      dark: '#ffffff',
    },
  },
  sectionSubtitle: {
    family: fontFamilies.amulya,
    scale: typographyScale.heading.lg,
    color: {
      light: 'rgba(255, 255, 255, 0.85)',
      dark: 'rgba(255, 255, 255, 0.85)',
    },
  },

  // Card/Component headings
  cardTitle: {
    family: fontFamilies.taskor,
    scale: typographyScale.heading.md,
    color: {
      light: '#0a0a0a',
      dark: '#fafafa',
    },
  },
  cardSubtitle: {
    family: fontFamilies.amulya,
    scale: typographyScale.body.lg,
    color: {
      light: '#525252',
      dark: '#a3a3a3',
    },
  },

  // Body text
  bodyPrimary: {
    family: fontFamilies.amulya,
    scale: typographyScale.body.md,
    color: {
      light: '#171717',
      dark: '#e5e5e5',
    },
  },
  bodySecondary: {
    family: fontFamilies.amulya,
    scale: typographyScale.body.sm,
    color: {
      light: '#525252',
      dark: '#a3a3a3',
    },
  },

  // UI elements
  buttonLabel: {
    family: fontFamilies.taskor,
    scale: typographyScale.ui.md,
    color: {
      light: '#000000',
      dark: '#ffffff',
    },
  },
  inputLabel: {
    family: fontFamilies.taskor,
    scale: typographyScale.ui.sm,
    color: {
      light: '#404040',
      dark: '#d4d4d4',
    },
  },
  helperText: {
    family: fontFamilies.amulya,
    scale: typographyScale.body.xs,
    color: {
      light: '#737373',
      dark: '#a3a3a3',
    },
  },

  // Code/Monospace
  code: {
    family: fontFamilies.mono,
    scale: typographyScale.body.sm,
    color: {
      light: '#404040',
      dark: '#d4d4d4',
    },
  },
} as const;

/**
 * CSS Custom Properties Generator
 * Generates CSS variables for typography system
 */
export function generateTypographyCSS(): string {
  const css: string[] = ['@theme {'];

  // Font sizes
  Object.entries(typographyScale).forEach(([category, sizes]) => {
    Object.entries(sizes).forEach(([size, config]) => {
      css.push(`  --font-size-${category}-${size}: ${config.size};`);
      css.push(`  --line-height-${category}-${size}: ${config.lineHeight};`);
      css.push(`  --letter-spacing-${category}-${size}: ${config.letterSpacing};`);
      css.push(`  --font-weight-${category}-${size}: ${config.fontWeight};`);
    });
  });

  css.push('}');
  return css.join('\n');
}

/**
 * Tailwind CSS Class Generator
 * Generates utility classes for typography
 */
export function generateTypographyClasses(role: keyof typeof typographyRoles): string {
  const config = typographyRoles[role];
  const scale = config.scale;

  return [
    `font-[${config.family}]`,
    `text-[${scale.size}]`,
    `leading-[${scale.lineHeight}]`,
    `tracking-[${scale.letterSpacing}]`,
    `font-[${scale.fontWeight}]`,
  ].join(' ');
}

/**
 * Type Exports
 */
export type TypographyRole = keyof typeof typographyRoles;
export type TypographyCategory = keyof typeof typographyScale;
export type TypographySize<T extends TypographyCategory> = keyof typeof typographyScale[T];
