'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { H1, Modal, FormCard, FormButton, FormInput, FormGroup, ModalTitle, FormMessage } from '@saa/shared/components/saa';

// Initial progress values for the data stream effect
const INITIAL_PROGRESS_START = 0.05;
const INITIAL_PROGRESS_END = 0.5;

// Auth API URL - admin dashboard handles authentication (runs on saabuildingblocks.com)
const AUTH_API_URL = 'https://saabuildingblocks.com';

// Password Reset Modal States
type ResetStep = 'email' | 'success';

// Username Recovery Modal States
type UsernameStep = 'email' | 'success';

/**
 * Agent Portal Login Page
 * Features the Data Stream effect in green with centered login form in CyberCardGold
 */
export default function AgentPortalLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tunnel transition state
  const [showTransition, setShowTransition] = useState(false);

  // Password reset state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState<ResetStep>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Username recovery state
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [usernameStep, setUsernameStep] = useState<UsernameStep>('email');
  const [usernameEmail, setUsernameEmail] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    const user = localStorage.getItem('agent_portal_user');
    if (user) {
      router.push('/agent-portal');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${AUTH_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid credentials. Please try again.');
        setIsLoading(false);
        return;
      }

      // Store user data and token
      const userData = {
        id: data.data.user.id,
        email: data.data.user.email,
        username: data.data.user.username,
        firstName: data.data.user.first_name || data.data.user.fullName?.split(' ')[0] || '',
        lastName: data.data.user.last_name || data.data.user.fullName?.split(' ').slice(1).join(' ') || '',
        fullName: data.data.user.fullName || `${data.data.user.first_name || ''} ${data.data.user.last_name || ''}`.trim(),
        role: data.data.user.role,
        profilePictureUrl: data.data.user.profile_picture_url || null,
      };

      localStorage.setItem('agent_portal_user', JSON.stringify(userData));
      localStorage.setItem('agent_portal_token', data.data.accessToken);

      // Prefetch the dashboard immediately so it's ready when we navigate
      router.prefetch('/agent-portal');

      // Dispatch event to slide header out
      window.dispatchEvent(new CustomEvent('agent-portal-login-success'));

      // Start the transition (fades content, triggers tunnel effect)
      setShowTransition(true);

      // Navigate after the tunnel animation completes
      // The login page stays visible with the tunnel effect until we navigate
      setTimeout(() => {
        router.push('/agent-portal');
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  // Password reset handler
  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);
    setResetMessage(null);

    try {
      const response = await fetch(`${AUTH_API_URL}/api/auth/password-reset/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 429) {
        setResetError(data.message || 'Failed to send reset email. Please try again.');
        setResetLoading(false);
        return;
      }

      if (response.status === 429) {
        setResetError('Too many requests. Please wait before trying again.');
        setResetLoading(false);
        return;
      }

      // Success - show confirmation
      setResetMessage(data.message || 'If an account exists with this email, a password reset link has been sent.');
      setResetStep('success');
      setResetLoading(false);
    } catch (err) {
      console.error('Password reset error:', err);
      setResetError('Network error. Please check your connection and try again.');
      setResetLoading(false);
    }
  };

  // Open reset modal
  const openResetModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowResetModal(true);
    setResetStep('email');
    setResetEmail('');
    setResetError(null);
    setResetMessage(null);
  };

  // Close reset modal
  const closeResetModal = () => {
    setShowResetModal(false);
    setResetStep('email');
    setResetEmail('');
    setResetError(null);
    setResetMessage(null);
  };

  // Username recovery handler
  const handleUsernameRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameLoading(true);
    setUsernameError(null);
    setUsernameMessage(null);

    try {
      const response = await fetch(`${AUTH_API_URL}/api/auth/username-recovery/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: usernameEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 429) {
        setUsernameError(data.message || 'Failed to send username reminder. Please try again.');
        setUsernameLoading(false);
        return;
      }

      if (response.status === 429) {
        setUsernameError('Too many requests. Please wait before trying again.');
        setUsernameLoading(false);
        return;
      }

      // Success - show confirmation
      setUsernameMessage(data.message || 'If an account exists with this email, your username has been sent.');
      setUsernameStep('success');
      setUsernameLoading(false);
    } catch (err) {
      console.error('Username recovery error:', err);
      setUsernameError('Network error. Please check your connection and try again.');
      setUsernameLoading(false);
    }
  };

  // Open username modal
  const openUsernameModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowUsernameModal(true);
    setUsernameStep('email');
    setUsernameEmail('');
    setUsernameError(null);
    setUsernameMessage(null);
  };

  // Close username modal
  const closeUsernameModal = () => {
    setShowUsernameModal(false);
    setUsernameStep('email');
    setUsernameEmail('');
    setUsernameError(null);
    setUsernameMessage(null);
  };

  return (
    <main id="main-content" className="relative min-h-[100dvh] overflow-hidden">
      {/* Get Help Link Styles */}
      <style>{`
        .get-help-link {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.8rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .get-help-link:hover {
          color: #ffd700;
        }
      `}</style>

      {/* Data Stream Effect - Green background, does tunnel animation with content */}
      <DataStreamEffect tunnelMode={showTransition} />

      {/* Login Content - centered, no scroll animations */}
      <div className="relative z-10 min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div
          className="flex flex-col items-center w-full transition-all ease-out"
          style={{
            opacity: showTransition ? 0 : 1,
            transform: showTransition ? 'scale(0.9) translateY(-20px)' : 'scale(1) translateY(0)',
            transitionDuration: '800ms',
          }}
        >
          {/* Heading - full width */}
          <div className="text-center mb-8">
            <H1>ACCESS PORTAL</H1>
          </div>

        {/* Login Form - using base FormCard */}
        <FormCard maxWidth="md">
          <ModalTitle subtitle="Access your agent command center">
            Agent Login
          </ModalTitle>

          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <FormMessage type="error">{error}</FormMessage>
            )}

            {/* Email Field */}
            <FormGroup label="Agent Email" htmlFor="email" required>
              <FormInput
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@example.com"
                required
              />
            </FormGroup>

            {/* Password Field */}
            <FormGroup label="Password" htmlFor="password" required>
              <div style={{ position: 'relative' }}>
                <FormInput
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </FormGroup>

            {/* Submit Button */}
            <div style={{ marginTop: '1.5rem' }}>
              <FormButton isLoading={isLoading} loadingText="Logging in...">
                Login
              </FormButton>
            </div>

            {/* Forgot Username/Password Links */}
            <div className="text-center" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={openUsernameModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Forgot username?
              </button>
              <button
                type="button"
                onClick={openResetModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Get Help Link */}
            <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
              <a
                href="mailto:team@smartagentalliance.com"
                className="get-help-link"
              >
                Get Help
              </a>
            </div>
          </form>
        </FormCard>
        </div>
      </div>

      {/* Password Reset Modal - uses base Modal with base form components */}
      <Modal isOpen={showResetModal} onClose={closeResetModal} size="md">
        {resetStep === 'email' ? (
          <>
            <ModalTitle subtitle="Enter your email and we'll send you a reset link." centered>
              Reset Password
            </ModalTitle>

            <form onSubmit={handleResetRequest}>
              {/* Error Message */}
              {resetError && (
                <FormMessage type="error">{resetError}</FormMessage>
              )}

              {/* Email Field */}
              <FormGroup label="Email Address" htmlFor="reset-email" required>
                <FormInput
                  type="email"
                  id="reset-email"
                  name="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="agent@example.com"
                  required
                  autoFocus
                />
              </FormGroup>

              {/* Submit Button */}
              <div style={{ marginTop: '1.5rem' }}>
                <FormButton isLoading={resetLoading} loadingText="Sending...">
                  Send Reset Link
                </FormButton>
              </div>

              {/* Cancel Link */}
              <div className="text-center" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={closeResetModal}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Back to login
                </button>
              </div>

              {/* Get Help Link */}
              <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                <a
                  href="mailto:team@smartagentalliance.com"
                  className="get-help-link"
                >
                  Get Help
                </a>
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
            <ModalTitle subtitle={resetMessage || ''} centered>
              Check Your Email
            </ModalTitle>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '1.5rem' }}>
              The link will expire in 15 minutes.
            </p>
            <FormButton onClick={closeResetModal}>
              Back to Login
            </FormButton>
          </div>
        )}
      </Modal>

      {/* Username Recovery Modal */}
      <Modal isOpen={showUsernameModal} onClose={closeUsernameModal} size="md">
        {usernameStep === 'email' ? (
          <>
            <ModalTitle subtitle="Enter your email and we'll send you your username." centered>
              Forgot Username
            </ModalTitle>

            <form onSubmit={handleUsernameRequest}>
              {/* Error Message */}
              {usernameError && (
                <FormMessage type="error">{usernameError}</FormMessage>
              )}

              {/* Email Field */}
              <FormGroup label="Email Address" htmlFor="username-email" required>
                <FormInput
                  type="email"
                  id="username-email"
                  name="usernameEmail"
                  value={usernameEmail}
                  onChange={(e) => setUsernameEmail(e.target.value)}
                  placeholder="agent@example.com"
                  required
                  autoFocus
                />
              </FormGroup>

              {/* Submit Button */}
              <div style={{ marginTop: '1.5rem' }}>
                <FormButton isLoading={usernameLoading} loadingText="Sending...">
                  Send Username
                </FormButton>
              </div>

              {/* Cancel Link */}
              <div className="text-center" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={closeUsernameModal}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Back to login
                </button>
              </div>

              {/* Get Help Link */}
              <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                <a
                  href="mailto:team@smartagentalliance.com"
                  className="get-help-link"
                >
                  Get Help
                </a>
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
            <ModalTitle subtitle={usernameMessage || ''} centered>
              Check Your Email
            </ModalTitle>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '1.5rem' }}>
              Your username has been sent to your email.
            </p>
            <FormButton onClick={closeUsernameModal}>
              Back to Login
            </FormButton>
          </div>
        )}
      </Modal>
    </main>
  );
}

