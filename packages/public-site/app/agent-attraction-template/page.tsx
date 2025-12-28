'use client';

/**
 * Agent Attraction Template Page
 *
 * This is a self-contained version of the homepage designed for agent attraction pages.
 * All components are inlined to allow easy customization for individual agents.
 *
 * TO CUSTOMIZE FOR AGENT PAGES:
 * 1. Replace hero image with agent's profile image
 * 2. Replace H1 with agent's name
 * 3. Customize tagline and rotating text
 * 4. Update CTA button to link to agent's join form
 * 5. Add agent-specific data from KV/Supabase
 */

import React, { useEffect, useRef, useState, useMemo, ReactNode, createContext, useContext } from 'react';
import Link from 'next/link';
import { Globe, Users, TrendingUp, Check, DollarSign, Bot, GraduationCap } from 'lucide-react';

// =============================================================================
// BRAND CONSTANTS
// =============================================================================
const BRAND_YELLOW = '#ffd700';
const CLOUDFLARE_BASE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg';

// =============================================================================
// UTILITY: Extract Plain Text from React Children
// =============================================================================
function extractPlainText(children: React.ReactNode): string {
  if (children == null || typeof children === 'boolean') return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractPlainText).join('');
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    return extractPlainText(props.children);
  }
  return String(children);
}

// =============================================================================
// CONTEXT: Viewport Provider (for responsive counter)
// =============================================================================
const COUNTER_BREAKPOINT = 1500;

interface ViewportContextType {
  isCounterDesktop: boolean;
  hasMounted: boolean;
}

const ViewportContext = createContext<ViewportContextType>({
  isCounterDesktop: true,
  hasMounted: false,
});

function ViewportProvider({ children }: { children: ReactNode }) {
  const [isCounterDesktop, setIsCounterDesktop] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsCounterDesktop(window.innerWidth >= COUNTER_BREAKPOINT);
    };
    checkViewport();
    setHasMounted(true);
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return (
    <ViewportContext.Provider value={{ isCounterDesktop, hasMounted }}>
      {children}
    </ViewportContext.Provider>
  );
}

function useViewport() {
  return useContext(ViewportContext);
}

// =============================================================================
// SHARED COMPONENT: H1 (Neon Sign Effect)
// =============================================================================
interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  noAnimation?: boolean;
}

function H1({ children, className = '', style = {}, id, noAnimation = false }: HeadingProps) {
  const plainText = extractPlainText(children);
  return (
    <>
      <h1
        id={id}
        className={`text-h1 text-display ${className}`}
        style={{
          color: '#ffd700',
          transform: 'perspective(800px) rotateX(12deg)',
          fontFeatureSettings: '"ss01" 1',
          textShadow: `
            0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8),
            0 0 0.05em #ffd700, 0 0 0.09em rgba(255, 215, 0, 0.8),
            0 0 0.13em rgba(255, 215, 0, 0.55), 0 0 0.18em rgba(255, 179, 71, 0.35),
            0.03em 0.03em 0 #2a2a2a, 0.045em 0.045em 0 #1a1a1a,
            0.06em 0.06em 0 #0f0f0f, 0.075em 0.075em 0 #080808
          `,
          filter: 'drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25))',
          animation: noAnimation ? 'none' : 'h1GlowBreathe 4s ease-in-out infinite',
          ...style,
        }}
      >
        {plainText}
      </h1>
      {!noAnimation && (
        <style>{`
          @keyframes h1GlowBreathe {
            0%, 100% { filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25)); }
            50% { filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(255, 215, 0, 0.45)); }
          }
        `}</style>
      )}
    </>
  );
}

// =============================================================================
// SHARED COMPONENT: H2 (Metal Backing Effect)
// =============================================================================
function H2({ children, className = '', style = {} }: HeadingProps) {
  const text = React.Children.toArray(children).join('');
  const words = text.split(' ');
  const textShadow = `0 0 1px #fff, 0 0 2px #fff, 0 0 4px rgba(255,255,255,0.8), 0 0 8px rgba(255,255,255,0.4)`;

  return (
    <>
      <style>{`
        .h2-word::before {
          content: ""; position: absolute; top: -0.25em; left: -0.3em; right: -0.3em; bottom: -0.25em;
          background: linear-gradient(180deg, #3d3d3d 0%, #2f2f2f 40%, #252525 100%);
          border-radius: 0.15em; z-index: -1;
          border-top: 2px solid rgba(180,180,180,0.45); border-left: 1px solid rgba(130,130,130,0.35);
          border-right: 1px solid rgba(60,60,60,0.6); border-bottom: 2px solid rgba(0,0,0,0.7);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 2px rgba(0,0,0,0.25),
            0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3);
        }
        .h2-word::after {
          content: ""; position: absolute; top: -0.25em; left: -0.3em; right: -0.3em; height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, transparent 100%);
          border-radius: 0.15em 0.15em 0 0; z-index: -1; pointer-events: none;
        }
      `}</style>
      <h2
        className={`text-h2 ${className}`}
        style={{
          display: 'flex', justifyContent: 'center', gap: '0.5em', flexWrap: 'wrap',
          position: 'relative', paddingLeft: '0.35em', paddingRight: '0.35em',
          fontFeatureSettings: '"ss01" 1', maxWidth: '1400px',
          marginLeft: 'auto', marginRight: 'auto', marginBottom: '2.5rem', ...style
        }}
      >
        {words.map((word, i) => (
          <React.Fragment key={i}>
            {i > 0 && ' '}
            <span className="h2-word" style={{ display: 'inline-block', position: 'relative', color: '#bfbdb0', textShadow }}>
              {word}
            </span>
          </React.Fragment>
        ))}
      </h2>
    </>
  );
}

