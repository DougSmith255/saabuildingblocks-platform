'use client';

import { useState } from 'react';
import { H1, H2, Tagline, CTAButton, GenericCard } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { ParticleStormEffect } from '@/components/shared/hero-effects/ParticleStormEffect';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'all' | 'crm' | 'hosting' | 'seo' | 'ai' | 'domains' | 'website';

interface Tool {
  name: string;
  description: string;
  howWeUseIt: string;
  priceRange: string;
  category: Category;
  url: string;
  isAffiliate: boolean;
  weUseThis: boolean;
  icon: string;
}

// ─── Filter pill config ───────────────────────────────────────────────────────

const categories: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'crm', label: 'CRM & Marketing' },
  { key: 'hosting', label: 'Hosting' },
  { key: 'seo', label: 'SEO & Analytics' },
  { key: 'ai', label: 'AI' },
  { key: 'domains', label: 'Domains' },
  { key: 'website', label: 'Website' },
];

// ─── Tool data ────────────────────────────────────────────────────────────────
// Affiliate links: Doug will replace these URLs with his affiliate links
// after signing up for each program. Non-affiliate tools use direct URLs.

const tools: Tool[] = [
  {
    name: 'GoHighLevel',
    description: 'All-in-one CRM, funnels, email, SMS, calendar booking, and pipeline management.',
    howWeUseIt: 'Runs our entire pipeline. Calendar bookings, lead nurturing, email campaigns, and contact management. If you only pick one tool, make it this one.',
    priceRange: '$97 - $497/mo',
    category: 'crm',
    url: 'https://www.gohighlevel.com/?fp_ref=smart-agent-alliance',
    isAffiliate: true,
    weUseThis: true,
    icon: '🚀',
  },
  {
    name: 'Hostinger',
    description: 'Fast, affordable VPS and web hosting with excellent uptime.',
    howWeUseIt: 'Our VPS: 4 vCPUs, 16 GB RAM. Handles the admin dashboard, blog, analytics server, and more. Rock-solid uptime at a fraction of AWS pricing.',
    priceRange: '$2.99 - $14.99/mo (shared) | $5.99+/mo (VPS)',
    category: 'hosting',
    url: 'https://hostinger.com?REFERRALCODE=MIDYDOUGMHQG',
    isAffiliate: true,
    weUseThis: true,
    icon: '🖥️',
  },
  {
    name: 'Rank Math SEO',
    description: 'Powerful WordPress SEO plugin with AI-assisted optimization.',
    howWeUseIt: 'On our WordPress blog with 243+ articles. Handles meta tags, XML sitemaps, structured data, and content analysis. The Pro version is worth every penny.',
    priceRange: 'Free / $6.99+/mo (Pro)',
    category: 'seo',
    url: 'https://rankmath.com/', // Replace with affiliate link
    isAffiliate: true,
    weUseThis: true,
    icon: '📈',
  },
  {
    name: 'Claude (Anthropic)',
    description: 'Advanced AI assistant for writing, analysis, coding, and strategy.',
    howWeUseIt: 'Daily for content creation, code review, strategy brainstorming, and research. Claude helped build this entire website and writes alongside us every day.',
    priceRange: 'Free / $20/mo (Pro) / $100/mo (Max)',
    category: 'ai',
    url: 'https://claude.ai/',
    isAffiliate: false,
    weUseThis: true,
    icon: '🧠',
  },
  {
    name: 'Namecheap',
    description: 'Affordable domain registration, SSL certificates, and DNS management.',
    howWeUseIt: 'Where we register and manage our domains. Straightforward pricing, no hidden upsells, and the DNS management is clean.',
    priceRange: '$5.98+/yr (domains)',
    category: 'domains',
    url: 'https://www.namecheap.com/', // Replace with affiliate link
    isAffiliate: true,
    weUseThis: true,
    icon: '🌐',
  },
  {
    name: 'Plausible Analytics',
    description: 'Privacy-focused, lightweight web analytics. No cookies, GDPR compliant.',
    howWeUseIt: 'Self-hosted on our VPS for complete data ownership. Lightweight script, no cookie banners needed, and the dashboard is beautifully simple.',
    priceRange: '$9+/mo (cloud) / Free (self-hosted)',
    category: 'seo',
    url: 'https://plausible.io/',
    isAffiliate: false,
    weUseThis: true,
    icon: '📊',
  },
  {
    name: 'WordPress',
    description: 'The world\'s most popular content management system for blogs and websites.',
    howWeUseIt: 'Powers our Agent Success Hub blog. Flexible, extensible, and battle-tested. Paired with Rank Math and ACF, it handles everything we throw at it.',
    priceRange: 'Free (self-hosted) / $4+/mo (WordPress.com)',
    category: 'website',
    url: 'https://wordpress.com/', // Replace with affiliate link
    isAffiliate: true,
    weUseThis: true,
    icon: '📝',
  },
  {
    name: 'Cloudflare',
    description: 'CDN, DNS, DDoS protection, tunnels, and video streaming.',
    howWeUseIt: 'CDN for our static site, DNS management, Cloudflare Tunnel for secure VPS access, and Stream for video hosting. The free tier alone is incredible.',
    priceRange: 'Free / $20+/mo (Pro)',
    category: 'hosting',
    url: 'https://www.cloudflare.com/',
    isAffiliate: false,
    weUseThis: true,
    icon: '☁️',
  },
  {
    name: 'Supabase',
    description: 'Open-source Firebase alternative with PostgreSQL, auth, storage, and realtime.',
    howWeUseIt: 'Our database, authentication, and file storage backend. Postgres with a great dashboard, row-level security, and real-time subscriptions.',
    priceRange: 'Free / $25+/mo (Pro)',
    category: 'website',
    url: 'https://supabase.com/',
    isAffiliate: false,
    weUseThis: true,
    icon: '⚡',
  },
  {
    name: 'Canva',
    description: 'Design platform for creating graphics, presentations, and social media content.',
    howWeUseIt: 'Design templates for our freebies, social media graphics, and marketing materials. The agent-specific templates save hours of design work.',
    priceRange: 'Free / $12.99/mo (Pro)',
    category: 'crm',
    url: 'https://www.canva.com/',
    isAffiliate: false,
    weUseThis: true,
    icon: '🎨',
  },
];

