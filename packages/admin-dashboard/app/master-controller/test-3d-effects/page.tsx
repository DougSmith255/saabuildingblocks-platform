'use client';

import React from 'react';
import { DollarSign, Users, Brain, Zap, Globe, TrendingUp, Award, Crown, Briefcase, Shield } from 'lucide-react';

/**
 * ICON 3D STYLING OPTIONS TEST PAGE
 *
 * 10 options for icon styling with max 2 DOM nodes per icon
 * Goal: Match H1's neon + metal backing effect using CSS-only
 *
 * H1 uses text-shadow (works on text only)
 * Icons use filter: drop-shadow() (works on SVG)
 */

// Sample icon for testing
const TestIcon = ({ Icon, style, className = '' }: { Icon: typeof DollarSign; style?: React.CSSProperties; className?: string }) => (
  <Icon className={`w-12 h-12 ${className}`} style={style} />
);

// Demo container
function IconDemo({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center p-8 rounded-xl bg-white/5 border border-white/10">
      <div className="mb-6 flex gap-4">
        {children}
      </div>
      <p className="text-sm text-[#ffd700] font-bold uppercase tracking-wider text-center">{title}</p>
      <p className="text-xs text-[#888] mt-2 text-center max-w-[300px]">{description}</p>
    </div>
  );
}

// ============================================================================
// OPTION 1: Full Neon + Metal (closest to H1)
// Uses stacked drop-shadows to simulate layers
// DOM: 1 node (just the SVG)
// ============================================================================
const iconStyle1: React.CSSProperties = {
  color: '#ffd700',
  filter: `
    /* White-hot core */
    drop-shadow(0 0 1px #fff)
    drop-shadow(0 0 2px #fff)
    /* Neon glow */
    drop-shadow(0 0 4px #ffd700)
    drop-shadow(0 0 8px #ffd700)
    drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))
    drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))
    /* Metal backing shadow */
    drop-shadow(2px 2px 0 #4a4a4a)
    drop-shadow(3px 3px 0 #3a3a3a)
    drop-shadow(4px 4px 0 #2a2a2a)
    /* Depth shadow */
    drop-shadow(6px 6px 4px rgba(0, 0, 0, 0.6))
  `,
  transform: 'perspective(500px) rotateX(10deg)',
};

// ============================================================================
// OPTION 2: Neon Glow Only (no metal backing)
// Clean glowing effect
// DOM: 1 node
// ============================================================================
const iconStyle2: React.CSSProperties = {
  color: '#ffd700',
  filter: `
    drop-shadow(0 0 2px #fff)
    drop-shadow(0 0 4px #ffd700)
    drop-shadow(0 0 8px #ffd700)
    drop-shadow(0 0 16px rgba(255, 215, 0, 0.7))
    drop-shadow(0 0 24px rgba(255, 215, 0, 0.4))
  `,
};

// ============================================================================
// OPTION 3: Metal Backing Only (no neon glow)
// Solid 3D effect like embossed metal
// DOM: 1 node
// ============================================================================
const iconStyle3: React.CSSProperties = {
  color: '#c4a94d', // Slightly darker gold
  filter: `
    /* Light source from top-left */
    drop-shadow(-1px -1px 0 #ffe680)
    /* Metal depth layers */
    drop-shadow(1px 1px 0 #8a7a3d)
    drop-shadow(2px 2px 0 #6a5a2d)
    drop-shadow(3px 3px 0 #4a3a1d)
    drop-shadow(4px 4px 0 #2a2a1d)
    /* Cast shadow */
    drop-shadow(5px 5px 3px rgba(0, 0, 0, 0.5))
  `,
  transform: 'perspective(500px) rotateX(8deg)',
};

// ============================================================================
// OPTION 4: Subtle Glow (minimal, elegant)
// Soft glow, less aggressive
// DOM: 1 node
// ============================================================================
const iconStyle4: React.CSSProperties = {
  color: '#ffd700',
  filter: `
    drop-shadow(0 0 2px rgba(255, 215, 0, 0.8))
    drop-shadow(0 0 6px rgba(255, 215, 0, 0.4))
    drop-shadow(0 0 10px rgba(255, 215, 0, 0.2))
  `,
};

