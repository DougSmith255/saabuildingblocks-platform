'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Agent Portal Layout
 * Provides a persistent transition overlay that covers page navigations
 * When navigating from login to dashboard, shows a reveal animation
 */
export default function AgentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showReveal, setShowReveal] = useState(false);
  const prevPathRef = useRef(pathname);

  // Detect navigation from login to dashboard
  useEffect(() => {
    const wasLogin = prevPathRef.current === '/agent-portal/login';
    const isDashboard = pathname === '/agent-portal';

    if (wasLogin && isDashboard) {
      // Coming from login page - show reveal animation
      setShowReveal(true);
    }

    prevPathRef.current = pathname;
  }, [pathname]);

  // Handle reveal completion
  const handleRevealComplete = () => {
    setShowReveal(false);
  };

  return (
    <>
      {children}
      {showReveal && (
        <RevealOverlay onComplete={handleRevealComplete} />
      )}
    </>
  );
}

/**
 * Reveal Overlay Component
 * Shows the end of the tunnel animation fading out to reveal the dashboard
 * Starts at the "zoomed in" state and fades out
 */
function RevealOverlay({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const REVEAL_DURATION = 800;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(elapsed / REVEAL_DURATION, 1);
      // Ease out cubic for smooth fade
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      setProgress(eased);

      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    // Small delay to ensure dashboard is rendered
    setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 50);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [onComplete]);

  // Generate matrix rain columns
  const columns = [...Array(20)].map((_, i) => ({
    x: i * 5,
    speed: 0.5 + (i % 4) * 0.3,
    chars: [...Array(22)].map(() => String.fromCharCode(0x30A0 + Math.random() * 96)),
  }));

  // Start at zoomed-in state (end of tunnel) and fade out
  const scale = 3 - progress * 2; // 3 -> 1
  const opacity = 1 - progress; // 1 -> 0
  const brightness = 0.5 + progress * 0.3; // Dim -> slightly brighter as it fades

  // Don't render if fully faded
  if (opacity <= 0) return null;

  return (
    <div
      className="fixed inset-0 z-[10030] pointer-events-none overflow-hidden"
      style={{
        backgroundColor: `rgba(10, 10, 10, ${opacity})`,
      }}
    >
      <div
        className="absolute inset-0"
        lang="en"
        translate="no"
        style={{
          transform: `scale(${scale})`,
          opacity: opacity,
        }}
      >
        {/* Green data columns */}
        {columns.map((col, i) => {
          const colProgress = 0.8 * col.speed * 2; // Fixed position (end of tunnel)
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
                const charBrightness = (isHead ? 1 : Math.max(0, 1 - j * 0.06)) * brightness;
                const fadeAtBottom = charY > 70 ? Math.max(0, 1 - (charY - 70) / 30) : 1;

                return (
                  <div
                    key={j}
                    style={{
                      position: 'absolute',
                      top: 0,
                      transform: `translateY(${charY}vh)`,
                      color: isHead
                        ? `rgba(255,255,255,${Math.min(0.95 * fadeAtBottom * brightness, 1)})`
                        : `rgba(100,255,100,${Math.min(charBrightness * 0.7 * fadeAtBottom, 1)})`,
                      textShadow: isHead
                        ? `0 0 25px rgba(100,255,100,${Math.min(0.8 * fadeAtBottom * brightness, 1)})`
                        : `0 0 10px rgba(100,255,100,${Math.min(charBrightness * 0.3 * fadeAtBottom, 1)})`,
                    }}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Gradient overlay for depth - tight focus like end of tunnel */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 30% 20% at 50% 50%, transparent 0%, rgba(0,0,0,0.8) 100%)',
          }}
        />
      </div>
    </div>
  );
}
