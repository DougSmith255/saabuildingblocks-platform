'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface SlidePanelProps {
  /** Whether the panel is open */
  isOpen: boolean;
  /** Callback when the panel should close */
  onClose: () => void;
  /** Panel title displayed in header */
  title: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Optional icon component to display next to title */
  icon?: React.ReactNode;
  /** Panel content */
  children: React.ReactNode;
  /** Optional footer content (e.g., action buttons) */
  footer?: React.ReactNode;
  /** Panel width on desktop: sm (20rem), md (24rem), lg (28rem) */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class names for the panel */
  className?: string;
  /** Hide the backdrop (for stacked panels sharing a single backdrop) */
  hideBackdrop?: boolean;
  /** Z-index offset for stacking panels */
  zIndexOffset?: number;
}

/**
 * SlidePanel - A reusable slide-in panel component
 *
 * Mobile (< 950px): Slides up from bottom as a bottom sheet
 * Desktop (≥ 950px): Slides in from right as a side panel
 *
 * Features:
 * - Click backdrop to close
 * - Press Escape to close
 * - Swipe down to close (mobile, only when at top of scroll)
 * - Swipe right to close (desktop)
 * - Body scroll locked when open
 * - Premium glass effect with gold theme
 */
export function SlidePanel({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  size = 'md',
  className = '',
  hideBackdrop = false,
  zIndexOffset = 0,
}: SlidePanelProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; scrollTop: number } | null>(null);
  const prevIsOpenRef = useRef(isOpen);

  const SWIPE_THRESHOLD = 80;
  const ANIMATION_DURATION = 250;

  // Track when component is mounted (for portal rendering)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect when isOpen changes from true to false (parent triggered close)
  // and play closing animation before fully hiding
  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen && !isClosing) {
      // isOpen went from true to false - trigger closing animation
      setIsClosing(true);
      setShouldRender(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
        setShouldRender(false);
      }, ANIMATION_DURATION);
      prevIsOpenRef.current = isOpen;
      return () => clearTimeout(timer);
    }

    if (isOpen) {
      setShouldRender(true);
    }

    prevIsOpenRef.current = isOpen;
  }, [isOpen, isClosing]);

  // Size classes for desktop width - all use 500px like shared SlidePanel
  const sizeClasses = {
    sm: 'min-[950px]:max-w-[500px]',
    md: 'min-[950px]:max-w-[500px]',
    lg: 'min-[950px]:max-w-[500px]',
  };

  // Close with animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, ANIMATION_DURATION);
  }, [onClose]);

  // Track if panel has been opened (for keeping in DOM after first open)
  useEffect(() => {
    if (isOpen && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
  }, [isOpen, hasBeenOpened]);

  // Lock body scroll and hide scrollbar when open
  useEffect(() => {
    if (isOpen) {
      // Add class to html element to completely hide scrollbar
      document.documentElement.classList.add('slide-panel-body-lock');
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.classList.remove('slide-panel-body-lock');
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.classList.remove('slide-panel-body-lock');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isClosing) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isClosing, handleClose]);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.currentTarget as HTMLElement;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      scrollTop: target.scrollTop,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isClosing) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isMobile = window.innerWidth < 950;

    if (isMobile) {
      // Swipe down to close - only if at top of scroll
      const wasAtTop = touchStartRef.current.scrollTop <= 0;
      if (deltaY > SWIPE_THRESHOLD && !isHorizontalSwipe && wasAtTop) {
        handleClose();
      }
    } else {
      // Swipe right to close
      if (deltaX > SWIPE_THRESHOLD && isHorizontalSwipe) {
        handleClose();
      }
    }

    touchStartRef.current = null;
  };

  // Handle backdrop click
  const handleBackdropClick = () => {
    if (!isClosing) {
      handleClose();
    }
  };

  // Check if we need to render during a close transition
  // This catches the race condition where render happens before useEffect sets isClosing
  const isClosingTransition = prevIsOpenRef.current === true && !isOpen;

  // Don't render anything if never opened or not mounted (SSR safety)
  if (!mounted || (!hasBeenOpened && !isOpen && !shouldRender && !isClosingTransition)) {
    return null;
  }

  // Don't render if closed and not closing animation and not in shouldRender state and not in closing transition
  if (!isOpen && !isClosing && !shouldRender && !isClosingTransition) {
    return null;
  }

  return (
    <>
      {/* CSS Styles */}
      <style jsx global>{`
        /* Slide-in animations */
        @keyframes slidePanelUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes slidePanelDown {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }
        @keyframes slidePanelRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slidePanelLeft {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        @keyframes slidePanelBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slidePanelBackdropOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        /* Backdrop */
        .slide-panel-backdrop {
          animation: slidePanelBackdropIn 0.3s ease-out forwards;
        }
        .slide-panel-backdrop-closing {
          animation: slidePanelBackdropOut 0.25s ease-in forwards;
        }

        /* Panel - Mobile first (bottom sheet) */
        .slide-panel {
          animation: slidePanelUp 0.3s ease-out forwards;
          border-top: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 1rem 1rem 0 0;
          padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
          max-height: 85vh;
          width: 100%;
          /* Premium glass background */
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
            linear-gradient(45deg, rgba(18, 18, 18, 0.97), rgba(28, 28, 28, 0.98));
          backdrop-filter: blur(12px) saturate(1.4);
          -webkit-backdrop-filter: blur(12px) saturate(1.4);
          /* 3D depth with multiple shadows */
          box-shadow:
            0 -10px 40px rgba(0, 0, 0, 0.5),
            0 0 40px rgba(255, 215, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3);
        }

        .slide-panel-closing {
          animation: slidePanelDown 0.25s ease-in forwards;
        }

        .slide-panel-header {
          border-radius: 1rem 1rem 0.5rem 0.5rem;
          background: rgb(18, 18, 18) !important;
          backdrop-filter: none !important;
        }

        /* Hide scrollbar completely when slide panel is open */
        .slide-panel-body-lock {
          overflow: hidden !important;
        }
        .slide-panel-body-lock,
        .slide-panel-body-lock body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .slide-panel-body-lock::-webkit-scrollbar,
        .slide-panel-body-lock body::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* Desktop (950px+): right panel */
        @media (min-width: 950px) {
          .slide-panel {
            animation: slidePanelRight 0.3s ease-out forwards;
            border: none;
            border-left: 1px solid rgba(255, 215, 0, 0.25);
            border-radius: 1rem 0 0 1rem;
            padding-bottom: 0;
            max-height: 100dvh;
            height: 100dvh;
            /* Premium glass background with subtle gradient */
            background:
              linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, transparent 40%),
              linear-gradient(45deg, rgba(14, 14, 14, 0.98), rgba(24, 24, 24, 0.99));
            backdrop-filter: blur(16px) saturate(1.5);
            -webkit-backdrop-filter: blur(16px) saturate(1.5);
            /* 3D depth effect */
            box-shadow:
              -20px 0 60px rgba(0, 0, 0, 0.6),
              -5px 0 20px rgba(0, 0, 0, 0.4),
              0 0 50px rgba(255, 215, 0, 0.08),
              inset 1px 0 0 rgba(255, 255, 255, 0.06),
              inset 0 1px 0 rgba(255, 255, 255, 0.04),
              inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          }

          .slide-panel-closing {
            animation: slidePanelLeft 0.25s ease-in forwards;
          }

          .slide-panel-header {
            border-radius: 1rem 0 0 0.5rem;
          }
        }
      `}</style>

      {/* Portal to render at document.body level, escaping stacking context issues */}
      {createPortal(
        <div
          className="fixed inset-0 flex items-end min-[950px]:items-stretch min-[950px]:justify-end"
          style={{ zIndex: 10020 + zIndexOffset }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="slide-panel-title"
        >
          {/* Backdrop - conditionally rendered */}
          {!hideBackdrop && (
            <div
              className={`slide-panel-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm ${
                (isClosing || isClosingTransition) ? 'slide-panel-backdrop-closing' : ''
              }`}
              style={{ isolation: 'isolate' }}
              aria-hidden="true"
            />
          )}

          {/* Panel */}
          <div
            ref={panelRef}
            className={`slide-panel relative overflow-y-auto overscroll-contain ${sizeClasses[size]} ${
              (isClosing || isClosingTransition) ? 'slide-panel-closing' : ''
            } ${className}`}
            style={{
              background: 'linear-gradient(135deg, rgba(20,20,20,0.98) 0%, rgba(12,12,12,0.99) 100%)',
              // Disable pointer events during closing so panel underneath can receive clicks
              pointerEvents: (isClosing || isClosingTransition) ? 'none' : 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <div
              className="slide-panel-header sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(20,20,20,0.98) 50%)',
              }}
            >
              <div className="flex items-center gap-3">
                {icon && (
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: 'rgba(255, 215, 0, 0.15)',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      boxShadow: '0 0 12px rgba(255, 215, 0, 0.2)',
                    }}
                  >
                    {icon}
                  </div>
                )}
                <div>
                  <h2
                    id="slide-panel-title"
                    className="text-xl font-semibold text-[#ffd700]"
                    style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.3)' }}
                  >
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-sm text-[#e5e4dd]/60" style={{ fontFamily: 'var(--font-amulya, sans-serif)' }}>{subtitle}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                style={{
                  color: 'rgba(255, 215, 0, 0.7)',
                }}
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {children}
            </div>

            {/* Footer (if provided) */}
            {footer && (
              <div className="p-5 border-t border-white/10">
                {footer}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default SlidePanel;
