'use client';

/**
 * React island wrappers for comparison page.
 * Each exports a React version of a shared component for side-by-side comparison.
 */
import React from 'react';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds/GlassPanel';
import { NeonCard } from '@saa/shared/components/saa/cards/NeonCard';
import { IconCard } from '@saa/shared/components/saa/cards/IconCard';
import { GrainCard } from '@saa/shared/components/saa/cards/GrainCard';
import { GenericCard } from '@saa/shared/components/saa/cards/GenericCard';
import { CyberCard } from '@saa/shared/components/saa/cards/CyberCard';
import { Icon3D } from '@saa/shared/components/saa/icons/Icon3D';
import { SecondaryButton } from '@saa/shared/components/saa/buttons/SecondaryButton';
import { CTAButton } from '@saa/shared/components/saa/buttons/CTAButton';
import { NeonGoldText } from '@saa/shared/components/saa/text/NeonGoldText';
import H1 from '@saa/shared/components/saa/headings/H1';
import H2 from '@saa/shared/components/saa/headings/H2';
import Tagline from '@saa/shared/components/saa/headings/Tagline';

// Simple SVG icon for demos
function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function ReactGlassPanel() {
  return (
    <GlassPanel variant="champagne">
      <div style={{ padding: '2rem' }}>
        <p style={{ color: '#dcdbd5', textAlign: 'center' }}>GlassPanel champagne variant</p>
      </div>
    </GlassPanel>
  );
}

export function ReactGlassPanelEmerald() {
  return (
    <GlassPanel variant="emerald">
      <div style={{ padding: '2rem' }}>
        <p style={{ color: '#dcdbd5', textAlign: 'center' }}>GlassPanel emerald variant</p>
      </div>
    </GlassPanel>
  );
}

export function ReactNeonCard() {
  return (
    <NeonCard>
      <p style={{ color: '#ffd700', fontSize: '1.25rem', fontWeight: 700 }}>Neon Card Title</p>
      <p style={{ color: '#dcdbd5', marginTop: '0.5rem' }}>Card content goes here with pulsing glow.</p>
    </NeonCard>
  );
}

export function ReactGrainCard() {
  return (
    <GrainCard>
      <h3 style={{ color: '#e5e4dd', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Grain Card</h3>
      <p style={{ color: '#dcdbd5', fontSize: '0.875rem' }}>Dark card with grainy noise texture.</p>
    </GrainCard>
  );
}

export function ReactGenericCard() {
  return (
    <GenericCard>
      <h3 style={{ color: '#e5e4dd', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Generic Card</h3>
      <p style={{ color: '#dcdbd5', fontSize: '0.875rem' }}>Premium dark glass styling.</p>
    </GenericCard>
  );
}

export function ReactCyberCard() {
  return (
    <CyberCard>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ffd700' }}>2,900+</div>
      <p style={{ color: '#dcdbd5', marginTop: '0.5rem' }}>Agents Strong</p>
    </CyberCard>
  );
}

export function ReactIconCard() {
  return (
    <IconCard icon={<StarIcon className="w-6 h-6" />} theme="yellow">
      <h3 style={{ color: '#e5e4dd', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Icon Card Yellow</h3>
      <p style={{ color: '#dcdbd5', fontSize: '0.875rem' }}>Card with animated icon ring.</p>
    </IconCard>
  );
}

export function ReactIconCardBlue() {
  return (
    <IconCard icon={<StarIcon className="w-6 h-6" />} theme="blue">
      <h3 style={{ color: '#e5e4dd', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Icon Card Blue</h3>
      <p style={{ color: '#dcdbd5', fontSize: '0.875rem' }}>Card with animated icon ring.</p>
    </IconCard>
  );
}

export function ReactIcon3D() {
  return (
    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
      <Icon3D color="#ffd700" size={48}>
        <StarIcon className="w-12 h-12" />
      </Icon3D>
      <Icon3D color="#00bfff" size={48}>
        <StarIcon className="w-12 h-12" />
      </Icon3D>
      <Icon3D color="#00cc66" size={48}>
        <StarIcon className="w-12 h-12" />
      </Icon3D>
    </div>
  );
}

export function ReactSecondaryButton() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <SecondaryButton href="#">See Full Value Stack</SecondaryButton>
    </div>
  );
}

export function ReactCTAButton() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <CTAButton href="#">Join The Alliance</CTAButton>
    </div>
  );
}

export function ReactNeonGoldText() {
  return (
    <NeonGoldText as="h3" className="text-h3">Premium Gold Title</NeonGoldText>
  );
}

export function ReactH1() {
  return <H1>For Agents Who Want More</H1>;
}

export function ReactH2Default() {
  return <H2>Why Smart Agent Alliance</H2>;
}

export function ReactH2Gold() {
  return <H2 theme="gold">Built for the Future</H2>;
}

export function ReactTagline() {
  return <Tagline>The Alliance Advantage</Tagline>;
}
