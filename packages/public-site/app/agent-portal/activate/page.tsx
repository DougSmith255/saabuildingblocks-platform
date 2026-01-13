'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { H1, FormCard, FormGroup, FormInput, FormButton, FormMessage, ModalTitle } from '@saa/shared/components/saa';

// Initial progress values for the data stream effect
const INITIAL_PROGRESS_START = 0.05;
const INITIAL_PROGRESS_END = 0.5;

// Auth API URL - admin dashboard handles authentication
const AUTH_API_URL = 'https://saabuildingblocks.com';

// Onboarding step type - simplified to just welcome after password/email setup
type OnboardingStep = 'welcome' | null;

/**
 * Agent Portal Activation Page
 * For new users to set their password after receiving an invitation
 * Auto-logs in and redirects to agent portal after successful activation
 */
function ActivatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');

  // Onboarding state
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(null);
  const [activatedUser, setActivatedUser] = useState<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    profilePictureUrl: string | null;
  } | null>(null);

  // Editable email for login (separate from exp_email which is the official one)
  const [loginEmail, setLoginEmail] = useState('');

  // Navigate to dashboard
  const goToDashboard = () => {
    router.push('/agent-portal');
  };

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link. Please check your email for the correct link.');
      setIsValidating(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`${AUTH_API_URL}/api/invitations/validate?token=${encodeURIComponent(token)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok || !data.valid) {
          setError(data.error || data.message || 'This invitation link is invalid or has expired. Please request a new invitation.');
          setTokenValid(false);
        } else {
          setTokenValid(true);
          setUserEmail(data.email || '');
          setLoginEmail(data.email || ''); // Initialize editable login email
          setUserFirstName(data.first_name || data.firstName || '');
          setUserLastName(data.last_name || data.lastName || '');
          setUserName(data.first_name || data.firstName || data.full_name || '');
        }
      } catch (err) {
        console.error('Token validation error:', err);
        setError('Unable to validate invitation. Please try again later.');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      setIsLoading(false);
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter.');
      setIsLoading(false);
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number.');
      setIsLoading(false);
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError('Password must contain at least one special character.');
      setIsLoading(false);
      return;
    }

    // Validate email
    if (!loginEmail || !loginEmail.includes('@')) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      // Activate the account via invitation accept endpoint
      // Include loginEmail which becomes the user's email for login (separate from exp_email)
      const response = await fetch(`${AUTH_API_URL}/api/invitations/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          email: loginEmail, // User's login email (can be different from exp_email)
          first_name: userFirstName || 'User',
          last_name: userLastName || 'Agent',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to activate account. Please try again.');
        setIsLoading(false);
        return;
      }

      // If activation returns tokens, use them for auto-login
      if (data.data?.accessToken) {
        const userData = {
          id: data.data.user.id,
          email: data.data.user.email,
          username: data.data.user.username,
          firstName: data.data.user.first_name || '',
          lastName: data.data.user.last_name || '',
          fullName: data.data.user.full_name || `${data.data.user.first_name || ''} ${data.data.user.last_name || ''}`.trim(),
          role: data.data.user.role,
          profilePictureUrl: data.data.user.profile_picture_url || null,
          gender: data.data.user.gender || 'male',
          isLeader: data.data.user.is_leader || false,
          state: data.data.user.state || null,
        };

        localStorage.setItem('agent_portal_user', JSON.stringify(userData));
        localStorage.setItem('agent_portal_token', data.data.accessToken);

        // Start onboarding flow instead of redirecting
        setActivatedUser(userData);
        setOnboardingStep('welcome');
        setIsLoading(false);
      } else {
        // Fallback: auto-login after activation
        const loginResponse = await fetch(`${AUTH_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: userEmail,
            password,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok && loginData.data?.accessToken) {
          const userData = {
            id: loginData.data.user.id,
            email: loginData.data.user.email,
            username: loginData.data.user.username,
            firstName: loginData.data.user.first_name || '',
            lastName: loginData.data.user.last_name || '',
            fullName: loginData.data.user.full_name || `${loginData.data.user.first_name || ''} ${loginData.data.user.last_name || ''}`.trim(),
            role: loginData.data.user.role,
            profilePictureUrl: loginData.data.user.profile_picture_url || null,
            gender: loginData.data.user.gender || 'male',
            isLeader: loginData.data.user.is_leader || false,
            state: loginData.data.user.state || null,
          };

          localStorage.setItem('agent_portal_user', JSON.stringify(userData));
          localStorage.setItem('agent_portal_token', loginData.data.accessToken);

          // Start onboarding flow instead of redirecting
          setActivatedUser(userData);
          setOnboardingStep('welcome');
          setIsLoading(false);
        } else {
          // If auto-login fails, redirect to login page
          router.push('/agent-portal/login?activated=true');
        }
      }
    } catch (err) {
      console.error('Activation error:', err);
      setError('Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  // Show loading state while validating token
  if (isValidating) {
    return (
      <main id="main-content" className="relative h-screen flex flex-col overflow-hidden">
        <DataStreamEffect />
        <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4">
          <div className="flex flex-col items-center pt-[15vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#ffd700]/30 border-t-[#ffd700] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-body text-[#ffd700]/80">Validating invitation...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show error state if token is invalid
  if (!tokenValid) {
    return (
      <main id="main-content" className="relative h-screen flex flex-col overflow-hidden">
        <DataStreamEffect />
        <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4">
          <div className="flex flex-col items-center pt-[15vh]">
            <div className="text-center mb-8">
              <H1 className="mb-2">INVITATION ERROR</H1>
            </div>
            <FormCard maxWidth="md">
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>
                  {error}
                </p>
                <FormButton onClick={() => router.push('/agent-portal/login')}>
                  Go to Login
                </FormButton>
              </div>
            </FormCard>
          </div>
        </div>
      </main>
    );
  }

  // Show welcome message after successful activation, then redirect to dashboard
  if (onboardingStep && activatedUser) {
    return (
      <main id="main-content" className="relative min-h-screen flex flex-col overflow-x-hidden">
        <DataStreamEffect />

        <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 py-8">
          <div className="flex flex-col items-center w-full max-w-lg">
            {/* Welcome Step - single step then go to dashboard */}
            <FormCard maxWidth="md">
              <div className="text-center py-4">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-[#ffd700] mb-2">
                  Welcome, {activatedUser.firstName || 'Agent'}!
                </h2>
                <p className="text-[#e5e4dd]/70 mb-6">
                  Your account is now active. You&apos;re ready to access the Agent Portal.
                </p>

                <div className="space-y-3 text-left mb-8 px-4">
                  <h3 className="text-sm font-semibold text-[#ffd700] mb-2">Your Agent Portal includes:</h3>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">📚</span>
                    <div>
                      <p className="text-sm font-medium text-[#e5e4dd]">Exclusive Templates</p>
                      <p className="text-xs text-[#e5e4dd]/60">Marketing assets ready to customize</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">🎓</span>
                    <div>
                      <p className="text-sm font-medium text-[#e5e4dd]">Elite Courses</p>
                      <p className="text-xs text-[#e5e4dd]/60">Social Agent Academy, Investor Army & more</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">🔗</span>
                    <div>
                      <p className="text-sm font-medium text-[#e5e4dd]">Your SAA Pages</p>
                      <p className="text-xs text-[#e5e4dd]/60">Personal agent page & linktree</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">📹</span>
                    <div>
                      <p className="text-sm font-medium text-[#e5e4dd]">Team Calls</p>
                      <p className="text-xs text-[#e5e4dd]/60">Live and recorded training sessions</p>
                    </div>
                  </div>
                </div>

                <FormButton onClick={goToDashboard}>
                  Enter Dashboard →
                </FormButton>
              </div>
            </FormCard>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="relative min-h-screen flex flex-col overflow-x-hidden">
      <DataStreamEffect />

      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4">
        <div className="flex flex-col items-center pt-[15vh]">
          <div className="text-center mb-8 px-4">
            <H1 className="mb-2">WELCOME TO THE ALLIANCE</H1>
            <p className="text-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {userName ? `Hello ${userName}! ` : ''}Set your password to get started
            </p>
          </div>

          <FormCard maxWidth="md">
            <ModalTitle subtitle="Set up your login credentials">
              Activate Your Account
            </ModalTitle>

            <form onSubmit={handleSubmit}>
              {error && (
                <FormMessage type="error">{error}</FormMessage>
              )}

              {/* Editable Email Field */}
              <FormGroup label="Email Address" htmlFor="login-email" required>
                <FormInput
                  type="email"
                  id="login-email"
                  name="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.25rem' }}>
                  This will be your login email and where we send you notifications.
                </p>
              </FormGroup>

              {/* Password Field with visibility toggle */}
              <FormGroup label="Create Password" htmlFor="password" required>
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
                {/* Password requirements */}
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.5rem' }}>
                  <p style={{ color: password.length >= 8 ? '#4ade80' : undefined }}>
                    {password.length >= 8 ? '✓' : '○'} At least 8 characters
                  </p>
                  <p style={{ color: /[A-Z]/.test(password) ? '#4ade80' : undefined }}>
                    {/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter
                  </p>
                  <p style={{ color: /[a-z]/.test(password) ? '#4ade80' : undefined }}>
                    {/[a-z]/.test(password) ? '✓' : '○'} One lowercase letter
                  </p>
                  <p style={{ color: /[0-9]/.test(password) ? '#4ade80' : undefined }}>
                    {/[0-9]/.test(password) ? '✓' : '○'} One number
                  </p>
                  <p style={{ color: /[^A-Za-z0-9]/.test(password) ? '#4ade80' : undefined }}>
                    {/[^A-Za-z0-9]/.test(password) ? '✓' : '○'} One special character
                  </p>
                </div>
              </FormGroup>

              {/* Confirm Password Field with visibility toggle */}
              <FormGroup label="Confirm Password" htmlFor="confirmPassword" required>
                <div style={{ position: 'relative' }}>
                  <FormInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
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
                {/* Password match indicator */}
                {confirmPassword && (
                  <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: password === confirmPassword ? '#4ade80' : '#f87171' }}>
                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </FormGroup>

              {/* Submit Button */}
              <div style={{ marginTop: '1.5rem' }}>
                <FormButton isLoading={isLoading} loadingText="Activating...">
                  Join The Alliance
                </FormButton>
              </div>
            </form>
          </FormCard>
        </div>
      </div>
    </main>
  );
}

export default function AgentPortalActivate() {
  return (
    <Suspense fallback={
      <main id="main-content" className="relative h-screen flex flex-col overflow-hidden bg-black">
        <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4">
          <div className="w-12 h-12 border-4 border-[#ffd700]/30 border-t-[#ffd700] rounded-full animate-spin" />
        </div>
      </main>
    }>
      <ActivatePageContent />
    </Suspense>
  );
}

/**
 * Data Stream Effect - Green Matrix-style rain
 * Uses ping-pong animation to smoothly reverse direction instead of resetting
 */
function DataStreamEffect() {
  const [progress, setProgress] = useState(INITIAL_PROGRESS_START);
  const currentRef = useRef(INITIAL_PROGRESS_START);
  const directionRef = useRef(1); // 1 = forward, -1 = reverse
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
    const MAX_PROGRESS = 1.5; // Upper bound for ping-pong
    const MIN_PROGRESS = 0.1; // Lower bound for ping-pong
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

      if (elapsed < INTRO_DURATION) {
        const introProgress = elapsed / INTRO_DURATION;
        const eased = 1 - Math.pow(1 - introProgress, 3);
        currentRef.current = INITIAL_PROGRESS_START + eased * (INITIAL_PROGRESS_END - INITIAL_PROGRESS_START);
        velocityRef.current = INTRO_VELOCITY * (1 - introProgress);
      } else if (elapsed < INTRO_DURATION + TRANSITION_DURATION) {
        if (introEndTime === null) {
          introEndTime = timestamp;
          velocityRef.current = INTRO_VELOCITY * 0.1;
        }

        const transitionProgress = (elapsed - INTRO_DURATION) / TRANSITION_DURATION;
        const blendedVelocity = velocityRef.current * (1 - transitionProgress) + IDLE_VELOCITY * transitionProgress;
        const totalVelocity = (blendedVelocity + scrollVelocityRef.current) * directionRef.current;

        currentRef.current += totalVelocity * deltaTime;
        scrollVelocityRef.current *= VELOCITY_DECAY;
      } else {
        const totalVelocity = (IDLE_VELOCITY + scrollVelocityRef.current) * directionRef.current;
        currentRef.current += totalVelocity * deltaTime;
        scrollVelocityRef.current *= VELOCITY_DECAY;
      }

      // Ping-pong: reverse direction at bounds instead of resetting
      if (currentRef.current > MAX_PROGRESS) {
        currentRef.current = MAX_PROGRESS;
        directionRef.current = -1;
      } else if (currentRef.current < MIN_PROGRESS) {
        currentRef.current = MIN_PROGRESS;
        directionRef.current = 1;
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

  const columns = [...Array(20)].map((_, i) => ({
    x: i * 5,
    speed: 0.5 + (i % 4) * 0.3,
    length: 5 + (i % 6),
    delay: (i * 0.02) % 0.4,
    chars: [...Array(22)].map(() => String.fromCharCode(0x30A0 + Math.random() * 96)),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" lang="en" translate="no">
      {columns.map((col, i) => {
        const colProgress = Math.max(0, (progress - col.delay) * col.speed * 2);
        const yOffset = colProgress * 100;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${col.x}%`,
              top: 0,
              width: '3%',
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
              const brightness = isHead ? 1 : Math.max(0, 1 - j * 0.06);
              const fadeAtBottom = charY > 70 ? Math.max(0, 1 - (charY - 70) / 30) : 1;

              return (
                <div
                  key={j}
                  style={{
                    position: 'absolute',
                    top: `${charY}%`,
                    color: isHead
                      ? `rgba(255,255,255,${0.95 * fadeAtBottom})`
                      : `rgba(100,255,100,${brightness * 0.7 * fadeAtBottom})`,
                    textShadow: isHead
                      ? `0 0 15px rgba(100,255,100,${0.8 * fadeAtBottom})`
                      : `0 0 5px rgba(100,255,100,${brightness * 0.3 * fadeAtBottom})`,
                  }}
                >
                  {char}
                </div>
              );
            })}
          </div>
        );
      })}

      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}
