'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { GoldenAmbientBackground } from './GoldenAmbientBackground';

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
  /** Panel width on desktop: sm (320px), md (384px), lg (448px), xl (560px) */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional class names for the panel */
  className?: string;
  /** Whether to show the close button (default: true) */
  showCloseButton?: boolean;
  /** Desktop only: panel width fits content up to maxWidth (default: false, uses fixed size) */
  fitContent?: boolean;
  /** Desktop only: maximum width when fitContent is true (default: '85vw') */
  maxWidth?: string;
  /** Hide the backdrop (for stacked panels sharing a single backdrop) */
  hideBackdrop?: boolean;
  /** Z-index offset for stacking panels */
  zIndexOffset?: number;
  /** Color theme: 'gold' (default) or 'blue' */
  theme?: 'gold' | 'blue';
  /** Optional background element rendered behind header+content (e.g., 3D scene) */
  backgroundElement?: React.ReactNode;
  /** Ref that exposes the panel's close() method for programmatic closing with animation */
  closeRef?: React.MutableRefObject<(() => void) | null>;
}

// Size configurations - all desktop panels use 500px width
const SIZE_CONFIG = {
  sm: '500px',
  md: '500px',
  lg: '500px',
  xl: '500px',
} as const;

// CSS keyframe animations as a string (injected once)
const KEYFRAMES_CSS = `
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
/* Hide scrollbar completely when slide panel is open */
.slide-panel-open {
  overflow: hidden !important;
}
.slide-panel-open,
.slide-panel-open body {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
.slide-panel-open::-webkit-scrollbar,
.slide-panel-open body::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
`;

