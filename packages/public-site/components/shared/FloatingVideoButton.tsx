'use client';

import { useState, useEffect, useCallback } from 'react';
import { VideoSlidePanel } from '@saa/shared/components/saa/media/VideoSlidePanel';

/**
 * FloatingVideoButton - Fixed bottom-right pill button for "The Inside Look" video
 *
 * Uses the same glass treatment as the site header (dark gradient + gold lines +
 * white grid + shimmer overlay) adapted to a pill shape.
 * Animated rainbow gradient border (Uiverse-inspired) with blurred glow behind.
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
      {/* Outer shell — handles fixed positioning, visibility, show/hide slide-in */}
      <div
        className="fixed z-[10005] transition-all duration-500"
        style={{
          bottom: '24px',
          right: '24px',
          opacity: shouldShow ? 1 : 0,
          transform: shouldShow ? 'translateY(0)' : 'translateY(80px)',
          pointerEvents: shouldShow ? 'auto' : 'none',
        }}
      >
        {/* Hover target — border, glow, and button all rise together */}
        <div className="floating-video-wrapper" style={{ position: 'relative', borderRadius: '14px' }}>
          {/* Animated gradient border — sits behind button via z-index */}
          <div className="fvb-gradient-border" />
          {/* Blurred glow behind button — same gradient, heavily blurred */}
          <div className="fvb-gradient-glow" />

        {/* Floating Button */}
        <button
          onClick={handleOpen}
          className="floating-video-btn"
          style={{
            position: 'relative',
            zIndex: 1,
            borderRadius: '12px',
            cursor: 'pointer',
            border: 'none',
            overflow: 'hidden',
            display: 'block',
            background: 'transparent',
          }}
          aria-label="Watch The Inside Look video"
        >
          {/* Layer 1: Glass Base — semi-transparent + backdrop blur + gold lines (matches header) */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: '12px',
              background: `
                linear-gradient(45deg, rgba(10, 10, 10, 0.73), rgba(26, 26, 26, 0.83)),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 215, 0, 0.02) 2px, rgba(255, 215, 0, 0.02) 4px)
              `,
              backdropFilter: 'blur(8px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(8px) saturate(1.5)',
              boxShadow: '0 0 30px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.04)',
              filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
            }}
          />

          {/* Layer 2: White horizontal grid (matches header glassBase::after) */}
          <div
            className="absolute inset-[1px]"
            style={{
              borderRadius: '12px',
              background: `
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px),
                linear-gradient(45deg, rgba(10, 10, 10, 0.73), rgba(26, 26, 26, 0.83))
              `,
            }}
          />

          {/* Layer 3: Animated radar shimmer (matches header shimmerLayer) */}
          <div
            className="fvb-shimmer absolute inset-0"
            style={{
              borderRadius: '12px',
              opacity: 0.7,
              mixBlendMode: 'overlay',
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
            {/* Camera Icon — desktop only (hidden on mobile) */}
            <svg
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              className="fvb-glass-icon hidden sm:block"
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

            {/* Mobile label — "Inside Look" (no icon) */}
            <span
              className="sm:hidden text-sm whitespace-nowrap tracking-wide fvb-label"
              style={{
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-taskor)',
                fontWeight: 400,
                fontFeatureSettings: '"ss01" 1',
              }}
            >
              Inside Look
            </span>

            {/* Desktop label — "The Inside Look" (with icon) */}
            <span
              className="hidden sm:inline text-sm whitespace-nowrap tracking-wide fvb-label"
              style={{
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-taskor)',
                fontWeight: 400,
                fontFeatureSettings: '"ss01" 1',
              }}
            >
              The Inside Look
            </span>
          </div>
        </button>
        </div>
      </div>

      {/* Scoped styles — only affect .floating-video-btn, not global .group */}
      <style>{`
        /* Animated radar shimmer — matches header/footer glass */
        .fvb-shimmer {
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.30) 25%,
            rgba(255, 255, 255, 0.50) 50%,
            rgba(255, 255, 255, 0.28) 75%,
            rgba(255, 255, 255, 0.12) 100%
          );
          background-size: 400% 400%;
          animation: fvbRadarShimmer 6s ease-in-out infinite;
        }
        @keyframes fvbRadarShimmer {
          0%, 100% {
            background-position: 0% 50%;
            filter: brightness(1.1);
          }
          50% {
            background-position: 100% 50%;
            filter: brightness(2.2);
          }
        }

        /* Animated gradient border */
        .fvb-gradient-border,
        .fvb-gradient-glow {
          position: absolute;
          left: -2px;
          top: -2px;
          border-radius: 14px;
          background: linear-gradient(45deg,
            #fb0094, #0000ff, #00ff00, #ffff00, #ff0000,
            #fb0094, #0000ff, #00ff00, #ffff00, #ff0000
          );
          background-size: 400%;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          z-index: 0;
          animation: fvbGradientFlow 20s linear infinite;
        }
        .fvb-gradient-glow {
          filter: blur(10px);
          opacity: 0.35;
          z-index: -1;
          transition: filter 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        @keyframes fvbGradientFlow {
          0% { background-position: 0 0; }
          50% { background-position: 400% 0; }
          100% { background-position: 0 0; }
        }

        /* Wrapper hover — whole unit (border + glow + button) rises and scales together */
        .floating-video-wrapper {
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .floating-video-wrapper:hover {
          transform: translateY(-3px) scale(1.04);
        }

        /* Glass icon — slightly brighter at rest for visibility */
        .fvb-glass-icon {
          filter: grayscale(100%) opacity(0.7) brightness(3.5) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
          transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* Label — lighter at rest for visibility */
        .fvb-label {
          color: rgba(255, 255, 255, 0.65);
          transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* Button hover — box-shadow only (transform handled by wrapper) */
        .floating-video-btn {
          transition: box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .floating-video-wrapper:hover .floating-video-btn {
          box-shadow: 0 10px 32px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .floating-video-wrapper:hover .fvb-glass-icon {
          filter: grayscale(0%) opacity(1) brightness(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
        }
        .floating-video-wrapper:hover .fvb-label {
          color: rgba(255, 255, 255, 0.95) !important;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.25);
        }

        /* Glow intensifies on hover */
        .floating-video-wrapper:hover .fvb-gradient-glow {
          opacity: 0.5;
          filter: blur(18px);
        }
      `}</style>

      {/* Video Slide Panel */}
      <VideoSlidePanel isOpen={isPanelOpen} onClose={handleClose} />
    </>
  );
}

export default FloatingVideoButton;
