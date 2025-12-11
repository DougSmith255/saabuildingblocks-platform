'use client';

import React, { useEffect, useState } from 'react';

/**
 * GLASS EFFECT LAYERS TEST PAGE
 *
 * Shows each layer of the header glass effect separately
 * Ordered bottom to top, left to right
 */

// ============================================================================
// GLASS LAYER COMPONENTS
// ============================================================================

function GlassLayerDemo({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full h-[100px] rounded-b-[20px] overflow-hidden"
        style={{ background: 'radial-gradient(at center bottom, rgb(40, 40, 40) 0%, rgb(12, 12, 12) 100%)' }}
      >
        {children}
      </div>
      <p className="text-sm text-[#ffd700] mt-3 font-bold uppercase tracking-wider">{title}</p>
      <p className="text-xs text-[#888] mt-1 text-center max-w-[300px]">{description}</p>
    </div>
  );
}

// Layer 1: glassBase (bottom layer)
function GlassBaseLayer() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(45deg, rgba(10, 10, 10, 0.73), rgba(26, 26, 26, 0.83)),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 215, 0, 0.02) 2px, rgba(255, 215, 0, 0.02) 4px)
        `,
        backdropFilter: 'blur(8px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(8px) saturate(1.5)',
        boxShadow: '0 0 30px rgba(0,0,0,0.4), inset 0 0 30px rgba(255,255,255,0.05)',
        filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
        borderRadius: '0 0 20px 20px',
      }}
    />
  );
}

// Layer 2: glassBase::after (matrix grid)
function GlassBaseAfterLayer() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: '2px',
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px),
          linear-gradient(45deg, rgba(10, 10, 10, 0.73), rgba(26, 26, 26, 0.83))
        `,
        borderRadius: '0 0 18px 18px',
      }}
    />
  );
}

// Layer 3: shimmerLayer container
function ShimmerLayerContainer() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '0 0 20px 20px',
        opacity: 0.7,
        mixBlendMode: 'overlay',
        overflow: 'hidden',
        background: 'rgba(128, 128, 128, 0.3)', // Visible placeholder
      }}
    />
  );
}

// Layer 4: shimmerLayer::before (gradient)
function ShimmerBeforeLayer() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '0 0 20px 20px',
        opacity: 0.7,
        mixBlendMode: 'overlay',
        background: `linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.05) 0%,
          rgba(255, 255, 255, 0.15) 20%,
          rgba(255, 255, 255, 0.25) 40%,
          rgba(255, 255, 255, 0.15) 60%,
          rgba(255, 255, 255, 0.05) 80%,
          rgba(255, 255, 255, 0.02) 100%
        )`,
      }}
    />
  );
}

// Layer 5-7: Unused layers (display: none in CSS)
function UnusedLayer({ name }: { name: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '0 0 20px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 0, 0, 0.1)',
        border: '2px dashed rgba(255, 0, 0, 0.3)',
      }}
    >
      <span className="text-red-500/50 text-xs">UNUSED</span>
    </div>
  );
}

// Combined: All active layers stacked
function CombinedGlassEffect() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '0 0 20px 20px',
        overflow: 'hidden',
      }}
    >
      {/* Layer 1: glassBase */}
      <GlassBaseLayer />
      {/* Layer 2: glassBase::after (simulated) */}
      <GlassBaseAfterLayer />
      {/* Layer 3+4: shimmerLayer with ::before */}
      <ShimmerBeforeLayer />
    </div>
  );
}

// Layers 1+2 Only (simplified header)
function SimplifiedGlassEffect() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '0 0 20px 20px',
        overflow: 'hidden',
      }}
    >
      {/* Layer 1: glassBase */}
      <GlassBaseLayer />
      {/* Layer 2: glassBase::after (simulated) */}
      <GlassBaseAfterLayer />
    </div>
  );
}

// Layers 1+2+3 (with shimmer container, no gradient)
function Layers123Effect() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '0 0 20px 20px',
        overflow: 'hidden',
      }}
    >
      {/* Layer 1: glassBase */}
      <GlassBaseLayer />
      {/* Layer 2: glassBase::after (simulated) */}
      <GlassBaseAfterLayer />
      {/* Layer 3: shimmerLayer container (overlay blend) */}
      <ShimmerLayerContainer />
    </div>
  );
}