/**
 * Data Stream Effect - Green Matrix-style rain (matches test page)
 *
 * Animation behavior:
 * 1. Intro: Fast animation from START to END over 3 seconds
 * 2. Transition: Gradually slows down to idle speed (smooth blend)
 * 3. Idle: Continuous slow animation that never stops
 * 4. Scroll: Speeds up when user scrolls
 * 5. Tunnel Mode: Intensifies and creates zoom effect on login success
 */
function DataStreamEffect({ tunnelMode = false }: { tunnelMode?: boolean }) {
  const [progress, setProgress] = useState(INITIAL_PROGRESS_START);
  const [tunnelProgress, setTunnelProgress] = useState(0);
  const tunnelStartRef = useRef<number | null>(null);
  const currentRef = useRef(INITIAL_PROGRESS_START);

  // Handle tunnel mode animation
  useEffect(() => {
    if (!tunnelMode) {
      tunnelStartRef.current = null;
      setTunnelProgress(0);
      return;
    }

    const TUNNEL_DURATION = 1500;
    let rafId: number;

    const animateTunnel = (timestamp: number) => {
      if (tunnelStartRef.current === null) {
        tunnelStartRef.current = timestamp;
      }

      const elapsed = timestamp - tunnelStartRef.current;
      const progress = Math.min(elapsed / TUNNEL_DURATION, 1);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setTunnelProgress(eased);

      if (progress < 1) {
        rafId = requestAnimationFrame(animateTunnel);
      }
    };

    rafId = requestAnimationFrame(animateTunnel);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [tunnelMode]);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const introStartTimeRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    const INTRO_DURATION = 3000;
    const INTRO_VELOCITY = (INITIAL_PROGRESS_END - INITIAL_PROGRESS_START) / INTRO_DURATION;
    const IDLE_VELOCITY = 0.000008;
    const SCROLL_VELOCITY_MULTIPLIER = 0.0003;
    const VELOCITY_DECAY = 0.995;
    const TRANSITION_DURATION = 2000;
    let lastTimestamp = 0;
    let introEndTime: number | null = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (scrollDelta > 0) {
        scrollVelocityRef.current = Math.min(scrollDelta * SCROLL_VELOCITY_MULTIPLIER, 0.002);
      }
    };

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;

      if (introStartTimeRef.current === null) {
        introStartTimeRef.current = timestamp;
      }

      const elapsed = timestamp - introStartTimeRef.current;

      // Phase 1: Intro animation
      if (elapsed < INTRO_DURATION) {
        const introProgress = elapsed / INTRO_DURATION;
        const eased = 1 - Math.pow(1 - introProgress, 3);
        currentRef.current = INITIAL_PROGRESS_START + eased * (INITIAL_PROGRESS_END - INITIAL_PROGRESS_START);
        velocityRef.current = INTRO_VELOCITY * (1 - introProgress);
      }
      // Phase 2: Transition from intro to idle
      else if (elapsed < INTRO_DURATION + TRANSITION_DURATION) {
        if (introEndTime === null) {
          introEndTime = timestamp;
          velocityRef.current = INTRO_VELOCITY * 0.1;
        }

        const transitionProgress = (elapsed - INTRO_DURATION) / TRANSITION_DURATION;
        const blendedVelocity = velocityRef.current * (1 - transitionProgress) + IDLE_VELOCITY * transitionProgress;
        const totalVelocity = blendedVelocity + scrollVelocityRef.current;

        currentRef.current += totalVelocity * deltaTime;
        scrollVelocityRef.current *= VELOCITY_DECAY;
      }
      // Phase 3: Continuous idle animation
      else {
        const totalVelocity = IDLE_VELOCITY + scrollVelocityRef.current;
        currentRef.current += totalVelocity * deltaTime;
        scrollVelocityRef.current *= VELOCITY_DECAY;
      }

      // Loop the animation instead of stopping
      if (currentRef.current > 2) {
        currentRef.current = currentRef.current % 2;
      }

      setProgress(currentRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    lastScrollY.current = window.scrollY;
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Detect mobile for reduced columns
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate data columns - half on mobile for performance
  const columnCount = isMobile ? 10 : 20;
  const columnWidth = 100 / columnCount;
  const columns = [...Array(columnCount)].map((_, i) => ({
    x: i * columnWidth,
    speed: 0.5 + (i % 4) * 0.3,
    length: 5 + (i % 6),
    delay: (i * 0.02) % 0.4,
    // Binary characters instead of Katakana
    chars: [...Array(22)].map(() => Math.random() > 0.5 ? '1' : '0'),
  }));

  // Calculate tunnel effects
  const tunnelScale = 1 + tunnelProgress * 2; // Scale from 1 to 3
  const tunnelSpeedMultiplier = 1 + tunnelProgress * 15; // Speed up significantly
  // Brightness increases first, then fades out in the last 40%
  const fadeOutStart = 0.6;
  const tunnelBrightness = tunnelProgress < fadeOutStart
    ? 1 + tunnelProgress * 0.8 // Get brighter initially
    : (1 + fadeOutStart * 0.8) * (1 - (tunnelProgress - fadeOutStart) / (1 - fadeOutStart)); // Then fade out
  const tunnelOpacity = tunnelProgress < fadeOutStart ? 1 : 1 - (tunnelProgress - fadeOutStart) / (1 - fadeOutStart);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      lang="en"
      translate="no"
      style={{
        transform: tunnelMode ? `scale(${tunnelScale})` : 'none',
        opacity: tunnelMode ? tunnelOpacity : 1,
        transition: 'transform 0.1s linear',
      }}
    >
      {/* Green data columns (matches test page) */}
      {columns.map((col, i) => {
        // Apply tunnel speed multiplier to column progress
        const colProgress = Math.max(0, (progress - col.delay) * col.speed * 2 * tunnelSpeedMultiplier);
        const yOffset = colProgress * 100;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${col.x}%`,
              top: 0,
              width: '3%', // Slightly narrower columns for better spacing
              height: '100%',
              overflow: 'hidden',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.2',
            }}
          >
            {col.chars.map((char, j) => {
              const charY = ((j * 5 + yOffset) % 105);
              const isHead = j === Math.floor(colProgress * col.chars.length) % col.chars.length;
              const brightness = (isHead ? 1 : Math.max(0, 1 - j * 0.06)) * tunnelBrightness;
              const fadeAtBottom = charY > 70 ? Math.max(0, 1 - (charY - 70) / 30) : 1;

              return (
                <div
                  key={j}
                  style={{
                    position: 'absolute',
                    top: 0,
                    // Use transform instead of top for CLS optimization
                    transform: `translateY(${charY}vh)`,
                    // Green colors matching test page - intensify during tunnel
                    color: isHead
                      ? `rgba(255,255,255,${Math.min(0.95 * fadeAtBottom * tunnelBrightness, 1)})`
                      : `rgba(100,255,100,${Math.min(brightness * 0.7 * fadeAtBottom, 1)})`,
                    textShadow: isHead
                      ? `0 0 ${15 + tunnelProgress * 20}px rgba(100,255,100,${Math.min(0.8 * fadeAtBottom * tunnelBrightness, 1)})`
                      : `0 0 ${5 + tunnelProgress * 10}px rgba(100,255,100,${Math.min(brightness * 0.3 * fadeAtBottom, 1)})`,
                  }}
                >
                  {char}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Gradient overlay for depth - intensifies during tunnel */}
      <div
        className="absolute inset-0"
        style={{
          background: tunnelMode
            ? `radial-gradient(ellipse ${60 - tunnelProgress * 40}% ${40 - tunnelProgress * 30}% at 50% 50%, transparent 0%, rgba(0,0,0,${0.6 + tunnelProgress * 0.3}) 100%)`
            : 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />

    </div>
  );
}
