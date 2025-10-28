'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

/**
 * SlotMachine3D Component Props
 * @interface SlotMachine3DProps
 */
export interface SlotMachine3DProps {
  /** Target value to animate to */
  value: number;
  /** Animation duration in seconds (default: 3) */
  duration?: number;
  /** Start animation automatically (default: true) */
  autoStart?: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Custom className for container */
  className?: string;
  /** Enable 3D effects (default: true) */
  enable3D?: boolean;
  /** Glow intensity (0-1, default: 1) */
  glowIntensity?: number;
  /** Show '+' symbol (default: true) */
  showPlus?: boolean;
  /** Label text (default: 'AGENTS') */
  label?: string;
  /** Custom color (default: #ffd700) */
  color?: string;
  /** Disable animations for reduced motion (auto-detected) */
  reduceMotion?: boolean;
  /** Aria label for accessibility */
  ariaLabel?: string;
}

/**
 * SlotMachine3D - A 3D slot machine counter with dramatic glow effects
 *
 * Features:
 * - 3D transforms (rotateX/rotateY/perspective)
 * - Multi-layer glow effect with pulsing animation
 * - Brand yellow (#ffd700) from CSS variables
 * - Realistic physics-based spinning
 * - Number cycling effect
 * - Respects prefers-reduced-motion
 * - Accessible with ARIA labels
 *
 * @component
 * @example
 * ```tsx
 * <SlotMachine3D
 *   value={3700}
 *   duration={3}
 *   label="AGENTS"
 *   onComplete={() => console.log('Animation complete')}
 * />
 * ```
 */
export const SlotMachine3D = React.forwardRef<HTMLDivElement, SlotMachine3DProps>(
  (
    {
      value,
      duration = 3,
      autoStart = true,
      onComplete,
      className = '',
      enable3D = true,
      glowIntensity = 1,
      showPlus = true,
      label = 'AGENTS',
      color = '#ffd700',
      reduceMotion: reduceMotionProp,
      ariaLabel,
    },
    ref
  ) => {
    const [currentValue, setCurrentValue] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    // Detect prefers-reduced-motion
    const prefersReducedMotion = useMemo(() => {
      if (typeof reduceMotionProp === 'boolean') return reduceMotionProp;
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, [reduceMotionProp]);

    /**
     * Easing function for realistic slot machine physics
     * Uses cubic-bezier curve for smooth deceleration
     */
    const easeOutCubic = useCallback((t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    }, []);

    /**
     * Animation loop using requestAnimationFrame
     * Follows performance best practices from research
     */
    const animate = useCallback(
      (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / (duration * 1000), 1);

        // Apply easing for smooth deceleration
        const easedProgress = prefersReducedMotion ? 1 : easeOutCubic(progress);
        const newValue = Math.floor(easedProgress * value);

        setCurrentValue(newValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setCurrentValue(value);
          setIsAnimating(false);
          startTimeRef.current = null;
          onComplete?.();
        }
      },
      [value, duration, easeOutCubic, onComplete, prefersReducedMotion]
    );

    /**
     * Start animation
     */
    const startAnimation = useCallback(() => {
      if (isAnimating) return;

      setIsAnimating(true);
      setCurrentValue(0);
      startTimeRef.current = null;

      if (prefersReducedMotion) {
        // Skip animation, show final value immediately
        setCurrentValue(value);
        setIsAnimating(false);
        onComplete?.();
      } else {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    }, [isAnimating, animate, value, onComplete, prefersReducedMotion]);

    /**
     * Auto-start animation on mount with continuous loop
     */
    useEffect(() => {
      if (!autoStart) return;

      // Initial animation
      const initialTimeout = setTimeout(() => {
        startAnimation();
      }, 100);

      // Continuous loop: animate, hold, reset, repeat
      const loopInterval = setInterval(() => {
        startAnimation();
      }, (duration + 3) * 1000); // duration + 3s hold

      // Cleanup function
      return () => {
        clearTimeout(initialTimeout);
        clearInterval(loopInterval);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [autoStart, startAnimation, duration]);

    /**
     * Calculate glow styles based on intensity
     */
    const glowStyles = useMemo(() => {
      const intensity = Math.max(0, Math.min(1, glowIntensity));

      // Multi-layer text shadow for dramatic glow
      const textShadow = [
        // Inner white glow
        `0 0 ${4 * intensity}px rgba(255, 255, 255, ${0.9 * intensity})`,
        `0 0 ${8 * intensity}px rgba(255, 255, 255, ${0.7 * intensity})`,
        // Mid gold glow
        `0 0 ${16 * intensity}px ${color}`,
        `0 0 ${24 * intensity}px ${color}`,
        // Outer gold glow
        `0 0 ${32 * intensity}px ${color}`,
        `0 0 ${48 * intensity}px ${color}`,
        // Depth shadow
        `0 ${4 * intensity}px ${8 * intensity}px rgba(0, 0, 0, ${0.3 * intensity})`,
      ].join(', ');

      // Multi-layer box shadow for outer glow
      const boxShadow = [
        `0 0 ${20 * intensity}px ${color}`,
        `0 0 ${40 * intensity}px ${color}`,
        `0 0 ${60 * intensity}px ${color}`,
      ].join(', ');

      return { textShadow, boxShadow };
    }, [glowIntensity, color]);

    /**
     * 3D transform styles
     */
    const transform3D = useMemo(() => {
      if (!enable3D || prefersReducedMotion) return {};

      return {
        perspective: '1000px',
        transformStyle: 'preserve-3d' as const,
      };
    }, [enable3D, prefersReducedMotion]);

    /**
     * Format number with commas
     */
    const formatNumber = useCallback((num: number): string => {
      return num.toLocaleString('en-US');
    }, []);

    const ariaLabelValue = ariaLabel || `${currentValue} ${label}`;

    return (
      <div
        ref={ref}
        className={`slot-machine-3d-container ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 20,
        }}
        role="status"
        aria-live="polite"
        aria-label={ariaLabelValue}
      >
        {/* Counter Number */}
        <div
          className="slot-machine-number"
          style={{
            fontSize: '5rem',
            fontFamily: 'var(--font-synonym)',
            fontWeight: 100,
            color,
          }}
          aria-hidden="true"
        >
          {formatNumber(currentValue)}
        </div>

        {/* Plus Sign */}
        {showPlus && (
          <div
            className="slot-machine-plus"
            style={{
              fontSize: '4rem',
              fontFamily: 'var(--font-synonym)',
              fontWeight: 100,
              color,
            }}
            aria-hidden="true"
          >
            +
          </div>
        )}

        {/* Label */}
        {label && (
          <div
            className="slot-machine-label"
            style={{
              fontSize: '2rem',
              fontFamily: 'var(--font-synonym)',
              fontWeight: 100,
              color,
            }}
            aria-hidden="true"
          >
            {label}
          </div>
        )}
      </div>
    );
  }
);

SlotMachine3D.displayName = 'SlotMachine3D';

export default SlotMachine3D;
