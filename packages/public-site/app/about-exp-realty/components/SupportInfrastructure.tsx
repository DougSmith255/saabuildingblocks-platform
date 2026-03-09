'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { H2 } from '@saa/shared/components/saa/headings';
import { GrainCard } from '@saa/shared/components/saa/cards';
import { Sparkles, GraduationCap, Handshake, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useScrambleCounter } from './hooks';

const HolographicGlobe = dynamic(() => import('../../../components/shared/HolographicGlobe').then(m => ({ default: m.HolographicGlobe })), { ssr: false });

const BLUE_3D_SHADOW = '-1px -1px 0 #80d4ff, 1px 1px 0 #3d8a9d, 2px 2px 0 #2d6a7d, 3px 3px 0 #1d4a5d, 4px 4px 0 #1d2a3d, 5px 5px 4px rgba(0,0,0,0.5)';

const SUPPORT_INFRASTRUCTURE_STATS = [
  { prefix: '', targetNumber: 2000, suffix: '+', label: 'Staff' },
  { prefix: '', targetNumber: 24, suffix: '/7', label: 'Help Desk' },
  { prefix: '', targetNumber: 50, suffix: '+', label: 'Trainings' },
];

const SUPPORT_INFRASTRUCTURE_BULLETS: { icon: LucideIcon; text: string }[] = [
  { icon: Sparkles, text: 'AI-assisted support through Mira' },
  { icon: GraduationCap, text: 'Live onboarding that gets agents operational quickly' },
  { icon: Handshake, text: 'Structured mentor program for newer agents through first transactions' },
  { icon: Building2, text: 'Access to Regus business lounges worldwide' },
];

const transparentCardStyle: React.CSSProperties = {
  background: 'rgba(8, 20, 40, 0.85)',
  border: '1px solid rgba(0, 191, 255, 0.15)',
  borderRadius: '16px',
  padding: '24px',
};

function AnimatedStat({
  prefix = '',
  targetNumber,
  suffix = '',
  label,
}: {
  prefix?: string;
  targetNumber: number;
  suffix?: string;
  label: string;
}) {
  const { displayValue, elementRef, hasAnimated } = useScrambleCounter(targetNumber, 2000);

  return (
    <GrainCard padding="md" centered>
      <div className="flex items-center justify-center gap-3 mb-2">
        <p
          className="text-4xl lg:text-5xl font-bold tabular-nums"
          style={{
            color: '#00bfff',
            textShadow: '-1px -1px 0 #80d4ff, 1px 1px 0 #3d8a9d, 2px 2px 0 #2d6a7d, 3px 3px 0 #1d4a5d, 4px 4px 0 #1d2a3d, 5px 5px 4px rgba(0,0,0,0.5)',
            display: 'inline-block',
          }}
        >
          <span>{prefix}</span>
          <span ref={elementRef}>
            {hasAnimated ? targetNumber.toLocaleString() : displayValue.toLocaleString()}
          </span>
          <span>{suffix}</span>
        </p>
      </div>
      <p className="text-sm uppercase tracking-wider" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
        {label}
      </p>
    </GrainCard>
  );
}

