'use client';

import { useContinuousAnimation } from './useContinuousAnimation';

/**
 * Quantum Grid Effect (Digital Horizon)
 * Perspective grid stretching to horizon - great for tech/futuristic themes
 */
export function QuantumGridEffect() {
  const { time, progress } = useContinuousAnimation();

  const gridLines = 24;

  return (
    <>
      {/* Animation container - has overflow-hidden for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hero-effect-layer">
        {/* Perspective grid at TOP extending to 95% */}
        <div
          className="absolute inset-0"
          style={{
            perspective: '500px',
            perspectiveOrigin: '50% 100%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '-50%',
              right: '-50%',
              top: 0,
              height: '95%',
              transform: 'rotateX(-70deg)',
              transformOrigin: 'top center',
            }}
          >
            {/* Horizontal lines - exponential spacing for perspective correction */}
            {[...Array(gridLines)].map((_, i) => {
              // Exponential spacing: more lines near top (horizon), fewer near bottom
              const t = i / (gridLines - 1);
              const y = Math.pow(t, 1.8) * 100; // Power curve for gradual spacing
              const pulseY = progress * 100;
              const pulseHit = Math.abs(y - pulseY) < 8;
              return (
                <div
                  key={`h-${i}`}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `${y}%`,
                    height: pulseHit ? 2 : 1,
                    background: pulseHit
                      ? `rgba(255,215,0,0.8)`
                      : `rgba(255,215,0,${0.15 + (y / 100) * 0.2})`,
                    boxShadow: pulseHit ? '0 0 15px rgba(255,215,0,0.6)' : 'none',
                  }}
                />
              );
            })}
            {/* Vertical lines */}
            {[...Array(gridLines * 2)].map((_, i) => {
              const x = (i / (gridLines * 2)) * 100;
              return (
                <div
                  key={`v-${i}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${x}%`,
                    width: 1,
                    background: `linear-gradient(0deg, rgba(255,215,0,0.05), rgba(255,215,0,0.25))`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Vignette overlay - uses CSS class for immediate rendering */}
      <div className="hero-vignette hero-effect-layer" style={{ zIndex: 1 }} />
    </>
  );
}
