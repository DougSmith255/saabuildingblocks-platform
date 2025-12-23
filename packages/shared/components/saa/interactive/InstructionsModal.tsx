'use client';

import React, { useEffect } from 'react';

export interface InstructionsModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** User's name for personalization */
  userName?: string;
}

// Inline styles (styled-jsx doesn't work from shared packages)
// CRITICAL: Header is z-[10010] and hamburger is z-[10030], so we need higher
const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 100000, // Much higher than header (z-index: 10010) and hamburger (10030)
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    overflowY: 'auto',
    // @ts-ignore - overscrollBehavior is valid CSS
    overscrollBehavior: 'contain',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 100000, // Same high z-index to cover header/footer
    background: 'rgba(0, 0, 0, 0.9)',
    backdropFilter: 'blur(8px)',
  },
  modalWrapper: {
    position: 'relative',
    zIndex: 100001,
    maxWidth: '520px',
    width: '100%',
    maxHeight: '90vh',
    margin: 'auto',
  },
  modal: {
    position: 'relative',
    background: '#151517',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '2rem',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    // @ts-ignore - overscrollBehavior is valid CSS
    overscrollBehavior: 'contain',
    textAlign: 'center',
    boxSizing: 'border-box' as const,
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '44px',
    height: '44px',
    minWidth: '44px',
    minHeight: '44px',
    padding: 0,
    margin: 0,
    background: 'rgba(255, 255, 255, 0.15)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100002,
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  successIcon: {
    width: '64px',
    height: '64px',
    margin: '0 auto 1.5rem',
    background: 'rgba(0, 255, 136, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successSvg: {
    width: '32px',
    height: '32px',
    stroke: '#00ff88',
  },
  title: {
    fontFamily: 'var(--font-amulya, system-ui), sans-serif',
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontFamily: 'var(--font-synonym, system-ui), sans-serif',
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '2rem',
  },
  instructionsList: {
    textAlign: 'left' as const,
    marginBottom: '2rem',
  },
  instructionItem: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.25rem',
  },
  instructionNumber: {
    flexShrink: 0,
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #ffd700, #e6c200)',
    color: '#2a2a2a',
    fontWeight: 700,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionContent: {
    flex: 1,
  },
  instructionTitle: {
    display: 'block',
    color: '#fff',
    fontFamily: 'var(--font-amulya, system-ui), sans-serif',
    fontSize: '1rem',
    marginBottom: '0.25rem',
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
    lineHeight: 1.5,
    margin: 0,
  },
  cta: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #ffd700, #e6c200)',
    color: '#2a2a2a',
    fontFamily: 'var(--font-taskor, system-ui), sans-serif',
    fontWeight: 600,
    fontSize: '1rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '1.5rem',
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  footerLink: {
    color: '#ffd700',
    textDecoration: 'none',
  },
};

/**
 * InstructionsModal - Modal showing next steps after joining
 */
export function InstructionsModal({
  isOpen,
  onClose,
  userName = 'Agent',
}: InstructionsModalProps) {
  // Prevent body scroll when modal is open and notify header to hide
  useEffect(() => {
    if (isOpen) {
      // Simple overflow hidden - no position:fixed to avoid scroll jump
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      // Dispatch event to hide header
      window.dispatchEvent(new CustomEvent('saa-modal-open'));
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      // Dispatch event to show header
      window.dispatchEvent(new CustomEvent('saa-modal-close'));
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={styles.container}
      onClick={handleOverlayClick}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Separate backdrop */}
      <div style={styles.backdrop} />

      {/* Modal Wrapper - button is outside scrollable area */}
      <div
        style={styles.modalWrapper}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button - positioned on wrapper, not inside scrollable modal */}
        <button type="button" style={styles.closeBtn} onClick={handleCloseClick} aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{pointerEvents: 'none', display: 'block', flexShrink: 0}}>
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Scrollable modal content */}
        <div
          style={styles.modal}
          onWheel={(e) => e.stopPropagation()}
        >
        <div style={styles.successIcon}>
          <svg style={styles.successSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        <h3 style={styles.title}>Welcome, {userName}!</h3>
        <p style={styles.subtitle}>Follow these steps to join Smart Agent Alliance at eXp Realty.</p>

        <div style={styles.instructionsList}>
          <div style={styles.instructionItem}>
            <div style={styles.instructionNumber}>1</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>Start Your Application</strong>
              <p style={styles.instructionText}>Visit <a href="https://joinapp.exprealty.com/" target="_blank" rel="noopener noreferrer" style={{color: '#ffd700'}}>joinapp.exprealty.com</a> to begin your eXp Realty application.</p>
            </div>
          </div>

          <div style={styles.instructionItem}>
            <div style={styles.instructionNumber}>2</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>Search for Your Sponsor</strong>
              <p style={styles.instructionText}>Enter <strong style={{color: '#fff'}}>doug.smart@expreferral.com</strong> and click Search. Select <strong style={{color: '#fff'}}>Sheldon Douglas Smart</strong> as your sponsor.</p>
            </div>
          </div>

          <div style={styles.instructionItem}>
            <div style={styles.instructionNumber}>3</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>Complete Your Application</strong>
              <p style={styles.instructionText}>Fill out the application form and submit. You'll receive a confirmation email from eXp.</p>
            </div>
          </div>

          <div style={styles.instructionItem}>
            <div style={styles.instructionNumber}>4</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>Activate Your Agent Portal</strong>
              <p style={styles.instructionText}>Once your license transfers, you'll receive an email to activate your Smart Agent Alliance portal with all your onboarding materials and resources.</p>
            </div>
          </div>

          <div style={{...styles.instructionItem, marginBottom: 0}}>
            <div style={styles.instructionNumber}>5</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>eXp Realty Support</strong>
              <p style={styles.instructionText}>For application issues, call <strong style={{color: '#fff'}}>833-303-0610</strong> or email <a href="mailto:expertcare@exprealty.com" style={{color: '#ffd700'}}>expertcare@exprealty.com</a>.</p>
            </div>
          </div>
        </div>

        <a
          href="https://joinapp.exprealty.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{...styles.cta, display: 'block', textDecoration: 'none', textAlign: 'center'}}
        >
          Join eXp with SAA
        </a>

        <p style={styles.footer}>
          Questions? Email us at <a style={styles.footerLink} href="mailto:team@smartagentalliance.com">team@smartagentalliance.com</a>
        </p>
        </div>
      </div>
    </div>
  );
}

export default InstructionsModal;
