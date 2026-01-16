'use client';

import React from 'react';
import Image from 'next/image';
import { ProfileCyberFrame } from '@saa/shared/components/saa/media/ProfileCyberFrame';

/**
 * Test Page: 5 Premium Author Section Designs
 *
 * Author data:
 * - Doug Smart: Top 1% eXp team builder. Designed and built this website...
 * - Karrie Hill: UC Berkeley Law (top 5%). Built a six-figure real estate business...
 */

// Sample author data - using same image URLs as MeetTheFounders section on home page
const authors = {
  doug: {
    name: 'Doug Smart',
    role: 'Co-Founder, Smart Agent Alliance',
    bio: 'Top 1% eXp team builder. Designed and built this website, the agent portal, and the systems and automations powering production workflows and attraction tools across the organization.',
    image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public',
    profileUrl: 'https://saabuildingblocks.pages.dev/about-doug-smart/',
  },
  karrie: {
    name: 'Karrie Hill',
    role: 'Co-Founder, Smart Agent Alliance',
    bio: 'UC Berkeley Law (top 5%). Built a six-figure real estate business in her first full year without cold calling or door knocking, now helping agents do the same.',
    image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public',
    profileUrl: 'https://saabuildingblocks.pages.dev/about-karrie-hill/',
  },
};

