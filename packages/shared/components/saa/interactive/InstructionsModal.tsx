'use client';

import React from 'react';
import { Modal } from './Modal';
import { ModalTitle } from '../forms';

export interface InstructionsModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** User's name for personalization */
  userName?: string;
}

// Styles specific to InstructionsModal content
const styles: Record<string, React.CSSProperties> = {
  content: {
    textAlign: 'center',
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
  instructionsList: {
    textAlign: 'left',
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
    textTransform: 'uppercase',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'block',
    textDecoration: 'none',
    textAlign: 'center',
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
  link: {
    color: '#ffd700',
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
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div style={styles.content}>
        <div style={styles.successIcon}>
          <svg style={styles.successSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        <ModalTitle subtitle="Follow these steps to join Smart Agent Alliance at eXp Realty." centered>
          Welcome, {userName}!
        </ModalTitle>

        <div style={styles.instructionsList}>
          <div style={styles.instructionItem}>
            <div style={styles.instructionNumber}>1</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>Start Your Application</strong>
              <p style={styles.instructionText}>
                Visit <a href="https://joinapp.exprealty.com/" target="_blank" rel="noopener noreferrer" style={styles.link}>joinapp.exprealty.com</a> to begin your eXp Realty application.
              </p>
            </div>
          </div>

          <div style={styles.instructionItem}>
            <div style={styles.instructionNumber}>2</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>Search for Your Sponsor</strong>
              <p style={styles.instructionText}>
                Enter <strong style={{color: '#fff'}}>doug.smart@expreferral.com</strong> and click Search. Select <strong style={{color: '#fff'}}>Sheldon Douglas Smart</strong> as your sponsor.
              </p>
            </div>
          </div>

          <div style={styles.instructionItem}>
            <div style={styles.instructionNumber}>3</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>Complete Your Application</strong>
              <p style={styles.instructionText}>
                Fill out the application form and submit. You&apos;ll receive a confirmation email from eXp.
              </p>
            </div>
          </div>

          <div style={styles.instructionItem}>
            <div style={styles.instructionNumber}>4</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>Activate Your Agent Portal</strong>
              <p style={styles.instructionText}>
                Once your license transfers, you&apos;ll receive an email to activate your Smart Agent Alliance portal with all your onboarding materials and resources.
              </p>
            </div>
          </div>

          <div style={{...styles.instructionItem, marginBottom: 0}}>
            <div style={styles.instructionNumber}>5</div>
            <div style={styles.instructionContent}>
              <strong style={styles.instructionTitle}>eXp Realty Support</strong>
              <p style={styles.instructionText}>
                For application issues, call <strong style={{color: '#fff'}}>833-303-0610</strong> or email <a href="mailto:expertcare@exprealty.com" style={styles.link}>expertcare@exprealty.com</a>.
              </p>
            </div>
          </div>
        </div>

        <a
          href="https://joinapp.exprealty.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.cta}
        >
          Join eXp with SAA
        </a>

        <p style={styles.footer}>
          Questions? Email us at <a style={styles.footerLink} href="mailto:team@smartagentalliance.com">team@smartagentalliance.com</a>
        </p>
      </div>
    </Modal>
  );
}

export default InstructionsModal;