// Layers 1+2+4 (with shimmer gradient, no container)
function Layers124Effect() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '0 0 20px 20px',
        overflow: 'hidden',
      }}
    >
      {/* Layer 1: glassBase */}
      <GlassBaseLayer />
      {/* Layer 2: glassBase::after (simulated) */}
      <GlassBaseAfterLayer />
      {/* Layer 4: shimmerLayer::before (diagonal gradient) */}
      <ShimmerBeforeLayer />
    </div>
  );
}

/**
 * H1 ANIMATION TEST PAGE
 *
 * Base styling: Option 10 (neon + metal backing)
 * Each option shows a different post-load animation
 * All animations delayed to not affect LCP
 */

// Helper to convert text with alt glyphs
function convertToAltGlyphs(text: string): string {
  return text.split('').map(char => {
    const upper = char.toUpperCase();
    if (upper === 'N') return '\uf015';
    if (upper === 'E') return '\uf011';
    if (upper === 'M') return '\uf016';
    return char;
  }).join('');
}

// Base text-shadow for all options (Option 10 styling)
const baseTextShadow = `
  /* NEON TUBE - STRONGER GLOW */
  0 0 0.01em #fff,
  0 0 0.02em #fff,
  0 0 0.03em rgba(255,255,255,0.8),
  0 0 0.04em #ffd700,
  0 0 0.07em #ffd700,
  0 0 0.11em rgba(255, 215, 0, 0.9),
  0 0 0.16em rgba(255, 215, 0, 0.7),
  0 0 0.22em rgba(255, 179, 71, 0.5),
  /* METAL BACKING */
  0.02em 0.02em 0 #6a6a6a,
  0.03em 0.03em 0 #585858,
  0.04em 0.04em 0 #464646,
  0.05em 0.05em 0 #343434,
  0.06em 0.06em 0 #222222,
  /* LIGHT ON METAL */
  0.03em 0.03em 0.06em rgba(255, 215, 0, 0.3),
  /* DEPTH SHADOW */
  0.08em 0.08em 0.05em rgba(0,0,0,0.6),
  0.1em 0.1em 0.1em rgba(0,0,0,0.4)
`;

// ============================================================================
// OPTION 1: Flicker On (like neon turning on)
// ============================================================================
function H1Animation1({ children }: { children: string }) {
  const displayText = convertToAltGlyphs(children);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        transform: 'perspective(800px) rotateX(12deg)',
        textShadow: baseTextShadow,
        animation: animate ? 'flickerOn 0.8s ease-out forwards' : 'none',
        opacity: animate ? 1 : 0,
      }}
    >
      {displayText}
      <style>{`
        @keyframes flickerOn {
          0% { opacity: 0; filter: brightness(0); }
          10% { opacity: 1; filter: brightness(2); }
          15% { opacity: 0.3; filter: brightness(0.5); }
          25% { opacity: 1; filter: brightness(1.8); }
          30% { opacity: 0.6; filter: brightness(0.8); }
          50% { opacity: 1; filter: brightness(1.5); }
          55% { opacity: 0.8; filter: brightness(1); }
          100% { opacity: 1; filter: brightness(1); }
        }
      `}</style>
    </h1>
  );
}

// ============================================================================
// OPTION 2: Glow Pulse (continuous subtle pulse)
// ============================================================================
function H1Animation2({ children }: { children: string }) {
  const displayText = convertToAltGlyphs(children);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        transform: 'perspective(800px) rotateX(12deg)',
        textShadow: baseTextShadow,
        animation: animate ? 'glowPulse 3s ease-in-out infinite' : 'none',
      }}
    >
      {displayText}
      <style>{`
        @keyframes glowPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.15); }
        }
      `}</style>
    </h1>
  );
}

