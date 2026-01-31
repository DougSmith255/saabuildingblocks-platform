'use client';

import { useState, useEffect, useCallback } from 'react';
import { VideoSlidePanel } from '@saa/shared/components/saa/media/VideoSlidePanel';

/**
 * FloatingVideoButton - Fixed bottom-right pill button for "The Inside Look" video
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
      // Hide when within 200px of the bottom
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
        className="fixed z-[10005] flex items-center gap-2 transition-all duration-500"
        style={{
          bottom: '24px',
          right: '24px',
          padding: '12px 20px',
          borderRadius: '9999px',
          background: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 215, 0, 0.35)',
          boxShadow: `
            0 0 20px rgba(255, 215, 0, 0.15),
            0 4px 16px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `,
          cursor: 'pointer',
          opacity: shouldShow ? 1 : 0,
          transform: shouldShow ? 'translateY(0)' : 'translateY(80px)',
          pointerEvents: shouldShow ? 'auto' : 'none',
        }}
        aria-label="Watch The Inside Look video"
      >
        {/* Play Icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z"
            fill="#ffd700"
          />
        </svg>

        {/* Label - hidden on very small screens */}
        <span
          className="hidden sm:inline text-sm font-semibold whitespace-nowrap"
          style={{
            color: '#ffd700',
            letterSpacing: '0.02em',
          }}
        >
          The Inside Look
        </span>

        {/* Pulse ring animation */}
        <style jsx>{`
          @keyframes floatingPulse {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.4); }
            50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.4); }
          }
        `}</style>
      </button>

      {/* Video Slide Panel */}
      <VideoSlidePanel isOpen={isPanelOpen} onClose={handleClose} />
    </>
  );
}

export default FloatingVideoButton;
