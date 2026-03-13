'use client';

/**
 * JoinCTA - React island that matches CTAButton styling exactly.
 * Dispatches the join modal event on click.
 * Top/bottom gold light bars with pulse animation.
 */
export default function JoinCTA({ children = 'JOIN THE ALLIANCE' }: { children?: React.ReactNode }) {
  return (
    <div className="relative py-2">
      <div className="group relative inline-block">
        <button
          onClick={() => window.dispatchEvent(new Event('open-join-modal'))}
          className={`
            relative flex justify-center items-center
            px-5 py-2
            bg-[rgb(45,45,45)]
            rounded-xl border-t border-b border-white/10
            border-l border-r border-l-transparent border-r-transparent
            hover:border-l-[#ffd700]/40 hover:border-r-[#ffd700]/40
            uppercase tracking-wide
            z-10
            transition-all duration-500
            overflow-hidden
            cursor-pointer

            before:content-[''] before:absolute before:inset-0
            before:bg-gradient-to-l before:from-white/15 before:to-transparent
            before:w-1/2 before:skew-x-[45deg]
          `}
          style={{
            color: 'var(--text-color-button, var(--color-headingText))',
            fontSize: 'var(--font-size-button, 20px)',
            fontFamily: 'var(--font-family-button, var(--font-taskor), Taskor, system-ui, sans-serif)',
            fontWeight: 'var(--font-weight-button, 600)' as any,
            textTransform: 'var(--text-transform-button, uppercase)' as any,
            letterSpacing: 'var(--letter-spacing-button, 0.05em)',
            lineHeight: 'var(--line-height-button, 1.4)',
            height: 'clamp(45px, calc(43.182px + 0.7273vw), 65px)',
            minWidth: '180px',
            whiteSpace: 'nowrap',
            boxShadow: '0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
          }}
        >
          {children}
        </button>

        {/* Top light bar */}
        <div
          className="cta-light-bar cta-light-bar-pulse w-[30px] h-[10px] rounded-md transition-all duration-500 group-hover:w-4/5"
          style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ffd700',
            zIndex: 5,
          }}
        />

        {/* Bottom light bar */}
        <div
          className="cta-light-bar cta-light-bar-pulse w-[30px] h-[10px] rounded-md transition-all duration-500 group-hover:w-4/5"
          style={{
            position: 'absolute',
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ffd700',
            zIndex: 5,
          }}
        />
      </div>
    </div>
  );
}
