'use client';

/**
 * JoinCTA - Tiny React island that dispatches the join modal event.
 * This is the ONLY interactive part of the hero section.
 */
export default function JoinCTA({ children = 'JOIN THE ALLIANCE' }: { children?: React.ReactNode }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('open-join-modal'))}
      className="cta-button-wrapper relative inline-flex items-center justify-center cursor-pointer"
      style={{
        // Replicate CTAButton styling
        fontFamily: 'var(--font-family-button, var(--font-taskor), Taskor, system-ui, sans-serif)',
        fontSize: 'var(--font-size-button, clamp(18px, calc(16.36px + 0.65vw), 36px))',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: 'var(--letter-spacing-button, 0.05em)',
        lineHeight: 1,
        color: 'var(--text-color-button, var(--color-headingText))',
        height: 'clamp(48px, calc(46.18px + 0.73vw), 68px)',
        paddingLeft: 'clamp(2rem, calc(1.818rem + 0.727vw), 4rem)',
        paddingRight: 'clamp(2rem, calc(1.818rem + 0.727vw), 4rem)',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.08) 100%)',
        borderRadius: '16px',
        border: '2px solid rgba(255,215,0,0.4)',
        boxShadow: '0 0 15px rgba(255,215,0,0.15), 0 0 30px rgba(255,215,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap' as const,
        fontFeatureSettings: '"ss01" 1',
      }}
    >
      {children}
    </button>
  );
}
