'use client';

import { CTAButton } from '@saa/shared/components/saa/buttons';

/**
 * JoinAllianceCTA - Client component wrapper for the "Join The Alliance" CTA
 *
 * Dispatches the 'open-join-modal' event to open the join modal from LayoutWrapper.
 * Extracted as a client component so page-level components can be Server Components.
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
