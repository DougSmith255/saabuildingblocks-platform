'use client';

import { useState, useEffect, useRef } from 'react';
import { H1, CTAButton, GenericCard } from '@saa/shared/components/saa';

// Initial progress values for the data stream effect
const INITIAL_PROGRESS_START = 0.05;
const INITIAL_PROGRESS_END = 0.5;

/**
 * Agent Portal Login Page
 * Features the Data Stream effect in neon blue with centered login form
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
      {/* Data Stream Effect - Neon Blue */}
      <DataStreamEffect />

      {/* Login Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <H1 className="mb-2">ALLIANCE HQ</H1>
          <p className="text-body text-[#00d4ff]/80">Access your agent command center</p>
        </div>

        {/* Login Form */}
        <GenericCard padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-caption text-[#00d4ff] uppercase tracking-wider">
                Agent ID / Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/50 border border-[#00d4ff]/30 rounded-lg text-[#e5e4dd] placeholder-[#e5e4dd]/40 focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff]/50 transition-all"
                placeholder="agent@example.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-caption text-[#00d4ff] uppercase tracking-wider">
                Access Code
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/50 border border-[#00d4ff]/30 rounded-lg text-[#e5e4dd] placeholder-[#e5e4dd]/40 focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff]/50 transition-all"
                placeholder="Enter access code"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#00d4ff]/20 border-2 border-[#00d4ff] rounded-lg text-[#00d4ff] font-bold uppercase tracking-wider hover:bg-[#00d4ff]/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin" />
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
                className="text-caption text-[#00d4ff]/60 hover:text-[#00d4ff] transition-colors"
              >
                Forgot access code?
              </a>
            </div>
          </form>
        </GenericCard>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-caption text-[#e5e4dd]/60 hover:text-[#00d4ff] transition-colors"
          >
            Return to base
          </a>
        </div>
      </div>
    </main>
  );
}

/**
 * Data Stream Effect - Neon Blue Matrix-style rain
 */
function DataStreamEffect() {
  const [progress, setProgress] = useState(INITIAL_PROGRESS_START);
  const targetRef = useRef(INITIAL_PROGRESS_START);
  const currentRef = useRef(INITIAL_PROGRESS_START);
  const rafRef = useRef<number>(0);
  const introCompleteRef = useRef(false);
  const introStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const INTRO_DURATION = 3000;
    const smoothFactor = 0.08;

    const handleScroll = () => {
      const scrollProgress = Math.min(1, window.scrollY / window.innerHeight);
      const adjustedProgress = INITIAL_PROGRESS_END + scrollProgress * (1 - INITIAL_PROGRESS_END);
      targetRef.current = adjustedProgress;
    };

    const animate = (timestamp: number) => {
      if (!introCompleteRef.current) {
        if (introStartTimeRef.current === null) {
          introStartTimeRef.current = timestamp;
        }
        const elapsed = timestamp - introStartTimeRef.current;
        const introProgress = Math.min(1, elapsed / INTRO_DURATION);
        const eased = 1 - Math.pow(1 - introProgress, 3);
        const introValue = INITIAL_PROGRESS_START + eased * (INITIAL_PROGRESS_END - INITIAL_PROGRESS_START);

        currentRef.current = introValue;
        targetRef.current = Math.max(targetRef.current, introValue);
        setProgress(introValue);

        if (introProgress >= 1) {
          introCompleteRef.current = true;
          currentRef.current = INITIAL_PROGRESS_END;
          targetRef.current = INITIAL_PROGRESS_END;
        }
      } else {
        const diff = targetRef.current - currentRef.current;
        if (Math.abs(diff) > 0.0001) {
          currentRef.current += diff * smoothFactor;
          setProgress(currentRef.current);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Generate data columns
  const columns = [...Array(25)].map((_, i) => ({
    x: i * 4,
    speed: 0.5 + (i % 4) * 0.3,
    length: 5 + (i % 6),
    delay: (i * 0.02) % 0.4,
    chars: [...Array(22)].map(() => String.fromCharCode(0x30A0 + Math.random() * 96)),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Neon blue data columns */}
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
              width: '4%',
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
                      : `rgba(0,212,255,${brightness * 0.7 * fadeAtBottom})`,
                    textShadow: isHead
                      ? `0 0 15px rgba(0,212,255,${0.8 * fadeAtBottom})`
                      : `0 0 5px rgba(0,212,255,${brightness * 0.3 * fadeAtBottom})`,
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
