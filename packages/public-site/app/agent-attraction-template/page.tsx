'use client';

/**
 * Agent Attraction Template 2 - Exact Homepage Duplicate
 *
 * This is a self-contained duplicate of the homepage with ALL components inlined.
 * Designed for agent attraction pages with easy customization.
 *
 * TO CUSTOMIZE FOR AGENT PAGES:
 * 1. Replace hero image with agent's profile image
 * 2. Replace H1 with agent's name
 * 3. Customize tagline
 * 4. Update CTA button links
 * 5. Add agent-specific data from KV/Supabase
 */

import React, { useEffect, useRef, useState, useMemo, ReactNode, createContext, useContext, useCallback, useLayoutEffect } from 'react';
import Link from 'next/link';
import { Globe, Users, TrendingUp, Check, DollarSign, Bot, GraduationCap, Cloud, Percent, Award, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =============================================================================
// BRAND CONSTANTS
// =============================================================================
const BRAND_YELLOW = '#ffd700';
const CLOUDFLARE_BASE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg';

// =============================================================================
// AGENT CUSTOMIZATION VARIABLES (replace these for each agent)
// =============================================================================
const AGENT_NAME = "SMART AGENT ALLIANCE";
const AGENT_DISPLAY_NAME = "Doug & Karrie"; // Name shown in tagline (e.g., "Join Doug & Karrie's Team")
const AGENT_FULL_NAME = "Sheldon Douglas Smart"; // Full legal name as it appears in eXp
const AGENT_EXP_EMAIL = "doug.smart@expreferral.com"; // Agent's eXp email for sponsor search
const AGENT_IMAGE = `${CLOUDFLARE_BASE}/doug-and-karrie-co-founders/desktop`;
const AGENT_IMAGE_SRCSET = `
  ${CLOUDFLARE_BASE}/doug-and-karrie-co-founders/mobile 375w,
  ${CLOUDFLARE_BASE}/doug-and-karrie-co-founders/tablet 768w,
  ${CLOUDFLARE_BASE}/doug-and-karrie-co-founders/desktop 1280w
`;
const AGENT_TAGLINE = `Join ${AGENT_DISPLAY_NAME}'s Team`;
const AGENT_CTA_HREF = "#watch-and-decide";
const AGENT_CTA_TEXT = "WATCH & DECIDE";

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
// COMPONENT: SmoothScroll (Lenis) - Inlined for Cloudflare Functions
// =============================================================================
function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(true); // Default to mobile (SSR safe)

  useEffect(() => {
    // Detect touch-PRIMARY devices (phones/tablets) - NOT laptops with touchscreens
    // Use CSS media query 'pointer: coarse' which detects touch-primary input devices
    // This allows Lenis on laptops with touchscreens while disabling on phones/tablets
    const checkTouchPrimaryDevice = () => {
      // Check if primary pointer is coarse (finger) rather than fine (mouse)
      if (window.matchMedia('(pointer: coarse)').matches) {
        return true;
      }
      // Fallback: narrow screen + touch = likely mobile
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isNarrowScreen = window.innerWidth < 768;
      return hasTouch && isNarrowScreen;
    };

    setIsMobile(checkTouchPrimaryDevice());

    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Scroll to top on initial page load
    window.scrollTo(0, 0);

    // Skip Lenis on touch-primary devices - use native scroll
    // This avoids the issue where clicks are blocked during scroll momentum on mobile
    if (checkTouchPrimaryDevice()) {
      console.log('[SmoothScroll] Skipping Lenis - touch-primary device detected');
      return;
    }

    console.log('[SmoothScroll] Initializing Lenis for desktop');

    // Defer Lenis initialization to avoid blocking main thread
    const initLenis = () => {
      console.log('[SmoothScroll] Lenis init callback running');
      // Initialize Lenis with DEFAULT settings
      const lenis = new Lenis({
        duration: 1.2, // Default duration
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Default easing
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1, // Default
        touchMultiplier: 1, // Default (not used since disabled on mobile)
        infinite: false,
        lerp: 0.1, // Default lerp
      });

      lenisRef.current = lenis;

      // Stop current scroll animation on any click - allows immediate interaction
      // This fixes the issue where clicks don't register while Lenis is animating
      // We use stop() then start() to cancel momentum but keep Lenis active
      const handleClick = () => {
        if (lenis.isScrolling) {
          lenis.stop();
          // Immediately restart Lenis so future scrolling works
          lenis.start();
        }
      };

      // Use capture phase to catch clicks before they reach interactive elements
      window.addEventListener('pointerdown', handleClick, { capture: true, passive: true });

      // Animation frame loop for Lenis
      function raf(time: number) {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }

      rafIdRef.current = requestAnimationFrame(raf);
      console.log('[SmoothScroll] Lenis initialized and running');

      // Store cleanup function
      (lenis as any).__clickCleanup = () => {
        window.removeEventListener('pointerdown', handleClick, { capture: true });
      };
    };

    // Use requestIdleCallback to defer initialization
    let idleCallbackId: number | undefined;
    if ('requestIdleCallback' in window) {
      idleCallbackId = window.requestIdleCallback(initLenis, { timeout: 1000 });
    } else {
      setTimeout(initLenis, 50);
    }

    // Cleanup
    return () => {
      if (idleCallbackId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (lenisRef.current) {
        // Clean up click listener
        (lenisRef.current as any).__clickCleanup?.();
        lenisRef.current.destroy();
      }
    };
  }, []);

  return null;
}

// =============================================================================
// COMPONENT: Icon3D - 3D styled icon wrapper
// =============================================================================
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + Math.round(255 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + Math.round(255 * percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.round((num >> 16) * (1 - percent)));
  const g = Math.max(0, Math.round(((num >> 8) & 0x00FF) * (1 - percent)));
  const b = Math.max(0, Math.round((num & 0x0000FF) * (1 - percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function Icon3D({ children, color = '#c4a94d' }: { children: React.ReactNode; color?: string }) {
  const highlight = adjustColor(color, 0.3);
  const midShadow = darkenColor(color, 0.4);
  const filter = `drop-shadow(-1px -1px 0 ${highlight}) drop-shadow(1px 1px 0 ${midShadow}) drop-shadow(3px 3px 0 #2a2a1d) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5))`;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color, filter, transform: 'perspective(500px) rotateX(8deg)' }}>
      {children}
    </span>
  );
}

// =============================================================================
// CONTEXT: Viewport Provider (for responsive counter)
// =============================================================================
const COUNTER_BREAKPOINT = 500;

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
// HOOK: Scroll Reveal
// =============================================================================
function useScrollReveal(threshold = 0.15) {
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
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
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
          WebkitTextStroke: '0.5px rgba(0,0,0,0.35)',
          textShadow: `
            0 0 0.005em #fff, 0 0 0.01em #fff, 0 0 0.02em rgba(255,255,255,0.9),
            0 0 0.04em #ffd700, 0 0 0.08em rgba(255, 215, 0, 0.85),
            0 0 0.12em rgba(255, 215, 0, 0.6), 0 0 0.18em rgba(255, 179, 71, 0.35),
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

  const linkClass = `
    relative flex justify-center items-center
    ${isFullWidth ? 'w-full' : ''}
    px-5 py-2
    bg-[rgb(45,45,45)]
    rounded-xl border-t border-b border-white/10
    uppercase tracking-wide
    z-10
    transition-all duration-500
    overflow-hidden
    before:content-[''] before:absolute before:inset-0
    before:bg-gradient-to-l before:from-white/15 before:to-transparent
    before:w-1/2 before:skew-x-[45deg]
  `;

  const linkStyle = {
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
          <Link href={href} onClick={onClick} className={linkClass} style={linkStyle}>{children}</Link>
        ) : (
          <a href={href} onClick={onClick} className={linkClass} style={linkStyle}>{children}</a>
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
// SHARED COMPONENT: ScrollIndicator
// =============================================================================
function ScrollIndicator() {
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 20;
      const fadeEnd = 100;
      if (scrollY <= fadeStart) { setOpacity(1); setScale(1); }
      else if (scrollY >= fadeEnd) { setOpacity(0); setScale(0.5); }
      else {
        const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        setOpacity(1 - progress);
        setScale(1 - progress * 0.5);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (opacity === 0) return null;

  return (
    <>
      <style>{`
        @keyframes scrollBounce { 0% { transform: translateY(0); } 100% { transform: translateY(30px); } }
        @keyframes scrollOpacity { 0% { opacity: 0; } 100% { opacity: 1; } }
        .scroll-prompt-arrow-container { animation: scrollBounce 1.5s infinite; }
        .scroll-prompt-arrow { animation: scrollOpacity 1.5s infinite; }
        .scroll-prompt-arrow:last-child { animation-direction: reverse; margin-top: -6px; }
        .scroll-prompt-arrow > div {
          width: 36px; height: 36px; border-right: 8px solid #888; border-bottom: 8px solid #888;
          border-radius: 4px; transform: rotate(45deg) translateZ(1px);
          filter: drop-shadow(0 0 1px rgba(255,255,255,0.6)) drop-shadow(0 0 2px rgba(255,255,255,0.3));
        }
      `}</style>
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: 'max(32px, calc(env(safe-area-inset-bottom, 0px) + 24px))',
          right: '24px', opacity, transform: `scale(${scale})`, transformOrigin: 'center bottom',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out', zIndex: -1,
        }}
      >
        <div style={{ filter: 'drop-shadow(0 0 2px rgba(136, 136, 136, 0.2))' }}>
          <div className="scroll-prompt-arrow-container">
            <div className="scroll-prompt-arrow"><div></div></div>
            <div className="scroll-prompt-arrow"><div></div></div>
          </div>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// SHARED COMPONENT: GlassPanel
// =============================================================================
type GlassPanelVariant = 'champagne' | 'marigoldCrosshatch' | 'marigoldNoise' | 'emerald';

const GLASS_VARIANTS = {
  champagne: { color: { r: 247, g: 231, b: 206 }, colorOpacity: 0.05, borderOpacity: 0.08, texture: 'dots', textureOpacity: 0.04, noiseFrequency: 1.5 },
  marigoldCrosshatch: { color: { r: 255, g: 190, b: 0 }, colorOpacity: 0.04, borderOpacity: 0.11, texture: 'crosshatch', textureOpacity: 0.03, noiseFrequency: 0.8 },
  marigoldNoise: { color: { r: 255, g: 190, b: 0 }, colorOpacity: 0.04, borderOpacity: 0.11, texture: 'noise', textureOpacity: 0.06, noiseFrequency: 0.9 },
  emerald: { color: { r: 16, g: 185, b: 129 }, colorOpacity: 0.12, borderOpacity: 0.2, texture: 'hlines', textureOpacity: 0.04, noiseFrequency: 1.0, blur: 16 },
} as const;

function getTextureStyle(texture: string, opacity: number, frequency: number): React.CSSProperties {
  switch (texture) {
    case 'crosshatch': return { backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,${opacity}) 0px, transparent 1px, transparent 6px), repeating-linear-gradient(-45deg, rgba(255,255,255,${opacity}) 0px, transparent 1px, transparent 6px)`, backgroundSize: '16px 16px' };
    case 'dots': return { backgroundImage: `radial-gradient(circle, rgba(255,255,255,${opacity * 2}) 1px, transparent 1px)`, backgroundSize: `${Math.round(12 / frequency)}px ${Math.round(12 / frequency)}px` };
    case 'hlines': return { backgroundImage: `repeating-linear-gradient(180deg, rgba(255,255,255,${opacity}) 0px, transparent 1px, transparent 3px)`, backgroundSize: '100% 3px', backgroundRepeat: 'repeat' };
    default: return { backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, opacity, mixBlendMode: 'overlay' as const };
  }
}