function RotatingSupportTechStats() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValues, setDisplayValues] = useState<number[]>(SUPPORT_INFRASTRUCTURE_STATS.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState<boolean[]>(SUPPORT_INFRASTRUCTURE_STATS.map(() => false));
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const animateCurrentStat = useCallback((index: number) => {
    if (hasAnimated[index]) return;

    const targetNumber = SUPPORT_INFRASTRUCTURE_STATS[index].targetNumber;
    const duration = 1500;
    const startTime = performance.now();

    const runAnimation = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        setDisplayValues(prev => {
          const newValues = [...prev];
          newValues[index] = targetNumber;
          return newValues;
        });
        setHasAnimated(prev => {
          const newAnimated = [...prev];
          newAnimated[index] = true;
          return newAnimated;
        });
        animationRef.current = null;
      } else {
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(targetNumber * easedProgress);
        const scrambleIntensity = 1 - progress;

        let displayVal = currentValue;
        if (Math.random() < scrambleIntensity * 0.4 && progress < 0.8) {
          const variance = Math.floor(targetNumber * 0.1 * scrambleIntensity);
          displayVal = Math.max(0, currentValue + Math.floor(Math.random() * variance * 2) - variance);
        }

        setDisplayValues(prev => {
          const newValues = [...prev];
          newValues[index] = displayVal;
          return newValues;
        });

        animationRef.current = requestAnimationFrame(runAnimation);
      }
    };

    animationRef.current = requestAnimationFrame(runAnimation);
  }, [hasAnimated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % SUPPORT_INFRASTRUCTURE_STATS.length;
          if (!hasAnimated[next]) {
            setTimeout(() => animateCurrentStat(next), 100);
          }
          return next;
        });
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [hasAnimated, animateCurrentStat]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated[0]) {
          animateCurrentStat(0);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateCurrentStat, hasAnimated]);

  const currentStat = SUPPORT_INFRASTRUCTURE_STATS[currentIndex];
  const displayValue = hasAnimated[currentIndex]
    ? currentStat.targetNumber.toLocaleString()
    : displayValues[currentIndex].toLocaleString();

  return (
    <div
      ref={containerRef}
      className="text-center p-6 rounded-xl relative overflow-hidden"
      style={{
        background: 'rgba(20,20,20,0.75)',
        border: '1px solid rgba(255,255,255,0.1)',
        minHeight: '120px',
      }}
    >
      <div
        className={`transition-all duration-300 ease-in-out ${
          isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <p
          className="text-4xl font-bold mb-2 tabular-nums"
          style={{
            color: '#00bfff',
            textShadow: BLUE_3D_SHADOW,
            display: 'inline-block',
          }}
        >
          {currentStat.prefix}{displayValue}{currentStat.suffix}
        </p>
        <p className="text-sm uppercase tracking-wider" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
          {currentStat.label}
        </p>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {SUPPORT_INFRASTRUCTURE_STATS.map((_, idx) => (
          <div
            key={idx}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: idx === currentIndex ? '#00bfff' : 'rgba(255,255,255,0.3)',
              transform: idx === currentIndex ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SupportInfrastructureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [globeVisible, setGlobeVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setGlobeVisible(entry.isIntersecting),
      { rootMargin: '200px' }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="support" ref={sectionRef} className="relative px-4 sm:px-8 md:px-12 overflow-hidden" style={{ margin: '-100px 0', paddingTop: '100px', paddingBottom: '100px' }}>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.4, zIndex: 0, contain: 'layout style paint' }}
      >
        <HolographicGlobe isVisible={globeVisible} />
      </div>

      <div className="relative max-w-[1400px] mx-auto" style={{ zIndex: 1 }}>

        <div className="text-center mb-8">
          <H2>Support & Training</H2>
        </div>

        <div className="hidden md:grid grid-cols-3 gap-4 mb-10 max-w-[800px] mx-auto">
          {SUPPORT_INFRASTRUCTURE_STATS.map((stat, i) => (
            <div key={i}>
              <AnimatedStat {...stat} />
            </div>
          ))}
        </div>

        <div className="md:hidden mb-8">
          <RotatingSupportTechStats />
        </div>

        <div className="max-w-[900px] mx-auto">
          <div
            className="relative overflow-hidden"
            style={{
              ...transparentCardStyle,
              boxShadow: '0 0 40px rgba(0,191,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,191,255,0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,191,255,0.5) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />
            <ul className="space-y-4 relative">
              {SUPPORT_INFRASTRUCTURE_BULLETS.map((bullet) => (
                <li
                  key={bullet.text}
                  className="text-body text-sm leading-relaxed flex items-start gap-4 group"
                  style={{ color: 'var(--color-body-text)' }}
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-[-2px]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,191,255,0.15), rgba(0,120,200,0.08))',
                      border: '1px solid rgba(0,191,255,0.2)',
                      boxShadow: '0 0 12px rgba(0,191,255,0.15)',
                    }}
                  >
                    <bullet.icon size={16} style={{ color: '#00bfff' }} />
                  </span>
                  <span className="pt-1">{bullet.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          <a href="/about-exp-realty/support" className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-90" style={{ color: 'var(--color-body-text, #dcdbd5)', textDecoration: 'none', fontSize: '14px', opacity: 0.7 }}>Learn more about support &amp; training →</a>
        </div>
      </div>
    </section>
  );
}