// Inject keyframes CSS once
let keyframesInjected = false;
function injectKeyframes() {
  if (keyframesInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-slide-panel-keyframes', 'true');
  style.textContent = KEYFRAMES_CSS;
  document.head.appendChild(style);
  keyframesInjected = true;
}

// Check if mobile (< 950px)
function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return true;
  return window.innerWidth < 950;
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
 * - Premium glass effect with configurable theme (gold/blue)
 * - Optional background element for immersive content (e.g., 3D scenes)
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
  showCloseButton = true,
  fitContent = false,
  maxWidth = '85vw',
  hideBackdrop = false,
  zIndexOffset = 0,
  theme = 'gold',
  backgroundElement,
  closeRef,
}: SlidePanelProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; scrollTop: number } | null>(null);

  // Track previous isOpen to detect external closes (parent setting isOpen=false)
  const wasOpenRef = useRef(false);
  const didAnimateCloseRef = useRef(false);

  const SWIPE_THRESHOLD = 80;
  const ANIMATION_DURATION = 250;

  // Reset close tracking when panel opens
  if (isOpen && !wasOpenRef.current) {
    didAnimateCloseRef.current = false;
  }

  // Detect external close: isOpen went from true→false without internal handleClose
  const needsCloseAnimation = wasOpenRef.current && !isOpen && !isClosing && !didAnimateCloseRef.current;

  // Combined flag for animation styles (internal close OR external close)
  const animatingOut = isClosing || needsCloseAnimation;

  // Theme-driven accent colors (RGB string and hex)
  const accentRgb = theme === 'blue' ? '0, 191, 255' : '255, 215, 0';
  const accentHex = theme === 'blue' ? '#00bfff' : '#ffd700';

  // Whether the panel has a full-bleed background (explicit or auto gold)
  const hasBackground = !!backgroundElement || theme === 'gold';
  // Auto gold honeycomb: no explicit backgroundElement, gold theme
  const hasAutoGold = !backgroundElement && theme === 'gold';

  // Track when component is mounted (for portal rendering)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Inject keyframes on mount
  useEffect(() => {
    injectKeyframes();
  }, []);

  // Track mobile/desktop on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(isMobileViewport());
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close with animation (internal — triggered by X button, Escape, swipe, backdrop,
  // or programmatically via closeRef)
  const handleClose = useCallback(() => {
    if (isClosing) return; // prevent double-close
    didAnimateCloseRef.current = true;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, ANIMATION_DURATION);
  }, [onClose, isClosing]);

  // Expose close() to parent via ref — allows programmatic close with animation
  if (closeRef) closeRef.current = handleClose;

  // Track if panel has been opened (for keeping in DOM after first open)
  useEffect(() => {
    if (isOpen && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
  }, [isOpen, hasBeenOpened]);

  // Animate external close (parent set isOpen=false without going through handleClose)
  useEffect(() => {
    if (needsCloseAnimation) {
      didAnimateCloseRef.current = true;
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
      }, ANIMATION_DURATION);
    }
  }, [needsCloseAnimation]);

  // Keep wasOpenRef in sync (runs after render)
  useEffect(() => {
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // Lock body scroll and hide scrollbar when open
  useEffect(() => {
    if (isOpen) {
      // Add class to html element to completely hide scrollbar
      document.documentElement.classList.add('slide-panel-open');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.classList.remove('slide-panel-open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.classList.remove('slide-panel-open');
      document.documentElement.style.overflow = '';
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

  // Don't render anything if never opened or not mounted (SSR safety)
  if (!mounted || (!hasBeenOpened && !isOpen)) {
    return null;
  }

  // Don't render if closed and no close animation pending/playing
  if (!isOpen && !isClosing && !needsCloseAnimation) {
    return null;
  }

  // Inline styles
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 100000 + zIndexOffset,
    display: 'flex',
    alignItems: isMobile ? 'flex-end' : 'stretch',
    justifyContent: isMobile ? 'center' : 'flex-end',
  };

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    isolation: 'isolate',
    animation: animatingOut
      ? 'slidePanelBackdropOut 0.25s ease-in forwards'
      : 'slidePanelBackdropIn 0.3s ease-out forwards',
  };

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'relative',
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        ...(hasBackground ? { display: 'flex', flexDirection: 'column' as const, minHeight: '85vh' } : {}),
        overscrollBehavior: 'contain',
        borderTop: `1px solid rgba(${accentRgb}, 0.2)`,
        borderRadius: '1rem 1rem 0 0',
        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
        background: hasAutoGold
          ? 'transparent'
          : `
            linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
            linear-gradient(45deg, rgba(18, 18, 18, 0.97), rgba(28, 28, 28, 0.98))
          `,
        backdropFilter: hasAutoGold ? undefined : 'blur(12px) saturate(1.4)',
        WebkitBackdropFilter: hasAutoGold ? undefined : 'blur(12px) saturate(1.4)',
        boxShadow: `
          0 -10px 40px rgba(0, 0, 0, 0.5),
          0 0 40px rgba(${accentRgb}, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.08),
          inset 0 -1px 0 rgba(0, 0, 0, 0.3)
        `,
        animation: animatingOut
          ? 'slidePanelDown 0.25s ease-in forwards'
          : 'slidePanelUp 0.3s ease-out forwards',
      }
    : {
        position: 'relative',
        // fitContent: width auto-sizes to content, capped at maxWidth
        // otherwise: fixed width based on size prop
        width: fitContent ? 'fit-content' : '100%',
        maxWidth: fitContent ? maxWidth : SIZE_CONFIG[size],
        minWidth: fitContent ? SIZE_CONFIG[size] : undefined, // Keep minimum width for readability
        height: '100dvh',
        overflowY: 'auto',
        ...(hasBackground ? { display: 'flex', flexDirection: 'column' as const } : {}),
        overscrollBehavior: 'contain',
        borderLeft: `1px solid rgba(${accentRgb}, 0.25)`,
        borderRadius: '1rem 0 0 1rem',
        background: hasAutoGold
          ? 'transparent'
          : `
            linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, transparent 40%),
            linear-gradient(45deg, rgba(14, 14, 14, 0.98), rgba(24, 24, 24, 0.99))
          `,
        backdropFilter: hasAutoGold ? undefined : 'blur(16px) saturate(1.5)',
        WebkitBackdropFilter: hasAutoGold ? undefined : 'blur(16px) saturate(1.5)',
        boxShadow: `
          -20px 0 60px rgba(0, 0, 0, 0.6),
          -5px 0 20px rgba(0, 0, 0, 0.4),
          0 0 50px rgba(${accentRgb}, 0.08),
          inset 1px 0 0 rgba(255, 255, 255, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.04),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2)
        `,
        animation: animatingOut
          ? 'slidePanelLeft 0.25s ease-in forwards'
          : 'slidePanelRight 0.3s ease-out forwards',
      };

  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: hasBackground
      ? `linear-gradient(135deg, rgba(${accentRgb}, 0.1) 0%, rgba(18, 18, 18, 0.85) 50%)`
      : `linear-gradient(135deg, rgba(${accentRgb}, 0.1) 0%, rgb(18, 18, 18) 50%)`,
    borderRadius: isMobile ? '1rem 1rem 0.5rem 0.5rem' : '1rem 0 0 0.5rem',
  };

  const iconWrapperStyle: React.CSSProperties = {
    padding: '0.5rem',
    borderRadius: '0.5rem',
    background: `rgba(${accentRgb}, 0.15)`,
    border: `1px solid rgba(${accentRgb}, 0.3)`,
    boxShadow: `0 0 12px rgba(${accentRgb}, 0.2)`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: accentHex,
    textShadow: `0 0 20px rgba(${accentRgb}, 0.3)`,
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: 'rgba(229, 228, 221, 0.6)',
    margin: '0.25rem 0 0 0',
  };

  const closeButtonStyle: React.CSSProperties = {
    padding: '0.5rem',
    borderRadius: '0.5rem',
    background: 'transparent',
    border: 'none',
    color: `rgba(${accentRgb}, 0.7)`,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  };

  const contentStyle: React.CSSProperties = {
    padding: '1.25rem',
    // When a background is present (explicit or auto gold), content is
    // absolutely positioned starting BELOW the sticky header so it can
    // never scroll behind it. Flex centering works within this area.
    // Using explicit top/left/right/bottom instead of inset+paddingTop
    // because padding on a scrollable container is itself scrollable.
    ...(hasBackground ? {
      position: 'absolute' as const,
      top: '80px',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'auto',
    } : {}),
  };

  const footerStyle: React.CSSProperties = {
    padding: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    position: hasBackground ? 'relative' : undefined,
    zIndex: hasBackground ? 1 : undefined,
  };

  // Use portal to render at document.body level, escaping any stacking context issues
  return createPortal(
    <div
      style={containerStyle}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="slide-panel-title"
    >
      {/* Backdrop - conditionally rendered */}
      {!hideBackdrop && <div style={backdropStyle} aria-hidden="true" />}

      {/* Panel */}
      <div
        ref={panelRef}
        style={panelStyle}
        className={className}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Element - renders behind everything, fills entire panel */}
        {backgroundElement ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              overflow: 'hidden',
              borderRadius: 'inherit',
              pointerEvents: 'none',
            }}
          >
            {backgroundElement}
          </div>
        ) : theme === 'gold' ? (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                borderRadius: 'inherit',
                pointerEvents: 'none',
              }}
            >
              <GoldenAmbientBackground isVisible={isOpen && !animatingOut} />
            </div>
            {/* Feathered gradient overlay — soft dark center fading to transparent
                on all edges so the honeycomb stays visible at the perimeter */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                borderRadius: 'inherit',
                pointerEvents: 'none',
                background: `radial-gradient(
                  ellipse 70% 60% at 50% 50%,
                  rgba(6, 6, 10, 0.75) 0%,
                  rgba(6, 6, 10, 0.55) 35%,
                  rgba(6, 6, 10, 0.25) 60%,
                  rgba(6, 6, 10, 0) 85%
                )`,
              }}
            />
          </>
        ) : null}

        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {icon && <div style={iconWrapperStyle}>{icon}</div>}
            <div>
              <h2 id="slide-panel-title" style={titleStyle}>
                {title}
              </h2>
              {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
            </div>
          </div>
          {showCloseButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              style={closeButtonStyle}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
              aria-label="Close panel"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div style={contentStyle}>{children}</div>

        {/* Footer (if provided) */}
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export default SlidePanel;
