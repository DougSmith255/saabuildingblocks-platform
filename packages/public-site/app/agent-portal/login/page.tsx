'use client';

import { useState, useEffect, useRef } from 'react';
import { H1, CyberCardGold } from '@saa/shared/components/saa';

// Initial progress values for the data stream effect
const INITIAL_PROGRESS_START = 0.05;
const INITIAL_PROGRESS_END = 0.5;

/**
 * Agent Portal Login Page
 * Features the Data Stream effect in green with centered login form in CyberCardGold
 */
export default function AgentPortalLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement actual login logic
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to portal after login
      window.location.href = '/agent-portal';
    }, 1500);
  };

  return (
    <main id="main-content" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Data Stream Effect - Green (matches test page) */}
      <DataStreamEffect />

      {/* Login Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <H1 className="mb-2">ALLIANCE HQ</H1>
          <p className="text-body text-[#ffd700]/80">Access your agent command center</p>
        </div>

        {/* Login Form - CyberCardGold */}
        <CyberCardGold padding="lg" centered={false}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-caption text-[#ffd700] uppercase tracking-wider">
                Agent ID / Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/50 border border-[#ffd700]/30 rounded-lg text-[#e5e4dd] placeholder-[#e5e4dd]/40 focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/50 transition-all"
                placeholder="agent@example.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-caption text-[#ffd700] uppercase tracking-wider">
                Access Code
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/50 border border-[#ffd700]/30 rounded-lg text-[#e5e4dd] placeholder-[#e5e4dd]/40 focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/50 transition-all"
                placeholder="Enter access code"
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
                  Initializing...
                </span>
              ) : (
                'Initialize Uplink'
              )}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <a
                href="#"
                className="text-caption text-[#ffd700]/60 hover:text-[#ffd700] transition-colors"
              >
                Forgot access code?
              </a>
            </div>
          </form>
        </CyberCardGold>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-caption text-[#e5e4dd]/60 hover:text-[#ffd700] transition-colors"
          >
            Return to base
          </a>
        </div>
      </div>
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

      if (currentRef.current > 2) {
        currentRef.current = 2;
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

  // Generate data columns - fewer columns with more spacing for mobile
  // Desktop: 20 columns at 5% width each = full coverage
  // Mobile: same columns but with gap between them
  const columns = [...Array(20)].map((_, i) => ({
    x: i * 5, // 5% spacing between columns (was 4%)
    speed: 0.5 + (i % 4) * 0.3,
    length: 5 + (i % 6),
    delay: (i * 0.02) % 0.4,
    chars: [...Array(22)].map(() => String.fromCharCode(0x30A0 + Math.random() * 96)),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Green data columns (matches test page) */}
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
              const brightness = isHead ? 1 : Math.max(0, 1 - j * 0.06);
              const fadeAtBottom = charY > 70 ? Math.max(0, 1 - (charY - 70) / 30) : 1;

              return (
                <div
                  key={j}
                  style={{
                    position: 'absolute',
                    top: `${charY}%`,
                    // Green colors matching test page
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

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}
