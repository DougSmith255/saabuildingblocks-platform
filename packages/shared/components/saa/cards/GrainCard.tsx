'use client';

import React from 'react';

export interface GrainCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional className for the container */
  className?: string;
  /** Padding size for inner content: 'sm' (p-4), 'md' (p-6), 'lg' (p-8), 'xl' (p-10) */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  /** Center the content */
  centered?: boolean;
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

/**
 * GrainCard - Dark card with grainy texture and subtle grey border
 *
 * Combines GenericCard's subtle border with NeonCard's grainy texture.
 *
 * Features:
 * - Dark gradient background with noise/grain texture
 * - GenericCard-style subtle grey border (1px)
 * - Clean, minimal appearance without gold glow
 * - Consistent fine grain texture across all screen sizes
 *
 * @example
 * ```tsx
 * <GrainCard>
 *   <h2 className="text-h2">Title</h2>
 *   <p className="text-body">Description</p>
 * </GrainCard>
 * ```
 */
export function GrainCard({
  children,
  className = '',
  padding = 'md',
  centered = true,
}: GrainCardProps) {
  const paddingClass = paddingClasses[padding];
  const centerClass = centered ? 'text-center' : '';

  return (
    <>
      <style jsx global>{`
        .grain-card {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03);

          background:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
            linear-gradient(180deg, rgba(18, 18, 18, 0.85) 0%, rgba(12, 12, 12, 0.92) 100%);
          background-blend-mode: overlay, normal;
          backdrop-filter: blur(16px) saturate(120%);
          -webkit-backdrop-filter: blur(16px) saturate(120%);
        }
      `}</style>

      <div className={`grain-card h-full ${className}`}>
        <div className={`${paddingClass} ${centerClass} h-full flex flex-col`}>
          {children}
        </div>
      </div>
    </>
  );
}

export default GrainCard;