function GlassPanel({ variant, children, className = '' }: { variant: GlassPanelVariant; children: React.ReactNode; className?: string }) {
  const config = GLASS_VARIANTS[variant];
  const { r, g, b } = config.color;
  const textureStyle = getTextureStyle(config.texture, config.textureOpacity, config.noiseFrequency);
  const isEmerald = variant === 'emerald';

  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      {isEmerald && (
        <>
          <style>{`@keyframes emeraldVignetteGlow { 0%, 100% { box-shadow: inset 0 0 40px 15px rgba(16, 185, 129, 0.25); } 50% { box-shadow: inset 0 0 60px 25px rgba(16, 185, 129, 0.4); } }`}</style>
          <div className="absolute inset-0 pointer-events-none z-[3] rounded-3xl" style={{ animation: 'emeraldVignetteGlow 4s ease-in-out infinite' }} />
        </>
      )}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden z-[1] rounded-3xl"
        style={{
          background: `linear-gradient(180deg, rgba(${r},${g},${b},${config.colorOpacity * 0.8}) 0%, rgba(${r},${g},${b},${config.colorOpacity}) 50%, rgba(${r},${g},${b},${config.colorOpacity * 0.8}) 100%)`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 0 rgba(255,255,255,0.35), inset 0 2px 4px 0 rgba(255,255,255,0.2), inset 0 8px 20px -8px rgba(${r},${g},${b},0.3), inset 0 20px 40px -20px rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(0,0,0,0.7), inset 0 -2px 6px 0 rgba(0,0,0,0.5), inset 0 -10px 25px -8px rgba(0,0,0,0.6), inset 0 -25px 50px -20px rgba(0,0,0,0.45)`,
          backdropFilter: `blur(${'blur' in config ? (config as any).blur : 2}px)`,
        }}
      >
        <div className="absolute inset-0" style={textureStyle} />
      </div>
      {isEmerald && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-[2] rounded-3xl" style={{ height: '80px', background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 30%, transparent 100%)' }} />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// =============================================================================
// SHARED COMPONENT: CyberCardGold
// =============================================================================
function CyberCardGold({ children, className = '', padding = 'md', centered = true }: {
  children: React.ReactNode; className?: string; padding?: 'sm' | 'md' | 'lg' | 'xl'; centered?: boolean;
}) {
  const paddingClasses = { sm: 'p-4', md: 'p-6', lg: 'p-8', xl: 'p-10' };
  return (
    <>
      <style>{`
        .cyber-card-gold-3d { perspective: 1000px; display: block; }
        .cyber-card-gold-frame {
          position: relative; transform-style: preserve-3d; transform: translateZ(0);
          border: 10px solid #ffd700; border-radius: 16px; background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 4px 1px rgba(255, 215, 0, 0.5), 0 0 8px 2px rgba(255, 215, 0, 0.35), 0 0 16px 4px rgba(255, 215, 0, 0.2), 0 0 24px 6px rgba(255, 215, 0, 0.1), 0 4px 12px rgba(0,0,0,0.3);
          overflow: visible;
        }
        @keyframes cyberCardGoldOrganicPulse { 0% { opacity: 0.55; } 13% { opacity: 0.95; } 28% { opacity: 0.6; } 41% { opacity: 0.85; } 54% { opacity: 0.5; } 67% { opacity: 1; } 83% { opacity: 0.7; } 100% { opacity: 0.55; } }
        .cyber-card-gold-frame::after {
          content: ""; position: absolute; top: -12px; left: -12px; right: -12px; bottom: -12px;
          border-radius: 18px; border: 2px solid rgba(255,255,255,0.4);
          box-shadow: 0 0 6px 2px rgba(255, 215, 0, 0.6), 0 0 12px 4px rgba(255, 215, 0, 0.4), 0 0 20px 6px rgba(255, 215, 0, 0.25), 0 0 32px 10px rgba(255, 215, 0, 0.12), 0 6px 16px rgba(0,0,0,0.35);
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
          <div className={`cyber-card-gold-content ${paddingClasses[padding]} ${centered ? 'text-center' : ''}`}>{children}</div>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// SHARED COMPONENT: ProfileCyberFrame
// =============================================================================
function ProfileCyberFrame({ children, className = '', index = 0, size = 'md' }: {
  children: React.ReactNode; className?: string; index?: number; size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizeConfig = { sm: 96, md: 144, lg: 192, xl: 224 };
  const currentSize = sizeConfig[size];
  const randomValues = useMemo(() => ({ sheenAngle: 25 + (index * 10), sheenPosition: 30 + (index * 20) }), [index]);

  return (
    <>
      <style>{`
        .profile-cyber-frame { position: relative; margin: 0 auto 24px auto; }
        .profile-cyber-frame-metal {
          position: absolute; top: -6px; left: -6px; right: -6px; bottom: -6px; border-radius: 9999px;
          background: linear-gradient(145deg, rgba(80,80,80,0.6) 0%, rgba(40,40,40,0.8) 50%, rgba(60,60,60,0.6) 100%);
          border: 1px solid rgba(150,150,150,0.4);
          box-shadow: 0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3), 0 0 15px rgba(255,215,0,0.15);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .profile-cyber-frame:hover .profile-cyber-frame-metal {
          box-shadow: 0 4px 25px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.3), 0 0 25px rgba(255,215,0,0.3);
          border-color: rgba(255,215,0,0.3);
        }
        .profile-cyber-frame-inner { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 9999px; overflow: hidden; background-color: #0a0a0a; }
        .profile-cyber-frame-inner::before {
          content: ""; position: absolute; top: -100%; left: -100%; right: -100%; bottom: -100%; border-radius: 9999px; pointer-events: none; z-index: 10;
          background: linear-gradient(var(--pcf-sheen-angle, 25deg), transparent 0%, transparent 35%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 58%, transparent 65%, transparent 100%);
          transform: translateX(calc(var(--pcf-sheen-pos, 30%) - 50%)); transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .profile-cyber-frame:hover .profile-cyber-frame-inner::before { transform: translateX(calc(var(--pcf-sheen-pos, 30%) + 30%)); }
        .profile-cyber-frame-ring {
          position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; border-radius: 9999px; pointer-events: none;
          border: 2px solid rgba(255,215,0,0.4); transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .profile-cyber-frame:hover .profile-cyber-frame-ring { border-color: rgba(255,215,0,0.7); box-shadow: 0 0 12px rgba(255,215,0,0.4); }
      `}</style>
      <div className={`profile-cyber-frame ${className}`} style={{ width: `${currentSize}px`, height: `${currentSize}px`, '--pcf-sheen-angle': `${randomValues.sheenAngle}deg`, '--pcf-sheen-pos': `${randomValues.sheenPosition}%` } as React.CSSProperties}>
        <div className="profile-cyber-frame-metal" />
        <div className="profile-cyber-frame-inner"><div style={{ position: 'relative', width: '100%', height: '100%' }}>{children}</div></div>
        <div className="profile-cyber-frame-ring" />
      </div>
    </>
  );
}

// =============================================================================
// HERO COMPONENT: FixedHeroWrapper
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
      heroEffects.forEach(el => { el.style.opacity = `${opacity}`; el.style.visibility = progress >= 1 ? 'hidden' : 'visible'; });

      const agentCounter = heroSection.querySelector('.agent-counter-wrapper') as HTMLElement;
      if (agentCounter) {
        agentCounter.style.opacity = `${opacity}`;
        agentCounter.style.filter = `blur(${blur}px) brightness(${brightness})`;
      }

      const section = heroSection as HTMLElement;
      section.style.visibility = progress >= 1 ? 'hidden' : 'visible';
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
// HERO COMPONENT: RevealMaskEffect
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
    return () => { window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(rafRef.current); };
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
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse ${maskSize}% ${maskSize * 0.7}% at 50% ${centerY}, rgba(255,215,0,0.2) 0%, rgba(255,180,0,0.12) 35%, rgba(255,150,0,0.06) 55%, transparent 80%)` }} />
      <div className="absolute w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] border-2 left-1/2" style={{ top: centerY, transform: `translate(-50%, -50%) rotate(${rotation}deg)`, borderRadius: `${20 + progress * 30}%`, borderColor: 'rgba(255,215,0,0.25)' }} />
      <div className="absolute w-[60vw] h-[60vw] max-w-[520px] max-h-[520px] border left-1/2" style={{ top: centerY, transform: `translate(-50%, -50%) rotate(${-rotation * 0.5}deg)`, borderRadius: `${Math.max(20, 50 - progress * 30)}%`, borderColor: 'rgba(255,215,0,0.18)' }} />
      <div className="hero-vignette" />
    </div>
  );
}

// =============================================================================
// HERO COMPONENT: AgentCounter
// =============================================================================
function AgentCounter() {
  const { isCounterDesktop } = useViewport();
  const textShadow = `0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8)`;
  const filter = `drop-shadow(0 0 0.04em #bfbdb0) drop-shadow(0 0 0.08em rgba(191,189,176,0.6))`;

  if (isCounterDesktop) {
    return (
      <div className="agent-counter-wrapper absolute z-50 left-2 lg:left-auto lg:right-8" style={{ top: '130px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25em', fontSize: 'clamp(1.75rem, 2.625vw, 2.1875rem)' }}>
          <span style={{ display: 'inline', color: '#bfbdb0', fontFamily: 'var(--font-synonym), monospace', fontWeight: 300, fontSize: 'calc(1em + 10px)', textShadow: 'none' }}>
            <span className="counter-digit">3</span><span className="counter-digit">7</span><span className="counter-digit">0</span><span className="counter-digit">0</span><span>+</span>
          </span>
          <span style={{ color: '#bfbdb0', fontFamily: 'var(--font-taskor), sans-serif', fontFeatureSettings: '"ss01" 1', textTransform: 'uppercase', letterSpacing: '0.05em', textShadow: textShadow.trim(), filter: filter.trim() }}>AGENTS</span>
        </span>
      </div>
    );
  }
  return null;
}

function TaglineCounterSuffix() {
  const { hasMounted } = useViewport();
  return (
    <span className="tagline-counter-suffix" style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0, opacity: hasMounted ? 1 : 0, transition: 'opacity 0.2s ease-in' }}>
      <span style={{ display: 'inline', color: '#bfbdb0', fontFamily: 'var(--font-synonym), monospace', fontWeight: 300, fontSize: '1em', textShadow: 'none' }}>
        <span> (</span><span className="counter-digit">3</span><span className="counter-digit">7</span><span className="counter-digit">0</span><span className="counter-digit">0</span><span>+ </span>
      </span>
      <span style={{ color: '#bfbdb0', fontFamily: 'var(--font-taskor), sans-serif', fontFeatureSettings: '"ss01" 1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AGENTS)</span>
    </span>
  );
}

// =============================================================================
// SECTION: ValuePillarsTab
// =============================================================================
const PILLAR_GLOW_COLOR = '#bca24a';
const pillarTextStyle: React.CSSProperties = {
  color: PILLAR_GLOW_COLOR,
  fontWeight: 500,
  textShadow: `0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8), 0 0 0.05em ${PILLAR_GLOW_COLOR}, 0 0 0.09em rgba(188, 162, 74, 0.8), 0 0 0.13em rgba(188, 162, 74, 0.55), 0 0 0.18em rgba(188, 162, 74, 0.35), 0.03em 0.03em 0 #2a2a2a, 0.045em 0.045em 0 #1a1a1a, 0.06em 0.06em 0 #0f0f0f, 0.075em 0.075em 0 #080808`,
  filter: `drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(188, 162, 74, 0.25))`,
};

function ValuePillarsTab() {
  return (
    <div className="relative z-10" style={{ marginBottom: '-38px' }}>
      <div className="absolute left-8 right-8" style={{ bottom: '-12px', height: '35px', background: 'radial-gradient(ellipse 60% 100% at center, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 80%)', filter: 'blur(12px)', zIndex: -1, borderRadius: '50%' }} />
      <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(180deg, rgba(22, 22, 22, 0.94) 0%, rgba(15, 15, 15, 0.97) 100%)', pointerEvents: 'none' }} />
      <style>{`@keyframes whiteVignetteGlow { 0%, 100% { box-shadow: inset 0 20px 30px -15px rgba(255, 255, 255, 0.12), inset 0 -20px 30px -15px rgba(255, 255, 255, 0.12), inset 20px 0 30px -15px rgba(255, 255, 255, 0.12), inset -20px 0 30px -15px rgba(255, 255, 255, 0.12); } 50% { box-shadow: inset 0 35px 45px -20px rgba(255, 255, 255, 0.22), inset 0 -35px 45px -20px rgba(255, 255, 255, 0.22), inset 35px 0 45px -20px rgba(255, 255, 255, 0.22), inset -35px 0 45px -20px rgba(255, 255, 255, 0.22); } }
        @keyframes pillarGlowBreathe { 0%, 100% { filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(188, 162, 74, 0.25)); } 50% { filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(188, 162, 74, 0.45)); } }
        .pillar-text { animation: pillarGlowBreathe 4s ease-in-out infinite; }`}</style>
      <div className="absolute inset-0 pointer-events-none z-[3] rounded-3xl" style={{ animation: 'whiteVignetteGlow 4s ease-in-out infinite' }} />
      <GlassPanel variant="champagne">
        <section className="px-6" style={{ paddingTop: 'calc(1.5rem + 15px)', paddingBottom: 'calc(1.5rem + 15px)' }}>
          <div className="mx-auto" style={{ maxWidth: '900px' }}>
            <div className="flex flex-col gap-3 items-center">
              <div className="flex flex-col gap-3 text-left">
                <div className="flex items-center gap-3">
                  <span className="pillar-number text-body text-sm md:text-base font-bold" style={{ color: '#ffd700', minWidth: '1.5em' }}>01</span>
                  <span className="pillar-text text-body text-sm md:text-base" style={pillarTextStyle}>Smart Agent Alliance, sponsor support built and provided at no cost to agents.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="pillar-number text-body text-sm md:text-base font-bold" style={{ color: '#ffd700', minWidth: '1.5em' }}>02</span>
                  <span className="pillar-text text-body text-sm md:text-base" style={pillarTextStyle}>Inside eXp Realty, the largest independent real estate brokerage in the world.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="pillar-number text-body text-sm md:text-base font-bold" style={{ color: '#ffd700', minWidth: '1.5em' }}>03</span>
                  <span className="pillar-text text-body text-sm md:text-base" style={pillarTextStyle}>Stronger Together, eXp infrastructure plus SAA systems drive higher agent success.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </GlassPanel>
    </div>
  );
}

// =============================================================================
// COMPONENT: InlineCommissionCalculator - Calculator for modal popup
// =============================================================================
function useCalculator(transactions: number, avgCommission: number) {
  const totalCommission = transactions * avgCommission;
  const commissionPerDealToExp = 0.2 * avgCommission;
  const potentialExpCommission = transactions * commissionPerDealToExp;
  const expCommission = Math.min(potentialExpCommission, 16000);
  const dealsAfterCap = Math.max((potentialExpCommission - 16000) / commissionPerDealToExp, 0);
  const postCapFirstTier = Math.min(dealsAfterCap, 20);
  const postCapSecondTier = Math.max(dealsAfterCap - 20, 0);
  const postCap250 = postCapFirstTier * 250;
  const postCap75 = postCapSecondTier * 75;
  const eoFee = Math.min(transactions * 60, 750);
  const brokerFee = transactions * 25;
  const totalFees = expCommission + eoFee + brokerFee + postCap250 + postCap75;
  const netCommission = totalCommission - totalFees;
  return {
    totalCommission: Math.round(totalCommission),
    expSplit: Math.round(expCommission),
    brokerFee: Math.round(brokerFee),
    eoFee: Math.round(eoFee),
    postCap250: Math.round(postCap250),
    postCap75: Math.round(postCap75),
    totalFees: Math.round(totalFees),
    netCommission: Math.round(netCommission),
    effectiveRate: totalCommission > 0 ? ((netCommission / totalCommission) * 100).toFixed(1) : '0',
  };
}

function AnimatedNumber({ value, prefix = '$' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  useEffect(() => {
    if (value === prevRef.current) return;
    const start = prevRef.current;
    const diff = value - start;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 500, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    prevRef.current = value;
  }, [value]);
  return <span>{prefix}{display.toLocaleString()}</span>;
}

function InlineCommissionCalculator() {
  const [transactions, setTransactions] = useState(12);
  const [avgCommission, setAvgCommission] = useState(10000);
  const isValidCommission = avgCommission >= 500;
  const rawResults = useCalculator(transactions, avgCommission);
  const results = isValidCommission ? rawResults : { totalCommission: 0, expSplit: 0, brokerFee: 0, eoFee: 0, postCap250: 0, postCap75: 0, totalFees: 0, netCommission: 0, effectiveRate: '0' };

  const allSegments = [
    { label: 'You Keep', value: results.netCommission, color: '#10b981' },
    { label: 'eXp Split', value: results.expSplit, color: '#ffd700' },
    { label: 'Broker Fee', value: results.brokerFee, color: '#ff9500' },
    { label: 'E&O', value: results.eoFee, color: '#ff6b6b' },
    { label: 'Post-Cap', value: results.postCap250 + results.postCap75, color: '#c084fc' },
  ];
  const chartSegments = allSegments.filter(s => s.value > 0);
  const segments = allSegments.filter(s => s.label !== 'You Keep');
  const total = chartSegments.reduce((sum, s) => sum + s.value, 0);
  let currentAngle = 0;

  return (
    <div>
      <h2 className="text-center mb-2" style={{ fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)', color: '#bfbdb0', fontFamily: 'var(--font-taskor)' }}>
        Commission Calculator
      </h2>
      <p className="text-xs text-center mb-4" style={{ color: '#9a9890' }}>See exactly what you keep at eXp Realty</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="w-full sm:w-28 sm:flex-shrink-0">
          <label className="block text-xs mb-1" style={{ color: '#9a9890' }}>Avg Commission</label>
          <div className="flex items-center">
            <span className="text-sm" style={{ color: '#ffd700' }}>$</span>
            <input type="text" inputMode="numeric" value={avgCommission} onChange={(e) => setAvgCommission(Number(e.target.value.replace(/\D/g, '')) || 0)}
              className="w-full px-1 py-1 bg-transparent border-b text-white text-base font-mono focus:outline-none" style={{ borderColor: 'rgba(255,215,0,0.3)' }} />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs mb-1" style={{ color: '#9a9890' }}>Transactions: {transactions}</label>
          <input type="range" min={1} max={100} value={transactions} onChange={(e) => setTransactions(Number(e.target.value))}
            className="w-full accent-[#ffd700]" style={{ touchAction: 'none', minHeight: '44px' }} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <span className="text-xs w-12 flex-shrink-0" style={{ color: '#9a9890' }}>GROSS</span>
            <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-taskor)' }}><AnimatedNumber value={results.totalCommission} /></span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <span className="text-xs w-12 flex-shrink-0" style={{ color: '#10b981' }}>NET</span>
            <span className="text-lg font-bold" style={{ color: '#10b981', fontFamily: 'var(--font-taskor)' }}><AnimatedNumber value={results.netCommission} /></span>
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-0 p-2 sm:p-4 rounded-xl sm:text-center sm:flex-shrink-0 sm:w-[130px]" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
          <span className="text-xs w-12 flex-shrink-0 sm:w-auto sm:mb-2" style={{ color: '#ffd700' }}>FEES</span>
          <span className="text-lg font-bold" style={{ color: '#ffd700', fontFamily: 'var(--font-taskor)' }}><AnimatedNumber value={results.totalFees} /></span>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-4 items-center">
        <div className="relative flex-shrink-0" style={{ width: '180px', height: '180px' }}>
          <svg viewBox="0 0 100 100" className="w-full transform -rotate-90">
            {chartSegments.map((seg, i) => {
              const angle = (seg.value / total) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;
              const largeArc = angle > 180 ? 1 : 0;
              const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const endX = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const endY = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
              return <path key={i} d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`} fill={seg.color} stroke="rgba(10,10,10,0.85)" strokeWidth="1" />;
            })}
            <circle cx="50" cy="50" r="25" fill="rgba(10,10,10,0.95)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: '#10b981' }}>{results.effectiveRate}%</span>
            <span className="text-[9px]" style={{ color: '#9a9890' }}>KEEP RATE</span>
          </div>
        </div>
        <div className="w-full sm:flex-1 space-y-2">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded" style={{ background: `${seg.color}08` }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ background: seg.color }} />
                <span className="text-sm" style={{ color: '#bfbdb0' }}>{seg.label}</span>
              </div>
              <span className="text-sm font-bold font-mono" style={{ color: seg.color }}>${seg.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: MediaLogos
// =============================================================================
const MEDIA_LOGOS = [
  { id: 'wsj-logo', alt: 'The Wall Street Journal' }, { id: 'cnbc-logo', alt: 'CNBC' }, { id: 'fox-business-logo', alt: 'Fox Business' },
  { id: 'bloomberg-logo', alt: 'Bloomberg' }, { id: 'yahoo-finance-logo', alt: 'Yahoo Finance' }, { id: 'forbes-logo', alt: 'Forbes' },
  { id: 'business-insider-logo', alt: 'Business Insider' }, { id: 'market-watch-logo', alt: 'MarketWatch' }, { id: 'reuters-logo', alt: 'Reuters' },
  { id: 'usa-today-logo', alt: 'USA Today' }, { id: 'la-times-logo', alt: 'Los Angeles Times' }, { id: 'washington-post-logo', alt: 'The Washington Post' },
  { id: 'nasdaq-logo', alt: 'Nasdaq' }, { id: 'barrons-logo', alt: "Barron's" }, { id: 'new-york-post-logo', alt: 'New York Post' },
];

function MediaLogos() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const velocityRef = useRef(0.5);
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showRevShareModal, setShowRevShareModal] = useState(false);

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

    const animate = () => {
      const singleSetWidth = track.scrollWidth / 2;
      if (singleSetWidth > 0) {
        positionRef.current += velocityRef.current;
        if (velocityRef.current > 0.5) { velocityRef.current *= 0.98; if (velocityRef.current < 0.5) velocityRef.current = 0.5; }
        if (positionRef.current >= singleSetWidth) positionRef.current = positionRef.current - singleSetWidth;
        track.style.transform = `translateX(-${positionRef.current}px)`;
      }
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
      <div className={`text-center px-4 transition-all duration-700 ease-out relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <H2>Why eXp Realty?</H2>
        {/* Layout B: Unified card - bullets left, stacked buttons right */}
        <div className={`mx-auto mb-8 transition-all duration-700 delay-150 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ maxWidth: '1200px' }}>
          <div className="p-6 md:p-8 rounded-2xl" style={{ background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,215,0,0.15)' }}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-6 md:gap-10 items-center">
              {/* Left: All bullet points with 3D icons */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon3D><TrendingUp className="w-5 h-5" /></Icon3D>
                  <span className="text-body opacity-90">The only cumulatively profitable public real estate company.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Icon3D><Cloud className="w-5 h-5" /></Icon3D>
                  <span className="text-body opacity-90">S&P 600 SmallCap. First cloud-based brokerage.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Icon3D><Users className="w-5 h-5" /></Icon3D>
                  <span className="text-body opacity-90">Choose your sponsor. Access real support.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Icon3D color="#00cc66"><Percent className="w-5 h-5" /></Icon3D>
                  <span className="text-body opacity-90 font-bold">80/20 split until cap → 100% commission. Flat monthly fee.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Icon3D color="#9933ff"><Award className="w-5 h-5" /></Icon3D>
                  <span className="text-body opacity-90 font-bold">Optional revenue share income + stock opportunities.</span>
                </div>
              </div>
              {/* Right: Stacked buttons that open modals */}
              <div className="flex flex-col gap-2 items-center md:items-stretch">
                <button
                  onClick={() => setShowCommissionModal(true)}
                  className="cta-light-bar cta-light-bar-pulse relative flex justify-center items-center px-5 py-2 rounded-xl text-button uppercase tracking-wide z-10 transition-all duration-500 overflow-hidden"
                  style={{
                    background: 'rgb(45,45,45)',
                    color: 'var(--text-color-button, var(--color-headingText))',
                    fontSize: 'var(--font-size-button, 20px)',
                    fontFamily: 'var(--font-family-button, var(--font-taskor), Taskor, system-ui, sans-serif)',
                    fontWeight: 600,
                    height: 'clamp(45px, calc(43.182px + 0.7273vw), 65px)',
                    boxShadow: '0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
                    '--glow-color': '0, 255, 136',
                  } as React.CSSProperties}
                >
                  Commission Calculator
                  <span className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-[10px] h-[18px] rounded-md z-[5]" style={{ background: '#00cc66', boxShadow: '0 0 10px rgba(0,255,136,1), 0 0 20px rgba(0,255,136,0.5)' }} />
                  <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-[10px] h-[18px] rounded-md z-[5]" style={{ background: '#00cc66', boxShadow: '0 0 10px rgba(0,255,136,1), 0 0 20px rgba(0,255,136,0.5)' }} />
                </button>
                <button
                  onClick={() => setShowRevShareModal(true)}
                  className="cta-light-bar cta-light-bar-pulse relative flex justify-center items-center px-5 py-2 rounded-xl text-button uppercase tracking-wide z-10 transition-all duration-500 overflow-hidden"
                  style={{
                    background: 'rgb(45,45,45)',
                    color: 'var(--text-color-button, var(--color-headingText))',
                    fontSize: 'var(--font-size-button, 20px)',
                    fontFamily: 'var(--font-family-button, var(--font-taskor), Taskor, system-ui, sans-serif)',
                    fontWeight: 600,
                    height: 'clamp(45px, calc(43.182px + 0.7273vw), 65px)',
                    boxShadow: '0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
                    '--glow-color': '191, 95, 255',
                  } as React.CSSProperties}
                >
                  RevShare Visualizer
                  <span className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-[10px] h-[18px] rounded-md z-[5]" style={{ background: '#9933ff', boxShadow: '0 0 10px rgba(191,95,255,1), 0 0 20px rgba(191,95,255,0.5)' }} />
                  <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-[10px] h-[18px] rounded-md z-[5]" style={{ background: '#9933ff', boxShadow: '0 0 10px rgba(191,95,255,1), 0 0 20px rgba(191,95,255,0.5)' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`relative z-10 transition-all duration-700 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* 3D Curved Portal Edges - raised bars that logos slide under */}
        {/* Left curved bar */}
        <div
          className="absolute left-0 z-20 pointer-events-none"
          style={{
            top: '-8px',
            bottom: '-8px',
            width: '12px',
            borderRadius: '0 12px 12px 0',
            background: `radial-gradient(ellipse 200% 50% at 0% 50%, rgba(255,200,50,0.35) 0%, rgba(255,180,0,0.2) 40%, rgba(180,140,0,0.1) 70%, rgba(100,80,0,0.05) 100%)`,
            borderRight: '1px solid rgba(255,190,0,0.4)',
            boxShadow: 'inset -3px 0 6px rgba(255,200,50,0.2), inset -1px 0 2px rgba(255,220,100,0.3), 3px 0 12px rgba(0,0,0,0.6), 6px 0 24px rgba(0,0,0,0.3)',
            transform: 'perspective(500px) rotateY(-3deg)',
            transformOrigin: 'right center',
          }}
        />
        {/* Right curved bar */}
        <div
          className="absolute right-0 z-20 pointer-events-none"
          style={{
            top: '-8px',
            bottom: '-8px',
            width: '12px',
            borderRadius: '12px 0 0 12px',
            background: `radial-gradient(ellipse 200% 50% at 100% 50%, rgba(255,200,50,0.35) 0%, rgba(255,180,0,0.2) 40%, rgba(180,140,0,0.1) 70%, rgba(100,80,0,0.05) 100%)`,
            borderLeft: '1px solid rgba(255,190,0,0.4)',
            boxShadow: 'inset 3px 0 6px rgba(255,200,50,0.2), inset 1px 0 2px rgba(255,220,100,0.3), -3px 0 12px rgba(0,0,0,0.6), -6px 0 24px rgba(0,0,0,0.3)',
            transform: 'perspective(500px) rotateY(3deg)',
            transformOrigin: 'left center',
          }}
        />
        {/* Inner clipping container */}
        <div className="relative" style={{ marginLeft: '12px', marginRight: '12px', overflow: 'hidden', borderRadius: '12px' }}>
          {/* Shadow overlays */}
          <div className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: '30px', background: 'radial-gradient(ellipse 100% 60% at 0% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
          <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: '30px', background: 'radial-gradient(ellipse 100% 60% at 100% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
          <div ref={trackRef} className="flex items-center gap-8 md:gap-16 py-8" style={{ willChange: 'transform' }}>
            {[...MEDIA_LOGOS, ...MEDIA_LOGOS].map((logo, index) => (
              <div key={`${logo.id}-${index}`} className="flex-shrink-0 flex items-center justify-center" style={{ height: 'clamp(80px, 6vw, 56px)', minWidth: 'clamp(180px, 15vw, 200px)' }}>
                <img src={`${CLOUDFLARE_BASE}/${logo.id}/public`} alt={logo.alt} loading="eager" className="h-full w-auto object-contain" style={{ maxWidth: 'clamp(200px, 18vw, 240px)', opacity: 0.9 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commission Calculator Modal */}
      {showCommissionModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 100000, overflowY: 'auto', overscrollBehavior: 'contain' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCommissionModal(false); }}
        >
          <div className="fixed inset-0" style={{ zIndex: 100000, background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(8px)' }} />
          <div className="relative w-full max-w-[700px]" style={{ zIndex: 100001, maxHeight: '90vh', margin: 'auto' }}>
            <button
              onClick={() => setShowCommissionModal(false)}
              className="absolute flex items-center justify-center"
              style={{ top: '-12px', right: '-12px', width: '44px', height: '44px', background: 'rgba(40, 40, 40, 0.95)', border: '2px solid rgba(255, 255, 255, 0.3)', borderRadius: '50%', color: '#fff', cursor: 'pointer', zIndex: 100005 }}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="rounded-2xl overflow-y-auto" style={{ background: '#151517', border: '1px solid rgba(255, 255, 255, 0.1)', maxHeight: '90vh', overscrollBehavior: 'contain' }}>
              <div className="p-6">
                <InlineCommissionCalculator />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RevShare Visualizer Modal */}
      {showRevShareModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 100000, overflowY: 'auto', overscrollBehavior: 'contain' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowRevShareModal(false); }}
        >
          <div className="fixed inset-0" style={{ zIndex: 100000, background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(8px)' }} />
          <div className="relative w-full max-w-[900px]" style={{ zIndex: 100001, maxHeight: '90vh', margin: 'auto' }}>
            <button
              onClick={() => setShowRevShareModal(false)}
              className="absolute flex items-center justify-center"
              style={{ top: '-12px', right: '-12px', width: '44px', height: '44px', background: 'rgba(40, 40, 40, 0.95)', border: '2px solid rgba(255, 255, 255, 0.3)', borderRadius: '50%', color: '#fff', cursor: 'pointer', zIndex: 100005 }}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="rounded-2xl overflow-y-auto text-center" style={{ background: '#151517', border: '1px solid rgba(255, 255, 255, 0.1)', maxHeight: '90vh', overscrollBehavior: 'contain' }}>
              <div className="p-6">
                <h3 style={{ fontFamily: 'var(--font-family-h3, var(--font-amulya), system-ui, sans-serif)', fontSize: 'clamp(1.25rem, calc(1.1rem + 0.5vw), 1.75rem)', fontWeight: 700, color: 'var(--text-color-h3, #e5e4dd)', marginBottom: '0.35rem' }}>
                  Revenue Share Visualizer
                </h3>
                <p className="text-body opacity-70 mb-6" style={{ fontSize: '0.9rem' }}>Interactive revenue share calculator coming soon.</p>
                <a
                  href="/exp-realty-revenue-share-calculator/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg font-bold transition-colors"
                  style={{ padding: '0.75rem 1.5rem', background: '#9933ff', color: 'white', fontSize: '0.9rem', textDecoration: 'none' }}
                >
                  Open Full Visualizer
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// =============================================================================
// SECTION: WhySAA
// =============================================================================
const WHYSAA_BENEFITS = ["Not a production team", "No commission splits", "No sponsor team fees", "No required meetings"];

function Check3D() {
  return <span className="check-3d"><Check className="w-6 h-6" strokeWidth={3} /></span>;
}

function WhySAA() {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <section className="py-24 md:py-32 px-6 overflow-hidden relative">
      <style>{`
        .bento-card { transition: transform 0.5s ease, box-shadow 0.5s ease; }
        .bento-card:hover { transform: translateY(-4px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .bento-image { transition: transform 0.7s ease; }
        .bento-card:hover .bento-image { transform: scale(1.05); }
        .check-3d { display: inline-flex; align-items: center; justify-content: center; min-width: 32px; height: 32px; color: #c4a94d; filter: drop-shadow(-1px -1px 0 #ffe680) drop-shadow(1px 1px 0 #8a7a3d) drop-shadow(2px 2px 0 #2a2a1d) drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.5)); transform: perspective(500px) rotateX(8deg); flex-shrink: 0; }
      `}</style>
      <div ref={ref} className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div className="text-center transition-all duration-700" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)' }}>
          <H2>Why Smart Agent Alliance (SAA)?</H2>
        </div>
        <div className="grid md:grid-cols-12 gap-4 md:gap-6">
          <div className="md:col-span-7">
            <div className="bento-card relative rounded-2xl overflow-hidden bg-gradient-to-br from-black/60 to-black/40 border border-white/10 p-8 md:p-10 h-full" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-40px)', transition: 'opacity 0.7s ease-out, transform 0.7s ease-out' }}>
              <div className="mb-8">
                <p className="font-heading text-2xl md:text-3xl font-bold" style={{ color: BRAND_YELLOW }}>Elite systems. Proven training. Real community.</p>
                <p className="text-body text-lg mt-4 opacity-70">Most eXp sponsors offer little or no ongoing value.</p>
                <p className="font-heading text-xl md:text-2xl font-bold mt-6" style={{ color: BRAND_YELLOW }}>Smart Agent Alliance was built differently.</p>
                <p className="text-body text-lg mt-4 leading-relaxed">We invest in real systems, long-term training, and agent collaboration because our incentives are aligned with agent success.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WHYSAA_BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3"><Check3D /><span className="text-body text-sm font-medium">{benefit}</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
            <div className="bento-card relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-1" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(40px)', transition: 'opacity 0.7s ease-out 0.1s, transform 0.7s ease-out 0.1s' }}>
              <div className="absolute inset-0 overflow-hidden">
                <img src={`${CLOUDFLARE_BASE}/saa-aligned-incentives-value-multiplication/public`} alt="Smart Agent Alliance aligned incentives model" className="bento-image w-full h-full object-cover object-center" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-heading font-bold" style={{ color: BRAND_YELLOW, fontSize: '23px' }}>Aligned Incentives</p>
                <p className="text-body text-xs opacity-70 mt-1">When you succeed, we succeed</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-12" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.7s ease-out 0.3s' }}>
          <p className="text-body max-w-xl mx-auto" style={{ color: '#e5e4dd' }}>Access to SAA systems, training, and community is tied to sponsorship at the time of joining eXp Realty.</p>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: ProvenAtScale
// =============================================================================
const PROVEN_STATS = [
  { text: "One of the fastest-growing sponsor organizations at eXp Realty", icon: TrendingUp },
  { text: "Consistently strong agent retention", icon: Check },
  { text: "Active across the U.S., Canada, Mexico, Australia, and beyond", icon: Globe },
];

// Static counter with H2 neon text styling (no backing plate)
function StaticCounterNeon({ value, suffix = '' }: { value: string; suffix?: string }) {
  // H2-style white core glow text-shadow (no backing plate)
  const textShadow = `
    0 0 1px #fff,
    0 0 2px #fff,
    0 0 4px rgba(255,255,255,0.8),
    0 0 8px rgba(255,255,255,0.4)
  `;

  return (
    <span
      style={{
        fontVariantNumeric: 'tabular-nums',
        color: '#bfbdb0',
        textShadow: textShadow.trim(),
        display: 'inline-block',
        letterSpacing: '0.02em',
      }}
    >
      {value}{suffix}
    </span>
  );
}

function ProvenAtScale() {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <GlassPanel variant="champagne">
      <section className="py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={`${CLOUDFLARE_BASE}/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop`} alt="" aria-hidden="true" className="w-full h-full object-cover" style={{ objectPosition: 'center 55%', maskImage: 'radial-gradient(ellipse 70% 65% at center 50%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 70%, transparent 90%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at center 50%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 70%, transparent 90%)' }} />
        </div>
        <div ref={ref} className="mx-auto relative z-10" style={{ maxWidth: '1300px' }}>
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-40px)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}>
                <H2 className="text-center md:text-left" style={{ justifyContent: 'flex-start' }}>Proven at Scale</H2>
              </div>
              <div className="space-y-4 mb-8">
                {PROVEN_STATS.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="flex items-center gap-4" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-40px)', transition: `opacity 0.8s ease-out ${0.1 + i * 0.1}s, transform 0.8s ease-out ${0.1 + i * 0.1}s` }}>
                      <Icon3D><Icon className="w-6 h-6 flex-shrink-0" /></Icon3D>
                      <p className="text-body">{stat.text}</p>
                    </div>
                  );
                })}
              </div>
              <div className="text-center md:text-left" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-40px)', transition: 'opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s' }}>
                <CTAButton href="#join-the-alliance">Join The Alliance</CTAButton>
              </div>
            </div>
            <div className="md:col-span-4" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(40px)', transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s' }}>
              <CyberCardGold padding="lg">
                <Icon3D><Globe className="w-14 h-14 mx-auto mb-3" /></Icon3D>
                <p className="font-heading text-3xl md:text-4xl font-bold text-heading"><StaticCounterNeon value="3700" suffix="+" /></p>
                <p className="text-body text-base mt-2">Agents Strong</p>
              </CyberCardGold>
            </div>
          </div>
        </div>
      </section>
    </GlassPanel>
  );
}

// =============================================================================
// SECTION: WhatYouGet
// =============================================================================
const BENEFITS = [
  { icon: Users, title: "Connected Leadership and Community", tabLabel: "Connected", description: "Big enough to back you. Small enough to know you. Real access, real wins, real support.", autoAdvanceTime: 6000, bgImage: `${CLOUDFLARE_BASE}/saa-tab-connected-leadership/public` },
  { icon: DollarSign, title: "Passive Income Infrastructure", tabLabel: "Passive", description: "We handle the structure so you can build long-term income without relying solely on transactions.", autoAdvanceTime: 5000, bgImage: `${CLOUDFLARE_BASE}/saa-tab-passive-income/public` },
  { icon: Bot, title: "Done-For-You Production Systems", tabLabel: "Done-For-You", description: "Curated systems designed to save time, not create tech overload.", autoAdvanceTime: 4000, bgImage: `${CLOUDFLARE_BASE}/saa-tab-done-for-you/public` },
  { icon: GraduationCap, title: "Elite Training Libraries", tabLabel: "Elite", description: "AI, social media, investing, and modern production systems, available when you need them.", autoAdvanceTime: 5000, bgImage: `${CLOUDFLARE_BASE}/saa-tab-elite-training/public` },
  { icon: Globe, title: "Private Referrals & Global Collaboration", tabLabel: "Private", description: "Warm introductions and deal flow inside a global agent network.", autoAdvanceTime: 4000, bgImage: `${CLOUDFLARE_BASE}/saa-tab-private-referrals/public` },
];

function WhatYouGet() {
  const [activeTab, setActiveTab] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal(0.5);
  const { ref: cardRef, isVisible: isCardVisible } = useScrollReveal(0.3);

  const activeBenefit = BENEFITS[activeTab];
  const Icon = activeBenefit.icon;

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (userInteracted) return;
    timerRef.current = setTimeout(() => setActiveTab(prev => (prev + 1) % BENEFITS.length), BENEFITS[activeTab].autoAdvanceTime);
  };

  useEffect(() => {
    if (isCardVisible && !userInteracted) startTimer();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeTab, isCardVisible, userInteracted]);

  const handleTabClick = (index: number) => {
    setUserInteracted(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveTab(index);
  };

  return (
    <section className="py-16 md:py-24 px-6 relative">
      <style>{`@keyframes whatYouGetFadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } } .what-you-get-animate { animation: whatYouGetFadeIn 0.3s ease-out forwards; }`}</style>
      <div className="mx-auto relative z-10" style={{ maxWidth: '1300px' }}>
        <div ref={headerRef} className="text-center transition-all duration-700" style={{ opacity: isHeaderVisible ? 1 : 0, transform: isHeaderVisible ? 'translateY(0)' : 'translateY(30px)' }}>
          <H2>What You Get with SAA</H2>
          <p className="text-body opacity-60 mb-8">Smart Agent Alliance provides systems, training, income infrastructure, and collaboration through five core pillars.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 pb-2 mb-6">
          {BENEFITS.map((benefit, i) => {
            const TabIcon = benefit.icon;
            const isActive = activeTab === i;
            return (
              <button key={i} onClick={() => handleTabClick(i)} className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap flex-shrink-0" style={{ backgroundColor: isActive ? BRAND_YELLOW : 'rgba(255,255,255,0.05)', color: isActive ? '#111' : 'rgba(255,255,255,0.7)', border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                {isActive ? <TabIcon className="w-4 h-4" /> : <Icon3D><TabIcon className="w-4 h-4" /></Icon3D>}
                <span className="font-heading font-medium text-sm">{benefit.tabLabel}</span>
              </button>
            );
          })}
        </div>
        <div ref={cardRef} className="transition-all duration-700 mb-10 rounded-2xl border border-white/10 overflow-hidden relative h-[210px] md:h-[190px]" style={{ opacity: isCardVisible ? 1 : 0, transform: isCardVisible ? 'translateY(0)' : 'translateY(20px)' }}>
          <div key={`bg-${activeTab}`} className="absolute inset-0 what-you-get-animate" style={{ backgroundImage: `url(${activeBenefit.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.5) 100%)' }} />
          <div key={activeTab} className="what-you-get-animate relative z-10 flex flex-row items-center gap-6 h-full p-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)', backdropFilter: 'blur(4px)' }}>
              <Icon3D><Icon className="w-8 h-8" /></Icon3D>
            </div>
            <div className="text-left flex-1">
              <h3 className="font-heading text-xl font-bold mb-2" style={{ color: BRAND_YELLOW }}>{activeBenefit.title}</h3>
              <p className="text-body text-base">{activeBenefit.description}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 mb-8">
          {BENEFITS.map((_, i) => (
            <button key={i} onClick={() => handleTabClick(i)} className="w-2 h-2 rounded-full transition-all duration-300" style={{ backgroundColor: i === activeTab ? BRAND_YELLOW : 'rgba(255,255,255,0.2)', transform: i === activeTab ? 'scale(1.5)' : 'scale(1)' }} />
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: WhyOnlyAtExp
// =============================================================================

/**
 * "Why This Only Works at eXp Realty" Section
 * 3D Rotating Card Stack with Scroll-Based Animation
 *
 * Structure:
 * - sectionRef: outer section element
 * - triggerRef: invisible wrapper that gets pinned (no styling)
 * - contentRef: glass panel + content that animates upward together
 */

// Content
const WHY_ONLY_HEADLINE = "Why This Only Works at eXp Realty";
const WHY_ONLY_STEPS = [
  { num: 1, text: "Most real estate brokerages provide tools, training, and support centrally.", highlight: false },
  { num: 2, text: "Even when sponsorship exists, sponsors are limited to offering only what the brokerage provides.", highlight: false },
  { num: 3, text: "eXp Realty sponsorship works differently.", highlight: true },
];
const WHY_ONLY_DIFFERENTIATOR = "eXp Realty Sponsorship is Different.";
const WHY_ONLY_KEY_POINT = "It is the only brokerage that allows sponsors to build and deliver real systems, training, and support. Most sponsors don't use that freedom. Smart Agent Alliance does.";
const WHY_ONLY_TAGLINE = "When you succeed, we succeed.";
const WHY_ONLY_CTA_TEXT = "See Our Systems";

// Images
const ENTREPRENEURIAL_SPONSOR_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-entrepreneurial-sponsor-v2/desktop';
const ENTREPRENEURIAL_SPONSOR_ALT = 'eXp Realty sponsor delivering entrepreneurial systems to real estate agents';
const ENTREPRENEURIAL_SPONSOR_TITLE = 'eXp Realty Entrepreneurial Sponsor Systems';

// Marigold Glass Panel styles (inlined from GlassPanel component)
const WHY_ONLY_GLASS_STYLES: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,190,0,0.032) 0%, rgba(255,190,0,0.04) 50%, rgba(255,190,0,0.032) 100%)',
  boxShadow: `
    0 8px 32px rgba(0,0,0,0.4),
    0 4px 12px rgba(0,0,0,0.25),
    inset 0 1px 0 0 rgba(255,255,255,0.35),
    inset 0 2px 4px 0 rgba(255,255,255,0.2),
    inset 0 8px 20px -8px rgba(255,190,0,0.3),
    inset 0 20px 40px -20px rgba(255,255,255,0.15),
    inset 0 -1px 0 0 rgba(0,0,0,0.7),
    inset 0 -2px 6px 0 rgba(0,0,0,0.5),
    inset 0 -10px 25px -8px rgba(0,0,0,0.6),
    inset 0 -25px 50px -20px rgba(0,0,0,0.45)
  `,
  backdropFilter: 'blur(2px)',
};

// 3D Number Component
function WhyOnlyNumber3D({ num, size = 'medium', dark = false, highlight = false }: { num: number; size?: 'small' | 'medium' | 'large'; dark?: boolean; highlight?: boolean }) {
  const sizeStyles = {
    small: { minWidth: '40px', height: '40px', fontSize: '24px' },
    medium: { minWidth: '56px', height: '56px', fontSize: '32px' },
    large: { minWidth: '72px', height: '72px', fontSize: '42px' },
  };

  const style = sizeStyles[size];

  // Highlight version uses lighter gray for contrast - brighter than the gray circle background
  const highlightColor = '#9a9a9a';
  const highlightFilter = 'drop-shadow(-1px -1px 0 #ccc) drop-shadow(1px 1px 0 #666) drop-shadow(2px 2px 0 #444) drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.5))';

  return (
    <span
      className="inline-flex items-center justify-center font-bold"
      style={{
        ...style,
        color: dark ? '#111' : (highlight ? highlightColor : '#c4a94d'),
        filter: dark
          ? 'none'
          : (highlight ? highlightFilter : 'drop-shadow(-1px -1px 0 #ffe680) drop-shadow(1px 1px 0 #8a7a3d) drop-shadow(3px 3px 0 #2a2a1d) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5))'),
        transform: dark ? 'none' : 'perspective(500px) rotateX(8deg)',
      }}
    >
      {num}
    </span>
  );
}

function WhyOnlyAtExp() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Refs for magnetic effect
  const rawProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const lastRawRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);

  const totalCards = WHY_ONLY_STEPS.length;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Grace period: 10% at start and 10% at end of scroll range
    const GRACE = 0.1;
    const CONTENT_RANGE = 1 - (GRACE * 2); // 80% of scroll for actual card movement

    // Velocity-based magnetic snap
    const animateMagnetic = () => {
      const raw = rawProgressRef.current;
      const lastRaw = lastRawRef.current;
      const currentDisplay = displayProgressRef.current;

      // Calculate velocity (change since last frame)
      const instantVelocity = Math.abs(raw - lastRaw);
      // Smooth velocity with decay
      velocityRef.current = velocityRef.current * 0.9 + instantVelocity * 0.1;
      lastRawRef.current = raw;

      // Card positions are at 0, 0.5, 1 (for 3 cards)
      const cardStep = 1 / (totalCards - 1);
      const nearestCardIndex = Math.round(raw / cardStep);
      const nearestCardProgress = Math.max(0, Math.min(1, nearestCardIndex * cardStep));

      // When velocity is high, follow raw position
      // When velocity is low, snap to nearest card
      const velocityFactor = Math.min(1, velocityRef.current * 100); // 0 = stopped, 1 = scrolling fast

      // Blend between snap target (when stopped) and raw position (when scrolling)
      const targetProgress = nearestCardProgress * (1 - velocityFactor) + raw * velocityFactor;

      // Smooth interpolation toward target
      const newProgress = currentDisplay + (targetProgress - currentDisplay) * 0.15;

      // Always update to keep smooth animation
      if (Math.abs(newProgress - currentDisplay) > 0.0001) {
        displayProgressRef.current = newProgress;
        setProgress(newProgress);
      }

      rafRef.current = requestAnimationFrame(animateMagnetic);
    };

    rafRef.current = requestAnimationFrame(animateMagnetic);

    const ctx = gsap.context(() => {
      // Timeline animates the glass+content together
      const tl = gsap.timeline();

      tl.to(contentRef.current, {
        y: -60, // Drift upward by 60px total (from +30 to -30)
        duration: 1,
        ease: 'none',
      });

      // Use 'center center' - pin starts when section center reaches viewport center
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'center center',
        end: '+=200%', // Extended for more buffer between card flips
        pin: true,
        pinSpacing: true,
        scrub: 0.5, // Faster scrub for more responsive feel
        animation: tl,
        onUpdate: (self) => {
          // Map scroll progress to card progress with grace periods
          let cardProgress = 0;

          if (self.progress <= GRACE) {
            cardProgress = 0;
          } else if (self.progress >= 1 - GRACE) {
            cardProgress = 1;
          } else {
            cardProgress = (self.progress - GRACE) / CONTENT_RANGE;
          }

          // Update raw progress - magnetic loop will interpolate
          rawProgressRef.current = cardProgress;
        },
      });
    }, sectionRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [totalCards]);

  return (
    <section ref={sectionRef}>
      {/* Invisible wrapper that gets pinned */}
      <div ref={triggerRef}>
        {/* Glass panel + content - this entire thing animates upward */}
        <div
          ref={contentRef}
          className="rounded-3xl overflow-hidden relative"
          style={{
            ...WHY_ONLY_GLASS_STYLES,
            transform: 'translateY(30px)', // Start 30px below center
          }}
        >
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              opacity: 0.06,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-6 py-16 md:py-24">
            <div className="mx-auto" style={{ maxWidth: '1600px' }}>
              {/* Section Header */}
              <div className="text-center mb-8">
                <H2 style={{ maxWidth: '100%' }}>{WHY_ONLY_HEADLINE}</H2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Left Column: Card Stack + Progress Bar */}
                <div className="flex flex-col relative" style={{ zIndex: 10 }}>
                  {/* 3D Rotating Card Stack */}
                  <div
                    className="relative h-[280px] md:h-[340px] w-full"
                    style={{ perspective: '1200px' }}
                  >
                    {WHY_ONLY_STEPS.map((step, index) => {
                      const isLastCard = index === totalCards - 1;
                      // Scale so 3rd card (index 2) reaches position 0 when progress = 1
                      // progress * (totalCards - 1) - index: at progress=1, card 2 gets (1*2)-2=0
                      const globalCardPosition = progress * (totalCards - 1) - index;

                      let rotateX = 0, translateZ = 0, translateY = 0, opacity = 1, scale = 1;

                      if (isLastCard) {
                        // Last card: slides up into position, no flip
                        if (globalCardPosition >= 0) {
                          // Card is in final position
                          rotateX = 0;
                          opacity = 1;
                          scale = 1;
                          translateZ = 0;
                          translateY = 0;
                        } else {
                          // Card is still in stack, waiting to slide up
                          const stackPosition = -globalCardPosition;
                          translateZ = -30 * stackPosition;
                          translateY = 20 * stackPosition;
                          opacity = Math.max(0.4, 1 - stackPosition * 0.15);
                          scale = Math.max(0.88, 1 - stackPosition * 0.04);
                        }
                      } else if (globalCardPosition >= 1) {
                        rotateX = -90;
                        opacity = 0;
                        scale = 0.9;
                      } else if (globalCardPosition >= 0) {
                        rotateX = -globalCardPosition * 90;
                        opacity = globalCardPosition > 0.7 ? 1 - ((globalCardPosition - 0.7) / 0.3) : 1;
                        scale = 1 - globalCardPosition * 0.1;
                      } else {
                        const stackPosition = -globalCardPosition;
                        translateZ = -30 * stackPosition;
                        translateY = 20 * stackPosition;
                        opacity = Math.max(0.4, 1 - stackPosition * 0.15);
                        scale = Math.max(0.88, 1 - stackPosition * 0.04);
                      }

                      // Misty vibrant gradient for highlighted card
                      const mistyBackground = `
                        radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
                        radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%),
                        radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%),
                        radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%),
                        linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)
                      `;
                      const darkBackground = 'linear-gradient(180deg, rgba(40,40,40,0.98), rgba(20,20,20,0.99))';

                      return (
                        <div
                          key={index}
                          className="absolute inset-0 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center"
                          style={{
                            background: step.highlight ? mistyBackground : darkBackground,
                            border: step.highlight
                              ? '2px solid rgba(180,150,50,0.5)'
                              : `1px solid ${BRAND_YELLOW}44`,
                            boxShadow: step.highlight
                              ? `0 0 40px 8px rgba(255,200,80,0.4), 0 0 80px 16px rgba(255,180,50,0.25)`
                              : `0 0 40px ${BRAND_YELLOW}15, 0 30px 60px -30px rgba(0,0,0,0.8)`,
                            transform: `perspective(1200px) rotateX(${rotateX}deg) translateZ(${translateZ}px) translateY(${translateY}px) scale(${scale})`,
                            transformOrigin: 'center bottom',
                            opacity,
                            zIndex: totalCards - index,
                            backfaceVisibility: 'hidden',
                            transition: 'background 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out',
                          }}
                        >
                          {step.highlight ? (
                            <div
                              className="rounded-full flex items-center justify-center w-14 h-14 md:w-16 md:h-16 mb-5"
                              style={{
                                backgroundColor: 'rgba(42,42,42,0.9)',
                                border: '3px solid rgba(42,42,42,0.7)',
                                boxShadow: '0 0 30px rgba(0,0,0,0.25), inset 0 0 20px rgba(0,0,0,0.15)',
                              }}
                            >
                              <WhyOnlyNumber3D num={step.num} size="medium" highlight />
                            </div>
                          ) : (
                            <div
                              className="rounded-full flex items-center justify-center w-14 h-14 md:w-16 md:h-16 mb-5"
                              style={{
                                background: 'rgba(255,255,255,0.08)',
                                border: '2px solid rgba(255,255,255,0.15)',
                              }}
                            >
                              <WhyOnlyNumber3D num={step.num} size="medium" />
                            </div>
                          )}
                          <p
                            className="font-heading font-bold leading-relaxed px-2"
                            style={{
                              color: step.highlight ? '#2a2a2a' : '#e5e5e5',
                              fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)',
                            }}
                          >
                            {step.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* 3D Plasma Tube Progress Bar */}
                  <div className="flex justify-center mt-16">
                    <div
                      className="w-64 md:w-80 h-3 rounded-full overflow-hidden relative"
                      style={{
                        background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                        border: '1px solid rgba(245, 245, 240, 0.25)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
                      }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress * 100}%`,
                          background: `linear-gradient(180deg, #ffe566 0%, ${BRAND_YELLOW} 40%, #cc9900 100%)`,
                          boxShadow: `0 0 8px ${BRAND_YELLOW}, 0 0 16px ${BRAND_YELLOW}, 0 0 32px ${BRAND_YELLOW}66, inset 0 1px 2px rgba(255,255,255,0.4)`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Key message card */}
                <figure
                  className="relative rounded-2xl overflow-hidden border border-white/10"
                  style={{ minHeight: '340px', zIndex: 1 }}
                  itemScope
                  itemType="https://schema.org/ImageObject"
                >
                  <div className="absolute inset-0">
                    <img
                      src={ENTREPRENEURIAL_SPONSOR_IMAGE}
                      alt={ENTREPRENEURIAL_SPONSOR_ALT}
                      title={ENTREPRENEURIAL_SPONSOR_TITLE}
                      className="w-full h-full object-cover"
                      itemProp="contentUrl"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 100%)'
                      }}
                    />
                  </div>

                  <figcaption className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center">
                    <p className="font-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: BRAND_YELLOW }}>{WHY_ONLY_DIFFERENTIATOR}</p>
                    <p className="text-body text-lg leading-relaxed mb-4" itemProp="description">{WHY_ONLY_KEY_POINT}</p>
                    <p className="text-body text-xl italic mb-6" style={{ color: BRAND_YELLOW }}>{WHY_ONLY_TAGLINE}</p>
                    <CTAButton href="/exp-realty-sponsor">{WHY_ONLY_CTA_TEXT}</CTAButton>
                  </figcaption>

                  <meta itemProp="name" content={ENTREPRENEURIAL_SPONSOR_TITLE} />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: BuiltForFuture