// ─── Page component ───────────────────────────────────────────────────────────

export default function SitesAndSoftware() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredTools = activeCategory === 'all'
    ? tools
    : tools.filter((t) => t.category === activeCategory);

  return (
    <main id="main-content">
      {/* Hero Section */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <ParticleStormEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <div className="relative z-10">
              <H1>Doug&apos;s Tool List</H1>
              <Tagline className="mt-4">
                The tools I actually use to build and grow.
              </Tagline>
            </div>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* FTC Disclosure + Filter + Tool Grid */}
      <LazySection height={1200}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1400px] mx-auto">

            {/* FTC Disclosure Banner */}
            <div className="mb-12">
              <GenericCard padding="md">
                <div className="flex gap-4" style={{ borderLeft: '4px solid #ffd700', paddingLeft: '16px', marginLeft: '-24px' }}>
                  <div>
                    <p className="text-body" style={{ opacity: 0.9, fontSize: 'var(--font-size-caption)' }}>
                      <strong style={{ color: '#ffd700' }}>Transparency note:</strong>{' '}
                      Some links on this page are affiliate links, meaning I may earn a commission at no extra cost to you if you sign up.
                      I only recommend tools I personally use and pay for.
                      See our <Link href="/disclaimer/" className="underline" style={{ color: '#00ff88' }}>full disclaimer</Link> for details.
                    </p>
                  </div>
                </div>
              </GenericCard>
            </div>

            {/* Section heading */}
            <div className="text-center mb-8">
              <H2>The Stack</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Every tool here runs a piece of Smart Agent Alliance. No filler.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border"
                  style={{
                    fontFamily: 'var(--font-family-menuSubItem)',
                    backgroundColor: activeCategory === cat.key ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    borderColor: activeCategory === cat.key ? '#ffd700' : 'rgba(255, 255, 255, 0.1)',
                    color: activeCategory === cat.key ? '#ffd700' : '#dcdbd5',
                    boxShadow: activeCategory === cat.key ? '0 0 12px rgba(255, 215, 0, 0.2)' : 'none',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tool Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Why These Tools Section */}
      <LazySection height={350}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Why These Tools?</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Three principles behind every recommendation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <GenericCard padding="md" centered className="h-full">
                <h3 className="text-h6 mb-2">Battle-Tested</h3>
                <p className="text-body" style={{ opacity: 0.8 }}>
                  Every tool here runs in production on this site. No theory, no &ldquo;I heard it&apos;s good.&rdquo;
                </p>
              </GenericCard>

              <GenericCard padding="md" centered className="h-full">
                <h3 className="text-h6 mb-2">Agent-First</h3>
                <p className="text-body" style={{ opacity: 0.8 }}>
                  Chosen for real estate workflows, not generic &ldquo;best of&rdquo; lists. These solve agent problems.
                </p>
              </GenericCard>

              <GenericCard padding="md" centered className="h-full">
                <h3 className="text-h6 mb-2">Honest Picks</h3>
                <p className="text-body" style={{ opacity: 0.8 }}>
                  Some links earn me a commission, some don&apos;t. The recommendation is the same either way.
                </p>
              </GenericCard>
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Build Your Business?</H2>
            <p className="text-body mt-4 mb-8">
              Tools are just the start. Join the Alliance and get the strategy behind them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); window.dispatchEvent(new Event('open-join-modal')); }}>
                Join The Alliance
              </CTAButton>
              <CTAButton href="/exp-realty-sponsor/">
                See Team Benefits
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}

