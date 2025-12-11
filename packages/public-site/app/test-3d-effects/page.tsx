'use client';

import React from 'react';
import { Clock, Calendar, User, Star, Heart } from 'lucide-react';

/**
 * TEST PAGE - LOCAL ONLY
 *
 * This page tests 5 different H1 3D text effects and 5 different Icon 3D effects
 * to help choose the best approach for visibility on dark backgrounds.
 *
 * DO NOT DEPLOY - This is for local testing only
 */

// ============================================================================
// H1 TEXT EFFECT VARIATIONS
// ============================================================================

// CURRENT: Complex 11-layer text-shadow backing plate
function H1Current({ children }: { children: string }) {
  const words = children.split(' ');
  return (
    <h1
      className="text-h1"
      style={{
        transformStyle: 'preserve-3d',
        transform: 'rotateX(15deg)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.5em',
      }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              style={{
                transform: 'translateZ(20px)',
                display: 'inline-block',
                position: 'relative',
                transformStyle: 'preserve-3d',
                color: '#ffd700',
                textShadow: `
                  -0.02em -0.02em 0 rgba(255,255,255, 0.4),
                  0.02em -0.02em 0 rgba(255,255,255, 0.4),
                  -0.02em 0.02em 0 rgba(255,255,255, 0.4),
                  0.02em 0.02em 0 rgba(255,255,255, 0.4),
                  0 -0.03em 0.1em #ffd700,
                  0 0 0.03em #ffd700,
                  0 0 0.07em #ffd700,
                  0 0 0.12em #ffb347,
                  0 0.03em 0.05em #000
                `,
              }}
            >
              {char}
              {/* Metal backing plate - 11 layer shadow */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(145deg, #8a8270 0%, #7a7268 15%, #6a6258 35%, #5a5248 50%, #6a6258 65%, #7a7268 85%, #8a8270 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  zIndex: -2,
                  transform: 'translateZ(-25px)',
                  textShadow: `
                    1px 1px 0 #4a4a4a,
                    2px 2px 0 #3a3a3a,
                    3px 3px 0 #2f2f2f,
                    4px 4px 0 #2a2a2a,
                    5px 5px 0 #252525,
                    -1px -1px 0 #6a6a6a,
                    -1px 0 0 #5a5a5a,
                    0 -1px 0 #5a5a5a,
                    6px 6px 12px rgba(0,0,0,0.9),
                    8px 8px 20px rgba(0,0,0,0.8),
                    10px 10px 30px rgba(0,0,0,0.6)
                  `,
                  filter: 'contrast(1.2) brightness(1.3)',
                  pointerEvents: 'none',
                }}
              >
                {char}
              </span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

// OPTION 1: Simple drop shadow (2 layers only)
function H1SimpleDropShadow({ children }: { children: string }) {
  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        textShadow: `
          3px 3px 0 #8a6914,
          6px 6px 12px rgba(0,0,0,0.8)
        `,
        transform: 'rotateX(10deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </h1>
  );
}

// OPTION 2: Outline + glow (CSS stroke effect)
function H1OutlineGlow({ children }: { children: string }) {
  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        WebkitTextStroke: '2px #8a6914',
        textShadow: `
          0 0 20px rgba(255, 215, 0, 0.6),
          0 0 40px rgba(255, 215, 0, 0.3),
          4px 4px 8px rgba(0,0,0,0.8)
        `,
        transform: 'rotateX(10deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </h1>
  );
}

// OPTION 3: Layered stacked shadows (cleaner 3-layer extrusion)
function H1StackedShadow({ children }: { children: string }) {
  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        textShadow: `
          1px 1px 0 #b8860b,
          2px 2px 0 #996515,
          3px 3px 0 #7a5010,
          4px 4px 0 #5a3a0a,
          5px 5px 10px rgba(0,0,0,0.9)
        `,
        transform: 'rotateX(10deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </h1>
  );
}

