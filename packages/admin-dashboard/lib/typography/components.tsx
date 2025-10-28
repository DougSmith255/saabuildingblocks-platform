/**
 * Typography Components
 * Reusable typography components with consistent styling
 *
 * @module lib/typography/components
 */

import React from 'react';
import { type TypographyRole, typographyRoles } from './config';
import { cn } from '@/lib/utils';

/**
 * Base Typography Props
 */
interface BaseTypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  role?: TypographyRole;
}

/**
 * Typography Component
 * Universal typography component with role-based styling
 */
export function Typography({
  children,
  className,
  as: Component = 'p',
  role = 'bodyPrimary',
}: BaseTypographyProps) {
  const config = typographyRoles[role];
  const scale = config.scale;

  const styles = {
    fontFamily: config.family,
    fontSize: scale.size,
    lineHeight: scale.lineHeight,
    letterSpacing: scale.letterSpacing,
    fontWeight: scale.fontWeight,
  };

  return (
    <Component
      className={cn(
        'transition-colors duration-200',
        className
      )}
      style={styles}
    >
      {children}
    </Component>
  );
}

/**
 * Display Text (Hero Headings)
 */
interface DisplayProps extends Omit<BaseTypographyProps, 'role'> {
  size?: 'xl' | 'lg' | 'md' | 'sm';
}

export function Display({
  children,
  className,
  as = 'h1',
  size = 'xl',
}: DisplayProps) {
  return (
    <Typography
      as={as}
      role="heroTitle"
      className={cn(
        'font-taskor font-bold',
        size === 'xl' && 'text-[clamp(3.5rem,5vw+1rem,6rem)] leading-[1.1] tracking-[-0.02em]',
        size === 'lg' && 'text-[clamp(3rem,4vw+1rem,4.5rem)] leading-[1.15] tracking-[-0.015em]',
        size === 'md' && 'text-[clamp(2.5rem,3vw+1rem,3.5rem)] leading-[1.2] tracking-[-0.01em]',
        size === 'sm' && 'text-[clamp(2rem,2.5vw+1rem,2.5rem)] leading-[1.25] tracking-[-0.005em]',
        'text-gold-500 dark:text-gold-500',
        className
      )}
    >
      {children}
    </Typography>
  );
}

/**
 * Heading Text
 */
interface HeadingProps extends Omit<BaseTypographyProps, 'role'> {
  size?: 'xl' | 'lg' | 'md' | 'sm';
}

export function Heading({
  children,
  className,
  as = 'h2',
  size = 'lg',
}: HeadingProps) {
  const sizeMap = {
    xl: 'h1',
    lg: 'h2',
    md: 'h3',
    sm: 'h4',
  };

  return (
    <Typography
      as={as || sizeMap[size]}
      role="sectionTitle"
      className={cn(
        'font-taskor font-semibold',
        size === 'xl' && 'text-[clamp(2rem,2.5vw+0.5rem,3rem)] leading-[1.2] tracking-[-0.01em]',
        size === 'lg' && 'text-[clamp(1.75rem,2vw+0.5rem,2.25rem)] leading-[1.25] tracking-[-0.005em]',
        size === 'md' && 'text-[clamp(1.5rem,1.5vw+0.5rem,1.875rem)] leading-[1.3]',
        size === 'sm' && 'text-[clamp(1.25rem,1vw+0.5rem,1.5rem)] leading-[1.35]',
        'text-neutral-900 dark:text-neutral-50',
        className
      )}
    >
      {children}
    </Typography>
  );
}

/**
 * Body Text
 */
interface BodyProps extends Omit<BaseTypographyProps, 'role'> {
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  variant?: 'primary' | 'secondary';
}

export function Body({
  children,
  className,
  as = 'p',
  size = 'md',
  variant = 'primary',
}: BodyProps) {
  return (
    <Typography
      as={as}
      role={variant === 'primary' ? 'bodyPrimary' : 'bodySecondary'}
      className={cn(
        'font-amulya',
        size === 'xl' && 'text-[clamp(1.125rem,0.5vw+0.875rem,1.25rem)] leading-[1.6]',
        size === 'lg' && 'text-[clamp(1rem,0.5vw+0.875rem,1.125rem)] leading-[1.65]',
        size === 'md' && 'text-[clamp(0.875rem,0.25vw+0.8125rem,1rem)] leading-[1.7]',
        size === 'sm' && 'text-[clamp(0.8125rem,0.125vw+0.75rem,0.875rem)] leading-[1.75]',
        size === 'xs' && 'text-[clamp(0.75rem,0.125vw+0.6875rem,0.8125rem)] leading-[1.8]',
        variant === 'primary' && 'text-neutral-900 dark:text-neutral-100',
        variant === 'secondary' && 'text-neutral-600 dark:text-neutral-400',
        className
      )}
    >
      {children}
    </Typography>
  );
}

