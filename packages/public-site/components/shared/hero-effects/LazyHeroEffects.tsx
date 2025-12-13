'use client';

import dynamic from 'next/dynamic';

/**
 * Lazy-loaded hero effects for use in Server Components
 *
 * These components use dynamic import with ssr: false to:
 * - Exclude hero effect code from initial JavaScript bundle
 * - Load effects after initial page render
 * - Improve LCP and reduce TBT in PageSpeed Insights
 */

export const LazyRevealMaskEffect = dynamic(
  () => import('@/components/shared/RevealMaskEffect').then(mod => ({ default: mod.RevealMaskEffect })),
  { ssr: false }
);

export const LazyQuantumGridEffect = dynamic(
  () => import('./QuantumGridEffect').then(mod => ({ default: mod.QuantumGridEffect })),
  { ssr: false }
);

export const LazyAsteroidBeltEffect = dynamic(
  () => import('./AsteroidBeltEffect').then(mod => ({ default: mod.AsteroidBeltEffect })),
  { ssr: false }
);

export const LazyDataStreamEffect = dynamic(
  () => import('./DataStreamEffect').then(mod => ({ default: mod.DataStreamEffect })),
  { ssr: false }
);

export const LazySatelliteConstellationEffect = dynamic(
  () => import('./SatelliteConstellationEffect').then(mod => ({ default: mod.SatelliteConstellationEffect })),
  { ssr: false }
);

export const LazyLaserGridEffect = dynamic(
  () => import('./LaserGridEffect').then(mod => ({ default: mod.LaserGridEffect })),
  { ssr: false }
);

export const LazyGreenLaserGridEffect = dynamic(
  () => import('./GreenLaserGridEffect').then(mod => ({ default: mod.GreenLaserGridEffect })),
  { ssr: false }
);

export const LazySpiralGalaxyEffect = dynamic(
  () => import('./SpiralGalaxyEffect').then(mod => ({ default: mod.SpiralGalaxyEffect })),
  { ssr: false }
);

export const LazyConstellationMapEffect = dynamic(
  () => import('./ConstellationMapEffect').then(mod => ({ default: mod.ConstellationMapEffect })),
  { ssr: false }
);

export const LazyParticleStormEffect = dynamic(
  () => import('./ParticleStormEffect').then(mod => ({ default: mod.ParticleStormEffect })),
  { ssr: false }
);