// OPTION 4: Gradient text with contrasting shadow
function H1GradientContrast({ children }: { children: string }) {
  return (
    <h1
      className="text-h1"
      style={{
        background: 'linear-gradient(180deg, #ffe066 0%, #ffd700 50%, #b8860b 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        filter: 'drop-shadow(3px 3px 0 #5a3a0a) drop-shadow(5px 5px 10px rgba(0,0,0,0.8))',
        transform: 'rotateX(10deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </h1>
  );
}

// OPTION 5: Embossed/inset look with lighter edge
function H1Embossed({ children }: { children: string }) {
  return (
    <h1
      className="text-h1"
      style={{
        color: '#ffd700',
        textShadow: `
          -1px -1px 0 #ffe066,
          1px 1px 0 #8a6914,
          2px 2px 0 #5a4510,
          3px 3px 6px rgba(0,0,0,0.9),
          0 0 30px rgba(255, 215, 0, 0.4)
        `,
        transform: 'rotateX(10deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </h1>
  );
}

// ============================================================================
// ICON 3D EFFECT VARIATIONS
// ============================================================================

// CURRENT: Complex backing plate with multiple box-shadows
function IconCurrent({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="icon-3d"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: 'perspective(500px) rotateX(15deg)',
        width: 32,
        height: 32,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          color: '#ffd700',
          transform: 'translateZ(8px)',
          filter: `
            drop-shadow(1px 1px 0 #b8860b)
            drop-shadow(2px 2px 0 #996515)
            drop-shadow(3px 3px 0 #7a5010)
            drop-shadow(4px 4px 6px rgba(0, 0, 0, 0.7))
          `.trim(),
        }}
      >
        {children}
      </span>
      {/* Metal backing plate */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '3px',
          left: '3px',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(145deg, #6a6258 0%, #5a5248 50%, #4a4238 100%)',
          borderRadius: '2px',
          zIndex: 0,
          transform: 'translateZ(-10px)',
          boxShadow: `
            1px 1px 0 #4a4a4a,
            2px 2px 0 #3a3a3a,
            3px 3px 0 #2f2f2f,
            4px 4px 8px rgba(0, 0, 0, 0.8)
          `.trim(),
          pointerEvents: 'none',
        }}
      />
    </span>
  );
}

// OPTION 1: Simple drop shadow only
function IconSimpleShadow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        color: '#ffd700',
        filter: 'drop-shadow(2px 2px 0 #8a6914) drop-shadow(4px 4px 6px rgba(0,0,0,0.8))',
      }}
    >
      {children}
    </span>
  );
}

// OPTION 2: Glow effect
function IconGlow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        color: '#ffd700',
        filter: `
          drop-shadow(0 0 4px #ffd700)
          drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))
          drop-shadow(2px 2px 4px rgba(0,0,0,0.8))
        `.trim(),
      }}
    >
      {children}
    </span>
  );
}

// OPTION 3: Stacked depth shadows (3 layers)
function IconStackedDepth({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        color: '#ffd700',
        filter: `
          drop-shadow(1px 1px 0 #b8860b)
          drop-shadow(2px 2px 0 #8a6914)
          drop-shadow(3px 3px 0 #5a4510)
          drop-shadow(4px 4px 8px rgba(0,0,0,0.9))
        `.trim(),
      }}
    >
      {children}
    </span>
  );
}

// OPTION 4: Outline style
function IconOutline({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        position: 'relative',
      }}
    >
      {/* Outline layer */}
      <span
        style={{
          position: 'absolute',
          color: '#5a4510',
          filter: 'blur(0.5px)',
          transform: 'scale(1.15)',
        }}
      >
        {children}
      </span>
      {/* Main icon */}
      <span
        style={{
          position: 'relative',
          color: '#ffd700',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))',
        }}
      >
        {children}
      </span>
    </span>
  );
}

// OPTION 5: Embossed effect
function IconEmbossed({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        color: '#ffd700',
        filter: `
          drop-shadow(-1px -1px 0 #ffe066)
          drop-shadow(1px 1px 0 #8a6914)
          drop-shadow(2px 2px 0 #5a4510)
          drop-shadow(3px 3px 6px rgba(0,0,0,0.9))
        `.trim(),
      }}
    >
      {children}
    </span>
  );
}

// ============================================================================
// TEST PAGE COMPONENT
// ============================================================================