// =============================================================================
// SHARED COMPONENT: Tagline
// =============================================================================
interface TaglineProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  counterSuffix?: React.ReactNode;
}

function Tagline({ children, className = '', style = {}, counterSuffix }: TaglineProps) {
  const textShadow = `0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8)`;
  const filter = `drop-shadow(0 0 0.04em #bfbdb0) drop-shadow(0 0 0.08em rgba(191,189,176,0.6))`;
  return (
    <p
      className={`text-tagline ${className}`}
      style={{
        textAlign: 'center', transform: 'rotateX(15deg)', position: 'relative',
        color: '#bfbdb0', fontFeatureSettings: '"ss01" 1', textShadow, filter: filter.trim(), ...style
      }}
    >
      {children} {counterSuffix}
    </p>
  );
}

// =============================================================================
// SHARED COMPONENT: Icon3D
// =============================================================================
interface Icon3DProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

function Icon3D({ children, color = '#c4a94d', size, className = '', style = {} }: Icon3DProps) {
  const filter = `drop-shadow(-1px -1px 0 #ffe680) drop-shadow(1px 1px 0 #8a7a3d) drop-shadow(3px 3px 0 #2a2a1d) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5))`;
  return (
    <span
      className={`icon-3d ${className}`}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color, filter: filter.trim(), transform: 'perspective(500px) rotateX(8deg)',
        ...(size && { width: size, height: size }), ...style,
      }}
    >
      {children}
    </span>
  );
}

