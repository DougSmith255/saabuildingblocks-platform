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
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
    overflowY: 'auto',
  },
  modal: {
    background: '#151517',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '520px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '32px',
    height: '32px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
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

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div style={styles.successIcon}>
          <svg style={styles.successSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        <h3 style={styles.title}>Welcome, {userName}!</h3>
        <p style={styles.subtitle}>You're on your way to joining Smart Agent Alliance at eXp Realty.</p>

        <div style={styles.instructionsList}>
          <div style={styles.instructionItem}>
            <div style={styles.instructionNumber}>1</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>Check Your Email</strong>
              <p style={styles.instructionText}>We've sent you a welcome email with important next steps and resources.</p>
            </div>
          </div>

          <div style={styles.instructionItem}>
            <div style={styles.instructionNumber}>2</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>Schedule Your Call</strong>
              <p style={styles.instructionText}>A team member will reach out to schedule your strategy call within 24-48 hours.</p>
            </div>
          </div>

          <div style={{...styles.instructionItem, marginBottom: 0}}>
            <div style={styles.instructionNumber}>3</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>Join Our Community</strong>
              <p style={styles.instructionText}>Get access to our private Facebook group and start connecting with other agents.</p>
            </div>
          </div>
        </div>

        <button style={styles.cta} onClick={onClose}>
          Got It!
        </button>

        <p style={styles.footer}>
          Questions? Email us at <a style={styles.footerLink} href="mailto:support@smartagentalliance.com">support@smartagentalliance.com</a>
        </p>
      </div>
    </div>
  );
}

export default InstructionsModal;