export default function Test3DEffectsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-16 px-8">
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#ffd700] mb-4">3D Effect Test Page</h1>
          <p className="text-[#bfbdb0]">Compare different approaches for H1 text and Icon 3D effects</p>
          <p className="text-[#666] text-sm mt-2">LOCAL TESTING ONLY - DO NOT DEPLOY</p>
        </div>

        {/* H1 Text Effects */}
        <section>
          <h2 className="text-2xl text-[#e5e4dd] mb-8 border-b border-[#333] pb-4">H1 Text Effect Variations</h2>

          <div className="space-y-16">
            {/* Current */}
            <div className="p-8 border border-[#333] rounded-lg">
              <p className="text-sm text-[#666] mb-4">CURRENT: Complex 11-layer backing plate (most complex)</p>
              <div className="flex justify-center py-8">
                <H1Current>Sample Text</H1Current>
              </div>
              <p className="text-xs text-[#555] mt-4">Layers: 11 text-shadows + gradient background + filters</p>
            </div>

            {/* Option 1 */}
            <div className="p-8 border border-[#333] rounded-lg">
              <p className="text-sm text-[#666] mb-4">OPTION 1: Simple drop shadow (2 layers)</p>
              <div className="flex justify-center py-8">
                <H1SimpleDropShadow>Sample Text</H1SimpleDropShadow>
              </div>
              <p className="text-xs text-[#555] mt-4">Layers: 2 text-shadows only</p>
            </div>

            {/* Option 2 */}
            <div className="p-8 border border-[#333] rounded-lg">
              <p className="text-sm text-[#666] mb-4">OPTION 2: Outline + glow (stroke effect)</p>
              <div className="flex justify-center py-8">
                <H1OutlineGlow>Sample Text</H1OutlineGlow>
              </div>
              <p className="text-xs text-[#555] mt-4">Layers: text-stroke + 3 text-shadows</p>
            </div>

            {/* Option 3 */}
            <div className="p-8 border border-[#333] rounded-lg">
              <p className="text-sm text-[#666] mb-4">OPTION 3: Stacked shadows (clean extrusion)</p>
              <div className="flex justify-center py-8">
                <H1StackedShadow>Sample Text</H1StackedShadow>
              </div>
              <p className="text-xs text-[#555] mt-4">Layers: 5 text-shadows (graduated darker)</p>
            </div>

            {/* Option 4 */}
            <div className="p-8 border border-[#333] rounded-lg">
              <p className="text-sm text-[#666] mb-4">OPTION 4: Gradient text + contrast shadow</p>
              <div className="flex justify-center py-8">
                <H1GradientContrast>Sample Text</H1GradientContrast>
              </div>
              <p className="text-xs text-[#555] mt-4">Layers: background gradient + 2 drop-shadows</p>
            </div>

            {/* Option 5 */}
            <div className="p-8 border border-[#333] rounded-lg">
              <p className="text-sm text-[#666] mb-4">OPTION 5: Embossed (lighter top edge)</p>
              <div className="flex justify-center py-8">
                <H1Embossed>Sample Text</H1Embossed>
              </div>
              <p className="text-xs text-[#555] mt-4">Layers: 5 text-shadows (light + dark edges)</p>
            </div>
          </div>
        </section>

        {/* Icon Effects */}
        <section>
          <h2 className="text-2xl text-[#e5e4dd] mb-8 border-b border-[#333] pb-4">Icon 3D Effect Variations</h2>

          <div className="space-y-12">
            {/* Current */}
            <div className="p-8 border border-[#333] rounded-lg">
              <p className="text-sm text-[#666] mb-4">CURRENT: Backing plate with box-shadows (most complex)</p>
              <div className="flex justify-center gap-8 py-8">
                <IconCurrent><Clock className="w-8 h-8" /></IconCurrent>
                <IconCurrent><Calendar className="w-8 h-8" /></IconCurrent>
                <IconCurrent><User className="w-8 h-8" /></IconCurrent>
                <IconCurrent><Star className="w-8 h-8" /></IconCurrent>
                <IconCurrent><Heart className="w-8 h-8" /></IconCurrent>
              </div>
              <p className="text-xs text-[#555] mt-4">Layers: 4 drop-shadows + separate backing plate element</p>
            </div>

            {/* Option 1 */}
            <div className="p-8 border border-[#333] rounded-lg">
              <p className="text-sm text-[#666] mb-4">OPTION 1: Simple drop shadow (2 layers)</p>
              <div className="flex justify-center gap-8 py-8">
                <IconSimpleShadow><Clock className="w-8 h-8" /></IconSimpleShadow>
                <IconSimpleShadow><Calendar className="w-8 h-8" /></IconSimpleShadow>
                <IconSimpleShadow><User className="w-8 h-8" /></IconSimpleShadow>
                <IconSimpleShadow><Star className="w-8 h-8" /></IconSimpleShadow>
                <IconSimpleShadow><Heart className="w-8 h-8" /></IconSimpleShadow>
              </div>
              <p className="text-xs text-[#555] mt-4">Layers: 2 drop-shadows only</p>
            </div>

            {/* Option 2 */}
            <div className="p-8 border border-[#333] rounded-lg">
              <p className="text-sm text-[#666] mb-4">OPTION 2: Glow effect</p>
              <div className="flex justify-center gap-8 py-8">
                <IconGlow><Clock className="w-8 h-8" /></IconGlow>
                <IconGlow><Calendar className="w-8 h-8" /></IconGlow>
                <IconGlow><User className="w-8 h-8" /></IconGlow>
                <IconGlow><Star className="w-8 h-8" /></IconGlow>
                <IconGlow><Heart className="w-8 h-8" /></IconGlow>
              </div>
              <p className="text-xs text-[#555] mt-4">Layers: 3 drop-shadows (glow + depth)</p>
            </div>

            {/* Option 3 */}
            <div className="p-8 border border-[#333] rounded-lg">
              <p className="text-sm text-[#666] mb-4">OPTION 3: Stacked depth (clean 3-layer extrusion)</p>
              <div className="flex justify-center gap-8 py-8">
                <IconStackedDepth><Clock className="w-8 h-8" /></IconStackedDepth>
                <IconStackedDepth><Calendar className="w-8 h-8" /></IconStackedDepth>
                <IconStackedDepth><User className="w-8 h-8" /></IconStackedDepth>
                <IconStackedDepth><Star className="w-8 h-8" /></IconStackedDepth>
                <IconStackedDepth><Heart className="w-8 h-8" /></IconStackedDepth>
              </div>
              <p className="text-xs text-[#555] mt-4">Layers: 4 drop-shadows (graduated depth)</p>
            </div>

            {/* Option 4 */}
            <div className="p-8 border border-[#333] rounded-lg">
              <p className="text-sm text-[#666] mb-4">OPTION 4: Outline style (scaled background)</p>
              <div className="flex justify-center gap-8 py-8">
                <IconOutline><Clock className="w-8 h-8" /></IconOutline>
                <IconOutline><Calendar className="w-8 h-8" /></IconOutline>
                <IconOutline><User className="w-8 h-8" /></IconOutline>
                <IconOutline><Star className="w-8 h-8" /></IconOutline>
                <IconOutline><Heart className="w-8 h-8" /></IconOutline>
              </div>
              <p className="text-xs text-[#555] mt-4">Layers: 2 stacked elements + drop-shadow</p>
            </div>

            {/* Option 5 */}
            <div className="p-8 border border-[#333] rounded-lg">
              <p className="text-sm text-[#666] mb-4">OPTION 5: Embossed (lighter top edge)</p>
              <div className="flex justify-center gap-8 py-8">
                <IconEmbossed><Clock className="w-8 h-8" /></IconEmbossed>
                <IconEmbossed><Calendar className="w-8 h-8" /></IconEmbossed>
                <IconEmbossed><User className="w-8 h-8" /></IconEmbossed>
                <IconEmbossed><Star className="w-8 h-8" /></IconEmbossed>
                <IconEmbossed><Heart className="w-8 h-8" /></IconEmbossed>
              </div>
              <p className="text-xs text-[#555] mt-4">Layers: 4 drop-shadows (light + dark edges)</p>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-[#111] p-8 rounded-lg">
          <h2 className="text-xl text-[#e5e4dd] mb-4">Complexity Comparison</h2>
          <table className="w-full text-sm text-[#bfbdb0]">
            <thead>
              <tr className="border-b border-[#333]">
                <th className="text-left py-2">Option</th>
                <th className="text-left py-2">H1 Layers</th>
                <th className="text-left py-2">Icon Layers</th>
                <th className="text-left py-2">Extra Elements</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#222]">
                <td className="py-2">Current</td>
                <td>11 shadows + gradient</td>
                <td>4 shadows</td>
                <td>Yes (backing span)</td>
              </tr>
              <tr className="border-b border-[#222]">
                <td className="py-2">Option 1 (Simple)</td>
                <td>2 shadows</td>
                <td>2 shadows</td>
                <td>No</td>
              </tr>
              <tr className="border-b border-[#222]">
                <td className="py-2">Option 2 (Outline/Glow)</td>
                <td>3 shadows + stroke</td>
                <td>3 shadows</td>
                <td>No</td>
              </tr>
              <tr className="border-b border-[#222]">
                <td className="py-2">Option 3 (Stacked)</td>
                <td>5 shadows</td>
                <td>4 shadows</td>
                <td>No</td>
              </tr>
              <tr className="border-b border-[#222]">
                <td className="py-2">Option 4 (Gradient)</td>
                <td>2 drop-shadows</td>
                <td>2 elements</td>
                <td>No</td>
              </tr>
              <tr>
                <td className="py-2">Option 5 (Embossed)</td>
                <td>5 shadows</td>
                <td>4 shadows</td>
                <td>No</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
