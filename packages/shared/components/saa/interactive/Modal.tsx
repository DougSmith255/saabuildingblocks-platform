'use client';

import React, { useEffect, useRef, useCallback } from 'react';

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Size variant - controls max-width */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Optional custom className for the modal panel */
  className?: string;
  /** Whether to show the close button (default: true) */
  showCloseButton?: boolean;
  /** Whether clicking backdrop closes modal (default: true) */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape closes modal (default: true) */
  closeOnEscape?: boolean;
}

// Size configurations
const SIZE_CONFIG = {
  sm: '400px',
  md: '500px',
  lg: '640px',
  xl: '800px',
  full: '95vw',
} as const;

// Inline styles - styled-jsx doesn't work from shared packages
// CRITICAL: Header is z-[10010] and hamburger is z-[10030], so we need higher
const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 100000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 100000,
    background: 'rgba(0, 0, 0, 0.9)',
    backdropFilter: 'blur(8px)',
  },
  modalWrapper: {
    position: 'relative',
    zIndex: 100001,
    width: '100%',
    maxHeight: '90vh',
    margin: 'auto',
  },
  modal: {
    position: 'relative',
    background: '#151517',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '2.5rem 2rem 2rem 2rem',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    boxSizing: 'border-box',
  },
  closeBtn: {
    position: 'absolute',
    top: '-12px',
    right: '-12px',
    width: '44px',
    height: '44px',
    minWidth: '44px',
    minHeight: '44px',
    padding: 0,
    margin: 0,
    background: 'rgba(40, 40, 40, 0.95)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100005,
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
    boxSizing: 'border-box',
    pointerEvents: 'auto',
  },
};

/**
 * Modal - Base modal component for consistent modal behavior across the site
 *
 * Features:
 * - Consistent styling with dark backdrop + blur
 * - 44px circular close button positioned outside modal (top-right)
 * - Body scroll locking when open
 * - Escape key to close
 * - Click outside to close
 * - Header hide/show events (saa-modal-open/close)
 * - Size variants: sm, md, lg, xl, full
 *
 * @example
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
 *   <h2>Modal Title</h2>
 *   <p>Modal content here</p>
 * </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  className = '',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Prevent body scroll when modal is open and notify header to hide
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      window.dispatchEvent(new CustomEvent('saa-modal-open'));
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('saa-modal-close'));
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Native DOM event listener for close button - bypasses React synthetic events
  useEffect(() => {
    const btn = closeBtnRef.current;
    if (!btn || !isOpen) return;
    const handleClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    };
    btn.addEventListener('click', handleClick);
    btn.addEventListener('touchend', handleClick);
    return () => {
      btn.removeEventListener('click', handleClick);
      btn.removeEventListener('touchend', handleClick);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnBackdropClick && e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose, closeOnBackdropClick]
  );

  if (!isOpen) return null;

  return (
    <div
      style={styles.container}
      onClick={handleOverlayClick}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div style={styles.backdrop} />

      {/* Modal Wrapper */}
      <div
        style={{ ...styles.modalWrapper, maxWidth: SIZE_CONFIG[size] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - positioned relative to modalWrapper */}
        {showCloseButton && (
          <button
            ref={closeBtnRef}
            type="button"
            style={styles.closeBtn}
            aria-label="Close modal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ pointerEvents: 'none', display: 'block', flexShrink: 0 }}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Modal panel with scrollable content */}
        <div
          style={styles.modal}
          className={className}
          onWheel={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
