'use client';

import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';
import { CyberCard, CyberCardGold } from '@saa/shared/components/saa/cards';
import { Globe, Users, TrendingUp, MapPin, Check } from 'lucide-react';

/**
 * Test page for "Proven at Scale" section designs
 * 5 alternative versions using CyberCard master controller components
 */

// Shared content
const HEADLINE = "Proven at Scale";
const STATS = [
  { value: "3,700+", label: "Agents supported globally", icon: Users },
  { value: "#1", label: "Fastest-growing sponsor org at eXp", icon: TrendingUp },
  { value: "Strong", label: "Consistently high agent retention", icon: Check },
  { value: "Global", label: "U.S., Canada, Mexico, Australia & beyond", icon: Globe },
];
const CTA_TEXT = "See What Agents Say";
const BRAND_YELLOW = '#ffd700';

// ============================================================================
// VERSION 1: FOUR CYBER CARDS GRID
// ============================================================================
function Version1() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="text-center mb-12">
          <H2>{HEADLINE}</H2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <CyberCard key={i} padding="lg">
                <Icon className="w-8 h-8 mx-auto mb-3" style={{ color: BRAND_YELLOW }} />
                <p className="font-heading text-2xl md:text-3xl font-bold" style={{ color: BRAND_YELLOW }}>
                  {stat.value}
                </p>
                <p className="text-body text-sm mt-2 opacity-80">{stat.label}</p>
              </CyberCard>
            );
          })}
        </div>

        <div className="text-center">
          <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 2: SINGLE CYBER CARD GOLD WITH LIST
// ============================================================================
function Version2() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '800px' }}>
        <CyberCardGold padding="xl">
          <H2 className="mb-8">{HEADLINE}</H2>

          <div className="space-y-4 text-left mb-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: BRAND_YELLOW }} />
                  </div>
                  <div>
                    <span className="font-heading text-xl font-bold" style={{ color: BRAND_YELLOW }}>
                      {stat.value}
                    </span>
                    <span className="text-body ml-2">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
        </CyberCardGold>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 3: HERO STAT + CYBER CARDS
// ============================================================================
function Version3() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="text-center mb-12">
          <H2>{HEADLINE}</H2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Hero stat - large gold card */}
          <CyberCardGold padding="xl" className="md:row-span-2">
            <Users className="w-16 h-16 mx-auto mb-4" style={{ color: BRAND_YELLOW }} />
            <p className="font-heading text-5xl md:text-6xl font-bold" style={{ color: BRAND_YELLOW }}>
              3,700+
            </p>
            <p className="text-body text-lg mt-3">Agents supported globally</p>
          </CyberCardGold>

          {/* Smaller cyber cards */}
          {STATS.slice(1).map((stat, i) => {
            const Icon = stat.icon;
            return (
              <CyberCard key={i} padding="md">
                <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: BRAND_YELLOW }} />
                <p className="font-heading text-xl font-bold" style={{ color: BRAND_YELLOW }}>
                  {stat.value}
                </p>
                <p className="text-body text-sm mt-1 opacity-80">{stat.label}</p>
              </CyberCard>
            );
          })}
        </div>

        <div className="text-center">
          <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 4: TWO-COLUMN LAYOUT
// ============================================================================
function Version4() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left - Content */}
          <div>
            <H2 className="text-left mb-8">{HEADLINE}</H2>

            <div className="space-y-4 mb-8">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <Icon className="w-6 h-6 flex-shrink-0" style={{ color: BRAND_YELLOW }} />
                    <p className="text-body">
                      <span className="font-heading font-bold" style={{ color: BRAND_YELLOW }}>
                        {stat.value}
                      </span>
                      {' — '}{stat.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
          </div>

          {/* Right - Featured Cyber Card */}
          <CyberCardGold padding="xl">
            <Globe className="w-20 h-20 mx-auto mb-4" style={{ color: BRAND_YELLOW }} />
            <p className="font-heading text-5xl font-bold" style={{ color: BRAND_YELLOW }}>
              3,700+
            </p>
            <p className="text-body text-lg mt-2">Agents Strong</p>
            <p className="text-body text-sm mt-4 opacity-70">
              One of the fastest-growing sponsor-aligned organizations at eXp Realty
            </p>
          </CyberCardGold>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 5: HORIZONTAL CARDS WITH MAP BACKGROUND
// ============================================================================
function Version5() {
  return (
    <section className="py-16 md:py-24 px-6 relative">
      {/* Subtle world map background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50'%3E%3Ccircle cx='20' cy='25' r='8' fill='%23ffd700'/%3E%3Ccircle cx='50' cy='20' r='10' fill='%23ffd700'/%3E%3Ccircle cx='75' cy='28' r='7' fill='%23ffd700'/%3E%3Ccircle cx='85' cy='35' r='5' fill='%23ffd700'/%3E%3C/svg%3E")`,
          backgroundSize: '400px',
          backgroundPosition: 'center',
        }}
      />

      <div className="mx-auto relative" style={{ maxWidth: '1100px' }}>
        <div className="text-center mb-12">
          <H2>{HEADLINE}</H2>
        </div>

        {/* Horizontal scrolling on mobile */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible mb-10">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex-shrink-0 w-64 md:w-auto">
                <CyberCard padding="md">
                  <div className="flex items-center gap-3 md:flex-col md:text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)' }}
                    >
                      <Icon className="w-6 h-6" style={{ color: BRAND_YELLOW }} />
                    </div>
                    <div className="md:mt-3">
                      <p className="font-heading text-xl font-bold" style={{ color: BRAND_YELLOW }}>
                        {stat.value}
                      </p>
                      <p className="text-body text-sm opacity-80">{stat.label}</p>
                    </div>
                  </div>
                </CyberCard>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <CyberCardGold padding="lg" className="inline-block">
            <p className="text-body text-lg mb-4">Ready to join the fastest-growing sponsor team?</p>
            <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
          </CyberCardGold>
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
          <a href="#v1" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V1: 4-Card Grid</a>
          <a href="#v2" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V2: Gold Card List</a>
          <a href="#v3" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V3: Hero + Cards</a>
          <a href="#v4" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V4: Two-Column</a>
          <a href="#v5" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V5: Horizontal</a>
        </div>
      </div>

      <div id="v1" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V1: Four CyberCards Grid</h3>
          <p className="text-body text-sm opacity-50">Clean grid with icons and stats</p>
        </div>
        <Version1 />
      </div>

      <div id="v2" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V2: Single CyberCardGold with List</h3>
          <p className="text-body text-sm opacity-50">Premium gold border with icon list</p>
        </div>
        <Version2 />
      </div>

      <div id="v3" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V3: Hero Stat + Smaller Cards</h3>
          <p className="text-body text-sm opacity-50">Large featured stat with supporting cards</p>
        </div>
        <Version3 />
      </div>

      <div id="v4" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V4: Two-Column Layout</h3>
          <p className="text-body text-sm opacity-50">Content left, featured card right</p>
        </div>
        <Version4 />
      </div>

      <div id="v5">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V5: Horizontal Cards</h3>
          <p className="text-body text-sm opacity-50">Mobile-friendly scrolling cards</p>
        </div>
        <Version5 />
      </div>
    </main>
  );
}
