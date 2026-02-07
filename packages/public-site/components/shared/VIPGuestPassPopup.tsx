'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SlidePanel } from '@saa/shared/components/saa/interactive/SlidePanel';
import { FormInput } from '@saa/shared/components/saa/forms/FormInput';
import { FormGroup } from '@saa/shared/components/saa/forms/FormGroup';
import { FormRow } from '@saa/shared/components/saa/forms/FormRow';
import { FormButton } from '@saa/shared/components/saa/forms/FormButton';
import { ConsentCheckbox } from '@saa/shared/components/saa/forms/ConsentCheckbox';
import { HolographicGlobe } from './HolographicGlobe';

const STORAGE_KEY = 'saa_vip_pass_shown';
const SCROLL_THRESHOLD = 0.70; // 70% scroll fallback

const EXP_X_LOGO = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-x-logo-icon/public';

// ═══════════════════════════════════════════════════════════════
// VIPGuestPassPopup
// ═══════════════════════════════════════════════════════════════

export function VIPGuestPassPopup({ forceOpen, onForceClose }: { forceOpen?: boolean; onForceClose?: () => void } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', consent: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTriggeredRef = useRef(false);
  const closePanelRef = useRef<(() => void) | null>(null);

  const showPopup = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setHasTriggered(true);
    setIsOpen(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    try { sessionStorage.setItem(STORAGE_KEY, 'true'); } catch {}
  }, []);

  // Helper: returns true when any other SlidePanel is currently open.
  // SlidePanel adds 'slide-panel-open' to <html> whenever it's visible.
  const isPanelOpen = useCallback(() => {
    return typeof document !== 'undefined' &&
      document.documentElement.classList.contains('slide-panel-open');
  }, []);

  useEffect(() => {
    // Migration: clear permanent localStorage key so existing devices aren't blocked forever
    try { localStorage.removeItem(STORAGE_KEY); } catch {}

    try {
      if (sessionStorage.getItem(STORAGE_KEY)) {
        hasTriggeredRef.current = true;
        setHasTriggered(true);
        return;
      }
    } catch {
      hasTriggeredRef.current = true;
      setHasTriggered(true);
      return;
    }

    // Exit-intent detection (primary trigger)
    // Desktop: mouse moves toward top of viewport (likely leaving)
    // Mobile: handled via scroll-up detection below
    let lastMouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (hasTriggeredRef.current) return;
      if (isPanelOpen()) return;

      // Detect mouse moving upward toward browser UI (exit intent)
      // Trigger when mouse is in top 10px and moving upward
      if (e.clientY < 10 && e.clientY < lastMouseY) {
        showPopup();
      }
      lastMouseY = e.clientY;
    };

    // Mobile exit-intent: detect quick scroll up (user pulling to go back)
    let lastScrollY = window.scrollY;
    let scrollUpVelocity = 0;
    let lastScrollTime = Date.now();

    const handleScroll = () => {
      if (hasTriggeredRef.current) return;
      if (isPanelOpen()) return;

      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastScrollTime;

      // Calculate scroll velocity (negative = scrolling up)
      if (timeDelta > 0) {
        scrollUpVelocity = (lastScrollY - currentScrollY) / timeDelta;
      }

      // Mobile exit-intent: rapid scroll up near top of page
      // Velocity > 2 means scrolling up fast (user likely trying to leave)
      if (currentScrollY < 200 && scrollUpVelocity > 2) {
        showPopup();
        return;
      }

      // Fallback: 70% scroll depth for highly engaged users
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && currentScrollY / docHeight >= SCROLL_THRESHOLD) {
        showPopup();
      }

      lastScrollY = currentScrollY;
      lastScrollTime = currentTime;
    };

    // Desktop: track mouse for exit-intent
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    // Both: track scroll for mobile exit-intent + scroll fallback
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showPopup, isPanelOpen]);

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  // Pre-warm Three.js modules during browser idle time so the globe
  // is ready instantly when the panel opens (no flash-in).
  // Uses requestIdleCallback to avoid impacting initial page load (LCP/FCP).
  useEffect(() => {
    if (hasTriggered) return;
    let warmed = false;
    const preWarm = () => {
      if (warmed) return;
      warmed = true;
      import('three').catch(() => {});
      import('three/examples/jsm/postprocessing/EffectComposer.js').catch(() => {});
      import('three/examples/jsm/postprocessing/RenderPass.js').catch(() => {});
      import('three/examples/jsm/postprocessing/UnrealBloomPass.js').catch(() => {});
    };
    // Load during idle time (typically 1-5s after page load).
    // Falls back to a 5s timeout for browsers without requestIdleCallback.
    let idleHandle: number | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    if (typeof requestIdleCallback === 'function') {
      idleHandle = requestIdleCallback(preWarm, { timeout: 8000 });
    } else {
      fallbackTimer = setTimeout(preWarm, 5000);
    }
    return () => {
      if (idleHandle !== undefined && typeof cancelIdleCallback === 'function') cancelIdleCallback(idleHandle);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [hasTriggered]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onForceClose?.();
  }, [onForceClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim()) return;
    if (!formData.consent) {
      setSubmitStatus('error');
      setErrorMessage('Please accept the terms and conditions to continue.');
      return;
    }

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
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitStatus('success');
      // Close with animation via SlidePanel's internal close (same as clicking X)
      setTimeout(() => {
        if (closePanelRef.current) closePanelRef.current();
        else setIsOpen(false); // fallback
      }, 3000);
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render before the popup has ever been triggered
  if (!hasTriggered && !forceOpen) return null;

  // NOTE: We intentionally do NOT return null when isOpen is false here.
  // SlidePanel needs to stay mounted briefly after isOpen=false to play
  // its exit animation (slide out + backdrop fade). SlidePanel handles
  // its own unmount timing internally.

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={handleClose}
      closeRef={closePanelRef}
      title="eXp World Guest Pass"
      subtitle="Step inside the world's largest virtual real estate campus"
      size="md"
      theme="blue"
      backgroundElement={<HolographicGlobe isVisible={isOpen} />}
      icon={
        <img
          src={EXP_X_LOGO}
          alt="eXp"
          style={{ width: '24px', height: '24px', objectFit: 'contain' }}
        />
      }
    >
      {/* Scoped style — dark form labels + extra spacer on wide screens */}
      <style>{`
        .vip-form-area label { color: #0a1a2e !important; }
      `}</style>

      {/* Content area — flex-centered across the full panel height.
           The parent content div is now absolutely positioned (inset: 0)
           so flex centering works from panel top to bottom. */}
      <div
        className="vip-form-area flex flex-col gap-3"
        style={{
          flex: '1 1 0%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 16px',
          maxWidth: '600px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Description — dark text readable against bright blue globe */}
        <p style={{
          fontSize: '14px',
          color: '#0a1a2e',
          lineHeight: 1.6,
          textAlign: 'center',
          fontWeight: 500,
          textShadow: '0 0 8px rgba(100,200,255,0.3)',
        }}>
          84,000+ agents. 29 countries. One virtual campus.<br />
          eXp World is your hub for live training, on-demand support, and direct
          access to leadership. Set up your own virtual office and meet with
          clients anywhere in the world — all inside eXp World.
        </p>

        {submitStatus === 'success' ? (
          <div
            className="text-center py-6 px-4 rounded-xl"
            style={{
              background: 'rgba(0,20,50,0.55)',
              border: '1px solid rgba(0,191,255,0.35)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            <p className="font-semibold mb-1" style={{ fontSize: '18px', color: '#00bfff' }}>
              You&apos;re In!
            </p>
            <p style={{ fontSize: '15px', color: '#e0f7fa', opacity: 0.9 }}>
              Expect an email from <strong style={{ color: '#00bfff' }}>agentonboarding@exprealty.net</strong> within
              3 minutes with a link to access eXp World.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
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
                    style={{
                      background: 'rgba(2, 8, 22, 0.7)',
                      border: '1px solid rgba(0, 140, 200, 0.3)',
                      color: '#e0f0ff',
                    }}
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
                    style={{
                      background: 'rgba(2, 8, 22, 0.7)',
                      border: '1px solid rgba(0, 140, 200, 0.3)',
                      color: '#e0f0ff',
                    }}
                  />
                </FormGroup>
              </FormRow>
              <div style={{ marginTop: '-4px' }}>
              <FormGroup label="Email" htmlFor="vip-email" required>
                <FormInput
                  type="email"
                  id="vip-email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                  style={{
                    background: 'rgba(2, 8, 22, 0.7)',
                    border: '1px solid rgba(0, 140, 200, 0.3)',
                    color: '#e0f0ff',
                  }}
                />
              </FormGroup>
              </div>
            </div>

            <ConsentCheckbox
              checked={formData.consent}
              onChange={(checked) => setFormData(prev => ({ ...prev, consent: checked }))}
              accentColor="#00bfff"
              accentColorEnd="#0066aa"
              linkColor="#00bfff"
              textColor="rgba(10, 26, 46, 0.7)"
            />

            {submitStatus === 'error' && (
              <p className="text-sm text-center mt-2" style={{ color: '#ff4444' }}>
                {errorMessage}
              </p>
            )}

            <div style={{ marginTop: '16px' }}>
              <FormButton
                type="submit"
                variant="cyber"
                isLoading={isSubmitting}
                loadingText="Claiming..."
                fullWidth
                style={{
                  background: 'linear-gradient(135deg, #00bfff 0%, #0066aa 100%)',
                  color: '#ffffff',
                  border: '1px solid rgba(0,191,255,0.5)',
                  boxShadow: '0 0 20px rgba(0,191,255,0.3), 0 4px 15px rgba(0,0,0,0.3)',
                }}
              >
                Claim Your Guest Pass
              </FormButton>
            </div>
          </form>
        )}

        <p className="text-xs text-center" style={{ color: '#0a1a2e', opacity: 0.5 }}>
          No spam. No obligations.
        </p>
      </div>
    </SlidePanel>
  );
}

export default VIPGuestPassPopup;
