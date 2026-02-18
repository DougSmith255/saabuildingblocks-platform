'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * FloatingVideoButton - Fixed bottom-right pill button for "Book a Call"
 *
 * Uses the same glass treatment as the site header (dark gradient + gold lines +
 * white grid + shimmer overlay) adapted to a pill shape.
 * Animated rainbow gradient border (Uiverse-inspired) with blurred glow behind.
 *
 * Links to /book-a-call page on click.
 * Hides when: scrolled near footer, on initial load (slides in).
 * Should be excluded from blog post pages (handled by LayoutWrapper).
 */
export function FloatingVideoButton() {
  const [shouldShow, setShouldShow] = useState(false);

  // Show after 20% scroll, hide near footer
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollableHeight = docHeight - windowHeight;
      const scrollPercent = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;
      const nearBottom = scrollTop + windowHeight >= docHeight - 200;

      setShouldShow(scrollPercent >= 0.2 && !nearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        {/* Floating Button — now a Link to /book-a-call */}
        <Link
          href="/book-a-call"
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
            textDecoration: 'none',
          }}
          aria-label="Book a call with SAA"
        >
          {/* Layer 1: Dark base (matches agent portal L-frame) */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(180deg, rgb(14, 14, 14) 0%, rgb(10, 10, 10) 100%)',
            }}
          />

          {/* Layer 2: Crosshatch glass texture (exact agent portal L-frame values) */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: '12px',
              background: `
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 215, 0, 0.025) 2px, rgba(255, 215, 0, 0.025) 4px),
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px)
              `,
              backgroundAttachment: 'fixed',
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
            {/* Calendar Icon */}
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="fvb-glass-icon"
              style={{ width: '16px', height: '16px', flexShrink: 0 }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>

            {/* Label */}
            <span
              className="text-sm whitespace-nowrap tracking-wide fvb-label"
              style={{
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-taskor)',
                fontWeight: 400,
                fontFeatureSettings: '"ss01" 1',
              }}
            >
              Book a Call
            </span>
          </div>
        </Link>
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

        /* Reduce rainbow border by 1px on screens < 1024px */
        @media (max-width: 1023px) {
          .fvb-gradient-border,
          .fvb-gradient-glow {
            left: -1px !important;
            top: -1px !important;
            width: calc(100% + 2px) !important;
            height: calc(100% + 2px) !important;
          }
        }
      `}</style>
    </>
  );
}

export default FloatingVideoButton;
