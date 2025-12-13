'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * RevealMaskEffect - Golden glow that contracts/expands based on scroll
 *
 * Placed behind hero images to create a cosmic portal effect.
 * The mask starts large and shrinks as user scrolls, or vice versa.
 */

// Initial progress offset - effect starts at this progress value on page load
const INITIAL_PROGRESS = 0.35;

export function RevealMaskEffect() {
  const [progress, setProgress] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number>(0);
  const introCompleteRef = useRef(false);
  const introStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const INTRO_DURATION = 1500; // 1.5 seconds for intro animation
    const smoothFactor = 0.08;

    const handleScroll = () => {
      // Progress based on scroll from top of page
      const scrollProgress = Math.min(1, window.scrollY / window.innerHeight);
      // Add initial offset
      const adjustedProgress = INITIAL_PROGRESS + scrollProgress * (1 - INITIAL_PROGRESS);
      targetRef.current = adjustedProgress;
    };

    const animate = (timestamp: number) => {
      // Handle intro animation first
      if (!introCompleteRef.current) {
        if (introStartTimeRef.current === null) {
          introStartTimeRef.current = timestamp;
        }
        const elapsed = timestamp - introStartTimeRef.current;
        const introProgress = Math.min(1, elapsed / INTRO_DURATION);

        // Ease out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - introProgress, 3);
        const introValue = eased * INITIAL_PROGRESS;

        currentRef.current = introValue;
        targetRef.current = Math.max(targetRef.current, introValue);
        setProgress(introValue);

        if (introProgress >= 1) {
          introCompleteRef.current = true;
          currentRef.current = INITIAL_PROGRESS;
          targetRef.current = INITIAL_PROGRESS;
        }
      } else {
        // Normal scroll-based animation after intro
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
