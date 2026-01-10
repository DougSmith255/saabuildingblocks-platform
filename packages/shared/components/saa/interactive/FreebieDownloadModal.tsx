'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Modal } from './Modal';
import { FormInput, FormGroup, FormRow, FormButton, FormMessage, ModalTitle } from '../forms';
import Link from 'next/link';

// localStorage key for storing user info
const FREEBIE_USER_KEY = 'saa_freebie_user';

interface StoredFreebieUser {
  firstName: string;
  lastName: string;
  email: string;
  timestamp: number;
}

// Check if user info exists and is less than 30 days old
function getStoredUser(): StoredFreebieUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(FREEBIE_USER_KEY);
    if (!stored) return null;
    const user = JSON.parse(stored) as StoredFreebieUser;
    // Expire after 30 days
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - user.timestamp > thirtyDays) {
      localStorage.removeItem(FREEBIE_USER_KEY);
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

function storeUser(firstName: string, lastName: string, email: string): void {
  if (typeof window === 'undefined') return;
  const user: StoredFreebieUser = {
    firstName,
    lastName,
    email,
    timestamp: Date.now(),
  };
  localStorage.setItem(FREEBIE_USER_KEY, JSON.stringify(user));
}

export interface FreebieDownloadModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Freebie details */
  freebie: {
    title: string;
    fileName: string;
    fileUrl: string;
    type: 'download' | 'canva';
  } | null;
  /** API endpoint for form submission */
  apiEndpoint?: string;
}

interface FreebieFormData {
  firstName: string;
  lastName: string;
  email: string;
  consent: boolean;
}

/**
 * FreebieDownloadModal - Modal form for downloading freebies
 *
 * Collects user info, sends to GoHighLevel CRM, then triggers download
 * If user has previously submitted, bypasses form and triggers download immediately
 */
export function FreebieDownloadModal({
  isOpen,
  onClose,
  freebie,
  apiEndpoint = '/api/freebie-download',
}: FreebieDownloadModalProps) {
  const [formData, setFormData] = useState<FreebieFormData>({
    firstName: '',
    lastName: '',
    email: '',
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const triggerDownload = useCallback((url: string, fileName: string, isCanva: boolean) => {
    if (isCanva) {
      // Open Canva link in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Trigger file download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const handleClose = useCallback(() => {
    setFormData({ firstName: '', lastName: '', email: '', consent: false });
    setMessage(null);
    setShowSuccess(false);
    setIsReturningUser(false);
    onClose();
  }, [onClose]);

  // Check for returning user when modal opens
  useEffect(() => {
    if (isOpen && freebie) {
      const storedUser = getStoredUser();
      if (storedUser) {
        // Returning user - bypass form and trigger download immediately
        setIsReturningUser(true);
        setShowSuccess(true);
        setTimeout(() => {
          triggerDownload(freebie.fileUrl, freebie.fileName, freebie.type === 'canva');
        }, 500);
        setTimeout(() => {
          handleClose();
        }, 2500);
      }
    }
  }, [isOpen, freebie, triggerDownload, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!freebie) return;

    if (!formData.consent) {
      setMessage({ type: 'error', text: 'Please accept the terms and conditions to continue.' });
      return;
    }

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
          freebieTitle: freebie.title,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store user info for future visits
        storeUser(formData.firstName, formData.lastName, formData.email);
        setShowSuccess(true);
        // Trigger download/open after short delay
        setTimeout(() => {
          triggerDownload(freebie.fileUrl, freebie.fileName, freebie.type === 'canva');
        }, 500);

        // Close modal after longer delay
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Something went wrong. Please try again.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!freebie) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      {showSuccess ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{
            fontSize: 'var(--font-size-h4)',
            fontFamily: 'var(--font-family-h4)',
            color: 'var(--color-header-text)',
            marginBottom: '0.75rem',
          }}>
            {isReturningUser ? 'Welcome Back!' : 'Success!'}
          </h2>
          <p style={{
            fontSize: 'var(--font-size-body)',
            color: 'var(--text-muted)',
          }}>
            {freebie.type === 'canva'
              ? 'Opening Canva template in a new tab...'
              : 'Your download is starting now. Check your downloads folder.'}
          </p>
        </div>
      ) : (
        <>
          <ModalTitle subtitle="Enter your details to download this free resource.">
            {freebie.title}
          </ModalTitle>

          <form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup label="First Name" htmlFor="freebie-firstName" required>
                <FormInput
                  type="text"
                  id="freebie-firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup label="Last Name" htmlFor="freebie-lastName" required>
                <FormInput
                  type="text"
                  id="freebie-lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup label="Email Address" htmlFor="freebie-email" required>
              <FormInput
                type="email"
                id="freebie-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            {/* Consent Checkbox */}
            <div style={{ marginTop: '1.25rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                cursor: 'pointer',
              }}>
                {/* Hidden native checkbox */}
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    width: 0,
                    height: 0,
                  }}
                />
                {/* Custom checkbox */}
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    minWidth: '20px',
                    marginTop: '2px',
                    borderRadius: '4px',
                    border: formData.consent ? '2px solid #ffd700' : '2px solid #888888',
                    backgroundColor: formData.consent ? '#ffd700' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {formData.consent && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1a1a1a"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                }}>
                  I agree to the{' '}
                  <Link
                    href="/terms-of-use/"
                    target="_blank"
                    style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}
                  >
                    Terms &amp; Conditions
                  </Link>
                  {' '}and{' '}
                  <Link
                    href="/privacy-policy/"
                    target="_blank"
                    style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}
                  >
                    Privacy Policy
                  </Link>
                  {' '}and consent to receive emails.
                </span>
              </label>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <FormButton isLoading={isSubmitting} loadingText="Processing...">
                Download
              </FormButton>
            </div>

            {message && (
              <FormMessage type={message.type}>{message.text}</FormMessage>
            )}
          </form>
        </>
      )}
    </Modal>
  );
}

export default FreebieDownloadModal;
