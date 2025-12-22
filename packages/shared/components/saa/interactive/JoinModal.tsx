'use client';

import React, { useState, useEffect, useCallback } from 'react';

export interface JoinModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback when form is successfully submitted */
  onSuccess?: (data: JoinFormData) => void;
  /** Sponsor name for referral tracking (null = Website Lead) */
  sponsorName?: string | null;
  /** API endpoint for form submission */
  apiEndpoint?: string;
}

export interface JoinFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
}

/**
 * JoinModal - Modal form for joining Smart Agent Alliance
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/interactive/JoinModal
 *
 * Features:
 * - Form with firstName, lastName, email, country
 * - Submits to GoHighLevel via API endpoint
 * - Shows success/error messages
 * - Closes automatically after success
 * - Prevents body scroll when open
 *
 * @example
 * ```tsx
 * <JoinModal
 *   isOpen={showJoinModal}
 *   onClose={() => setShowJoinModal(false)}
 *   onSuccess={(data) => console.log('Joined:', data)}
 * />
 * ```
 */
export function JoinModal({
  isOpen,
  onClose,
  onSuccess,
  sponsorName = null,
  apiEndpoint = '/api/join-team',
}: JoinModalProps) {
  const [formData, setFormData] = useState<JoinFormData>({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          country: formData.country,
          sponsorName: sponsorName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Thank you! We will be in touch soon.' });
        onSuccess?.(formData);

        // Close modal after success message displays
        setTimeout(() => {
          onClose();
          setFormData({ firstName: '', lastName: '', email: '', country: '' });
          setMessage(null);
        }, 2500);
      } else {
        setMessage({ type: 'error', text: result.error || 'Something went wrong. Please try again.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <h3 className="modal-title">Join Smart Agent Alliance</h3>
          <p className="modal-subtitle">Take the first step towards building your dream career at eXp Realty.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-input"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-input"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="country">Country *</label>
              <select
                id="country"
                name="country"
                className="form-select"
                value={formData.country}
                onChange={handleInputChange}
                required
              >
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button type="submit" className="form-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Get Started'}
            </button>

            {message && (
              <div className={`form-msg ${message.type}`}>
                {message.text}
              </div>
            )}
          </form>
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
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          overscroll-behavior: contain;
          position: relative;
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

        .modal-title {
          font-family: var(--font-amulya, system-ui), sans-serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .modal-subtitle {
          font-family: var(--font-synonym, system-ui), sans-serif;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          font-family: var(--font-synonym, system-ui), sans-serif;
          font-size: 0.875rem;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: #fff;
          font-family: var(--font-synonym, system-ui), sans-serif;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #ffd700;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-select option {
          background: #151517;
          color: #fff;
        }

        .form-submit {
          width: 100%;
          margin-top: 1.5rem;
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

        .form-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
        }

        .form-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-msg {
          margin-top: 1rem;
          padding: 0.75rem;
          border-radius: 8px;
          text-align: center;
          font-size: 0.9rem;
        }

        .form-msg.success {
          background: rgba(0, 255, 136, 0.1);
          color: #00ff88;
        }

        .form-msg.error {
          background: rgba(255, 68, 68, 0.1);
          color: #ff4444;
        }
      `}</style>
    </>
  );
}

export default JoinModal;
