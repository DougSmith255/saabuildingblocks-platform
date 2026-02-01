'use client';

import { useState, useEffect, useCallback } from 'react';
import { VideoSlidePanel } from '@saa/shared/components/saa/media/VideoSlidePanel';

/**
 * FloatingVideoButton - Fixed bottom-right pill button for "The Inside Look" video
 *
 * Uses the same glass treatment as the site header (dark gradient + gold lines +
 * white grid + shimmer overlay) adapted to a pill shape.
 *
 * Opens VideoSlidePanel on click.
 * Hides when: video panel is open, scrolled near footer, on initial load (slides in).
 * Should be excluded from blog post pages (handled by LayoutWrapper).
 */
export function FloatingVideoButton() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  // Slide in after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Hide near footer
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const nearBottom = scrollTop + windowHeight >= docHeight - 200;
      setIsNearFooter(nearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpen = useCallback(() => {
    setIsPanelOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  const shouldShow = isVisible && !isPanelOpen && !isNearFooter;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="fixed z-[10005] transition-all duration-500 group"
        style={{
          bottom: '24px',
          right: '24px',
          borderRadius: '12px',
          cursor: 'pointer',
          opacity: shouldShow ? 1 : 0,
          transform: shouldShow ? 'translateY(0)' : 'translateY(80px)',
          pointerEvents: shouldShow ? 'auto' : 'none',
          border: '2px solid rgba(60, 60, 60, 0.8)',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          position: 'fixed',
        }}
        aria-label="Watch The Inside Look video"
      >
        {/* Layer 1: Glass Base — dark gradient + gold vertical lines (matches header glassBase) */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '12px',
            background: `
              linear-gradient(45deg, rgb(14, 14, 14), rgb(24, 24, 24)),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 215, 0, 0.02) 2px, rgba(255, 215, 0, 0.02) 4px)
            `,
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.04)',
          }}
        />

        {/* Layer 2: White horizontal grid (matches header glassBase::after) */}
        <div
          className="absolute inset-[1px]"
          style={{
            borderRadius: '12px',
            background: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px),
              linear-gradient(45deg, rgb(12, 12, 12), rgb(22, 22, 22))
            `,
          }}
        />

        {/* Layer 3: Shimmer gradient (matches header shimmerGradient) */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '12px',
            opacity: 0.6,
            mixBlendMode: 'overlay',
            background: `linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.05) 0%,
              rgba(255, 255, 255, 0.15) 20%,
              rgba(255, 255, 255, 0.25) 40%,
              rgba(255, 255, 255, 0.15) 60%,
              rgba(255, 255, 255, 0.05) 80%,
              rgba(255, 255, 255, 0.02) 100%
            )`,
          }}
        />

        {/* Layer 4: Gold accent glow along top edge */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '12px',
            background: 'linear-gradient(180deg, rgba(255,215,0,0.08) 0%, transparent 40%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div
          className="relative flex items-center gap-2.5"
          style={{ padding: '10px 16px' }}
        >
          {/* Camera Icon — glass effect: grayscale/dim at rest, full color on hover */}
          <svg
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
            className="glass-icon transition-all duration-500 group-hover:glass-icon-hover"
            style={{ width: '16px', height: '16px', flexShrink: 0 }}
          >
            <defs>
              <linearGradient id="mTop" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#ea4335" />
                <stop offset="1" stopColor="#fbbc04" />
              </linearGradient>
              <linearGradient id="mRight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fbbc04" />
                <stop offset="1" stopColor="#34a853" />
              </linearGradient>
              <linearGradient id="mBottom" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0" stopColor="#34a853" />
                <stop offset="1" stopColor="#4285f4" />
              </linearGradient>
              <linearGradient id="mLeft" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#4285f4" />
                <stop offset="1" stopColor="#ea4335" />
              </linearGradient>
            </defs>
            <path d="M 64 60 L 166 60 A 24 24 0 0 1 190 84" stroke="url(#mTop)" strokeWidth="28" strokeLinecap="round" fill="none" />
            <path d="M 190 84 V 100 L 240 70 V 186 L 190 156 V 172 A 24 24 0 0 1 166 196" stroke="url(#mRight)" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 166 196 L 64 196 A 24 24 0 0 1 40 172" stroke="url(#mBottom)" strokeWidth="28" strokeLinecap="round" fill="none" />
            <path d="M 40 172 L 40 84 A 24 24 0 0 1 64 60" stroke="url(#mLeft)" strokeWidth="28" strokeLinecap="round" fill="none" />
          </svg>

          {/* Label — hidden on very small screens, dimmed to match icon */}
          <span
            className="hidden sm:inline text-sm whitespace-nowrap tracking-wide transition-all duration-500"
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-taskor)',
              fontWeight: 400,
              fontFeatureSettings: '"ss01" 1',
            }}
          >
            The Inside Look
          </span>
        </div>

        {/* Glass icon + button hover styles */}
        <style>{`
          .glass-icon {
            filter: grayscale(100%) opacity(0.6) brightness(3) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
            transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .group:hover {
            transform: translateY(-4px) scale(1.06) !important;
            box-shadow: 0 10px 32px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.4) !important;
          }
          .group:hover .glass-icon {
            filter: grayscale(0%) opacity(1) brightness(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
          }
          .group:hover span {
            color: rgba(255, 255, 255, 0.95) !important;
            text-shadow: 0 0 12px rgba(255, 255, 255, 0.25);
          }
        `}</style>
      </button>

      {/* Video Slide Panel */}
      <VideoSlidePanel isOpen={isPanelOpen} onClose={handleClose} />
    </>
  );
}

export default FloatingVideoButton;
