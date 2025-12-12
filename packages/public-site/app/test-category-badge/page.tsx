'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

/**
 * Convert text to use alt glyphs for N, E, M characters
 */
function convertToAltGlyphs(text: string): string {
  return text.split('').map(char => {
    const upper = char.toUpperCase();
    if (upper === 'N') return '\uf015';
    if (upper === 'E') return '\uf011';
    if (upper === 'M') return '\uf016';
    return char;
  }).join('');
}

/**
 * Test page showing proposed optimized versions vs current
 */
export default function TestCategoryBadge() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const h1Text = convertToAltGlyphs("SMART AGENT ALLIANCE");
  const taglineText = convertToAltGlyphs("For Agents Who Want More");

  // ============================================
  // ICON3D LAYERS (4 layers via filter: drop-shadow)
  // ============================================
  const icon3DLayers = [
    { name: "1. Highlight", shadow: "drop-shadow(-1px -1px 0 #ffe680)", category: "HIGHLIGHT" },
    { name: "2. Metal 1", shadow: "drop-shadow(1px 1px 0 #8a7a3d)", category: "METAL" },
    { name: "3. Shadow 1", shadow: "drop-shadow(4px 4px 0 #2a2a1d)", category: "DEPTH" },
    { name: "4. Depth Shadow", shadow: "drop-shadow(5px 5px 3px rgba(0,0,0,0.5))", category: "DEPTH" },
  ];

  const buildCumulativeFilter = (layers: typeof icon3DLayers, upToIndex: number) => {
    return layers.slice(0, upToIndex + 1).map(l => l.shadow).join(' ');
  };

  const iconCategoryColors: Record<string, string> = {
    "HIGHLIGHT": "text-[#ffe680] bg-[#ffe680]/20",
    "METAL": "text-[#8a7a3d] bg-[#8a7a3d]/20",
    "DEPTH": "text-gray-600 bg-gray-700/30",
  };

  // Base H1 styles
  const h1Base: React.CSSProperties = {
    color: '#ffd700',
    fontFamily: 'var(--font-taskor)',
    fontSize: 'clamp(32px, 6vw, 72px)',
    transform: 'perspective(800px) rotateX(12deg)',
    lineHeight: 1.2,
    animation: animate ? 'h1GlowBreathe 4s ease-in-out infinite' : 'none',
  };

  // Base Tagline styles
  const taglineBase: React.CSSProperties = {
    color: '#bfbdb0',
    fontFamily: 'var(--font-taskor)',
    fontSize: 'clamp(16px, 2.5vw, 28px)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    transform: 'rotateX(15deg)',
  };

  // ============================================
  // CURRENT H1 (15 layers)
  // ============================================
  const currentH1Shadow = `
    /* WHITE CORE (3) */
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8),
    /* GOLD GLOW (5) */
    0 0 0.04em #ffd700,
    0 0 0.07em #ffd700,
    0 0 0.11em rgba(255, 215, 0, 0.9),
    0 0 0.16em rgba(255, 215, 0, 0.7),
    0 0 0.22em rgba(255, 179, 71, 0.5),
    /* METAL BACKING (5) */
    0.03em 0.03em 0 #2a2a2a,
    0.045em 0.045em 0 #1a1a1a,
    0.06em 0.06em 0 #0f0f0f,
    0.075em 0.075em 0 #080808,
    0.09em 0.09em 0 #000000,
    /* DEPTH SHADOW (2) */
    0.12em 0.12em 0.08em rgba(0,0,0,0.85),
    0.15em 0.15em 0.12em rgba(0,0,0,0.7)
  `;

  // ============================================
  // PROPOSED H1 (12 layers)
  // Removed: depth shadow 1, glow 1, metal 5
  // ============================================
  const proposedH1Shadow = `
    /* WHITE CORE (3) - all kept */
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8),
    /* GOLD GLOW (4) - removed layer 1 */
    0 0 0.07em #ffd700,
    0 0 0.11em rgba(255, 215, 0, 0.9),
    0 0 0.16em rgba(255, 215, 0, 0.7),
    0 0 0.22em rgba(255, 179, 71, 0.5),
    /* METAL BACKING (4) - removed layer 5 */
    0.03em 0.03em 0 #2a2a2a,
    0.045em 0.045em 0 #1a1a1a,
    0.06em 0.06em 0 #0f0f0f,
    0.075em 0.075em 0 #080808,
    /* DEPTH SHADOW (1) - removed layer 1 */
    0.15em 0.15em 0.12em rgba(0,0,0,0.7)
  `;

  // ============================================
  // CURRENT TAGLINE (9 layers)
  // ============================================
  const currentTaglineShadow = `
    /* WHITE CORE (3) */
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8),
    /* GLOW (5) */
    0 0 0.04em #bfbdb0,
    0 0 0.07em #bfbdb0,
    0 0 0.11em rgba(191, 189, 176, 0.9),
    0 0 0.16em rgba(191, 189, 176, 0.7),
    0 0 0.22em rgba(154, 152, 136, 0.5),
    /* DEPTH (1) */
    0 0.03em 0.05em rgba(0,0,0,0.4)
  `;

  // ============================================
  // PROPOSED TAGLINE (7 layers)
  // Removed: glow 1, depth shadow
  // ============================================
  const proposedTaglineShadow = `
    /* WHITE CORE (3) - all kept */
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8),
    /* GLOW (4) - removed layer 1 */
    0 0 0.07em #bfbdb0,
    0 0 0.11em rgba(191, 189, 176, 0.9),
    0 0 0.16em rgba(191, 189, 176, 0.7),
    0 0 0.22em rgba(154, 152, 136, 0.5)
  `;

  return (
    <main id="main-content" className="min-h-screen py-24 px-4 sm:px-8">
      {/* Glow Breathe animation */}
      <style>{`
        @keyframes h1GlowBreathe {
          0%, 100% {
            filter: brightness(1) drop-shadow(0 0 0.1em rgba(255, 215, 0, 0.3));
          }
          50% {
            filter: brightness(1.2) drop-shadow(0 0 0.2em rgba(255, 215, 0, 0.6));
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl text-[#ffd700] font-bold mb-4" style={{ fontFamily: 'var(--font-taskor)' }}>
            Current vs Proposed
          </h1>
          <p className="text-[#dcdbd5]/70 text-sm">
            Side-by-side comparison of layer optimizations
          </p>
        </div>

        {/* ============================================ */}
        {/* H1 COMPARISON */}
        {/* ============================================ */}
        <section className="mb-24">
          <h2 className="text-2xl text-[#ffd700] font-bold mb-8 text-center border-b border-[#ffd700]/30 pb-4">
            H1 Comparison
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current */}
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                <span className="text-[#e5e4dd] font-bold">CURRENT</span>
                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded">15 layers</span>
              </div>
              <div className="py-12 rounded-lg" style={{ background: 'rgba(10,10,10,0.8)' }}>
                <h1 style={{ ...h1Base, textShadow: currentH1Shadow }}>{h1Text}</h1>
              </div>
              <div className="mt-4 text-left text-xs text-[#dcdbd5]/60 space-y-1">
                <p>• White Core: 3 layers</p>
                <p>• Gold Glow: 5 layers</p>
                <p>• Metal Backing: 5 layers</p>
                <p>• Depth Shadow: 2 layers</p>
              </div>
            </div>

            {/* Proposed */}
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                <span className="text-[#e5e4dd] font-bold">PROPOSED</span>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded">12 layers</span>
                <span className="bg-[#ffd700]/20 text-[#ffd700] text-xs px-2 py-0.5 rounded">-20%</span>
              </div>
              <div className="py-12 rounded-lg" style={{ background: 'rgba(10,10,10,0.8)' }}>
                <h1 style={{ ...h1Base, textShadow: proposedH1Shadow }}>{h1Text}</h1>
              </div>
              <div className="mt-4 text-left text-xs text-[#dcdbd5]/60 space-y-1">
                <p>• White Core: 3 layers (all kept)</p>
                <p>• Gold Glow: 4 layers <span className="text-red-400">(-1)</span></p>
                <p>• Metal Backing: 4 layers <span className="text-red-400">(-1)</span></p>
                <p>• Depth Shadow: 1 layer <span className="text-red-400">(-1)</span></p>
              </div>
            </div>
          </div>

          {/* Removed layers detail */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <p className="text-[#ffd700] text-sm font-bold mb-2">Layers Removed:</p>
            <ul className="text-[#dcdbd5]/70 text-xs space-y-1">
              <li>• <span className="text-[#ffd700]">Gold Glow Layer 1</span>: 0 0 0.04em #ffd700</li>
              <li>• <span className="text-gray-400">Metal Layer 5</span>: 0.09em 0.09em 0 #000000</li>
              <li>• <span className="text-gray-600">Depth Shadow Layer 1</span>: 0.12em 0.12em 0.08em rgba(0,0,0,0.85)</li>
            </ul>
          </div>
        </section>

        {/* ============================================ */}
        {/* TAGLINE COMPARISON */}
        {/* ============================================ */}
        <section className="mb-24">
          <h2 className="text-2xl text-[#ffd700] font-bold mb-8 text-center border-b border-[#ffd700]/30 pb-4">
            Tagline Comparison
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current */}
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                <span className="text-[#e5e4dd] font-bold">CURRENT</span>
                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded">9 layers</span>
              </div>
              <div className="py-10 rounded-lg" style={{ background: 'rgba(10,10,10,0.8)' }}>
                <p style={{ ...taglineBase, textShadow: currentTaglineShadow }}>{taglineText}</p>
              </div>
              <div className="mt-4 text-left text-xs text-[#dcdbd5]/60 space-y-1">
                <p>• White Core: 3 layers</p>
                <p>• Glow: 5 layers</p>
                <p>• Depth Shadow: 1 layer</p>
              </div>
            </div>

            {/* Proposed */}
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                <span className="text-[#e5e4dd] font-bold">PROPOSED</span>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded">7 layers</span>
                <span className="bg-[#ffd700]/20 text-[#ffd700] text-xs px-2 py-0.5 rounded">-22%</span>
              </div>
              <div className="py-10 rounded-lg" style={{ background: 'rgba(10,10,10,0.8)' }}>
                <p style={{ ...taglineBase, textShadow: proposedTaglineShadow }}>{taglineText}</p>
              </div>
              <div className="mt-4 text-left text-xs text-[#dcdbd5]/60 space-y-1">
                <p>• White Core: 3 layers (all kept)</p>
                <p>• Glow: 4 layers <span className="text-red-400">(-1)</span></p>
                <p>• Depth Shadow: 0 layers <span className="text-red-400">(-1)</span></p>
              </div>
            </div>
          </div>

          {/* Removed layers detail */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <p className="text-[#ffd700] text-sm font-bold mb-2">Layers Removed:</p>
            <ul className="text-[#dcdbd5]/70 text-xs space-y-1">
              <li>• <span className="text-[#bfbdb0]">Glow Layer 1</span>: 0 0 0.04em #bfbdb0</li>
              <li>• <span className="text-gray-600">Depth Shadow</span>: 0 0.03em 0.05em rgba(0,0,0,0.4)</li>
            </ul>
          </div>
        </section>

        {/* Summary */}
        <section className="text-center py-8 border-t border-[#ffd700]/20">
          <h2 className="text-xl text-[#ffd700] font-bold mb-6">Total Savings</h2>
          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
            <div className="bg-white/5 rounded-lg p-6">
              <p className="text-[#ffd700] text-3xl font-bold">15 → 12</p>
              <p className="text-[#dcdbd5]/60 text-sm mt-1">H1 Layers</p>
              <p className="text-green-400 text-xs mt-2">-3 layers (-20%)</p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <p className="text-[#ffd700] text-3xl font-bold">9 → 7</p>
              <p className="text-[#dcdbd5]/60 text-sm mt-1">Tagline Layers</p>
              <p className="text-green-400 text-xs mt-2">-2 layers (-22%)</p>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* ICON3D LAYERS */}
        {/* ============================================ */}
        <section className="mb-24 mt-16 pt-8 border-t border-[#ffd700]/20">
          <h2 className="text-2xl text-[#ffd700] font-bold mb-2 text-center border-b border-[#ffd700]/30 pb-4">
            Icon3D Layers (5 total)
          </h2>
          <p className="text-center text-[#dcdbd5]/60 text-xs mb-8">
            Uses <code className="bg-white/10 px-2 py-0.5 rounded">filter: drop-shadow()</code> - GPU accelerated
          </p>

          <div className="space-y-4">
            {icon3DLayers.map((layer, i) => (
              <div key={i} className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-4 items-center py-4 border-b border-white/10">
                {/* Layer info */}
                <div className="text-left lg:text-right">
                  <p className="text-[#e5e4dd] text-sm font-bold">{layer.name}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded mt-1 ${iconCategoryColors[layer.category]}`}>
                    {layer.category}
                  </span>
                </div>

                {/* Individual layer only */}
                <div className="py-6 rounded-lg text-center flex justify-center" style={{ background: 'rgba(10,10,10,0.8)' }}>
                  <p className="text-[#dcdbd5]/40 text-xs mb-2 absolute mt-[-20px]">This layer only</p>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#c4a94d',
                      filter: layer.shadow,
                      transform: 'perspective(500px) rotateX(8deg)',
                    }}
                  >
                    <Clock className="w-12 h-12" />
                  </span>
                </div>

                {/* Cumulative (all layers up to this point) */}
                <div className="py-6 rounded-lg text-center flex justify-center" style={{ background: 'rgba(10,10,10,0.8)' }}>
                  <p className="text-[#dcdbd5]/40 text-xs mb-2 absolute mt-[-20px]">Layers 1-{i + 1}</p>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#c4a94d',
                      filter: buildCumulativeFilter(icon3DLayers, i),
                      transform: 'perspective(500px) rotateX(8deg)',
                    }}
                  >
                    <Clock className="w-12 h-12" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Final Icon3D Result */}
          <div className="mt-8 py-8 rounded-lg text-center" style={{ background: 'rgba(10,10,10,0.6)' }}>
            <p className="text-[#ffd700] text-sm font-bold mb-4">FINAL ICON3D (All 5 layers)</p>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c4a94d',
                filter: buildCumulativeFilter(icon3DLayers, icon3DLayers.length - 1),
                transform: 'perspective(500px) rotateX(8deg)',
              }}
            >
              <Clock className="w-16 h-16" />
            </span>
          </div>
        </section>

        {/* ============================================ */}
        {/* DROP-SHADOW VERSIONS OF H1 & TAGLINE */}
        {/* ============================================ */}
        <section className="mb-24">
          <h2 className="text-2xl text-[#ffd700] font-bold mb-2 text-center border-b border-[#ffd700]/30 pb-4">
            H1 & Tagline with filter: drop-shadow()
          </h2>
          <p className="text-center text-[#dcdbd5]/60 text-xs mb-8">
            Testing if drop-shadow can replicate the text-shadow effect (GPU accelerated)
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* H1 with text-shadow (current) */}
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                <span className="text-[#e5e4dd] font-bold">H1 with text-shadow</span>
                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded">12 layers</span>
              </div>
              <div className="py-12 rounded-lg" style={{ background: 'rgba(10,10,10,0.8)' }}>
                <h1 style={{ ...h1Base, textShadow: proposedH1Shadow }}>{h1Text}</h1>
              </div>
            </div>

            {/* H1 with hybrid approach */}
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                <span className="text-[#e5e4dd] font-bold">H1 Hybrid (text-shadow + drop-shadow)</span>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded">GPU 3D</span>
              </div>
              <div className="py-12 rounded-lg" style={{ background: 'rgba(10,10,10,0.8)' }}>
                <h1 style={{
                  ...h1Base,
                  textShadow: `
                    /* WHITE CORE (3) */
                    0 0 0.01em #fff,
                    0 0 0.02em #fff,
                    0 0 0.03em rgba(255,255,255,0.8),
                    /* GOLD GLOW (4) */
                    0 0 0.07em #ffd700,
                    0 0 0.11em rgba(255, 215, 0, 0.9),
                    0 0 0.16em rgba(255, 215, 0, 0.7),
                    0 0 0.22em rgba(255, 179, 71, 0.5),
                    /* METAL BACKING (4) - kept in text-shadow */
                    0.03em 0.03em 0 #2a2a2a,
                    0.045em 0.045em 0 #1a1a1a,
                    0.06em 0.06em 0 #0f0f0f,
                    0.075em 0.075em 0 #080808
                  `,
                  filter: `
                    drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7))
                  `,
                }}>{h1Text}</h1>
              </div>
              <p className="text-[#dcdbd5]/50 text-xs mt-2">11 text-shadow + 1 drop-shadow (depth only)</p>
              <p className="text-[#dcdbd5]/40 text-xs mt-1">Metal backing must stay in text-shadow to stack properly</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Tagline with text-shadow (current) */}
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                <span className="text-[#e5e4dd] font-bold">Tagline with text-shadow</span>
                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded">7 layers</span>
              </div>
              <div className="py-10 rounded-lg" style={{ background: 'rgba(10,10,10,0.8)' }}>
                <p style={{ ...taglineBase, textShadow: proposedTaglineShadow }}>{taglineText}</p>
              </div>
            </div>

            {/* Tagline with drop-shadow */}
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                <span className="text-[#e5e4dd] font-bold">Tagline with drop-shadow</span>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded">GPU</span>
              </div>
              <div className="py-10 rounded-lg" style={{ background: 'rgba(10,10,10,0.8)' }}>
                <p style={{
                  ...taglineBase,
                  textShadow: `
                    /* WHITE CORE (3) - em units for scaling */
                    0 0 0.01em #fff,
                    0 0 0.02em #fff,
                    0 0 0.03em rgba(255,255,255,0.8)
                  `,
                  filter: `
                    drop-shadow(0 0 0.04em #bfbdb0)
                    drop-shadow(0 0 0.08em rgba(191,189,176,0.6))
                  `,
                }}>{taglineText}</p>
              </div>
              <p className="text-[#dcdbd5]/50 text-xs mt-2">3 text-shadow (core) + 2 drop-shadow (glow) - em units</p>
            </div>
          </div>

          {/* Size comparison for tagline */}
          <div className="mt-12 p-6 bg-white/5 rounded-lg">
            <p className="text-[#ffd700] text-sm font-bold mb-4 text-center">Tagline at Different Sizes (em units scale)</p>
            <div className="space-y-6">
              {[16, 24, 32].map((size) => (
                <div key={size} className="text-center">
                  <p className="text-[#dcdbd5]/50 text-xs mb-2">{size}px</p>
                  <p style={{
                    ...taglineBase,
                    fontSize: `${size}px`,
                    textShadow: `
                      0 0 0.01em #fff,
                      0 0 0.02em #fff,
                      0 0 0.03em rgba(255,255,255,0.8)
                    `,
                    filter: `
                      drop-shadow(0 0 0.04em #bfbdb0)
                      drop-shadow(0 0 0.08em rgba(191,189,176,0.6))
                    `,
                  }}>{taglineText}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