// =============================================================================
// SHARED COMPONENT: CTAButton
// =============================================================================
interface CTAButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function isInternalLink(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

function CTAButton({ href = '#', children, className = '', onClick }: CTAButtonProps) {
  const useNextLink = useMemo(() => isInternalLink(href), [href]);
  const isFullWidth = className.includes('w-full');
  const [lightPulseDelay, setLightPulseDelay] = useState('0s');

  useEffect(() => {
    const randomDelay = Math.random() * 1.5;
    setLightPulseDelay(`${randomDelay.toFixed(2)}s`);
  }, []);

  const buttonStyles = {
    color: 'var(--text-color-button, var(--color-headingText))',
    fontSize: 'var(--font-size-button, 20px)',
    fontFamily: 'var(--font-family-button, var(--font-taskor), Taskor, system-ui, sans-serif)',
    fontWeight: 'var(--font-weight-button, 600)' as any,
    textTransform: 'var(--text-transform-button, uppercase)' as any,
    letterSpacing: 'var(--letter-spacing-button, 0.05em)',
    lineHeight: 'var(--line-height-button, 1.4)'
  };

  const buttonClasses = `
    relative flex justify-center items-center ${isFullWidth ? 'w-full' : ''}
    px-5 py-2 bg-[rgb(45,45,45)] rounded-xl border-t border-b border-white/10
    uppercase tracking-wide z-10 transition-all duration-500 overflow-hidden
    before:content-[''] before:absolute before:inset-0
    before:bg-gradient-to-l before:from-white/15 before:to-transparent
    before:w-1/2 before:skew-x-[45deg]
  `;

  const buttonInlineStyles = {
    ...buttonStyles,
    height: 'clamp(45px, calc(43.182px + 0.7273vw), 65px)',
    minWidth: '180px',
    whiteSpace: 'nowrap' as const,
    boxShadow: '0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)'
  };

  return (
    <div className={`relative py-2 ${className}`}>
      <div className={`group relative ${isFullWidth ? 'w-full' : 'inline-block'}`}>
        {useNextLink ? (
          <Link href={href} onClick={onClick} className={buttonClasses} style={buttonInlineStyles}>{children}</Link>
        ) : (
          <a href={href} onClick={onClick} className={buttonClasses} style={buttonInlineStyles}>{children}</a>
        )}
        <div
          className="cta-light-bar cta-light-bar-pulse w-[30px] h-[10px] rounded-md transition-all duration-500 group-hover:w-4/5"
          style={{ position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)', background: BRAND_YELLOW, animationDelay: lightPulseDelay, zIndex: 5 }}
        />
        <div
          className="cta-light-bar cta-light-bar-pulse w-[30px] h-[10px] rounded-md transition-all duration-500 group-hover:w-4/5"
          style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', background: BRAND_YELLOW, animationDelay: lightPulseDelay, zIndex: 5 }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// SHARED COMPONENT: CyberCardGold
// =============================================================================
interface CyberCardGoldProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
}

const paddingClasses = { sm: 'p-4', md: 'p-6', lg: 'p-8', xl: 'p-10' };

function CyberCardGold({ children, className = '', padding = 'md', centered = true }: CyberCardGoldProps) {
  const paddingClass = paddingClasses[padding];
  const centerClass = centered ? 'text-center' : '';
  return (
    <>
      <style>{`
        .cyber-card-gold-3d { perspective: 1000px; display: block; }
        .cyber-card-gold-frame {
          position: relative; transform-style: preserve-3d; transform: translateZ(0);
          border: 10px solid #ffd700; border-radius: 16px; background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 4px 1px rgba(255, 215, 0, 0.5), 0 0 8px 2px rgba(255, 215, 0, 0.35),
            0 0 16px 4px rgba(255, 215, 0, 0.2), 0 0 24px 6px rgba(255, 215, 0, 0.1), 0 4px 12px rgba(0,0,0,0.3);
          overflow: visible;
        }
        @keyframes cyberCardGoldOrganicPulse { 0% { opacity: 0.55; } 13% { opacity: 0.95; } 28% { opacity: 0.6; } 41% { opacity: 0.85; } 54% { opacity: 0.5; } 67% { opacity: 1; } 83% { opacity: 0.7; } 100% { opacity: 0.55; } }
        .cyber-card-gold-frame::after {
          content: ""; position: absolute; top: -12px; left: -12px; right: -12px; bottom: -12px;
          border-radius: 18px; border: 2px solid rgba(255,255,255,0.4);
          box-shadow: 0 0 6px 2px rgba(255, 215, 0, 0.6), 0 0 12px 4px rgba(255, 215, 0, 0.4),
            0 0 20px 6px rgba(255, 215, 0, 0.25), 0 0 32px 10px rgba(255, 215, 0, 0.12), 0 6px 16px rgba(0,0,0,0.35);
          pointer-events: none; z-index: -1; animation: cyberCardGoldOrganicPulse 2.4s linear infinite; will-change: opacity;
        }
        .cyber-card-gold-frame::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 6px; border: 2px solid rgba(255,255,255,0.5); pointer-events: none; z-index: 1;
        }
        .cyber-card-gold-content { position: relative; z-index: 2; transform-style: preserve-3d; transform: translateZ(0); }
      `}</style>
      <div className={`cyber-card-gold-3d ${className}`}>
        <div className="cyber-card-gold-frame">
          <div className={`cyber-card-gold-content ${paddingClass} ${centerClass}`}>{children}</div>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// HELPER COMPONENT: RotatingText
// =============================================================================
interface RotatingTextProps {
  texts: string[];
  interval?: number;
  className?: string;
  minHeight?: string;
}

function RotatingText({ texts, interval = 4000, className = '', minHeight }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationState, setAnimationState] = useState<'visible' | 'exiting' | 'entering'>('visible');
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measureHeights = () => {
      if (measureRef.current) {
        let tallest = 0;
        texts.forEach((text) => {
          measureRef.current!.textContent = text;
          const height = measureRef.current!.offsetHeight;
          if (height > tallest) tallest = height;
        });
        measureRef.current!.textContent = texts[currentIndex];
        setMaxHeight(tallest);
      }
    };
    measureHeights();
    window.addEventListener('resize', measureHeights);
    return () => window.removeEventListener('resize', measureHeights);
  }, [texts, currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationState('exiting');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setAnimationState('entering');
        setTimeout(() => setAnimationState('visible'), 300);
      }, 300);
    }, interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);

  const getStyles = (): React.CSSProperties => {
    switch (animationState) {
      case 'exiting': return { opacity: 0, transform: 'translateY(-10px)' };
      case 'entering': return { opacity: 0, transform: 'translateY(10px)', transition: 'none' };
      default: return { opacity: 1, transform: 'translateY(0)' };
    }
  };

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', minHeight: minHeight || (maxHeight ? `${maxHeight}px` : undefined) }}>
      <div ref={measureRef} aria-hidden="true" style={{ position: 'absolute', visibility: 'hidden', top: 0, left: 0, right: 0, whiteSpace: 'normal' }}>
        {texts[currentIndex]}
      </div>
      <div style={{ transition: 'opacity 300ms ease-out, transform 300ms ease-out', ...getStyles() }}>
        {texts[currentIndex]}
      </div>
    </div>
  );
}

