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
    maxWidth: '500px',
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
    // @ts-ignore - overscrollBehavior is valid CSS
    overscrollBehavior: 'contain',
    boxSizing: 'border-box' as const,
  },
  closeBtn: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
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
    boxSizing: 'border-box' as const,
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
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '1.5rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontFamily: 'var(--font-synonym, system-ui), sans-serif',
    fontSize: '0.875rem',
    color: '#fff',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    color: '#fff',
    fontFamily: 'var(--font-synonym, system-ui), sans-serif',
    fontSize: '1rem',
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#1a1a1c',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    color: '#fff',
    fontFamily: 'var(--font-synonym, system-ui), sans-serif',
    fontSize: '1rem',
    boxSizing: 'border-box' as const,
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    paddingRight: '2.5rem',
  },
  option: {
    background: '#1a1a1c',
    color: '#fff',
  },
  submit: {
    width: '100%',
    marginTop: '1.5rem',
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
  submitDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  msgSuccess: {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '8px',
    textAlign: 'center' as const,
    fontSize: '0.9rem',
    background: 'rgba(0, 255, 136, 0.1)',
    color: '#00ff88',
  },
  msgError: {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '8px',
    textAlign: 'center' as const,
    fontSize: '0.9rem',
    background: 'rgba(255, 68, 68, 0.1)',
    color: '#ff4444',
  },
};

// localStorage key for storing submitted user data
const STORAGE_KEY = 'saa_join_submitted';

/**
 * JoinModal - Modal form for joining Smart Agent Alliance
 *
 * If user has already submitted, calling onSuccess immediately skips the form
 * and shows the instructions modal instead.
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
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  // Check if user has already submitted - if so, skip form and show instructions
  useEffect(() => {
    if (isOpen && !hasCheckedStorage) {
      setHasCheckedStorage(true);
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const savedData = JSON.parse(stored) as JoinFormData;
          // User already submitted - skip form and go directly to instructions
          onClose();
          onSuccess?.(savedData);
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
    // Reset check when modal closes
    if (!isOpen) {
      setHasCheckedStorage(false);
    }
  }, [isOpen, hasCheckedStorage, onClose, onSuccess]);

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
        // Save to localStorage so returning users skip the form
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        } catch {
          // localStorage not available, continue anyway
        }

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

      {/* Close button - FIXED position, direct child of container for proper z-index */}
      <button type="button" style={styles.closeBtn} onClick={handleCloseClick} aria-label="Close modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{pointerEvents: 'none', display: 'block', flexShrink: 0}}>
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* Modal Wrapper */}
      <div
        style={styles.modalWrapper}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal with scrollable content */}
        <div
          style={styles.modal}
          onWheel={(e) => e.stopPropagation()}
        >
        <h3 style={styles.title}>Join Smart Agent Alliance</h3>
        <p style={styles.subtitle}>Take the first step towards building your dream career at eXp Realty.</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                style={styles.input}
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                style={styles.input}
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              style={styles.input}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="country">Country *</label>
            <select
              id="country"
              name="country"
              style={styles.select}
              value={formData.country}
              onChange={handleInputChange}
              required
            >
              <option value="" style={styles.option}>Select country</option>
              <option value="US" style={styles.option}>United States</option>
              <option value="CA" style={styles.option}>Canada</option>
              <option value="UK" style={styles.option}>United Kingdom</option>
              <option value="AU" style={styles.option}>Australia</option>
              <option value="other" style={styles.option}>Other</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              ...styles.submit,
              ...(isSubmitting ? styles.submitDisabled : {}),
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Get Started'}
          </button>

          {message && (
            <div style={message.type === 'success' ? styles.msgSuccess : styles.msgError}>
              {message.text}
            </div>
          )}
        </form>
        </div>
      </div>
    </div>
  );
}

export default JoinModal;
