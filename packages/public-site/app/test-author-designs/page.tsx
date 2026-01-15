'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Test Page: 5 Premium Author Section Designs
 *
 * Author data:
 * - Doug Smart: Top 1% eXp team builder. Designed and built this website...
 * - Karrie Hill: UC Berkeley Law (top 5%). Built a six-figure real estate business...
 */

// Sample author data
const authors = {
  doug: {
    name: 'Doug Smart',
    role: 'Co-Founder, Smart Agent Alliance',
    bio: 'Top 1% eXp team builder. Designed and built this website, the agent portal, and the systems and automations powering production workflows and attraction tools across the organization.',
    image: 'https://imagedelivery.net/aOFwfEzPKv8va-sCfWtOQw/doug-smart-hero-headshot/public',
    profileUrl: 'https://saabuildingblocks.pages.dev/about-doug-smart/',
  },
  karrie: {
    name: 'Karrie Hill',
    role: 'Co-Founder, Smart Agent Alliance',
    bio: 'UC Berkeley Law (top 5%). Built a six-figure real estate business in her first full year without cold calling or door knocking, now helping agents do the same.',
    image: 'https://imagedelivery.net/aOFwfEzPKv8va-sCfWtOQw/karrie-hill-hero-headshot/public',
    profileUrl: 'https://saabuildingblocks.pages.dev/about-karrie-hill/',
  },
};

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

// Design 3: Compact Inline with 3D Metal Plate
function AuthorDesign3({ author }: { author: typeof authors.doug }) {
  return (
    <div
      className="relative rounded-xl p-6 sm:p-8"
      style={{
        background: 'linear-gradient(180deg, #252525 0%, #1a1a1a 50%, #151515 100%)',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Top highlight */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Photo */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#3a3a3a]">
            <Image
              src={author.image}
              alt={author.name}
              width={80}
              height={80}
              className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
            <h3 className="text-xl font-bold text-[#e5e4dd]" style={{ fontFamily: 'var(--font-taskor, sans-serif)' }}>
              {author.name}
            </h3>
            <span className="text-[#ffd700]/60 text-xs">•</span>
            <span className="text-[#bfbdb0]/70 text-sm">{author.role}</span>
          </div>
          <p className="text-[#bfbdb0]/80 text-sm leading-relaxed">{author.bio}</p>
        </div>

        {/* Arrow link */}
        <a
          href={author.profileUrl}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center text-[#ffd700] hover:bg-[#ffd700]/20 hover:border-[#ffd700]/40 transition-all"
          title={`More about ${author.name}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
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

export default function TestAuthorDesignsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
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
