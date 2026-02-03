'use client';

import { useState, useEffect, ComponentType, ReactNode } from 'react';

/**
 * Lazy-loaded hero effects for use in Server Components
 *
 * These components load immediately on mount - no delays.
 * Animation starts right away at idle speed.
 */

// Wrapper that loads the component immediately on mount
function ImmediateLoader({
  importFn,
}: {
  importFn: () => Promise<{ default: ComponentType<any> }>;
}) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    // Load immediately on mount
    const loadComponent = async () => {
      try {
        const mod = await importFn();
        setComponent(() => mod.default);
      } catch (err) {
        console.error('Failed to load hero effect:', err);
      }
    };

    loadComponent();
  }, [importFn]);

  if (!Component) return null;

  return <Component />;
}

// Factory to create immediate-loading components
function createImmediateEffect(
  importFn: () => Promise<{ default: ComponentType<any> }>,
  displayName: string
) {
  const ImmediateComponent = () => (
    <ImmediateLoader importFn={importFn} />
  );
  ImmediateComponent.displayName = displayName;
  return ImmediateComponent;
}

export const LazyRevealMaskEffect = createImmediateEffect(
  () => import('@/components/shared/RevealMaskEffect').then(mod => ({ default: mod.RevealMaskEffect })),
  'LazyRevealMaskEffect'
);

export const LazyQuantumGridEffect = createImmediateEffect(
  () => import('./QuantumGridEffect').then(mod => ({ default: mod.QuantumGridEffect })),
  'LazyQuantumGridEffect'
);

export const LazyAsteroidBeltEffect = createImmediateEffect(
  () => import('./AsteroidBeltEffect').then(mod => ({ default: mod.AsteroidBeltEffect })),
  'LazyAsteroidBeltEffect'
);

export const LazyDataStreamEffect = createImmediateEffect(
  () => import('./DataStreamEffect').then(mod => ({ default: mod.DataStreamEffect })),
  'LazyDataStreamEffect'
);

export const LazySatelliteConstellationEffect = createImmediateEffect(
  () => import('./SatelliteConstellationEffect').then(mod => ({ default: mod.SatelliteConstellationEffect })),
  'LazySatelliteConstellationEffect'
);

export const LazyLaserGridEffect = createImmediateEffect(
  () => import('./LaserGridEffect').then(mod => ({ default: mod.LaserGridEffect })),
  'LazyLaserGridEffect'
);

export const LazyGreenLaserGridEffect = createImmediateEffect(
  () => import('./GreenLaserGridEffect').then(mod => ({ default: mod.GreenLaserGridEffect })),
  'LazyGreenLaserGridEffect'
);

export const LazySpiralGalaxyEffect = createImmediateEffect(
  () => import('./SpiralGalaxyEffect').then(mod => ({ default: mod.SpiralGalaxyEffect })),
  'LazySpiralGalaxyEffect'
);

export const LazyConstellationMapEffect = createImmediateEffect(
  () => import('./ConstellationMapEffect').then(mod => ({ default: mod.ConstellationMapEffect })),
  'LazyConstellationMapEffect'
);

export const LazyParticleStormEffect = createImmediateEffect(
  () => import('./ParticleStormEffect').then(mod => ({ default: mod.ParticleStormEffect })),
  'LazyParticleStormEffect'
);

export const LazyNeuralNetworkCloud = createImmediateEffect(
  () => import('./NeuralNetworkCloud').then(mod => ({ default: mod.NeuralNetworkCloud })),
  'LazyNeuralNetworkCloud'
);

export const LazyAuroraNetworkEffect = createImmediateEffect(
  () => import('./AuroraNetworkEffect').then(mod => ({ default: mod.AuroraNetworkEffect })),
  'LazyAuroraNetworkEffect'
);

export const LazyGoldenNexusPortalEffect = createImmediateEffect(
  () => import('./GoldenNexusPortalEffect').then(mod => ({ default: mod.GoldenNexusPortalEffect })),
  'LazyGoldenNexusPortalEffect'
);
