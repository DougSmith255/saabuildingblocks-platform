'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from './Modal';
import { FormInput, FormSelect, FormGroup, FormRow, FormButton, FormMessage, ModalTitle } from '../forms';

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


// localStorage key for storing submitted user data
const STORAGE_KEY = 'saa_join_submitted';

// Country options
const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'other', label: 'Other' },
];

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalTitle subtitle="Take the first step towards building your dream career at eXp Realty.">
        Join Smart Agent Alliance
      </ModalTitle>

      <form onSubmit={handleSubmit}>
        <FormRow>
          <FormGroup label="First Name" htmlFor="firstName" required>
            <FormInput
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup label="Last Name" htmlFor="lastName" required>
            <FormInput
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
        </FormRow>

        <FormGroup label="Email" htmlFor="email" required>
          <FormInput
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup label="Country" htmlFor="country" required>
          <FormSelect
            id="country"
            name="country"
            options={COUNTRY_OPTIONS}
            placeholder="Select country"
            value={formData.country}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <div style={{ marginTop: '1.5rem' }}>
          <FormButton isLoading={isSubmitting} loadingText="Submitting...">
            Get Started
          </FormButton>
        </div>

        {message && (
          <FormMessage type={message.type}>{message.text}</FormMessage>
        )}
      </form>
    </Modal>
  );
}

export default JoinModal;
