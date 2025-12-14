'use client';

import { useState, useEffect, ComponentType, ReactNode } from 'react';

/**
 * Lazy-loaded hero effects for use in Server Components
 *
 * These components defer loading until after page load to:
 * - Exclude hero effect code from initial JavaScript bundle (Lighthouse treemap)
 * - Load effects after window.onload for better LCP
 * - Improve LCP and reduce TBT in PageSpeed Insights
 */

// Wrapper that defers import until after page load
function DeferredLoader({
  importFn,
  delay = 100,
}: {
  importFn: () => Promise<{ default: ComponentType<any> }>;
  delay?: number;
}) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    // Skip on server
    if (typeof window === 'undefined') return;

    // Wait for page to fully load, then wait additional delay
    const loadComponent = async () => {
      try {
        const mod = await importFn();
        setComponent(() => mod.default);
      } catch (err) {
        console.error('Failed to load hero effect:', err);
      }
    };

    // Use requestIdleCallback for better performance, fallback to setTimeout
    const win = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };

    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => {
        setTimeout(loadComponent, delay);
      }, { timeout: 2000 });
      return () => win.cancelIdleCallback?.(id);
    }

    // Fallback: wait for load event + delay
    if (document.readyState === 'complete') {
      const timeout = setTimeout(loadComponent, delay);
      return () => clearTimeout(timeout);
    }

    const onLoad = () => setTimeout(loadComponent, delay);
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [importFn, delay]);

  if (!Component) return null;

  return <Component />;
}

// Factory to create deferred components
function createDeferredEffect(
  importFn: () => Promise<{ default: ComponentType<any> }>,
  displayName: string
) {
  const DeferredComponent = () => (
    <DeferredLoader importFn={importFn} />
  );
  DeferredComponent.displayName = displayName;
  return DeferredComponent;
}

export const LazyRevealMaskEffect = createDeferredEffect(
  () => import('@/components/shared/RevealMaskEffect').then(mod => ({ default: mod.RevealMaskEffect })),
  'LazyRevealMaskEffect'
);

export const LazyQuantumGridEffect = createDeferredEffect(
  () => import('./QuantumGridEffect').then(mod => ({ default: mod.QuantumGridEffect })),
  'LazyQuantumGridEffect'
);

export const LazyAsteroidBeltEffect = createDeferredEffect(
  () => import('./AsteroidBeltEffect').then(mod => ({ default: mod.AsteroidBeltEffect })),
  'LazyAsteroidBeltEffect'
);

export const LazyDataStreamEffect = createDeferredEffect(
  () => import('./DataStreamEffect').then(mod => ({ default: mod.DataStreamEffect })),
  'LazyDataStreamEffect'
);

export const LazySatelliteConstellationEffect = createDeferredEffect(
  () => import('./SatelliteConstellationEffect').then(mod => ({ default: mod.SatelliteConstellationEffect })),
  'LazySatelliteConstellationEffect'
);

export const LazyLaserGridEffect = createDeferredEffect(
  () => import('./LaserGridEffect').then(mod => ({ default: mod.LaserGridEffect })),
  'LazyLaserGridEffect'
);

export const LazyGreenLaserGridEffect = createDeferredEffect(
  () => import('./GreenLaserGridEffect').then(mod => ({ default: mod.GreenLaserGridEffect })),
  'LazyGreenLaserGridEffect'
);

export const LazySpiralGalaxyEffect = createDeferredEffect(
  () => import('./SpiralGalaxyEffect').then(mod => ({ default: mod.SpiralGalaxyEffect })),
  'LazySpiralGalaxyEffect'
);

export const LazyConstellationMapEffect = createDeferredEffect(
  () => import('./ConstellationMapEffect').then(mod => ({ default: mod.ConstellationMapEffect })),
  'LazyConstellationMapEffect'
);

export const LazyParticleStormEffect = createDeferredEffect(
  () => import('./ParticleStormEffect').then(mod => ({ default: mod.ParticleStormEffect })),
  'LazyParticleStormEffect'
);