// =============================================================================

/**
 * "Built for Where Real Estate Is Going" Section
 * Horizontal Scroll Cards with Scroll-Based Animation
 *
 * Structure:
 * - sectionRef: outer section element
 * - BuiltForFutureDataStream: fixed background animation (not pinned)
 * - triggerRef: invisible wrapper that gets pinned (no styling)
 * - contentRef: content that animates upward together
 */

function BuiltForFutureDataStream() {
  const [time, setTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const scrollSpeedRef = useRef(1);
  const lastScrollY = useRef(0);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const BASE_SPEED = 0.00028;
    let lastTimestamp = 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollDelta = Math.abs(currentY - lastScrollY.current);
      lastScrollY.current = currentY;
      scrollSpeedRef.current = 1 + Math.min(scrollDelta * 0.05, 3);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;
      timeRef.current += BASE_SPEED * deltaTime * scrollSpeedRef.current;
      setTime(timeRef.current);
      scrollSpeedRef.current = Math.max(1, scrollSpeedRef.current * 0.95);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const columnCount = isMobile ? 8 : 20;
  const columnWidth = 100 / columnCount;

  const columnConfigs = useMemo(() => [...Array(columnCount)].map((_, i) => ({
    x: i * columnWidth,
    speed: 0.8 + (i % 4) * 0.4,
    offset: (i * 17) % 100,
  })), [columnCount, columnWidth]);

  const getChar = (colIndex: number, charIndex: number) => {
    const flipRate = 0.6 + (colIndex % 3) * 0.3;
    const charSeed = Math.floor(time * 15 * flipRate + colIndex * 7 + charIndex * 13);
    return charSeed % 2 === 0 ? '0' : '1';
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {columnConfigs.map((col, i) => {
        const columnOffset = (time * col.speed * 60 + col.offset) % 110;
        const numChars = 22;
        return (
          <div key={i} className="absolute" style={{ left: col.x + '%', top: 0, width: columnWidth + '%', height: '100%', overflow: 'hidden', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.4' }}>
            {[...Array(numChars)].map((_, j) => {
              const baseY = j * 5;
              const charY = (baseY + columnOffset) % 110 - 10;
              const headPosition = (columnOffset / 5) % numChars;
              const distanceFromHead = (j - headPosition + numChars) % numChars;
              const isHead = distanceFromHead === 0;
              const trailBrightness = isHead ? 1 : Math.max(0, 1 - distanceFromHead * 0.08);
              const edgeFade = charY < 12 ? Math.max(0, charY / 12) : charY > 88 ? Math.max(0, (100 - charY) / 12) : 1;
              const headColor = 'rgba(180,180,180,' + (0.4 * edgeFade) + ')';
              const trailColor = 'rgba(120,120,120,' + (trailBrightness * 0.25 * edgeFade) + ')';
              return (
                <div key={j} style={{ position: 'absolute', top: charY + '%', color: isHead ? headColor : trailColor, textShadow: isHead ? '0 0 6px rgba(150,150,150,' + (0.3 * edgeFade) + ')' : '0 0 2px rgba(100,100,100,' + (0.1 * edgeFade) + ')', opacity: edgeFade }}>
                  {getChar(i, j)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const BUILT_FUTURE_HEADLINE = "Built for Where Real Estate Is Going";
const BUILT_FUTURE_SUBLINE = "The future of real estate is cloud-based, global, and technology-driven. SAA is already there.";

const BUILT_FUTURE_POINTS = [
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-cloud/public', text: "Cloud-First Brokerage Model", imgClass: "w-full h-full object-contain", imgStyle: {}, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-ai-bot/public', text: "AI-Powered Tools and Training", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(1.25) translate(10px, 18px)' }, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-mobile-first/public', text: "Mobile-First Workflows", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(0.95) translate(3px, 10px)' }, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-borderless/public', text: "Borderless Business", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(1.15) translate(-1px, -1px)' }, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-income-benjamins/public', text: "Sustainable Income Beyond Sales", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(1.35) translateX(5px)' }, bgColor: '#111' },
];

function BuiltForFuture() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Refs for magnetic effect
  const rawPositionRef = useRef(0);
  const displayPositionRef = useRef(0);
  const lastRawRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);

  const totalCards = BUILT_FUTURE_POINTS.length;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Grace period: 10% at start and 10% at end of scroll range
    const GRACE = 0.1;
    const CONTENT_RANGE = 1 - (GRACE * 2); // 80% of scroll for actual card movement

    // Velocity-based magnetic snap
    // When velocity is high (scrolling): follow raw position closely
    // When velocity is low (stopped): snap strongly to nearest card
    const animateMagnetic = () => {
      const raw = rawPositionRef.current;
      const lastRaw = lastRawRef.current;
      const currentDisplay = displayPositionRef.current;

      // Calculate velocity (change since last frame)
      const instantVelocity = Math.abs(raw - lastRaw);
      // Smooth velocity with decay
      velocityRef.current = velocityRef.current * 0.9 + instantVelocity * 0.1;
      lastRawRef.current = raw;

      // Find nearest card position
      const nearestCard = Math.round(raw);
      const clampedTarget = Math.max(0, Math.min(totalCards - 1, nearestCard));

      // When velocity is high, follow raw position
      // When velocity is low, snap to nearest card
      // velocityRef.current typically ranges from 0 (stopped) to ~0.1 (fast scroll)
      const velocityFactor = Math.min(1, velocityRef.current * 50); // 0 = stopped, 1 = scrolling fast

      // Blend between snap target (when stopped) and raw position (when scrolling)
      const targetPosition = clampedTarget * (1 - velocityFactor) + raw * velocityFactor;

      // Smooth interpolation toward target
      const newPosition = currentDisplay + (targetPosition - currentDisplay) * 0.15;

      // Always update to keep smooth animation
      if (Math.abs(newPosition - currentDisplay) > 0.001) {
        displayPositionRef.current = newPosition;
        setScrollPosition(newPosition);
      }

      rafRef.current = requestAnimationFrame(animateMagnetic);
    };

    rafRef.current = requestAnimationFrame(animateMagnetic);

    const ctx = gsap.context(() => {
      // Use 'center center' - pin starts when section center reaches viewport center
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'center center',
        end: '+=300%', // Extended to account for grace periods
        pin: true,
        pinSpacing: true,
        scrub: 0.5, // Faster scrub for more responsive feel
        onUpdate: (self) => {
          // Map scroll progress to card positions with grace periods
          let cardPosition = 0;

          if (self.progress <= GRACE) {
            cardPosition = 0;
          } else if (self.progress >= 1 - GRACE) {
            cardPosition = totalCards - 1;
          } else {
            const contentProgress = (self.progress - GRACE) / CONTENT_RANGE;
            cardPosition = contentProgress * (totalCards - 1);
          }

          // Update raw position - magnetic loop will interpolate
          rawPositionRef.current = cardPosition;
        },
      });

      // Subtle Y drift animation
      gsap.to(contentRef.current, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'center center',
          end: '+=300%',
          scrub: 2.5,
        }
      });
    }, sectionRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [totalCards]);

  // Progress for the progress bar
  const progress = scrollPosition / (totalCards - 1);

  // Responsive card width
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Card dimensions - responsive
  const CARD_WIDTH = isMobile ? 280 : 560;
  const CARD_GAP = isMobile ? 16 : 24;

  return (
    <section ref={sectionRef} className="relative pt-16 md:pt-24">
      {/* Fixed background animation - outside pinned content */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <BuiltForFutureDataStream />
      </div>

      {/* Invisible wrapper that gets pinned */}
      <div ref={triggerRef} className="relative" style={{ zIndex: 1 }}>
        {/* Content - animates upward */}
        <div
          ref={contentRef}
          className="relative"
          style={{
            transform: 'translateY(30px)', // Start 30px below center
          }}
        >
          {/* Section Header */}
          <div className="text-center mb-4 px-6">
            <H2 style={{ maxWidth: '100%' }}>{BUILT_FUTURE_HEADLINE}</H2>
          </div>
          <p className="text-body opacity-70 mb-12 text-center max-w-2xl mx-auto px-6">
            {BUILT_FUTURE_SUBLINE}
          </p>

          {/* Horizontal Scroll Cards Container with Portal Edges */}
          <div className="relative">
            {/* 3D Curved Portal Edges - raised bars that cards slide under */}
            {/* Left curved bar */}
            <div
              className="absolute left-0 z-20 pointer-events-none"
              style={{
                top: '-40px',
                bottom: '-40px',
                width: '12px',
                borderRadius: '0 12px 12px 0',
                background: 'linear-gradient(90deg, rgba(30,28,20,0.95) 0%, rgba(40,35,25,0.9) 100%)',
                borderRight: '1px solid rgba(255,190,0,0.3)',
                boxShadow: '3px 0 12px rgba(0,0,0,0.6), 6px 0 24px rgba(0,0,0,0.3)',
                transform: 'perspective(500px) rotateY(-3deg)',
                transformOrigin: 'right center',
              }}
            />
            {/* Right curved bar */}
            <div
              className="absolute right-0 z-20 pointer-events-none"
              style={{
                top: '-40px',
                bottom: '-40px',
                width: '12px',
                borderRadius: '12px 0 0 12px',
                background: 'linear-gradient(270deg, rgba(30,28,20,0.95) 0%, rgba(40,35,25,0.9) 100%)',
                borderLeft: '1px solid rgba(255,190,0,0.3)',
                boxShadow: '-3px 0 12px rgba(0,0,0,0.6), -6px 0 24px rgba(0,0,0,0.3)',
                transform: 'perspective(500px) rotateY(3deg)',
                transformOrigin: 'left center',
              }}
            />

            {/* Inner container - clips cards horizontally at inner edge of bars, but allows vertical overflow for glow */}
            <div
              className="relative"
              style={{
                marginLeft: '12px',
                marginRight: '12px',
                overflowX: 'clip',
                overflowY: 'visible',
              }}
            >
              {/* Cards track */}
              <div className="py-12">
                <div
                  className="flex"
                  style={{
                    gap: `${CARD_GAP}px`,
                    // Offset for looped cards on left (2 cards worth), then center current card
                    // 50vw centers in viewport, subtract half card width, subtract margin, subtract position offset
                    transform: `translateX(calc(50vw - ${CARD_WIDTH / 2}px - 12px - ${(scrollPosition + 2) * (CARD_WIDTH + CARD_GAP)}px))`,
                  }}
                >
                  {/* Create looped array: last 2 cards + all cards + first 2 cards */}
                  {(() => {
                    const loopedCards = [
                      ...BUILT_FUTURE_POINTS.slice(-2), // Last 2 cards at start
                      ...BUILT_FUTURE_POINTS,            // All cards
                      ...BUILT_FUTURE_POINTS.slice(0, 2) // First 2 cards at end
                    ];

                    return loopedCards.map((point, loopIndex) => {
                      // Calculate the actual card index relative to scroll position
                      // loopIndex 0,1 are the prepended cards (indices -2, -1)
                      // loopIndex 2 to totalCards+1 are the real cards (indices 0 to totalCards-1)
                      // loopIndex totalCards+2 onwards are appended cards
                      const actualIndex = loopIndex - 2;
                      const distance = Math.abs(scrollPosition - actualIndex);
                      const isActive = distance < 0.5;

                      // Scale based on distance from center
                      const scale = Math.max(0.85, 1 - distance * 0.1);

                      // Blur for non-active cards - fast transition, reduced max blur for readability
                      // At distance 0.5+, full blur (5px). At distance 0, no blur.
                      const blurAmount = Math.min(5, distance * 10);

                      // Smart blackout for looped cards based on scroll position
                      // At start (card 0): black out cards to the left (actualIndex < 0)
                      // At end (card 4): black out cards to the right (actualIndex > 4)
                      let blackoutOpacity = 0;
                      if (actualIndex < 0) {
                        // Prepended cards (left side) - fade out as we approach the start
                        // When scrollPosition is 0, fully black. When scrollPosition > 1, visible.
                        blackoutOpacity = Math.max(0, 1 - scrollPosition);
                      } else if (actualIndex > totalCards - 1) {
                        // Appended cards (right side) - fade out as we approach the end
                        // When scrollPosition is 4, fully black. When scrollPosition < 3, visible.
                        blackoutOpacity = Math.max(0, (scrollPosition - (totalCards - 2)) / 1);
                      }

                      // Mystic fog gradient for active card - 90% opacity (10% transparent)
                      const activeBackground = `
                        radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
                        radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%),
                        radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%),
                        radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%),
                        linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)
                      `;
                      const inactiveBackground = `linear-gradient(180deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98))`;

                      return (
                        <div
                          key={`${point.text}-${loopIndex}`}
                          className="flex-shrink-0"
                          style={{
                            width: `${CARD_WIDTH}px`,
                            transform: `scale(${scale})`,
                            filter: `blur(${blurAmount + blackoutOpacity * 4}px) grayscale(${blackoutOpacity * 100}%) brightness(${1 - blackoutOpacity * 0.6})`,
                            opacity: 1 - blackoutOpacity * 0.4,
                            transition: 'transform 0.1s ease-out, filter 0.15s ease-out, opacity 0.15s ease-out',
                          }}
                        >
                          <div
                            className="p-8 rounded-2xl min-h-[380px] flex flex-col items-center justify-center relative overflow-hidden"
                            style={{
                              background: isActive ? activeBackground : inactiveBackground,
                              border: isActive ? '2px solid rgba(180,150,50,0.5)' : `2px solid ${BRAND_YELLOW}22`,
                              boxShadow: isActive
                                ? `0 0 40px 8px rgba(255,200,80,0.4), 0 0 80px 16px rgba(255,180,50,0.25)`
                                : 'none',
                              transition: 'background 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out',
                            }}
                          >
                            {/* Circled Image */}
                            <div
                              className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] rounded-full mb-6 flex items-center justify-center overflow-hidden relative z-10"
                              style={{
                                backgroundColor: isActive ? 'rgba(20,18,12,0.85)' : point.bgColor,
                                border: isActive ? '3px solid rgba(40,35,20,0.8)' : `3px solid ${BRAND_YELLOW}`,
                                boxShadow: isActive
                                  ? `0 0 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2)`
                                  : 'none',
                                transition: 'background-color 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out',
                              }}
                            >
                              <img
                                src={point.image}
                                alt={point.text}
                                className={point.imgClass}
                                style={point.imgStyle}
                              />
                            </div>

                            {/* Text */}
                            <h3
                              className="text-h5 font-bold text-center relative z-10"
                              style={{
                                color: isActive ? '#2a2a2a' : '#e5e4dd',
                                transition: 'color 0.2s ease-out',
                              }}
                            >
                              {point.text}
                            </h3>

                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* 3D Plasma Tube Progress Bar */}
          <div className="flex justify-center mt-8 px-6">
            <div
              className="w-64 md:w-80 h-3 rounded-full overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                border: '1px solid rgba(245, 245, 240, 0.25)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
              }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress * 100}%`,
                  background: `linear-gradient(180deg, #ffe566 0%, ${BRAND_YELLOW} 40%, #cc9900 100%)`,
                  boxShadow: `0 0 8px ${BRAND_YELLOW}, 0 0 16px ${BRAND_YELLOW}, 0 0 32px ${BRAND_YELLOW}66, inset 0 1px 2px rgba(255,255,255,0.4)`,
                }}
              />
            </div>
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
  { name: "Doug Smart", title: "Co-Founder & Full-Stack Developer", bio: "Top 1% eXp team builder. Designed and built this website, the agent portal, and the systems and automations powering production workflows and attraction tools across the organization.", image: `${CLOUDFLARE_BASE}/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public` },
  { name: "Karrie Hill, JD", title: "Co-Founder & eXp Certified Mentor", bio: "UC Berkeley Law (top 5%). Built a six-figure real estate business in her first full year without cold calling or door knocking, now helping agents do the same.", image: `${CLOUDFLARE_BASE}/4e2a3c105e488654-Karrie-Profile-Picture.png/public` },
];

function MeetTheFounders() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <GlassPanel variant="marigoldCrosshatch">
      <style>{`@keyframes h1GlowBreathe { 0%, 100% { filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25)); } 50% { filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(255, 215, 0, 0.45)); } }`}</style>
      <section ref={ref} className="py-16 md:py-24 px-6 relative">
        <div className="mx-auto relative z-10" style={{ maxWidth: '1300px' }}>
          <div className="text-center transition-all duration-700 mb-12" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
            <H2>Meet SAA's Founders</H2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="transition-all duration-700" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-30px)', transitionDelay: '0.3s' }}>
              <div className="p-6 md:p-8 rounded-2xl border text-center hover:border-yellow-500/30 transition-colors duration-300 h-full flex flex-col" style={{ backgroundColor: 'rgba(20,20,20,0.75)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <ProfileCyberFrame size="lg" index={0}>
                  <img src={FOUNDERS[0].image} alt={FOUNDERS[0].name} className="w-full h-full object-cover" />
                </ProfileCyberFrame>
                <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-taskor), sans-serif', fontSize: 'clamp(27px, calc(25.36px + 0.65vw), 45px)', lineHeight: 1.3, color: BRAND_YELLOW, transform: 'perspective(800px) rotateX(12deg)', fontFeatureSettings: '"ss01" 1', textShadow: `0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8), 0 0 0.05em #ffd700, 0 0 0.09em rgba(255, 215, 0, 0.8), 0 0 0.13em rgba(255, 215, 0, 0.55), 0 0 0.18em rgba(255, 179, 71, 0.35), 0.03em 0.03em 0 #2a2a2a, 0.045em 0.045em 0 #1a1a1a, 0.06em 0.06em 0 #0f0f0f, 0.075em 0.075em 0 #080808`, filter: 'drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25))', animation: 'h1GlowBreathe 4s ease-in-out infinite' }}>{FOUNDERS[0].name}</h3>
                <p className="text-body text-sm opacity-60 mb-3">{FOUNDERS[0].title}</p>
                <p className="text-body text-sm md:text-base leading-relaxed flex-1">{FOUNDERS[0].bio}</p>
              </div>
            </div>
            <div className="transition-all duration-700 flex flex-col gap-6" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(30px)', transitionDelay: '0.5s' }}>
              <div className="p-6 md:p-8 rounded-2xl border text-center hover:border-yellow-500/30 transition-colors duration-300 flex-1 flex flex-col" style={{ backgroundColor: 'rgba(20,20,20,0.75)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <ProfileCyberFrame size="lg" index={1}>
                  <img src={FOUNDERS[1].image} alt={FOUNDERS[1].name} className="w-full h-full object-cover" />
                </ProfileCyberFrame>
                <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-taskor), sans-serif', fontSize: 'clamp(27px, calc(25.36px + 0.65vw), 45px)', lineHeight: 1.3, color: BRAND_YELLOW, transform: 'perspective(800px) rotateX(12deg)', fontFeatureSettings: '"ss01" 1', textShadow: `0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8), 0 0 0.05em #ffd700, 0 0 0.09em rgba(255, 215, 0, 0.8), 0 0 0.13em rgba(255, 215, 0, 0.55), 0 0 0.18em rgba(255, 179, 71, 0.35), 0.03em 0.03em 0 #2a2a2a, 0.045em 0.045em 0 #1a1a1a, 0.06em 0.06em 0 #0f0f0f, 0.075em 0.075em 0 #080808`, filter: 'drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25))', animation: 'h1GlowBreathe 4s ease-in-out infinite' }}>{FOUNDERS[1].name}</h3>
                <p className="text-body text-sm opacity-60 mb-3">{FOUNDERS[1].title}</p>
                <p className="text-body text-sm md:text-base leading-relaxed flex-1">{FOUNDERS[1].bio}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GlassPanel>
  );
}

// =============================================================================
// COMPONENT: SecondaryButton (Inlined)
// =============================================================================
function SecondaryButton({ href = '#', children, className = '', onClick, as = 'a' }: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  as?: 'a' | 'button';
}) {
  const [lightPulseDelay, setLightPulseDelay] = useState('0s');
  useEffect(() => {
    setLightPulseDelay(`${(Math.random() * 1.5).toFixed(2)}s`);
  }, []);

  const buttonStyles: React.CSSProperties = {
    color: 'var(--text-color-button, var(--color-headingText))',
    fontSize: 'var(--font-size-button, 20px)',
    fontFamily: 'var(--font-family-button, var(--font-taskor), Taskor, system-ui, sans-serif)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 'var(--letter-spacing-button, 0.05em)',
    lineHeight: '1',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'clamp(45px, calc(43.182px + 0.7273vw), 65px)',
    paddingLeft: '1.25rem',
    paddingRight: '1.25rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    backgroundColor: 'rgb(45,45,45)',
    borderRadius: '0.75rem',
    boxShadow: '0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
    overflow: 'hidden',
    zIndex: 10,
    whiteSpace: 'nowrap',
  };

  const buttonClasses = `relative flex justify-center items-center px-5 py-2 bg-[rgb(45,45,45)] rounded-xl border-t border-b border-white/10 text-button uppercase tracking-wide z-10 shadow-[0_15px_15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.5)] transition-all duration-500 overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-l before:from-white/15 before:to-transparent before:w-1/2 before:skew-x-[45deg]`;

  return (
    <div className={`group relative py-2 ${className}`}>
      <div className="relative inline-block">
        {as === 'button' ? (
          <button type="button" onClick={onClick as (e: React.MouseEvent<HTMLButtonElement>) => void} className={buttonClasses} style={buttonStyles}>{children}</button>
        ) : (
          <a href={href} onClick={onClick as (e: React.MouseEvent<HTMLAnchorElement>) => void} className={buttonClasses} style={buttonStyles}>{children}</a>
        )}
        <div className="cta-light-bar cta-light-bar-pulse cta-light-bar-side rounded-md transition-all duration-500" style={{ position: 'absolute', top: '50%', left: '-5px', transform: 'translateY(-50%)', width: '10px', height: '18px', background: '#ffd700', borderRadius: '6px', animationDelay: lightPulseDelay, zIndex: 5 }} />
        <div className="cta-light-bar cta-light-bar-pulse cta-light-bar-side rounded-md transition-all duration-500" style={{ position: 'absolute', top: '50%', right: '-5px', transform: 'translateY(-50%)', width: '10px', height: '18px', background: '#ffd700', borderRadius: '6px', animationDelay: lightPulseDelay, zIndex: 5 }} />
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENT: JoinModal (Inlined)
// =============================================================================
interface JoinFormData { firstName: string; lastName: string; email: string; country: string; }

const JOIN_MODAL_STYLES: Record<string, React.CSSProperties> = {
  container: { position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' },
  backdrop: { position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(8px)' },
  modalWrapper: { position: 'relative', zIndex: 100001, maxWidth: '500px', width: '100%', maxHeight: '90vh', margin: 'auto' },
  modal: { position: 'relative', background: '#151517', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '2.5rem 2rem 2rem 2rem', width: '100%', maxHeight: '90vh', overflowY: 'auto' as const, overscrollBehavior: 'contain', boxSizing: 'border-box' as const },
  closeBtn: { position: 'absolute', top: '-12px', right: '-12px', width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', padding: 0, margin: 0, background: 'rgba(40, 40, 40, 0.95)', border: '2px solid rgba(255, 255, 255, 0.3)', borderRadius: '50%', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100005, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', outline: 'none', boxSizing: 'border-box' as const, pointerEvents: 'auto' as const },
  title: { fontFamily: 'var(--font-family-h3, var(--font-amulya), system-ui, sans-serif)', fontSize: 'clamp(1.25rem, calc(1.1rem + 0.5vw), 1.75rem)', fontWeight: 700, lineHeight: 1.3, color: 'var(--text-color-h3, #e5e4dd)', margin: 0, marginBottom: '0.35rem' },
  subtitle: { fontFamily: 'var(--font-synonym, system-ui), sans-serif', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0, marginBottom: '1.25rem' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  formGroup: { marginBottom: '0.75rem' },
  label: { display: 'block', fontFamily: 'var(--font-synonym, system-ui), sans-serif', fontSize: '0.8rem', color: '#fff', marginBottom: '0.35rem' },
  input: { width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#fff', fontFamily: 'var(--font-synonym, system-ui), sans-serif', fontSize: '0.9rem', boxSizing: 'border-box' as const, outline: 'none' },
  select: { width: '100%', padding: '0.5rem 0.75rem', paddingRight: '2rem', background: '#1a1a1c', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#fff', fontFamily: 'var(--font-synonym, system-ui), sans-serif', fontSize: '0.9rem', boxSizing: 'border-box' as const, WebkitAppearance: 'none' as const, MozAppearance: 'none' as const, appearance: 'none' as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', cursor: 'pointer', outline: 'none' },
  option: { background: '#1a1a1c', color: '#fff' },
  submit: { width: '100%', marginTop: '1rem', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, #ffd700, #e6c200)', color: '#2a2a2a', fontFamily: 'var(--font-taskor, system-ui), sans-serif', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' as const, border: 'none', borderRadius: '6px', cursor: 'pointer' },
  submitDisabled: { opacity: 0.7, cursor: 'not-allowed' },
  msgSuccess: { marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', textAlign: 'center' as const, fontSize: '0.9rem', background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88' },
  msgError: { marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', textAlign: 'center' as const, fontSize: '0.9rem', background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444' },
};

function JoinModal({ isOpen, onClose, onSuccess, sponsorName = null, apiEndpoint = '/api/join-team' }: { isOpen: boolean; onClose: () => void; onSuccess?: (data: JoinFormData) => void; sponsorName?: string | null; apiEndpoint?: string; }) {
  const [formData, setFormData] = useState<JoinFormData>({ firstName: '', lastName: '', email: '', country: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    if (isOpen && !hasCheckedStorage) {
      setHasCheckedStorage(true);
      try {
        const stored = localStorage.getItem('saa_join_submitted');
        if (stored) { const savedData = JSON.parse(stored) as JoinFormData; onClose(); onSuccess?.(savedData); }
      } catch {}
    }
    if (!isOpen) setHasCheckedStorage(false);
  }, [isOpen, hasCheckedStorage, onClose, onSuccess]);

  useEffect(() => {
    if (isOpen) { document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; window.dispatchEvent(new CustomEvent('saa-modal-open')); }
    else { document.documentElement.style.overflow = ''; document.body.style.overflow = ''; window.dispatchEvent(new CustomEvent('saa-modal-close')); }
    return () => { document.documentElement.style.overflow = ''; document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true); setMessage(null);
    try {
      const response = await fetch(apiEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, country: formData.country, sponsorName }) });
      const result = await response.json();
      if (result.success) {
        try { localStorage.setItem('saa_join_submitted', JSON.stringify(formData)); } catch {}
        setMessage({ type: 'success', text: 'Thank you! We will be in touch soon.' });
        onSuccess?.(formData);
        setTimeout(() => { onClose(); setFormData({ firstName: '', lastName: '', email: '', country: '' }); setMessage(null); }, 2500);
      } else { setMessage({ type: 'error', text: result.error || 'Something went wrong. Please try again.' }); }
    } catch { setMessage({ type: 'error', text: 'Network error. Please check your connection.' }); }
    finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;
  return (
    <div style={JOIN_MODAL_STYLES.container} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} onWheel={(e) => e.stopPropagation()}>
      <div style={JOIN_MODAL_STYLES.backdrop} />
      <div style={JOIN_MODAL_STYLES.modalWrapper} onClick={e => e.stopPropagation()}>
        <div style={JOIN_MODAL_STYLES.modal} onWheel={(e) => e.stopPropagation()}>
          <button type="button" style={JOIN_MODAL_STYLES.closeBtn} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{pointerEvents: 'none', display: 'block', flexShrink: 0}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <h3 style={JOIN_MODAL_STYLES.title}>Join Smart Agent Alliance</h3>
          <p style={JOIN_MODAL_STYLES.subtitle}>Take the first step towards building your dream career at eXp Realty.</p>
          <form onSubmit={handleSubmit}>
            <div style={JOIN_MODAL_STYLES.formRow}>
              <div style={JOIN_MODAL_STYLES.formGroup}><label style={JOIN_MODAL_STYLES.label} htmlFor="firstName">First Name *</label><input type="text" id="firstName" name="firstName" style={JOIN_MODAL_STYLES.input} value={formData.firstName} onChange={handleInputChange} required /></div>
              <div style={JOIN_MODAL_STYLES.formGroup}><label style={JOIN_MODAL_STYLES.label} htmlFor="lastName">Last Name *</label><input type="text" id="lastName" name="lastName" style={JOIN_MODAL_STYLES.input} value={formData.lastName} onChange={handleInputChange} required /></div>
            </div>
            <div style={JOIN_MODAL_STYLES.formGroup}><label style={JOIN_MODAL_STYLES.label} htmlFor="email">Email *</label><input type="email" id="email" name="email" style={JOIN_MODAL_STYLES.input} value={formData.email} onChange={handleInputChange} required /></div>
            <div style={JOIN_MODAL_STYLES.formGroup}>
              <label style={JOIN_MODAL_STYLES.label} htmlFor="country">Country *</label>
              <select id="country" name="country" style={JOIN_MODAL_STYLES.select} value={formData.country} onChange={handleInputChange} required>
                <option value="" style={JOIN_MODAL_STYLES.option}>Select country</option>
                <option value="US" style={JOIN_MODAL_STYLES.option}>United States</option>
                <option value="CA" style={JOIN_MODAL_STYLES.option}>Canada</option>
                <option value="UK" style={JOIN_MODAL_STYLES.option}>United Kingdom</option>
                <option value="AU" style={JOIN_MODAL_STYLES.option}>Australia</option>
                <option value="other" style={JOIN_MODAL_STYLES.option}>Other</option>
              </select>
            </div>
            <button type="submit" style={{ ...JOIN_MODAL_STYLES.submit, ...(isSubmitting ? JOIN_MODAL_STYLES.submitDisabled : {}) }} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Get Started'}</button>
            {message && <div style={message.type === 'success' ? JOIN_MODAL_STYLES.msgSuccess : JOIN_MODAL_STYLES.msgError}>{message.text}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENT: InstructionsModal (Inlined)
// =============================================================================
const INSTRUCTIONS_MODAL_STYLES: Record<string, React.CSSProperties> = {
  container: { position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' as const, overscrollBehavior: 'contain' },
  backdrop: { position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(8px)' },
  modalWrapper: { position: 'relative', zIndex: 100001, maxWidth: '520px', width: '100%', maxHeight: '90vh', margin: 'auto' },
  modal: { position: 'relative', background: '#151517', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '2.5rem 2rem 2rem 2rem', width: '100%', maxHeight: '90vh', overflowY: 'auto' as const, overscrollBehavior: 'contain', textAlign: 'center' as const, boxSizing: 'border-box' as const },
  closeBtn: { position: 'absolute' as const, top: '-12px', right: '-12px', width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', padding: 0, margin: 0, background: 'rgba(40, 40, 40, 0.95)', border: '2px solid rgba(255, 255, 255, 0.3)', borderRadius: '50%', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100005, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', outline: 'none', boxSizing: 'border-box' as const, pointerEvents: 'auto' as const },
  successIcon: { width: '64px', height: '64px', margin: '0 auto 1.25rem', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'var(--font-family-h3, var(--font-amulya), system-ui, sans-serif)', fontSize: 'clamp(1.25rem, calc(1.1rem + 0.5vw), 1.75rem)', fontWeight: 700, lineHeight: 1.3, color: 'var(--text-color-h3, #e5e4dd)', margin: 0, marginBottom: '0.35rem' },
  subtitle: { fontFamily: 'var(--font-synonym, system-ui), sans-serif', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0, marginBottom: '1.5rem' },
  instructionsList: { textAlign: 'left' as const, marginBottom: '1.5rem' },
  instructionItem: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  instructionNumber: { flexShrink: 0, width: '28px', height: '28px', background: 'linear-gradient(135deg, #ffd700, #e6c200)', color: '#2a2a2a', fontWeight: 700, fontSize: '0.85rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  instructionContent: { flex: 1 },
  instructionTitle: { display: 'block', color: '#fff', fontFamily: 'var(--font-amulya, system-ui), sans-serif', fontSize: '0.95rem', marginBottom: '0.2rem' },
  instructionText: { color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 },
  cta: { width: '100%', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, #ffd700, #e6c200)', color: '#2a2a2a', fontFamily: 'var(--font-taskor, system-ui), sans-serif', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' as const, border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'block', textDecoration: 'none', textAlign: 'center' as const },
  footer: { marginTop: '1.25rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' },
};

function InstructionsModal({ isOpen, onClose, userName = 'Agent', sponsorEmail = AGENT_EXP_EMAIL, sponsorFullName = AGENT_FULL_NAME }: { isOpen: boolean; onClose: () => void; userName?: string; sponsorEmail?: string; sponsorFullName?: string; }) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) { document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; window.dispatchEvent(new CustomEvent('saa-modal-open')); }
    else { document.documentElement.style.overflow = ''; document.body.style.overflow = ''; window.dispatchEvent(new CustomEvent('saa-modal-close')); }
    return () => { document.documentElement.style.overflow = ''; document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Native DOM event listener for close button - bypasses React synthetic events
  useEffect(() => {
    const btn = closeBtnRef.current;
    if (!btn || !isOpen) return;
    const handleClick = (e: Event) => { e.preventDefault(); e.stopPropagation(); onClose(); };
    btn.addEventListener('click', handleClick);
    btn.addEventListener('touchend', handleClick);
    return () => { btn.removeEventListener('click', handleClick); btn.removeEventListener('touchend', handleClick); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div style={INSTRUCTIONS_MODAL_STYLES.container} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} onWheel={(e) => e.stopPropagation()}>
      <div style={INSTRUCTIONS_MODAL_STYLES.backdrop} />
      <div style={INSTRUCTIONS_MODAL_STYLES.modalWrapper}>
        <button ref={closeBtnRef} type="button" style={INSTRUCTIONS_MODAL_STYLES.closeBtn} aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{pointerEvents: 'none', display: 'block', flexShrink: 0}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div style={INSTRUCTIONS_MODAL_STYLES.modal} onWheel={(e) => e.stopPropagation()}>
          <div style={INSTRUCTIONS_MODAL_STYLES.successIcon}><svg style={{ width: '32px', height: '32px', stroke: '#00ff88' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
          <h3 style={INSTRUCTIONS_MODAL_STYLES.title}>Welcome, {userName}!</h3>
          <p style={INSTRUCTIONS_MODAL_STYLES.subtitle}>Follow these steps to join Smart Agent Alliance at eXp Realty.</p>
          <div style={INSTRUCTIONS_MODAL_STYLES.instructionsList}>
            <div style={INSTRUCTIONS_MODAL_STYLES.instructionItem}><div style={INSTRUCTIONS_MODAL_STYLES.instructionNumber}>1</div><div style={INSTRUCTIONS_MODAL_STYLES.instructionContent}><strong style={INSTRUCTIONS_MODAL_STYLES.instructionTitle}>Start Your Application</strong><p style={INSTRUCTIONS_MODAL_STYLES.instructionText}>Visit <a href="https://joinapp.exprealty.com/" target="_blank" rel="noopener noreferrer" style={{color: '#ffd700'}}>joinapp.exprealty.com</a> to begin your eXp Realty application.</p></div></div>
            <div style={INSTRUCTIONS_MODAL_STYLES.instructionItem}><div style={INSTRUCTIONS_MODAL_STYLES.instructionNumber}>2</div><div style={INSTRUCTIONS_MODAL_STYLES.instructionContent}><strong style={INSTRUCTIONS_MODAL_STYLES.instructionTitle}>Search for Your Sponsor</strong><p style={INSTRUCTIONS_MODAL_STYLES.instructionText}>Enter <strong style={{color: '#fff'}}>{sponsorEmail}</strong> and click Search. Select <strong style={{color: '#fff'}}>{sponsorFullName}</strong> as your sponsor.</p></div></div>
            <div style={INSTRUCTIONS_MODAL_STYLES.instructionItem}><div style={INSTRUCTIONS_MODAL_STYLES.instructionNumber}>3</div><div style={INSTRUCTIONS_MODAL_STYLES.instructionContent}><strong style={INSTRUCTIONS_MODAL_STYLES.instructionTitle}>Complete Your Application</strong><p style={INSTRUCTIONS_MODAL_STYLES.instructionText}>Fill out the application form and submit. You'll receive a confirmation email from eXp.</p></div></div>
            <div style={INSTRUCTIONS_MODAL_STYLES.instructionItem}><div style={INSTRUCTIONS_MODAL_STYLES.instructionNumber}>4</div><div style={INSTRUCTIONS_MODAL_STYLES.instructionContent}><strong style={INSTRUCTIONS_MODAL_STYLES.instructionTitle}>Activate Your Agent Portal</strong><p style={INSTRUCTIONS_MODAL_STYLES.instructionText}>Once your license transfers, you'll receive an email to activate your Smart Agent Alliance portal with all your onboarding materials and resources.</p></div></div>
            <div style={{...INSTRUCTIONS_MODAL_STYLES.instructionItem, marginBottom: 0}}><div style={INSTRUCTIONS_MODAL_STYLES.instructionNumber}>5</div><div style={INSTRUCTIONS_MODAL_STYLES.instructionContent}><strong style={INSTRUCTIONS_MODAL_STYLES.instructionTitle}>eXp Realty Support</strong><p style={INSTRUCTIONS_MODAL_STYLES.instructionText}>For application issues, call <strong style={{color: '#fff'}}>833-303-0610</strong> or email <a href="mailto:expertcare@exprealty.com" style={{color: '#ffd700'}}>expertcare@exprealty.com</a>.</p></div></div>
          </div>
          <a href="https://joinapp.exprealty.com/" target="_blank" rel="noopener noreferrer" style={INSTRUCTIONS_MODAL_STYLES.cta}>Join eXp with SAA</a>
          <p style={INSTRUCTIONS_MODAL_STYLES.footer}>Questions? Email us at <a style={{color: '#ffd700', textDecoration: 'none'}} href="mailto:team@smartagentalliance.com">team@smartagentalliance.com</a></p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENT: VideoPlayer (Inlined with full functionality)
// =============================================================================
declare global { interface Window { Stream?: (iframe: HTMLIFrameElement) => StreamPlayerType; } }
interface StreamPlayerType { play: () => void; pause: () => void; currentTime: number; duration: number; volume: number; muted: boolean; addEventListener: (event: string, callback: () => void) => void; removeEventListener: (event: string, callback: () => void) => void; }

function VideoPlayer({ videoId, posterUrl, storageKey = 'saa_video', unlockThreshold = 50, onThresholdReached, className = '', hideProgressArea = false }: {
  videoId: string; posterUrl?: string; storageKey?: string; unlockThreshold?: number; onThresholdReached?: () => void; className?: string; hideProgressArea?: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<StreamPlayerType | null>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [thresholdReached, setThresholdReached] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [scrubberPosition, setScrubberPosition] = useState(0);

  const savedPositionRef = useRef<number>(0);
  const maxWatchedTimeRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const thresholdReachedRef = useRef<boolean>(false);

  useEffect(() => {
    const savedProgress = parseFloat(localStorage.getItem(`${storageKey}_progress`) || '0');
    const savedMaxTime = parseFloat(localStorage.getItem(`${storageKey}_maxTime`) || '0');
    const savedPosition = parseFloat(localStorage.getItem(`${storageKey}_position`) || '0');
    setProgress(savedProgress); progressRef.current = savedProgress;
    setMaxWatchedTime(savedMaxTime); maxWatchedTimeRef.current = savedMaxTime;
    savedPositionRef.current = savedPosition;
    if (savedProgress >= unlockThreshold) { setThresholdReached(true); thresholdReachedRef.current = true; }
  }, [storageKey, unlockThreshold]);

  const initializePlayer = useCallback(() => {
    if (!iframeRef.current || !window.Stream) return;
    const player = window.Stream(iframeRef.current);
    playerRef.current = player; setIsLoaded(true);
    player.addEventListener('play', () => setIsPlaying(true));
    player.addEventListener('pause', () => setIsPlaying(false));
    player.addEventListener('ended', () => setIsPlaying(false));
    player.addEventListener('loadedmetadata', () => {
      setDuration(player.duration || 0);
      if (savedPositionRef.current > 0 && player.duration > 0) {
        const targetTime = Math.min(savedPositionRef.current, player.duration - 1);
        if (targetTime > 0) player.currentTime = targetTime;
      }
    });
    player.addEventListener('volumechange', () => { setVolume(player.volume); setIsMuted(player.muted); });
    player.addEventListener('timeupdate', () => {
      const time = player.currentTime || 0;
      setCurrentTime(time); setDuration(player.duration || 0); setScrubberPosition(time);
      localStorage.setItem(`${storageKey}_position`, time.toString());
      if (player.duration > 0 && time > maxWatchedTimeRef.current) {
        const newMaxTime = time;
        setMaxWatchedTime(newMaxTime); maxWatchedTimeRef.current = newMaxTime;
        localStorage.setItem(`${storageKey}_maxTime`, newMaxTime.toString());
        const pct = (newMaxTime / player.duration) * 100;
        if (pct > progressRef.current) {
          setProgress(pct); progressRef.current = pct;
          localStorage.setItem(`${storageKey}_progress`, pct.toString());
          if (pct >= unlockThreshold && !thresholdReachedRef.current) {
            setThresholdReached(true); thresholdReachedRef.current = true; onThresholdReached?.();
          }
        }
      }
    });
  }, [storageKey, unlockThreshold, onThresholdReached]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Stream) {
      const script = document.createElement('script');
      script.src = 'https://embed.cloudflarestream.com/embed/sdk.latest.js';
      script.async = true;
      script.onload = () => { if (iframeRef.current && window.Stream) initializePlayer(); };
      document.head.appendChild(script);
    } else if (window.Stream && iframeRef.current) { initializePlayer(); }
  }, [initializePlayer]);

  const togglePlayPause = useCallback(() => { if (!playerRef.current) return; if (isPlaying) playerRef.current.pause(); else playerRef.current.play(); }, [isPlaying]);
  const handleRewind = useCallback(() => { if (!playerRef.current) return; playerRef.current.currentTime = Math.max(0, playerRef.current.currentTime - 15); }, []);
  const handleRestart = useCallback(() => { if (!playerRef.current) return; playerRef.current.currentTime = 0; }, []);
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { if (!playerRef.current) return; const newVolume = parseFloat(e.target.value); playerRef.current.volume = newVolume; playerRef.current.muted = newVolume === 0; setVolume(newVolume); setIsMuted(newVolume === 0); }, []);
  const toggleMute = useCallback(() => { if (!playerRef.current) return; playerRef.current.muted = !playerRef.current.muted; setIsMuted(!isMuted); }, [isMuted]);

  const calculateTimeFromPosition = useCallback((clientX: number): number => {
    if (!scrubberRef.current || !playerRef.current || duration <= 0) return 0;
    const rect = scrubberRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const requestedTime = percentage * duration;
    return Math.min(requestedTime, maxWatchedTimeRef.current);
  }, [duration]);

  const handleScrubberMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(true);
    const newTime = calculateTimeFromPosition(e.clientX);
    setScrubberPosition(newTime);
    if (playerRef.current) playerRef.current.currentTime = newTime;
  }, [calculateTimeFromPosition]);

  const handleScrubberMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newTime = calculateTimeFromPosition(e.clientX);
    setScrubberPosition(newTime);
    if (playerRef.current) playerRef.current.currentTime = newTime;
  }, [isDragging, calculateTimeFromPosition]);

  const handleScrubberMouseUp = useCallback(() => { setIsDragging(false); }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleScrubberMouseMove);
      window.addEventListener('mouseup', handleScrubberMouseUp);
      return () => { window.removeEventListener('mousemove', handleScrubberMouseMove); window.removeEventListener('mouseup', handleScrubberMouseUp); };
    }
  }, [isDragging, handleScrubberMouseMove, handleScrubberMouseUp]);

  const formatTime = (seconds: number) => { if (isNaN(seconds) || seconds < 0) return '0:00'; const m = Math.floor(seconds / 60); const s = Math.floor(seconds % 60); return `${m}:${String(s).padStart(2, '0')}`; };
  const posterParam = posterUrl ? `&poster=${encodeURIComponent(posterUrl)}` : '';
  const iframeSrc = `https://customer-2twfsluc6inah5at.cloudflarestream.com/${videoId}/iframe?controls=false${posterParam}&letterboxColor=transparent`;
  const getProgressMessage = () => progress >= unlockThreshold ? "You're all set! Book a call if you'd like to talk before joining." : "Most questions are answered here, once you've watched 50%, the option to book a call becomes available.";

  return (
    <div className={`video-player-container ${className}`}>
      <style jsx>{`
        .video-player-container { width: 100%; }
        .video-frame { position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); background: #1a1a1a; padding: 4px; background: linear-gradient(145deg, rgba(80,80,80,0.6) 0%, rgba(40,40,40,0.8) 50%, rgba(60,60,60,0.6) 100%); border: 1px solid rgba(150,150,150,0.4); }
        .video-wrapper { position: relative; padding-top: 56.25%; background: #1a1a1a; border-radius: 8px 8px 0 0; overflow: hidden; }
        .video-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; pointer-events: none; }
        .video-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 2; cursor: pointer; background: transparent; transition: background 0.2s ease; }
        .video-overlay:hover { background: rgba(0, 0, 0, 0.15); }
        .video-overlay:hover .overlay-play-btn { transform: scale(1.1); }
        .overlay-play-btn { width: 80px; height: 80px; border-radius: 50%; background: rgba(255, 215, 0, 0.6); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.2); transition: transform 0.2s ease, opacity 0.2s ease; }
        .overlay-play-btn svg { width: 36px; height: 36px; fill: #1a1a1a; margin-left: 4px; }
        .overlay-play-btn.is-playing svg { margin-left: 0; }
        .video-overlay.is-playing .overlay-play-btn { opacity: 0; }
        .video-overlay.is-playing:hover .overlay-play-btn { opacity: 1; }
        .scrubber-container { position: absolute; bottom: 0; left: 0; right: 0; height: 20px; padding: 8px 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%); cursor: pointer; z-index: 10; opacity: 0; transition: opacity 0.2s ease; }
        .scrubber-container.visible { opacity: 1; }
        .scrubber-watched { position: absolute; bottom: 8px; left: 0; height: 4px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; }
        .scrubber-current { position: absolute; bottom: 8px; left: 0; height: 4px; background: linear-gradient(90deg, #ffd700, #ffcc00); border-radius: 2px; z-index: 1; }
        .scrubber-thumb { position: absolute; bottom: 4px; width: 14px; height: 14px; background: #ffd700; border-radius: 50%; transform: translateX(-50%); box-shadow: 0 2px 6px rgba(0,0,0,0.4); z-index: 2; transition: transform 0.1s ease; }
        .scrubber-container:hover .scrubber-thumb, .scrubber-container:active .scrubber-thumb { transform: translateX(-50%) scale(1.3); }
        .video-controls { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.95) 100%); border-top: 1px solid rgba(255,215,0,0.2); border-radius: 0 0 8px 8px; }
        .control-btn { display: flex; align-items: center; justify-content: center; position: relative; width: 36px; height: 36px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: #fff; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0; }
        .control-btn:hover { background: rgba(255, 215, 0, 0.2); border-color: rgba(255, 215, 0, 0.4); color: #ffd700; }
        .control-btn:active { transform: scale(0.95); }
        .control-btn svg { width: 18px; height: 18px; }
        .control-btn--play { background: linear-gradient(135deg, #ffd700 0%, #e6c200 100%); border-color: #ffd700; color: #1a1a1a; width: 40px; height: 40px; }
        .control-btn--play:hover { background: linear-gradient(135deg, #ffe033 0%, #ffd700 100%); color: #1a1a1a; }
        .control-btn--play svg { width: 20px; height: 20px; fill: #1a1a1a; stroke: #1a1a1a; }
        .rewind-text { position: absolute; font-size: 8px; font-weight: 700; bottom: 4px; right: 4px; }
        .time-display { font-family: var(--font-synonym, monospace); font-size: 0.85rem; color: #bfbdb0; margin: 0 0.5rem; white-space: nowrap; flex-shrink: 0; }
        .volume-controls { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
        .volume-slider { width: 80px; height: 4px; -webkit-appearance: none; appearance: none; background: rgba(255, 255, 255, 0.2); border-radius: 2px; cursor: pointer; }
        .volume-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; background: #ffd700; border-radius: 50%; cursor: pointer; transition: transform 0.1s ease; }
        .volume-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .volume-slider::-moz-range-thumb { width: 14px; height: 14px; background: #ffd700; border-radius: 50%; cursor: pointer; border: none; }
        .progress-area { text-align: center; margin-top: 1.5rem; }
        .progress-bar { width: 100%; max-width: 400px; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; margin: 0 auto 1rem; overflow: hidden; }
        .progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #ffd700, #00ff88); border-radius: 3px; transition: width 0.3s ease; }
        .progress-text { margin: 0; }
        @media (max-width: 600px) { .video-controls { flex-wrap: wrap; gap: 0.4rem; padding: 0.5rem; } .time-display { order: 10; width: 100%; text-align: center; margin: 0.25rem 0 0; } .volume-controls { margin-left: 0; } .volume-slider { width: 60px; } }
      `}</style>
      <div className="video-frame">
        <div className="video-wrapper" onMouseEnter={() => setIsHoveringVideo(true)} onMouseLeave={() => !isDragging && setIsHoveringVideo(false)}>
          <iframe ref={iframeRef} src={iframeSrc} loading="lazy" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          <div className={`video-overlay ${isPlaying ? 'is-playing' : ''}`} onClick={togglePlayPause}>
            <div className={`overlay-play-btn ${isPlaying ? 'is-playing' : ''}`}>
              {isPlaying ? <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> : <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
            </div>
          </div>
          <div className={`scrubber-container ${isHoveringVideo || isDragging ? 'visible' : ''}`} ref={scrubberRef} onMouseDown={handleScrubberMouseDown}>
            <div className="scrubber-watched" style={{ width: duration > 0 ? `${(maxWatchedTime / duration) * 100}%` : '0%' }} />
            <div className="scrubber-current" style={{ width: duration > 0 ? `${(scrubberPosition / duration) * 100}%` : '0%' }} />
            <div className="scrubber-thumb" style={{ left: duration > 0 ? `${(scrubberPosition / duration) * 100}%` : '0%' }} />
          </div>
        </div>
        <div className="video-controls">
          <button className="control-btn control-btn--play" onClick={togglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> : <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
          </button>
          <button className="control-btn" onClick={handleRewind} aria-label="Rewind 15 seconds" title="Rewind 15s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg><span className="rewind-text">15</span></button>
          <button className="control-btn" onClick={handleRestart} aria-label="Restart video" title="Restart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/></svg></button>
          <div className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</div>
          <div className="volume-controls">
            <button className="control-btn" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted || volume === 0 ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> : volume < 0.5 ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>}
            </button>
            <input type="range" min="0" max="1" step="0.1" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="volume-slider" aria-label="Volume" />
          </div>
        </div>
      </div>
      {!hideProgressArea && (
        <div className="progress-area">
          <div className="progress-bar"><div className="progress-fill" style={{ width: thresholdReached ? '100%' : `${Math.min((progress / unlockThreshold) * 100, 100)}%` }} /></div>
          <p className="progress-text text-body">{getProgressMessage()}</p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SECTION: WatchAndDecide (Full VideoSection with all functionality)
// =============================================================================
function WatchAndDecide() {
  const VIDEO_ID = 'f8c3f1bd9c2db2409ed0e90f60fd4d5b';
  const POSTER_URL = `${CLOUDFLARE_BASE}/exp-realty-smart-agent-alliance-explained/desktop`;
  const BOOK_CALL_URL = 'https://team.smartagentalliance.com/widget/booking/v5LFLy12isdGJiZmTxP7';

  const [showBookCall, setShowBookCall] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedProgress = parseFloat(localStorage.getItem('homepage_video_progress') || '0');
    if (savedProgress >= 50) setShowBookCall(true);
  }, []);

  const handleThresholdReached = useCallback(() => { setShowBookCall(true); }, []);
  const handleJoinSuccess = useCallback((data: JoinFormData) => {
    setUserName(data.firstName);
    setShowJoinModal(false);
    setTimeout(() => { setShowInstructions(true); }, 300);
  }, []);

  return (
    <section id="watch-and-decide" className="video-section relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1900px] mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <H2>The Only Video You Need</H2>
          <p className="text-body mt-4 max-w-2xl mx-auto opacity-80">Everything about eXp Realty, Smart Agent Alliance, and how the model works — explained in full.</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <VideoPlayer videoId={VIDEO_ID} posterUrl={POSTER_URL} storageKey="homepage_video" unlockThreshold={50} onThresholdReached={handleThresholdReached} />
          <div id="join-the-alliance" className="video-section-buttons flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <CTAButton href="#" onClick={(e) => { e.preventDefault(); setShowJoinModal(true); }}>JOIN THE ALLIANCE</CTAButton>
            <div className="transition-all duration-500" style={{ opacity: showBookCall ? 1 : 0.4, filter: showBookCall ? 'none' : 'blur(1px) grayscale(0.8)', pointerEvents: showBookCall ? 'auto' : 'none' }}>
              <SecondaryButton href={BOOK_CALL_URL} onClick={(e) => { e.preventDefault(); if (showBookCall) window.open(BOOK_CALL_URL, '_blank', 'noopener,noreferrer'); }}>BOOK A CALL</SecondaryButton>
            </div>
          </div>
        </div>
      </div>
      <JoinModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} onSuccess={handleJoinSuccess} sponsorName={null} />
      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} userName={userName} />
    </section>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================
export default function AgentAttractionTemplate2() {
  return (
    <ViewportProvider>
      <SmoothScroll />
      <main id="main-content">
        {/* Hero Section - Fixed in place, content scrolls over it */}
        <FixedHeroWrapper>
          <section
            className="relative min-h-[100dvh] w-full"
            aria-label="Hero"
            style={{ maxWidth: '3000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <RevealMaskEffect />

            <div className="hero-content-wrapper flex flex-col items-center w-full pt-[8%] md:pt-0" style={{ maxWidth: '3000px' }}>
              <div className="relative pointer-events-none z-[1]" style={{ width: 'clamp(400px, 47.37vw, 900px)', maxWidth: '95vw', aspectRatio: '900 / 500', maxHeight: '50dvh' }}>
                <div className="hero-3d-backdrop absolute left-1/2 -translate-x-1/2 w-[110%] h-[110%]" style={{ top: '0', background: 'radial-gradient(ellipse 60% 50% at center 45%, rgba(100,80,150,0.15) 0%, rgba(50,40,80,0.1) 40%, transparent 70%)', filter: 'blur(40px)' }} />
                <img
                  src={AGENT_IMAGE}
                  srcSet={AGENT_IMAGE_SRCSET}
                  sizes="(max-width: 480px) 375px, (max-width: 768px) 768px, 1280px"
                  alt={`${AGENT_NAME} - Smart Agent Alliance`}
                  width={900} height={500} loading="eager" fetchPriority="high" decoding="async"
                  className="hero-3d-image profile-image w-full h-full object-contain"
                  style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%)', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}
                />
              </div>

              <div className="w-full px-4 sm:px-8 md:px-12 text-center pointer-events-auto z-[2]" style={{ maxWidth: '3000px', marginTop: 'calc(min(clamp(400px, 47.37vw, 900px) / 7.2, 12.5dvh) * -1)' }}>
                <div style={{ perspective: '1000px' }}>
                  <H1 id="hero-heading" style={{ fontSize: 'clamp(50px, calc(30px + 4vw + 0.3vh), 150px)', marginBottom: '3px' }}>{AGENT_NAME}</H1>
                  <Tagline className="hero-tagline-mobile-spacing" counterSuffix={<TaglineCounterSuffix />}>{AGENT_TAGLINE}</Tagline>
                </div>
                <div className="hero-cta-buttons flex justify-center items-center" style={{ marginTop: '14px' }}>
                  <CTAButton href={AGENT_CTA_HREF}>{AGENT_CTA_TEXT}</CTAButton>
                </div>
              </div>
            </div>
          </section>
        </FixedHeroWrapper>

        <ScrollIndicator />

        {/* Homepage Sections */}
        <ValuePillarsTab />
        <WhySAA />
        <ProvenAtScale />
        <WhatYouGet />
        <WhyOnlyAtExp />
        <MediaLogos />
        <MeetTheFounders />
        <BuiltForFuture />
        <GlassPanel variant="champagne">
          <WatchAndDecide />
        </GlassPanel>
      </main>
    </ViewportProvider>
  );
}
