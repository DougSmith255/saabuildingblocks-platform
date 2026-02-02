/**
 * Shared Hero Effect Components
 *
 * All effects use continuous sine-wave animation that:
 * 1. Intro: Fast animation over 3 seconds
 * 2. Transition: Gradually slows to idle speed (2 seconds)
 * 3. Idle: Continuous animation that never stops (uses sine waves)
 * 4. Scroll: Speeds up when user scrolls
 */

export { useContinuousAnimation } from './useContinuousAnimation';
export { SatelliteConstellationEffect } from './SatelliteConstellationEffect';
export { QuantumGridEffect } from './QuantumGridEffect';
export { LaserGridEffect } from './LaserGridEffect';
export { GreenLaserGridEffect } from './GreenLaserGridEffect';
export { SpiralGalaxyEffect } from './SpiralGalaxyEffect';
export { ConstellationMapEffect } from './ConstellationMapEffect';
export { ParticleStormEffect } from './ParticleStormEffect';
export { AsteroidBeltEffect } from './AsteroidBeltEffect';
export { DataStreamEffect } from './DataStreamEffect';
export { NeuralNetworkCloud } from './NeuralNetworkCloud';
export { StickyHeroWrapper } from './StickyHeroWrapper';
export { DeferredEffect } from './DeferredEffect';
export { RevealMaskEffect } from '../RevealMaskEffect';

// Lazy-loaded hero effects for use in Server Components
export {
  LazyRevealMaskEffect,
  LazyQuantumGridEffect,
  LazyAsteroidBeltEffect,
  LazyDataStreamEffect,
  LazySatelliteConstellationEffect,
  LazyLaserGridEffect,
  LazyGreenLaserGridEffect,
  LazySpiralGalaxyEffect,
  LazyConstellationMapEffect,
  LazyParticleStormEffect,
  LazyNeuralNetworkCloud,
} from './LazyHeroEffects';
