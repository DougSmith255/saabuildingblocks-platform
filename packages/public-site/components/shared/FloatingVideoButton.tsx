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
          borderRadius: '9999px',
          cursor: 'pointer',
          opacity: shouldShow ? 1 : 0,
          transform: shouldShow ? 'translateY(0)' : 'translateY(80px)',
          pointerEvents: shouldShow ? 'auto' : 'none',
          // Outer glow + border matching header
          border: '2px solid rgba(60, 60, 60, 0.8)',
          boxShadow: `
            0 0 24px rgba(255, 215, 0, 0.12),
            0 4px 20px rgba(0, 0, 0, 0.5),
            0 2px 8px rgba(0, 0, 0, 0.3)
          `,
          overflow: 'hidden',
          position: 'fixed',
        }}
        aria-label="Watch The Inside Look video"
      >
        {/* Layer 1: Glass Base — dark gradient + gold vertical lines (matches header glassBase) */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '9999px',
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
            borderRadius: '9999px',
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
            borderRadius: '9999px',
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
            borderRadius: '9999px',
            background: 'linear-gradient(180deg, rgba(255,215,0,0.08) 0%, transparent 40%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div
          className="relative flex items-center gap-2.5"
          style={{ padding: '12px 22px' }}
        >
          {/* Play Icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-300 group-hover:scale-110"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z"
              fill="#ffd700"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.5))',
              }}
            />
          </svg>

          {/* Label — hidden on very small screens */}
          <span
            className="hidden sm:inline text-sm font-semibold whitespace-nowrap tracking-wide"
            style={{
              color: '#ffd700',
              textShadow: '0 0 8px rgba(255,215,0,0.3)',
              letterSpacing: '0.04em',
            }}
          >
            The Inside Look
          </span>
        </div>
      </button>

      {/* Video Slide Panel */}
      <VideoSlidePanel isOpen={isPanelOpen} onClose={handleClose} />
    </>
  );
}

export default FloatingVideoButton;
