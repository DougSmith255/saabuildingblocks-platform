'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Scramble Counter Animation Hook
 * Creates a slot-machine style scramble effect that counts up to a target number
 */
export function useScrambleCounter(
  targetNumber: number,
  duration: number = 2000,
  triggerOnView: boolean = true,
  externalTrigger?: boolean
) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    if (hasAnimated) return;

    const startTime = performance.now();

    const runAnimation = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        setDisplayValue(targetNumber);
        setHasAnimated(true);
        animationRef.current = null;
      } else {
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(targetNumber * easedProgress);

        const scrambleIntensity = 1 - progress;
        if (Math.random() < scrambleIntensity * 0.4 && progress < 0.8) {
          const variance = Math.floor(targetNumber * 0.1 * scrambleIntensity);
          const scrambledValue = Math.max(0, currentValue + Math.floor(Math.random() * variance * 2) - variance);
          setDisplayValue(scrambledValue);
        } else {
          setDisplayValue(currentValue);
        }

        animationRef.current = requestAnimationFrame(runAnimation);
      }
    };

    animationRef.current = requestAnimationFrame(runAnimation);
  }, [targetNumber, duration, hasAnimated]);

  // Handle external trigger
  useEffect(() => {
    if (externalTrigger !== undefined && externalTrigger && !hasAnimated) {
      animate();
    }
  }, [externalTrigger, animate, hasAnimated]);

  useEffect(() => {
    // Skip IntersectionObserver if using external trigger
    if (externalTrigger !== undefined) return;

    if (!triggerOnView) {
      animate();
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animate();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, triggerOnView, hasAnimated, externalTrigger]);

  return { displayValue, elementRef, hasAnimated };
}
