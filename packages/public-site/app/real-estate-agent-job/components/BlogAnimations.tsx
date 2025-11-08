'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

export interface StaggerAnimationProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Wrapper component for staggered fade-in animations
 * Uses Intersection Observer for performance
 */
export function StaggerAnimation({
  children,
  delay = 0,
  className = ''
}: StaggerAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect after animation triggers (performance optimization)
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}
      `}
      style={{
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

export interface BlogCardGridProps {
  children: ReactNode[];
  staggerDelay?: number;
}

/**
 * Grid wrapper that staggers children animations
 */
export function BlogCardGrid({
  children,
  staggerDelay = 100
}: BlogCardGridProps) {
  return (
    <>
      {children.map((child, index) => (
        <StaggerAnimation
          key={index}
          delay={index * staggerDelay}
        >
          {child}
        </StaggerAnimation>
      ))}
    </>
  );
}

export interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}

/**
 * Single fade-in animation component with directional control
 */
export function FadeInSection({
  children,
  className = '',
  direction = 'up',
  duration = 700
}: FadeInSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';

    switch (direction) {
      case 'up':
        return 'translateY(32px)';
      case 'down':
        return 'translateY(-32px)';
      case 'left':
        return 'translateX(32px)';
      case 'right':
        return 'translateX(-32px)';
      default:
        return 'translateY(32px)';
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

export interface ScaleOnHoverProps {
  children: ReactNode;
  className?: string;
  scale?: number;
}

/**
 * Hover scale animation component with GPU acceleration
 */
export function ScaleOnHover({
  children,
  className = '',
  scale = 1.02
}: ScaleOnHoverProps) {
  return (
    <div
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        willChange: 'transform',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${scale})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </div>
  );
}

export interface GlowOnHoverProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

/**
 * Adds a glow effect on hover with smooth transitions
 */
export function GlowOnHover({
  children,
  className = '',
  glowColor = '#00ff88'
}: GlowOnHoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ${className}`}
      style={{
        boxShadow: isHovered
          ? `0 0 20px ${glowColor}40, 0 0 40px ${glowColor}20`
          : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}

export interface PulseProps {
  children: ReactNode;
  className?: string;
  color?: string;
  duration?: number;
}

/**
 * Subtle pulse animation for attention-grabbing elements
 */
export function Pulse({
  children,
  className = '',
  color = '#00ff88',
  duration = 2000
}: PulseProps) {
  return (
    <div
      className={`animate-pulse-subtle ${className}`}
      style={{
        animation: `pulse-glow ${duration}ms ease-in-out infinite`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 ${color}00;
          }
          50% {
            box-shadow: 0 0 20px 4px ${color}40;
          }
        }
      `}</style>
    </div>
  );
}
