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

/**
 * InstructionsModal - Modal showing next steps after joining
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/interactive/InstructionsModal
 *
 * Features:
 * - Shows step-by-step joining instructions
 * - Personalized with user's name
 * - Clear CTA to proceed
 * - Closes on escape key or overlay click
 *
 * @example
 * ```tsx
 * <InstructionsModal
 *   isOpen={showInstructions}
 *   onClose={() => setShowInstructions(false)}
 *   userName="John"
 * />
 * ```
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
    <>
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>

          <h3 className="modal-title">Welcome, {userName}!</h3>
          <p className="modal-subtitle">You're on your way to joining Smart Agent Alliance at eXp Realty.</p>

          <div className="instructions-list">
            <div className="instruction-item">
              <div className="instruction-number">1</div>
              <div className="instruction-content">
                <strong>Check Your Email</strong>
                <p>We've sent you a welcome email with important next steps and resources.</p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-number">2</div>
              <div className="instruction-content">
                <strong>Schedule Your Call</strong>
                <p>A team member will reach out to schedule your strategy call within 24-48 hours.</p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-number">3</div>
              <div className="instruction-content">
                <strong>Join Our Community</strong>
                <p>Get access to our private Facebook group and start connecting with other agents.</p>
              </div>
            </div>
          </div>

          <button className="modal-cta" onClick={onClose}>
            Got It!
          </button>

          <p className="modal-footer">
            Questions? Email us at <a href="mailto:support@smartagentalliance.com">support@smartagentalliance.com</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
          overflow-y: auto;
          overscroll-behavior: contain;
        }

        .modal {
          background: #151517;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          max-width: 520px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          overscroll-behavior: contain;
          position: relative;
          text-align: center;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .success-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          background: rgba(0, 255, 136, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-icon svg {
          width: 32px;
          height: 32px;
          stroke: #00ff88;
        }

        .modal-title {
          font-family: var(--font-amulya, system-ui), sans-serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .modal-subtitle {
          font-family: var(--font-synonym, system-ui), sans-serif;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
        }

        .instructions-list {
          text-align: left;
          margin-bottom: 2rem;
        }

        .instruction-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .instruction-item:last-child {
          margin-bottom: 0;
        }

        .instruction-number {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #ffd700, #e6c200);
          color: #2a2a2a;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .instruction-content {
          flex: 1;
        }

        .instruction-content strong {
          display: block;
          color: #fff;
          font-family: var(--font-amulya, system-ui), sans-serif;
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .instruction-content p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }

        .modal-cta {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #ffd700, #e6c200);
          color: #2a2a2a;
          font-family: var(--font-taskor, system-ui), sans-serif;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .modal-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
        }

        .modal-footer {
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .modal-footer a {
          color: #ffd700;
          text-decoration: none;
        }

        .modal-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}

export default InstructionsModal;
