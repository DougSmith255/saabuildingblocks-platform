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

// Texture URLs for Earth globe
const EARTH_TEXTURE = 'https://i.postimg.cc/ry0pcyyZ/earth.jpg';
const EARTH_BUMP = 'https://i.postimg.cc/mgrJfkBt/bump.jpg';
const EARTH_SPECULAR = 'https://i.postimg.cc/R06YhY3m/spec.jpg';
const CLOUD_TEXTURE = 'https://i.postimg.cc/k4WhFtFh/cloud.png';
const SPACE_BG = 'https://i.postimg.cc/br3g30GL/bg.jpg';

/**
 * Auto-rotating Earth globe rendered with Three.js.
 * Three.js is dynamically imported so it only loads when the popup is visible.
 */
function EarthGlobe({ isVisible }: { isVisible: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    // Prevent double-init
    if (cleanupRef.current) return;

    const container = containerRef.current;

    // Dynamic import — three.js only loads when popup opens
    import('three').then((THREE) => {
      if (!container || !container.isConnected) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
      camera.position.z = 100;

      // Renderer (transparent so the CSS background image shows through)
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      const loader = new THREE.TextureLoader();

      // Earth
      const earthGeo = new THREE.SphereGeometry(30, 32, 32);
      const earthMat = new THREE.MeshPhongMaterial({
        shininess: 40,
        bumpScale: 1,
        map: loader.load(EARTH_TEXTURE),
        bumpMap: loader.load(EARTH_BUMP),
        specularMap: loader.load(EARTH_SPECULAR),
      });
      const earth = new THREE.Mesh(earthGeo, earthMat);
      scene.add(earth);

      // Clouds
      const cloudGeo = new THREE.SphereGeometry(31, 32, 32);
      const cloudMat = new THREE.MeshBasicMaterial({
        map: loader.load(CLOUD_TEXTURE),
        transparent: true,
        opacity: 0.8,
      });
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      scene.add(cloud);

      // Lights
      const pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.set(-400, 100, 150);
      scene.add(pointLight);

      const ambientLight = new THREE.AmbientLight(0x222222);
      scene.add(ambientLight);

      // Animation loop (auto-rotate only, no mouse control)
      let frameId = 0;
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        earth.rotation.y += 0.001;
        cloud.rotation.y += 0.0012;
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const onResize = () => {
        if (!container.isConnected) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(container);

      // Store cleanup
      cleanupRef.current = () => {
        cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        renderer.dispose();
        earthGeo.dispose();
        earthMat.dispose();
        cloudGeo.dispose();
        cloudMat.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        cleanupRef.current = null;
      };
    });

    return () => {
      cleanupRef.current?.();
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        backgroundImage: `url("${SPACE_BG}")`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }}
    />
  );
}

/**
 * VIPGuestPassPopup - One-time eXp World Guest Pass lead capture
 *
 * Blue/space theme with Earth globe background (Three.js).
 * Shows once per visitor (tracked via localStorage).
 * Triggers after 30 seconds OR 50% scroll depth, whichever comes first.
 * Form submits to /api/join-team with source: 'vip-guest-pass'.
 */
export function VIPGuestPassPopup({ forceOpen, onForceClose }: { forceOpen?: boolean; onForceClose?: () => void } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref avoids stale closure — scroll/timer callbacks always read current value
  const hasTriggeredRef = useRef(false);

  const showPopup = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setHasTriggered(true);
    setIsOpen(true);

    // Clear timer since we're showing
    if (timerRef.current) clearTimeout(timerRef.current);

    // Mark as shown in localStorage
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
  }, []);

  // Check if already shown on mount
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) {
        hasTriggeredRef.current = true;
        setHasTriggered(true);
        return;
      }
    } catch {
      // localStorage unavailable
      hasTriggeredRef.current = true;
      setHasTriggered(true);
      return;
    }

    // Start the 30-second timer
    timerRef.current = setTimeout(() => {
      showPopup();
    }, TRIGGER_DELAY_MS);

    // Set up scroll listener for 50% depth
    const handleScroll = () => {
      if (hasTriggeredRef.current) return;
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
  }, [showPopup]);

  // Allow parent to force-open for testing
  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onForceClose?.();
  }, [onForceClose]);

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
  if (hasTriggered && !isOpen && !forceOpen) return null;

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={handleClose}
      title="eXp World Guest Pass"
      subtitle="Step inside the world's largest virtual real estate campus"
      size="md"
      icon={
        <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 6px rgba(0,191,255,0.6))', color: '#00bfff' }}>
          &#9733;
        </span>
      }
    >
      {/* Negative margin extends background into the content padding area */}
      <div className="relative" style={{ margin: '-1.25rem', padding: '1.25rem', minHeight: '420px' }}>
        {/* Earth Globe Background (Three.js + space image) */}
        <EarthGlobe isVisible={isOpen} />

        {/* Semi-transparent overlay for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Content on top */}
        <div className="relative z-10 flex flex-col gap-5">
          {/* VIP Badge */}
          <div
            className="text-center py-3 px-4 rounded-xl mx-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(0,191,255,0.15) 0%, rgba(0,127,255,0.08) 100%)',
              border: '1px solid rgba(0,191,255,0.3)',
              backdropFilter: 'blur(8px)',
              maxWidth: '320px',
              width: '100%',
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.2em] font-semibold"
              style={{ color: '#00bfff' }}
            >
              Exclusive Access
            </p>
          </div>

          {/* Value Prop */}
          <div className="space-y-3">
            <p style={{ fontSize: '16px', color: '#e0f7fa', opacity: 0.9, lineHeight: 1.6 }}>
              eXp World is where 84,000+ agents across 29 countries connect, train, and collaborate
              in real time — a virtual campus with live events, leadership access, and operational support.
            </p>
            <p style={{ fontSize: '16px', color: '#e0f7fa', opacity: 0.8, lineHeight: 1.6 }}>
              Claim your Guest Pass to experience it firsthand. No commitment, no cost.
            </p>
          </div>

          {submitStatus === 'success' ? (
            /* Success State */
            <div
              className="text-center py-8 px-4 rounded-xl"
              style={{
                background: 'rgba(0,191,255,0.1)',
                border: '1px solid rgba(0,191,255,0.35)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p className="font-semibold mb-2" style={{ fontSize: '18px', color: '#00bfff' }}>
                You&apos;re In!
              </p>
              <p style={{ fontSize: '16px', color: '#e0f7fa', opacity: 0.8 }}>
                Check your email for your Guest Pass details.
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
                variant="cyber"
                isLoading={isSubmitting}
                loadingText="Claiming..."
                fullWidth
                style={{
                  background: 'linear-gradient(135deg, #00bfff 0%, #0077cc 100%)',
                  color: '#ffffff',
                  border: '1px solid rgba(0,191,255,0.5)',
                  boxShadow: '0 0 20px rgba(0,191,255,0.25), 0 4px 15px rgba(0,0,0,0.3)',
                }}
              >
                Claim Your Guest Pass
              </FormButton>
            </form>
          )}

          {/* Fine print */}
          <p className="text-xs text-center" style={{ color: '#e0f7fa', opacity: 0.4 }}>
            No spam. No obligations. Just an inside look at eXp World.
          </p>
        </div>
      </div>
    </SlidePanel>
  );
}

export default VIPGuestPassPopup;