// ============================================================================
// OPTION 5: Cyan Neon (alternate color - cyberpunk)
// Different color palette
// DOM: 1 node
// ============================================================================
const iconStyle5: React.CSSProperties = {
  color: '#00ffff',
  filter: `
    drop-shadow(0 0 2px #fff)
    drop-shadow(0 0 4px #00ffff)
    drop-shadow(0 0 8px #00ffff)
    drop-shadow(0 0 16px rgba(0, 255, 255, 0.6))
    drop-shadow(0 0 24px rgba(0, 255, 255, 0.3))
    /* Metal backing */
    drop-shadow(2px 2px 0 #3a4a4a)
    drop-shadow(3px 3px 0 #2a3a3a)
    drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5))
  `,
  transform: 'perspective(500px) rotateX(10deg)',
};

// ============================================================================
// OPTION 6: Dual Tone (gold + white highlights)
// Two-layer glow effect
// DOM: 1 node
// ============================================================================
const iconStyle6: React.CSSProperties = {
  color: '#ffd700',
  filter: `
    /* Inner white glow */
    drop-shadow(0 0 1px #fff)
    drop-shadow(0 0 2px #fff)
    drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))
    /* Outer gold glow */
    drop-shadow(0 0 6px rgba(255, 215, 0, 0.9))
    drop-shadow(0 0 12px rgba(255, 179, 71, 0.6))
    drop-shadow(0 0 20px rgba(255, 140, 0, 0.3))
  `,
};

// ============================================================================
// OPTION 7: Inset/Pressed Effect (looks pressed into surface)
// Dark on top-left, light on bottom-right
// DOM: 1 node
// ============================================================================
const iconStyle7: React.CSSProperties = {
  color: '#8a7a4d', // Darker gold for pressed look
  filter: `
    /* Light from bottom-right (simulates inset) */
    drop-shadow(1px 1px 0 #ffe680)
    drop-shadow(2px 2px 1px rgba(255, 230, 128, 0.5))
    /* Shadow on top-left */
    drop-shadow(-2px -2px 2px rgba(0, 0, 0, 0.4))
  `,
};

// ============================================================================
// OPTION 8: Neon with Long Shadow (dramatic)
// Extended drop shadow for depth
// DOM: 1 node
// ============================================================================
const iconStyle8: React.CSSProperties = {
  color: '#ffd700',
  filter: `
    /* Neon core */
    drop-shadow(0 0 2px #fff)
    drop-shadow(0 0 4px #ffd700)
    drop-shadow(0 0 8px #ffd700)
    /* Long diagonal shadow */
    drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.3))
    drop-shadow(8px 8px 0 rgba(0, 0, 0, 0.2))
    drop-shadow(12px 12px 0 rgba(0, 0, 0, 0.1))
    drop-shadow(16px 16px 4px rgba(0, 0, 0, 0.15))
  `,
};

// ============================================================================
// OPTION 9: Chrome/Metallic (reflective look)
// Uses gradient-like shadow stacking
// DOM: 1 node
// ============================================================================
const iconStyle9: React.CSSProperties = {
  color: '#e0e0e0',
  filter: `
    /* Top highlight */
    drop-shadow(0 -1px 0 #fff)
    drop-shadow(0 -2px 1px rgba(255, 255, 255, 0.5))
    /* Bottom shadow */
    drop-shadow(0 1px 0 #888)
    drop-shadow(0 2px 0 #666)
    drop-shadow(0 3px 2px rgba(0, 0, 0, 0.4))
    /* Subtle gold reflection */
    drop-shadow(0 0 4px rgba(255, 215, 0, 0.3))
  `,
};

// ============================================================================
// OPTION 10: Minimal 3D (clean, fast, subtle)
// Just enough to feel dimensional
// DOM: 1 node
// ============================================================================
const iconStyle10: React.CSSProperties = {
  color: '#ffd700',
  filter: `
    drop-shadow(0 0 2px rgba(255, 215, 0, 0.6))
    drop-shadow(1px 1px 0 #4a4a4a)
    drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.4))
  `,
  transform: 'perspective(500px) rotateX(5deg)',
};

