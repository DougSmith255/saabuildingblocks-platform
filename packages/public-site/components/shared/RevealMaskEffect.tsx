'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * RevealMaskEffect - Golden glow that contracts/expands based on scroll
 *
 * Placed behind hero images to create a cosmic portal effect.
 * The mask starts large and shrinks as user scrolls, or vice versa.
 */

// Initial progress offset - effect animates from START to END on page load
const INITIAL_PROGRESS_START = 0.05;
const INITIAL_PROGRESS_END = 0.5;

export function RevealMaskEffect() {
  const [progress, setProgress] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number>(0);
  const introCompleteRef = useRef(false);
  const introStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const INTRO_DURATION = 3000; // 3 seconds for intro animation
    const IDLE_SPEED = 0.00015; // Very slow continuous animation when not scrolling
    const smoothFactor = 0.08;
    let lastTimestamp = 0;

    const handleScroll = () => {
      // Progress based on scroll from top of page
      const scrollProgress = Math.min(1, window.scrollY / window.innerHeight);
      // Add initial offset - scroll continues from where intro ended
      const adjustedProgress = INITIAL_PROGRESS_END + scrollProgress * (1 - INITIAL_PROGRESS_END);
      targetRef.current = adjustedProgress;
    };

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;

      // Handle intro animation first
      if (!introCompleteRef.current) {
        if (introStartTimeRef.current === null) {
          introStartTimeRef.current = timestamp;
        }
        const elapsed = timestamp - introStartTimeRef.current;
        const introProgress = Math.min(1, elapsed / INTRO_DURATION);

        // Ease out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - introProgress, 3);
        // Animate from START to END
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
        // After intro: slow idle animation + faster scroll response
        const scrollDiff = targetRef.current - currentRef.current;

        if (Math.abs(scrollDiff) > 0.001) {
          // User is scrolling - respond faster
          currentRef.current += scrollDiff * smoothFactor;
        } else {
          // No scroll - continue slow idle animation
          currentRef.current += IDLE_SPEED * deltaTime;
          targetRef.current = currentRef.current;
        }

        // Cap at max progress
        if (currentRef.current > 1) {
          currentRef.current = 1;
          targetRef.current = 1;
        }

        setProgress(currentRef.current);
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

  // REVERSED: Start at 70%, shrink to small (20%) as user scrolls
  const maskSize = 70 - progress * 50;
  const rotation = progress * 90;
  // Fade out the effect as we scroll past 60%
  const fadeOut = progress > 0.6 ? 1 - (progress - 0.6) / 0.4 : 1;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 0 }}>
      {/* Golden radial glow - BOOSTED intensity */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse ${maskSize}% ${maskSize * 0.8}% at 50% 40%,
            rgba(255,215,0,${0.35 * fadeOut}) 0%,
            rgba(255,180,0,${0.25 * fadeOut}) 30%,
            rgba(255,150,0,${0.15 * fadeOut}) 50%,
            transparent 75%)`,
        }}
      />
      {/* Outer rotating border - centered */}
      <div
        className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] border-2"
        style={{
          top: '35%',
          transform: `translateY(-50%) rotate(${rotation}deg)`,
          borderRadius: `${20 + progress * 30}%`,
          borderColor: `rgba(255,215,0,${0.4 * fadeOut})`,
        }}
      />
      {/* Inner rotating border - centered */}
      <div
        className="absolute w-[60vw] h-[60vw] max-w-[450px] max-h-[450px] border"
        style={{
          top: '35%',
          transform: `translateY(-50%) rotate(${-rotation * 0.5}deg)`,
          borderRadius: `${50 - progress * 30}%`,
          borderColor: `rgba(255,215,0,${0.3 * fadeOut})`,
        }}
      />
    </div>
  );
}
