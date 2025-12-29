'use client';

import React from 'react';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds/GlassPanel';

/**
 * Test page with 10 animated neon-lit effects applied to the emerald GlassPanel
 * Each example uses the actual GlassPanel component as the base
 */
export default function TestGlassPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] py-20 px-8">
      <h1 className="text-4xl font-bold text-white text-center mb-4">
        Emerald GlassPanel + Neon Effects
      </h1>
      <p className="text-white/60 text-center mb-12">
        Each uses the actual GlassPanel component with horizontal lines texture
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* 1. Edge Glow Pulse - glowing border that pulses */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">1. Edge Glow Pulse</h2>
          <div
            className="relative"
            style={{ animation: 'edgeGlowPulse 3s ease-in-out infinite' }}
          >
            <GlassPanel variant="emerald">
              <div className="p-8">
                <p className="text-white/80">Border glow pulses outward</p>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* 2. Horizontal Scan Line - light sweeps along the texture lines */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">2. Horizontal Scan Line</h2>
          <div className="relative overflow-hidden rounded-3xl">
            <GlassPanel variant="emerald">
              <div className="p-8 relative">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.4) 50%, transparent 100%)',
                    height: '20px',
                    animation: 'scanLine 2s ease-in-out infinite',
                  }}
                />
                <p className="text-white/80 relative z-10">Light scans down the lines</p>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* 3. Corner Accent Glow - corners light up */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">3. Corner Accent Glow</h2>
          <div className="relative">
            <GlassPanel variant="emerald">
              <div className="p-8 relative">
                <div
                  className="absolute top-0 left-0 w-24 h-24 pointer-events-none rounded-tl-3xl"
                  style={{
                    background: 'radial-gradient(ellipse at top left, rgba(16, 185, 129, 0.5) 0%, transparent 70%)',
                    animation: 'cornerGlow 2s ease-in-out infinite',
                  }}
                />
                <div
                  className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none rounded-br-3xl"
                  style={{
                    background: 'radial-gradient(ellipse at bottom right, rgba(16, 185, 129, 0.5) 0%, transparent 70%)',
                    animation: 'cornerGlow 2s ease-in-out infinite 1s',
                  }}
                />
                <p className="text-white/80 relative z-10">Corners pulse with light</p>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* 4. Vignette Glow - glow coming inward from all edges */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">4. Vignette Glow</h2>
          <div className="relative">
            <GlassPanel variant="emerald">
              <div className="p-8 relative">
                <div
                  className="absolute inset-0 pointer-events-none rounded-3xl"
                  style={{
                    boxShadow: 'inset 0 0 60px 20px rgba(16, 185, 129, 0.3)',
                    animation: 'vignetteGlow 4s ease-in-out infinite',
                  }}
                />
                <p className="text-white/80 relative z-10">Vignette glow from edges</p>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* 5. Neon Border Trace - light traces along border */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">5. Neon Border Trace</h2>
          <div
            className="relative rounded-3xl"
            style={{
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3)',
            }}
          >
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(16, 185, 129, 0.8) 30deg, transparent 60deg)',
                animation: 'borderTrace 3s linear infinite',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'xor',
                padding: '2px',
              }}
            />
            <GlassPanel variant="emerald">
              <div className="p-8">
                <p className="text-white/80">Light traces the border</p>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* 6. Texture Highlight Wave - wave across the texture */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">6. Texture Highlight Wave</h2>
          <div className="relative overflow-hidden rounded-3xl">
            <GlassPanel variant="emerald">
              <div className="p-8 relative">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                    animation: 'waveHighlight 3s ease-in-out infinite',
                  }}
                />
                <p className="text-white/80 relative z-10">Wave highlights texture</p>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* 7. Soft Breathe - entire panel breathes */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">7. Soft Breathe</h2>
          <div
            className="relative"
            style={{ animation: 'softBreathe 4s ease-in-out infinite' }}
          >
            <GlassPanel variant="emerald">
              <div className="p-8">
                <p className="text-white/80">Gentle breathing glow</p>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* 8. Top Edge Shimmer - shimmer along top edge */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">8. Top Edge Shimmer</h2>
          <div className="relative overflow-hidden rounded-3xl">
            <GlassPanel variant="emerald">
              <div className="p-8 relative">
                <div
                  className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.8), rgba(255,255,255,0.4), rgba(16, 185, 129, 0.8), transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'topShimmer 2s ease-in-out infinite',
                  }}
                />
                <p className="text-white/80 relative z-10">Shimmer along top edge</p>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* 9. Dual Edge Glow - top and bottom edges glow alternately */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">9. Dual Edge Glow</h2>
          <div className="relative overflow-hidden rounded-3xl">
            <GlassPanel variant="emerald">
              <div className="p-8 relative">
                <div
                  className="absolute top-0 left-0 right-0 h-8 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.4) 0%, transparent 100%)',
                    animation: 'dualEdge1 3s ease-in-out infinite',
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
                  style={{
                    background: 'linear-gradient(0deg, rgba(16, 185, 129, 0.4) 0%, transparent 100%)',
                    animation: 'dualEdge2 3s ease-in-out infinite',
                  }}
                />
                <p className="text-white/80 relative z-10">Top/bottom edges alternate</p>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* 10. Subtle Flicker - very subtle neon flicker */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">10. Subtle Flicker</h2>
          <div
            className="relative"
            style={{ animation: 'subtleFlicker 0.15s ease-in-out infinite alternate' }}
          >
            <GlassPanel variant="emerald">
              <div className="p-8">
                <p className="text-white/80">Subtle neon flicker</p>
              </div>
            </GlassPanel>
          </div>
        </div>

      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes edgeGlowPulse {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.6)) drop-shadow(0 0 40px rgba(16, 185, 129, 0.3));
          }
        }

        @keyframes scanLine {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(500%); opacity: 0; }
        }

        @keyframes cornerGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes vignetteGlow {
          0%, 100% {
            box-shadow: inset 0 0 60px 20px rgba(16, 185, 129, 0.25);
          }
          50% {
            box-shadow: inset 0 0 80px 30px rgba(16, 185, 129, 0.45);
          }
        }

        @keyframes borderTrace {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes waveHighlight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes softBreathe {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.2));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.4));
          }
        }

        @keyframes topShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes dualEdge1 {
          0%, 100% { opacity: 0.3; }
          25% { opacity: 1; }
          50%, 75% { opacity: 0.3; }
        }

        @keyframes dualEdge2 {
          0%, 25%, 100% { opacity: 0.3; }
          50% { opacity: 0.3; }
          75% { opacity: 1; }
        }

        @keyframes subtleFlicker {
          0%, 18%, 22%, 25%, 53%, 57%, 100% {
            filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.35));
          }
          20%, 24%, 55% {
            filter: drop-shadow(0 0 3px rgba(16, 185, 129, 0.2));
          }
        }
      `}</style>
    </main>
  );
}