// =============================================================================
// ICON 3D - 3D metal effect for icons
// =============================================================================
function Icon3D({
  children,
  color = '#c4a94d',
  className = '',
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  // Generate highlight and shadow colors
  const adjustColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * percent)));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + Math.round(255 * percent)));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + Math.round(255 * percent)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const darkenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.round((num >> 16) * (1 - percent)));
    const g = Math.max(0, Math.round(((num >> 8) & 0x00FF) * (1 - percent)));
    const b = Math.max(0, Math.round((num & 0x0000FF) * (1 - percent)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const highlight = adjustColor(color, 0.3);
  const midShadow = darkenColor(color, 0.4);

  const filter = `
    drop-shadow(-1px -1px 0 ${highlight})
    drop-shadow(1px 1px 0 ${midShadow})
    drop-shadow(3px 3px 0 #2a2a1d)
    drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5))
  `;

  return (
    <span
      className={`icon-3d ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        filter: filter.trim(),
        transform: 'perspective(500px) rotateX(8deg)',
      }}
    >
      {children}
    </span>
  );
}

// Design 1: Horizontal Card with Metal Plate Accent
function AuthorDesign1({ author }: { author: typeof authors.doug }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#ffd700]/20 bg-gradient-to-r from-[#0a0a0a] to-[#151515]">
      {/* Metal accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffd700]/0 via-[#ffd700]/60 to-[#ffd700]/0" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8">
        {/* Photo with gold ring */}
        <div className="relative flex-shrink-0">
          <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-[#ffd700]/40 shadow-[0_0_20px_rgba(255,215,0,0.15)]">
            <Image
              src={author.image}
              alt={author.name}
              width={112}
              height={112}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-[#ffd700]/60 text-xs uppercase tracking-wider mb-1">About the Author</p>
          <h3 className="text-2xl font-bold text-[#e5e4dd] mb-1" style={{ fontFamily: 'var(--font-taskor, sans-serif)' }}>
            {author.name}
          </h3>
          <p className="text-[#ffd700] text-sm mb-3">{author.role}</p>
          <p className="text-[#bfbdb0] text-sm leading-relaxed mb-4">{author.bio}</p>
          <a
            href={author.profileUrl}
            className="inline-flex items-center gap-2 text-[#ffd700] text-sm hover:text-[#fff] transition-colors"
          >
            More About {author.name.split(' ')[0]}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Design 2: Centered Elegant with Glow Effect
function AuthorDesign2({ author }: { author: typeof authors.doug }) {
  return (
    <div className="relative text-center py-10 px-6">
      {/* Top divider */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#ffd700]/40" />
        <span className="text-[#ffd700]/60 text-xs uppercase tracking-widest">About the Author</span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#ffd700]/40" />
      </div>

      {/* Photo with glow */}
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 rounded-full bg-[#ffd700]/20 blur-xl scale-110" />
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#ffd700]/30">
          <Image
            src={author.image}
            alt={author.name}
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-3xl font-bold text-[#e5e4dd] mb-2" style={{ fontFamily: 'var(--font-taskor, sans-serif)' }}>
        {author.name}
      </h3>
      <p className="text-[#ffd700] text-sm mb-4">{author.role}</p>
      <p className="text-[#bfbdb0] text-sm leading-relaxed max-w-lg mx-auto mb-6">{author.bio}</p>

      {/* CTA Button */}
      <a
        href={author.profileUrl}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-sm font-medium hover:bg-[#ffd700]/20 hover:border-[#ffd700]/50 transition-all"
      >
        Learn More About {author.name.split(' ')[0]}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
    </div>
  );
}

// Design 3: Compact Inline with 3D Metal Plate (ENHANCED VERSION)
// - Tagline styling and sizing on names: Taskor, clamp(21px, calc(17.45px + 1.42vw), 60px)
// - Body font styling and sizing on bio: Synonym, clamp(16px, calc(14.91px + 0.44vw), 28px)
// - 3D icon effect on arrow (2x size)
// - Shared ProfileCyberFrame component (size="lg" = 192px)
// - No set width - fills container
function AuthorDesign3({ author, index = 0 }: { author: typeof authors.doug; index?: number }) {
  // Tagline text styling (matches Master Controller Tagline component)
  const taglineTextShadow = `
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8)
  `;
  const taglineFilter = `
    drop-shadow(0 0 0.04em #bfbdb0)
    drop-shadow(0 0 0.08em rgba(191,189,176,0.6))
  `;

  return (
    <div
      className="relative w-full rounded-xl p-6 sm:p-8"
      style={{
        background: 'linear-gradient(180deg, #252525 0%, #1a1a1a 50%, #151515 100%)',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Top highlight */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Photo with shared ProfileCyberFrame (size="lg" = 192px, ~2x original) */}
        <div className="relative flex-shrink-0">
          <ProfileCyberFrame size="lg" index={index}>
            <img
              src={author.image}
              alt={author.name}
              className="object-cover w-full h-full"
            />
          </ProfileCyberFrame>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
            {/* Name with Tagline styling and sizing */}
            <h3
              style={{
                fontFamily: 'var(--font-taskor, sans-serif)',
                fontSize: 'clamp(21px, calc(17.45px + 1.42vw), 60px)',
                lineHeight: 1.4,
                fontWeight: 400,
                fontFeatureSettings: '"ss01" 1',
                color: '#bfbdb0',
                textShadow: taglineTextShadow,
                filter: taglineFilter.trim(),
                textTransform: 'uppercase',
              }}
            >
              {author.name}
            </h3>
          </div>

          {/* Role */}
          <p
            className="mb-3"
            style={{
              fontFamily: 'var(--font-synonym, sans-serif)',
              fontSize: 'clamp(14px, calc(12px + 0.3vw), 18px)',
              color: 'rgba(191,189,176,0.7)',
            }}
          >
            {author.role}
          </p>

          {/* Bio with Body font styling and sizing */}
          <p
            style={{
              fontFamily: 'var(--font-synonym, sans-serif)',
              fontSize: 'clamp(16px, calc(14.91px + 0.44vw), 28px)',
              lineHeight: 1.6,
              color: '#bfbdb0',
            }}
          >
            {author.bio}
          </p>
        </div>

        {/* Arrow link with 3D Icon effect - 2x size (w-24 h-24, icon w-10 h-10) */}
        <a
          href={author.profileUrl}
          className="flex-shrink-0 w-24 h-24 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center hover:bg-[#ffd700]/20 hover:border-[#ffd700]/40 transition-all"
          title={`More about ${author.name}`}
        >
          <Icon3D color="#ffd700">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Icon3D>
        </a>
      </div>
    </div>
  );
}

// Design 4: Split Card with Photo Left, Dark/Light Contrast
function AuthorDesign4({ author }: { author: typeof authors.doug }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#ffd700]/15">
      <div className="flex flex-col md:flex-row">
        {/* Photo side - darker */}
        <div className="relative md:w-1/3 bg-[#0a0a0a] p-6 flex items-center justify-center">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative">
            <div className="w-36 h-36 rounded-lg overflow-hidden border border-[#ffd700]/20 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
              <Image
                src={author.image}
                alt={author.name}
                width={144}
                height={144}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Content side - lighter */}
        <div className="flex-1 bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-6 md:p-8">
          <p className="text-[#ffd700] text-xs uppercase tracking-wider mb-2">Written By</p>
          <h3 className="text-2xl font-bold text-[#e5e4dd] mb-1" style={{ fontFamily: 'var(--font-taskor, sans-serif)' }}>
            {author.name}
          </h3>
          <p className="text-[#bfbdb0]/70 text-sm mb-4">{author.role}</p>
          <p className="text-[#bfbdb0] text-sm leading-relaxed mb-5">{author.bio}</p>

          <a
            href={author.profileUrl}
            className="inline-flex items-center gap-2 text-[#ffd700] text-sm font-medium hover:gap-3 transition-all"
          >
            Read Full Bio
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Design 5: Minimal Quote Style with Signature Feel
function AuthorDesign5({ author }: { author: typeof authors.doug }) {
  return (
    <div className="relative py-10 px-6">
      {/* Top border with gold accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#333]">
        <div className="absolute left-1/2 -translate-x-1/2 -top-px w-20 h-[3px] bg-[#ffd700]" />
      </div>

      <div className="flex flex-col items-center text-center">
        {/* Small photo */}
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#ffd700]/30 mb-4">
          <Image
            src={author.image}
            alt={author.name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Bio as quote */}
        <blockquote className="text-[#bfbdb0] text-base italic leading-relaxed max-w-2xl mb-6">
          "{author.bio}"
        </blockquote>

        {/* Author signature style */}
        <div className="flex flex-col items-center">
          <p className="text-[#ffd700] text-lg font-bold mb-0.5" style={{ fontFamily: 'var(--font-taskor, sans-serif)' }}>
            — {author.name}
          </p>
          <p className="text-[#bfbdb0]/60 text-xs">{author.role}</p>
        </div>

        {/* Subtle link */}
        <a
          href={author.profileUrl}
          className="mt-4 text-[#ffd700]/60 text-xs uppercase tracking-wider hover:text-[#ffd700] transition-colors"
        >
          View Full Profile →
        </a>
      </div>
    </div>
  );
}

// =============================================================================
// H1 LAYER BREAKDOWN - See each glow layer individually
// =============================================================================

// Common H1 base styles (no glow)
const h1BaseStyle = {
  fontFamily: 'var(--font-taskor, sans-serif)',
  fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
  fontWeight: 700,
  color: '#ffd700',
  fontFeatureSettings: '"ss01" 1',
  transform: 'perspective(800px) rotateX(12deg)',
  letterSpacing: '0.02em',
};

// 3D shadow layers (always included as base)
const shadow3D = `
  2px 2px 0 #2a2a2a,
  3px 3px 0 #1a1a1a,
  4px 4px 0 #0f0f0f
`;

// Individual glow layers
const glowLayers = {
  layer1: '0 0 1px #fff',           // tight white core
  layer2: '0 0 2px #fff',           // white core 2
  layer3: '0 0 4px rgba(255,255,255,0.8)',  // white glow
  layer4: '0 0 8px #ffd700',        // gold glow close
  layer5: '0 0 16px rgba(255,215,0,0.6)',   // gold glow medium
  layer6: '0 0 32px rgba(255,215,0,0.3)',   // gold glow far
  dropShadow: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))', // outer drop-shadow filter
};

// Full combined glow (all layers)
const fullGlow = `
  ${glowLayers.layer1},
  ${glowLayers.layer2},
  ${glowLayers.layer3},
  ${glowLayers.layer4},
  ${glowLayers.layer5},
  ${glowLayers.layer6},
  ${shadow3D}
`;

// H1 with NO glow at all (just gold text + 3D shadow)
function H1NoGlow() {
  return (
    <div className="text-center py-6">
      <h1 style={{ ...h1BaseStyle, textShadow: shadow3D }}>
        DOUG SMART
      </h1>
      <p className="text-[#bfbdb0]/60 text-sm mt-4">
        <strong className="text-[#e5e4dd]">BASE:</strong> No glow - just gold text + 3D shadow
      </p>
    </div>
  );
}

// H1 with ONLY Layer 1: tight white core (1px)
function H1Layer1Only() {
  return (
    <div className="text-center py-6">
      <h1 style={{ ...h1BaseStyle, textShadow: `${glowLayers.layer1}, ${shadow3D}` }}>
        DOUG SMART
      </h1>
      <p className="text-[#bfbdb0]/60 text-sm mt-4">
        <strong className="text-[#e5e4dd]">Layer 1:</strong> <code className="text-xs bg-[#222] px-1 rounded">0 0 1px #fff</code> - tight white core
      </p>
    </div>
  );
}

// H1 with ONLY Layer 2: white core 2 (2px)
function H1Layer2Only() {
  return (
    <div className="text-center py-6">
      <h1 style={{ ...h1BaseStyle, textShadow: `${glowLayers.layer2}, ${shadow3D}` }}>
        DOUG SMART
      </h1>
      <p className="text-[#bfbdb0]/60 text-sm mt-4">
        <strong className="text-[#e5e4dd]">Layer 2:</strong> <code className="text-xs bg-[#222] px-1 rounded">0 0 2px #fff</code> - white core 2
      </p>
    </div>
  );
}

// H1 with ONLY Layer 3: white glow (4px)
function H1Layer3Only() {
  return (
    <div className="text-center py-6">
      <h1 style={{ ...h1BaseStyle, textShadow: `${glowLayers.layer3}, ${shadow3D}` }}>
        DOUG SMART
      </h1>
      <p className="text-[#bfbdb0]/60 text-sm mt-4">
        <strong className="text-[#e5e4dd]">Layer 3:</strong> <code className="text-xs bg-[#222] px-1 rounded">0 0 4px rgba(255,255,255,0.8)</code> - white glow
      </p>
    </div>
  );
}

// H1 with ONLY Layer 4: gold glow close (8px)
function H1Layer4Only() {
  return (
    <div className="text-center py-6">
      <h1 style={{ ...h1BaseStyle, textShadow: `${glowLayers.layer4}, ${shadow3D}` }}>
        DOUG SMART
      </h1>
      <p className="text-[#bfbdb0]/60 text-sm mt-4">
        <strong className="text-[#e5e4dd]">Layer 4:</strong> <code className="text-xs bg-[#222] px-1 rounded">0 0 8px #ffd700</code> - gold glow close
      </p>
    </div>
  );
}

// H1 with ONLY Layer 5: gold glow medium (16px)
function H1Layer5Only() {
  return (
    <div className="text-center py-6">
      <h1 style={{ ...h1BaseStyle, textShadow: `${glowLayers.layer5}, ${shadow3D}` }}>
        DOUG SMART
      </h1>
      <p className="text-[#bfbdb0]/60 text-sm mt-4">
        <strong className="text-[#e5e4dd]">Layer 5:</strong> <code className="text-xs bg-[#222] px-1 rounded">0 0 16px rgba(255,215,0,0.6)</code> - gold glow medium
      </p>
    </div>
  );
}

// H1 with ONLY Layer 6: gold glow far (32px)
function H1Layer6Only() {
  return (
    <div className="text-center py-6">
      <h1 style={{ ...h1BaseStyle, textShadow: `${glowLayers.layer6}, ${shadow3D}` }}>
        DOUG SMART
      </h1>
      <p className="text-[#bfbdb0]/60 text-sm mt-4">
        <strong className="text-[#e5e4dd]">Layer 6:</strong> <code className="text-xs bg-[#222] px-1 rounded">0 0 32px rgba(255,215,0,0.3)</code> - gold glow far
      </p>
    </div>
  );
}

// H1 with ONLY Drop Shadow filter (no text-shadow glow)
function H1DropShadowOnly() {
  return (
    <div className="text-center py-6">
      <h1 style={{ ...h1BaseStyle, textShadow: shadow3D, filter: glowLayers.dropShadow }}>
        DOUG SMART
      </h1>
      <p className="text-[#bfbdb0]/60 text-sm mt-4">
        <strong className="text-[#e5e4dd]">Drop Shadow:</strong> <code className="text-xs bg-[#222] px-1 rounded">drop-shadow(0 0 4px rgba(255,215,0,0.8))</code> - outer filter
      </p>
    </div>
  );
}

// H1 with ALL layers (full original)
function H1AllLayers() {
  return (
    <div className="text-center py-6">
      <h1 style={{ ...h1BaseStyle, textShadow: fullGlow, filter: glowLayers.dropShadow }}>
        DOUG SMART
      </h1>
      <p className="text-[#bfbdb0]/60 text-sm mt-4">
        <strong className="text-[#e5e4dd]">ALL LAYERS:</strong> Full original with all glow layers + drop-shadow
      </p>
    </div>
  );
}

export default function TestAuthorDesignsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* H1 LAYER BREAKDOWN SECTION */}
        <h1
          className="text-4xl font-bold text-[#ffd700] mb-4 text-center"
          style={{ fontFamily: 'var(--font-taskor, sans-serif)' }}
        >
          H1 Glow Layer Breakdown
        </h1>
        <p className="text-[#bfbdb0] text-center mb-8">
          Each layer shown individually so you can see what each one contributes.<br />
          Tell me which layers to exclude for your custom combination.
        </p>

        <div className="border border-[#333]/50 rounded-xl mb-8 overflow-hidden">
          <H1NoGlow />
          <div className="h-px bg-[#333]/50" />
          <H1Layer1Only />
          <div className="h-px bg-[#333]/50" />
          <H1Layer2Only />
          <div className="h-px bg-[#333]/50" />
          <H1Layer3Only />
          <div className="h-px bg-[#333]/50" />
          <H1Layer4Only />
          <div className="h-px bg-[#333]/50" />
          <H1Layer5Only />
          <div className="h-px bg-[#333]/50" />
          <H1Layer6Only />
          <div className="h-px bg-[#333]/50" />
          <H1DropShadowOnly />
        </div>

        {/* Full original for comparison */}
        <div className="border-2 border-[#ffd700]/30 rounded-xl mb-20 overflow-hidden">
          <H1AllLayers />
        </div>

        {/* Layer Reference */}
        <div className="mb-20 p-6 rounded-xl bg-[#151515] border border-[#ffd700]/10">
          <h3 className="text-lg font-bold text-[#ffd700] mb-3">Layer Reference</h3>
          <p className="text-sm text-[#bfbdb0]/70 mb-4">The original H1 uses all these layers. Tell me which to REMOVE for a sharper look:</p>
          <ul className="space-y-2 text-sm text-[#bfbdb0] font-mono">
            <li><strong className="text-white">Layer 1:</strong> 0 0 1px #fff <span className="text-[#bfbdb0]/50">— tight white core</span></li>
            <li><strong className="text-white">Layer 2:</strong> 0 0 2px #fff <span className="text-[#bfbdb0]/50">— white core 2</span></li>
            <li><strong className="text-white">Layer 3:</strong> 0 0 4px rgba(255,255,255,0.8) <span className="text-[#bfbdb0]/50">— white glow</span></li>
            <li><strong className="text-white">Layer 4:</strong> 0 0 8px #ffd700 <span className="text-[#bfbdb0]/50">— gold glow close</span></li>
            <li><strong className="text-white">Layer 5:</strong> 0 0 16px rgba(255,215,0,0.6) <span className="text-[#bfbdb0]/50">— gold glow medium</span></li>
            <li><strong className="text-white">Layer 6:</strong> 0 0 32px rgba(255,215,0,0.3) <span className="text-[#bfbdb0]/50">— gold glow far</span></li>
            <li><strong className="text-white">Drop Shadow:</strong> drop-shadow(0 0 4px rgba(255,215,0,0.8)) <span className="text-[#bfbdb0]/50">— outer filter</span></li>
          </ul>
          <p className="text-sm text-[#bfbdb0]/70 mt-4">Example: "Remove layers 5, 6, and drop shadow" or "Keep only layers 1-3"</p>
        </div>

        {/* AUTHOR DESIGNS SECTION */}
        <h1
          className="text-4xl font-bold text-[#ffd700] mb-4 text-center"
          style={{ fontFamily: 'var(--font-taskor, sans-serif)' }}
        >
          Author Section Designs
        </h1>
        <p className="text-[#bfbdb0] text-center mb-16">
          5 premium designs for blog post author sections. Each shown with both authors.
        </p>

        {/* Design 1 */}
        <section className="mb-20">
          <h2 className="text-xl text-[#e5e4dd] mb-2" style={{ fontFamily: 'var(--font-taskor, sans-serif)' }}>
            Design 1: Horizontal Card with Metal Accent
          </h2>
          <p className="text-[#bfbdb0]/60 text-sm mb-6">Clean horizontal layout with subtle gold accent bar</p>
          <div className="space-y-6">
            <AuthorDesign1 author={authors.doug} />
            <AuthorDesign1 author={authors.karrie} />
          </div>
        </section>

        {/* Design 2 */}
        <section className="mb-20">
          <h2 className="text-xl text-[#e5e4dd] mb-2" style={{ fontFamily: 'var(--font-taskor, sans-serif)' }}>
            Design 2: Centered Elegant with Glow
          </h2>
          <p className="text-[#bfbdb0]/60 text-sm mb-6">Centered layout with subtle glow effect and CTA button</p>
          <div className="space-y-12 border border-[#333]/50 rounded-xl">
            <AuthorDesign2 author={authors.doug} />
            <div className="h-px bg-[#333]/50" />
            <AuthorDesign2 author={authors.karrie} />
          </div>
        </section>

        {/* Design 3 */}
        <section className="mb-20">
          <h2 className="text-xl text-[#e5e4dd] mb-2" style={{ fontFamily: 'var(--font-taskor, sans-serif)' }}>
            Design 3: Compact 3D Metal Plate
          </h2>
          <p className="text-[#bfbdb0]/60 text-sm mb-6">Compact inline design with 3D metal plate styling</p>
          <div className="space-y-6">
            <AuthorDesign3 author={authors.doug} />
            <AuthorDesign3 author={authors.karrie} />
          </div>
        </section>

        {/* Design 4 */}
        <section className="mb-20">
          <h2 className="text-xl text-[#e5e4dd] mb-2" style={{ fontFamily: 'var(--font-taskor, sans-serif)' }}>
            Design 4: Split Card Layout
          </h2>
          <p className="text-[#bfbdb0]/60 text-sm mb-6">Photo on left with content on right, dark/light contrast</p>
          <div className="space-y-6">
            <AuthorDesign4 author={authors.doug} />
            <AuthorDesign4 author={authors.karrie} />
          </div>
        </section>

        {/* Design 5 */}
        <section className="mb-20">
          <h2 className="text-xl text-[#e5e4dd] mb-2" style={{ fontFamily: 'var(--font-taskor, sans-serif)' }}>
            Design 5: Minimal Quote Style
          </h2>
          <p className="text-[#bfbdb0]/60 text-sm mb-6">Bio as quote with signature-style name, minimal aesthetic</p>
          <div className="border border-[#333]/50 rounded-xl">
            <AuthorDesign5 author={authors.doug} />
            <div className="h-px bg-[#333]/50" />
            <AuthorDesign5 author={authors.karrie} />
          </div>
        </section>

        {/* Summary */}
        <div className="mt-16 p-6 rounded-xl bg-[#151515] border border-[#ffd700]/10">
          <h3 className="text-lg font-bold text-[#ffd700] mb-3">Design Summary</h3>
          <ul className="space-y-2 text-sm text-[#bfbdb0]">
            <li><strong className="text-[#e5e4dd]">Design 1:</strong> Professional, horizontal, good for wide content areas</li>
            <li><strong className="text-[#e5e4dd]">Design 2:</strong> Elegant, centered, prominent CTA button</li>
            <li><strong className="text-[#e5e4dd]">Design 3:</strong> Compact, 3D effect, good for limited space</li>
            <li><strong className="text-[#e5e4dd]">Design 4:</strong> Bold, split layout, strong visual presence</li>
            <li><strong className="text-[#e5e4dd]">Design 5:</strong> Minimal, quote-style, sophisticated feel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
