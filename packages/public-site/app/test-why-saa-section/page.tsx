'use client';

import { useState } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';
import { X, Check } from 'lucide-react';

/**
 * Test page for "Why Smart Agent Alliance" section redesigns
 * 5 alternative versions with better hierarchy and compactness
 */

// Shared content
const HEADLINE = "Why Smart Agent Alliance";
const INTRO = "Most eXp sponsors offer little or no ongoing value.";
const SUBHEAD = "SAA was built differently.";
const DESCRIPTION = "We invest in real systems, long-term training, and agent collaboration because our incentives are aligned with agent success.";
const BENEFITS = [
  "No production team structure",
  "No commission splits", 
  "No required recruiting",
  "No required meetings",
];
const TAGLINE = "Just aligned incentives and real support.";
const CTA_TEXT = "See How It Works";

const BRAND_YELLOW = '#ffd700';
const ALIGNED_INCENTIVES_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-aligned-incentives-value-multiplication/public';

// ============================================================================
// VERSION 1: TWO-COLUMN PROBLEM/SOLUTION
// ============================================================================
function Version1() {
  return (
    <section className="py-16 md:py-24 px-6 bg-[#111111]">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="text-center mb-12">
          <H2>{HEADLINE}</H2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Problem Column */}
          <div className="rounded-2xl p-8 bg-red-950/20 border border-red-500/20">
            <h3 className="font-heading text-lg uppercase tracking-wider text-red-400 mb-6">The Problem</h3>
            <p className="text-body text-xl font-semibold mb-6">{INTRO}</p>
            <div className="space-y-3">
              {['Production team requirements', 'Commission splits', 'Mandatory recruiting', 'Required meetings'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-body opacity-70">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Column */}
          <div className="rounded-2xl p-8 border" style={{ backgroundColor: 'rgba(255, 215, 0, 0.08)', borderColor: 'rgba(255, 215, 0, 0.3)' }}>
            <h3 className="font-heading text-lg uppercase tracking-wider mb-6" style={{ color: BRAND_YELLOW }}>SAA Built Different</h3>
            <p className="text-body text-xl font-semibold mb-6" style={{ color: BRAND_YELLOW }}>{SUBHEAD}</p>
            <div className="space-y-3">
              {BENEFITS.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-body">
                  <Check className="w-5 h-5 flex-shrink-0" style={{ color: BRAND_YELLOW }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-body text-lg italic mt-6" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
          </div>
        </div>

        <div className="text-center mt-10">
          <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 2: COMPACT CARD WITH CLEAR SECTIONS
// ============================================================================
function Version2() {
  return (
    <section className="py-16 md:py-24 px-6 bg-[#111111]">
      <div className="mx-auto" style={{ maxWidth: '900px' }}>
        <div className="text-center mb-12">
          <H2>{HEADLINE}</H2>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/8 to-white/3">
          {/* Problem Section */}
          <div className="p-8 border-b border-white/10">
            <h3 className="font-heading text-sm uppercase tracking-wider opacity-50 mb-3">The Industry Problem</h3>
            <p className="text-body text-2xl font-semibold">{INTRO}</p>
          </div>

          {/* Solution Section */}
          <div className="p-8 border-b border-white/10" style={{ backgroundColor: 'rgba(255, 215, 0, 0.05)' }}>
            <h3 className="font-heading text-sm uppercase tracking-wider mb-3" style={{ color: BRAND_YELLOW }}>Our Approach</h3>
            <p className="text-body text-2xl font-semibold" style={{ color: BRAND_YELLOW }}>{SUBHEAD}</p>
            <p className="text-body text-lg mt-4 opacity-80">{DESCRIPTION}</p>
          </div>

          {/* Benefits Grid */}
          <div className="p-8">
            <h3 className="font-heading text-sm uppercase tracking-wider opacity-50 mb-6">What This Means For You</h3>
            <div className="grid grid-cols-2 gap-4">
              {BENEFITS.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Check className="w-5 h-5 flex-shrink-0" style={{ color: BRAND_YELLOW }} />
                  <span className="text-body text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-body text-lg italic mb-6" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
              <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 3: HERO-STYLE WITH BADGES
// ============================================================================
function Version3() {
  return (
    <section className="py-16 md:py-24 px-6 bg-[#111111]">
      <div className="mx-auto text-center" style={{ maxWidth: '900px' }}>
        <H2>{HEADLINE}</H2>
        
        <div className="mt-8 mb-6">
          <p className="text-body text-lg opacity-60 line-through">{INTRO}</p>
        </div>

        <p className="text-body text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND_YELLOW }}>
          {SUBHEAD}
        </p>
        
        <p className="text-body text-xl opacity-80 mb-10 max-w-2xl mx-auto">
          {DESCRIPTION}
        </p>

        {/* Benefit Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {BENEFITS.map((item, i) => (
            <div 
              key={i} 
              className="flex items-center gap-2 px-4 py-2 rounded-full border"
              style={{ borderColor: 'rgba(255, 215, 0, 0.4)', backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
            >
              <Check className="w-4 h-4" style={{ color: BRAND_YELLOW }} />
              <span className="text-body text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>

        <p className="text-body text-xl italic mb-8" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
        <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 4: SIDE-BY-SIDE WITH IMAGE
// ============================================================================
function Version4() {
  return (
    <section className="py-16 md:py-24 px-6 bg-[#111111]">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="text-center mb-12">
          <H2>{HEADLINE}</H2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            {/* The Problem - compact */}
            <div className="mb-8">
              <span className="text-body text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-red-500/20 text-red-400">The Problem</span>
              <p className="text-body text-lg mt-3 opacity-70">{INTRO}</p>
            </div>

            {/* The Solution */}
            <div className="mb-8">
              <span className="text-body text-xs uppercase tracking-wider px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)', color: BRAND_YELLOW }}>Our Solution</span>
              <p className="font-heading text-2xl font-bold mt-3" style={{ color: BRAND_YELLOW }}>{SUBHEAD}</p>
              <p className="text-body mt-3">{DESCRIPTION}</p>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {BENEFITS.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: BRAND_YELLOW }} />
                  <span className="text-body text-sm">{item}</span>
                </div>
              ))}
            </div>

            <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
          </div>

          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ minHeight: '350px' }}>
            <img
              src={ALIGNED_INCENTIVES_IMAGE}
              alt="Aligned incentives"
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-body text-xl italic" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 5: MINIMAL ACCORDION STYLE
// ============================================================================
function Version5() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const sections = [
    {
      title: "The Problem",
      content: INTRO,
      details: "Most sponsors treat sponsorship as a transaction, not a relationship. They get credit for bringing you in, but offer nothing after."
    },
    {
      title: "Our Approach", 
      content: SUBHEAD,
      details: DESCRIPTION
    },
    {
      title: "What You Get",
      content: TAGLINE,
      details: BENEFITS.join(" • ")
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 bg-[#111111]">
      <div className="mx-auto" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-12">
          <H2>{HEADLINE}</H2>
        </div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <div 
              key={i}
              className="rounded-xl border border-white/10 overflow-hidden transition-all duration-300"
              style={i === 1 ? { borderColor: 'rgba(255, 215, 0, 0.3)', backgroundColor: 'rgba(255, 215, 0, 0.05)' } : {}}
            >
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between"
              >
                <div>
                  <p className="text-body text-xs uppercase tracking-wider opacity-50 mb-1">{section.title}</p>
                  <p className="font-heading text-xl font-bold" style={i === 1 ? { color: BRAND_YELLOW } : {}}>
                    {section.content}
                  </p>
                </div>
                <span className="text-2xl opacity-50">{expanded === i ? '−' : '+'}</span>
              </button>
              {expanded === i && (
                <div className="px-6 pb-6">
                  <p className="text-body opacity-80">{section.details}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function TestWhySAASectionPage() {
  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10 px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 justify-center text-sm">
          <a href="#v1" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V1: Two-Column</a>
          <a href="#v2" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V2: Stacked</a>
          <a href="#v3" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V3: Hero+Badges</a>
          <a href="#v4" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V4: Side-by-Side</a>
          <a href="#v5" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V5: Accordion</a>
        </div>
      </div>

      <div id="v1" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V1: Two-Column Problem/Solution</h3>
          <p className="text-body text-sm opacity-50">Clear visual split with red/gold contrast</p>
        </div>
        <Version1 />
      </div>

      <div id="v2" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V2: Stacked Sections</h3>
          <p className="text-body text-sm opacity-50">Single card with clear section dividers</p>
        </div>
        <Version2 />
      </div>

      <div id="v3" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V3: Hero-Style + Badges</h3>
          <p className="text-body text-sm opacity-50">Centered bold statement with badge benefits</p>
        </div>
        <Version3 />
      </div>

      <div id="v4" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V4: Side-by-Side with Image</h3>
          <p className="text-body text-sm opacity-50">Compact text + image with tag labels</p>
        </div>
        <Version4 />
      </div>

      <div id="v5">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V5: Minimal Accordion</h3>
          <p className="text-body text-sm opacity-50">Super compact with expandable details</p>
        </div>
        <Version5 />
      </div>
    </main>
  );
}
