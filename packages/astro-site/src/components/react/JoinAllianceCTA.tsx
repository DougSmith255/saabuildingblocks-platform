'use client';

import { CTAButton } from './CTAButton';

/**
 * JoinAllianceCTA - Forked for Astro (uses local CTAButton instead of shared)
 * Dispatches 'open-join-modal' event to open the join modal.
 */
export function JoinAllianceCTA({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <CTAButton
      href="#"
      className={className}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        window.dispatchEvent(new Event('open-join-modal'));
      }}
    >
      {children || 'Join The Alliance'}
    </CTAButton>
  );
}