// =============================================================================
// HELPER COMPONENT: FixedHeroWrapper
// =============================================================================
function FixedHeroWrapper({ children, className = '' }: { children: ReactNode; className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lockedHeightRef = useRef<number>(0);

  useEffect(() => {
    if (lockedHeightRef.current === 0) lockedHeightRef.current = window.innerHeight;

    const handleScroll = () => {
      if (!wrapperRef.current) return;
      const heroSection = wrapperRef.current.querySelector('section');
      if (!heroSection) return;

      const viewportHeight = lockedHeightRef.current;
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / viewportHeight, 1);

      const scale = 1 - progress * 0.4;
      const blur = progress * 8;
      const brightness = 1 - progress;
      const opacity = 1 - progress;
      const translateY = -progress * 50;

      const contentWrapper = heroSection.querySelector('.hero-content-wrapper') as HTMLElement;
      if (contentWrapper) {
        contentWrapper.style.transformOrigin = 'center center';
        contentWrapper.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        contentWrapper.style.filter = `blur(${blur}px) brightness(${brightness})`;
        contentWrapper.style.opacity = `${opacity}`;
      }

      const heroEffects = heroSection.querySelectorAll('.hero-effect-layer') as NodeListOf<HTMLElement>;
      heroEffects.forEach(el => {
        el.style.opacity = `${opacity}`;
        el.style.visibility = progress >= 1 ? 'hidden' : 'visible';
      });

      const agentCounter = heroSection.querySelector('.agent-counter-wrapper') as HTMLElement;
      if (agentCounter) {
        agentCounter.style.opacity = `${opacity}`;
        agentCounter.style.filter = `blur(${blur}px) brightness(${brightness})`;
      }

      (heroSection as HTMLElement).style.visibility = progress >= 1 ? 'hidden' : 'visible';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div ref={wrapperRef} className={`fixed top-0 left-0 right-0 z-0 pointer-events-none ${className}`}>
        <div className="pointer-events-auto">{children}</div>
      </div>
      <div className="h-svh" aria-hidden="true" />
    </>
  );
}

// =============================================================================
// HELPER COMPONENT: RevealMaskEffect
// =============================================================================
const INITIAL_MASK_SIZE = 72;
const INITIAL_PROGRESS = 0.45;

function RevealMaskEffect() {
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastScrollY = useRef(0);
  const scrollBoostRef = useRef(0);

  useEffect(() => {
    const IDLE_SPEED = 0.000075;
    const SCROLL_BOOST_MAX = 0.0006;
    const SCROLL_BOOST_MULTIPLIER = 0.000024;
    const SCROLL_DECAY = 0.92;
    let lastTimestamp = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;
      if (scrollDelta > 0) {
        const boost = Math.min(scrollDelta * SCROLL_BOOST_MULTIPLIER, SCROLL_BOOST_MAX);
        scrollBoostRef.current = Math.max(scrollBoostRef.current, boost);
      }
    };

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;
      const currentSpeed = IDLE_SPEED + scrollBoostRef.current;
      timeRef.current += currentSpeed * deltaTime;
      scrollBoostRef.current *= SCROLL_DECAY;
      setTime(timeRef.current);
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

  const wave1 = Math.sin(time * Math.PI * 2);
  const wave2 = Math.sin(time * Math.PI * 1.3 + 0.5);
  const wave3 = Math.cos(time * Math.PI * 0.7);
  const combinedWave = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);
  const progress = time === 0 ? INITIAL_PROGRESS : (0.45 + combinedWave * 0.35);
  const maskSize = time === 0 ? INITIAL_MASK_SIZE : (90 - progress * 40);
  const rotation = time * 90;
  const centerY = '42%';

  return (
    <div className="reveal-mask-effect hero-effect-layer absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse ${maskSize}% ${maskSize * 0.7}% at 50% ${centerY},
          rgba(255,215,0,0.2) 0%, rgba(255,180,0,0.12) 35%, rgba(255,150,0,0.06) 55%, transparent 80%)`,
      }} />
      <div className="absolute w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] border-2 left-1/2"
        style={{ top: centerY, transform: `translate(-50%, -50%) rotate(${rotation}deg)`, borderRadius: `${20 + progress * 30}%`, borderColor: 'rgba(255,215,0,0.25)' }} />
      <div className="absolute w-[60vw] h-[60vw] max-w-[520px] max-h-[520px] border left-1/2"
        style={{ top: centerY, transform: `translate(-50%, -50%) rotate(${-rotation * 0.5}deg)`, borderRadius: `${Math.max(20, 50 - progress * 30)}%`, borderColor: 'rgba(255,215,0,0.18)' }} />
      <div className="hero-vignette" />
    </div>
  );
}

// =============================================================================
// HELPER COMPONENT: AgentCounter (Desktop)
// =============================================================================
function AgentCounter() {
  const { isCounterDesktop } = useViewport();
  const textShadow = `0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8)`;
  const filter = `drop-shadow(0 0 0.04em #bfbdb0) drop-shadow(0 0 0.08em rgba(191,189,176,0.6))`;

  if (isCounterDesktop) {
    return (
      <div className="agent-counter-wrapper absolute z-50 left-2 lg:left-auto lg:right-8" style={{ top: '130px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25em', fontSize: 'clamp(1.75rem, 2.625vw, 2.1875rem)' }}>
          <span className="counter-numbers-mobile" style={{ display: 'inline', color: '#bfbdb0', fontFamily: 'var(--font-synonym), monospace', fontWeight: 300, fontSize: 'calc(1em + 10px)', textShadow: 'none' }}>
            <span className="counter-digit">3</span><span className="counter-digit">7</span><span className="counter-digit">0</span><span className="counter-digit">0</span><span>+</span>
          </span>
          <span style={{ color: '#bfbdb0', fontFamily: 'var(--font-taskor), sans-serif', fontFeatureSettings: '"ss01" 1', textTransform: 'uppercase', letterSpacing: '0.05em', textShadow: textShadow.trim(), filter: filter.trim() }}>
            AGENTS
          </span>
        </span>
      </div>
    );
  }
  return null;
}

// =============================================================================
// HELPER COMPONENT: TaglineCounterSuffix (Mobile)
// =============================================================================
function TaglineCounterSuffix() {
  const { hasMounted, isCounterDesktop } = useViewport();
  const isVisible = hasMounted && !isCounterDesktop;

  return (
    <span className="tagline-counter-suffix" style={{ alignItems: 'baseline', gap: 0, opacity: isVisible ? 1 : 0, transition: 'opacity 0.2s ease-in' }}>
      <span className="counter-numbers-mobile" style={{ display: 'inline', color: '#bfbdb0', fontFamily: 'var(--font-synonym), monospace', fontWeight: 300, fontSize: '1em', textShadow: 'none' }}>
        <span>(</span><span className="counter-digit">3</span><span className="counter-digit">7</span><span className="counter-digit">0</span><span className="counter-digit">0</span><span>+ </span>
      </span>
      <span style={{ color: '#bfbdb0', fontFamily: 'var(--font-taskor), sans-serif', fontFeatureSettings: '"ss01" 1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        AGENTS)
      </span>
    </span>
  );
}

// =============================================================================
// HOOK: useScrollReveal
// =============================================================================
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// =============================================================================
// SECTION: MediaLogos
// =============================================================================
const logos = [
  { id: 'wsj-logo', alt: 'The Wall Street Journal' },
  { id: 'cnbc-logo', alt: 'CNBC' },
  { id: 'fox-business-logo', alt: 'Fox Business' },
  { id: 'bloomberg-logo', alt: 'Bloomberg' },
  { id: 'yahoo-finance-logo', alt: 'Yahoo Finance' },
  { id: 'forbes-logo', alt: 'Forbes' },
  { id: 'business-insider-logo', alt: 'Business Insider' },
  { id: 'market-watch-logo', alt: 'MarketWatch' },
  { id: 'reuters-logo', alt: 'Reuters' },
  { id: 'usa-today-logo', alt: 'USA Today' },
  { id: 'la-times-logo', alt: 'Los Angeles Times' },
  { id: 'washington-post-logo', alt: 'The Washington Post' },
  { id: 'nasdaq-logo', alt: 'Nasdaq' },
  { id: 'barrons-logo', alt: "Barron's" },
  { id: 'new-york-post-logo', alt: 'New York Post' },
];

function MediaLogos() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const velocityRef = useRef(0.5);
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } }); },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const singleSetWidth = track.scrollWidth / 2;

    const animate = () => {
      positionRef.current += velocityRef.current;
      if (velocityRef.current > 0.5) { velocityRef.current *= 0.98; if (velocityRef.current < 0.5) velocityRef.current = 0.5; }
      if (positionRef.current >= singleSetWidth) positionRef.current = 0;
      track.style.transform = `translateX(-${positionRef.current}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;
      const boost = Math.min(scrollDelta * 0.3, 8);
      if (boost > 0.5) velocityRef.current = Math.max(velocityRef.current, boost);
    };

    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); window.removeEventListener('scroll', handleScroll); };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at bottom left, #080808 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at bottom right, #080808 0%, transparent 70%)' }} />
      <div className="absolute inset-x-0 inset-y-0 pointer-events-none rounded-3xl overflow-hidden z-[1]" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.25) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.15)', borderBottom: '2px solid rgba(0,0,0,0.6)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 2px 4px rgba(255,255,255,0.05), inset 0 -2px 0 rgba(0,0,0,0.4), inset 0 -4px 8px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(2px)',
      }} />
      <div className={`text-center px-4 transition-all duration-700 ease-out relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <H2>eXp Realty in the News</H2>
        <p className={`text-body max-w-3xl mx-auto opacity-80 mb-8 transition-all duration-700 delay-150 ease-out ${isVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Smart Agent Alliance operates within eXp Realty, a publicly traded brokerage that has been featured in major national and global media outlets.
        </p>
      </div>
      <div className={`relative z-10 transition-all duration-700 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute left-0 w-48 md:w-72 z-10 pointer-events-none" style={{ top: '-20%', bottom: '-20%', background: '#0b0a0a', maskImage: 'linear-gradient(to right, black 0%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', maskComposite: 'intersect', WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', WebkitMaskComposite: 'source-in' as any }} />
        <div className="absolute right-0 w-48 md:w-72 z-10 pointer-events-none" style={{ top: '-20%', bottom: '-20%', background: '#0b0a0a', maskImage: 'linear-gradient(to left, black 0%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', maskComposite: 'intersect', WebkitMaskImage: 'linear-gradient(to left, black 0%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', WebkitMaskComposite: 'source-in' as any }} />
        <div ref={trackRef} className="flex items-center gap-8 md:gap-16 py-8" style={{ willChange: 'transform' }}>
          {[...logos, ...logos].map((logo, index) => (
            <div key={`${logo.id}-${index}`} className="flex-shrink-0 flex items-center justify-center" style={{ height: 'clamp(80px, 6vw, 56px)', minWidth: 'clamp(180px, 15vw, 200px)' }}>
              <img src={`${CLOUDFLARE_BASE}/${logo.id}/public`} alt={logo.alt} loading={index < 10 ? 'eager' : 'lazy'} className="h-full w-auto object-contain" style={{ maxWidth: 'clamp(200px, 18vw, 240px)', opacity: 0.9 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: WhySAA (Simplified - keeping core structure)
// =============================================================================
const WHY_SAA_HEADLINE = "Why Smart Agent Alliance?";
const WHY_SAA_INTRO = "Unlike most brokerages, eXp offers sponsor support. But most eXp sponsors still provide little or no ongoing value.";
const WHY_SAA_SUBHEAD = "SAA was built differently.";
const WHY_SAA_DESCRIPTION = "We invest in real systems, long-term training, and agent collaboration because our incentives are aligned with agent success.";
const WHY_SAA_BENEFITS = ["No production team structure", "No commission splits", "No required recruiting", "No required meetings"];

function WhySAA() {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <section className="py-24 md:py-32 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-20 z-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #080808 0%, transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-20 z-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #080808 0%, transparent 100%)' }} />
      <div ref={ref} className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div className="text-center" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.7s ease-out, transform 0.7s ease-out' }}>
          <H2>{WHY_SAA_HEADLINE}</H2>
        </div>
        <div className="grid md:grid-cols-12 gap-4 md:gap-6">
          <div className="md:col-span-7">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-black/60 to-black/40 border border-white/10 p-8 md:p-10 h-full" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-40px)', transition: 'opacity 0.7s ease-out, transform 0.7s ease-out' }}>
              <div className="mb-8">
                <span className="text-body text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-red-500/20 text-red-400">The Problem</span>
                <p className="text-body text-lg mt-3 opacity-70">{WHY_SAA_INTRO}</p>
              </div>
              <div className="mb-8">
                <span className="text-body text-xs uppercase tracking-wider px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)', color: BRAND_YELLOW }}>Our Solution</span>
                <p className="font-heading text-2xl md:text-3xl font-bold mt-3" style={{ color: BRAND_YELLOW }}>{WHY_SAA_SUBHEAD}</p>
                <p className="text-body text-lg mt-4 leading-relaxed">{WHY_SAA_DESCRIPTION}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WHY_SAA_BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Icon3D><Check className="w-6 h-6" strokeWidth={3} /></Icon3D>
                    <span className="text-body text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
            <div className="flex-1 flex" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(40px)', transition: 'opacity 0.7s ease-out, transform 0.7s ease-out' }}>
              <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-1">
                <div className="absolute inset-0 overflow-hidden">
                  <img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-aligned-incentives-value-multiplication/public" alt="Smart Agent Alliance aligned incentives model" className="w-full h-full object-cover object-center" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-heading font-bold" style={{ color: BRAND_YELLOW, fontSize: '23px' }}>Aligned Incentives</p>
                  <p className="text-body text-xs opacity-70 mt-1">When you succeed, we succeed</p>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border p-6 md:p-8 text-center" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)', opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(0.95)', transition: 'opacity 0.7s ease-out 0.1s, transform 0.7s ease-out 0.1s' }}>
              <p className="text-body text-lg mb-5">Ready to see the difference?</p>
              <CTAButton href="/exp-realty-sponsor">See How It Works</CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: ProvenAtScale
// =============================================================================
const PROVEN_STATS = [
  { value: "3,700+", label: "Agents supported globally", icon: Users },
  { value: "#1", label: "Fastest-growing sponsor org at eXp", icon: TrendingUp },
  { value: "Strong", label: "Consistently high agent retention", icon: Check },
  { value: "Global", label: "U.S., Canada, Mexico, Australia & beyond", icon: Globe },
];

function ProvenAtScale() {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <section className="py-16 md:py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-20 z-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #080808 0%, transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-20 z-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #080808 0%, transparent 100%)' }} />
      <div ref={ref} className="mx-auto relative z-10" style={{ maxWidth: '1300px' }}>
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-40px)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}>
              <H2 className="text-center md:text-left" style={{ justifyContent: 'flex-start' }}>Proven at Scale</H2>
            </div>
            <div className="space-y-4 mb-8">
              {PROVEN_STATS.map((stat, i) => {
                const StatIcon = stat.icon;
                return (
                  <div key={i} className="flex items-center gap-4" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-40px)', transition: `opacity 0.8s ease-out ${0.1 + i * 0.1}s, transform 0.8s ease-out ${0.1 + i * 0.1}s` }}>
                    <Icon3D><StatIcon className="w-6 h-6 flex-shrink-0" /></Icon3D>
                    <p className="text-body"><span className="font-heading font-bold" style={{ color: BRAND_YELLOW }}>{stat.value}</span>{' — '}{stat.label}</p>
                  </div>
                );
              })}
            </div>
            <div className="text-center md:text-left" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-40px)', transition: 'opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s' }}>
              <CTAButton href="/exp-realty-sponsor">See What Agents Say</CTAButton>
            </div>
          </div>
          <div className="md:col-span-4" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(40px)', transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s' }}>
            <CyberCardGold padding="lg">
              <Icon3D><Globe className="w-14 h-14 mx-auto mb-3" /></Icon3D>
              <p className="font-heading text-3xl md:text-4xl font-bold" style={{ color: BRAND_YELLOW }}>3,700+</p>
              <p className="text-body text-base mt-2">Agents Strong</p>
            </CyberCardGold>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: MeetTheFounders
// =============================================================================
const FOUNDERS = [
  { name: "Doug Smart", title: "Co-Founder & Full-Stack Developer", bio: "Top 0.1% eXp team builder. Built everything you see here — this site, the agent portal, automations, and the production & attraction tools that give our agents an unfair advantage.", image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public" },
  { name: "Karrie Hill, JD", title: "Co-Founder & eXp Certified Mentor", bio: "UC Berkeley Law (top 5%). Built a six-figure real estate business without cold calling or door knocking, now helping agents do the same.", image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public" },
];

function MeetTheFounders() {
  const { ref, isVisible } = useScrollReveal(0.15);
  return (
    <section ref={ref} className="py-16 md:py-24 px-6 relative">
      <div className="absolute inset-x-0 inset-y-0 pointer-events-none rounded-3xl overflow-hidden z-[1]" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.25) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.15)', borderBottom: '2px solid rgba(0,0,0,0.6)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 2px 4px rgba(255,255,255,0.05), inset 0 -2px 0 rgba(0,0,0,0.4), inset 0 -4px 8px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(2px)',
      }} />
      <div className="mx-auto relative z-10" style={{ maxWidth: '1300px' }}>
        <div className="text-center transition-all duration-700 mb-12" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
          <H2>Meet the Founders</H2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {FOUNDERS.map((founder, i) => (
            <div key={i} className="transition-all duration-700" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : `translateX(${i === 0 ? '-30px' : '30px'})`, transitionDelay: `${0.3 + i * 0.2}s` }}>
              <div className="p-6 md:p-8 rounded-2xl border text-center hover:border-yellow-500/30 transition-colors duration-300 h-full flex flex-col" style={{ backgroundColor: 'rgba(20,20,20,0.75)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2" style={{ borderColor: BRAND_YELLOW }}>
                  <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-heading font-bold text-lg md:text-xl mb-1" style={{ color: BRAND_YELLOW }}>{founder.name}</h3>
                <p className="text-body text-sm opacity-60 mb-3">{founder.title}</p>
                <p className="text-body text-sm md:text-base leading-relaxed flex-1">{founder.bio}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease-out 0.7s' }}>
          <CTAButton href="/our-exp-team">Meet the Full Team</CTAButton>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

/**
 * Agent Attraction Template Page
 *
 * TODO: Customize for individual agents:
 * - Replace AGENT_NAME, AGENT_IMAGE, AGENT_TAGLINE
 * - Update CTA button href to agent's join link
 * - Add agent-specific rotating text
 */

// AGENT CUSTOMIZATION VARIABLES (replace these for each agent)
const AGENT_NAME = "SMART AGENT ALLIANCE";
const AGENT_IMAGE = "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/desktop";
const AGENT_IMAGE_SRCSET = `
  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/mobile 375w,
  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/tablet 768w,
  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/desktop 1280w
`;
const AGENT_TAGLINE = "For Agents Who Want More";
const AGENT_ROTATING_TEXTS = [
  'Smart Agent Alliance (SAA), also referred to as "The Alliance," is a sponsor support team built inside eXp Realty.',
  'Not a production team. No splits. No fees.',
  'Elite systems. Proven training. Real community.',
];
const AGENT_CTA_HREF = "#watch-and-decide";
const AGENT_CTA_TEXT = "WATCH & DECIDE";

export default function AgentAttractionPage() {
  return (
    <ViewportProvider>
      <main id="main-content">
        {/* Static Counter CSS */}
        <style>{`
          .agent-counter-wrapper { opacity: 1; }
          .tagline-counter-suffix { display: none !important; }
          @media (max-width: 1499px) { .tagline-counter-suffix { display: inline-flex !important; } }
          .hero-rotating-text-container { min-height: 72px; }
          @media (min-width: 768px) { .hero-rotating-text-container { min-height: 48px; } }
        `}</style>

        {/* Hero Section */}
        <FixedHeroWrapper>
          <section
            className="relative min-h-[100dvh] w-full"
            aria-label="Hero"
            style={{ maxWidth: '3000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <AgentCounter />
            <RevealMaskEffect />

            <div className="hero-content-wrapper flex flex-col items-center w-full pt-[8%] md:pt-0" style={{ maxWidth: '3000px' }}>
              {/* Profile Image Container */}
              <div className="relative pointer-events-none z-[1]" style={{ width: 'clamp(400px, 47.37vw, 900px)', maxWidth: '95vw', aspectRatio: '900 / 500', maxHeight: '50dvh' }}>
                <div className="hero-3d-backdrop absolute left-1/2 -translate-x-1/2 w-[110%] h-[110%]" style={{ top: '0', background: 'radial-gradient(ellipse 60% 50% at center 45%, rgba(100,80,150,0.15) 0%, rgba(50,40,80,0.1) 40%, transparent 70%)', filter: 'blur(40px)' }} />
                <img
                  src={AGENT_IMAGE}
                  srcSet={AGENT_IMAGE_SRCSET}
                  sizes="(max-width: 480px) 375px, (max-width: 768px) 768px, 1280px"
                  alt={`${AGENT_NAME} - Smart Agent Alliance`}
                  width={900}
                  height={500}
                  loading="eager"
                  className="hero-3d-image profile-image w-full h-full object-contain"
                  style={{
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%)',
                    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
                  }}
                />
              </div>

              {/* Text Content */}
              <div className="w-full px-4 sm:px-8 md:px-12 text-center pointer-events-auto z-[2]" style={{ maxWidth: '3000px', marginTop: 'calc(min(clamp(400px, 47.37vw, 900px) / 7.2, 12.5dvh) * -1)' }}>
                <div style={{ perspective: '1000px' }}>
                  <H1 id="hero-heading" style={{ fontSize: 'clamp(50px, calc(30px + 4vw + 0.3vh), 150px)', marginBottom: '3px' }}>
                    {AGENT_NAME}
                  </H1>
                  <Tagline className="hero-tagline-mobile-spacing" counterSuffix={<TaglineCounterSuffix />}>
                    {AGENT_TAGLINE}
                  </Tagline>
                  <div className="text-body text-sm md:text-base opacity-80 mx-auto hero-rotating-text-container" style={{ maxWidth: '950px', marginTop: '3px' }}>
                    <RotatingText texts={AGENT_ROTATING_TEXTS} interval={5000} />
                  </div>
                </div>

                {/* CTA Button */}
                <div className="hero-cta-buttons flex justify-center items-center" style={{ marginTop: '14px' }}>
                  <CTAButton href={AGENT_CTA_HREF}>{AGENT_CTA_TEXT}</CTAButton>
                </div>
              </div>
            </div>
          </section>
        </FixedHeroWrapper>

        {/* Sections */}
        <MediaLogos />
        <WhySAA />
        <ProvenAtScale />
        <MeetTheFounders />
      </main>
    </ViewportProvider>
  );
}