// ============================================================================
// MAIN TEST PAGE
// ============================================================================
export default function Test3DEffectsPage() {
  return (
    <main className="min-h-screen py-20 px-4" style={{ background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%)' }}>
      <div className="max-w-6xl mx-auto space-y-12">

        <header className="text-center mb-16">
          <h1 className="text-3xl text-[#ffd700] mb-4" style={{ fontFamily: 'var(--font-synonym)' }}>
            Icon 3D Styling Options
          </h1>
          <p className="text-[#a0a0a0] max-w-2xl mx-auto">
            10 options for icon styling with <span className="text-[#ffd700]">max 2 DOM nodes per icon</span>.
            <br />
            Uses CSS <code className="bg-white/10 px-2 py-1 rounded">filter: drop-shadow()</code> instead of text-shadow (which only works on text).
          </p>
        </header>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Option 1: Full Neon + Metal */}
          <IconDemo
            title="Option 1: Full Neon + Metal"
            description="Closest to H1 effect. White core + gold glow + metal backing layers + depth shadow. 3D perspective."
          >
            <TestIcon Icon={DollarSign} style={iconStyle1} />
            <TestIcon Icon={Users} style={iconStyle1} />
            <TestIcon Icon={Brain} style={iconStyle1} />
          </IconDemo>

          {/* Option 2: Neon Glow Only */}
          <IconDemo
            title="Option 2: Neon Glow Only"
            description="Clean glowing effect without metal backing. Pure neon sign look."
          >
            <TestIcon Icon={DollarSign} style={iconStyle2} />
            <TestIcon Icon={Users} style={iconStyle2} />
            <TestIcon Icon={Brain} style={iconStyle2} />
          </IconDemo>

          {/* Option 3: Metal Backing Only */}
          <IconDemo
            title="Option 3: Metal Backing Only"
            description="Solid 3D embossed metal effect. No glow, pure dimensional depth."
          >
            <TestIcon Icon={DollarSign} style={iconStyle3} />
            <TestIcon Icon={Users} style={iconStyle3} />
            <TestIcon Icon={Brain} style={iconStyle3} />
          </IconDemo>

          {/* Option 4: Subtle Glow */}
          <IconDemo
            title="Option 4: Subtle Glow"
            description="Minimal, elegant glow. Less aggressive, more refined."
          >
            <TestIcon Icon={DollarSign} style={iconStyle4} />
            <TestIcon Icon={Users} style={iconStyle4} />
            <TestIcon Icon={Brain} style={iconStyle4} />
          </IconDemo>

          {/* Option 5: Cyan Neon */}
          <IconDemo
            title="Option 5: Cyan Neon + Metal"
            description="Cyberpunk color palette. Cyan glow with dark metal backing."
          >
            <TestIcon Icon={Zap} style={iconStyle5} />
            <TestIcon Icon={Globe} style={iconStyle5} />
            <TestIcon Icon={Shield} style={iconStyle5} />
          </IconDemo>

          {/* Option 6: Dual Tone */}
          <IconDemo
            title="Option 6: Dual Tone Glow"
            description="White-hot inner core with warm gold outer glow. Two-layer effect."
          >
            <TestIcon Icon={DollarSign} style={iconStyle6} />
            <TestIcon Icon={Users} style={iconStyle6} />
            <TestIcon Icon={Brain} style={iconStyle6} />
          </IconDemo>

          {/* Option 7: Inset/Pressed */}
          <IconDemo
            title="Option 7: Inset/Pressed"
            description="Icon appears pressed into the surface. Light from bottom-right."
          >
            <TestIcon Icon={TrendingUp} style={iconStyle7} />
            <TestIcon Icon={Award} style={iconStyle7} />
            <TestIcon Icon={Crown} style={iconStyle7} />
          </IconDemo>

          {/* Option 8: Long Shadow */}
          <IconDemo
            title="Option 8: Neon + Long Shadow"
            description="Neon glow with dramatic extended diagonal shadow for depth."
          >
            <TestIcon Icon={DollarSign} style={iconStyle8} />
            <TestIcon Icon={Users} style={iconStyle8} />
            <TestIcon Icon={Brain} style={iconStyle8} />
          </IconDemo>

          {/* Option 9: Chrome/Metallic */}
          <IconDemo
            title="Option 9: Chrome/Metallic"
            description="Reflective chrome look with highlight on top and shadow below."
          >
            <TestIcon Icon={Briefcase} style={iconStyle9} />
            <TestIcon Icon={TrendingUp} style={iconStyle9} />
            <TestIcon Icon={Award} style={iconStyle9} />
          </IconDemo>

          {/* Option 10: Minimal 3D */}
          <IconDemo
            title="Option 10: Minimal 3D"
            description="Clean and fast. Just enough depth to feel dimensional. Best for performance."
          >
            <TestIcon Icon={DollarSign} style={iconStyle10} />
            <TestIcon Icon={Users} style={iconStyle10} />
            <TestIcon Icon={Brain} style={iconStyle10} />
          </IconDemo>

        </div>

        {/* Comparison Section */}
        <section className="mt-16 pt-16 border-t border-[#333]">
          <h2 className="text-xl text-[#e5e4dd] text-center mb-8" style={{ fontFamily: 'var(--font-synonym)' }}>
            Side-by-Side Comparison: All 10 Styles
          </h2>
          <div className="flex flex-wrap justify-center gap-6 p-8 rounded-xl bg-white/5 border border-white/10">
            <div className="flex flex-col items-center gap-2">
              <TestIcon Icon={DollarSign} style={iconStyle1} />
              <span className="text-xs text-[#888]">1</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TestIcon Icon={DollarSign} style={iconStyle2} />
              <span className="text-xs text-[#888]">2</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TestIcon Icon={DollarSign} style={iconStyle3} />
              <span className="text-xs text-[#888]">3</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TestIcon Icon={DollarSign} style={iconStyle4} />
              <span className="text-xs text-[#888]">4</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TestIcon Icon={Zap} style={iconStyle5} />
              <span className="text-xs text-[#888]">5</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TestIcon Icon={DollarSign} style={iconStyle6} />
              <span className="text-xs text-[#888]">6</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TestIcon Icon={TrendingUp} style={iconStyle7} />
              <span className="text-xs text-[#888]">7</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TestIcon Icon={DollarSign} style={iconStyle8} />
              <span className="text-xs text-[#888]">8</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TestIcon Icon={Briefcase} style={iconStyle9} />
              <span className="text-xs text-[#888]">9</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TestIcon Icon={DollarSign} style={iconStyle10} />
              <span className="text-xs text-[#888]">10</span>
            </div>
          </div>
        </section>

        {/* Technical Notes */}
        <section className="mt-12 p-6 rounded-xl bg-[#1a1a1a] border border-[#333]">
          <h3 className="text-[#ffd700] font-bold mb-4">Technical Notes</h3>
          <ul className="text-sm text-[#a0a0a0] space-y-2">
            <li><span className="text-[#ffd700]">DOM Count:</span> Each icon = 1 DOM node (SVG element only)</li>
            <li><span className="text-[#ffd700]">Why drop-shadow?</span> <code className="bg-white/10 px-1 rounded">text-shadow</code> only works on text. SVG icons need <code className="bg-white/10 px-1 rounded">filter: drop-shadow()</code></li>
            <li><span className="text-[#ffd700]">Stacking:</span> Multiple drop-shadow() calls stack to create layered effects</li>
            <li><span className="text-[#ffd700]">Performance:</span> Options 4, 10 are fastest (fewer shadow layers)</li>
            <li><span className="text-[#ffd700]">Best Match to H1:</span> Option 1 (Full Neon + Metal) is closest to H1 styling</li>
          </ul>
        </section>

        <footer className="text-center pt-8 text-[#666] text-sm">
          All effects use CSS-only styling. No extra DOM nodes needed.
        </footer>
      </div>
    </main>
  );
}