/**
 * Label Text (for form inputs, buttons, etc.)
 */
interface LabelProps extends Omit<BaseTypographyProps, 'role'> {
  size?: 'lg' | 'md' | 'sm' | 'xs';
}

export function Label({
  children,
  className,
  as = 'label',
  size = 'md',
}: LabelProps) {
  return (
    <Typography
      as={as}
      role="inputLabel"
      className={cn(
        'font-taskor font-medium',
        size === 'lg' && 'text-base leading-[1.5] tracking-[0.01em]',
        size === 'md' && 'text-sm leading-[1.5] tracking-[0.01em]',
        size === 'sm' && 'text-[0.8125rem] leading-[1.5] tracking-[0.02em]',
        size === 'xs' && 'text-xs leading-[1.5] tracking-[0.02em]',
        'text-neutral-700 dark:text-neutral-300',
        className
      )}
    >
      {children}
    </Typography>
  );
}

/**
 * Code/Monospace Text
 */
interface CodeProps extends Omit<BaseTypographyProps, 'role'> {
  inline?: boolean;
}

export function Code({
  children,
  className,
  as,
  inline = true,
}: CodeProps) {
  const Component = as || (inline ? 'code' : 'pre');

  return (
    <Typography
      as={Component}
      role="code"
      className={cn(
        'font-mono text-sm leading-relaxed',
        inline && 'px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800',
        !inline && 'p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 overflow-x-auto',
        'text-neutral-800 dark:text-neutral-200',
        className
      )}
    >
      {children}
    </Typography>
  );
}

/**
 * Helper Text (for form hints, captions, etc.)
 */
export function Helper({
  children,
  className,
  as = 'span',
}: Omit<BaseTypographyProps, 'role'>) {
  return (
    <Typography
      as={as}
      role="helperText"
      className={cn(
        'font-amulya text-xs leading-relaxed',
        'text-neutral-600 dark:text-neutral-400',
        className
      )}
    >
      {children}
    </Typography>
  );
}

/**
 * Section Title (for major content sections)
 */
export function SectionTitle({
  children,
  className,
  as = 'h2',
}: Omit<BaseTypographyProps, 'role'>) {
  return (
    <Typography
      as={as}
      role="sectionTitle"
      className={cn(
        'font-synonym font-bold',
        'text-[clamp(2rem,4vw,3.5rem)] leading-[1.2]',
        'text-white dark:text-white text-center',
        'my-8',
        className
      )}
    >
      {children}
    </Typography>
  );
}

/**
 * Card Title
 */
export function CardTitle({
  children,
  className,
  as = 'h3',
}: Omit<BaseTypographyProps, 'role'>) {
  return (
    <Typography
      as={as}
      role="cardTitle"
      className={cn(
        'font-taskor font-semibold',
        'text-[clamp(1.25rem,1vw+0.5rem,1.5rem)] leading-[1.35]',
        'text-neutral-900 dark:text-neutral-50',
        className
      )}
    >
      {children}
    </Typography>
  );
}

/**
 * Card Subtitle
 */
export function CardSubtitle({
  children,
  className,
  as = 'p',
}: Omit<BaseTypographyProps, 'role'>) {
  return (
    <Typography
      as={as}
      role="cardSubtitle"
      className={cn(
        'font-amulya',
        'text-[clamp(0.875rem,0.25vw+0.8125rem,1rem)] leading-[1.65]',
        'text-neutral-600 dark:text-neutral-400',
        className
      )}
    >
      {children}
    </Typography>
  );
}

/**
 * Export all components
 */
export const TypographyComponents = {
  Typography,
  Display,
  Heading,
  Body,
  Label,
  Code,
  Helper,
  SectionTitle,
  CardTitle,
  CardSubtitle,
};
