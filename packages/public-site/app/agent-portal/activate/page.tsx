'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { H1, CyberCard } from '@saa/shared/components/saa';

// Initial progress values for the data stream effect
const INITIAL_PROGRESS_START = 0.05;
const INITIAL_PROGRESS_END = 0.5;

// Auth API URL - admin dashboard handles authentication
const AUTH_API_URL = 'https://saabuildingblocks.com';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

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
          setUserName(data.firstName || data.full_name || data.first_name || '');
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

    try {
      // Activate the account
      const response = await fetch(`${AUTH_API_URL}/api/auth/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
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
        };

        localStorage.setItem('agent_portal_user', JSON.stringify(userData));
        localStorage.setItem('agent_portal_token', data.data.accessToken);

        // Redirect directly to agent portal
        router.push('/agent-portal');
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
          };

          localStorage.setItem('agent_portal_user', JSON.stringify(userData));
          localStorage.setItem('agent_portal_token', loginData.data.accessToken);

          // Redirect directly to agent portal
          router.push('/agent-portal');
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
            <div className="w-full max-w-md">
              <CyberCard padding="lg" centered={false}>
                <div className="text-center py-4">
                  <div className="text-5xl mb-4">⚠️</div>
                  <p className="text-body text-[#e5e4dd]/70 mb-6">
                    {error}
                  </p>
                  <button
                    onClick={() => router.push('/agent-portal/login')}
                    className="px-8 py-3 bg-[#ffd700]/20 border-2 border-[#ffd700] rounded-lg text-[#ffd700] font-bold uppercase tracking-wider hover:bg-[#ffd700]/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all"
                  >
                    Go to Login
                  </button>
                </div>
              </CyberCard>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="relative h-screen flex flex-col overflow-hidden">
      <DataStreamEffect />

      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4">
        <div className="flex flex-col items-center pt-[15vh]">
          <div className="text-center mb-8 whitespace-nowrap">
            <H1 className="mb-2">WELCOME TO THE ALLIANCE</H1>
            <p className="text-body text-[#ffd700]/80">
              {userName ? `Hello ${userName}! ` : ''}Set your access code to get started
            </p>
          </div>

          <div className="w-full max-w-md">
            <CyberCard padding="lg" centered={false}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Email Display (readonly) */}
                {userEmail && (
                  <div className="space-y-2">
                    <label className="block text-caption text-[#ffd700] uppercase tracking-wider">
                      Email
                    </label>
                    <div className="w-full px-4 py-3 bg-black/30 border border-[#ffd700]/20 rounded-lg text-[#e5e4dd]/60">
                      {userEmail}
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-caption text-[#ffd700] uppercase tracking-wider">
                    Create Access Code
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-black/50 border border-[#ffd700]/30 rounded-lg text-[#e5e4dd] placeholder-[#e5e4dd]/40 focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/50 transition-all"
                    placeholder="Minimum 8 characters"
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-caption text-[#ffd700] uppercase tracking-wider">
                    Confirm Access Code
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-black/50 border border-[#ffd700]/30 rounded-lg text-[#e5e4dd] placeholder-[#e5e4dd]/40 focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/50 transition-all"
                    placeholder="Re-enter access code"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#ffd700]/20 border-2 border-[#ffd700] rounded-lg text-[#ffd700] font-bold uppercase tracking-wider hover:bg-[#ffd700]/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-[#ffd700]/30 border-t-[#ffd700] rounded-full animate-spin" />
                      Activating...
                    </span>
                  ) : (
                    'Join The Alliance'
                  )}
                </button>
              </form>
            </CyberCard>
          </div>
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
 */
function DataStreamEffect() {
  const [progress, setProgress] = useState(INITIAL_PROGRESS_START);
  const currentRef = useRef(INITIAL_PROGRESS_START);
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
        const totalVelocity = blendedVelocity + scrollVelocityRef.current;

        currentRef.current += totalVelocity * deltaTime;
        scrollVelocityRef.current *= VELOCITY_DECAY;
      } else {
        const totalVelocity = IDLE_VELOCITY + scrollVelocityRef.current;
        currentRef.current += totalVelocity * deltaTime;
        scrollVelocityRef.current *= VELOCITY_DECAY;
      }

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
