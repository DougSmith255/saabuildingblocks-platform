'use client';

import { useEffect, useRef, useState } from 'react';
import { H2, Icon3D } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';
import { CyberCardGold } from '@saa/shared/components/saa/cards';
import { Globe, Users, TrendingUp, Check } from 'lucide-react';

/**
 * Proven at Scale Section
 * Shows SAA's scale and credibility with animated counter and wolf pack background
 */

const BRAND_YELLOW = '#ffd700';
const WOLF_PACK_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop';

const HEADLINE = "Proven at Scale";
const STATS = [
  { value: "3,700+", label: "Agents supported globally", icon: Users },
  { value: "#1", label: "Fastest-growing sponsor org at eXp", icon: TrendingUp },
  { value: "Strong", label: "Consistently high agent retention", icon: Check },
  { value: "Global", label: "U.S., Canada, Mexico, Australia & beyond", icon: Globe },
];
const CTA_TEXT = "See What Agents Say";

// Scroll reveal hook
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function RevealFromLeft({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function RevealFromRight({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Scramble counter animation - matches hero counter style, loops every 5 seconds
function ScrambleCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [digits, setDigits] = useState(['3', '7', '0', '0']);
  const { ref, isVisible } = useScrollReveal(0.1);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds scramble
    const loopInterval = 5000; // Loop every 5 seconds

    const animateScramble = () => {
      const startTime = performance.now();

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress >= 1) {
          // End animation - show final value
          setDigits(['3', '7', '0', '0']);
          animationRef.current = null;
        } else {
          // Scramble effect - show random numbers that gradually approach target
          const currentValue = Math.floor(target * progress);
          const scrambleIntensity = 1 - progress;

          const targetDigits = currentValue.toString().padStart(4, '0').split('');
          const scrambled = targetDigits.map((digit, index) => {
            if (Math.random() < scrambleIntensity * 0.3) {
              // First digit stays 3 to keep 3xxx range
              if (index === 0) return '3';
              return (Math.floor(Math.random() * 8) + 2).toString(); // 2-9
            }
            return digit;
          });

          setDigits(scrambled);
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start first animation after a small delay
    const initTimeout = setTimeout(() => {
      animateScramble();
    }, 200);

    // Loop animation every 5 seconds
    const intervalId = setInterval(() => {
      animateScramble();
    }, loopInterval);

    return () => {
      clearTimeout(initTimeout);
      clearInterval(intervalId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, target]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {digits.map((digit, i) => (
        <span key={i} style={{ display: 'inline-block', width: '0.6em', textAlign: 'center' }}>
          {digit}
        </span>
      ))}
      {suffix}
    </span>
  );
}

export function ProvenAtScale() {
  return (
    <section className="py-16 md:py-24 px-6 relative overflow-hidden">
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-20 z-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #080808 0%, transparent 100%)' }} />
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #080808 0%, transparent 100%)' }} />
      {/* Wolf Pack Background Image with Ellipse Fade */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={WOLF_PACK_IMAGE}
          srcSet="
            https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/mobile 640w,
            https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/tablet 1024w,
            https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop 2000w
          "
          sizes="100vw"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{
            objectPosition: 'center 55%',
            maskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
          }}
        />
      </div>

      <div className="mx-auto relative z-10" style={{ maxWidth: '1300px' }}>
        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Left - Content (8 columns) */}
          <div className="md:col-span-8">
            <RevealFromLeft>
              <H2 className="text-center md:text-left" style={{ justifyContent: 'flex-start' }}>{HEADLINE}</H2>
            </RevealFromLeft>

            <div className="space-y-4 mb-8">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <RevealFromLeft key={i} delay={0.1 + i * 0.1}>
                    <div className="flex items-center gap-4">
                      <Icon3D><Icon className="w-6 h-6 flex-shrink-0" /></Icon3D>
                      <p className="text-body">
                        <span className="font-heading font-bold" style={{ color: BRAND_YELLOW }}>
                          {stat.value}
                        </span>
                        {' — '}{stat.label}
                      </p>
                    </div>
                  </RevealFromLeft>
                );
              })}
            </div>

            <RevealFromLeft delay={0.5}>
              <div className="text-center md:text-left">
                <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
              </div>
            </RevealFromLeft>
          </div>

          {/* Right - Featured Cyber Card (4 columns) */}
          <div className="md:col-span-4">
            <RevealFromRight delay={0.2}>
              <CyberCardGold padding="lg">
                <Icon3D><Globe className="w-14 h-14 mx-auto mb-3" /></Icon3D>
                <p className="font-heading text-3xl md:text-4xl font-bold" style={{ color: BRAND_YELLOW }}>
                  <ScrambleCounter target={3700} suffix="+" />
                </p>
                <p className="text-body text-base mt-2">Agents Strong</p>
              </CyberCardGold>
            </RevealFromRight>
          </div>
        </div>
      </div>
    </section>
  );
}
