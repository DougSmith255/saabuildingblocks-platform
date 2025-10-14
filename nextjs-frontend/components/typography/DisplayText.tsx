/**
 * Smart Display Text Components
 *
 * These components automatically apply .text-display class based on
 * intelligent decision logic from displayTextRules.ts
 */

import React, { createElement, ReactNode } from 'react';
import {
  shouldUseDisplayText,
  inferContext,
  type DisplayTextContext,
  type HTMLTag
} from '@/lib/typography/displayTextRules';
import { cn } from '@/lib/utils';

interface SmartTextProps {
  as?: HTMLTag;
  context?: DisplayTextContext;
  children: ReactNode;
  className?: string;
  forceDisplay?: boolean;
  isPrimary?: boolean;
  role?: string;
}

/**
 * Smart Text Component
 *
 * Automatically applies .text-display based on decision logic.
 *
 * @example
 * <SmartText as="h1" context="hero">Bold Hero Title</SmartText>
 * // → Renders with .text-display (H1 in hero context)
 *
 * @example
 * <SmartText as="p" context="body">Long paragraph content...</SmartText>
 * // → Renders without .text-display (body content)
 */
export function SmartText({
  as = 'p',
  context,
  children,
  className = '',
  forceDisplay = false,
  isPrimary = false,
  role
}: SmartTextProps) {
  // Extract text content for analysis
  const content = typeof children === 'string'
    ? children
    : React.Children.toArray(children).join(' ');

  // Infer context if not provided
  const inferredContext = context ?? inferContext({
    tag: as,
    className,
    role
  });

  // Determine if we should use display text
  const shouldDisplay = forceDisplay || shouldUseDisplayText({
    tag: as,
    content,
    context: inferredContext,
    length: content.length,
    isInteractive: as === 'button' || as === 'a',
    isPrimary
  });

  // Build final className
  const finalClassName = cn(
    shouldDisplay && 'text-display',
    className
  );

  return createElement(as, {
    className: finalClassName,
    role
  }, children);
}

/**
 * Context-Aware Wrapper Components
 * These automatically set the correct context and apply display text logic
 */

/**
 * Hero Text - Always uses display text
 * For large, bold hero section titles
 */
export function HeroText({
  as = 'h1',
  children,
  className
}: {
  as?: 'h1' | 'h2';
  children: ReactNode;
  className?: string;
}) {
  return (
    <SmartText
      as={as}
      context="hero"
      className={className}
      forceDisplay
    >
      {children}
    </SmartText>
  );
}

/**
 * Section Title - Uses display text for H2-H3
 */
export function SectionTitle({
  as = 'h2',
  children,
  className
}: {
  as?: 'h2' | 'h3';
  children: ReactNode;
  className?: string;
}) {
  return (
    <SmartText
      as={as}
      context="section-title"
      className={className}
    >
      {children}
    </SmartText>
  );
}

/**
 * Card Title - Uses display text for short titles
 */
export function CardTitle({
  as = 'h3',
  children,
  className
}: {
  as?: 'h3' | 'h4';
  children: ReactNode;
  className?: string;
}) {
  return (
    <SmartText
      as={as}
      context="card-title"
      className={className}
    >
      {children}
    </SmartText>
  );
}

/**
 * Nav Item - Always uses display text
 */
export function NavItem({
  children,
  className,
  href
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  return (
    <SmartText
      as={href ? 'a' : 'span'}
      context="navigation"
      className={className}
      forceDisplay
    >
      {children}
    </SmartText>
  );
}

/**
 * Badge - Always uses display text
 */
export function Badge({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <SmartText
      as="span"
      context="badge"
      className={className}
      forceDisplay
    >
      {children}
    </SmartText>
  );
}

/**
 * Primary Button Text - Uses display text for CTAs
 */
export function ButtonText({
  children,
  className,
  isPrimary = true
}: {
  children: ReactNode;
  className?: string;
  isPrimary?: boolean;
}) {
  return (
    <SmartText
      as="button"
      context="button"
      className={className}
      isPrimary={isPrimary}
    >
      {children}
    </SmartText>
  );
}

/**
 * Body Content - Never uses display text
 */
export function BodyContent({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <SmartText
      as="p"
      context="body"
      className={className}
    >
      {children}
    </SmartText>
  );
}

/**
 * Label - Always uses display text
 */
export function Label({
  children,
  className,
  htmlFor
}: {
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return createElement('label', {
    className: cn('text-display', className),
    htmlFor
  }, children);
}

/**
 * Development Helper: Show decision logic
 */
export function DisplayTextDebugger({
  element
}: {
  element: Parameters<typeof shouldUseDisplayText>[0]
}) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const decision = shouldUseDisplayText(element);

  return (
    <div className="border border-dashed border-yellow-500 p-2 mt-2 text-xs">
      <strong>Display Text Decision:</strong> {decision ? '✓ YES' : '✗ NO'}
      <pre className="mt-1 overflow-auto">
        {JSON.stringify(element, null, 2)}
      </pre>
    </div>
  );
}