// ─── Tool Card (extracted to avoid re-creating on filter) ─────────────────────

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <GenericCard hover padding="md" className="h-full">
      <div className="flex flex-col h-full">
        {/* Header row: icon + name + badge */}
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">{tool.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-h6">{tool.name}</h3>
              {tool.weUseThis && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(255, 215, 0, 0.15)',
                    color: '#ffd700',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                  }}
                >
                  We Use This &#10003;
                </span>
              )}
            </div>
            <p className="text-body mt-1" style={{ opacity: 0.7, fontSize: 'var(--font-size-caption)' }}>
              {tool.description}
            </p>
          </div>
        </div>

        {/* How we use it */}
        <div className="mb-4 flex-1">
          <p className="text-body" style={{ opacity: 0.6, fontSize: 'var(--font-size-caption)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            How we use it
          </p>
          <p className="text-body" style={{ opacity: 0.85 }}>
            {tool.howWeUseIt}
          </p>
        </div>

        {/* Price */}
        <p className="text-body mb-4" style={{ opacity: 0.6, fontSize: 'var(--font-size-caption)' }}>
          {tool.priceRange}
        </p>

        {/* CTA + micro-disclosure */}
        <div>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300"
            style={{
              fontFamily: 'var(--font-family-menuSubItem)',
              fontSize: 'var(--font-size-caption)',
              backgroundColor: tool.isAffiliate ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              color: tool.isAffiliate ? '#ffd700' : '#dcdbd5',
              border: `1px solid ${tool.isAffiliate ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
            }}
          >
            {tool.isAffiliate ? 'Check It Out' : 'Visit Site'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          {tool.isAffiliate && (
            <p className="mt-2" style={{ opacity: 0.4, fontSize: '11px', fontFamily: 'var(--font-family-menuSubItem)' }}>
              Affiliate link
            </p>
          )}
        </div>
      </div>
    </GenericCard>
  );
}