// ============================================================================
// OPTION 3: Slide Up + Fade In
// ============================================================================
function H1Animation3({ children }: { children: string }) {
  const displayText = convertToAltGlyphs(children);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        transform: 'perspective(800px) rotateX(12deg)',
        textShadow: baseTextShadow,
        animation: animate ? 'slideUpFade 0.6s ease-out forwards' : 'none',
        opacity: animate ? 1 : 0,
      }}
    >
      {displayText}
      <style>{`
        @keyframes slideUpFade {
          0% { opacity: 0; transform: perspective(800px) rotateX(12deg) translateY(30px); }
          100% { opacity: 1; transform: perspective(800px) rotateX(12deg) translateY(0); }
        }
      `}</style>
    </h1>
  );
}

// ============================================================================
// OPTION 4: Scale Pop (bouncy entrance)
// ============================================================================
function H1Animation4({ children }: { children: string }) {
  const displayText = convertToAltGlyphs(children);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        transform: 'perspective(800px) rotateX(12deg)',
        textShadow: baseTextShadow,
        animation: animate ? 'scalePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' : 'none',
        opacity: animate ? 1 : 0,
      }}
    >
      {displayText}
      <style>{`
        @keyframes scalePop {
          0% { opacity: 0; transform: perspective(800px) rotateX(12deg) scale(0.8); }
          70% { transform: perspective(800px) rotateX(12deg) scale(1.05); }
          100% { opacity: 1; transform: perspective(800px) rotateX(12deg) scale(1); }
        }
      `}</style>
    </h1>
  );
}

// ============================================================================
// OPTION 5: Neon Buzz (subtle vibration like real neon)
// ============================================================================
function H1Animation5({ children }: { children: string }) {
  const displayText = convertToAltGlyphs(children);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        transform: 'perspective(800px) rotateX(12deg)',
        textShadow: baseTextShadow,
        animation: animate ? 'neonBuzz 0.1s linear infinite' : 'none',
      }}
    >
      {displayText}
      <style>{`
        @keyframes neonBuzz {
          0%, 100% { transform: perspective(800px) rotateX(12deg) translateX(0); }
          25% { transform: perspective(800px) rotateX(12deg) translateX(0.5px); }
          75% { transform: perspective(800px) rotateX(12deg) translateX(-0.5px); }
        }
      `}</style>
    </h1>
  );
}

// ============================================================================
// OPTION 6: Glow Breathe (slower, more dramatic pulse)
// ============================================================================
function H1Animation6({ children }: { children: string }) {
  const displayText = convertToAltGlyphs(children);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        transform: 'perspective(800px) rotateX(12deg)',
        textShadow: baseTextShadow,
        animation: animate ? 'glowBreathe 4s ease-in-out infinite' : 'none',
      }}
    >
      {displayText}
      <style>{`
        @keyframes glowBreathe {
          0%, 100% {
            filter: brightness(1) drop-shadow(0 0 0.1em rgba(255, 215, 0, 0.3));
          }
          50% {
            filter: brightness(1.2) drop-shadow(0 0 0.2em rgba(255, 215, 0, 0.6));
          }
        }
      `}</style>
    </h1>
  );
}

// ============================================================================
// OPTION 7: Typewriter Reveal (letters appear one by one)
// ============================================================================
function H1Animation7({ children }: { children: string }) {
  const displayText = convertToAltGlyphs(children);
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= displayText.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }, 100);
    return () => clearTimeout(timer);
  }, [displayText.length]);

  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        transform: 'perspective(800px) rotateX(12deg)',
        textShadow: baseTextShadow,
      }}
    >
      <span style={{ visibility: 'hidden' }}>{displayText}</span>
      <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        {displayText.slice(0, visibleChars)}
        <span style={{ opacity: 0 }}>{displayText.slice(visibleChars)}</span>
      </span>
    </h1>
  );
}

// ============================================================================
// OPTION 8: Shimmer (light sweep across text)
// ============================================================================
function H1Animation8({ children }: { children: string }) {
  const displayText = convertToAltGlyphs(children);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        transform: 'perspective(800px) rotateX(12deg)',
        textShadow: baseTextShadow,
        backgroundImage: animate
          ? 'linear-gradient(90deg, #ffd700 0%, #fff 50%, #ffd700 100%)'
          : 'none',
        backgroundSize: '200% 100%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        animation: animate ? 'shimmer 3s linear infinite' : 'none',
      }}
    >
      {displayText}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </h1>
  );
}

