'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SlidePanel } from '@saa/shared/components/saa/interactive/SlidePanel';
import { FormInput } from '@saa/shared/components/saa/forms/FormInput';
import { FormGroup } from '@saa/shared/components/saa/forms/FormGroup';
import { FormRow } from '@saa/shared/components/saa/forms/FormRow';
import { FormButton } from '@saa/shared/components/saa/forms/FormButton';

const STORAGE_KEY = 'saa_vip_pass_shown';
const TRIGGER_DELAY_MS = 30000; // 30 seconds
const SCROLL_THRESHOLD = 0.5; // 50% page depth

/**
 * VIPGuestPassPopup - One-time VIP Guest Pass lead capture
 *
 * Shows once per visitor (tracked via localStorage).
 * Triggers after 30 seconds OR 50% scroll depth, whichever comes first.
 * Form submits to /api/join-team with source: 'vip-guest-pass'.
 */
export function VIPGuestPassPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if already shown on mount
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) {
        setHasTriggered(true);
        return;
      }
    } catch {
      // localStorage unavailable
      setHasTriggered(true);
      return;
    }

    // Start the 30-second timer
    timerRef.current = setTimeout(() => {
      showPopup();
    }, TRIGGER_DELAY_MS);

    // Set up scroll listener for 50% depth
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrollTop / docHeight >= SCROLL_THRESHOLD) {
        showPopup();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showPopup = useCallback(() => {
    if (hasTriggered) return;
    setHasTriggered(true);
    setIsOpen(true);

    // Clear timer since we're showing
    if (timerRef.current) clearTimeout(timerRef.current);

    // Mark as shown in localStorage
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
  }, [hasTriggered]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.email.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('/api/join-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          source: 'vip-guest-pass',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit');
      }

      setSubmitStatus('success');
      // Auto-close after 3 seconds
      setTimeout(() => setIsOpen(false), 3000);
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if already triggered and closed
  if (hasTriggered && !isOpen) return null;

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={handleClose}
      title="VIP Guest Pass"
      subtitle="Step inside the world's largest virtual real estate campus"
      size="md"
      icon={
        <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.6))' }}>
          &#9733;
        </span>
      }
    >
      <div className="flex flex-col gap-5">
        {/* VIP Badge */}
        <div
          className="text-center py-3 px-4 rounded-xl mx-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,180,0,0.08) 100%)',
            border: '1px solid rgba(255,215,0,0.3)',
            maxWidth: '320px',
            width: '100%',
          }}
        >
          <p
            className="text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: '#ffd700' }}
          >
            Exclusive Access
          </p>
        </div>

        {/* Value Prop */}
        <div className="space-y-3">
          <p className="text-body opacity-90">
            eXp World is where 84,000+ agents across 29 countries connect, train, and collaborate
            in real time — a virtual campus with live events, leadership access, and operational support.
          </p>
          <p className="text-body opacity-80">
            Claim your VIP Guest Pass to experience it firsthand. No commitment, no cost.
          </p>
        </div>

        {submitStatus === 'success' ? (
          /* Success State */
          <div
            className="text-center py-8 px-4 rounded-xl"
            style={{
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.3)',
            }}
          >
            <p className="text-lg font-semibold mb-2" style={{ color: '#00ff88' }}>
              You&apos;re In!
            </p>
            <p className="text-body opacity-80">
              Check your email for your VIP Guest Pass details.
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormRow columns={2}>
              <FormGroup label="First Name" htmlFor="vip-first-name" required>
                <FormInput
                  type="text"
                  id="vip-first-name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="First name"
                  required
                />
              </FormGroup>
              <FormGroup label="Last Name" htmlFor="vip-last-name">
                <FormInput
                  type="text"
                  id="vip-last-name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Last name"
                />
              </FormGroup>
            </FormRow>
            <FormGroup label="Email" htmlFor="vip-email" required>
              <FormInput
                type="email"
                id="vip-email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                required
              />
            </FormGroup>

            {submitStatus === 'error' && (
              <p className="text-sm text-center" style={{ color: '#ff4444' }}>
                {errorMessage}
              </p>
            )}

            <FormButton
              type="submit"
              variant="gold"
              isLoading={isSubmitting}
              loadingText="Claiming..."
              fullWidth
            >
              Claim Your VIP Pass
            </FormButton>
          </form>
        )}

        {/* Fine print */}
        <p className="text-xs text-center opacity-50" style={{ color: 'var(--color-body-text)' }}>
          No spam. No obligations. Just an inside look at eXp World.
        </p>
      </div>
    </SlidePanel>
  );
}

export default VIPGuestPassPopup;