// ============================================================================
// OPTION 9: 3D Tilt on Hover (interactive)
// ============================================================================
function H1Animation9({ children }: { children: string }) {
  const displayText = convertToAltGlyphs(children);
  const [hover, setHover] = useState(false);

  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        transform: hover
          ? 'perspective(800px) rotateX(8deg) rotateY(5deg) scale(1.02)'
          : 'perspective(800px) rotateX(12deg)',
        textShadow: baseTextShadow,
        transition: 'transform 0.3s ease-out',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {displayText}
    </h1>
  );
}

// ============================================================================
// OPTION 10: No Animation (static, fastest LCP)
// ============================================================================
function H1Animation10({ children }: { children: string }) {
  const displayText = convertToAltGlyphs(children);

  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        transform: 'perspective(800px) rotateX(12deg)',
        textShadow: baseTextShadow,
      }}
    >
      {displayText}
    </h1>
  );
}

// ============================================================================
// MAIN TEST PAGE
// ============================================================================
export default function Test3DEffectsPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-24">

        {/* ================================================================
            GLASS EFFECT LAYERS SECTION
            ================================================================ */}
        <section>
          <header className="text-center mb-12">
            <h2 className="text-2xl text-[#e5e4dd] mb-4" style={{ fontFamily: 'var(--font-synonym)' }}>
              Header Glass Effect Layers
            </h2>
            <p className="text-[#a0a0a0]">
              Each layer shown separately, ordered bottom → top, left → right.
              <br />
              <span className="text-[#ffd700]">Note: 3 layers are set to display:none in CSS (unused).</span>
            </p>
          </header>

          {/* Layer grid - 4 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Layer 1: glassBase */}
            <GlassLayerDemo
              title="1. glassBase"
              description="Dark gradient + gold vertical lines + blur(8px) backdrop + box-shadow"
            >
              <GlassBaseLayer />
            </GlassLayerDemo>

            {/* Layer 2: glassBase::after */}
            <GlassLayerDemo
              title="2. ::after (grid)"
              description="Horizontal white lines (matrix grid) + dark gradient overlay"
            >
              <GlassBaseAfterLayer />
            </GlassLayerDemo>

            {/* Layer 3: shimmerLayer (container) */}
            <GlassLayerDemo
              title="3. shimmerLayer"
              description="Container with opacity:0.7, mix-blend-mode:overlay (shown with gray bg)"
            >
              <ShimmerLayerContainer />
            </GlassLayerDemo>

            {/* Layer 4: shimmerLayer::before */}
            <GlassLayerDemo
              title="4. ::before (gradient)"
              description="135° diagonal gradient white highlight sweep"
            >
              <ShimmerBeforeLayer />
            </GlassLayerDemo>
          </div>

          {/* Unused layers row */}
          <div className="mt-12">
            <p className="text-center text-sm text-[#666] mb-6 uppercase tracking-wider">
              Unused Layers (display: none in CSS)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <GlassLayerDemo
                title="5. refractionLayer"
                description="UNUSED - set to display:none"
              >
                <UnusedLayer name="refraction" />
              </GlassLayerDemo>

              <GlassLayerDemo
                title="6. textureLayer"
                description="UNUSED - set to display:none"
              >
                <UnusedLayer name="texture" />
              </GlassLayerDemo>

              <GlassLayerDemo
                title="7. edgeHighlight"
                description="UNUSED - set to display:none"
              >
                <UnusedLayer name="edge" />
              </GlassLayerDemo>
            </div>
          </div>

          {/* Layer combinations comparison */}
          <div className="mt-16">
            <p className="text-center text-sm text-[#888] mb-6 uppercase tracking-wider">
              Layer Combinations Comparison
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <GlassLayerDemo
                title="Layers 1+2"
                description="glassBase + ::after grid only"
              >
                <SimplifiedGlassEffect />
              </GlassLayerDemo>
              <GlassLayerDemo
                title="Layers 1+2+3"
                description="+ shimmer container (gray overlay blend)"
              >
                <Layers123Effect />
              </GlassLayerDemo>
              <GlassLayerDemo
                title="Layers 1+2+4"
                description="+ shimmer gradient (diagonal highlight)"
              >
                <Layers124Effect />
              </GlassLayerDemo>
              <GlassLayerDemo
                title="Full (1+2+3+4)"
                description="All active layers combined"
              >
                <CombinedGlassEffect />
              </GlassLayerDemo>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-[#333] pt-12" />

        {/* ================================================================
            H1 ANIMATION OPTIONS SECTION
            ================================================================ */}
        <header className="text-center mb-16">
          <h2 className="text-2xl text-[#e5e4dd] mb-4" style={{ fontFamily: 'var(--font-synonym)' }}>
            H1 Animation Options
          </h2>
          <p className="text-[#a0a0a0]">
            All use Option 10 base styling. Animations trigger after page load (no LCP impact).
          </p>
        </header>

        {/* Option 1: Flicker On */}
        <section className="text-center">
          <p className="text-sm text-[#888] mb-4 uppercase tracking-wider">
            Option 1: Flicker On (neon turning on)
          </p>
          <H1Animation1>Smart Agent Alliance</H1Animation1>
        </section>

        {/* Option 2: Glow Pulse */}
        <section className="text-center">
          <p className="text-sm text-[#888] mb-4 uppercase tracking-wider">
            Option 2: Glow Pulse (continuous subtle)
          </p>
          <H1Animation2>Smart Agent Alliance</H1Animation2>
        </section>

        {/* Option 3: Slide Up */}
        <section className="text-center">
          <p className="text-sm text-[#888] mb-4 uppercase tracking-wider">
            Option 3: Slide Up + Fade In
          </p>
          <H1Animation3>Smart Agent Alliance</H1Animation3>
        </section>

        {/* Option 4: Scale Pop */}
        <section className="text-center">
          <p className="text-sm text-[#888] mb-4 uppercase tracking-wider">
            Option 4: Scale Pop (bouncy)
          </p>
          <H1Animation4>Smart Agent Alliance</H1Animation4>
        </section>

        {/* Option 5: Neon Buzz */}
        <section className="text-center">
          <p className="text-sm text-[#888] mb-4 uppercase tracking-wider">
            Option 5: Neon Buzz (subtle vibration)
          </p>
          <H1Animation5>Smart Agent Alliance</H1Animation5>
        </section>

        {/* Option 6: Glow Breathe */}
        <section className="text-center">
          <p className="text-sm text-[#888] mb-4 uppercase tracking-wider">
            Option 6: Glow Breathe (slow dramatic)
          </p>
          <H1Animation6>Smart Agent Alliance</H1Animation6>
        </section>

        {/* Option 7: Typewriter */}
        <section className="text-center">
          <p className="text-sm text-[#888] mb-4 uppercase tracking-wider">
            Option 7: Typewriter Reveal
          </p>
          <H1Animation7>Smart Agent Alliance</H1Animation7>
        </section>

        {/* Option 8: Shimmer */}
        <section className="text-center">
          <p className="text-sm text-[#888] mb-4 uppercase tracking-wider">
            Option 8: Shimmer (light sweep)
          </p>
          <H1Animation8>Smart Agent Alliance</H1Animation8>
        </section>

        {/* Option 9: 3D Tilt Hover */}
        <section className="text-center">
          <p className="text-sm text-[#888] mb-4 uppercase tracking-wider">
            Option 9: 3D Tilt on Hover (interactive)
          </p>
          <H1Animation9>Smart Agent Alliance</H1Animation9>
        </section>

        {/* Option 10: No Animation */}
        <section className="text-center">
          <p className="text-sm text-[#888] mb-4 uppercase tracking-wider">
            Option 10: No Animation (fastest LCP)
          </p>
          <H1Animation10>Smart Agent Alliance</H1Animation10>
        </section>

        <footer className="text-center pt-12 border-t border-[#333]">
          <p className="text-[#666] text-sm">
            All animations delayed 100ms after mount to avoid blocking LCP measurement.
          </p>
        </footer>
      </div>
    </main>
  );
}
